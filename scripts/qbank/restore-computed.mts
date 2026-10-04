#!/usr/bin/env -S npx tsx
// ============================================================================
// restore-computed.mts — put a computed rationale-repair batch back into practice
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/restore-computed.mts --batch M1-02 [--dry]
//   then: npm run gen:summary, deploy, sync-questions --push (charter §12.1 constraint 3)
//
// Founders' reply 31-1c (2026-10-04) changed the 2026-09-29 rule for one kind of
// repair. A batch whose options and notes are recomputed by a program from the stem
// (batch file `computed: true`, with an independent recomputation in
// lib/__tests__/rationale-repairs.test.mts) goes back into practice after the
// automated checks, without a person's content review — the same standard as every
// other live question. It is recorded as `restoreBasis: "machine-gate"`, and
// /transparency says these questions have not been reviewed by a person.
//
// Hand-written (text) repairs are unchanged: they still need the content review by a
// person who knows the subject. This script refuses any batch not marked computed.
// It never writes a reviewer's name (charter §16.C, §18.1 point 2).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const args = process.argv.slice(2)
const name = args[args.indexOf('--batch') + 1]
const DRY = args.includes('--dry')
if (!args.includes('--batch') || !name) {
  console.error('usage: restore-computed.mts --batch <name> [--dry]')
  process.exit(2)
}

const batch = JSON.parse(readFileSync(join(ROOT, `data/questions/rationale-repairs/${name}.json`), 'utf8')) as {
  batch: string; subject: string; computed?: boolean; repairs: { id: string }[]
}
if (batch.computed !== true) {
  console.error(`✗ ${name} is not a computed batch. Hand-written repairs still need a person's content review (docs/rationale-repairs.md).`)
  process.exit(1)
}

const logPath = join(ROOT, 'data/questions/rationale-repairs.json')
const wPath = join(ROOT, 'data/questions/withdrawn.json')
const log = JSON.parse(readFileSync(logPath, 'utf8')) as Record<string, { subject: string; batch: string | null; stage: string; updated: string; contentReview: unknown; restoreBasis?: string }>
const withdrawn = JSON.parse(readFileSync(wPath, 'utf8')) as Record<string, Record<string, unknown>>

const problems: string[] = []
for (const { id } of batch.repairs) {
  const r = log[id]
  if (!r) { problems.push(`${id}: not in rationale-repairs.json`); continue }
  if (r.batch !== batch.batch) problems.push(`${id}: log says batch ${r.batch}`)
  if (r.stage !== 'automated-checked') problems.push(`${id}: stage is ${r.stage}, expected automated-checked`)
  if (r.contentReview !== null) problems.push(`${id}: has a content review recorded; use the reviewed path instead`)
  if (!withdrawn[batch.subject]?.[id]) problems.push(`${id}: is not withdrawn`)
}
if (problems.length) {
  console.error(`✗ ${name}: ${problems.length} problem(s); nothing written.\n  ` + problems.join('\n  '))
  process.exit(1)
}
if (DRY) {
  console.log(`(--dry) ${name}: ${batch.repairs.length} questions would go back into practice.`)
  process.exit(0)
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date())
for (const { id } of batch.repairs) {
  delete withdrawn[batch.subject][id]
  log[id] = { ...log[id], stage: 'restored', restoreBasis: 'machine-gate', updated: today }
}
if (!Object.keys(withdrawn[batch.subject]).length) delete withdrawn[batch.subject]
writeFileSync(wPath, JSON.stringify(withdrawn, null, 2) + '\n')
writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n')
console.log(`✓ ${name}: ${batch.repairs.length} questions back in practice (machine gate, not reviewed by a person).`)
console.log('  Next: npm run gen:summary, deploy, then sync-questions --push.')
