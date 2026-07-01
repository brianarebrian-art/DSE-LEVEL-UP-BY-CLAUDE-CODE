#!/usr/bin/env node
// DSE Level Up — question-bank importer + QUALITY GATE.
// =============================================================================
// Converts a spec-format JSON bank (dse-25k-bank/<subject>.json) into a typed TS
// bank the app can load — but ONLY questions that pass the quality gate. Bad or
// duplicate questions are REJECTED (not silently imported), which is what keeps the
// "academic correctness = 生死線" rule intact even for bulk-generated banks.
//
// Plain Node ESM (no tsx needed):
//   node scripts/import-bank.mjs --in dse-25k-bank/m1.json --subject m1
//   node scripts/import-bank.mjs --in bank.json --subject m1 --out data/questions --dry
//
// Output: data/questions/<subject>-imported.ts  exporting
//   export const <camel>ImportedQuestions: Question[] = [ ... ]
// Then merge it into that subject's loader in data/questions/load.ts (see README).

import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const IN = arg('in')
const SUBJECT = arg('subject')
const OUT_DIR = arg('out', 'data/questions')
const DRY = args.includes('--dry')

if (!IN || !SUBJECT) {
  console.error('usage: node scripts/import-bank.mjs --in <file.json> --subject <subjectId> [--out <dir>] [--dry]')
  process.exit(2)
}

// ── config ──────────────────────────────────────────────────────────────────────
const DIFFICULTY_MAP = { basic: 'easy', intermediate: 'medium', hard: 'hard' }
const MIN_QUESTION_LEN = 5
const MIN_EXPLANATION_LEN = 10
const BANNED_OPTION_PATTERNS = [/以上皆[是非]/, /all of the above/i, /none of the above/i]

const norm = (s) => String(s).trim().replace(/\s+/g, ' ').toLowerCase()
const slug = (s) => String(s).trim().replace(/\s+/g, '_')

// ── the gate: validate one raw row ────────────────────────────────────────────
function validateRow(row) {
  const e = []
  if (typeof row?.id !== 'string' || !row.id.trim()) e.push('missing/blank id')
  if (row?.type !== 'mc') e.push(`type must be "mc" (got ${JSON.stringify(row?.type)})`)
  if (typeof row?.subject !== 'string' || !row.subject.trim()) e.push('missing/blank subject')
  if (typeof row?.topic !== 'string' || !row.topic.trim()) e.push('missing/blank topic')
  if (!(row?.difficulty in DIFFICULTY_MAP)) e.push(`difficulty must be basic|intermediate|hard (got ${JSON.stringify(row?.difficulty)})`)
  if (typeof row?.question !== 'string' || row.question.trim().length < MIN_QUESTION_LEN) e.push('question too short / missing')

  const opts = row?.options
  if (!Array.isArray(opts) || opts.length !== 4) {
    e.push(`options must be exactly 4 (got ${Array.isArray(opts) ? opts.length : 'non-array'})`)
  } else {
    if (opts.some((o) => typeof o !== 'string' || !o.trim())) e.push('an option is blank/non-string')
    if (new Set(opts.map(norm)).size !== opts.length) e.push('duplicate options')
    if (opts.some((o) => BANNED_OPTION_PATTERNS.some((p) => p.test(String(o))))) e.push('banned "以上皆是/皆非 / all/none of the above" option')
  }

  if (!Number.isInteger(row?.correctIndex) || row.correctIndex < 0 || row.correctIndex > 3) e.push('correctIndex must be an integer 0..3')
  if (typeof row?.explanation !== 'string' || row.explanation.trim().length < MIN_EXPLANATION_LEN) e.push('explanation too short / missing (詳細解釋 required)')

  return e
}

// ── map an accepted row → MCQuestion (monolingual; app falls back to zh in EN) ──
function toMCQuestion(row) {
  return {
    id: row.id.trim(),
    type: 'mc',
    subject: SUBJECT,
    topic: slug(row.topic),
    topicZh: row.topic.trim(),
    framework: 'imported',
    frameworkZh: '綜合練習',
    frameworkEmoji: '📝',
    difficulty: DIFFICULTY_MAP[row.difficulty],
    year: 0, // imported: no exam year
    content: row.question.trim(),
    options: row.options.map((o) => String(o).trim()),
    correctIndex: row.correctIndex,
    explanation: row.explanation.trim(),
    marks: 1,
  }
}

// ── run ────────────────────────────────────────────────────────────────────────
let raw
try {
  raw = JSON.parse(readFileSync(IN, 'utf8'))
} catch (err) {
  console.error(`✗ cannot read/parse ${IN}: ${err.message}`)
  process.exit(1)
}
if (!Array.isArray(raw)) {
  console.error(`✗ ${IN} must be a JSON array of questions`)
  process.exit(1)
}

const accepted = []
const rejected = []
const seenIds = new Set()
const seenQ = new Set()

for (let i = 0; i < raw.length; i++) {
  const row = raw[i]
  const errs = validateRow(row)
  // cross-row dedup
  const id = typeof row?.id === 'string' ? row.id.trim() : `#${i}`
  if (seenIds.has(id)) errs.push('duplicate id (already seen)')
  if (typeof row?.question === 'string' && seenQ.has(norm(row.question))) errs.push('duplicate question text')

  if (errs.length) {
    rejected.push({ index: i, id, reasons: errs })
    continue
  }
  seenIds.add(id)
  seenQ.add(norm(row.question))
  accepted.push(toMCQuestion(row))
}

// ── report ──────────────────────────────────────────────────────────────────────
const reasonTally = {}
for (const r of rejected) for (const reason of r.reasons) reasonTally[reason] = (reasonTally[reason] || 0) + 1

console.log(`\n📋 Quality gate — ${basename(IN)} → subject "${SUBJECT}"`)
console.log(`   total ${raw.length}  ·  ✓ accepted ${accepted.length}  ·  ✗ rejected ${rejected.length}`)
if (rejected.length) {
  console.log('   reject reasons:')
  for (const [reason, n] of Object.entries(reasonTally).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(4)} × ${reason}`)
  }
  console.log('   first few rejected:')
  for (const r of rejected.slice(0, 5)) console.log(`     [${r.index}] ${r.id}: ${r.reasons.join('; ')}`)
}

// difficulty split of accepted
const diff = accepted.reduce((a, q) => ((a[q.difficulty] = (a[q.difficulty] || 0) + 1), a), {})
console.log(`   accepted difficulty: easy ${diff.easy || 0} / medium ${diff.medium || 0} / hard ${diff.hard || 0}`)

if (DRY) {
  console.log('\n(--dry: no file written)\n')
  process.exit(rejected.length ? 1 : 0)
}

// ── write the typed bank ──────────────────────────────────────────────────────
const camel = SUBJECT.replace(/[-_](.)/g, (_, c) => c.toUpperCase())
const exportName = `${camel}ImportedQuestions`
const outFile = `${OUT_DIR}/${SUBJECT}-imported.ts`
const header = `// AUTO-GENERATED by scripts/import-bank.mjs from ${basename(IN)} on ${new Date().toISOString().slice(0, 10)}.\n// ${accepted.length} questions passed the quality gate (${rejected.length} rejected). Do NOT hand-edit.\nimport type { Question } from './types'\n\nexport const ${exportName}: Question[] = `
writeFileSync(outFile, header + JSON.stringify(accepted, null, 2) + '\n')
console.log(`\n✓ wrote ${outFile}  (export ${exportName})`)
console.log(`  → merge it into "${SUBJECT}" in data/questions/load.ts (see scripts/README-question-import.md)\n`)
process.exit(0)
