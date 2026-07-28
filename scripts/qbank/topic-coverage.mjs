// ============================================================================
// topic-coverage.mjs — 課題覆蓋率稽核（plain Node ESM，零新 dep）
// ----------------------------------------------------------------------------
// 揪出「孤兒課題」：題目身上嘅 `topic` id 唔喺該科 curated `*Topics` 清單入面。
// 呢啲題【永遠】篩唔到 —— /practice?subject=X&topic=Y、/subjects/[subject] 嘅
// 課題 chips、/notes/[subject] 全部靠 getSubjectTopics() 出清單，孤兒題喺
// 題庫入面存在但學生用課題入口去唔到。
//
// 順便核對 `Topic.count` 元數據：呢個數字係人手維護嘅，同真實題數已經對唔上。
//
// 載入方式跟 validate-banks.mjs 同一招（唔重新發明）：用專案自己嘅 typescript
// 把 .ts 轉譯成 temp .mjs 再 import。分別係呢度要成個 data/questions 樹（連
// 手寫題庫同 *Topics），唔淨係參數化 bank —— 所以整個目錄一次過轉譯。
// （`npx tsx data/questions/index.ts` 之前報 "does not provide an export named
//   getSubjectQuestions"；轉譯呢招係 repo 既有慣例，亦繞開咗個問題。）
//
// 用法（喺專案根目錄）：
//   node scripts/qbank/topic-coverage.mjs           # 全部 active 科目
//   node scripts/qbank/topic-coverage.mjs math      # 淨係呢幾科
//   node scripts/qbank/topic-coverage.mjs --json    # 機器可讀
//
// 退出碼：純報告，一律 0 —— 呢個係稽核工具，唔係閘。修唔修係內容決定。
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ts = (await import('typescript')).default

const args = process.argv.slice(2)
const asJson = args.includes('--json')
const only = args.filter((a) => !a.startsWith('--'))

// ── 轉譯整個 data/questions 樹 + data/subjects.ts 落 temp，再 import ────────
const TMP = mkdtempSync(join(tmpdir(), 'topic-cov-'))

function transpile(absPath) {
  return ts.transpileModule(readFileSync(absPath, 'utf8'), {
    compilerOptions: { module: 'ES2020', target: 'ES2020' },
  }).outputText
}

// 相對 import 要補返 .mjs 副檔名（Node ESM 唔會自動解析）
function rewriteImports(js) {
  return js.replace(/(from\s+['"])(\.\/[^'"]+?)(['"])/g, (m, a, spec, b) =>
    spec.endsWith('.mjs') ? m : `${a}${spec}.mjs${b}`,
  )
}

for (const f of readdirSync(join(ROOT, 'data/questions')).filter((f) => f.endsWith('.ts'))) {
  writeFileSync(join(TMP, f.replace(/\.ts$/, '.mjs')), rewriteImports(transpile(join(ROOT, 'data/questions', f))))
}
writeFileSync(join(TMP, 'subjects.mjs'), rewriteImports(transpile(join(ROOT, 'data/subjects.ts'))))

const questions = await import('file://' + join(TMP, 'index.mjs'))
const { subjects } = await import('file://' + join(TMP, 'subjects.mjs'))

// ── 稽核 ────────────────────────────────────────────────────────────────────
const report = []
for (const s of subjects) {
  if (!s.isActive) continue
  if (only.length && !only.includes(s.id)) continue

  const qs = questions.getSubjectQuestions(s.id)
  if (qs.length === 0) continue
  const topics = questions.getSubjectTopics(s.id)
  const declared = new Set(topics.map((t) => t.id))

  // 題目身上實際用緊嘅 topic id → 題數
  const used = new Map()
  for (const q of qs) used.set(q.topic, (used.get(q.topic) ?? 0) + 1)

  const orphans = [...used.entries()]
    .filter(([id]) => !declared.has(id))
    .sort((a, b) => b[1] - a[1])
  const orphanTotal = orphans.reduce((n, [, c]) => n + c, 0)

  // 宣告咗但一條題都冇（死課題 —— chip 撳落去空白）
  const empty = topics.filter((t) => !used.has(t.id)).map((t) => t.id)

  // Topic.count 元數據 vs 真實題數
  const staleCounts = topics
    .filter((t) => (used.get(t.id) ?? 0) !== t.count)
    .map((t) => ({ id: t.id, declared: t.count, actual: used.get(t.id) ?? 0 }))

  report.push({
    subject: s.id,
    name: s.name,
    total: qs.length,
    declaredTopics: topics.length,
    covered: qs.length - orphanTotal,
    orphanTotal,
    orphanPct: qs.length ? Math.round((orphanTotal / qs.length) * 100) : 0,
    orphans: orphans.map(([id, count]) => ({ id, count })),
    emptyTopics: empty,
    staleCounts,
  })
}

