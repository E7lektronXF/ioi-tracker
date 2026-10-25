import { PLAN } from './plan.js';
import { createStore } from './store.js';
import { iso, parse, addDays, diffDays, dow, clamp, uuid, esc, fmtH, rgba } from './util.js';

// Uygulama süre ölçmez. Tek giriş: plan görevini "bitti" işaretlemek. Bir görev geçici olarak
// park edilebilir (sıradan çıkar, silinmez).

const ACC = '#D4FF3A';
const SAND = '#E3C9A0';
const LINES = {
  C: { n: 'C programlama', c: '#7AA7FF' },
  M: { n: 'Matematik', c: '#FFB547' },
  G: { n: 'Çizge teorisi', c: '#C59BFF' },
  A: { n: 'Algoritma', c: '#5EE0C8' },
  T: { n: 'Tekrar', c: '#8A8F98' },
  D: { n: 'Deneme / set', c: '#FF8A7A' },
  K: { n: 'Kod Atölyesi', c: '#F0D264' },
  S: { n: 'Kurulum', c: '#8A8F98' }
};
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAYS_LONG = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const MON3 = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const NW = PLAN.weeks.length;
const PARK = 'park:';

// Plan görevleri: saat verilmiş her gün bir görev
const TASKS = [];
PLAN.weeks.forEach((wk, w) => wk.days.forEach((d, i) => {
  if (d.h > 0) TASKS.push({ id: `task:${w}.${i}`, week: w, idx: i, date: addDays(PLAN.start, w * 7 + i), ...d });
}));
const TASK_BY_ID = Object.fromEntries(TASKS.map((x) => [x.id, x]));
const TOPIC_CODES = Object.keys(PLAN.topics).sort((a, b) => a[0].localeCompare(b[0]) || +a.slice(1) - +b.slice(1));
// Bir konu, sadece o konuya ayrılmış görevlerin hepsi bitince "bitti" sayılır
// (o konunun tek başına geçtiği görev yoksa: konunun geçtiği tüm görevler)
const TOPIC_ITEMS = {};
for (const c of TOPIC_CODES) {
  const pure = TASKS.filter((x) => x.codes.length === 1 && x.codes[0] === c);
  TOPIC_ITEMS[c] = pure.length ? pure : TASKS.filter((x) => x.codes.includes(c));
}

const params = new URLSearchParams(location.search);
const state = {
  store: null,
  parkFor: null,
  form: { reason: '', when: 'haftasonu', date: '' },
  keep: {}, // bu oturumda bitirilen görevler listede kalsın: id -> etiket
  sheet: null, // 'park' | 'account'
  loginError: '',
  busy: false,
  fakeToday: params.get('today')
};

const $app = document.getElementById('app');
const $sheet = document.getElementById('sheet');

// ---------------------------------------------------------------- yardımcılar
const today = () => state.fakeToday || iso(new Date());
const curWeek = (t) => clamp(Math.floor(diffDays(t, PLAN.start) / 7), 0, NW - 1);
const lineColor = (l) => (LINES[String(l || '')[0]] || LINES.T).c;
const lineLong = (l) => String(l || '').split('+').map((x) => (LINES[x] ? LINES[x].n : x)).join(' + ');
const dShort = (s) => { const d = parse(s); return `${d.getDate()} ${MON3[d.getMonth()]}`; };
const dLong = (s) => `${DAYS_LONG[dow(s)]} ${dShort(s)}`;
const dMid = (s) => `${DAYS[dow(s)]} ${dShort(s)}`;
const badgeOf = (x) => x.codes[0] || x.line || '—';
const localDay = (ts) => (ts ? iso(new Date(ts)) : null);
const isPark = (r) => typeof r.topic === 'string' && r.topic.startsWith(PARK);

function chip(code) {
  const c = lineColor(code);
  return `<span class="code" style="color:${c};background:${rgba(c, 0.14)}">${esc(code)}</span>`;
}

// ---------------------------------------------------------------- türetilmiş veri
function derive() {
  const t = today();
  const snap = state.store.snapshot();
  const all = snap.sessions || [];
  const topics = snap.topics || {};
  const at = snap.topicsAt || {};
  const parks = {};
  for (const r of all) {
    if (!isPark(r)) continue;
    const id = r.topic.slice(PARK.length);
    if (TASK_BY_ID[id]) parks[id] = { row: r, id, parkedOn: r.day, backOn: r.exam_code || null, reason: r.note || '' };
  }
  const done = (id) => topics[id] === 'done';
  const doneDay = (id) => (done(id) ? localDay(at[id]) : null);
  const parkedNow = (id) => !!parks[id] && !done(id) && (!parks[id].backOn || parks[id].backOn > t);
  const returned = (id) => !!parks[id] && !done(id) && !!parks[id].backOn && parks[id].backOn <= t;
  return { t, sessions: all.filter((r) => !isPark(r)), topics, parks, done, doneDay, parkedNow, returned };
}

function todayList(D) {
  const t = D.t, dev = [], ret = [], cur = [];
  for (const x of TASKS) {
    if (D.parkedNow(x.id)) continue;
    const dn = D.done(x.id);
    const keep = state.keep[x.id];
    if (D.returned(x.id) || keep === 'ret') { ret.push({ x, tag: 'ret' }); continue; }
    if (x.date < t) { if (!dn || keep || D.doneDay(x.id) === t) dev.push({ x, tag: 'dev' }); }
    else if (x.date === t) cur.push({ x, tag: '' });
    else if (keep === 'ahead' || (dn && D.doneDay(x.id) === t)) cur.push({ x, tag: 'ahead' });
  }
  return dev.concat(ret, cur);
}

