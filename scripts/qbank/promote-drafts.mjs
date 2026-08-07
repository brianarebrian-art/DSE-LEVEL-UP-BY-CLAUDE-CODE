#!/usr/bin/env node
// ============================================================================
// promote-drafts.mjs — STEP 2 of the human-review draft pipeline.
// ----------------------------------------------------------------------------
// Reads the drafts JSON + the human's decisions.json (produced by the review
// sheet) and writes ONLY the rows a person marked "approved" into a typed bank
// file  data/questions/<subject>-reviewed.ts, stamped with WHO approved and WHEN
// so the "人手核對" claim is true and auditable.
//
// Safety invariants:
//   • DEFAULT-DENY — anything not explicitly "approved" is dropped (pending /
//     rejected / missing all excluded). Zero approved → it refuses to write.
//   • RE-GATES every approved row through the same objective gate — a human
//     clicking approve can't push through a malformed / term-red-line row.
//   • Does NOT wire the bank into data/questions/load.ts. Wiring stays a manual
//     human step (a second gate) — this script only prints the snippet.
//
//   node scripts/qbank/promote-drafts.mjs \
//     --in scripts/qbank/drafts/econ.json --subject economics \
//     --decisions scripts/qbank/drafts/econ.decisions.json
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gateRow, toReviewedQuestion, norm } from './_gate.mjs'

const args = process.argv.slice(2)
const arg = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d }
const IN = arg('in')
const SUBJECT = arg('subject')
const DEC = arg('decisions')
// 輸出檔名（唔連副檔名），預設 `<subject>-reviewed`。
//
// ⚠️ 點解要有呢個選項：本腳本係【覆寫】唔係追加（見下方 writeFileSync）。
// 未有 `--out` 之前，同一科第二次 promote 會靜靜冚走第一批 —— 冇警告、冇備份，
// 只有 git 追返。2026-08-07 實際踩過：中文卷二 6 條 promote 完之後再 promote
// 範文長題 20 條，前者連同該檔原有 12 條舊題一併消失。
// 所以：一科有多批已審核題目時，每批各自 `--out` 一個檔，再逐個 wire 入 load.ts。
const OUT = arg('out')
if (!IN || !SUBJECT || !DEC) {
  console.error('usage: node scripts/qbank/promote-drafts.mjs --in <drafts.json> --subject <id> --decisions <decisions.json> [--out <basename>]')
  process.exit(2)
}

function readJson(p) { try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { console.error(`✗ cannot read/parse ${p}: ${e.message}`); process.exit(1) } }
const raw = readJson(IN)
const decDoc = readJson(DEC)
if (!Array.isArray(raw)) { console.error(`✗ ${IN} must be a JSON array`); process.exit(1) }
const decisions = decDoc && typeof decDoc === 'object' && decDoc.decisions ? decDoc.decisions : decDoc
if (!decisions || typeof decisions !== 'object') { console.error(`✗ ${DEC} has no decisions map`); process.exit(1) }
const reviewer = (decDoc?._meta?.reviewer || '').trim()
const reviewedAt = (decDoc?._meta?.reviewer && decDoc?._meta?.reviewedAt) || new Date().toISOString().slice(0, 10)

// ── collect APPROVED rows, re-gate, dedup within file ───────────────────────
const approved = []
const blocked = []
const seenIds = new Set()
const seenQ = new Set()
for (let i = 0; i < raw.length; i++) {
  const row = raw[i]
  const id = typeof row?.id === 'string' ? row.id.trim() : `#${i}`
  if (decisions[id] !== 'approved') continue // default-deny: pending/rejected/missing all skipped
  const errs = gateRow(row, SUBJECT)
  if (seenIds.has(id)) errs.push('duplicate id among approved')
  if (typeof row?.question === 'string' && seenQ.has(norm(row.question))) errs.push('duplicate question among approved')
  if (errs.length) { blocked.push({ id, reasons: errs }); continue }
  seenIds.add(id); seenQ.add(norm(row.question))
  approved.push(toReviewedQuestion(row, SUBJECT))
}

