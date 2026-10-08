// Veri katmanı. İki kip:
//  - supabase: kayıtlar Supabase'de, cihazlar arası senkron. Çevrimdışıyken yazılanlar kuyrukta bekler.
//  - demo: config.js boşsa; örnek veri, sadece bu tarayıcıda.
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { PLAN } from './plan.js';
import { LS, addDays, diffDays } from './util.js';

const COLS = 'id,day,line,topic,minutes,correct,wrong,total,exam_code,err,note,created_at';

export async function createStore({ demo, demoToday }) {
  if (SUPABASE_URL && SUPABASE_KEY && !demo) return supabaseStore();
  return demoStore(demoToday);
}

function emitter() {
  const fns = new Set();
  return { on: (f) => fns.add(f), emit: () => fns.forEach((f) => f()) };
}

// ---------------------------------------------------------------- Supabase
async function supabaseStore() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'ioi.auth' }
  });
  const ev = emitter();
  let cache = LS.get('ioi.cache', null) || { sessions: [], topics: {} };
  let queue = LS.get('ioi.queue', []);
  let status = 'ok';
  let lastSync = LS.get('ioi.lastSync', null);
  let user = null;
  let flushing = null;

  const save = () => { LS.set('ioi.cache', cache); LS.set('ioi.queue', queue); };
  const setStatus = (s) => { if (status !== s) { status = s; ev.emit(); } };

  async function flush() {
    if (flushing) return flushing;
    flushing = (async () => {
      while (queue.length && user) {
        const op = queue[0];
        let res;
        try {
          if (op.t === 'upsert') res = await sb.from('sessions').upsert({ ...op.row, user_id: user.id }, { onConflict: 'id' });
          else if (op.t === 'delete') res = await sb.from('sessions').delete().eq('id', op.id);
          else if (op.t === 'topic') res = await sb.from('topic_status').upsert({ user_id: user.id, code: op.code, status: op.status, updated_at: new Date().toISOString() }, { onConflict: 'user_id,code' });
        } catch (e) { res = { error: e }; }
        if (res && res.error) {
          setStatus(navigator.onLine === false || /fetch|network/i.test(String(res.error.message || res.error)) ? 'offline' : 'error');
          console.warn('[senkron]', res.error);
          return false;
        }
        queue.shift();
        save();
        ev.emit();
      }
      return true;
    })();
    try { return await flushing; } finally { flushing = null; }
  }

  async function refresh() {
    if (!user) return;
    setStatus('syncing');
    const ok = await flush();
    if (!ok) return;
    try {
      const [s, t] = await Promise.all([
        sb.from('sessions').select(COLS).order('day', { ascending: true }).limit(10000),
        sb.from('topic_status').select('code,status')
      ]);
      if (s.error || t.error) throw (s.error || t.error);
      // Sunucu verisi + henüz gönderilemeyen yerel değişiklikler
      const pendUp = queue.filter((q) => q.t === 'upsert').map((q) => q.row);
      const pendDel = new Set(queue.filter((q) => q.t === 'delete').map((q) => q.id));
      const ids = new Set(s.data.map((r) => r.id));
      const sessions = s.data.concat(pendUp.filter((r) => !ids.has(r.id))).filter((r) => !pendDel.has(r.id));
      const topics = {};
      t.data.forEach((r) => { topics[r.code] = r.status; });
      queue.filter((q) => q.t === 'topic').forEach((q) => { topics[q.code] = q.status; });
      cache = { sessions, topics };
      lastSync = new Date().toISOString();
      LS.set('ioi.lastSync', lastSync);
      save();
      setStatus('ok');
      ev.emit();
    } catch (e) {
      console.warn('[senkron]', e);
      setStatus(navigator.onLine === false ? 'offline' : 'error');
    }
  }

  const { data } = await sb.auth.getSession();
  user = data.session ? data.session.user : null;
  sb.auth.onAuthStateChange((_e, session) => { user = session ? session.user : null; ev.emit(); });

  return {
    mode: 'supabase',
    get user() { return user; },
    get status() { return status; },
    get pending() { return queue.length; },
    get lastSync() { return lastSync; },
    snapshot: () => cache,
    onChange: ev.on,
    refresh,
    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      user = data.user;
      await refresh();
      return user;
    },
    async signOut() {
      await sb.auth.signOut();
      user = null;
      cache = { sessions: [], topics: {} };
      queue = [];
      save();
      ev.emit();
    },
    add(row) {
      cache.sessions.push(row);
      queue.push({ t: 'upsert', row });
      save(); ev.emit(); flush().then((ok) => ok && setStatus('ok'));
    },
    remove(id) {
      cache.sessions = cache.sessions.filter((r) => r.id !== id);
      const wasPending = queue.some((q) => q.t === 'upsert' && q.row.id === id);
      queue = queue.filter((q) => !(q.t === 'upsert' && q.row.id === id));
      if (!wasPending) queue.push({ t: 'delete', id });
      save(); ev.emit(); flush().then((ok) => ok && setStatus('ok'));
    },
    setTopic(code, st) {
      cache.topics[code] = st;
      queue = queue.filter((q) => !(q.t === 'topic' && q.code === code));
      queue.push({ t: 'topic', code, status: st });
      save(); ev.emit(); flush().then((ok) => ok && setStatus('ok'));
    }
  };
}

