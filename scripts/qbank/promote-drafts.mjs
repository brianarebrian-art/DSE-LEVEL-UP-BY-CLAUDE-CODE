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
import { assertReviewer } from './_reviewer-gate.mjs'

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

// ── 抽樣覆核模式（2026-08-27 創辦人決定）─────────────────────────────────
// mode: 'sampled' 之下，只有 sample.ids 嗰批係真人全讀過；其餘標
// 'machine-admitted'，即係【只過咗機器閘】。機器閘檢查格式／術語／重複，
// 【唔檢查答案啱唔啱】—— 呢一點必須如實寫入生成檔嘅檔頭，否則份紀錄
// 就會同「逐題人手批」嗰個舊講法一樣，寫住一件冇發生過嘅事。
const MODE = decDoc?._meta?.mode === 'sampled' ? 'sampled' : 'full'
const SAMPLE = new Set(decDoc?._meta?.sample?.ids ?? [])

if (MODE === 'sampled') {
  // 整批退回規則：抽樣抓得到嘅係「整批寫得差」，抓唔到「孤立一條答案掉轉」。
  // 所以抽中嗰批一旦有一條唔合格，唔可以淨係踢走嗰一條就當其餘冇事 ——
  // 嗰一條係一個訊號，代表呢批嘅出題質素本身有問題。
  const rejectedInSample = Object.entries(decisions)
    .filter(([id, v]) => SAMPLE.has(id) && v === 'rejected')
    .map(([id]) => id)
  if (rejectedInSample.length) {
    console.error(`\n✗ 抽樣批次退回 —— 抽中嘅 ${SAMPLE.size} 條入面有 ${rejectedInSample.length} 條被駁回：`)
    for (const id of rejectedInSample) console.error(`   ${id}`)
    console.error(`\n  按抽樣規則，整批 ${raw.length} 條退回重檢，唔會有任何一條入庫。`)
    console.error(`  修好之後重新出草稿，再抽一次樣。\n`)
    process.exit(1)
  }
  const unread = [...SAMPLE].filter((id) => decisions[id] !== 'approved')
  if (unread.length) {
    console.error(`\n✗ 抽中嘅 ${SAMPLE.size} 條仲有 ${unread.length} 條未有決定：${unread.join(', ')}`)
    console.error(`  抽樣覆核嘅前提係嗰批【全部】讀過。未讀完唔可以 promote。\n`)
    process.exit(1)
  }
}

const ADMIT = MODE === 'sampled'
  ? (v) => v === 'approved' || v === 'machine-admitted'
  : (v) => v === 'approved'

// ── collect APPROVED rows, re-gate, dedup within file ───────────────────────
const approved = []
const blocked = []
const seenIds = new Set()
const seenQ = new Set()
for (let i = 0; i < raw.length; i++) {
  const row = raw[i]
  const id = typeof row?.id === 'string' ? row.id.trim() : `#${i}`
  if (!ADMIT(decisions[id])) continue // default-deny: pending/rejected/missing all skipped
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
// 真人簽名閘 —— 邏輯搬咗去 _reviewer-gate.mjs 同 SENSEI 卡片管線共用。
// 空白照舊停機，另加虛擬 persona 冒簽攔截（2026-08-25，對現有資料零影響）。
assertReviewer(reviewer)

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
(MODE === 'sampled'
  ? `// SAMPLED-REVIEW question bank — generated by scripts/qbank/promote-drafts.mjs.
// ⚠️ 唔係逐題人手批。${SAMPLE.size} / ${raw.length} 條由 NAMED 真人全讀並批准；
// 其餘 ${raw.length - SAMPLE.size} 條【只過咗機器閘】—— 機器檢查格式／術語／重複，
// 【從來唔檢查答案啱唔啱（生死線）】。抽樣抓得到「整批寫得差」，
// 抓唔到「孤立一條答案掉轉」。讀呢個檔嘅人請按此理解本批嘅保證程度。
//   reviewer  : ${reviewer}
//   reviewed  : ${reviewedAt}
//   source    : ${basename(IN)}
//   mode      : sampled — 真人全讀 ${SAMPLE.size} 條，種子 ${decDoc?._meta?.sample?.seed ?? '(未記錄)'}
//   human-read: ${[...SAMPLE].join(', ') || '(無)'}
//   admitted  : ${approved.length}  (easy ${diff.easy || 0} / medium ${diff.medium || 0} / hard ${diff.hard || 0})`
  : `// HUMAN-REVIEWED question bank — generated by scripts/qbank/promote-drafts.mjs.
// Every question below was approved question-by-question by a NAMED human reviewer;
// the machine only checked format/dedup/terminology, never correctness (生死線).
//   reviewer : ${reviewer}
//   reviewed : ${reviewedAt}
//   source   : ${basename(IN)}
//   approved : ${approved.length}  (easy ${diff.easy || 0} / medium ${diff.medium || 0} / hard ${diff.hard || 0})`) + `
${typeLine}// Do NOT hand-edit — re-run the pipeline instead. NOT yet live until wired into load.ts.
import type { ${bankType} } from './types'

export const ${exportName}: ${bankType}[] = `
writeFileSync(outFile, header + JSON.stringify(approved, null, 2) + '\n')

// 抽樣模式下【唔可以】把全部 admitted 講成 human-approved —— `approved` 入面
// 包住 machine-admitted 嗰批，冇人讀過佢哋。2026-09-05 實測印過
// 「promoted 22 human-approved question(s)」，而真人得讀 8 條。
// 生成檔嘅檔頭一直寫得啱，錯淨係喺呢一行 —— 但呢行先係跑腳本嗰個人會見到嘅嘢，
// 而佢就係跟住落去做 load.ts 接線嗰位。§16.C／§16.D 同一類假狀態聲稱。
//
// 數目由 `approved` 實數計，唔用 SAMPLE.size：兩者理應相等（抽中而未批或被駁回
// 都已經喺上面停咗機），但呢行係報告，報告應該數返實物。
const humanRead = MODE === 'sampled' ? approved.filter((q) => SAMPLE.has(q.id)).length : approved.length
console.log(MODE === 'sampled'
  ? `\n✓ promoted ${approved.length} question(s) → data/questions/${base}.ts\n`
    + `  ${humanRead} 條真人全讀 ＋ ${approved.length - humanRead} 條 machine-admitted`
    + `（只過機器閘 —— 格式／術語／重複，冇人讀過答案啱唔啱）`
  : `\n✓ promoted ${approved.length} human-approved question(s) → data/questions/${base}.ts`)
console.log(`  reviewer: ${reviewer} · ${reviewedAt}`)
console.log(`\n  NEXT (manual — a second human gate; this script will NOT do it for you):`)
console.log(`  1. In data/questions/load.ts, merge into the "${SUBJECT}" loader:`)
// ⚠️ 用 `base` 唔可以用 SUBJECT：輸出檔係 `${base}.ts`，而 base = OUT || `${SUBJECT}-reviewed`。
// 寫死 `${SUBJECT}-reviewed` 就會印一條指去另一個檔（或者根本唔存在嘅檔）嘅 import，
// 偏偏 --out 存在嘅原因正正係 promote 會覆寫（見檔頭 2026-08-07 中文卷二嗰宗）——
// 即係話呢個片段喺 --out 要保護嗰個情況下先至係錯嘅。
console.log(`         const reviewed = await import('./${base}')`)
console.log(`         return [...base, ...reviewed.${exportName}]`)
console.log(`  2. node scripts/qbank/validate-banks.mjs   (global dup-id / identical-stem check)`)
console.log(`  3. npm run build -- --webpack\n`)
process.exit(0)