report.sort((a, b) => b.orphanPct - a.orphanPct || b.orphanTotal - a.orphanTotal)

if (asJson) {
  console.log(JSON.stringify(report, null, 2))
  process.exit(0)
}

const line = '─'.repeat(78)
console.log(`\n${'═'.repeat(78)}\n  課題覆蓋率稽核 — topic-coverage\n${'═'.repeat(78)}\n`)
console.log('  科目                題數   課題  覆蓋   孤兒   %    死課題  count失準')
console.log(`  ${line}`)
for (const r of report) {
  const flag = r.orphanPct >= 20 ? '🔴' : r.orphanPct > 0 ? '🟡' : '✅'
  console.log(
    `  ${flag} ${r.subject.padEnd(18)}${String(r.total).padStart(5)}${String(r.declaredTopics).padStart(6)}` +
      `${String(r.covered).padStart(6)}${String(r.orphanTotal).padStart(7)}${String(r.orphanPct + '%').padStart(6)}` +
      `${String(r.emptyTopics.length).padStart(7)}${String(r.staleCounts.length).padStart(9)}`,
  )
}

const totQ = report.reduce((n, r) => n + r.total, 0)
const totOrphan = report.reduce((n, r) => n + r.orphanTotal, 0)
const totStale = report.reduce((n, r) => n + r.staleCounts.length, 0)
console.log(`  ${line}`)
console.log(
  `  合計：${totQ} 題，其中 ${totOrphan} 題（${Math.round((totOrphan / totQ) * 100)}%）用緊未宣告課題；` +
    `${totStale} 個 Topic.count 同真實題數對唔上。`,
)

console.log(`\n${'═'.repeat(78)}\n  孤兒課題明細（題目用緊、但唔喺 *Topics 清單）\n${'═'.repeat(78)}`)
for (const r of report) {
  if (r.orphans.length === 0) continue
  console.log(`\n  ── ${r.subject}（${r.name}）— ${r.orphanTotal} 題 / ${r.orphans.length} 個未宣告 id`)
  for (const o of r.orphans) console.log(`     ${o.id.padEnd(34)} ${String(o.count).padStart(4)} 題`)
}

const withEmpty = report.filter((r) => r.emptyTopics.length)
if (withEmpty.length) {
  console.log(`\n${'═'.repeat(78)}\n  死課題（清單有、但零題 —— chip 撳落去係空白）\n${'═'.repeat(78)}`)
  for (const r of withEmpty) console.log(`\n  ── ${r.subject}: ${r.emptyTopics.join(', ')}`)
}

console.log(`\n${'═'.repeat(78)}\n  Topic.count 元數據失準（宣告 vs 真實）\n${'═'.repeat(78)}`)
for (const r of report) {
  if (r.staleCounts.length === 0) continue
  const worst = [...r.staleCounts].sort((a, b) => Math.abs(b.actual - b.declared) - Math.abs(a.actual - a.declared))
  console.log(`\n  ── ${r.subject}（${r.staleCounts.length} 個失準）`)
  for (const c of worst.slice(0, 6)) {
    console.log(`     ${c.id.padEnd(34)} 宣告 ${String(c.declared).padStart(4)} → 真實 ${String(c.actual).padStart(4)}`)
  }
  if (worst.length > 6) console.log(`     …仲有 ${worst.length - 6} 個`)
}
console.log()
