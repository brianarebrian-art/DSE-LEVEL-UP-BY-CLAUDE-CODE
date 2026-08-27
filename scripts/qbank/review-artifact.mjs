#!/usr/bin/env node
// ============================================================================
// review-artifact.mjs —— 產生一個【可以喺瀏覽器打開】嘅審批台
// ----------------------------------------------------------------------------
// 點解要有呢個工具（唔係已經有 review-drafts.mjs 出 .review.html 咩？）：
//
// review-drafts.mjs 出嗰張表靠 Blob + <a download> 匯出決定。喺 Artifact 檢視器
// （sandbox iframe）入面，任何由頁面自己發起嘅下載都會被擋 —— 即係話兩位創辦人
// 用得到嘅唯一途徑（我擺上去 → 佢哋開個 link）正正就係嗰張表用唔到嘅途徑。
// 呢度改成【貼返】：撳完批准／駁回，產生一段純文字，全選複製，貼返落對話。
//
// 另外呢張表要處理兩種題型：
//   mc          —— 顯示四個選項，標出 correctIndex 指住嗰個（審核人要睇答案啱唔啱）
//   long / text —— 顯示參考答案 ＋ 評分準則（自評用，【永不機器批改】，憲章 §16.A）
//
// 用法：
//   node scripts/qbank/review-artifact.mjs \
//     --in scripts/qbank/drafts/history-p2-essays.json \
//     --subject history --title "歷史卷二論述題審批" --tag HISTORY-P2-BATCH1 \
//     --out /tmp/history-review.html
//
// --in 可以出現多次，多個草稿檔會合併成一張表，編號連續（1..N）。
//
// ⚠️ 本腳本【唔會】寫任何 decisions.json，亦唔會掂題庫 —— 佢淨係出一張 HTML。
// 真人簽名之後，決定要人手寫入 decisions.json，再行 promote-drafts.mjs。
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

const args = process.argv.slice(2)
const many = (n) => args.reduce((a, x, i) => (x === `--${n}` && args[i + 1] ? [...a, args[i + 1]] : a), [])
const one = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d }
const INS = many('in')
const SUBJECT = one('subject')
const TITLE = one('title')
const TAG = one('tag')
const OUT = one('out')
const NOTE = one('note', '')
if (!INS.length || !SUBJECT || !TITLE || !TAG || !OUT) {
  console.error('usage: review-artifact.mjs --in <draft.json> [--in <more.json>] --subject <id> --title <t> --tag <TAG> --out <file.html> [--note <html>]')
  process.exit(2)
}

const rows = []
for (const f of INS) {
  const arr = JSON.parse(readFileSync(f, 'utf8'))
  if (!Array.isArray(arr)) { console.error(`✗ ${f} 唔係 JSON array`); process.exit(1) }
  for (const q of arr) rows.push({ ...q, _file: basename(f) })
}

const data = rows.map((q, i) => ({
  n: i + 1,
  id: q.id,
  file: q._file,
  topic: q.topicZh || q.topic || q.topicId || '',
  diff: q.difficulty || '',
  marks: q.marks ?? null,
  type: q.type || 'mc',
  q: q.question || '',
  options: Array.isArray(q.options) ? q.options : null,
  correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : null,
  ans: q.referenceAnswer || '',
  ms: q.markingScheme || '',
  ex: q.explanation || '',
}))

const N = data.length
const marksTotal = data.reduce((a, r) => a + (r.marks ?? 0), 0)
const byDiff = data.reduce((a, r) => ((a[r.diff] = (a[r.diff] || 0) + 1), a), {})
const byType = data.reduce((a, r) => ((a[r.type] = (a[r.type] || 0) + 1), a), {})
const json = JSON.stringify(data).replace(/</g, '\\u003c')

