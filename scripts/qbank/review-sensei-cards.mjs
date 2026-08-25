// ============================================================================
// review-sensei-cards.mjs —— SENSEI 卡片草稿覆核（機器客觀閘 + 人手審批表）
// ----------------------------------------------------------------------------
// 對應題庫嘅 review-drafts.mjs。行完會產生一個 .decisions.json 骨架，
// 入面每張卡預設 "pending"，而 _meta.reviewer 【刻意留白】——
// 留白就係「未有人批過」嘅意思，唔可以由機器填。
//
// 用法：
//   node scripts/qbank/review-sensei-cards.mjs --in data/sensei/economics/drafts/batch1.json
// ============================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { basename, dirname } from 'node:path'
import { gateCard, normCard } from './_card-gate.mjs'

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null }
const IN = arg('in')
if (!IN) { console.error('usage: node scripts/qbank/review-sensei-cards.mjs --in <drafts.json>'); process.exit(2) }
if (!existsSync(IN)) { console.error(`✗ ${IN} 唔存在`); process.exit(1) }

// 科目由路徑取得：data/sensei/<subject>/drafts/xxx.json
const SUBJECT = basename(dirname(dirname(IN)))

let cards
try { cards = JSON.parse(readFileSync(IN, 'utf8')) } catch (e) { console.error(`✗ 解析唔到 ${IN}: ${e.message}`); process.exit(1) }
if (!Array.isArray(cards)) { console.error(`✗ ${IN} 要係 JSON array`); process.exit(1) }

console.log(`\n${'═'.repeat(70)}\n  SENSEI 卡片草稿覆核 —— ${SUBJECT} · ${cards.length} 張\n${'═'.repeat(70)}\n`)

const seenId = new Set()
const seenConcept = new Map()
const ok = []
let bad = 0

cards.forEach((c, i) => {
  const errs = gateCard(c, SUBJECT)
  if (seenId.has(c?.id)) errs.push(`重複 id "${c.id}"`)
  const key = normCard(c?.concept)
  if (key && seenConcept.has(key)) errs.push(`【概念】同第 ${seenConcept.get(key) + 1} 張實質重複`)
  if (errs.length) {
    bad++
    console.log(`  ❌ #${i + 1} ${c?.id || '(冇 id)'}`)
    for (const e of errs) console.log(`       ${e}`)
  } else {
    seenId.add(c.id)
    if (key) seenConcept.set(key, i)
    ok.push(c)
    console.log(`  ⬜ #${i + 1} ${c.id}  [${c.difficulty}] ${c.topic}`)
  }
})

const OUT = IN.replace(/\.json$/, '.decisions.json')
if (!existsSync(OUT)) {
  const skeleton = {
    _meta: {
      source: basename(IN),
      subject: SUBJECT,
      // ⚠️ 留白 = 未有人批過。虛擬 persona 唔可以填呢度，
      //    promote-sensei-cards.mjs 會攔（見 _reviewer-gate.mjs）。
      reviewer: '',
      reviewedAt: '',
    },
    decisions: Object.fromEntries(ok.map((c) => [c.id, 'pending'])),
  }
  writeFileSync(OUT, JSON.stringify(skeleton, null, 2) + '\n')
  console.log(`\n  📝 已產生審批表：${OUT}`)
} else {
  console.log(`\n  📝 審批表已存在，唔覆蓋：${OUT}`)
}

console.log(`\n  過閘 ${ok.length} / 退回 ${bad}`)
console.log(`\n  下一步：喺 ${basename(OUT)} 逐張改成 "approved"／"rejected"，`)
console.log(`         並喺 _meta.reviewer 填【真人】姓名，然後行 promote-sensei-cards.mjs\n`)
process.exit(bad ? 1 : 0)
