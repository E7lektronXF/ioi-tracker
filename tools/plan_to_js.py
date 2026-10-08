"""Plan markdown'ını uygulamanın okuduğu plan.js dosyasına çevirir.
Kullanım:  python tools/plan_to_js.py ../TUBITAK_Bilgisayar_1_Asama_Plani.md plan.js
"""
import re, json, sys
SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else 'plan.js'
src = open(SRC, encoding='utf-8').read()
lines = src.split('\n')

def cells(row):
    parts = re.split(r'(?<!\\)\|', row.strip())
    parts = [p.strip().replace('\\|', '|') for p in parts]
    return parts[1:-1]

def clean(s):
    s = s.replace('**', '').replace('`', '')
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    return s.strip()

# topic catalog
topics = {}
for ln in lines:
    m = re.match(r'^\|\s*([CMGA]\d{1,2})\s*\|\s*([^|]+?)\s*\|', ln)
    if m and m.group(1) not in topics:
        topics[m.group(1)] = clean(m.group(2))

# weeks
weeks = []
cur = None
DAYS = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']
for ln in lines:
    m = re.match(r'^#### Hafta (\d+) · (.+?) — (.+)$', ln)
    if m:
        cur = {'n': int(m.group(1)), 'range': m.group(2), 'title': clean(m.group(3)), 'goal': '', 'done': '', 'days': {}}
        weeks.append(cur); continue
    if cur is None: continue
    if ln.startswith('## ') or ln.startswith('### '):
        if ln.startswith('## '): cur = None
        continue
    g = re.match(r'^> \*\*Hedef:\*\*\s*(.+?)\s*$', ln)
    if g: cur['goal'] = clean(g.group(1)); continue
    g = re.match(r'^> \*\*Bitti sayılır:\*\*\s*(.+?)\s*$', ln)
    if g: cur['done'] = clean(g.group(1)); continue
    if ln.startswith('|'):
        c = cells(ln)
        if len(c) >= 4 and c[0] in DAYS:
            hrs = c[1].replace(',', '.')
            try: h = float(hrs)
            except: h = 0.0
            task_raw = c[3]
            task = clean(task_raw)
            codes = re.findall(r'\b([CMGA]\d{1,2})\b', task)
            # short label
            bold = re.match(r'^\*\*([^*]+)\*\*', task_raw.strip())
            label = None
            if bold and not re.fullmatch(r'[CMGA]\d{1,2}(\+[CMGA]\d{1,2})*', bold.group(1)):
                label = clean(bold.group(1))
            elif bold and bold.group(1).split('+')[0] in topics:
                label = topics[bold.group(1).split('+')[0]]
            if not label:
                label = re.split(r' \(| · | — ', task)[0].strip()
                if len(label) > 44 and ':' in label:
                    label = label.split(':')[0].strip()
            if len(label) > 48: label = label[:46].rstrip() + '…'
            cur['days'][c[0]] = {'h': h, 'line': c[2] if c[2] not in ('—','-') else '', 'task': task, 'label': label, 'codes': list(dict.fromkeys(codes)), 'src': clean(c[4]) if len(c) > 4 else ''}

out_weeks = []
for w in weeks:
    days = [w['days'].get(d, {'h': 0, 'line': '', 'task': '', 'label': '', 'codes': [], 'src': ''}) for d in DAYS]
    out_weeks.append({'n': w['n'], 'range': w['range'], 'title': w['title'], 'goal': w['goal'], 'done': w['done'], 'days': days})

exams = [['D1','2027-02-06',15,'2019'],['D2','2027-02-27',18,'2020'],['D3','2027-03-13',22,'2021'],['D4','2027-03-27',25,'2022'],['D5','2027-04-03',27,'2018'],['D6','2027-04-10',30,'2023'],['D7','2027-04-17',32,'2024'],['D8','2027-04-24',34,'2025'],['D9','2027-05-01',35,'2026'],['SINAV','2027-05-08',38,'']]
data = {'start': '2026-10-05', 'exam': '2027-05-08', 'topics': topics, 'weeks': out_weeks,
        'exams': [{'code': e[0], 'date': e[1], 'target': e[2], 'year': e[3]} for e in exams]}
js = '// Otomatik üretildi: TUBITAK_Bilgisayar_1_Asama_Plani.md\nexport const PLAN = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n'
open(OUT, 'w', encoding='utf-8').write(js)
tot = sum(d['h'] for w in out_weeks for d in w['days'])
print(f'{OUT} yazıldı: {len(out_weeks)} hafta, {len(topics)} konu, toplam {tot:g} saat')