function nextOpen(D, list) {
  const e = list.find((e) => !D.done(e.x.id));
  if (e) return e;
  const x = TASKS.find((x) => x.date > D.t && !D.done(x.id) && !D.parkedNow(x.id));
  return x ? { x, tag: 'future' } : null;
}

function planStatus(D) {
  const t = D.t;
  const first = TASKS.find((x) => !D.done(x.id) && !D.parkedNow(x.id));
  if (!first) return { kind: 'done', big: 'Bitti', unit: '', sub: 'Plandaki bütün görevler bitti' };
  const k = diffDays(first.date, t);
  if (k < 0) return { kind: 'behind', big: `${-k} gün`, unit: 'geride', sub: `${dLong(first.date)} görevi (${badgeOf(first)}) hâlâ açık` };
  if (diffDays(t, PLAN.start) < 0) return { kind: 'even', big: 'Başlamadı', unit: '', sub: `Plan ${dLong(PLAN.start)} başlıyor` };
  if (k >= 2) return { kind: 'ahead', big: `${k - 1} gün`, unit: 'ileride', sub: `Sıradaki görev ${dLong(first.date)} günün` };
  return { kind: 'even', big: 'Planla', unit: 'aynı hizada', sub: k === 0 ? 'Bugünün görevi sırada' : 'Bugüne kadar her şey bitti' };
}

const topicDone = (D, c) => D.topics[c] === 'done' || TOPIC_ITEMS[c].every((x) => D.done(x.id));
const topicParked = (D, c) => TOPIC_ITEMS[c].some((x) => D.parkedNow(x.id));

function lastStudy(D) {
  let last = null;
  const doneTasks = TASKS.filter((x) => D.done(x.id) && D.doneDay(x.id));
  for (const x of doneTasks) { const d = D.doneDay(x.id); if (!last || d > last) last = d; }
  if (!last) return null;
  const n = diffDays(D.t, last);
  return { day: last, ago: n <= 0 ? 'bugün' : n === 1 ? 'dün' : `${n} gün önce`, items: doneTasks.filter((x) => D.doneDay(x.id) === last) };
}

function activeParks(D) {
  return Object.values(D.parks).filter((p) => D.parkedNow(p.id))
    .map((p) => ({ ...p, x: TASK_BY_ID[p.id], days: Math.max(0, diffDays(D.t, p.parkedOn)) }))
    .sort((a, b) => b.days - a.days);
}

function lastSet(D) {
  const sets = D.sessions.filter((r) => r.line === 'D' && r.total > 0 && r.correct != null)
    .sort((a, b) => (a.day + (a.created_at || '')).localeCompare(b.day + (b.created_at || '')));
  if (!sets.length) return null;
  const r = sets[sets.length - 1];
  const net = (r.correct || 0) - (r.wrong || 0) / 4;
  return { big: fmtH(net), sub: `${r.exam_code || r.topic || 'Set'} · ${dShort(r.day)} · ${r.correct} D${r.wrong ? `, ${r.wrong} Y` : ''} / ${r.total}` };
}

// ---------------------------------------------------------------- ikonlar
const I = {
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  park: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.5 16.5v-9h3.25a2.75 2.75 0 0 1 0 5.5H9.5"/></svg>',
  clock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  today: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></svg>',
  stats: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 20v-6M12 20V5M19 20v-10"/></svg>',
  logo: `<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style="transform:rotate(-90deg)"><circle cx="14" cy="14" r="10.5" fill="none" stroke="#26262A" stroke-width="4"/><circle cx="14" cy="14" r="10.5" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round" stroke-dasharray="44 66"/></svg>`
};
I.parkNav = I.park.replace('width="20" height="20"', 'width="24" height="24"');

// ---------------------------------------------------------------- iskelet
function route() {
  const h = location.hash;
  if (h.startsWith('#/park')) return 'park';
  if (h.startsWith('#/istatistik')) return 'stats';
  return 'today';
}

function syncInfo() {
  const st = state.store;
  if (st.mode === 'demo') return { s: 'demo', t: 'Demo' };
  if (st.status === 'syncing') return { s: 'syncing', t: 'Senkronize ediliyor' };
  if (st.status === 'offline') return { s: 'offline', t: st.pending ? `Çevrimdışı · ${st.pending} bekliyor` : 'Çevrimdışı' };
  if (st.status === 'error') return { s: 'error', t: 'Senkron hatası' };
  return { s: 'ok', t: st.pending ? `${st.pending} bekliyor` : 'Senkron' };
}

function navLinks(r, nPark, cls) {
  const badge = nPark ? `<span class="nbadge" aria-label="${nPark} konu parkta">${nPark}</span>` : '';
  return `<a href="#/" class="${cls}" ${r === 'today' ? 'aria-current="page"' : ''}>${cls === 'tab' ? I.today : ''}<span>Bugün</span></a>
    <a href="#/park" class="${cls}" ${r === 'park' ? 'aria-current="page"' : ''}>${cls === 'tab' ? I.parkNav : ''}<span>Park alanı</span>${badge}</a>
    <a href="#/istatistik" class="${cls}" ${r === 'stats' ? 'aria-current="page"' : ''}>${cls === 'tab' ? I.stats : ''}<span>İstatistik</span></a>`;
}