const html = `<title>${TITLE}</title>
<style>

:root{
  --paper:#EEF1F5; --card:#FFFFFF; --sunk:#F5F7FA; --rule:#D5DBE3; --rule2:#B9C2CE;
  --ink:#12161C; --ink2:#3A424E; --dim:#697382; --faint:#939CA9;
  --acc:#2F4B7C; --acc-bg:#E6ECF5; --acc-line:#9DB2D2;
  --ok:#1B6B58; --ok-bg:#E2F0EB; --ok-line:#8DC2B3;
  --no:#9E3535; --no-bg:#F7E6E4;
  --warn:#7A5A12; --warn-bg:#FBF2DC; --warn-line:#DCC489;
  --sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang HK","Noto Sans CJK TC",sans-serif;
  --serif:"Songti TC","Noto Serif CJK TC","Times New Roman",Georgia,serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#0E1116; --card:#161A21; --sunk:#11151A; --rule:#252B34; --rule2:#39414D;
  --ink:#E7EBF1; --ink2:#C0C7D1; --dim:#8D97A4; --faint:#6A7280;
  --acc:#8DABDD; --acc-bg:#182234; --acc-line:#33496D;
  --ok:#59C4A6; --ok-bg:#0F2A24; --ok-line:#2A5F52;
  --no:#E08079; --no-bg:#33191A;
  --warn:#DFBE6A; --warn-bg:#2C2411; --warn-line:#5E4E22;
}}
:root[data-theme="dark"]{
  --paper:#0E1116; --card:#161A21; --sunk:#11151A; --rule:#252B34; --rule2:#39414D;
  --ink:#E7EBF1; --ink2:#C0C7D1; --dim:#8D97A4; --faint:#6A7280;
  --acc:#8DABDD; --acc-bg:#182234; --acc-line:#33496D;
  --ok:#59C4A6; --ok-bg:#0F2A24; --ok-line:#2A5F52;
  --no:#E08079; --no-bg:#33191A;
  --warn:#DFBE6A; --warn-bg:#2C2411; --warn-line:#5E4E22;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.w{max-width:48rem;margin:0 auto;padding:0 1rem 7rem}
:focus-visible{outline:2px solid var(--acc);outline-offset:3px;border-radius:3px}

.bar{position:sticky;top:0;z-index:20;background:var(--paper);border-bottom:1px solid var(--rule)}
.bar .in{max-width:48rem;margin:0 auto;padding:.6rem 1rem;display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}
.prog{flex:1 1 7rem;height:4px;background:var(--rule);border-radius:2px;overflow:hidden}
.prog i{display:block;height:100%;width:0;background:var(--acc);transition:width .18s}
.cnt{font-family:var(--mono);font-size:.78rem;color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
.cnt b{color:var(--ink)}
.cnt .a{color:var(--ok)} .cnt .r{color:var(--no)}

h1{font-family:var(--serif);font-size:1.75rem;line-height:1.25;margin:2.2rem 0 .4rem;font-weight:600;text-wrap:balance}
.lede{color:var(--dim);margin:0 0 1.3rem;font-size:.93rem}
.lede b{color:var(--ink)}
.meta{display:flex;gap:1.4rem;flex-wrap:wrap;font-family:var(--mono);font-size:.76rem;
  color:var(--dim);font-variant-numeric:tabular-nums;padding:.7rem 0;border-block:1px solid var(--rule);margin-bottom:1.5rem}
.meta b{color:var(--ink);font-weight:700}

.note{border:1px solid var(--rule);border-left:3px solid var(--acc);background:var(--card);
  border-radius:0 7px 7px 0;padding:.85rem 1rem;margin:0 0 1rem;font-size:.88rem;color:var(--ink2)}
.note.w-{border-left-color:var(--warn-line);background:var(--warn-bg)}
.note h3{margin:0 0 .35rem;font-size:.78rem;letter-spacing:.07em;text-transform:uppercase;color:var(--acc);font-weight:700}
.note.w- h3{color:var(--warn)}
.note p{margin:.35rem 0 0}
.note code{font-family:var(--mono);font-size:.85em;background:var(--sunk);padding:.05em .3em;border-radius:3px}

.qc{background:var(--card);border:1px solid var(--rule);border-radius:8px;margin:0 0 1rem;
  display:grid;grid-template-columns:2.9rem 1fr}
.qc.ap{border-color:var(--ok-line);background:var(--ok-bg)}
.qc.rj{border-color:var(--no);opacity:.6}
.rail{border-right:1px solid var(--rule);padding:.95rem .4rem;display:flex;flex-direction:column;
  align-items:center;gap:.15rem;background:var(--sunk);border-radius:8px 0 0 8px}
.qc.ap .rail,.qc.rj .rail{background:transparent}
.rail .mk{font-family:var(--mono);font-size:1.05rem;font-weight:700;color:var(--acc);font-variant-numeric:tabular-nums}
.rail .mu{font-size:.62rem;color:var(--faint);letter-spacing:.04em}
.body{padding:.95rem 1.05rem}
.qh{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap;margin-bottom:.6rem}
.qn{font-family:var(--mono);font-size:.8rem;font-weight:700;color:var(--ink)}
.qid{font-family:var(--mono);font-size:.7rem;color:var(--faint)}
.pill{font-size:.66rem;font-weight:700;padding:.1rem .42rem;border-radius:3px;letter-spacing:.03em}
.d-basic{background:var(--ok-bg);color:var(--ok)}
.d-intermediate{background:var(--warn-bg);color:var(--warn)}
.d-hard{background:var(--acc-bg);color:var(--acc)}
.tp{font-size:.74rem;color:var(--dim)}
.st{margin-left:auto;font-family:var(--mono);font-size:.74rem;font-weight:700;color:var(--faint)}
.st.a{color:var(--ok)} .st.r{color:var(--no)}
.amd{display:inline-block;font-size:.66rem;font-weight:700;padding:.1rem .42rem;border-radius:3px;
  background:var(--warn-bg);color:var(--warn);border:1px solid var(--warn-line)}

.stem{font-family:var(--serif);font-size:1.04rem;line-height:1.72;margin:0 0 .9rem}
.sec{margin-top:.75rem;border-top:1px dashed var(--rule);padding-top:.7rem}
.sec>h4{margin:0 0 .35rem;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;
  color:var(--faint);font-weight:700}
.ans{font-family:var(--serif);font-size:1rem;line-height:1.7;color:var(--ink)}
.ms,.ex{font-size:.89rem;line-height:1.68;color:var(--ink2)}
.ms{font-family:var(--serif)}

.acts{display:flex;gap:.5rem;margin-top:.9rem;flex-wrap:wrap}
button{font-family:var(--sans);font-size:.85rem;font-weight:600;padding:.42rem .95rem;
  border-radius:6px;border:1px solid var(--rule2);background:var(--card);color:var(--ink2);cursor:pointer}
button:hover{border-color:var(--acc);color:var(--acc)}
button.y:hover{border-color:var(--ok);color:var(--ok);background:var(--ok-bg)}
button.n:hover{border-color:var(--no);color:var(--no);background:var(--no-bg)}

.out{background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:1.1rem;margin-top:2rem}
.out h2{font-family:var(--serif);font-size:1.2rem;margin:0 0 .5rem}
label{display:block;font-size:.78rem;color:var(--dim);margin:.7rem 0 .25rem;font-weight:600}
input,textarea{width:100%;font-family:var(--mono);font-size:.85rem;padding:.5rem .6rem;
  border:1px solid var(--rule2);border-radius:5px;background:var(--sunk);color:var(--ink)}
textarea{min-height:8.5rem;line-height:1.55;resize:vertical}
.hint{font-size:.8rem;color:var(--dim);margin:.55rem 0 0;min-height:1.2em}

/* ── LaTeX 子集渲染 ── */
.m{font-family:var(--serif);font-style:italic}
.m .tx,.m .fn{font-style:normal}
.m .tx{white-space:pre-wrap}
.fr{display:inline-flex;flex-direction:column;vertical-align:-0.48em;text-align:center;margin:0 .16em}
.fr>.nu{padding:0 .28em;border-bottom:1px solid currentColor;line-height:1.28}
.fr>.de{padding:0 .28em;line-height:1.28}
.sq>.rad{border-top:1px solid currentColor;padding:0 .12em .02em;margin-left:.04em}
.ov{border-top:1px solid currentColor;padding-top:.02em}
sup,sub{font-size:.72em;line-height:0}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
@media (max-width:32rem){.qc{grid-template-columns:2.3rem 1fr}.body{padding:.8rem .75rem}}

ol.opts{margin:.2rem 0 0;padding-left:1.5rem;font-size:.95rem;color:var(--ink2);font-family:var(--serif)}
ol.opts li{margin:.28rem 0;padding:.1rem .3rem;border-radius:4px}
ol.opts li.ok{background:var(--ok-bg);color:var(--ok);font-weight:600}
ol.opts li.ok::marker{font-weight:700}
.okmark{font-size:.66rem;font-weight:700;margin-left:.45rem;padding:.05rem .35rem;
  border-radius:3px;background:var(--ok);color:var(--card);vertical-align:.1em}

</style>

<div class="bar"><div class="in">
  <span class="cnt"><b id="cd">0</b>/${N} 已定</span>
  <span class="prog"><i id="pb"></i></span>
  <span class="cnt"><span class="a">批准 <b id="ca">0</b></span> · <span class="r">駁回 <b id="cr">0</b></span></span>
</div></div>

<div class="w">
<h1>${TITLE}</h1>
<p class="lede">合共 <b>${N} 條</b>，機器閘全部通過，<b>真人一條都未審過</b>。</p>

<div class="meta">
  <span>題數 <b>${N}</b></span>
  ${marksTotal ? `<span>總分值 <b>${marksTotal}</b></span>` : ''}
  <span>${Object.entries(byDiff).map(([k, v]) => `${({ basic: '基礎', intermediate: '中等', hard: '進階', easy: '基礎', medium: '中等' })[k] || k} <b>${v}</b>`).join(' · ')}</span>
  <span>${Object.entries(byType).map(([k, v]) => `${k} <b>${v}</b>`).join(' · ')}</span>
</div>

<div class="note">
  <h3>機器閘檢查咗乜、冇檢查乜</h3>
  <p>機器閘（<code>_gate.mjs</code>）驗咗格式、重複題、術語紅線 —— ${N} 條全部通過，0 條被自動剔走。
  <b>但機器由頭到尾冇檢查過答案啱唔啱</b>，嗰個係生死線，只有人可以判。你喺呢度要睇嘅就係嗰樣。</p>
  <p>評分準則／參考答案<b>只係畀人眼同學生自評用</b>。平台唔會、亦唔可以攞佢嚟自動批改長答題（憲章 §16.A）。</p>
</div>
${NOTE ? `<div class="note w-">${NOTE}</div>` : ''}

<div id="qs"></div>

<div class="out">
  <h2>匯出審批結果</h2>
  <p class="lede" style="margin:0">填名 → 撳「產生結果」→ <b>全選複製</b>下面嗰格，貼返落對話。呢一頁唔會自己儲存任何嘢。</p>
  <label for="rev">審核人姓名（唔可以留白 —— 簽名要有人）</label>
  <input id="rev" placeholder="例：brian" autocomplete="off">
  <div class="acts"><button onclick="build()">產生結果</button></div>
  <p class="hint" id="hint"></p>
  <label for="o">結果（複製呢格）</label>
  <textarea id="o" readonly placeholder="撳「產生結果」之後會出現喺呢度"></textarea>
</div>
</div>

<script type="application/json" id="D">${json}</script>
<script>
const DATA = JSON.parse(document.getElementById('D').textContent);
const N = DATA.length, TAG = ${JSON.stringify(TAG)}, state = {};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

const SYM = {'\\\\circ':'°','\\\\angle':'∠','\\\\times':'×','\\\\div':'÷','\\\\approx':'≈',
  '\\\\Rightarrow':'⇒','\\\\rightarrow':'→','\\\\triangle':'△','\\\\Delta':'Δ','\\\\neq':'≠',
  '\\\\geq':'≥','\\\\ge':'≥','\\\\leq':'≤','\\\\le':'≤','\\\\pm':'±','\\\\cdot':'·',
  '\\\\alpha':'α','\\\\beta':'β','\\\\theta':'θ','\\\\pi':'π','\\\\ldots':'…','\\\\dots':'…'};
const FN = ['log','sin','cos','tan','ln','max','min','lg'];

function grp(s, i){ let d = 0, j = i;
  for (; j < s.length; j++){ if (s[j] === '{') d++; else if (s[j] === '}'){ d--; if (!d) break; } }
  return [s.slice(i + 1, j), j + 1]; }

function md(s){
  let o = '', i = 0;
  while (i < s.length){
    const c = s[i];
    if (c === '\\\\'){
      const m = /^\\\\[a-zA-Z]+/.exec(s.slice(i));
      if (!m){ const nx = s[i+1] || ''; o += ' ,;!'.includes(nx) ? ' ' : esc(nx); i += 2; continue; }
      const cmd = m[0]; let j = i + cmd.length;
      const eat = () => { while (s[j] === ' ') j++; };
      if (cmd === '\\\\left' || cmd === '\\\\right'){ i = j; continue; }
      if (cmd === '\\\\dfrac' || cmd === '\\\\frac' || cmd === '\\\\tfrac'){
        eat(); const [a, j2] = grp(s, j); j = j2; eat(); const [b, j3] = grp(s, j);
        o += '<span class="fr"><span class="nu">' + md(a) + '</span><span class="de">' + md(b) + '</span></span>';
        i = j3; continue; }
      if (cmd === '\\\\sqrt'){ eat(); const [a, j2] = grp(s, j);
        o += '<span class="sq">√<span class="rad">' + md(a) + '</span></span>'; i = j2; continue; }
      if (cmd === '\\\\text' || cmd === '\\\\mathrm' || cmd === '\\\\operatorname'){
        eat(); const [a, j2] = grp(s, j); o += '<span class="tx">' + esc(a) + '</span>'; i = j2; continue; }
      if (cmd === '\\\\bar' || cmd === '\\\\overline'){ eat(); const [a, j2] = grp(s, j);
        o += '<span class="ov">' + md(a) + '</span>'; i = j2; continue; }
      if (FN.includes(cmd.slice(1))){ o += '<span class="fn">' + cmd.slice(1) + '</span>'; i = j; continue; }
      if (SYM[cmd] !== undefined){ o += SYM[cmd]; i = j; continue; }
      o += esc(cmd.slice(1)); i = j; continue;
    }
    if (c === '^' || c === '_'){
      const tag = c === '^' ? 'sup' : 'sub'; let j = i + 1, body;
      if (s[j] === '{'){ const [a, j2] = grp(s, j); body = a; j = j2; }
      else if (s[j] === '\\\\'){ const m2 = /^\\\\[a-zA-Z]+/.exec(s.slice(j)); body = m2 ? m2[0] : s[j] || ''; j += body.length; }
      else { body = s[j] || ''; j++; }
      o += '<' + tag + '>' + md(body) + '</' + tag + '>'; i = j; continue;
    }
    if (c === '{' || c === '}'){ i++; continue; }
    o += esc(c); i++;
  }
  return o;
}

function tex(str){
  const parts = String(str).replace(/\\\\\\$/g, '\\u0001').split('$');
  return parts.map((p, k) => k % 2
    ? '<i class="m">' + md(p) + '</i>'
    : esc(p).replace(/\\n/g, '<br>')
  ).join('').replace(/\\u0001/g, '$');
}



const DIFF = { basic:'基礎', easy:'基礎', intermediate:'中等', medium:'中等', hard:'進階' };

document.getElementById('qs').innerHTML = DATA.map((d) => {
  const rail = d.marks !== null
    ? '<div class="rail"><span class="mk">' + d.marks + '</span><span class="mu">分</span></div>'
    : '<div class="rail"><span class="mk">' + d.n + '</span><span class="mu">題</span></div>';
  const opts = d.options
    ? '<ol class="opts">' + d.options.map((o, i) =>
        '<li class="' + (i === d.correctIndex ? 'ok' : '') + '">' + tex(o) +
        (i === d.correctIndex ? '<span class="okmark">正確</span>' : '') + '</li>').join('') + '</ol>'
    : '';
  return '<div class="qc" id="q' + d.n + '">' + rail +
    '<div class="body"><div class="qh">' +
      '<span class="qn">' + d.n + '.</span>' +
      (d.diff ? '<span class="pill d-' + d.diff + '">' + (DIFF[d.diff] || d.diff) + '</span>' : '') +
      '<span class="tp">' + esc(d.topic) + '</span>' +
      '<span class="qid">' + esc(d.id) + '</span>' +
      '<span class="st" id="s' + d.n + '">未定</span>' +
    '</div>' +
    '<div class="stem">' + tex(d.q) + '</div>' + opts +
    (d.ans ? '<div class="sec"><h4>參考答案</h4><div class="ans">' + tex(d.ans) + '</div></div>' : '') +
    (d.ms ? '<div class="sec"><h4>評分準則 / 自評對照（人眼參考，非自動批改）</h4><div class="ms">' + tex(d.ms) + '</div></div>' : '') +
    (d.ex ? '<div class="sec"><h4>解析</h4><div class="ex">' + tex(d.ex) + '</div></div>' : '') +
    '<div class="acts">' +
      '<button class="y" data-n="' + d.n + '" data-v="approved">批准</button>' +
      '<button class="n" data-n="' + d.n + '" data-v="rejected">駁回</button>' +
    '</div></div></div>';
}).join('');

document.getElementById('qs').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-n]');
  if (b) mark(Number(b.dataset.n), b.dataset.v);
});

function mark(n, v){
  const c = document.getElementById('q' + n), s = document.getElementById('s' + n);
  state[n] = v;
  c.classList.toggle('ap', v === 'approved'); c.classList.toggle('rj', v === 'rejected');
  s.textContent = v === 'approved' ? '已批准' : '已駁回';
  s.className = 'st ' + (v === 'approved' ? 'a' : 'r');
  counts();
  const nx = document.getElementById('q' + (n + 1));
  if (nx) nx.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function counts(){
  const v = Object.values(state), a = v.filter((x) => x === 'approved').length;
  document.getElementById('cd').textContent = v.length;
  document.getElementById('ca').textContent = a;
  document.getElementById('cr').textContent = v.length - a;
  document.getElementById('pb').style.width = (v.length / N * 100) + '%';
}
function rng(list){ const out = []; let i = 0;
  while (i < list.length){ let j = i;
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++;
    out.push(i === j ? String(list[i]) : list[i] + '-' + list[j]); i = j + 1; }
  return out.join(',') || '無'; }
function build(){
  const name = document.getElementById('rev').value.trim();
  const h = document.getElementById('hint'), o = document.getElementById('o');
  if (!name){ h.textContent = '⚠️ 未填名。呢一欄唔可以留白 —— 簽名要有人。'; return; }
  const done = Object.keys(state).length;
  h.textContent = done < N ? '⚠️ 仲有 ' + (N - done) + ' 條未定。未定嘅唔會入庫。' : '✅ ' + N + ' 條全部已定。';
  const ap = [], rj = [];
  for (let n = 1; n <= N; n++){ if (state[n] === 'approved') ap.push(n); else if (state[n] === 'rejected') rj.push(n); }
  o.value = TAG + ' 審批結果\\n審核人：' + name +
    '\\n日期：' + new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date()) +
    '\\n批准（' + ap.length + '）：' + rng(ap) +
    '\\n駁回（' + rj.length + '）：' + rng(rj);
  o.focus(); o.select();
}
counts();
</script>
`

writeFileSync(OUT, html)
console.log(`✓ ${N} 條 → ${OUT}`)
console.log(`  題型 ${JSON.stringify(byType)} · 難度 ${JSON.stringify(byDiff)}${marksTotal ? ' · 總分 ' + marksTotal : ''}`)
