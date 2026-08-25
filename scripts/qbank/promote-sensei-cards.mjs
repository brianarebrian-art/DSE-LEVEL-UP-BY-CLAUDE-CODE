// ============================================================================
// promote-sensei-cards.mjs —— 只將真人批准過嘅卡片寫入 reviewed/
// ----------------------------------------------------------------------------
// 對應題庫嘅 promote-drafts.mjs，紀律逐條相同：
//   • DEFAULT-DENY —— 唔係明文 "approved" 一律唔要（pending／rejected／缺漏都跳過）
//   • 簽名閘共用 _reviewer-gate.mjs —— 空白 或 虛擬 persona 冒簽 = 停機
//   • 重新過一次客觀閘 —— 真人批咗但格式壞嘅，硬性停機（唔靜靜跳過）
//   • 零批准 = 拒絕寫檔
//
// ⚠️ 寫完【唔會】自動接線。要有人親手去 data/sensei/<subject>/index.ts 加 import。
//    憲章 §12：機器永不自動入庫。
// ============================================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { gateCard, toSignedCard } from './_card-gate.mjs'
import { assertReviewer } from './_reviewer-gate.mjs'

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null }
const IN = arg('in')
const DEC = arg('decisions') || (IN ? IN.replace(/\.json$/, '.decisions.json') : null)
if (!IN) { console.error('usage: node scripts/qbank/promote-sensei-cards.mjs --in <drafts.json> [--decisions <f>]'); process.exit(2) }
for (const f of [IN, DEC]) if (!existsSync(f)) { console.error(`✗ ${f} 唔存在`); process.exit(1) }

const SUBJECT = basename(dirname(dirname(IN)))
const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { console.error(`✗ 解析唔到 ${p}: ${e.message}`); process.exit(1) } }

const cards = readJson(IN)
const decDoc = readJson(DEC)
const decisions = decDoc?.decisions || {}

// ① 簽名閘 —— 同題庫共用同一段邏輯
const reviewer = assertReviewer(decDoc?._meta?.reviewer)
const reviewedAt = decDoc?._meta?.reviewedAt || new Date().toISOString().slice(0, 10)

// ② default-deny + 重新過客觀閘
const approved = []
const blocked = []
for (const c of cards) {
  if (decisions[c?.id] !== 'approved') continue
  const errs = gateCard(c, SUBJECT)
  if (errs.length) blocked.push({ id: c?.id, errs })
  else approved.push(toSignedCard(c, reviewer, reviewedAt))
}

if (blocked.length) {
  console.error(`\n✗ ${blocked.length} 張卡真人批咗但過唔到客觀閘 —— 停機，唔會靜靜跳過：`)
  for (const b of blocked) console.error(`   ${b.id}: ${b.errs.join('; ')}`)
  console.error('')
  process.exit(1)
}
if (!approved.length) {
  console.error(`\n✗ ${basename(DEC)} 入面零張 "approved" —— 冇嘢好 promote。\n`)
  process.exit(1)
}

const base = basename(IN).replace(/\.json$/, '')
const outDir = join(dirname(dirname(IN)), 'reviewed')
mkdirSync(outDir, { recursive: true })
const outFile = join(outDir, `${base}.ts`)
const camel = base.replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
const exportName = `${SUBJECT}${camel.charAt(0).toUpperCase()}${camel.slice(1)}Cards`

const diff = approved.reduce((a, c) => ((a[c.difficulty] = (a[c.difficulty] || 0) + 1), a), {})
// ⚠️ 產生出嚟嘅檔會被 term-guard 掃（data/sensei/ 遞歸），所以檔頭註釋
//    必須用標準書面語 —— 用口語寫會令每一個 promote 產物即刻 fail 術語閘。
const header = `// 由 promote-sensei-cards.mjs 產生，請勿手動修改；如需更正請修改草稿並重新執行管線。
// 以下每張卡片均由具名真人逐張批准：
//   reviewer : ${reviewer}
//   date     : ${reviewedAt}
//   source   : ${basename(IN)}
//   approved : ${approved.length}  (basic ${diff.basic || 0} / intermediate ${diff.intermediate || 0} / hard ${diff.hard || 0})
// ⚠️ 尚未生效：必須由人手在 ../index.ts 加入 import，才會在學生介面出現。
import type { KnowledgeCard } from '../../types'

export const ${exportName}: KnowledgeCard[] = `

writeFileSync(outFile, header + JSON.stringify(approved, null, 2) + '\n')
console.log(`\n✓ 已寫入 ${approved.length} 張真人批准嘅卡片 → ${outFile}`)
console.log(`\n  最後一步（人手）：喺 data/sensei/${SUBJECT}/index.ts 加`)
console.log(`     import { ${exportName} } from './reviewed/${base}'`)
console.log(`  再將佢併入 ${SUBJECT}SenseiCards，然後行 npm test。\n`)