function header(r, nPark, t) {
  const si = syncInfo();
  return `<header class="top">
    <a class="brand" href="#/">${I.logo}<b>IOI Tracker</b><span class="pill">1. Aşama · 2027</span></a>
    <nav class="nav" aria-label="Ana menü">${navLinks(r, nPark, 'nl')}</nav>
    <div class="rail-foot"><b>${Math.max(0, diffDays(PLAN.exam, t))} gün</b><span>sınava</span></div>
    <button type="button" class="sync" data-s="${si.s}" data-action="account" aria-label="Hesap ve senkron: ${esc(si.t)}"><span class="dot"></span><span class="txt">${esc(si.t)}</span></button>
  </header>`;
}

function render() {
  if (!state.store) return;
  if (state.store.mode === 'supabase' && !state.store.user) { $app.innerHTML = viewLogin(); return; }
  const r = route();
  const D = derive();
  const nPark = activeParks(D).length;
  const banner = state.store.mode === 'demo' ? `<div class="banner">Demo modu · örnek veri, sadece bu cihazda.</div>` : '';
  const body = r === 'stats' ? viewStats(D) : r === 'park' ? viewPark(D) : viewToday(D);
  $app.innerHTML = banner + `<div class="shell" data-r="${r}">${header(r, nPark, D.t)}<main>${body}</main>${r === 'today' ? viewSide(D) : ''}</div>` +
    `<nav class="tabbar" aria-label="Sekmeler">${navLinks(r, nPark, 'tab')}</nav>`;
  document.title = { today: 'IOI Tracker', park: 'Park alanı · IOI Tracker', stats: 'İstatistik · IOI Tracker' }[r];
}

// ---------------------------------------------------------------- Bugün
function topline(t) {
  const k = diffDays(t, PLAN.start);
  const wk = k >= 0 && k < NW * 7 ? ` · Hafta ${Math.floor(k / 7)} / ${NW - 1}` : '';
  const d = parse(t);
  return `<div class="topline"><div class="eyebrow">${DAYS_LONG[dow(t)]} · ${d.getDate()} ${MON3[d.getMonth()]}${wk}</div>
    <span class="exam-pill">Sınava ${Math.max(0, diffDays(PLAN.exam, t))} gün</span></div>`;
}

function tagHtml(e, D) {
  const x = e.x;
  if (e.tag === 'dev') return `<span class="tag">Devreden<span>· ${esc(dMid(x.date))}</span></span>`;
  if (e.tag === 'ret') { const p = D.parks[x.id]; return `<span class="tag ret">Parktan döndü${p ? `<span>· ${esc(dShort(p.parkedOn))} park edildi</span>` : ''}</span>`; }
  if (e.tag === 'ahead') return `<span class="tag ahead">İleriden<span>· ${esc(dMid(x.date))}</span></span>`;
  if (e.tag === 'future') return `<span class="tag ahead">${esc(dLong(x.date))}</span>`;
  return '';
}

function rowHtml(e, D) {
  const x = e.x, dn = D.done(x.id), b = badgeOf(x);
  return `<div class="trow${dn ? ' is-done' : ''}">
    <div class="trow-main">
      <div class="trow-t">${chip(b)}<span class="trow-name">${esc(x.label)}</span></div>
      <div class="trow-m">${tagHtml(e, D)}<span class="dur" title="Planlanan süre — ölçülmez, sadece bilgi">${fmtH(x.h)} sa planlı</span>${x.src ? `<span class="src">${esc(x.src)}</span>` : ''}</div>
      <details class="trow-d"><summary>Görevin ayrıntısı</summary><p>${esc(x.task)}</p></details>
    </div>
    <button type="button" class="ib" data-action="park" data-id="${x.id}" title="Park et" aria-label="${esc(b)} ${esc(x.label)}: park et" ${dn ? 'disabled' : ''}>${I.park}</button>
    <button type="button" class="donebtn" data-action="toggle" data-id="${x.id}" data-tag="${e.tag || 'today'}" aria-pressed="${dn}" aria-label="${esc(b)} ${esc(x.label)}: ${dn ? 'bitti, geri almak için dokun' : 'bitti olarak işaretle'}"><span class="box">${dn ? I.check : ''}</span><span class="lbl">Bitti</span></button>
  </div>`;
}

