import { PLAN } from './plan.js';
import { createStore } from './store.js';
import { LS, iso, parse, addDays, diffDays, dow, clamp, uuid, esc, fmtH, fmtMin, rgba } from './util.js';

const ACC = '#D4FF3A';
const LINES = {
  C: { n: 'C programlama', s: 'C programlama', c: '#7AA7FF' },
  M: { n: 'Matematik', s: 'Matematik', c: '#FFB547' },
  G: { n: 'Çizge teorisi', s: 'Çizge', c: '#C59BFF' },
  A: { n: 'Algoritma / zeka', s: 'Algoritma', c: '#5EE0C8' },
  T: { n: 'Tekrar / borç', s: 'Tekrar', c: '#8A8F98' },
  D: { n: 'Deneme / set', s: 'Deneme', c: '#FF8A7A' },
  K: { n: 'Kod Atölyesi', s: 'Kod Atölyesi', c: '#F0D264' },
  S: { n: 'Kurulum', s: 'Kurulum', c: '#5A5F68' }
};
const LINE_KEYS = Object.keys(LINES);
const ERR = [['K', 'Konu eksiği'], ['İ', 'İşlem hatası'], ['O', 'Yanlış okuma'], ['Z', 'Zaman yetmedi'], ['T', 'Tuzak'], ['S', 'Strateji']];
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const DAYS_LONG = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const MON3 = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const NW = PLAN.weeks.length;
const PLAN_TOTAL = PLAN.weeks.reduce((a, w) => a + w.days.reduce((b, d) => b + d.h, 0), 0);
const TOPIC_CODES = Object.keys(PLAN.topics).sort((a, b) => a[0].localeCompare(b[0]) || +a.slice(1) - +b.slice(1));
const PRESETS = {
  T: ['Hata defteri', 'Borç kapatma', 'Zayıf konu', 'Kapanış testi', 'Karar noktası (KN)'],
  D: ['Madencilik seti', 'Tam deneme', 'Deneme analizi', 'Hız seti'],
  K: ['Kod Atölyesi #1', 'Kod Atölyesi #2', 'Kod Atölyesi #3', 'Kod Atölyesi #4', 'Kod Atölyesi #5', 'Kod Atölyesi #6', 'Kod Atölyesi #7', 'Ek problem'],
  S: ['Kurulum']
};

const params = new URLSearchParams(location.search);
const state = {
  store: null,
  range: LS.get('ioi.range', '8'),
  timer: LS.get('ioi.timer', null),
  form: null,
  sheet: null, // 'log' | 'account'
  armed: null,
  loginError: '',
  busy: false,
  fakeToday: params.get('today')
};

const $app = document.getElementById('app');
const $sheet = document.getElementById('sheet');

// ---------------------------------------------------------------- tarih / plan
const today = () => state.fakeToday || iso(new Date());
function planDay(s) {
  const k = diffDays(s, PLAN.start);
  if (k < 0) return null;
  const w = Math.floor(k / 7);
  if (w >= NW) return null;
  return { week: w, ...PLAN.weeks[w].days[k % 7] };
}
const curWeek = (t) => clamp(Math.floor(diffDays(t, PLAN.start) / 7), 0, NW - 1);
const weekDates = (w) => [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(PLAN.start, w * 7 + i));
const weekPlanH = (w) => PLAN.weeks[w].days.reduce((a, d) => a + d.h, 0);
const weekActH = (w, byDay) => weekDates(w).reduce((a, s) => a + (byDay[s] || 0), 0) / 60;
const lineColor = (l) => (LINES[(l || '')[0]] || LINES.T).c;
const lineShort = (l) => String(l || '').split('+').map((x) => (LINES[x] ? LINES[x].s : x)).join(' + ');
const dateLabel = (s) => { const d = parse(s); return `${d.getDate()} ${MON3[d.getMonth()]}`; };
const isCode = (t) => !!PLAN.topics[t];

function nextPlanned(t) {
  for (let i = 1; i < 14; i++) {
    const s = addDays(t, i);
    const p = planDay(s);
    if (p && p.h > 0) return { s, p };
  }
  return null;
}

// ---------------------------------------------------------------- türetilmiş veri
function derive() {
  const snap = state.store.snapshot();
  const sessions = snap.sessions || [];
  const byDay = {};
  for (const r of sessions) byDay[r.day] = (byDay[r.day] || 0) + (r.minutes || 0);
  return { sessions, topics: snap.topics || {}, byDay };
}

function streak(t, byDay) {
  let n = 0;
  let s = byDay[t] > 0 ? t : addDays(t, -1);
  for (let i = 0; i < 400; i++) {
    if (byDay[s] > 0) n++;
    else {
      if (diffDays(s, PLAN.start) < 0) break;
      const p = planDay(s);
      if (p && p.h > 0) break;
    }
    s = addDays(s, -1);
  }
  return n;
}

function setPoints(sessions) {
  const by = {};
  for (const r of sessions) {
    if (r.line !== 'D' || r.exam_code || !(r.total > 0) || r.correct == null) continue;
    const w = Math.floor(diffDays(r.day, PLAN.start) / 7);
    if (!by[w]) by[w] = { c: 0, t: 0 };
    by[w].c += r.correct; by[w].t += r.total;
  }
  return Object.keys(by).map(Number).sort((a, b) => a - b).map((w) => ({ w, label: 'H' + w, v: Math.round((by[w].c / by[w].t) * 100) }));
}

const net = (r) => (r.correct || 0) - (r.wrong || 0) / 4;

// ---------------------------------------------------------------- ikonlar
const I = {
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><polygon points="7 4 20 12 7 20 7 4"/></svg>',
  stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A1A1A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  today: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></svg>',
  stats: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 20v-6M12 20V5M19 20v-10"/></svg>',
  logo: `<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" style="transform:rotate(-90deg)"><circle cx="14" cy="14" r="10.5" fill="none" stroke="#26262A" stroke-width="4"/><circle cx="14" cy="14" r="10.5" fill="none" stroke="${ACC}" stroke-width="4" stroke-linecap="round" stroke-dasharray="44 66"/></svg>`
};

