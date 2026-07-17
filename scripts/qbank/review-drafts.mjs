#!/usr/bin/env node
// ============================================================================
// review-drafts.mjs — STEP 1 of the human-review draft pipeline.
// ----------------------------------------------------------------------------
// Takes a spec-format drafts JSON (same shape scripts/import-bank.mjs expects:
// {id,type:'mc',subject,topic,difficulty,question,options[4],correctIndex,
//  explanation}) and:
//   1. runs the OBJECTIVE gate (_gate.mjs) — auto-rejects malformed / duplicate /
//      term-red-line rows so a human never wastes time on machine-catchable junk;
//   2. emits a self-contained HTML review sheet (opens in any browser, no server,
//      no deps) where a person approves / rejects EACH surviving draft on the one
//      thing a machine must not decide — academic correctness;
//   3. writes a decisions.json template (all "pending") as a CLI fallback.
//
// It writes NOTHING to any question bank. Promotion to a bank happens only in
// STEP 2 (promote-drafts.mjs) and only for rows a human marked "approved".
//
//   node scripts/qbank/review-drafts.mjs --in scripts/qbank/drafts/econ.json --subject economics
//
// Output (next to the input file):  <name>.review.html   <name>.decisions.json
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { gateRow, norm } from './_gate.mjs'

const args = process.argv.slice(2)
const arg = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d }
const IN = arg('in')
const SUBJECT = arg('subject')
if (!IN || !SUBJECT) {
  console.error('usage: node scripts/qbank/review-drafts.mjs --in <drafts.json> --subject <subjectId>')
  process.exit(2)
}

let raw
try { raw = JSON.parse(readFileSync(IN, 'utf8')) } catch (err) { console.error(`✗ cannot read/parse ${IN}: ${err.message}`); process.exit(1) }
if (!Array.isArray(raw)) { console.error(`✗ ${IN} must be a JSON array of question drafts`); process.exit(1) }

// ── objective gate + within-file dedup ──────────────────────────────────────
const survivors = []
const rejected = []
const seenIds = new Set()
const seenQ = new Set()
for (let i = 0; i < raw.length; i++) {
  const row = raw[i]
  const errs = gateRow(row, SUBJECT)
  const id = typeof row?.id === 'string' ? row.id.trim() : `#${i}`
  if (seenIds.has(id)) errs.push('duplicate id (already seen in this file)')
  if (typeof row?.question === 'string' && seenQ.has(norm(row.question))) errs.push('duplicate question text (already seen)')
  if (errs.length) { rejected.push({ index: i, id, reasons: errs }); continue }
  seenIds.add(id); seenQ.add(norm(row.question))
  survivors.push(row)
}