function viewToday(D) {
  const t = D.t;
  const list = todayList(D);
  const ls = lastStudy(D);
  const nx = nextOpen(D, list);
  const nDone = list.filter((e) => D.done(e.x.id)).length;
  const nPark = activeParks(D).length;

  const lastHtml = ls
    ? `<div class="kc-l"><span class="lbl2">Son çalışma</span><div class="kc-day">${esc(dLong(ls.day))} <span>· ${esc(ls.ago)}</span></div></div>
       <div class="kc-l"><span class="lbl2">O gün biten</span><div class="dchips">${ls.items.map((x) => `<span class="dchip">${chip(badgeOf(x))}${esc(x.label)}<i>${I.check}</i></span>`).join('')}</div></div>`
    : `<div class="kc-l"><span class="lbl2">Son çalışma</span><div class="kc-day">Henüz bitmiş görev yok</div></div>`;

  let nextHtml;
  if (nx) {
    const x = nx.x;
    const note = nx.tag === 'dev' ? `Devreden · ${dLong(x.date)}` : nx.tag === 'ret' ? 'Parktan döndü' : nx.tag === 'future' ? `Bugünün listesi bitti · ${dLong(x.date)}` : 'Bugünün görevi';
    nextHtml = `<div class="kc-next">
      <span class="lbl2 acc">Sıradaki konu</span>
      <div class="kn-t">${chip(badgeOf(x))}<span>${esc(note)}</span></div>
      <div class="kn-name">${esc(x.label)}</div>
      <div class="kn-m">${esc(lineLong(x.line))} · ${fmtH(x.h)} sa planlı${x.src ? ' · ' + esc(x.src) : ''}</div>
      <p class="kn-task">${esc(x.task)}</p>
      ${nx.tag === 'future' ? `<button type="button" class="btn btn-sm" data-action="toggle" data-id="${x.id}" data-tag="ahead">${I.check}Şimdiden bitti işaretle</button>` : ''}
    </div>`;
  } else {
    nextHtml = `<div class="kc-next"><span class="lbl2 acc">Sıradaki konu</span><div class="kn-name">Plan tamamlandı</div><div class="kn-m">Sınav sonrası: C++ ve USACO hattı</div></div>`;
  }

  return `<div class="home">
    ${topline(t)}
    <section class="kcard" aria-labelledby="kc-h"><div class="kc-left"><h2 id="kc-h" class="lbl2">Kaldığın yer</h2>${lastHtml}</div>${nextHtml}</section>
    <section class="tlist" aria-labelledby="tl-h">
      <div class="sec-h"><h2 id="tl-h">Bugünün konuları</h2><span>${list.length ? `${list.length} görev · ${nDone} bitti` : ''}</span></div>
      ${list.length ? `<div class="rows">${list.map((e) => rowHtml(e, D)).join('')}</div>` : `<div class="empty">Bugün planda görev yok. Sıradaki görev yukarıda; istersen şimdiden bitirebilirsin.</div>`}
      ${nPark ? `<a class="link-more" href="#/park">Park alanında ${nPark} konu var ${I.arrow}</a>` : ''}
    </section>
    ${weekStrip(D)}
  </div>`;
}

function weekStrip(D) {
  const t = D.t;
  const k = diffDays(t, PLAN.start);
  const w = curWeek(t);
  const cells = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const s = addDays(PLAN.start, w * 7 + i);
    const p = PLAN.weeks[w].days[i];
    const id = p.h > 0 ? `task:${w}.${i}` : null;
    let cls, val, sub, sc;
    if (!id) { cls = 'rest'; val = '—'; sub = 'boş'; sc = '#6E6E76'; }
    else if (D.parkedNow(id)) { cls = 'park'; val = 'park'; sub = badgeOf(TASK_BY_ID[id]); sc = SAND; }
    else {
      const dn = D.done(id);
      val = dn ? '1/1 ✓' : '0/1';
      sub = badgeOf(TASK_BY_ID[id]);
      sc = lineColor(sub);
      cls = dn ? 'full' : s < t ? 'open' : s > t ? 'future' : '';
    }
    if (s === t) cls += ' today';
    const tip = `${DAYS_LONG[i]} ${dShort(s)}${id ? ' · ' + TASK_BY_ID[id].label : ' · görev yok'}`;
    return `<div class="${cls}" title="${esc(tip)}"><span class="dl">${DAYS[i]} <span class="mono">${parse(s).getDate()}</span></span><span class="dv">${val}</span><span class="dc" style="color:${sc}">${esc(sub)}</span></div>`;
  }).join('');
  const range = `${dShort(addDays(PLAN.start, w * 7))}–${dShort(addDays(PLAN.start, w * 7 + 6))}`;
  return `<section class="week" aria-labelledby="wk-h">
    <div class="sec-h"><h2 id="wk-h">Hafta ${k < 0 ? 0 : w} · ${range}</h2><span>biten / planlanan</span></div>
    <div class="strip">${cells}</div>
  </section>`;
}

// iPad yatay: sağ panelde özet
function viewSide(D) {
  const nDone = TOPIC_CODES.filter((c) => topicDone(D, c)).length;
  const ps = planStatus(D);
  const parks = activeParks(D);
  const long = parks.filter((p) => p.days >= 14).length;
  return `<aside class="side" aria-label="Özet">
    <div class="eyebrow">Özet</div>
    <div class="kpi"><span class="k">Biten konu</span><div class="v"><b>${nDone}</b><span>/ ${TOPIC_CODES.length}</span></div><div class="bar"><i style="width:${(nDone / TOPIC_CODES.length * 100).toFixed(1)}%"></i></div></div>
    <div class="side2">
      <div class="kpi"><span class="k">Plana göre</span><div class="v"><b>${esc(ps.big)}</b></div><span class="s">${esc(ps.unit)}</span></div>
      <div class="kpi"><span class="k">Parkta</span><div class="v"><b>${parks.length}</b></div><span class="s" ${long ? `style="color:${SAND}"` : ''}>${long ? `${long} konu 14+ gün` : 'konu'}</span></div>
    </div>
    <div class="card">${linesHtml(D, true)}</div>
  </aside>`;
}

