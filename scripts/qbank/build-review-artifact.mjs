#!/usr/bin/env node
// build-review-artifact.mjs —— 把待簽草稿打包成一個單檔審批網頁。
//
// ══ 點解要有 ══
// review-drafts.mjs 會為【每一個草稿檔】各出一份 .review.html。644 條分散喺
// 11 份檔案，要開 11 個分頁、記住批到邊、再逐份匯出 —— 中途停低就好易亂。
// 呢個腳本把全部待簽草稿併成一頁：一次一題、進度自動存喺瀏覽器、
// 每份檔案各自匯出可以直接覆蓋 .decisions.json 嘅 JSON。
//
// ⚠️ 憲章 §12：機器永不代簽。
//    · 審批人姓名一律【留空】，由真人自己打 —— 呢度唔會預填任何名。
//    · 刻意【冇】「全部通過」掣：一個 bulk approve 會令「逐題批」得個名。
//    · 匯出時 reviewedAt 用匯出當日，唔係生成當日。
//
// ⚠️ 憲章 §16.C：任何「最終狀態」欄位都要由實跑嘅人填。本頁生成時
//    每一題都係 pending，冇一條預設通過。
//
// 用法：node scripts/qbank/build-review-artifact.mjs
// 輸出：一個 HTML 檔，交畀 Artifact 發佈（預設私密）。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const DRAFTS = path.join(ROOT, 'scripts/qbank/drafts')
const OUT = process.argv[2] || path.join(ROOT, 'scripts/qbank/review-console.html')

// 待簽名單：只收 _meta.reviewer 仍然空白嘅草稿檔。
const SUBJECT_ZH = {
  math: '數學', m1: '數學 M1', m2: '數學 M2', physics: '物理', chemistry: '化學',
  biology: '生物', english: '英國語文', chinese: '中國語文', bafs: '企會財',
  ict: '資訊及通訊科技', economics: '經濟', csd: '公民與社會發展',
  'chinese-history': '中國歷史', history: '歷史', geography: '地理',
  'chinese-literature': '中國文學', 'english-literature': '英語文學',
  'ethics-religious': '倫理與宗教', ths: '旅遊與款待', 'health-management': '健康管理',
  'design-tech': '設計與應用科技', 'visual-arts': '視覺藝術', music: '音樂',
  pe: '體育', 'technology-living': '科技與生活',
}

const files = fs.readdirSync(DRAFTS)
  // `_` 開頭係示範／內部檔（例如 _demo-math.json），唔屬於待審批範圍。
  .filter((f) => f.endsWith('.json') && !f.startsWith('_') && !/\.(decisions|rejected|sample)\.json$/.test(f))
  .filter((f) => fs.existsSync(path.join(DRAFTS, f.replace('.json', '.decisions.json'))))
  .sort()

const bundles = []
for (const f of files) {
  const decPath = path.join(DRAFTS, f.replace('.json', '.decisions.json'))
  const dec = JSON.parse(fs.readFileSync(decPath, 'utf8'))
  if ((dec._meta?.reviewer ?? '').trim()) continue // 已簽名，唔再入審批頁
  const rows = JSON.parse(fs.readFileSync(path.join(DRAFTS, f), 'utf8'))
  if (!Array.isArray(rows) || !rows.length) continue
  const subject = dec._meta?.subject ?? rows[0]?.subject ?? ''
  bundles.push({
    file: f,
    subject,
    subjectZh: SUBJECT_ZH[subject] ?? subject,
    questions: rows.map((r) => ({
      id: r.id,
      topic: r.topicZh ?? r.topic ?? '',
      difficulty: r.difficulty ?? '',
      minutes: r.suggestedMinutes ?? null,
      question: r.question ?? '',
      explanation: r.explanation ?? '',
      ref: r.referenceAnswer ?? '',
      refEn: r.referenceAnswerEn ?? '',
      scheme: r.markingScheme ?? '',
      schemeEn: r.markingSchemeEn ?? '',
    })),
  })
}

bundles.sort((a, b) => a.subjectZh.localeCompare(b.subjectZh, 'zh-Hant') || a.file.localeCompare(b.file))

