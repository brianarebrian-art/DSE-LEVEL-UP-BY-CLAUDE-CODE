// ============================================================================
// auto-promote.mts —— 機器閘自動入庫通道（2026-08-22 Yuna 指令）
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/auto-promote.mts --in <drafts.json> --subject <id>
//
// 呢條係 promote-drafts.mjs 【之外】嘅第二條路，唔係取代佢。
//
//   promote-drafts.mjs  →  *-reviewed.ts   真人逐題批 → decisions.json 有實名
//   auto-promote.mts    →  *-auto.ts       機器閘全自動 → 冇實名紀錄
//
// ── 呢條路刻意【唔會】做嘅事 ──────────────────────────────────────────────
// 1. 唔會寫任何真人名入 decisions.json。冇批過就冇簽名，寫咗就係假紀錄。
// 2. 唔會寫任何 decisions 記錄 —— 所以前端 QuestionProvenance 搵唔到紀錄，
//    會照實顯示「經自動檢查 …本題未有實名逐題審批紀錄」。呢個披露一直存在
//    而且一直準確，機器入庫嘅題行返呢個既有分支就啱，唔使改 UI、唔會呃人。
// 3. 唔會標 framework 做「人手核對題」。呢啲題標「機器閘放行題」。
//
// ── 機器閘實際驗咗啲乜（客觀嘢，全部）────────────────────────────────────
//   A. _gate.mjs 全套：格式、四個相異選項、correctIndex 0..3、禁用「以上皆是」、
//      術語紅線（共用品／企業家職能／經濟科超綱彈性）、LaTeX `$` 平衡、
//      貨幣科 bare `$`、書寫題參考答案＋雙語齊備、反向閘（書寫題唔准帶選項）
//   B. 對現有 live 題庫嘅重複度（題幹＋正解 Jaccard，≥45% 直接踢走）
//   C. 批次內部自身重複（id 同題幹）
//   D. topic id 要對得上該科已註冊課題 —— 對唔上就係孤兒題，學生用課題入口
//      永遠篩唔到（實測已造成 58 條）。呢度直接踢走，唔准再製造。
//
// ── 機器閘【驗唔到】嘅嘢（要講清楚）──────────────────────────────────────
//   答案學術上啱唔啱。呢個係人嘅事，機器做唔到，本腳本亦冇扮做到。
//   所以出題嗰邊必須 correct-by-construction（數理科計出嚟）或引可查證原文，
//   而唔係靠呢個閘兜底。閘只係最後一道濾網，唔係品質來源。
//
// 唔過閘嘅行會寫入 <draft>.rejected.json 並列印原因 —— 唔會靜靜雞消失。
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { basename } from 'node:path'
import { gateRow, toReviewedQuestion, norm } from './_gate.mjs'
import { loadSubjectQuestions } from '../../data/questions/load.ts'
import { getSubjectTopics } from '../../data/questions/index.ts'

const args = process.argv.slice(2)
const arg = (n: string, d: string | null = null) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : d
}
const IN = arg('in')
const SUBJECT = arg('subject')
const DRY = args.includes('--dry')
if (!IN || !SUBJECT) {
  console.error('usage: npx tsx scripts/qbank/auto-promote.mts --in <drafts.json> --subject <id> [--dry]')
  process.exit(2)
}

const FAIL_SIM = 0.45

interface Row { id: string; question: string; options?: string[]; correctIndex?: number; topicId?: string; topic?: string; type?: string }
const rows: Row[] = JSON.parse(readFileSync(IN, 'utf8'))
if (!Array.isArray(rows)) { console.error(`✗ ${IN} must be a JSON array`); process.exit(1) }

