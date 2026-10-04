#!/usr/bin/env -S npx tsx
// ============================================================================
// repair-rationale.mts — apply one rationale-repair batch to its -auto.ts bank
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repair-rationale.mts --batch M1-01
//
// Part of the 176-question repair (Yuna 2026-09-29; docs/rationale-repairs.md).
// Stages: withdrawn → rewritten → automated-checked → content-reviewed → restored.
// This script takes a batch from withdrawn to automated-checked and no further:
//
//   · Only questions that are currently withdrawn can be repaired.
//   · correctIndex and the number of options must not change; option text may only
//     change by the formatting fixes in `tidy` ("x^{1}" → "x", ")^{1}" → ")").
//   · Every option gets exactly one note, keyed by its stored index (optionId).
//   · No positional wording anywhere (same patterns as check-posref.mjs).
//   · `$` must balance in every text field.
//
// It never marks a batch content-reviewed and never restores a question. Content
// review is a person's judgement and is recorded with that person's name; restoring
// is `withdraw.mts --undo`, after that review (charter §16.C: nothing is pre-filled).
// Writes the bank file in place (same id, other fields untouched) and
// data/questions/rationale-repairs.json.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const batchName = args[args.indexOf('--batch') + 1]
if (!args.includes('--batch') || !batchName) {
  console.error('usage: repair-rationale.mts --batch <name>')
  process.exit(2)
}

// Same patterns as scripts/qbank/check-posref.mjs.
export const POS_ZH = /第[一二三四]項(?!因素|變[項數]|憑證|獨立)/
export const POS_EN = /\b[Tt]he (?:first|second|third|fourth) (?:option|distractor)s?\b|\boptions? [ABCD]\b/
// Formatting fixes a batch may make: "x^{1}" → "x" (M1-01), ")^{1}" → ")" (M1-02).
const tidy = (s: string) => s.replace(/x\^\{1\}(?!\d)/g, 'x').replace(/\)\^\{1\}(?!\d)/g, ')')
const dollarsBalanced = (s: string) => (s.replace(/\\\$/g, '').match(/\$/g)?.length ?? 0) % 2 === 0

interface Note { optionId: number; zh: string; en: string; kind?: string }
interface Repair { id: string; options: string[]; optionsEn: string[]; explanation: string; explanationEn: string; optionNotes: Note[] }
const batch = JSON.parse(readFileSync(join(ROOT, `data/questions/rationale-repairs/${batchName}.json`), 'utf8')) as {
  batch: string; subject: string; repairs: Repair[]
}

const withdrawn = JSON.parse(readFileSync(join(ROOT, 'data/questions/withdrawn.json'), 'utf8')) as Record<string, Record<string, unknown>>
const bankPath = join(ROOT, `data/questions/${batch.subject}-auto.ts`)
const src = readFileSync(bankPath, 'utf8')
const at = src.indexOf('] = [')
if (at < 0) throw new Error(`${bankPath}: cannot find the question array`)
const head = src.slice(0, src.indexOf('[', at + 4))
const bank = JSON.parse(src.slice(src.indexOf('[', at + 4))) as Array<Record<string, unknown> & { id: string; options: string[]; correctIndex: number }>
const byId = new Map(bank.map((q) => [q.id, q]))

const errors: string[] = []
for (const r of batch.repairs) {
  const q = byId.get(r.id)
  const e = (msg: string) => errors.push(`${r.id}: ${msg}`)
  if (!q) { e('not in the bank file'); continue }
  if (!withdrawn[batch.subject]?.[r.id]) e('is not withdrawn — only withdrawn questions are repaired here')
  if (r.options.length !== q.options.length) e('option count changed')
  r.options.forEach((o, i) => { if (tidy(q.options[i]) !== o && q.options[i] !== o) e(`option ${i} changed beyond the formatting fix`) })
  const ids = r.optionNotes.map((n) => n.optionId).sort((a, b) => a - b)
  if (ids.join() !== q.options.map((_, i) => i).join()) e(`notes must cover options 0..${q.options.length - 1} once each, got ${ids}`)
  const texts = [r.explanation, r.explanationEn, ...r.options, ...r.optionNotes.flatMap((n) => [n.zh, n.en])]
  for (const t of texts) {
    if (POS_ZH.test(t) || POS_EN.test(t)) e(`positional wording: ${t.slice(0, 60)}`)
    if (!dollarsBalanced(t)) e(`unbalanced $: ${t.slice(0, 60)}`)
  }
}
if (errors.length) {
  console.error(`✗ ${batch.batch}: ${errors.length} problem(s); nothing written.\n  ` + errors.join('\n  '))
  process.exit(1)
}

for (const r of batch.repairs) {
  const q = byId.get(r.id)!
  q.options = r.options
  q.optionsEn = r.optionsEn
  q.explanation = r.explanation
  q.explanationEn = r.explanationEn
  q.optionNotes = r.optionNotes.map(({ optionId, zh, en }) => ({ optionId, zh, en }))
}
writeFileSync(bankPath, head + JSON.stringify(bank, null, 2) + '\n')

const logPath = join(ROOT, 'data/questions/rationale-repairs.json')
const log = JSON.parse(readFileSync(logPath, 'utf8')) as Record<string, { subject: string; batch: string | null; stage: string; updated: string; contentReview: null | { by: string; date: string } }>
const today = new Date().toISOString().slice(0, 10)
for (const r of batch.repairs) {
  if (!log[r.id]) throw new Error(`${r.id} is not in rationale-repairs.json`)
  log[r.id] = { ...log[r.id], batch: batch.batch, stage: 'automated-checked', updated: today }
}
writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n')
console.log(`✓ ${batch.batch}: ${batch.repairs.length} questions rewritten and automatically checked.`)
console.log('  Still withdrawn. Next: a computed batch → restore-computed.mts --batch <name> (founders 31-1c);')
console.log('  a hand-written batch → content review by a person (docs/rationale-repairs/), then withdraw.mts --undo.')