// ---------------------------------------------------------------- iskelet
function route() { return location.hash.startsWith('#/istatistik') ? 'stats' : 'today'; }

function syncInfo() {
  const st = state.store;
  if (st.mode === 'demo') return { s: 'demo', t: 'Demo' };
  if (st.status === 'syncing') return { s: 'syncing', t: 'Senkronize ediliyor' };
  if (st.status === 'offline') return { s: 'offline', t: st.pending ? `Çevrimdışı · ${st.pending} bekliyor` : 'Çevrimdışı' };
  if (st.status === 'error') return { s: 'error', t: 'Senkron hatası' };
  return { s: 'ok', t: st.pending ? `${st.pending} bekliyor` : 'Senkron' };
}

function header(r) {
  const si = syncInfo();
  return `<header class="top">
    <a class="brand" href="#/">${I.logo}<b>IOI Tracker</b><span class="pill">1. Aşama · 2027</span></a>
    <div class="top-right">
      <nav class="nav" aria-label="Ana menü">
        <a href="#/" ${r === 'today' ? 'aria-current="page"' : ''}>Bugün</a>
        <a href="#/istatistik" ${r === 'stats' ? 'aria-current="page"' : ''}>İstatistik</a>
      </nav>
      <button type="button" class="sync" data-s="${si.s}" data-action="account" aria-label="Hesap ve senkron: ${esc(si.t)}"><span class="dot"></span><span class="txt">${esc(si.t)}</span></button>
    </div>
  </header>`;
}

function tabbar(r) {
  return `<nav class="tabbar" aria-label="Sekmeler">
    <a href="#/" ${r === 'today' ? 'aria-current="page"' : ''}>${I.today}Bugün</a>
    <a href="#/istatistik" ${r === 'stats' ? 'aria-current="page"' : ''}>${I.stats}İstatistik</a>
  </nav>`;
}

function render() {
  if (!state.store) return;
  if (state.store.mode === 'supabase' && !state.store.user) { $app.innerHTML = viewLogin(); return; }
  const r = route();
  const d = derive();
  const banner = state.store.mode === 'demo' ? `<div class="banner">Demo modu · örnek veri, sadece bu cihazda. Supabase bilgileri girilince gerçek verilerin görünür.</div>` : '';
  $app.innerHTML = banner + header(r) + `<main>${r === 'stats' ? viewStats(d) : viewToday(d)}</main>` + tabbar(r);
  document.title = r === 'stats' ? 'İstatistik · IOI Tracker' : 'IOI Tracker';
}

// ---------------------------------------------------------------- Bugün
function elapsed() {
  if (!state.timer) return '00:00';
  const sec = Math.max(0, Math.floor((Date.now() - state.timer.start) / 1000));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`;
}

function codeChip(code) {
  const c = lineColor(code);
  return `<span class="code" style="color:${c};background:${rgba(c, 0.14)}">${esc(code)}</span>`;
}

function viewToday(d) {
  const t = today();
  const k = diffDays(t, PLAN.start);
  const dt = parse(t);
  const w = curWeek(t);
  const pd = planDay(t);
  const inPlan = k >= 0 && k < NW * 7;
  const eyebrow = `${DAYS_LONG[dow(t)]} · ${dt.getDate()} ${MONTHS[dt.getMonth()]}${inPlan ? ` · Hafta ${w}` : ''}`;

  let title, meta = '', detail = '';
  if (k < 0) {
    const s = parse(PLAN.start);
    const first = PLAN.weeks[0].days[0];
    title = `Plan ${s.getDate()} ${MONTHS[s.getMonth()]}'de başlıyor`;
    meta = `<span>${k === -1 ? 'Yarın' : `${-k} gün sonra`} ilk oturum: ${esc(first.label)} · ${fmtH(first.h)} sa</span>`;
  } else if (!pd) {
    title = 'Plan tamamlandı';
    meta = '<span>Sınav sonrası: C++ ve USACO hattı</span>';
  } else if (pd.h === 0) {
    title = 'Dinlenme günü';
    const nx = nextPlanned(t);
    if (nx) meta = `<span>Sonraki: ${DAYS_LONG[dow(nx.s)]} — ${esc(nx.p.label)} · ${fmtH(nx.p.h)} sa</span>`;
  } else {
    title = pd.label;
    const chips = pd.codes.length ? pd.codes.slice(0, 3).map(codeChip).join('') : codeChip(pd.line || '—');
    meta = `${chips}<span>${esc(lineShort(pd.line))} · ${fmtH(pd.h)} saat${pd.src ? ' · ' + esc(pd.src) : ''}</span>`;
    detail = `<details class="task"><summary>Görevin ayrıntısı</summary><p>${esc(pd.task)}</p></details>`;
  }

  const act = k < 0 ? 0 : weekActH(w, d.byDay);
  const plan = weekPlanH(w);
  const R = 108, circ = 2 * Math.PI * R;
  const frac = plan ? clamp(act / plan, 0, 1) : 0;

  const buttons = state.timer
    ? `<div class="run-wrap"><div class="timer-pill"><span class="dot"></span>Oturum sürüyor <b data-timer>${elapsed()}</b></div>
       <div class="btns"><button type="button" class="btn btn-primary" data-action="timer-stop">${I.stop}Bitir ve kaydet</button>
       <button type="button" class="btn" data-action="timer-cancel">Vazgeç</button></div></div>`
    : `<div class="btns"><button type="button" class="btn btn-primary" data-action="timer-start">${I.play}Oturumu başlat</button>
       <button type="button" class="btn" data-action="open-log">${I.plus}Kayıt ekle</button></div>`;

  const sp = setPoints(d.sessions);
  const lastSet = sp.length ? `%${sp[sp.length - 1].v}` : '—';
  const toExam = diffDays(PLAN.exam, t);

  const strip = weekDates(w).map((s, i) => {
    const p = PLAN.weeks[w].days[i];
    const a = d.byDay[s] || 0;
    let cls, val;
    if (s === t) { cls = 'today-c'; val = a ? fmtH(a / 60) : (p.h ? fmtH(p.h) : '—'); }
    else if (s < t) {
      if (a) { cls = 'done'; val = fmtH(a / 60); }
      else if (p.h && k >= 0) { cls = 'miss'; val = fmtH(p.h); }
      else { cls = 'rest'; val = p.h ? fmtH(p.h) : '—'; }
    } else { cls = p.h ? 'next' : 'rest next'; val = p.h ? fmtH(p.h) : '—'; }
    const ln = p.line ? p.line : 'boş';
    return `<div class="${cls}" title="${esc(dateLabel(s))}${p.label ? ' · ' + esc(p.label) : ''}"><span class="dl">${DAYS[i]}</span><span class="dv">${val}</span><span class="dc" style="color:${p.line ? lineColor(p.line) : '#8A8A92'}">${esc(ln)}</span></div>`;
  }).join('');

  return `<div class="today">
    <div class="hero">
      <div class="eyebrow">${eyebrow}</div>
      <h1 class="h1">${esc(title.replace(/ · /g, ', '))}</h1>
      <div class="meta">${meta}</div>
      ${detail}
    </div>
    <div class="ring" role="img" aria-label="Bu hafta ${fmtH(act)} / ${fmtH(plan)} saat">
      <svg width="248" height="248" viewBox="0 0 248 248" aria-hidden="true">
        <circle cx="124" cy="124" r="${R}" fill="none" stroke="#18181B" stroke-width="14"/>
        ${frac > 0 ? `<circle cx="124" cy="124" r="${R}" fill="none" stroke="${ACC}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${(circ * frac).toFixed(1)} ${circ.toFixed(1)}"/>` : ''}
      </svg>
      <div class="ring-in"><div class="ring-big">${fmtH(act)}</div><div class="ring-sub">/ ${fmtH(plan)} saat bu hafta</div></div>
    </div>
    ${buttons}
    <div class="mini">
      <div><b>${streak(t, d.byDay)} gün</b><span>seri</span></div>
      <div><b>${toExam >= 0 ? toExam + ' gün' : '—'}</b><span>sınava</span></div>
      <div><b>${lastSet}</b><span>son set</span></div>
    </div>
    <section class="strip" aria-label="Bu hafta">${strip}</section>
    <a class="link-more" href="#/istatistik">Tüm istatistikler ${I.arrow}</a>
  </div>`;
}