// A row a human approved but that fails the objective gate is a HARD STOP — we do not
// quietly drop it (the human thinks it shipped) nor ship it (it's malformed). Abort.
if (blocked.length) {
  console.error(`\n✗ ${blocked.length} APPROVED row(s) fail the objective gate — fix the draft or un-approve, then re-run:`)
  for (const b of blocked) console.error(`   ${b.id}: ${b.reasons.join('; ')}`)
  process.exit(1)
}
if (!approved.length) {
  console.error(`\n✗ 0 approved rows in ${basename(DEC)} — nothing to promote. (Approve some in the review sheet first.)\n`)
  process.exit(1)
}
if (!reviewer) {
  console.error(`\n✗ decisions file has no reviewer name in _meta.reviewer — a 人手核對 bank must record who approved it. Add your name in the review sheet and re-export.\n`)
  process.exit(1)
}

// ── write the stamped, typed bank ───────────────────────────────────────────
// 匯出名跟住檔名走，令兩個檔唔會匯出同一個識別符而互相衝突。
// 預設情況逐字不變：`chinese-reviewed` → `chineseReviewedQuestions`（同加 --out 之前一樣）。
// 加 --out 時：`chinese-fanwen-long` → `chineseFanwenLongQuestions`。
const base = OUT || `${SUBJECT}-reviewed`
const exportName = `${base.replace(/[-_](.)/g, (_, c) => c.toUpperCase())}Questions`
const outFile = fileURLToPath(new URL(`../../data/questions/${base}.ts`, import.meta.url))
const diff = approved.reduce((a, q) => ((a[q.difficulty] = (a[q.difficulty] || 0) + 1), a), {})
const byType = approved.reduce((a, q) => ((a[q.type] = (a[q.type] || 0) + 1), a), {})
// 出口型別按實際內容決定：全 MC 就照舊寫 `Question[]`（同以往逐字一致，
// 唔會令任何現有 *-reviewed.ts 重新生成時變樣）；一旦混入 text／long 就要用
// 更闊嘅 `AnyQuestion[]`，否則 tsc 會拒收冇 options／correctIndex 嘅行。
const mixed = approved.some((q) => q.type !== 'mc')
const bankType = mixed ? 'AnyQuestion' : 'Question'
const typeLine = mixed
  ? `//   types    : mc ${byType.mc || 0} / text ${byType.text || 0} / long ${byType.long || 0}\n` +
    `// text／long 題【永不機器批改】：提交後攤開參考答案由學生自評（見 types.ts）。\n`
  : ''
const header =
`// HUMAN-REVIEWED question bank — generated by scripts/qbank/promote-drafts.mjs.
// Every question below was approved question-by-question by a NAMED human reviewer;
// the machine only checked format/dedup/terminology, never correctness (生死線).
//   reviewer : ${reviewer}
//   reviewed : ${reviewedAt}
//   source   : ${basename(IN)}
//   approved : ${approved.length}  (easy ${diff.easy || 0} / medium ${diff.medium || 0} / hard ${diff.hard || 0})
${typeLine}// Do NOT hand-edit — re-run the pipeline instead. NOT yet live until wired into load.ts.
import type { ${bankType} } from './types'

export const ${exportName}: ${bankType}[] = `
writeFileSync(outFile, header + JSON.stringify(approved, null, 2) + '\n')

console.log(`\n✓ promoted ${approved.length} human-approved question(s) → data/questions/${base}.ts`)
console.log(`  reviewer: ${reviewer} · ${reviewedAt}`)
console.log(`\n  NEXT (manual — a second human gate; this script will NOT do it for you):`)
console.log(`  1. In data/questions/load.ts, merge into the "${SUBJECT}" loader:`)
console.log(`         const reviewed = await import('./${SUBJECT}-reviewed')`)
console.log(`         return [...base, ...reviewed.${exportName}]`)
console.log(`  2. node scripts/qbank/validate-banks.mjs   (global dup-id / identical-stem check)`)
console.log(`  3. npm run build -- --webpack\n`)
process.exit(0)
