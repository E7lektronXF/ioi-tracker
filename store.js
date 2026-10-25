// Veri katmanı. İki kip:
//  - supabase: kayıtlar Supabase'de, cihazlar arası senkron. Çevrimdışıyken yazılanlar kuyrukta bekler.
//  - demo: config.js boşsa ya da ?demo varsa; örnek veri, sadece bu tarayıcıda.
//
// Tablolar (şema değişmedi, bkz. schema.sql):
//  - topic_status: 'task:<hafta>.<gün>' satırları = plan görevlerinin bitti durumu (updated_at = bitirme anı)
//  - sessions: eski oturum kayıtları + park kayıtları (topic = 'park:task:<hafta>.<gün>',
//    day = park tarihi, exam_code = dönüş tarihi ya da null, note = sebep)
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { PLAN } from './plan.js';
import { LS, iso, addDays, diffDays } from './util.js';

const COLS = 'id,day,line,topic,minutes,correct,wrong,total,exam_code,err,note,created_at';

export async function createStore({ demo, demoToday }) {
  if (SUPABASE_URL && SUPABASE_KEY && !demo) return supabaseStore();
  return demoStore(demoToday);
}

function emitter() {
  const fns = new Set();
  return { on: (f) => fns.add(f), emit: () => fns.forEach((f) => f()) };
}

const emptyCache = () => ({ sessions: [], topics: {}, topicsAt: {} });

// ---------------------------------------------------------------- Supabase
async function supabaseStore() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'ioi.auth' }
  });
  const ev = emitter();
  let cache = Object.assign(emptyCache(), LS.get('ioi.cache', null) || {});
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
          else if (op.t === 'topic') res = await sb.from('topic_status').upsert({ user_id: user.id, code: op.code, status: op.status, updated_at: op.at || new Date().toISOString() }, { onConflict: 'user_id,code' });
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
        sb.from('topic_status').select('code,status,updated_at')
      ]);
      if (s.error || t.error) throw (s.error || t.error);
      // Sunucu verisi + henüz gönderilemeyen yerel değişiklikler (yerel olan kazanır)
      const pendUp = new Map(queue.filter((q) => q.t === 'upsert').map((q) => [q.row.id, q.row]));
      const pendDel = new Set(queue.filter((q) => q.t === 'delete').map((q) => q.id));
      const ids = new Set(s.data.map((r) => r.id));
      const sessions = s.data.map((r) => pendUp.get(r.id) || r)
        .concat([...pendUp.values()].filter((r) => !ids.has(r.id)))
        .filter((r) => !pendDel.has(r.id));
      const topics = {};
      const topicsAt = {};
      t.data.forEach((r) => { topics[r.code] = r.status; topicsAt[r.code] = r.updated_at; });
      queue.filter((q) => q.t === 'topic').forEach((q) => { topics[q.code] = q.status; topicsAt[q.code] = q.at; });
      cache = { sessions, topics, topicsAt };
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

  const kick = () => { save(); ev.emit(); flush().then((ok) => ok && setStatus('ok')); };

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
      cache = emptyCache();
      queue = [];
      save();
      ev.emit();
    },
    // Ekle ya da aynı id'li satırı değiştir
    put(row) {
      const i = cache.sessions.findIndex((r) => r.id === row.id);
      if (i >= 0) cache.sessions[i] = row; else cache.sessions.push(row);
      queue = queue.filter((q) => !(q.t === 'upsert' && q.row.id === row.id) && !(q.t === 'delete' && q.id === row.id));
      queue.push({ t: 'upsert', row });
      kick();
    },
    remove(id) {
      cache.sessions = cache.sessions.filter((r) => r.id !== id);
      queue = queue.filter((q) => !(q.t === 'upsert' && q.row.id === id));
      queue.push({ t: 'delete', id });
      kick();
    },
    setTopic(code, st) {
      const at = new Date().toISOString();
      cache.topics[code] = st;
      cache.topicsAt[code] = at;
      queue = queue.filter((q) => !(q.t === 'topic' && q.code === code));
      queue.push({ t: 'topic', code, status: st, at });
      kick();
    }
  };
}

// ---------------------------------------------------------------- Demo
function demoStore(demoToday) {
  const ev = emitter();
  let db = LS.get('ioi.demo2', null);
  if (!db || db.seedFor !== demoToday) { db = seed(demoToday); LS.set('ioi.demo2', db); }
  const save = () => LS.set('ioi.demo2', db);
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
    async signOut() { LS.set('ioi.demo2', null); db = seed(demoToday); ev.emit(); },
    put(row) {
      const i = db.sessions.findIndex((r) => r.id === row.id);
      if (i >= 0) db.sessions[i] = row; else db.sessions.push(row);
      save(); ev.emit();
    },
    remove(id) { db.sessions = db.sessions.filter((r) => r.id !== id); save(); ev.emit(); },
    setTopic(code, st) { db.topics[code] = st; db.topicsAt[code] = new Date().toISOString(); save(); ev.emit(); }
  };
}

// Örnek veri: plan günlerinin çoğu zamanında bitmiş, birkaç görev devreden, ikisi parkta
function seed(today) {
  let r = 7;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  const sessions = [];
  const topics = {};
  const topicsAt = {};
  const nW = PLAN.weeks.length;
  const open = [];
  for (let k = 0; ; k++) {
    const s = addDays(PLAN.start, k);
    if (s >= today) break;
    const w = Math.floor(k / 7);
    if (w >= nW) break;
    const p = PLAN.weeks[w].days[k % 7];
    if (!p.h) continue;
    const id = `task:${w}.${k % 7}`;
    if (diffDays(today, s) <= 3 && rnd() < 0.6) { open.push({ id, s }); continue; }
    if (rnd() < 0.08) { open.push({ id, s }); continue; }
    const late = rnd() < 0.25 ? 1 : 0;
    topics[id] = 'done';
    topicsAt[id] = addDays(s, late) + 'T17:30:00Z';
    if (p.line === 'D' && /madencilik/i.test(p.label)) {
      sessions.push({
        id: 'demo-set-' + k, day: s, line: 'D', topic: 'Madencilik seti', minutes: 25,
        correct: Math.min(8, Math.round(2 + w * 0.45 + rnd() * 1.5)), wrong: null, total: 8,
        exam_code: null, err: {}, note: null, created_at: s + 'T18:00:00Z'
      });
    }
  }
  // en eski iki açık görevi park et
  open.slice(0, 2).forEach((o, i) => {
    sessions.push({
      id: 'demo-park-' + i, day: o.s, line: 'T', topic: 'park:' + o.id, minutes: 0,
      correct: null, wrong: null, total: null, exam_code: i ? addDays(today, 4) : null, err: {},
      note: i ? 'Okulda sınav haftası.' : 'Temeli oturmadan anlamadım; sonra döneceğim.',
      created_at: today + 'T10:00:00Z'
    });
  });
  return { seedFor: today, sessions, topics, topicsAt, _iso: iso(new Date()) };
}
