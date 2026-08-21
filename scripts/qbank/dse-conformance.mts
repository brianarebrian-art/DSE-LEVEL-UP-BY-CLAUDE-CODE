// ============================================================================
// scripts/qbank/dse-conformance.mts
// 「呢個題庫似唔似真係 DSE？」—— 可重跑嘅客觀審核。
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/dse-conformance.mts            # 報告
//   npx tsx scripts/qbank/dse-conformance.mts --strict   # 有問題就 exit 1
//
// 六項檢查，全部【客觀可量度】。呢個閘唔判斷「答案啱唔啱」——嗰樣永遠係真人嘅事
// （見 _gate.mjs 開頭）。佢只答一條問題：**呢批題目擺出嚟，似唔似考生將來真係要
// 面對嗰份卷？**
//
// 1. 卷面題型真實度 —— 對住 data/dse-paper-formats.ts（逐科核過官方大綱）。
//    有 10 科真實 DSE 卷面根本冇 MC，佢哋嘅 MC 只可以當「知識檢查」。
// 2. 難度可達性 —— 一節 20 題要 6 易 / 10 中 / 4 難。夠唔夠貨？
//    ⚠️ 更正（2026-08-21）：3:5:2 係【本平台憲章自己訂嘅抽樣規則】，
//    唔係考評局標準。考評局並無公布任何易／中／難百分比 —— 難度由審題委員會
//    按 specification grid 控制，成績以水平參照方式匯報。本報告第一版把 3:5:2
//    當成「DSE 難度要求」講，係我寫錯咗，現更正。
//    官方真正明文寫低嘅係【按卷別分段嘅範圍梯度】，記錄喺 data/dse-paper-formats.ts。
// 3. 模板複製率 —— 將數字抽走之後，有幾多題其實係同一條題目換個數。
// 4. 題幹實質度 —— DSE MC 題幹通常帶情境／數據；一行 recall 唔係 DSE。
// 5. 孤兒 topic id —— 中文字做 id 嘅 ad-hoc topic（唔會出現喺主題篩選）。
// 6. 書寫題比例 —— 長／填充題對 MC 應為 1:10。
// ============================================================================

import { getActiveSubjects } from '../../data/subjects.ts'
import { getSubjectQuestions } from '../../data/questions/index.ts'
import { DSE_PAPER_FORMATS, getPaperFormat } from '../../data/dse-paper-formats.ts'

const STRICT = process.argv.includes('--strict')
const SESSION = 20
const TARGET = { easy: Math.round(SESSION * 0.3), medium: 0, hard: Math.round(SESSION * 0.2) }
TARGET.medium = SESSION - TARGET.easy - TARGET.hard

/** 題幹骨架：抽走所有數字／單位／LaTeX 數值，剩返「句型」。 */
function skeleton(s: string): string {
  return String(s)
    .replace(/\\[a-zA-Z]+/g, '') // LaTeX 指令
    .replace(/[\d０-９]+(\.[\d]+)?/g, '#') // 所有數字 → #
    .replace(/[\s{}()（）$,，.。、]/g, '')
    .toLowerCase()
}

type Row = Record<string, unknown> & {
  type: string; difficulty: 'easy' | 'medium' | 'hard'; topic: string; content: string
}

const problems: string[] = []
const bad = (s: string) => { problems.push(s) }

console.log('='.repeat(78))
console.log('DSE 卷面真實度審核 —— 對比香港考試及評核局評核大綱（2026-08-21 逐科下載核對）')
console.log('注意：考評局【並無】公布易／中／難百分比。凡本報告提到 3:5:2，均指本平台憲章嘅抽樣規則。')
console.log('='.repeat(78))

// ── 1. 卷面題型真實度 ───────────────────────────────────────────────────────
console.log('\n【1】卷面題型真實度 —— 真實 DSE 試卷有冇多項選擇題？\n')
const noMCSubjects: { id: string; mc: number }[] = []
let mcInNoMC = 0
for (const s of getActiveSubjects()) {
  const qs = getSubjectQuestions(s.id) as unknown as Row[]
  const mc = qs.filter((q) => q.type === 'mc').length
  const fmt = getPaperFormat(s.id)
  if (!fmt) { bad(`科目 ${s.id} 未登記卷面結構（data/dse-paper-formats.ts）`); continue }
  if (!fmt.hasMC && mc > 0) { noMCSubjects.push({ id: s.id, mc }); mcInNoMC += mc }
}
if (noMCSubjects.length) {
  console.log(`  ⚠️  ${noMCSubjects.length} 科：真實卷面【冇】MC，但題庫全部係 MC —— 共 ${mcInNoMC} 條`)
  for (const n of noMCSubjects.sort((a, b) => b.mc - a.mc)) {
    console.log(`      ${n.id.padEnd(20)} ${String(n.mc).padStart(4)} 條 MC   真實卷面：${getPaperFormat(n.id)!.formats.join('／')}`)
  }
  console.log('      → 概念仍在課程範圍內，唔應該剷走；但必須標明係「知識檢查」而非卷面題型，')
  console.log('        並且要補回真實題型（論述／資料題／短題）。')
} else {
  console.log('  ✅ 全部科目嘅 MC 都對應真實卷面題型')
}