// ---------------------------------------------------------------- Park alanı
function viewPark(D) {
  const parks = activeParks(D);
  const long = parks.filter((p) => p.days >= 14).length;
  const sum = parks.length ? `${parks.length} konu plan sırasından geçici olarak çıkarıldı${long ? ` · ${long} tanesi 14 günden uzun süredir bekliyor` : ''}` : 'Parkta konu yok';
  const cards = parks.map((p) => {
    const x = p.x, lg = p.days >= 14, b = badgeOf(x);
    return `<article class="pcard${lg ? ' long' : ''}">
      <div class="pc-h"><div class="pc-t">${chip(b)}<b>${esc(x.label)}</b></div>${lg ? `<span class="lbadge">${I.clock}14+ gün</span>` : ''}</div>
      <div class="pc-g">
        <div><span>Park tarihi</span><b>${esc(dShort(p.parkedOn))}</b></div>
        <div><span>Parkta</span><b ${lg ? `style="color:${SAND}"` : ''}>${p.days} gün</b></div>
        <div><span>Dönüş</span><b ${p.backOn ? '' : 'class="muted"'}>${p.backOn ? esc(dMid(p.backOn)) : 'Belirsiz'}</b></div>
      </div>
      <div class="pc-r"><span>Sebep</span><p>${p.reason ? `“${esc(p.reason)}”` : '<i class="muted">Sebep yazılmadı</i>'}</p></div>
      <div class="pc-p">Planda: ${esc(dLong(x.date))} · ${fmtH(x.h)} sa${x.src ? ' · ' + esc(x.src) : ''}</div>
      <div class="pc-b">
        <button type="button" class="btn btn-sm acc-o" data-action="park-today" data-id="${x.id}">Bugüne al</button>
        <button type="button" class="btn btn-sm" data-action="park-queue" data-id="${x.id}">Sıraya geri koy</button>
      </div>
    </article>`;
  }).join('');
  return `<div class="parkv">
    <div class="pv-head">
      <div><div class="eyebrow">${esc(dLong(D.t))}</div><h1>Park alanı</h1><p>${esc(sum)}</p></div>
      <div class="pv-help"><b>Bugüne al:</b> konu bugünün listesine eklenir.<br><b>Sıraya geri koy:</b> plandaki yerine döner; günü geçtiyse “Devreden” olur.</div>
    </div>
    ${parks.length ? `<div class="pgrid">${cards}</div>` : `<div class="empty big"><b>Park alanı boş</b><span>Bugün listesindeki P düğmesiyle bir konuyu geçici olarak buraya alabilirsin.</span></div>`}
  </div>`;
}

// ---------------------------------------------------------------- İstatistik
function linesHtml(D, compact) {
  const rows = ['C', 'M', 'G', 'A'].map((L) => {
    const codes = TOPIC_CODES.filter((c) => c[0] === L);
    const n = codes.filter((c) => topicDone(D, c)).length;
    const col = LINES[L].c;
    const pct = codes.length ? (n / codes.length) * 100 : 0;
    return compact
      ? `<div class="lb c"><span class="mono" style="color:${col}">${L}</span><div class="bar"><i style="width:${pct.toFixed(1)}%;background:${col}"></i></div><span class="mono">${n}<span class="muted">/${codes.length}</span></span></div>`
      : `<div class="lb"><div class="lb-t">${chip(L)}<span>${LINES[L].n}</span><b class="mono">${n} <span class="muted">/ ${codes.length}</span></b></div><div class="bar thick"><i style="width:${pct.toFixed(1)}%;background:${col}"></i></div></div>`;
  }).join('');
  return `<div class="fh"><div class="t"><b>Hatlara göre biten konu</b>${compact ? '' : '<span>Her hattın kaç konusu bitti</span>'}</div></div><div class="lbs">${rows}</div>`;
}

function heatHtml(D) {
  const t = D.t;
  const k = diffDays(t, PLAN.start);
  const we = k < 0 ? 0 : curWeek(t);
  const n = we + 1;
  const counts = {};
  for (const x of TASKS) { const d = D.doneDay(x.id); if (d) counts[d] = (counts[d] || 0) + 1; }
  let html = '<div></div>';
  for (let w = 0; w <= we; w++) html += `<span class="hh">${n > 10 && w % 2 ? '' : dShort(addDays(PLAN.start, w * 7))}</span>`;
  for (let i = 0; i < 7; i++) {
    html += `<span class="hl">${DAYS[i]}</span>`;
    for (let w = 0; w <= we; w++) {
      const s = addDays(PLAN.start, w * 7 + i);
      const c = counts[s] || 0;
      let style;
      if (s > t) style = 'background:transparent;border:1px dashed #232327';
      else style = `background:${c >= 2 ? rgba(ACC, 0.85) : c === 1 ? rgba(ACC, 0.4) : '#18181B'};${s === t ? `border-color:${ACC}` : ''}`;
      html += `<div class="cell" style="${style}" title="${dShort(s)} · ${s > t ? 'gelecek' : c ? c + ' görev bitti' : 'görev bitmedi'}"></div>`;
    }
  }
  const legend = [['0', '#18181B'], ['1', rgba(ACC, 0.4)], ['2+', rgba(ACC, 0.85)]].map(([l, c]) => `<span><i class="sw" style="background:${c}"></i>${l}</span>`).join('');
  return `<div class="fh"><div class="t"><b>Çalışma takvimi</b><span>Hücre koyuluğu = o gün biten görev sayısı</span></div><div class="legend">${legend}</div></div>
    <div class="heat"><div class="heat-grid" style="grid-template-columns:36px repeat(${n},minmax(${n > 10 ? 16 : 28}px,1fr))">${html}</div></div>`;
}

