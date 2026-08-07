// ============================================================================
// review-translations.mjs — 譯稿逐條人手覆核表（translation-batch 專用）
// ----------------------------------------------------------------------------
// 同 review-drafts.mjs 嘅分別：呢度覆核嘅【唔係】題目本身。題目早已由真人批核
// 並且已經入庫，中文內容、選項次序、correctIndex 一律不動。要批嘅只有一件事：
//
//     英文欄譯得啱唔啱、學生睇英文介面時會唔會被誤導。
//
// 所以卡片用中英對照排版，正解喺兩邊同時標綠 —— 覆核人一眼睇到譯文有冇偷偷
// 換咗正解嘅意思（呢個係補譯最危險嘅失誤：選項會洗牌，譯錯一個選項就等於
// 英文介面同中文介面係兩條唔同嘅題）。
//
// 用法：  node scripts/qbank/review-translations.mjs scripts/qbank/drafts/<name>.json
// 輸出：  <name>.review.html   <name>.decisions.json（全部 pending）
// 匯出格式同 review-drafts.mjs 一致，方便日後接上同一套 promote 流程。
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

const IN = process.argv[2]
if (!IN) {
  console.error('用法: node scripts/qbank/review-translations.mjs <drafts/xxx.json>')
  process.exit(1)
}

const doc = JSON.parse(readFileSync(IN, 'utf8'))
if (doc.kind !== 'translation-batch') {
  console.error(`❌ ${basename(IN)} 唔係 translation-batch（kind=${doc.kind}）—— 新題目請用 review-drafts.mjs`)
  process.exit(1)
}

const items = doc.items ?? []
const base = basename(IN).replace(/\.json$/, '')
const outDir = dirname(IN)
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

// ── 客觀閘（機器只查得到嘅嘢；譯文準確與否唔係機器判得到）
const problems = []
for (const it of items) {
  if (it.en.optionsEn.length !== it.zh.options.length) {
    problems.push(`${it.id}: 中英選項數目唔同 (${it.zh.options.length} vs ${it.en.optionsEn.length})`)
  }
  const bad = it.en.optionsEn.findIndex((o) => typeof o !== 'string' || !o.trim())
  if (bad >= 0) problems.push(`${it.id}: optionsEn[${bad}] 空白`)
  for (const [k, v] of [['contentEn', it.en.contentEn], ['explanationEn', it.en.explanationEn]]) {
    if (typeof v !== 'string' || !v.trim()) problems.push(`${it.id}: ${k} 空白`)
    else if (((v.match(/(?<!\\)\$/g) ?? []).length) % 2) problems.push(`${it.id}: ${k} 嘅 $ 唔平衡（KaTeX 會食咗成段）`)
  }
}
if (problems.length) {
  console.error(`❌ 客觀閘攔住 ${problems.length} 項，未生成覆核表：`)
  problems.slice(0, 20).forEach((p) => console.error('   ' + p))
  process.exit(1)
}

const decPath = join(outDir, `${base}.decisions.json`)
const decisions = { _meta: { source: basename(IN), subject: 'translation', reviewer: '', reviewedAt: '' }, decisions: {} }
for (const it of items) decisions.decisions[it.id] = 'pending'
writeFileSync(decPath, JSON.stringify(decisions, null, 2) + '\n')