// ── 對比材料：現有 live 題庫 + 已註冊課題 ──────────────────────────────────
// 對比材料要剔走【本科自己的 auto bank】。否則同一批草稿重跑第二次時，
// 每一行都會與上一次自己入庫的那一行 100% 相同而被踢走，令這條通道變成
// 一次性 —— 補寫、改錯、重新生成檔頭全部做不到。合併本身是按 id 覆寫的，
// 所以剔走之後仍然不會產生重複記錄。
const existing = ((await loadSubjectQuestions(SUBJECT)) as {
  id: string; content: string; framework?: string; options?: string[]; correctIndex?: number
}[]).filter((q) => q.framework !== 'auto')
const validTopics = new Set(getSubjectTopics(SUBJECT).map((t) => t.id))
const existingIds = new Set(existing.map((e) => e.id))

const answerOf = (q: { options?: string[]; correctIndex?: number }) =>
  Array.isArray(q.options) && typeof q.correctIndex === 'number' ? (q.options[q.correctIndex] ?? '') : ''
const tokens = (s: string): Set<string> => {
  const out = new Set<string>()
  const zh = s.match(/[一-鿿]/g) ?? []
  for (let i = 0; i < zh.length - 1; i++) out.add(zh[i] + zh[i + 1])
  for (const w of s.toLowerCase().match(/[a-z]{4,}/g) ?? []) out.add(w)
  return out
}
const MIN_TOKENS = 5
const jaccard = (a: Set<string>, b: Set<string>) => {
  if (a.size < MIN_TOKENS || b.size < MIN_TOKENS) return 0
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter)
}
const existingToks = existing.map((e) => ({ toks: tokens(e.content), ansToks: tokens(answerOf(e)), text: e.content }))

// ── 逐行過閘 ───────────────────────────────────────────────────────────────
const accepted: ReturnType<typeof toReviewedQuestion>[] = []
const rejected: { id: string; reasons: string[] }[] = []
const seenIds = new Set<string>()
const seenQ = new Set<string>()

for (let i = 0; i < rows.length; i++) {
  const row = rows[i]
  const id = typeof row?.id === 'string' ? row.id.trim() : `#${i}`
  const errs = gateRow(row, SUBJECT)

  if (seenIds.has(id)) errs.push('批次內 id 重複')
  if (existingIds.has(id)) errs.push('id 同 live 題庫撞')
  if (typeof row?.question === 'string' && seenQ.has(norm(row.question))) errs.push('批次內題幹重複')

  // D. topic id 必須對得上已註冊課題，否則變孤兒題
  const tid = (typeof row?.topicId === 'string' && row.topicId.trim()) || ''
  if (!tid) errs.push('缺 topicId —— 用中文標籤做 id 會變孤兒課題，學生篩唔到')
  else if (!validTopics.has(tid)) errs.push(`topicId「${tid}」唔喺 ${SUBJECT} 已註冊課題內`)

  // B. 對 live 題庫嘅重複度
  if (typeof row?.question === 'string') {
    const q = tokens(row.question)
    const a = tokens(answerOf(row))
    let worst = 0
    let worstText = ''
    for (const e of existingToks) {
      const j = Math.max(jaccard(q, e.toks), jaccard(a, e.ansToks))
      if (j > worst) { worst = j; worstText = e.text }
    }
    if (worst >= FAIL_SIM) errs.push(`同 live 題庫重複 ${(worst * 100).toFixed(0)}%：${worstText.replace(/\s+/g, ' ').slice(0, 60)}`)
  }

  if (errs.length) { rejected.push({ id, reasons: errs }); continue }
  seenIds.add(id)
  seenQ.add(norm(row.question))

  const q = toReviewedQuestion(row, SUBJECT) as Record<string, unknown>
  // 來源標示覆寫 —— 唔可以掛住「人手核對題」個名。
  q.framework = 'auto'
  q.frameworkZh = '機器閘放行題'
  q.frameworkEn = 'Auto-gated'
  q.frameworkEmoji = '⚙️'
  accepted.push(q as ReturnType<typeof toReviewedQuestion>)
}

