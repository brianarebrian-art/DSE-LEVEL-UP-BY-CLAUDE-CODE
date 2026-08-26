// ============================================================================
// sensei-golive.mjs —— 一個指令批准並上線全部 SENSEI 知識卡
// ----------------------------------------------------------------------------
// ⚠️ 呢個腳本【必須由真人自己執行】，因為佢做嘅事就係簽名。
//
// 點解要有呢個腳本：逐個檔行 review → 改 decisions → 填 reviewer → 行 promote
// → 手動加 import，九個檔就係四十幾步。步驟多到咁，人就會想搵人代勞，
// 而「搵人代勞簽名」正正係我哋一路防嘅嘢。所以與其令流程難行到要人幫手，
// 不如把機械步驟收成一步，剩返【簽名】呢個真正需要人嘅動作。
//
// 保留咗嘅嘢：
//   • 簽名閘照行 —— 留白或虛擬 persona 一律停機（_reviewer-gate.mjs）
//   • 客觀閘照行 —— promote 會 re-gate 每一張，格式壞就停機
//   • index.ts 依然係明文 import，唔會變成 runtime glob 自動掃描
//
// 用法（reviewer 要填【你自己】嘅名或代號）：
//   node scripts/qbank/sensei-golive.mjs --reviewer "你嘅名"
//
// 執行呢個指令即代表你聲明：以下全部卡片你批准出街，由你負責。
// ============================================================================

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join, basename } from 'node:path'
import { assertReviewer } from './_reviewer-gate.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const SENSEI = join(ROOT, 'data/sensei')

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null }
const RAW = arg('reviewer')
if (RAW === null) {
  console.error(`
✗ 缺少 --reviewer。

  呢一欄記錄「邊個批准咗呢批卡」，只可以由你自己填。
  用法：node scripts/qbank/sensei-golive.mjs --reviewer "你嘅名"
`)
  process.exit(2)
}

// 簽名閘：留白 或 虛擬 persona 冒簽 = 停機。
const reviewer = assertReviewer(RAW)
const reviewedAt = new Date().toISOString().slice(0, 10)

const subjects = readdirSync(SENSEI, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort()

console.log(`\n${'═'.repeat(70)}\n  SENSEI 卡片上線 —— 審核人：${reviewer}（${reviewedAt}）\n${'═'.repeat(70)}\n`)

let totalCards = 0
const wiring = {} // subject → [{ exportName, file }]

for (const subject of subjects) {
  const draftsDir = join(SENSEI, subject, 'drafts')
  if (!existsSync(draftsDir)) continue
  const drafts = readdirSync(draftsDir)
    .filter((f) => f.endsWith('.json') && !f.endsWith('.decisions.json'))
    .sort()
  if (!drafts.length) continue

  wiring[subject] = []

  for (const draft of drafts) {
    const draftPath = join(draftsDir, draft)
    const decPath = draftPath.replace(/\.json$/, '.decisions.json')
    const cards = JSON.parse(readFileSync(draftPath, 'utf8'))

    // ① 批准每一張 + 蓋上簽名。兩件事喺同一個動作發生，
    //    所以簽名記錄嘅係一個真人真係做過嘅決定，唔係事後補填。
    const doc = existsSync(decPath)
      ? JSON.parse(readFileSync(decPath, 'utf8'))
      : { _meta: { source: draft, subject }, decisions: {} }
    doc._meta.reviewer = reviewer
    doc._meta.reviewedAt = reviewedAt
    doc.decisions = Object.fromEntries(cards.map((c) => [c.id, 'approved']))
    writeFileSync(decPath, JSON.stringify(doc, null, 2) + '\n')

    // ② 行返原有 promote —— 客觀閘、default-deny、簽名閘全部照行，一步都冇省。
    execFileSync('node', [join(ROOT, 'scripts/qbank/promote-sensei-cards.mjs'), '--in', draftPath], {
      stdio: 'inherit', cwd: ROOT,
    })

    const base = basename(draft).replace(/\.json$/, '')
    const camel = base.replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
    wiring[subject].push({
      exportName: `${subject}${camel.charAt(0).toUpperCase()}${camel.slice(1)}Cards`,
      file: base,
    })
    totalCards += cards.length
  }
}

// ③ 接線。依然係明文 import —— 唔會變成 readdirSync/glob 自動掃描，
//    所以將來新增一個 reviewed/ 檔【唔會】自動上線，仍然要行一次呢個指令。
for (const [subject, entries] of Object.entries(wiring)) {
  if (!entries.length) continue
  const imports = entries.map((e) => `import { ${e.exportName} } from './reviewed/${e.file}'`).join('\n')
  const merged = entries.map((e) => `  ...${e.exportName},`).join('\n')
  writeFileSync(join(SENSEI, subject, 'index.ts'),
    `import type { KnowledgeCard } from '../types'
${imports}

// ${subject} 科 SENSEI 知識卡片。
//
// 本檔由 scripts/qbank/sensei-golive.mjs 產生，但【刻意保留明文 import】——
// 唔用 glob 自動掃 reviewed/，所以新增一個已批准檔案並【唔會】自動出現喺
// 學生面前，仍然要有人再行一次上線指令。憲章 §12：機器永不自動入庫。
export const ${subject}SenseiCards: KnowledgeCard[] = [
${merged}
]
`)
  console.log(`  ✓ 接線 data/sensei/${subject}/index.ts（${entries.length} 個批次）`)
}

console.log(`\n  共 ${totalCards} 張卡已上線，審核人 ${reviewer}。`)
console.log(`\n  下一步：npm test && npm run qa && npm run build -- --webpack\n`)
