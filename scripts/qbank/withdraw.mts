#!/usr/bin/env -S npx tsx
// ============================================================================
// withdraw.mts — withdraw a live question after publication, or put it back
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/withdraw.mts --subject <id> --id <qid> --reason "<why>"
//   npx tsx scripts/qbank/withdraw.mts --subject <id> --id <qid> --undo
//   npx tsx scripts/qbank/withdraw.mts --list <file.json> --reason "<why>"
//     (bulk: the file is a JSON array of "subject/id"; Yuna 2026-09-29, fourth decision)
//
// --reason is free text or a code from WITHDRAW_CODES (hidden-topics.ts), e.g.
// POSITIONAL_RATIONALE_REFERENCE. A question that is already withdrawn is never
// overwritten, so its first record stays. Bulk mode skips it and says how many it
// skipped: two findings can then be checked for overlap instead of being added up.
//
// Charter §12 (Yuna 2026-09-26): new questions go live through the machine gate
// without prior human review; founders review afterwards and withdraw what is wrong.
// This writes data/questions/withdrawn.json, which both read paths filter
// (data/questions/hidden-topics.ts). The question file is not touched, so a
// withdrawal is always reversible and leaves a record of why.
//
// Afterwards: npm run gen:summary, commit, deploy, then
// npx tsx scripts/qbank/sync-questions.mts --push
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const FILE = join(ROOT, 'data/questions/withdrawn.json')
const args = process.argv.slice(2)
const arg = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined }
const subject = arg('subject'), id = arg('id'), reason = arg('reason'), undo = args.includes('--undo')
const list = arg('list')
if ((!list && (!subject || !id)) || (!undo && !reason) || (list && undo)) {
  console.error('usage: withdraw.mts --subject <id> --id <qid> (--reason "<why>" | --undo)')
  console.error('       withdraw.mts --list <file.json> --reason "<why>"')
  process.exit(2)
}

const m = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (m.default?.getSubjectQuestionsRaw ? m.default : m) as { getSubjectQuestionsRaw: (s: string) => { id: string }[] }
const h = await import(join(ROOT, 'data/questions/hidden-topics.ts'))
const CODES = ((h.default ?? h) as { WITHDRAW_CODES: Record<string, string> }).WITHDRAW_CODES
if (reason && /^[A-Z][A-Z_]+$/.test(reason) && !CODES[reason]) { console.error(`✗ unknown reason code ${reason} (known: ${Object.keys(CODES).join(', ')})`); process.exit(2) }

type Entry = { date: string; reason: string }
const data = JSON.parse(readFileSync(FILE, 'utf8')) as Record<string, Record<string, Entry>>
const targets = list
  ? (JSON.parse(readFileSync(list, 'utf8')) as string[]).map((k) => { const [s, ...rest] = k.split('/'); return { subject: s, id: rest.join('/') } })
  : [{ subject: subject!, id: id! }]
for (const t of targets) {
  if (!idx.getSubjectQuestionsRaw(t.subject).some((q) => q.id === t.id)) {
    console.error(`✗ ${t.subject} has no question ${t.id}`)
    process.exit(1)
  }
}

if (undo) {
  if (!data[subject!]?.[id!]) { console.error(`✗ ${subject}/${id} is not withdrawn`); process.exit(1) }
  delete data[subject!][id!]
  if (!Object.keys(data[subject!]).length) delete data[subject!]
  console.log(`✓ ${subject}/${id} restored`)
} else {
  const date = new Date().toISOString().slice(0, 10)
  const already: string[] = []
  let added = 0
  for (const t of targets) {
    if (data[t.subject]?.[t.id]) { already.push(`${t.subject}/${t.id}`); continue }
    ;(data[t.subject] ??= {})[t.id] = { date, reason: reason! }
    added++
  }
  if (!list && already.length) { console.error(`✗ ${already[0]} is already withdrawn; its record is kept`); process.exit(1) }
  console.log(`✓ withdrawn ${added} (${date}): ${reason}`)
  console.log(`  already withdrawn, skipped: ${already.length}${already.length ? ` (${already.slice(0, 5).join(', ')}${already.length > 5 ? ', …' : ''})` : ''}`)
}
writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n')
console.log('Next: npm run gen:summary, commit and deploy, then sync-questions --push.')