// ── 1b. MC 覆蓋率 —— 學生淨係做 MC，練到全科幾多分？ ──────────────────────
console.log('\n【1b】分數覆蓋率 —— 一個淨係做 MC 嘅學生，練到全科幾多分？\n')
console.log('  （MC 佔全科總分嘅百分比，由官方大綱原文核出。剩低嘅分數要靠短題、結構題、')
console.log('   論述題、實作 —— 呢啲題型喺本平台嘅覆蓋情況見第 6 節。）\n')
const weighted = DSE_PAPER_FORMATS.filter((f) => typeof f.mcWeightPct === 'number')
  .sort((a, b) => (a.mcWeightPct ?? 0) - (b.mcWeightPct ?? 0))
for (const f of weighted) {
  const bar = '█'.repeat(Math.round((f.mcWeightPct ?? 0) / 2))
  console.log(`  ${f.subject.padEnd(14)} ${String(f.mcWeightPct).padStart(3)}%  ${bar}`)
}
console.log('\n  即係：一個物理考生就算做曬我哋 540 條 MC，練到嘅只係全科 21% 嘅分數。')
console.log('  化學同生物各 18%。呢個唔係題庫唔夠大，係題型單一。')

// ── 2. 難度可達性 ──────────────────────────────────────────────────────────
console.log(`\n【2】難度可達性 —— 一節 ${SESSION} 題要 ${TARGET.easy} 易 / ${TARGET.medium} 中 / ${TARGET.hard} 難\n`)
console.log('    ⚠️ 3:5:2 係本平台憲章自己訂嘅抽樣規則，唔係考評局標準。')
console.log('    考評局並無公布任何易／中／難百分比。呢一節量度嘅係「抽樣派唔派得出」，')
console.log('    唔係「符唔符合 DSE」。真實 DSE 難度梯度按卷別分段，見 data/dse-paper-formats.ts。\n')
console.log('  科目'.padEnd(24) + '易'.padStart(6) + '中'.padStart(6) + '難'.padStart(6) + '   一節實際可派')
let diffFail = 0
for (const s of getActiveSubjects()) {
  const qs = (getSubjectQuestions(s.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  const d = { easy: 0, medium: 0, hard: 0 }
  for (const q of qs) d[q.difficulty]++
  const got = { easy: Math.min(d.easy, TARGET.easy), medium: Math.min(d.medium, TARGET.medium), hard: Math.min(d.hard, TARGET.hard) }
  const short = (TARGET.easy - got.easy) + (TARGET.medium - got.medium) + (TARGET.hard - got.hard)
  if (short > 0) {
    diffFail++
    console.log(`  ${s.id.padEnd(22)}${String(d.easy).padStart(6)}${String(d.medium).padStart(6)}${String(d.hard).padStart(6)}   ${got.easy}/${got.medium}/${got.hard}  ❌ 缺 ${short} 條`)
  }
}
if (diffFail === 0) console.log('  ✅ 每一科都派得出 3:5:2')
else { bad(`${diffFail} 科派唔出憲章嘅 3:5:2 抽樣組合（非考評局標準）`); console.log(`\n  ⚠️  ${diffFail} 科派唔出憲章要求嘅難度組合。`) }

// 主題層 —— 主題篩選練習（?topic=）係真實用戶流程
console.log('\n  主題層（≥10 題而全部同一難度 = 該主題練習會係一面倒）：')
let degenerate = 0
for (const s of getActiveSubjects()) {
  const qs = (getSubjectQuestions(s.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  const byTopic = new Map<string, Record<string, number>>()
  for (const q of qs) {
    const e = byTopic.get(q.topic) ?? { easy: 0, medium: 0, hard: 0 }
    e[q.difficulty]++; byTopic.set(q.topic, e)
  }
  for (const [t, d] of byTopic) {
    const n = d.easy + d.medium + d.hard
    const tiers = [d.easy, d.medium, d.hard].filter((x) => x > 0).length
    if (n >= 10 && tiers === 1) {
      degenerate++
      const only = d.easy ? '全易' : d.medium ? '全中' : '全難'
      console.log(`      ${s.id}/${t} — ${n} 條，${only}`)
    }
  }
}
if (degenerate === 0) console.log('      ✅ 無單一難度主題')
else bad(`${degenerate} 個主題單一難度`)

// ── 3. 模板複製率 ──────────────────────────────────────────────────────────
console.log('\n【3】模板複製率 —— 抽走數字之後，有幾多題其實係同一條？\n')
let totalMC = 0, totalClone = 0
const cloneRows: { id: string; n: number; clones: number; worst: string; worstN: number }[] = []
for (const s of getActiveSubjects()) {
  const qs = (getSubjectQuestions(s.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  if (!qs.length) continue
  const sk = new Map<string, number>()
  for (const q of qs) { const k = skeleton(q.content); sk.set(k, (sk.get(k) ?? 0) + 1) }
  let clones = 0, worst = '', worstN = 0
  for (const [k, n] of sk) { if (n > 1) clones += n - 1; if (n > worstN) { worstN = n; worst = k } }
  totalMC += qs.length; totalClone += clones
  cloneRows.push({ id: s.id, n: qs.length, clones, worst, worstN })
}
cloneRows.sort((a, b) => b.clones / b.n - a.clones / a.n)
console.log('  科目'.padEnd(24) + 'MC'.padStart(6) + '複製'.padStart(7) + '  比率   最大同模板組')
for (const r of cloneRows) {
  const pct = (r.clones / r.n * 100)
  if (pct < 10) continue
  console.log(`  ${r.id.padEnd(22)}${String(r.n).padStart(6)}${String(r.clones).padStart(7)}  ${pct.toFixed(0).padStart(3)}%    ${r.worstN} 條：${r.worst.slice(0, 34)}`)
}
console.log(`\n  全站：${totalClone} / ${totalMC} = ${(totalClone / totalMC * 100).toFixed(1)}% 屬同模板換數字`)
if (totalClone / totalMC > 0.25) bad(`模板複製率 ${(totalClone / totalMC * 100).toFixed(1)}% 過高`)

// ── 4. 題幹實質度 ──────────────────────────────────────────────────────────
console.log('\n【4】題幹實質度 —— DSE MC 題幹通常帶情境／數據；一行 recall 唔係 DSE\n')
const THIN = 40
console.log('  科目'.padEnd(24) + '中位數'.padStart(8) + '  <40字比例')
let thinSubjects = 0
for (const r of cloneRows.slice().sort((a, b) => a.id.localeCompare(b.id))) {
  const qs = (getSubjectQuestions(r.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  const lens = qs.map((q) => q.content.length).sort((a, b) => a - b)
  const med = lens[Math.floor(lens.length / 2)]
  const thin = qs.filter((q) => q.content.length < THIN).length
  const pct = thin / qs.length * 100
  if (pct >= 70) thinSubjects++
  console.log(`  ${r.id.padEnd(22)}${String(med).padStart(8)}    ${pct.toFixed(0).padStart(3)}%${pct >= 70 ? '  ❌' : ''}`)
}
if (thinSubjects) bad(`${thinSubjects} 科有七成以上題幹短於 ${THIN} 字`)

// ── 5. 孤兒 topic id ───────────────────────────────────────────────────────
console.log('\n【5】孤兒 topic id —— 用中文做 id 嘅 ad-hoc 主題\n')
let orphans = 0
for (const s of getActiveSubjects()) {
  const qs = getSubjectQuestions(s.id) as unknown as Row[]
  const badIds = new Set<string>()
  for (const q of qs) if (!/^[a-zA-Z0-9_]+$/.test(q.topic)) badIds.add(q.topic)
  if (badIds.size) { orphans += badIds.size; console.log(`  ${s.id.padEnd(22)} ${badIds.size} 個：${[...badIds].slice(0, 4).join('、')}${badIds.size > 4 ? ' …' : ''}`) }
}
if (orphans === 0) console.log('  ✅ 全部 topic id 都係 slug')
else bad(`${orphans} 個孤兒 topic id`)

// ── 6. 書寫題比例 ──────────────────────────────────────────────────────────
console.log('\n【6】書寫題（長題／填充）對 MC 應為 1:10\n')
let TM = 0, TW = 0
const gapRows: { id: string; mc: number; w: number; need: number }[] = []
for (const s of getActiveSubjects()) {
  const qs = getSubjectQuestions(s.id) as unknown as Row[]
  const mc = qs.filter((q) => q.type === 'mc').length
  const w = qs.filter((q) => q.type === 'text' || q.type === 'long').length
  TM += mc; TW += w
  gapRows.push({ id: s.id, mc, w, need: Math.ceil(mc / 10) })
}
gapRows.sort((a, b) => (b.need - b.w) - (a.need - a.w))
console.log('  科目'.padEnd(24) + 'MC'.padStart(6) + '書寫'.padStart(6) + '應有'.padStart(6) + '  欠')
for (const r of gapRows) {
  const gap = r.need - r.w
  console.log(`  ${r.id.padEnd(22)}${String(r.mc).padStart(6)}${String(r.w).padStart(6)}${String(r.need).padStart(6)}  ${gap > 0 ? `❌ ${gap}` : '✅'}`)
}
console.log(`\n  全站：MC ${TM} / 書寫 ${TW}；1:10 需 ${Math.ceil(TM / 10)}，欠 ${Math.ceil(TM / 10) - TW}`)
if (TW < Math.ceil(TM / 10)) bad(`書寫題欠 ${Math.ceil(TM / 10) - TW} 條`)

// ── 總結 ───────────────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(78))
if (problems.length === 0) console.log('✅ 全部通過')
else { console.log(`發現 ${problems.length} 類問題：`); problems.forEach((p, i) => console.log(`  ${i + 1}. ${p}`)) }
console.log('='.repeat(78))
if (STRICT && problems.length) process.exit(1)
