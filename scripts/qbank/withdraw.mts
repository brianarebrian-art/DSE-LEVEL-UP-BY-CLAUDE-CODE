#!/usr/bin/env -S npx tsx
// ============================================================================
// withdraw.mts — withdraw a live question after publication, or put it back
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/withdraw.mts --subject <id> --id <qid> --reason "<why>"
//   npx tsx scripts/qbank/withdraw.mts --subject <id> --id <qid> --undo
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
if (!subject || !id || (!undo && !reason)) {
  console.error('usage: withdraw.mts --subject <id> --id <qid> (--reason "<why>" | --undo)')
  process.exit(2)
}

const m = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (m.default?.getSubjectQuestionsRaw ? m.default : m) as { getSubjectQuestionsRaw: (s: string) => { id: string }[] }
if (!idx.getSubjectQuestionsRaw(subject).some((q) => q.id === id)) {
  console.error(`✗ ${subject} has no question ${id}`)
  process.exit(1)
}

const data = JSON.parse(readFileSync(FILE, 'utf8')) as Record<string, Record<string, { date: string; reason: string }>>
if (undo) {
  if (!data[subject]?.[id]) { console.error(`✗ ${subject}/${id} is not withdrawn`); process.exit(1) }
  delete data[subject][id]
  if (!Object.keys(data[subject]).length) delete data[subject]
  console.log(`✓ ${subject}/${id} restored`)
} else {
  const date = new Date().toISOString().slice(0, 10)
  ;(data[subject] ??= {})[id] = { date, reason: reason! }
  console.log(`✓ ${subject}/${id} withdrawn (${date}): ${reason}`)
}
writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n')
console.log('Next: npm run gen:summary, commit and deploy, then sync-questions --push.')