function topicMapHtml(D) {
  const groups = ['C', 'M', 'G', 'A'].map((L) => {
    const codes = TOPIC_CODES.filter((c) => c[0] === L);
    const col = LINES[L].c;
    const n = codes.filter((c) => topicDone(D, c)).length;
    const chips = codes.map((c) => {
      const dn = topicDone(D, c), pk = !dn && topicParked(D, c);
      const style = dn ? `background:${rgba(col, 0.14)};border-color:${rgba(col, 0.5)};color:${col}` : pk ? `border:1px dashed ${SAND};color:${col}` : '';
      return `<div class="tchip" style="${style}" title="${esc(PLAN.topics[c])} · ${dn ? 'bitti' : pk ? 'parkta' : 'sırada'}"><b>${c}</b><span>${esc(PLAN.topics[c])}</span><i style="color:${dn ? col : SAND}">${dn ? '✓' : pk ? 'P' : ''}</i></div>`;
    }).join('');
    return `<div class="tg"><div class="tg-h">${LINES[L].n}<span class="c">${n} / ${codes.length}</span></div><div class="tchips">${chips}</div></div>`;
  }).join('');
  const legend = `<span><i class="sw" style="background:rgba(237,237,239,.18);border:1px solid rgba(237,237,239,.5)"></i>Bitti</span><span><i class="sw" style="border:1px dashed ${SAND}"></i>Parkta (P)</span><span><i class="sw" style="border:1px solid #2E2E33"></i>Sırada</span>`;
  return `<div class="fh"><div class="t"><b>Konu haritası</b><span>Bir konu, ona ayrılmış görevlerin hepsi bitince “bitti” sayılır</span></div><div class="legend">${legend}</div></div><div class="tgs">${groups}</div>`;
}

function viewStats(D) {
  const t = D.t;
  const k = diffDays(t, PLAN.start);
  const nDone = TOPIC_CODES.filter((c) => topicDone(D, c)).length;
  const N = TOPIC_CODES.length;
  const ps = planStatus(D);
  const parks = activeParks(D);
  const long = parks.filter((p) => p.days >= 14);
  const set = lastSet(D);
  const tasksDone = TASKS.filter((x) => D.done(x.id)).length;
  return `<div class="stats">
    <div class="stats-head">
      <div><div class="eyebrow">${dShort(PLAN.start)} → ${dShort(t)}${k >= 0 ? ` · Hafta ${curWeek(t)} / ${NW - 1}` : ''}</div><h1>İstatistik</h1></div>
      <span class="exam-pill">${N} konu · ${TASKS.length} görev · sınav ${dShort(PLAN.exam)}</span>
    </div>
    <div class="kpis">
      <div class="kpi"><span class="k">Biten konu</span><div class="v"><b>${nDone}</b><span>/ ${N}</span></div><div class="bar"><i style="width:${(nDone / N * 100).toFixed(1)}%"></i></div><span class="s">${tasksDone} / ${TASKS.length} görev bitti</span></div>
      <div class="kpi"><span class="k">Plana göre durum</span><div class="v"><b>${esc(ps.big)}</b><span>${esc(ps.unit)}</span></div><span class="s">${esc(ps.sub)}</span></div>
      <div class="kpi"><span class="k">Parktaki konu</span><div class="v"><b>${parks.length}</b><span>konu</span></div><span class="s">${parks.length ? parks.map((p) => badgeOf(p.x)).join(' · ') : 'Park alanı boş'}${long.length ? ` — <span style="color:${SAND}">${long.length} konu 14+ gün</span>` : ''}</span></div>
      <div class="kpi"><span class="k">Son set</span><div class="v"><b>${set ? set.big : '—'}</b>${set ? '<span>net</span>' : ''}</div><span class="s">${set ? esc(set.sub) : 'Henüz set sonucu yok'}</span></div>
    </div>
    <div class="row">
      <figure class="card wh">${linesHtml(D, false)}</figure>
      <figure class="card wh">${heatHtml(D)}</figure>
    </div>
    <figure class="card">${topicMapHtml(D)}</figure>
  </div>`;
}

// ---------------------------------------------------------------- Giriş
function viewLogin() {
  return `<div class="login"><form data-login>
    ${I.logo}
    <h1>IOI Tracker</h1>
    <p>Supabase'de oluşturduğun kullanıcıyla giriş yap. Her cihazda bir kez yeterli.</p>
    <div class="field"><label for="l-email">E-posta</label><input class="inp" id="l-email" name="email" type="email" autocomplete="username" required></div>
    <div class="field"><label for="l-pw">Şifre</label><input class="inp" id="l-pw" name="password" type="password" autocomplete="current-password" required></div>
    ${state.loginError ? `<div class="form-error" role="alert">${esc(state.loginError)}</div>` : ''}
    <button type="submit" class="btn btn-primary block" ${state.busy ? 'disabled' : ''}>${state.busy ? 'Giriş yapılıyor…' : 'Giriş yap'}</button>
  </form></div>`;
}