const total = bundles.reduce((n, b) => n + b.questions.length, 0)
if (!total) {
  console.log('冇待簽草稿 —— 全部 .decisions.json 嘅 reviewer 欄都已經填咗。')
  process.exit(0)
}

// JSON 內嵌入 <script> 之前要處理三種字元：
// `<` 會提早結束 script 標籤；U+2028/U+2029 喺 JS 字面量入面係換行符，
// 內嵌時會令整段 script 斷開。三者一律轉成 escape 序列。
const DATA = JSON.stringify(bundles)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029')

const html = `<title>草稿審批台</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@400;500;700&family=Noto+Serif+HK:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
/* 色票直接沿用項目自己嘅莫蘭迪 token（app/globals.css）——
   審批人日日對住呢套色，審批台唔應該另起一套。
   狀態色（通過／退回／待批）刻意同 accent 分開，唔會撈亂。 */
:root{
  --bg:#F4F0EA; --card:#FFFDF9; --sunken:#F0EBE3; --line:rgba(44,42,41,.10); --line2:rgba(44,42,41,.20);
  --ink:#2C2A29; --ink-soft:#3D3A38; --ink-muted:#69635F; --ink-faint:#9C958D;
  --ok:#57685C; --ok-bg:rgba(87,104,92,.12);
  --no:#845956; --no-bg:rgba(132,89,86,.12);
  --wait:#706347; --wait-bg:rgba(112,99,71,.10);
  --focus:#57685C;
  --shadow:0 1px 2px rgba(44,42,41,.05);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#1a1917; --card:#252422; --sunken:#2f2e2c; --line:rgba(232,224,212,.10); --line2:rgba(232,224,212,.20);
    --ink:#f0e8dc; --ink-soft:#c1bab0; --ink-muted:#a8a095; --ink-faint:#6b6560;
    --ok:#7a9e7e; --ok-bg:rgba(122,158,126,.16);
    --no:#c49a9a; --no-bg:rgba(196,154,154,.16);
    --wait:#b8956f; --wait-bg:rgba(184,149,111,.14);
    --focus:#7a9e7e;
    --shadow:none;
  }
}
:root[data-theme="dark"]{
  --bg:#1a1917; --card:#252422; --sunken:#2f2e2c; --line:rgba(232,224,212,.10); --line2:rgba(232,224,212,.20);
  --ink:#f0e8dc; --ink-soft:#c1bab0; --ink-muted:#a8a095; --ink-faint:#6b6560;
  --ok:#7a9e7e; --ok-bg:rgba(122,158,126,.16);
  --no:#c49a9a; --no-bg:rgba(196,154,154,.16);
  --wait:#b8956f; --wait-bg:rgba(184,149,111,.14);
  --focus:#7a9e7e;
  --shadow:none;
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:"Noto Sans HK",-apple-system,"PingFang HK","Microsoft JhengHei",sans-serif;
  font-size:15px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.mono{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-variant-numeric:tabular-nums}

/* ── 版面：左欄檔案 · 中間一次一題 ─────────────────────────────── */
.wrap{display:grid;grid-template-columns:250px minmax(0,1fr);min-height:100vh}
@media(max-width:900px){.wrap{grid-template-columns:1fr}.rail{position:static!important;height:auto!important;border-right:0;border-bottom:1px solid var(--line)}}

.rail{
  position:sticky;top:0;height:100vh;overflow-y:auto;
  background:var(--card);border-right:1px solid var(--line);
  display:flex;flex-direction:column;gap:2px;padding:20px 14px;
}
.brand{padding:0 6px 14px;border-bottom:1px solid var(--line);margin-bottom:12px}
.brand h1{margin:0;font-size:16px;font-weight:700;letter-spacing:.02em}
.brand p{margin:4px 0 0;font-size:12px;color:var(--ink-muted);line-height:1.5}
.filebtn{
  display:flex;flex-direction:column;gap:5px;width:100%;text-align:left;
  background:none;border:0;border-radius:8px;padding:9px 10px;cursor:pointer;
  color:var(--ink-soft);font:inherit;font-size:13px;transition:background .15s;
}
.filebtn:hover{background:var(--sunken)}
.filebtn[aria-current="true"]{background:var(--ok-bg);color:var(--ink)}
.filebtn .fr{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.filebtn b{font-weight:500}
.bar{height:4px;border-radius:99px;background:var(--sunken);overflow:hidden;display:flex}
.bar i{display:block;height:100%}
.bar .b-ok{background:var(--ok)} .bar .b-no{background:var(--no)}

.main{padding:22px 26px 140px;max-width:900px;width:100%}
@media(max-width:900px){.main{padding:18px 16px 200px}}

/* ── 狀態帶：一眼睇晒成份檔案批到邊 ───────────────────────────── */
.strip{display:flex;flex-wrap:wrap;gap:3px;margin:0 0 18px}
.chip{
  width:22px;height:22px;border-radius:5px;border:1px solid var(--line2);
  background:var(--wait-bg);cursor:pointer;padding:0;
  font:600 10px/1 "JetBrains Mono",monospace;color:var(--ink-faint);
}
.chip[data-s="approved"]{background:var(--ok-bg);border-color:var(--ok);color:var(--ok)}
.chip[data-s="rejected"]{background:var(--no-bg);border-color:var(--no);color:var(--no)}
.chip[aria-current="true"]{outline:2px solid var(--focus);outline-offset:1px}

.head{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;justify-content:space-between;margin-bottom:14px}
.head h2{margin:0;font-size:20px;font-weight:700}
.counts{font-size:13px;color:var(--ink-muted)}
.counts b{font-weight:600}
.c-ok{color:var(--ok)} .c-no{color:var(--no)} .c-wait{color:var(--wait)}

.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:22px;box-shadow:var(--shadow)}
.meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px}
.tag{
  font-size:11px;letter-spacing:.04em;padding:3px 9px;border-radius:99px;
  background:var(--sunken);color:var(--ink-muted);border:1px solid var(--line)
}
.tag.id{font-family:"JetBrains Mono",monospace;letter-spacing:0}
.tag.d-basic{color:var(--ok);border-color:var(--ok)}
.tag.d-intermediate{color:var(--wait);border-color:var(--wait)}
.tag.d-hard{color:var(--no);border-color:var(--no)}

/* 題目本身用襯線 —— 被審嘅係試卷內容，同外框嘅介面字分開。 */
.qtext{
  font-family:"Noto Serif HK",Georgia,"Songti TC",serif;
  font-size:16.5px;line-height:1.85;white-space:pre-wrap;
  padding:16px 18px;background:var(--sunken);border-radius:9px;
  border-left:3px solid var(--wait);
}
.sec{margin-top:18px}
.sec>summary,.sec>h3{
  font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--ink-muted);
  margin:0 0 8px;cursor:pointer;list-style:none;
}
.sec>summary::-webkit-details-marker{display:none}
.sec>summary::before{content:"▸ ";color:var(--ink-faint)}
.sec[open]>summary::before{content:"▾ "}
.body{white-space:pre-wrap;font-size:14.5px;line-height:1.8;color:var(--ink-soft)}
.body.en{font-family:Georgia,serif;color:var(--ink-muted);font-size:14px}

/* ── 決定列（貼底）───────────────────────────────────────────── */
.dock{
  position:fixed;left:250px;right:0;bottom:0;z-index:10;
  background:var(--card);border-top:1px solid var(--line);
  padding:12px 26px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;
}
@media(max-width:900px){.dock{left:0;padding:10px 14px}}
.btn{
  font:inherit;font-size:14px;font-weight:500;padding:9px 16px;border-radius:9px;
  border:1px solid var(--line2);background:var(--card);color:var(--ink-soft);cursor:pointer;
  transition:background .15s,border-color .15s;
}
.btn:hover{background:var(--sunken)}
.btn.ok{border-color:var(--ok);color:var(--ok)}
.btn.ok[aria-pressed="true"]{background:var(--ok);color:var(--card);border-color:var(--ok)}
.btn.no{border-color:var(--no);color:var(--no)}
.btn.no[aria-pressed="true"]{background:var(--no);color:var(--card);border-color:var(--no)}
.btn:focus-visible,.chip:focus-visible,.filebtn:focus-visible,input:focus-visible,textarea:focus-visible{
  outline:2px solid var(--focus);outline-offset:2px
}
.spacer{flex:1}
.kbd{font:600 11px/1 "JetBrains Mono",monospace;background:var(--sunken);border:1px solid var(--line);border-radius:4px;padding:3px 5px;color:var(--ink-muted)}

/* ── 匯出 ────────────────────────────────────────────────────── */
dialog{
  border:1px solid var(--line2);border-radius:14px;background:var(--card);color:var(--ink);
  max-width:min(760px,92vw);width:100%;padding:0;box-shadow:0 12px 40px rgba(0,0,0,.28);
}
dialog::backdrop{background:rgba(20,18,17,.55)}
.dlg{padding:22px}
.dlg h3{margin:0 0 6px;font-size:17px}
.dlg p{margin:0 0 14px;font-size:13.5px;color:var(--ink-muted);line-height:1.65}
label{display:block;font-size:12px;font-weight:600;letter-spacing:.05em;color:var(--ink-muted);margin:14px 0 6px}
input[type=text]{
  width:100%;font:inherit;padding:9px 11px;border-radius:8px;
  border:1px solid var(--line2);background:var(--sunken);color:var(--ink);
}
textarea{
  width:100%;min-height:200px;font-family:"JetBrains Mono",monospace;font-size:12px;line-height:1.55;
  padding:11px;border-radius:8px;border:1px solid var(--line2);background:var(--sunken);color:var(--ink-soft);
  resize:vertical;
}
.warn{
  font-size:13px;line-height:1.7;padding:11px 13px;border-radius:8px;
  background:var(--no-bg);border:1px solid var(--no);color:var(--ink);margin:0 0 14px
}
.note{
  font-size:12.5px;line-height:1.7;color:var(--ink-muted);
  border-left:2px solid var(--line2);padding-left:12px;margin:14px 0 0
}
pre.cmd{
  font-family:"JetBrains Mono",monospace;font-size:12px;line-height:1.7;
  background:var(--sunken);border:1px solid var(--line);border-radius:8px;
  padding:12px;overflow-x:auto;margin:8px 0 0;color:var(--ink-soft);
}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:14px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>

<div class="wrap">
  <nav class="rail" aria-label="草稿檔案">
    <div class="brand">
      <h1>草稿審批台</h1>
      <p><b id="tot">0</b> 條待簽 · 逐題批<br>進度自動存喺呢部機</p>
    </div>
    <div id="files"></div>
    <div class="note" style="margin-top:14px">
      冇「全部通過」掣 —— 憲章 §12 要求逐題批，一個總掣會令呢條紀律得個名。
    </div>
  </nav>

  <main class="main">
    <div class="head">
      <h2 id="ftitle">—</h2>
      <div class="counts" id="counts"></div>
    </div>
    <div class="strip" id="strip" role="tablist" aria-label="本檔題目狀態"></div>

    <article class="card" id="card">
      <div class="meta" id="meta"></div>
      <div class="qtext" id="q"></div>

      <details class="sec" open><summary>參考答案（學生交卷後對照自評）</summary>
        <div class="body" id="ref"></div></details>
      <details class="sec"><summary>參考答案・英文</summary>
        <div class="body en" id="refEn"></div></details>
      <details class="sec"><summary>自評對照表</summary>
        <div class="body" id="scheme"></div></details>
      <details class="sec"><summary>本題考核甚麼</summary>
        <div class="body" id="expl"></div></details>
    </article>
  </main>
</div>

<div class="dock">
  <button class="btn" id="prev">← 上一題</button>
  <button class="btn ok" id="ok" aria-pressed="false">通過</button>
  <button class="btn no" id="no" aria-pressed="false">退回</button>
  <button class="btn" id="clear">清除</button>
  <button class="btn" id="next">下一題 →</button>
  <span class="spacer"></span>
  <span class="kbd">A</span><span style="font-size:12px;color:var(--ink-muted)">通過</span>
  <span class="kbd">R</span><span style="font-size:12px;color:var(--ink-muted)">退回</span>
  <span class="kbd">J / K</span><span style="font-size:12px;color:var(--ink-muted)">前後</span>
  <button class="btn" id="exp">匯出本檔</button>
</div>

<dialog id="dlg"><div class="dlg">
  <h3>匯出審批結果</h3>
  <p>複製下面嘅 JSON，覆蓋 <span class="mono" id="dfile"></span>，然後跑最底嗰條指令。</p>
  <div class="warn" id="dwarn" hidden></div>
  <label for="rev">審批人姓名（真人，唔可以留空）</label>
  <input type="text" id="rev" placeholder="例如 Brian 或 Yuna" autocomplete="off">
  <label for="out">decisions.json</label>
  <textarea id="out" readonly spellcheck="false"></textarea>
  <div class="row">
    <button class="btn ok" id="copy">複製 JSON</button>
    <button class="btn" id="close">關閉</button>
    <span class="mono" id="copied" style="font-size:12px;color:var(--ok)"></span>
  </div>
  <div class="note">
    <b>覆蓋之後跑：</b>
    <pre class="cmd" id="cmd"></pre>
    promote 只會寫入標住 approved 嘅題；pending 同 rejected 一律唔入庫，
    而且會再過一次機器閘 —— 撳咗通過都唔會令一條格式有問題嘅題入到庫。<br>
    入庫之後仲要人手 wire 入 <span class="mono">load.ts</span>，嗰步 promote 只會印出片段，唔會自己改。
  </div>
</div></dialog>

<script>
const BUNDLES = ${DATA};
const KEY = 'dse-review-console-v1';
let state = { decisions:{}, reviewer:'' };
try { const s = localStorage.getItem(KEY); if (s) state = { ...state, ...JSON.parse(s) }; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

let fi = 0, qi = 0;
const $ = (id) => document.getElementById(id);
const cur = () => BUNDLES[fi];
const curQ = () => cur().questions[qi];
const stat = (id) => state.decisions[id] || 'pending';

const tally = (b) => {
  let ok = 0, no = 0;
  for (const q of b.questions) { const s = stat(q.id); if (s === 'approved') ok++; else if (s === 'rejected') no++; }
  return { ok, no, wait: b.questions.length - ok - no };
};

function renderFiles() {
  const box = $('files'); box.textContent = '';
  BUNDLES.forEach((b, i) => {
    const t = tally(b), n = b.questions.length;
    const el = document.createElement('button');
    el.className = 'filebtn'; el.type = 'button';
    el.setAttribute('aria-current', i === fi ? 'true' : 'false');
    el.innerHTML =
      '<span class="fr"><b>' + b.subjectZh + '</b><span class="mono" style="font-size:11px;color:var(--ink-faint)">'
      + (t.ok + t.no) + '/' + n + '</span></span>'
      + '<span class="bar"><i class="b-ok" style="width:' + (t.ok / n * 100) + '%"></i>'
      + '<i class="b-no" style="width:' + (t.no / n * 100) + '%"></i></span>';
    el.onclick = () => { fi = i; qi = 0; renderAll(); };
    box.appendChild(el);
  });
  $('tot').textContent = BUNDLES.reduce((n, b) => n + b.questions.length, 0);
}

function renderStrip() {
  const s = $('strip'); s.textContent = '';
  cur().questions.forEach((q, i) => {
    const c = document.createElement('button');
    c.className = 'chip'; c.type = 'button';
    c.dataset.s = stat(q.id);
    c.textContent = String(i + 1);
    c.title = q.id + ' · ' + q.topic;
    c.setAttribute('aria-current', i === qi ? 'true' : 'false');
    c.onclick = () => { qi = i; renderQ(); };
    s.appendChild(c);
  });
}

function renderQ() {
  const b = cur(), q = curQ(), t = tally(b);
  $('ftitle').textContent = b.subjectZh + ' · 第 ' + (qi + 1) + ' / ' + b.questions.length + ' 題';
  $('counts').innerHTML =
    '<b class="c-ok">' + t.ok + '</b> 通過 · <b class="c-no">' + t.no + '</b> 退回 · <b class="c-wait">' + t.wait + '</b> 待批';
  const dz = { basic:'基礎', intermediate:'中等', hard:'拔尖' }[q.difficulty] || q.difficulty;
  $('meta').innerHTML =
    '<span class="tag id">' + q.id + '</span>'
    + '<span class="tag">' + q.topic + '</span>'
    + '<span class="tag d-' + q.difficulty + '">' + dz + '</span>'
    + (q.minutes ? '<span class="tag">建議 ' + q.minutes + ' 分鐘</span>' : '');
  $('q').textContent = q.question;
  $('ref').textContent = q.ref;
  $('refEn').textContent = q.refEn;
  $('scheme').textContent = q.scheme;
  $('expl').textContent = q.explanation;
  const s = stat(q.id);
  $('ok').setAttribute('aria-pressed', s === 'approved');
  $('no').setAttribute('aria-pressed', s === 'rejected');
  renderStrip(); renderFiles();
  document.querySelector('.main').scrollIntoView({ block:'start' });
}
const renderAll = () => { renderFiles(); renderQ(); };

function decide(v) {
  const id = curQ().id;
  if (v === 'pending') delete state.decisions[id]; else state.decisions[id] = v;
  save();
  if (v !== 'pending' && qi < cur().questions.length - 1) qi++;
  renderQ();
}
const move = (d) => {
  const n = cur().questions.length;
  qi = Math.min(n - 1, Math.max(0, qi + d)); renderQ();
};

$('ok').onclick = () => decide('approved');
$('no').onclick = () => decide('rejected');
$('clear').onclick = () => decide('pending');
$('prev').onclick = () => move(-1);
$('next').onclick = () => move(1);

addEventListener('keydown', (e) => {
  if (e.target.matches('input,textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'a') { e.preventDefault(); decide('approved'); }
  else if (k === 'r') { e.preventDefault(); decide('rejected'); }
  else if (k === 'j' || e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (k === 'k' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
});

// ── 匯出 ──────────────────────────────────────────────────────────
const dlg = $('dlg');
function buildOut() {
  const b = cur();
  const rev = $('rev').value.trim();
  const t = tally(b);
  $('dwarn').hidden = t.wait === 0;
  if (t.wait) $('dwarn').textContent =
    '仲有 ' + t.wait + ' 條未批。匯出唔會攔你，但 promote 只收 approved —— 未批嘅一律唔入庫。';
  const obj = {
    _meta: {
      source: b.file, subject: b.subject,
      reviewer: rev,
      reviewedAt: rev ? new Date().toISOString().slice(0, 10) : '',
    },
    decisions: Object.fromEntries(b.questions.map((q) => [q.id, stat(q.id)])),
  };
  $('out').value = JSON.stringify(obj, null, 1) + '\\n';
  $('dfile').textContent = 'scripts/qbank/drafts/' + b.file.replace('.json', '.decisions.json');
  $('cmd').textContent =
    'node scripts/qbank/promote-drafts.mjs \\\\\\n'
    + '  --in scripts/qbank/drafts/' + b.file + ' \\\\\\n'
    + '  --subject ' + b.subject + ' \\\\\\n'
    + '  --decisions scripts/qbank/drafts/' + b.file.replace('.json', '.decisions.json');
}
$('exp').onclick = () => { $('rev').value = state.reviewer || ''; buildOut(); $('copied').textContent = ''; dlg.showModal(); };
$('rev').oninput = () => { state.reviewer = $('rev').value; save(); buildOut(); };
$('close').onclick = () => dlg.close();
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText($('out').value); $('copied').textContent = '已複製'; }
  catch (e) { $('out').select(); $('copied').textContent = '請自行按 Cmd/Ctrl + C'; }
};

renderAll();
</script>
`

fs.writeFileSync(OUT, html, 'utf8')
console.log(`✅ ${bundles.length} 個檔案 · ${total} 條待簽 → ${path.relative(ROOT, OUT)}`)
console.log(`   ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`)
for (const b of bundles) console.log(`     ${b.subjectZh.padEnd(10)} ${String(b.questions.length).padStart(4)} 條  ${b.file}`)