// ---------------------------------------------------------------- İstatistik
function viewStats(d) {
  const t = today();
  const k = diffDays(t, PLAN.start);
  const we = k < 0 ? 0 : curWeek(t);
  const ws = state.range === '8' ? Math.max(0, we - 7) : 0;
  const totalH = d.sessions.reduce((a, r) => a + (r.minutes || 0), 0) / 60;

  // plana uyum (dün itibarıyla)
  let planned = 0, done = 0;
  for (let i = 0; i < NW * 7; i++) {
    const s = addDays(PLAN.start, i);
    if (s >= t) break;
    planned += PLAN.weeks[Math.floor(i / 7)].days[i % 7].h;
  }
  for (const r of d.sessions) if (r.day < t) done += (r.minutes || 0) / 60;

  const st = (c) => d.topics[c] || 'todo';
  const nDone = TOPIC_CODES.filter((c) => st(c) === 'done').length;
  const nDoing = TOPIC_CODES.filter((c) => st(c) === 'doing').length;
  const sp = setPoints(d.sessions);
  const lastSet = sp.length ? sp[sp.length - 1].v : null;
  const deltaSet = sp.length > 1 ? lastSet - sp[0].v : null;
  const rangeLbl = `${dateLabel(addDays(PLAN.start, ws * 7))} → ${dateLabel(k < 0 ? addDays(PLAN.start, 6) : t)}`;

  return `<div class="stats">
    <div class="stats-head">
      <div><div class="eyebrow">${rangeLbl} · ${we - ws + 1} hafta</div><h1>İstatistik</h1></div>
      <div class="seg" role="group" aria-label="Zaman aralığı">
        <button type="button" data-action="range" data-v="8" aria-pressed="${state.range === '8'}">Son 8 hafta</button>
        <button type="button" data-action="range" data-v="all" aria-pressed="${state.range === 'all'}">Tümü</button>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi"><span class="k">Toplam çalışma</span><div class="v"><b>${fmtH(totalH)}</b><span>/ ${fmtH(PLAN_TOTAL)} sa</span></div><div class="bar"><i style="width:${clamp((totalH / PLAN_TOTAL) * 100, 0, 100).toFixed(1)}%"></i></div></div>
      <div class="kpi"><span class="k">Plana uyum</span><div class="v"><b>${planned ? '%' + Math.round((done / planned) * 100) : '—'}</b></div><span class="s">${planned ? `${fmtH(done)} / ${fmtH(planned)} sa · dün itibarıyla` : 'plan henüz başlamadı'}</span></div>
      <div class="kpi"><span class="k">Biten konu</span><div class="v"><b>${nDone}</b><span>/ ${TOPIC_CODES.length}</span></div><span class="s">${nDoing} konu devam ediyor</span></div>
      <div class="kpi"><span class="k">Pazar seti başarısı</span><div class="v"><b>${lastSet == null ? '—' : '%' + lastSet}</b>${deltaSet != null ? `<span style="color:${deltaSet >= 0 ? ACC : '#FF8A7A'}">${deltaSet >= 0 ? '↑' : '↓'} ${Math.abs(deltaSet)} puan</span>` : ''}</div><span class="s">${sp.length ? `ilk set %${sp[0].v}` : 'henüz set kaydı yok'}</span></div>
    </div>

    <div class="row">
      <figure class="card w2">${weeklyChart(d, ws, we, t)}</figure>
      <figure class="card w1">${linesCard(d)}</figure>
    </div>
    <div class="row">
      <figure class="card wh">${setCard(sp)}</figure>
      <figure class="card wh">${heatCard(d, ws, we, t)}</figure>
    </div>
    <div class="row">
      <figure class="card w2">${topicCard(d)}</figure>
      <figure class="card w1">${errorCard(d)}</figure>
    </div>
    <figure class="card">${examCard(d, t)}</figure>
    <section class="card" aria-labelledby="rec-h">${recentCard(d)}</section>
  </div>`;
}