const data = JSON.stringify(items).replace(/</g, '\\u003c')
const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>譯稿覆核 · ${esc(base)}</title>
<style>
  :root { --bg:#0b1020; --card:#141b2e; --line:#28324a; --ink:#e8ecf5; --dim:#9aa5bf; --ok:#22c55e; --no:#ef4444; --wait:#f5b942; --accent:#5b8cff; }
  * { box-sizing:border-box; } body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.6 -apple-system,BlinkMacSystemFont,"PingFang HK","Microsoft JhengHei",sans-serif; padding-bottom:96px; }
  header { padding:20px 24px; border-bottom:1px solid var(--line); }
  h1 { margin:0 0 6px; font-size:22px; } .sub { color:var(--dim); font-size:15px; }
  .wrap { max-width:1180px; margin:0 auto; padding:20px 16px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:20px 22px; margin:18px 0; }
  .card.approved { border-color:var(--ok); box-shadow:0 0 0 1px var(--ok) inset; }
  .card.rejected { border-color:var(--no); opacity:.55; }
  .meta { display:flex; gap:10px; align-items:center; flex-wrap:wrap; font-size:13px; color:var(--dim); margin-bottom:12px; }
  .badge { padding:2px 10px; border-radius:999px; border:1px solid var(--line); }
  .cols { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  @media (max-width:900px) { .cols { grid-template-columns:1fr; } }
  .col h3 { margin:0 0 8px; font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--dim); font-weight:700; }
  .col.en h3 { color:var(--accent); }
  .q { font-size:18px; font-weight:600; margin:0 0 12px; white-space:pre-wrap; }
  ul { list-style:none; margin:0 0 12px; padding:0; } li { padding:8px 12px; border:1px solid var(--line); border-radius:10px; margin:6px 0; white-space:pre-wrap; font-size:15px; }
  li.correct { border-color:var(--ok); background:rgba(34,197,94,.10); font-weight:600; }
  li.correct::before { content:"✅ "; }
  .exp { color:var(--dim); font-size:14px; background:rgba(91,140,255,.07); border-left:3px solid var(--accent); padding:10px 12px; border-radius:0 8px 8px 0; white-space:pre-wrap; }
  .acts { display:flex; gap:10px; margin-top:16px; } .acts button { flex:1; min-height:52px; font-size:17px; font-weight:700; border-radius:12px; border:2px solid var(--line); background:transparent; color:var(--ink); cursor:pointer; }
  .acts .a.on { background:var(--ok); border-color:var(--ok); color:#04140a; } .acts .r.on { background:var(--no); border-color:var(--no); color:#fff; } .acts .p.on { background:var(--wait); border-color:var(--wait); color:#1a1200; }
  footer { position:fixed; left:0; right:0; bottom:0; background:#0b1020ee; backdrop-filter:blur(8px); border-top:1px solid var(--line); padding:12px 16px; }
  .fwrap { max-width:1180px; margin:0 auto; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  .counts { font-size:15px; } .counts b { font-size:18px; } .grow { flex:1; }
  input#rev { min-height:44px; padding:0 12px; border-radius:10px; border:1px solid var(--line); background:var(--card); color:var(--ink); font-size:15px; }
  button#exp { min-height:48px; padding:0 20px; font-size:16px; font-weight:800; border-radius:12px; border:none; background:var(--accent); color:#fff; cursor:pointer; }
  .hint { color:var(--dim); font-size:13px; padding:0 16px 8px; max-width:1180px; margin:0 auto; }
  .note { color:var(--wait); font-size:13px; }
</style></head><body>
<header><div class="wrap" style="padding-bottom:0"><h1>🌐 譯稿逐條覆核 — <span style="color:var(--accent)">補英文欄</span></h1>
<div class="sub">來源 ${esc(basename(IN))} · 共 ${items.length} 條。呢啲題目早已入庫，中文內容／選項次序／correctIndex <b>一律不動</b>。
<span class="note">你要批嘅只有一件事：英文譯得啱唔啱。</span></div></div></header>
<div class="hint">⌨️ <b>A</b> 通過 · <b>R</b> 退回 · <b>P</b> 待定 · <b>J / K</b> 上／下一條。
⚠️ 重點睇：正解（綠色）嘅英文有冇改變意思 —— 選項喺練習時會洗牌，譯錯一個正解就等於英文介面同中文介面係兩條唔同嘅題。</div>
<div class="wrap" id="list"></div>
<footer><div class="fwrap">
  <span class="counts">✅ <b id="cA">0</b> 通過 · ❌ <b id="cR">0</b> 退回 · ⏳ <b id="cP">${items.length}</b> 待定</span>
  <span class="grow"></span>
  <input id="rev" placeholder="覆核人姓名（會蓋印落題庫）" />
  <button id="exp">⬇️ 匯出審批結果 (decisions.json)</button>
</div></div>
<script>
const DATA = ${data};
const state = {}; DATA.forEach(d => state[d.id] = 'pending');
const list = document.getElementById('list');
const diffZh = { easy:'補底 L4', medium:'普通 L5', hard:'拔尖 5**' };
function escape(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
DATA.forEach((d, i) => {
  const el = document.createElement('div'); el.className='card'; el.id='c'+i;
  const opts = (arr) => '<ul>' + arr.map((o,oi)=>'<li class="'+(oi===d.correctIndex?'correct':'')+'">'+escape(o)+'</li>').join('') + '</ul>';
  el.innerHTML =
    '<div class="meta"><span class="badge">#'+(i+1)+'</span><span class="badge">'+escape(d.id)+'</span>'+
    '<span class="badge">'+escape(d.subject)+'</span><span class="badge">'+escape(d.topicZh||'')+'</span>'+
    '<span class="badge">'+(diffZh[d.difficulty]||d.difficulty)+'</span>'+
    '<span class="badge" style="color:var(--dim)">'+escape(d.sourceFile||'')+'</span></div>'+
    '<div class="cols">'+
      '<div class="col"><h3>中文（已入庫，不動）</h3><div class="q">'+escape(d.zh.content)+'</div>'+
        opts(d.zh.options)+'<div class="exp">💡 '+escape(d.zh.explanation)+'</div></div>'+
      '<div class="col en"><h3>English（新增譯稿 — 覆核對象）</h3><div class="q">'+escape(d.en.contentEn)+'</div>'+
        opts(d.en.optionsEn)+'<div class="exp">💡 '+escape(d.en.explanationEn)+'</div></div>'+
    '</div>'+
    '<div class="acts"><button class="a" onclick="mark('+i+',\\'approved\\')">✅ 通過</button>'+
    '<button class="r" onclick="mark('+i+',\\'rejected\\')">❌ 退回</button>'+
    '<button class="p on" onclick="mark('+i+',\\'pending\\')">⏳ 待定</button></div>';
  list.appendChild(el);
});
let cur = 0;
function mark(i, v){ const d=DATA[i]; state[d.id]=v; const el=document.getElementById('c'+i);
  el.classList.toggle('approved', v==='approved'); el.classList.toggle('rejected', v==='rejected');
  el.querySelector('.a').classList.toggle('on', v==='approved');
  el.querySelector('.r').classList.toggle('on', v==='rejected');
  el.querySelector('.p').classList.toggle('on', v==='pending'); counts(); }
function counts(){ let a=0,r=0,p=0; for(const k in state){ if(state[k]==='approved')a++; else if(state[k]==='rejected')r++; else p++; }
  document.getElementById('cA').textContent=a; document.getElementById('cR').textContent=r; document.getElementById('cP').textContent=p; }
function focusCard(i){ cur=Math.max(0,Math.min(DATA.length-1,i)); document.getElementById('c'+cur).scrollIntoView({behavior:'smooth',block:'center'}); }
document.addEventListener('keydown', e=>{ if(e.target.tagName==='INPUT')return; const k=e.key.toLowerCase();
  if(k==='j'){focusCard(cur+1);} else if(k==='k'){focusCard(cur-1);}
  else if(k==='a'){mark(cur,'approved');focusCard(cur+1);}
  else if(k==='r'){mark(cur,'rejected');focusCard(cur+1);} else if(k==='p'){mark(cur,'pending');} });
document.getElementById('exp').addEventListener('click', ()=>{
  const out = { _meta: { source: ${JSON.stringify(basename(IN))}, subject: 'translation',
    reviewer: document.getElementById('rev').value.trim(), reviewedAt: new Date().toISOString().slice(0,10) }, decisions: state };
  const blob = new Blob([JSON.stringify(out,null,2)+'\\n'], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=${JSON.stringify(base + '.decisions.json')}; a.click();
});
counts();
</script></body></html>`

const htmlPath = join(outDir, `${base}.review.html`)
writeFileSync(htmlPath, html)

const byS = items.reduce((a, x) => ((a[x.subject] = (a[x.subject] ?? 0) + 1), a), {})
console.log(`\n${'═'.repeat(70)}\n  譯稿覆核表已生成\n${'═'.repeat(70)}`)
console.log(`  總數 ${items.length} 條 · ${Object.entries(byS).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
console.log(`  🤖 客觀閘（選項數／空白／$ 平衡）: 0 項不合格`)
console.log(`  👤 等待真人逐條覆核: ${items.length}`)
console.log(`\n  open ${htmlPath}`)
console.log(`  批完匯出，覆蓋 ${basename(decPath)}，再套用入庫。`)
console.log(`  ⚠️ 機器唔會自動入庫 —— reviewer 欄留白畀真人。\n`)