// ── report ──────────────────────────────────────────────────────────────────
const tally = {}
for (const r of rejected) for (const reason of r.reasons) tally[reason] = (tally[reason] || 0) + 1
console.log(`\n📋 Draft review gate — ${basename(IN)}  ·  subject "${SUBJECT}"`)
console.log(`   total ${raw.length}  ·  🤖 auto-rejected ${rejected.length}  ·  👤 awaiting HUMAN review ${survivors.length}`)
if (rejected.length) {
  console.log('   auto-reject reasons:')
  for (const [reason, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`     ${String(n).padStart(4)} × ${reason}`)
}
if (!survivors.length) { console.log('\n   nothing survived the objective gate — no review sheet written.\n'); process.exit(rejected.length ? 1 : 0) }

// ── outputs ───────────────────────────────────────────────────────────────────
const base = basename(IN).replace(/\.json$/i, '')
const outDir = dirname(IN)
const htmlPath = join(outDir, `${base}.review.html`)
const decPath = join(outDir, `${base}.decisions.json`)

// decisions.json template — all pending
const decisions = { _meta: { source: basename(IN), subject: SUBJECT, reviewer: '', reviewedAt: '' }, decisions: {} }
for (const r of survivors) decisions.decisions[r.id.trim()] = 'pending'
writeFileSync(decPath, JSON.stringify(decisions, null, 2) + '\n')

writeFileSync(htmlPath, renderHtml(survivors, SUBJECT, basename(IN)))
console.log(`\n✓ review sheet:  ${htmlPath}`)
console.log(`  → open it in a browser, approve/reject each question, click 「匯出審批結果」,`)
console.log(`    save the download OVER ${basename(decPath)}, then run promote-drafts.mjs.\n`)
process.exit(0)

// ── self-contained HTML review sheet ──────────────────────────────────────────
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }
function renderHtml(rows, subject, srcName) {
  const cards = rows.map((r) => ({
    id: r.id.trim(), topic: r.topic, difficulty: r.difficulty,
    question: r.question, options: r.options, correctIndex: r.correctIndex, explanation: r.explanation,
    // v2026.07.16-FINAL-QUALITY 覆核元數據（如有）：干擾項設計理由 + 錯因 DNA
    trapTypes: Array.isArray(r.trapTypes) ? r.trapTypes : null,
    dnaTag: typeof r.dnaTag === 'string' ? r.dnaTag : null,
    mother: typeof r._mother === 'string' ? r._mother : null,
  }))
  const data = JSON.stringify(cards).replace(/</g, '\\u003c')
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>人手覆核 · ${esc(subject)} · ${esc(srcName)}</title>
<style>
  :root { --bg:#0b1020; --card:#141b2e; --line:#28324a; --ink:#e8ecf5; --dim:#9aa5bf; --ok:#22c55e; --no:#ef4444; --wait:#f5b942; --accent:#5b8cff; }
  * { box-sizing:border-box; } body { margin:0; background:var(--bg); color:var(--ink); font:17px/1.6 -apple-system,BlinkMacSystemFont,"PingFang HK","Microsoft JhengHei",sans-serif; padding-bottom:96px; }
  header { padding:20px 24px; border-bottom:1px solid var(--line); }
  h1 { margin:0 0 6px; font-size:22px; } .sub { color:var(--dim); font-size:15px; }
  .wrap { max-width:860px; margin:0 auto; padding:20px 16px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:20px 22px; margin:18px 0; }
  .card.approved { border-color:var(--ok); box-shadow:0 0 0 1px var(--ok) inset; }
  .card.rejected { border-color:var(--no); opacity:.55; }
  .meta { display:flex; gap:10px; align-items:center; flex-wrap:wrap; font-size:13px; color:var(--dim); margin-bottom:10px; }
  .badge { padding:2px 10px; border-radius:999px; border:1px solid var(--line); }
  .q { font-size:19px; font-weight:600; margin:6px 0 14px; white-space:pre-wrap; }
  ul { list-style:none; margin:0 0 14px; padding:0; } li { padding:9px 14px; border:1px solid var(--line); border-radius:10px; margin:7px 0; white-space:pre-wrap; }
  li.correct { border-color:var(--ok); background:rgba(34,197,94,.10); font-weight:600; }
  li.correct::before { content:"✅ "; }
  .exp { color:var(--dim); font-size:15px; background:rgba(91,140,255,.07); border-left:3px solid var(--accent); padding:10px 14px; border-radius:0 8px 8px 0; white-space:pre-wrap; }
  .acts { display:flex; gap:10px; margin-top:16px; } .acts button { flex:1; min-height:52px; font-size:17px; font-weight:700; border-radius:12px; border:2px solid var(--line); background:transparent; color:var(--ink); cursor:pointer; }
  .acts .a.on { background:var(--ok); border-color:var(--ok); color:#04140a; } .acts .r.on { background:var(--no); border-color:var(--no); color:#fff; } .acts .p.on { background:var(--wait); border-color:var(--wait); color:#1a1200; }
  footer { position:fixed; left:0; right:0; bottom:0; background:#0b1020ee; backdrop-filter:blur(8px); border-top:1px solid var(--line); padding:12px 16px; }
  .fwrap { max-width:860px; margin:0 auto; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  .counts { font-size:15px; } .counts b { font-size:18px; } .grow { flex:1; }
  input#rev { min-height:44px; padding:0 12px; border-radius:10px; border:1px solid var(--line); background:var(--card); color:var(--ink); font-size:15px; }
  button#exp { min-height:48px; padding:0 20px; font-size:16px; font-weight:800; border-radius:12px; border:none; background:var(--accent); color:#fff; cursor:pointer; }
  .hint { color:var(--dim); font-size:13px; padding:0 16px 8px; max-width:860px; margin:0 auto; }
  .note { color:var(--wait); font-size:13px; }
</style></head><body>
<header><div class="wrap" style="padding-bottom:0"><h1>👤 人手逐題覆核 — <span style="color:var(--accent)">${esc(subject)}</span></h1>
<div class="sub">來源 ${esc(srcName)} · 共 ${cards.length} 題已通過機器客觀閘（格式／去重／術語）。<span class="note">機器唔判對錯 —— 每題嘅學術正確與否，由你決定。</span></div></div></header>
<div class="hint">⌨️ 快捷鍵：<b>A</b> 通過 · <b>R</b> 退回 · <b>P</b> 待定 · <b>J / K</b> 上一題／下一題。數學題以原始 $LaTeX$ 顯示（如需精確排版可喺 preview 對照）。</div>
<div class="wrap" id="list"></div>
<footer><div class="fwrap">
  <span class="counts">✅ <b id="cA">0</b> 通過 · ❌ <b id="cR">0</b> 退回 · ⏳ <b id="cP">${cards.length}</b> 待定</span>
  <span class="grow"></span>
  <input id="rev" placeholder="覆核人姓名（會蓋印落題庫）" />
  <button id="exp">⬇️ 匯出審批結果 (decisions.json)</button>
</div></div>
<script>
const DATA = ${data};
const SUBJECT = ${JSON.stringify(subject)};
const state = {}; DATA.forEach(d => state[d.id] = 'pending');
const list = document.getElementById('list');
const diffZh = { easy:'補底 L4', medium:'普通 L5', hard:'拔尖 5**', basic:'補底 L4', intermediate:'普通 L5' };
// 質量憲章元數據標籤（審批人參考 —— 唔會入庫）
const trapZh = { correct:'正解', half_right:'半對半錯', over_interpretation:'過度推論', irrelevant:'無關干擾', concept_swap:'概念偷換', concept_reversal:'概念顛倒', keyword_misread:'審題字詞' };
const dnaZh = { CMT:'🧠 CMT 概念盲區 (A)', TMR:'🎯 TMR 審題陷阱 (B)', MEC:'🧮 MEC 運算粗心 (C)' };
DATA.forEach((d, i) => {
  const el = document.createElement('div'); el.className = 'card'; el.id = 'c'+i; el.dataset.i = i;
  const trapTag = (oi) => d.trapTypes && d.trapTypes[oi] && d.trapTypes[oi] !== 'correct'
    ? \` <span style="font-size:12px;color:var(--wait);border:1px solid var(--line);border-radius:999px;padding:1px 8px;white-space:nowrap">\${trapZh[d.trapTypes[oi]]||escape(d.trapTypes[oi])}</span>\`
    : '';
  el.innerHTML = \`<div class="meta"><span class="badge">#\${i+1}</span><span class="badge">\${d.id}</span><span class="badge">\${d.topic}</span><span class="badge">\${diffZh[d.difficulty]||d.difficulty}</span>\${d.dnaTag?\`<span class="badge" style="color:var(--wait)">\${dnaZh[d.dnaTag]||d.dnaTag}</span>\`:''}\${d.mother?\`<span class="badge">模板 \${escape(d.mother)}</span>\`:''}</div>
  <div class="q">\${escape(d.question)}</div>
  <ul>\${d.options.map((o,oi)=>\`<li class="\${oi===d.correctIndex?'correct':''}">\${escape(o)}\${trapTag(oi)}</li>\`).join('')}</ul>
  <div class="exp">💡 \${escape(d.explanation)}</div>
  <div class="acts"><button class="a" onclick="mark(\${i},'approved')">✅ 通過</button><button class="r" onclick="mark(\${i},'rejected')">❌ 退回</button><button class="p on" onclick="mark(\${i},'pending')">⏳ 待定</button></div>\`;
  list.appendChild(el);
});
function escape(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
let cur = 0;
function mark(i, v){ const d = DATA[i]; state[d.id] = v; const el = document.getElementById('c'+i);
  el.classList.toggle('approved', v==='approved'); el.classList.toggle('rejected', v==='rejected');
  el.querySelector('.a').classList.toggle('on', v==='approved'); el.querySelector('.r').classList.toggle('on', v==='rejected'); el.querySelector('.p').classList.toggle('on', v==='pending');
  counts(); }
function counts(){ let a=0,r=0,p=0; for(const k in state){ if(state[k]==='approved')a++; else if(state[k]==='rejected')r++; else p++; }
  document.getElementById('cA').textContent=a; document.getElementById('cR').textContent=r; document.getElementById('cP').textContent=p; }
function focusCard(i){ cur=Math.max(0,Math.min(DATA.length-1,i)); document.getElementById('c'+cur).scrollIntoView({behavior:'smooth',block:'center'}); }
document.addEventListener('keydown', e=>{ if(e.target.tagName==='INPUT')return; const k=e.key.toLowerCase();
  if(k==='j'){focusCard(cur+1);} else if(k==='k'){focusCard(cur-1);}
  else if(k==='a'){mark(cur,'approved');focusCard(cur+1);} else if(k==='r'){mark(cur,'rejected');focusCard(cur+1);} else if(k==='p'){mark(cur,'pending');} });
document.getElementById('exp').addEventListener('click', ()=>{
  const out = { _meta: { source: ${JSON.stringify(srcName)}, subject: SUBJECT, reviewer: document.getElementById('rev').value.trim(), reviewedAt: new Date().toISOString().slice(0,10) }, decisions: state };
  const blob = new Blob([JSON.stringify(out,null,2)+'\\n'], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ${JSON.stringify(base + '.decisions.json')}; a.click();
});
counts();
</script></body></html>`
}