function figHead(title, sub, right = '') {
  return `<figcaption class="fh"><div class="t"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div>${right}</figcaption>`;
}

function weeklyChart(d, ws, we, t) {
  const items = [];
  for (let w = ws; w <= we; w++) items.push({ w, act: weekActH(w, d.byDay), plan: weekPlanH(w) });
  const n = items.length;
  const max = Math.max(10, ...items.map((i) => Math.max(i.act, i.plan)));
  const top = Math.ceil(max / 5) * 5;
  const H = 200, sc = H / top;
  const step = top <= 20 ? 5 : 10;
  const ticks = []; for (let v = 0; v <= top; v += step) ticks.push(v);
  const cw = state.range === 'all' ? Math.min(we, NW - 1) : -1;
  const showVals = n <= 12;
  const cols = items.map((i) => {
    const cur = i.w === we && diffDays(t, PLAN.start) >= 0;
    return `<div class="col" title="Hafta ${i.w}: ${fmtH(i.act)} / ${fmtH(i.plan)} sa">
      <div class="b" style="height:${(i.act * sc).toFixed(1)}px;${cur ? `background:${rgba(ACC, 0.42)}` : ''}"></div>
      <div class="p" style="bottom:${(i.plan * sc).toFixed(1)}px"></div>
      ${showVals ? `<div class="vl" style="bottom:${(Math.max(i.act, i.plan) * sc + 6).toFixed(1)}px">${fmtH(i.act)}</div>` : ''}
    </div>`;
  }).join('');
  const labels = items.map((i) => `<span>${n > 16 && i.w % 2 ? '' : 'H' + i.w}</span>`).join('');
  void cw;
  return figHead('Haftalık saat', 'Gerçekleşen ve plan, hafta hafta', `<div class="legend"><span><i class="sw" style="background:${ACC}"></i>Gerçek</span><span><i style="width:14px;border-top:2px dashed #A1A1A8;display:inline-block"></i>Plan</span></div>`) +
    `<div class="chart">
      <div class="yax" style="height:${H}px">${ticks.map((v) => `<span style="bottom:${v * sc}px">${v}</span>`).join('')}</div>
      <div class="plot">
        <div class="plot-area" style="height:${H}px">
          ${ticks.map((v) => `<div class="gl" style="bottom:${v * sc}px;${v === 0 ? 'border-color:#2A2A2E' : ''}"></div>`).join('')}
          <div class="cols" style="grid-template-columns:repeat(${n},minmax(0,1fr))">${cols}</div>
        </div>
        <div class="xl" style="grid-template-columns:repeat(${n},minmax(0,1fr))">${labels}</div>
      </div>
    </div>`;
}

function linesCard(d) {
  const sums = {};
  let tot = 0;
  for (const r of d.sessions) { const l = LINES[r.line] ? r.line : 'T'; sums[l] = (sums[l] || 0) + (r.minutes || 0); tot += r.minutes || 0; }
  const keys = LINE_KEYS.filter((l) => sums[l]).sort((a, b) => sums[b] - sums[a]);
  const head = figHead('Hatlara göre dağılım', tot ? `${fmtH(tot / 60)} saatin nereye gittiği` : '');
  if (!tot) return head + '<div class="empty">İlk kayıttan sonra dolacak</div>';
  return head +
    `<div class="stack">${keys.map((l) => `<div style="flex:${sums[l]} 1 0;background:${LINES[l].c}" title="${LINES[l].n}"></div>`).join('')}</div>
    <div>${keys.map((l) => `<div class="lrow"><i class="sw" style="background:${LINES[l].c}"></i><span class="mono" style="font-size:12px;font-weight:600;color:${LINES[l].c};width:14px">${l}</span><span class="n">${LINES[l].n}</span><span class="h">${fmtH(sums[l] / 60)} sa</span><span class="pc">%${Math.round((sums[l] / tot) * 100)}</span></div>`).join('')}</div>`;
}