// ---------------------------------------------------------------- Park et (sheet / popover)
function nextSaturday(t) { let k = (5 - dow(t) + 7) % 7; if (k === 0) k = 7; return addDays(t, k); }
function backOnFrom(f, t) {
  if (f.when === 'yarin') return addDays(t, 1);
  if (f.when === 'haftasonu') return nextSaturday(t);
  if (f.when === 'tarih') return f.date && f.date > t ? f.date : addDays(t, 1);
  return null;
}

function sheetPark() {
  const x = TASK_BY_ID[state.parkFor];
  const f = state.form;
  const t = today();
  const opts = [
    ['yarin', 'Yarın', dMid(addDays(t, 1))],
    ['haftasonu', 'Hafta sonu', dMid(nextSaturday(t))],
    ['tarih', 'Tarih seç', f.date ? dMid(f.date) : 'gün seç'],
    ['belirsiz', 'Belirsiz', 'elle alırsın']
  ];
  const bo = backOnFrom(f, t);
  return `<form class="sheet" data-park novalidate>
    <div class="grab"></div>
    <div class="sheet-head"><h2 id="sheet-title">Park et</h2><button type="button" class="icon-btn" data-action="close-sheet" aria-label="Kapat">${I.x}</button></div>
    <div class="ptopic">${chip(badgeOf(x))}<div><b>${esc(x.label)}</b><span>${esc(dMid(x.date))} · ${fmtH(x.h)} sa planlı${x.src ? ' · ' + esc(x.src) : ''}</span></div></div>
    <p class="hint">Konu silinmez; plan sırasından geçici olarak çıkar.</p>
    <div class="field"><label for="p-reason">Sebep <span class="muted">(isteğe bağlı)</span></label><input class="inp" id="p-reason" name="reason" type="text" maxlength="140" autocomplete="off" value="${esc(f.reason)}" placeholder="ör. Önce kombinasyonu oturtayım"></div>
    <fieldset class="field"><legend>Ne zaman dönsün</legend>
      <div class="when">${opts.map(([v, l, s]) => `<button type="button" data-action="when" data-v="${v}" aria-pressed="${f.when === v}"><b>${l}</b><span>${esc(s)}</span></button>`).join('')}</div>
      ${f.when === 'tarih' ? `<input class="inp" type="date" name="date" aria-label="Dönüş tarihi" min="${addDays(t, 1)}" value="${esc(f.date)}">` : ''}
      <span class="hint">Dönüş: <b>${bo ? esc(dLong(bo)) : 'Belirsiz — Park alanından elle geri alırsın'}</b></span>
    </fieldset>
    <div class="sheet-btns"><button type="button" class="btn" data-action="close-sheet">Vazgeç</button><button type="submit" class="btn btn-primary">Park et</button></div>
  </form>`;
}

function sheetAccount() {
  const st = state.store;
  const si = syncInfo();
  const last = st.lastSync ? new Date(st.lastSync) : null;
  return `<div class="sheet">
    <div class="grab"></div>
    <div class="sheet-head"><h2 id="sheet-title">Hesap</h2><button type="button" class="icon-btn" data-action="close-sheet" aria-label="Kapat">${I.x}</button></div>
    <div class="acct">
      ${st.mode === 'demo' ? `<span><b>Demo modu.</b> Veriler örnek ve sadece bu tarayıcıda.</span>`
        : `<span>Giriş: <b>${esc(st.user && st.user.email)}</b></span><span>Durum: <b>${esc(si.t)}</b></span><span>Son senkron: <b>${last ? last.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</b></span>`}
    </div>
    ${st.mode === 'demo' ? `<button type="button" class="btn block" data-action="demo-reset">Örnek veriyi sıfırla</button>` : `<button type="button" class="btn block" data-action="sync-now">Şimdi senkronize et</button>
    <button type="button" class="btn block" data-action="logout">Çıkış yap</button>`}
  </div>`;
}

let anchorEl = null;
function placeSheet() {
  $sheet.style.left = ''; $sheet.style.top = '';
  const pop = state.sheet === 'park' && anchorEl && document.contains(anchorEl) && window.innerWidth >= 760;
  $sheet.classList.toggle('pop', !!pop);
  if (!pop) return;
  const r = anchorEl.getBoundingClientRect();
  const w = $sheet.offsetWidth, h = $sheet.offsetHeight;
  const left = clamp(r.right - w, 12, window.innerWidth - w - 12);
  let top = r.bottom + 8;
  if (top + h > window.innerHeight - 12) top = Math.max(12, r.top - h - 8);
  $sheet.style.left = left + 'px';
  $sheet.style.top = top + 'px';
}

function renderSheet() {
  if (!state.sheet) return;
  $sheet.innerHTML = state.sheet === 'park' ? sheetPark() : sheetAccount();
  if ($sheet.open) placeSheet();
}

function openSheet(kind, anchor) {
  state.sheet = kind;
  anchorEl = anchor || null;
  renderSheet();
  if (!$sheet.open) $sheet.showModal();
  placeSheet();
}

function closeSheet() {
  state.sheet = null;
  state.parkFor = null;
  if ($sheet.open) $sheet.close();
}

function parkRow(id, backOn, reason, old) {
  return {
    id: old ? old.row.id : uuid(), day: old ? old.parkedOn : today(), line: 'T', topic: PARK + id, minutes: 0,
    correct: null, wrong: null, total: null, exam_code: backOn, err: {}, note: reason || null,
    created_at: old ? old.row.created_at : new Date().toISOString()
  };
}

function confirmPark() {
  const id = state.parkFor;
  if (!id) return;
  const t = today();
  const f = state.form;
  const D = derive();
  const row = parkRow(id, backOnFrom(f, t), f.reason.trim(), null);
  if (D.parks[id]) row.id = D.parks[id].row.id;
  row.day = t;
  state.store.put(row);
  delete state.keep[id];
  closeSheet();
  toast(`${badgeOf(TASK_BY_ID[id])} park edildi`, { label: 'Geri al', fn: () => { state.store.remove(row.id); } });
  render();
}

let toastT;
function toast(msg, action) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  if (action) el.querySelector('button').onclick = () => { action.fn(); el.remove(); render(); };
  clearTimeout(toastT);
  toastT = setTimeout(() => el.remove(), action ? 6000 : 2400);
}