// ── 報告 ───────────────────────────────────────────────────────────────────
console.log('='.repeat(78))
console.log(`auto-gate：${basename(IN)}　科目 ${SUBJECT}　（對比 live ${existing.length} 條）`)
console.log('='.repeat(78))
console.log(`  收 ${accepted.length} 條　踢 ${rejected.length} 條`)
if (rejected.length) {
  const rej = `${IN.replace(/\.json$/, '')}.rejected.json`
  if (!DRY) writeFileSync(rej, JSON.stringify(rejected, null, 2) + '\n')
  console.log(`\n  ✗ 被踢走（已寫入 ${basename(rej)}）：`)
  for (const r of rejected.slice(0, 40)) console.log(`     ${r.id}: ${r.reasons.join('; ')}`)
  if (rejected.length > 40) console.log(`     …… 另外 ${rejected.length - 40} 條，見 rejected.json`)
}
if (!accepted.length) { console.error('\n✗ 零條過閘，唔會寫任何嘢。\n'); process.exit(1) }
if (DRY) { console.log('\n(--dry：冇寫任何檔)\n'); process.exit(0) }

// ── 併入 data/questions/<subject>-auto.ts（同 id 覆寫，其餘保留）───────────
const base = `${SUBJECT}-auto`
const exportName = `${base.replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())}Questions`
const outFile = new URL(`../../data/questions/${base}.ts`, import.meta.url)
const outPath = outFile.pathname

let merged = accepted
if (existsSync(outPath)) {
  const prevSrc = readFileSync(outPath, 'utf8')
  const at = prevSrc.indexOf('] = [')
  const prev = at >= 0 ? JSON.parse(prevSrc.slice(prevSrc.indexOf('[', at + 4))) : []
  const byId = new Map<string, unknown>()
  for (const q of prev) byId.set((q as { id: string }).id, q)
  for (const q of accepted) byId.set((q as { id: string }).id, q)
  merged = [...byId.values()] as typeof accepted
}

const diff = merged.reduce((a: Record<string, number>, q) => ((a[(q as { difficulty: string }).difficulty] = (a[(q as { difficulty: string }).difficulty] || 0) + 1), a), {})
const byType = merged.reduce((a: Record<string, number>, q) => ((a[(q as { type: string }).type] = (a[(q as { type: string }).type] || 0) + 1), a), {})
const mixed = merged.some((q) => (q as { type: string }).type !== 'mc')
const bankType = mixed ? 'AnyQuestion' : 'Question'

const header = `// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : ${SUBJECT}
//   count    : ${merged.length}  (easy ${diff.easy || 0} / medium ${diff.medium || 0} / hard ${diff.hard || 0})
//   types    : mc ${byType.mc || 0} / text ${byType.text || 0} / long ${byType.long || 0}
//   updated  : ${new Date().toISOString().slice(0, 10)}
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { ${bankType} } from './types'

export const ${exportName}: ${bankType}[] = `
writeFileSync(outPath, header + JSON.stringify(merged, null, 2) + '\n')
console.log(`\n✓ 寫入 data/questions/${base}.ts —— 累計 ${merged.length} 條`)

// ── 自動接線 load.ts + index.ts（冪等）─────────────────────────────────────
const wire = (file: string, mut: (s: string) => string) => {
  const p = new URL(`../../data/questions/${file}`, import.meta.url).pathname
  const before = readFileSync(p, 'utf8')
  const after = mut(before)
  if (after !== before) { writeFileSync(p, after); console.log(`✓ 接線 ${file}`) }
  else console.log(`· ${file} 已接線，冇改`)
}

wire('load.ts', (s) => {
  if (s.includes(`'./${base}'`)) return s
  const line = `  '${SUBJECT}': async () => (await import('./${base}')).${exportName},\n`
  return s.replace('const autoLoaders: Record<string, Loader> = {\n', (m) => m + line)
})

wire('index.ts', (s) => {
  if (s.includes(`from './${base}'`)) return s
  const imp = `import { ${exportName} } from './${base}'\n`
  const entry = `  '${SUBJECT}': ${exportName},\n`
  return s
    .replace(/^(import .*\n)(?![\s\S]*^import )/m, (m) => m + imp)
    .replace('const autoBanks: Record<string, AnyQuestion[]> = {\n', (m) => m + entry)
})

console.log('')