function setCard(sp) {
  const head = figHead('Pazar madencilik seti', 'Haftalık doğru oranı (%)');
  if (!sp.length) return head + '<div class="empty">“Deneme / set” hattında doğru ve toplam soru girdiğinde burada eğri oluşur</div>';
  const pts = sp.slice(-16);
  const x0 = 56, x1 = 456, yT = 20, yB = 180;
  const xs = pts.length === 1 ? [(x0 + x1) / 2] : pts.map((_, i) => x0 + (i * (x1 - x0)) / (pts.length - 1));
  const y = (v) => yB - (v / 100) * (yB - yT);
  const P = pts.map((p, i) => `${xs[i].toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const many = pts.length > 10;
  return head + `<svg viewBox="0 0 500 212" width="100%" role="img" aria-label="Set doğru oranı: ${pts.map((p) => p.label + ' %' + p.v).join(', ')}" style="display:block;height:auto;font-family:var(--mono)">
    ${[100, 75, 50, 25, 0].map((v) => `<line x1="40" y1="${y(v)}" x2="490" y2="${y(v)}" stroke="${v ? '#1F1F23' : '#2A2A2E'}"/>${v ? `<text x="0" y="${y(v) + 4}" font-size="11" fill="#8A8A92">${v}</text>` : ''}`).join('')}
    ${pts.length > 1 ? `<polygon points="${xs[0].toFixed(1)},${yB} ${P} ${xs[xs.length - 1].toFixed(1)},${yB}" fill="${rgba(ACC, 0.1)}"/><polyline points="${P}" fill="none" stroke="${ACC}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
    ${pts.map((p, i) => `<circle cx="${xs[i].toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${i === pts.length - 1 ? 5.5 : 4.5}" fill="${i === pts.length - 1 ? ACC : '#131315'}" stroke="${ACC}" stroke-width="2.5"/>` +
      (!many || i === pts.length - 1 ? `<text x="${xs[i].toFixed(1)}" y="${(y(p.v) - 13).toFixed(1)}" font-size="12" fill="#EDEDEF" text-anchor="middle">${p.v}</text>` : '') +
      (!many || i % 2 === 0 ? `<text x="${xs[i].toFixed(1)}" y="204" font-size="11" fill="#A1A1A8" text-anchor="middle">${p.label}</text>` : '')).join('')}
  </svg>`;
}

function heatCard(d, ws, we, t) {
  const n = we - ws + 1;
  const lv = (h) => (h <= 0 ? 0 : h <= 1 ? 0.22 : h <= 1.5 ? 0.45 : h <= 2 ? 0.72 : 1);
  const legend = [0, 0.22, 0.45, 0.72, 1].map((a) => `<i class="sw" style="width:12px;height:12px;background:${a ? rgba(ACC, a) : '#18181B'}"></i>`).join('');
  let html = `<div></div>`;
  let prevM = -1;
  for (let w = ws; w <= we; w++) {
    const m = parse(addDays(PLAN.start, w * 7));
    const lbl = m.getMonth() !== prevM ? `${m.getDate()} ${MON3[m.getMonth()]}` : String(m.getDate());
    prevM = m.getMonth();
    html += `<span class="hh">${n > 12 && (w - ws) % 2 ? '' : lbl}</span>`;
  }
  for (let i = 0; i < 7; i++) {
    html += `<span class="hl">${DAYS[i]}</span>`;
    for (let w = ws; w <= we; w++) {
      const s = addDays(PLAN.start, w * 7 + i);
      const h = (d.byDay[s] || 0) / 60;
      let style;
      if (s > t) style = 'background:transparent;border:1px dashed #232327';
      else if (s === t && !h) style = `background:transparent;border-color:${ACC}`;
      else { const a = lv(h); const bg = a ? rgba(ACC, a) : '#18181B'; style = `background:${bg};${s === t ? `border-color:${ACC}` : ''}`; }
      html += `<div class="cell" style="${style}" title="${dateLabel(s)} · ${s > t ? 'gelecek' : h ? fmtH(h) + ' sa' : 'kayıt yok'}"></div>`;
    }
  }
  return figHead('Çalışma takvimi', 'Günlük saat', `<div class="legend" style="gap:4px;align-items:center;font-size:11px;color:#8A8A92"><span style="margin-right:2px">az</span>${legend}<span style="margin-left:2px">çok</span></div>`) +
    `<div class="heat"><div class="heat-grid" style="grid-template-columns:36px repeat(${n},minmax(${n > 12 ? 14 : 28}px,1fr))">${html}</div></div>`;
}

function topicCard(d) {
  const groups = [['C', 'C programlama'], ['M', 'Matematik'], ['G', 'Çizge teorisi'], ['A', 'Algoritma / zeka']];
  const body = groups.map(([L, name]) => {
    const codes = TOPIC_CODES.filter((c) => c[0] === L);
    const c = LINES[L].c;
    const done = codes.filter((x) => d.topics[x] === 'done').length;
    const chips = codes.map((code) => {
      const s = d.topics[code] || 'todo';
      const style = s === 'done' ? `background:${rgba(c, 0.16)};border-color:${rgba(c, 0.5)};color:${c}` : s === 'doing' ? `border:1px dashed ${c};color:${c}` : '';
      const lbl = { todo: 'başlamadı', doing: 'devam', done: 'bitti' }[s];
      return `<button type="button" class="tchip" style="${style}" data-action="topic" data-code="${code}" title="${esc(PLAN.topics[code])} · ${lbl}" aria-label="${code} ${esc(PLAN.topics[code])}: ${lbl}. Değiştirmek için dokun">${code}</button>`;
    }).join('');
    return `<div class="tg"><div class="tg-h">${name}<span class="c">${done} / ${codes.length}</span><div class="bar"><i style="width:${(done / codes.length) * 100}%;background:${c}"></i></div></div><div class="chips">${chips}</div></div>`;
  }).join('');
  return figHead('Konu haritası', 'Dokununca durum değişir: başlamadı → devam → bitti',
    `<div class="legend"><span><i class="sw" style="background:rgba(237,237,239,.18);border:1px solid rgba(237,237,239,.5)"></i>Bitti</span><span><i class="sw" style="border:1px dashed #EDEDEF"></i>Devam</span><span><i class="sw" style="border:1px solid #2E2E33"></i>Başlamadı</span></div>`) +
    `<div style="display:flex;flex-direction:column;gap:18px">${body}</div>`;
}

function errorCard(d) {
  const sums = {}; let tot = 0;
  for (const r of d.sessions) for (const [k2, v] of Object.entries(r.err || {})) { sums[k2] = (sums[k2] || 0) + (v || 0); tot += v || 0; }
  const head = figHead('Hata defteri', tot ? `${tot} hata · koda göre` : 'Kayıtlardaki hata kodları');
  if (!tot) return head + '<div class="empty">Kayıt eklerken “Hata kodları” bölümünden girilebilir</div>';
  const rows = ERR.map(([k2, n]) => ({ k: k2, n, v: sums[k2] || 0 })).sort((a, b) => b.v - a.v);
  const max = rows[0].v || 1;
  const tips = { K: 'zayıf konu saatine al', İ: 'ara sonucu yazma alışkanlığı', O: 'soru kökündeki olumsuz ifadeyi daire içine al', Z: 'tur yöntemine sadık kal', T: 'tuzak listesine yeni satır ekle', S: 'tahmin kuralını uygula' };
  return head + `<div style="display:flex;flex-direction:column;gap:14px">${rows.map((r, i) => `<div class="erow"><div class="t"><b>${r.k}</b><span>${r.n}</span><i>${r.v}</i></div><div class="bar"><i style="width:${(r.v / max) * 100}%;background:${i === 0 ? ACC : '#5A5F68'}"></i></div></div>`).join('')}</div>
    <div class="note" style="margin-top:auto">En çok <b>${rows[0].k} · ${rows[0].n.toLowerCase()}</b> → ${tips[rows[0].k]}</div>`;
}

function examCard(d, t) {
  const res = {};
  for (const r of d.sessions) if (r.exam_code) { if (!res[r.exam_code] || res[r.exam_code].created_at < r.created_at) res[r.exam_code] = r; }
  const next = PLAN.exams.find((e) => e.date >= t && !res[e.code]);
  const badge = next ? `<span class="badge">${next.code === 'SINAV' ? 'Sınav' : next.code} · ${diffDays(next.date, t) === 0 ? 'bugün' : diffDays(next.date, t) + ' gün sonra'}</span>` : '';
  const sc = 160 / 50;
  const cols = PLAN.exams.map((e) => {
    const r = res[e.code];
    const nv = r ? net(r) : null;
    return `<div class="ex" title="${e.code}${e.year ? ' (' + e.year + ')' : ''} · hedef ${e.target}${r ? ' · net ' + fmtH(nv) : ''}">
      <span class="num">${r ? fmtH(nv) : e.target}</span>
      <div class="box" style="height:${Math.max(e.target, nv || 0) * sc}px">
        <div class="tgt" style="height:${e.target * sc}px;${e.code === 'SINAV' ? `border-color:${ACC}` : ''}"></div>
        ${r ? `<div class="act" style="height:${Math.max(2, nv * sc)}px;${nv < e.target ? 'background:#FFB547' : ''}"></div>` : ''}
      </div>
      <span class="cd" style="${e.code === 'SINAV' ? `color:${ACC}` : ''}">${e.code === 'SINAV' ? 'Sınav' : e.code}</span>
      <span class="dt">${dateLabel(e.date)}</span>
    </div>`;
  }).join('');
  return figHead('Deneme netleri', 'Çerçeve = varsayımsal ara hedef · dolgu = gerçek net (sarı: hedefin altında)', badge) +
    `<div class="exams"><div class="exams-grid">${cols}</div></div>`;
}

function recentCard(d) {
  const rows = d.sessions.slice().sort((a, b) => (b.day + (b.created_at || '')).localeCompare(a.day + (a.created_at || ''))).slice(0, 15);
  const head = `<div class="fh"><div class="t"><b id="rec-h">Son kayıtlar</b><span>Yanlış girdiysen sil, yeniden ekle</span></div></div>`;
  if (!rows.length) return head + '<div class="empty">Henüz kayıt yok</div>';
  return head + `<div class="rec">${rows.map((r) => {
    const extra = r.exam_code ? ` · ${r.exam_code} net ${fmtH(net(r))}` : r.total ? ` · ${r.correct ?? 0}/${r.total}` : '';
    const armed = state.armed === r.id;
    return `<div class="rec-row"><span class="d">${dateLabel(r.day)}</span>${codeChip(r.line)}<span class="tp" title="${esc(r.note || '')}"><span class="tt">${esc(r.topic || '')}${isCode(r.topic) ? ' · ' + esc(PLAN.topics[r.topic]) : ''}</span><span class="m">${fmtMin(r.minutes)}${extra}</span></span><button type="button" class="del" data-action="del" data-id="${esc(r.id)}" ${armed ? 'data-armed' : ''} aria-label="${armed ? 'Silmeyi onayla' : 'Kaydı sil'}">${armed ? 'Sil?' : '×'}</button></div>`;
  }).join('')}</div>`;
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

// ---------------------------------------------------------------- Kayıt formu
function topicOptions(line) {
  if ('CMGA'.includes(line)) return TOPIC_CODES.filter((c) => c[0] === line).map((c) => ({ v: c, l: `${c} · ${PLAN.topics[c]}` }));
  return (PRESETS[line] || ['Diğer']).map((x) => ({ v: x, l: x }));
}

function defaultTopic(line, pd) {
  const opts = topicOptions(line);
  if (pd && pd.codes) { const c = pd.codes.find((x) => x[0] === line); if (c) return c; }
  if (pd && line === 'D') {
    if (/tam deneme/i.test(pd.label)) return 'Tam deneme';
    if (/analiz/i.test(pd.label)) return 'Deneme analizi';
    if (/hız/i.test(pd.label)) return 'Hız seti';
  }
  if (pd && line === 'K') { const m = /#(\d)/.exec(pd.task); if (m) return 'Kod Atölyesi #' + m[1]; }
  return opts[0] ? opts[0].v : '';
}

function newForm(minutes, fromTimer) {
  const t = today();
  const pd = planDay(t);
  const p = pd && pd.h > 0 ? pd : null;
  let line = p && p.line ? p.line[0] : 'C';
  if (!LINES[line]) line = 'C';
  const em = p ? /^(D\d)\b/.exec(p.label) : null;
  const nextExam = PLAN.exams.find((e) => e.date >= addDays(t, -6));
  return {
    day: t, line, topic: defaultTopic(line, p),
    minutes: minutes || (p ? Math.round(p.h * 60) : 60),
    correct: '', wrong: '', total: '', exam: em ? em[1] : (nextExam ? nextExam.code : 'D1'),
    err: {}, note: '', markDone: false, errOpen: false, error: '', fromTimer: !!fromTimer
  };
}

function sheetLog() {
  const f = state.form;
  const opts = topicOptions(f.line);
  const isExam = f.line === 'D' && f.topic === 'Tam deneme';
  const curSt = state.store.snapshot().topics[f.topic] || 'todo';
  const errCount = Object.values(f.err).reduce((a, b) => a + b, 0);
  const n = isExam && f.correct !== '' ? (parseInt(f.correct, 10) || 0) - (parseInt(f.wrong, 10) || 0) / 4 : null;
  return `<form class="sheet" data-form novalidate>
    <div class="grab"></div>
    <div class="sheet-head"><h2 id="sheet-title">${f.fromTimer ? 'Oturumu kaydet' : 'Kayıt ekle'}</h2><button type="button" class="icon-btn" data-action="close-sheet" aria-label="Kapat">${I.x}</button></div>

    <fieldset><legend>Hat</legend><div class="chips" style="gap:8px">
      ${LINE_KEYS.map((l) => { const on = l === f.line; const c = LINES[l].c; return `<button type="button" class="hat" data-action="pick-line" data-v="${l}" aria-pressed="${on}" style="${on ? `background:${rgba(c, 0.14)};border-color:${c};color:#EDEDEF` : ''}"><b style="color:${c}">${l}</b>${LINES[l].s}</button>`; }).join('')}
    </div></fieldset>

    <div class="field"><label for="f-topic">Konu</label>
      <div class="sel"><select id="f-topic" name="topic">${opts.map((o) => `<option value="${esc(o.v)}" ${o.v === f.topic ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>${I.chev}</div>
    </div>
    ${isCode(f.topic) ? (curSt === 'done' ? `<div class="check">✓ ${f.topic} zaten “bitti” olarak işaretli</div>` : `<label class="check"><input type="checkbox" name="markDone" ${f.markDone ? 'checked' : ''}><span>${f.topic} konusunu bitti olarak işaretle <span class="muted">(şu an: ${curSt === 'doing' ? 'devam' : 'başlamadı'})</span></span></label>`) : ''}

    <div class="field"><span class="lbl">Süre</span>
      <div class="step">
        <button type="button" data-action="min" data-v="-15" aria-label="15 dakika azalt">${I.minus}</button>
        <output aria-live="polite">${fmtMin(f.minutes)}</output>
        <button type="button" data-action="min" data-v="15" aria-label="15 dakika artır">${I.plus}</button>
      </div>
      <div class="presets">${[30, 60, 90, 120].map((m) => `<button type="button" data-action="min-set" data-v="${m}" aria-pressed="${f.minutes === m}">${m < 60 ? m + ' dk' : fmtH(m / 60) + ' sa'}</button>`).join('')}</div>
    </div>

    ${isExam ? `
      <div class="field"><label for="f-exam">Deneme</label>
        <div class="sel"><select id="f-exam" name="exam">${PLAN.exams.map((e) => `<option value="${e.code}" ${e.code === f.exam ? 'selected' : ''}>${e.code === 'SINAV' ? 'Gerçek sınav' : `${e.code} · ${e.year} sınavı`} (${dateLabel(e.date)})</option>`).join('')}</select>${I.chev}</div>
      </div>
      <div class="g3">
        <div class="field"><label for="f-c">Doğru</label><input class="inp num" id="f-c" name="correct" type="number" inputmode="numeric" min="0" max="50" value="${esc(f.correct)}" placeholder="0"></div>
        <div class="field"><label for="f-w">Yanlış</label><input class="inp num" id="f-w" name="wrong" type="number" inputmode="numeric" min="0" max="50" value="${esc(f.wrong)}" placeholder="0"></div>
        <div class="field"><label for="f-t">Soru</label><input class="inp num" id="f-t" name="total" type="number" inputmode="numeric" min="1" value="${esc(f.total)}" placeholder="50"></div>
      </div>
      <div class="netbox" data-net>Net (4 yanlış 1 doğruyu götürür): <b>${n == null ? '—' : fmtH(n)}</b></div>`
    : `<div class="g2">
        <div class="field"><label for="f-c">Doğru <span class="muted">(isteğe bağlı)</span></label><input class="inp num" id="f-c" name="correct" type="number" inputmode="numeric" min="0" value="${esc(f.correct)}" placeholder="0"></div>
        <div class="field"><label for="f-t">Toplam soru</label><input class="inp num" id="f-t" name="total" type="number" inputmode="numeric" min="0" value="${esc(f.total)}" placeholder="${f.line === 'D' && f.topic === 'Madencilik seti' ? '8' : '0'}"></div>
      </div>`}

    <details class="errs" data-errs ${f.errOpen ? 'open' : ''}><summary>Hata kodları${errCount ? ` · ${errCount}` : ''} <span class="muted">&nbsp;(isteğe bağlı)</span></summary>
      <div class="errs-grid">${ERR.map(([k, nm]) => `<div class="ec"><span><b>${k}</b>${nm}</span><button type="button" data-action="err" data-k="${k}" data-v="-1" aria-label="${nm} azalt">${I.minus}</button><output>${f.err[k] || 0}</output><button type="button" data-action="err" data-k="${k}" data-v="1" aria-label="${nm} artır">${I.plus}</button></div>`).join('')}</div>
    </details>

    <div class="g2">
      <div class="field"><label for="f-day">Tarih</label><input class="inp" id="f-day" name="day" type="date" value="${esc(f.day)}" max="${today()}"></div>
      <div></div>
    </div>
    <div class="field"><label for="f-note">Not <span class="muted">(isteğe bağlı)</span></label><textarea class="inp" id="f-note" name="note" rows="2" placeholder="Hata defteri için 1 cümlelik kural…">${esc(f.note)}</textarea></div>
    ${f.error ? `<div class="form-error" role="alert">${esc(f.error)}</div>` : ''}
    <button type="submit" class="btn btn-primary block">Kaydet</button>
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
      ${st.mode === 'demo' ? `<span><b>Demo modu.</b> Veriler örnek ve sadece bu tarayıcıda. config.js dosyasına Supabase bilgileri girilince giriş ekranı açılır.</span>`
        : `<span>Giriş: <b>${esc(st.user && st.user.email)}</b></span><span>Durum: <b>${esc(si.t)}</b></span><span>Son senkron: <b>${last ? last.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</b></span>`}
      <span>Kayıt sayısı: <b>${st.snapshot().sessions.length}</b></span>
    </div>
    ${st.mode === 'demo' ? `<button type="button" class="btn block" data-action="demo-reset">Örnek veriyi sıfırla</button>` : `<button type="button" class="btn block" data-action="sync-now">Şimdi senkronize et</button>
    <button type="button" class="btn block" data-action="logout">Çıkış yap</button>`}
  </div>`;
}

function renderSheet() {
  if (!state.sheet) return;
  const sc = $sheet.scrollTop;
  $sheet.innerHTML = state.sheet === 'log' ? sheetLog() : sheetAccount();
  $sheet.scrollTop = sc;
}

function openSheet(kind) {
  state.sheet = kind;
  renderSheet();
  if (!$sheet.open) $sheet.showModal();
  $sheet.scrollTop = 0;
}

function closeSheet() {
  state.sheet = null;
  if ($sheet.open) $sheet.close();
}

function saveForm() {
  const f = state.form;
  const num = (v) => (v === '' || v == null || isNaN(parseInt(v, 10)) ? null : Math.max(0, parseInt(v, 10)));
  const isExam = f.line === 'D' && f.topic === 'Tam deneme';
  const minutes = Math.round(f.minutes);
  let total = num(f.total);
  const correct = num(f.correct);
  const wrong = isExam ? num(f.wrong) : null;
  if (isExam && total == null) total = 50;
  if (f.line === 'D' && f.topic === 'Madencilik seti' && total == null && correct != null) total = 8;
  if (!f.day || f.day > today()) { f.error = 'Geçerli bir tarih seç.'; return renderSheet(); }
  if (!(minutes > 0)) { f.error = 'Süre en az 15 dk olmalı.'; return renderSheet(); }
  if (correct != null && total != null && correct + (wrong || 0) > total) { f.error = 'Doğru + yanlış, soru sayısını geçemez.'; return renderSheet(); }
  if (isExam && correct == null) { f.error = 'Deneme için doğru sayısını gir.'; return renderSheet(); }
  const err = {};
  for (const [k, v] of Object.entries(f.err)) if (v > 0) err[k] = v;
  const row = {
    id: uuid(), day: f.day, line: f.line, topic: f.topic, minutes,
    correct, wrong, total: correct == null ? null : total, exam_code: isExam ? f.exam : null,
    err, note: f.note.trim() || null, created_at: new Date().toISOString()
  };
  state.store.add(row);
  if (f.markDone && isCode(f.topic)) state.store.setTopic(f.topic, 'done');
  else if (isCode(f.topic) && !state.store.snapshot().topics[f.topic]) state.store.setTopic(f.topic, 'doing');
  if (f.fromTimer) { state.timer = null; LS.set('ioi.timer', null); }
  closeSheet();
  toast('Kaydedildi');
  render();
}

let toastT;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg;
  clearTimeout(toastT);
  toastT = setTimeout(() => el.remove(), 2200);
}

// ---------------------------------------------------------------- olaylar
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-action]');
  if (!b) {
    if (state.armed && !e.target.closest('.del')) { state.armed = null; render(); }
    return;
  }
  const a = b.dataset.action;
  const f = state.form;
  switch (a) {
    case 'timer-start':
      state.timer = { start: Date.now() }; LS.set('ioi.timer', state.timer); render(); break;
    case 'timer-cancel':
      state.timer = null; LS.set('ioi.timer', null); render(); break;
    case 'timer-stop': {
      const min = Math.max(15, Math.round((Date.now() - state.timer.start) / 60000 / 5) * 5);
      state.form = newForm(min, true); openSheet('log'); break;
    }
    case 'open-log': state.form = newForm(); openSheet('log'); break;
    case 'close-sheet': closeSheet(); break;
    case 'account': openSheet('account'); break;
    case 'pick-line':
      f.line = b.dataset.v; f.topic = defaultTopic(f.line, planDay(f.day)); f.markDone = false; f.error = ''; renderSheet(); break;
    case 'min': f.minutes = clamp(f.minutes + +b.dataset.v, 15, 600); renderSheet(); break;
    case 'min-set': f.minutes = +b.dataset.v; renderSheet(); break;
    case 'err': { const k = b.dataset.k; f.err[k] = clamp((f.err[k] || 0) + +b.dataset.v, 0, 99); renderSheet(); break; }
    case 'range': state.range = b.dataset.v; LS.set('ioi.range', state.range); render(); break;
    case 'topic': {
      const code = b.dataset.code;
      const cur = state.store.snapshot().topics[code] || 'todo';
      const nx = { todo: 'doing', doing: 'done', done: 'todo' }[cur];
      state.store.setTopic(code, nx);
      render();
      const el = document.querySelector(`[data-action="topic"][data-code="${code}"]`);
      if (el) el.focus();
      break;
    }
    case 'del':
      if (state.armed === b.dataset.id) { state.store.remove(b.dataset.id); state.armed = null; toast('Silindi'); }
      else state.armed = b.dataset.id;
      render();
      break;
    case 'sync-now': state.store.refresh().then(() => { renderSheet(); toast(state.store.status === 'ok' ? 'Güncel' : 'Senkronize edilemedi'); }); break;
    case 'logout': closeSheet(); state.store.signOut().then(render); break;
    case 'demo-reset': state.store.signOut(); closeSheet(); render(); toast('Örnek veri sıfırlandı'); break;
  }
});

$sheet.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.name || !state.form) return;
  const f = state.form;
  if (el.type === 'checkbox') f[el.name] = el.checked;
  else f[el.name] = el.value;
  if (el.name === 'topic') { f.markDone = false; renderSheet(); return; }
  if (el.name === 'correct' || el.name === 'wrong') {
    const box = $sheet.querySelector('[data-net] b');
    if (box) box.textContent = f.correct === '' ? '—' : fmtH((parseInt(f.correct, 10) || 0) - (parseInt(f.wrong, 10) || 0) / 4);
  }
});
$sheet.addEventListener('toggle', (e) => { if (e.target.matches('[data-errs]') && state.form) state.form.errOpen = e.target.open; }, true);
$sheet.addEventListener('submit', (e) => { e.preventDefault(); saveForm(); });
$sheet.addEventListener('close', () => { state.sheet = null; });
$sheet.addEventListener('click', (e) => { if (e.target === $sheet) closeSheet(); });

$app.addEventListener('submit', async (e) => {
  if (!e.target.matches('[data-login]')) return;
  e.preventDefault();
  const fd = new FormData(e.target);
  state.busy = true; state.loginError = ''; render();
  try { await state.store.signIn(String(fd.get('email')).trim(), String(fd.get('password'))); }
  catch (err) { state.loginError = /invalid/i.test(err.message) ? 'E-posta veya şifre yanlış.' : 'Giriş yapılamadı: ' + err.message; }
  state.busy = false; render();
});

window.addEventListener('hashchange', () => { state.armed = null; render(); window.scrollTo(0, 0); });
setInterval(() => {
  if (!state.timer) return;
  document.querySelectorAll('[data-timer]').forEach((el) => { el.textContent = elapsed(); });
}, 1000);

// Gün değişince ve uygulamaya dönünce yenile
let lastDay = today();
function wake() {
  if (!state.store) return;
  if (today() !== lastDay) { lastDay = today(); render(); }
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
  if (diffDays(demoToday, PLAN.start) < 7) demoToday = '2026-11-26';
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