// ---------------------------------------------------------------- olaylar
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-action]');
  if (!b) return;
  const a = b.dataset.action;
  const st = state.store;
  switch (a) {
    case 'toggle': {
      const id = b.dataset.id;
      const D = derive();
      if (D.done(id)) st.setTopic(id, 'todo');
      else {
        st.setTopic(id, 'done');
        state.keep[id] = b.dataset.tag || 'today';
        if (D.parks[id]) st.remove(D.parks[id].row.id);
      }
      render();
      break;
    }
    case 'park': {
      state.parkFor = b.dataset.id;
      state.form = { reason: '', when: 'haftasonu', date: addDays(today(), 7) };
      openSheet('park', b);
      setTimeout(() => { const i = $sheet.querySelector('#p-reason'); if (i && window.innerWidth >= 760) i.focus(); }, 30);
      break;
    }
    case 'when': state.form.when = b.dataset.v; renderSheet(); break;
    case 'park-today': case 'park-queue': {
      const id = b.dataset.id;
      const D = derive();
      const p = D.parks[id];
      if (!p) break;
      const before = { ...p.row };
      if (a === 'park-today') {
        st.put({ ...p.row, exam_code: D.t });
        toast(`${badgeOf(TASK_BY_ID[id])} bugüne alındı`, { label: 'Geri al', fn: () => st.put(before) });
      } else {
        st.remove(p.row.id);
        toast(`${badgeOf(TASK_BY_ID[id])} sıraya geri kondu`, { label: 'Geri al', fn: () => st.put(before) });
      }
      render();
      break;
    }
    case 'close-sheet': closeSheet(); break;
    case 'account': openSheet('account'); break;
    case 'sync-now': st.refresh().then(() => { renderSheet(); toast(st.status === 'ok' ? 'Güncel' : 'Senkronize edilemedi'); }); break;
    case 'logout': closeSheet(); st.signOut().then(render); break;
    case 'demo-reset': st.signOut(); closeSheet(); render(); toast('Örnek veri sıfırlandı'); break;
  }
});

$sheet.addEventListener('input', (e) => {
  if (e.target.name === 'reason') state.form.reason = e.target.value;
});
$sheet.addEventListener('change', (e) => {
  if (e.target.name === 'date') { state.form.date = e.target.value; renderSheet(); }
});
$sheet.addEventListener('submit', (e) => { e.preventDefault(); if (state.sheet === 'park') confirmPark(); });
$sheet.addEventListener('close', () => { state.sheet = null; state.parkFor = null; });
$sheet.addEventListener('click', (e) => { if (e.target === $sheet) closeSheet(); });
window.addEventListener('resize', () => { if ($sheet.open) placeSheet(); });

$app.addEventListener('submit', async (e) => {
  if (!e.target.matches('[data-login]')) return;
  e.preventDefault();
  const fd = new FormData(e.target);
  state.busy = true; state.loginError = ''; render();
  try { await state.store.signIn(String(fd.get('email')).trim(), String(fd.get('password'))); }
  catch (err) { state.loginError = /invalid/i.test(err.message) ? 'E-posta veya şifre yanlış.' : 'Giriş yapılamadı: ' + err.message; }
  state.busy = false; render();
});

window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// Gün değişince ve uygulamaya dönünce yenile
let lastDay = today();
function wake() {
  if (!state.store) return;
  if (today() !== lastDay) { lastDay = today(); state.keep = {}; render(); }
  state.store.refresh();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') wake(); });
window.addEventListener('online', wake);
setInterval(() => { if (document.visibilityState === 'visible') wake(); }, 60000);

// ---------------------------------------------------------------- başlat
(async function start() {
  $app.innerHTML = '<div class="splash">Yükleniyor…</div>';
  const demo = params.has('demo');
  let demoToday = state.fakeToday || iso(new Date());
  if (diffDays(demoToday, PLAN.start) < 7) demoToday = addDays(PLAN.start, 45);
  try {
    state.store = await createStore({ demo, demoToday });
  } catch (e) {
    console.error(e);
    $app.innerHTML = '<div class="splash">Bağlantı kurulamadı. İnternetini kontrol edip sayfayı yenile.</div>';
    return;
  }
  if (state.store.mode === 'demo' && !state.fakeToday) state.fakeToday = demoToday;
  state.store.onChange(() => { render(); if (state.sheet === 'account') renderSheet(); });
  render();
  state.store.refresh();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