// ---------------------------------------------------------------- Demo
function demoStore(demoToday) {
  const ev = emitter();
  let db = LS.get('ioi.demo', null);
  if (!db || db.seedFor !== demoToday) { db = seed(demoToday); LS.set('ioi.demo', db); }
  const save = () => LS.set('ioi.demo', db);
  return {
    mode: 'demo',
    user: { email: 'demo' },
    status: 'ok',
    pending: 0,
    lastSync: null,
    snapshot: () => db,
    onChange: ev.on,
    async refresh() {},
    async signIn() {},
    async signOut() { LS.set('ioi.demo', null); db = seed(demoToday); ev.emit(); },
    add(row) { db.sessions.push(row); save(); ev.emit(); },
    remove(id) { db.sessions = db.sessions.filter((r) => r.id !== id); save(); ev.emit(); },
    setTopic(code, st) { db.topics[code] = st; save(); ev.emit(); }
  };
}

function seed(today) {
  let r = 11;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const sessions = [];
  const topics = {};
  const nW = PLAN.weeks.length;
  const curW = Math.floor(diffDays(today, PLAN.start) / 7);
  for (let k = 0; ; k++) {
    const s = addDays(PLAN.start, k);
    if (s >= today) break;
    const w = Math.floor(k / 7);
    if (w >= nW) break;
    const p = PLAN.weeks[w].days[k % 7];
    if (!p.h || rnd() < 0.1) continue;
    let line = (p.line || 'T')[0];
    if (!'CMGATDKS'.includes(line)) line = 'T';
    const minutes = Math.max(15, Math.round((p.h * 60 * (0.8 + rnd() * 0.3)) / 15) * 15);
    const row = {
      id: 'demo-' + k, day: s, line, topic: p.codes.find((c) => c[0] === line) || p.label,
      minutes, correct: null, wrong: null, total: null, exam_code: null, err: {}, note: null,
      created_at: s + 'T18:00:00Z'
    };
    if (line === 'D' && /madencilik/i.test(p.label)) {
      row.topic = 'Madencilik seti';
      row.total = 8;
      row.correct = Math.min(8, Math.round(2 + w * 0.45 + rnd() * 1.5));
      row.err = { K: Math.round(rnd() * 2), İ: Math.round(rnd() * 2), T: Math.round(rnd() * 1.4), O: Math.round(rnd() * 0.9) };
    }
    sessions.push(row);
  }
  PLAN.weeks.forEach((wk, w) => {
    wk.days.forEach((d) => d.codes.forEach((c) => {
      if (w < curW) topics[c] = 'done';
      else if (w === curW && topics[c] !== 'done') topics[c] = 'doing';
    }));
  });
  return { seedFor: today, sessions, topics };
}
