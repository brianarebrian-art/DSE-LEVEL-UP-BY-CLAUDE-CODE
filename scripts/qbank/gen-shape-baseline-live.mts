// ============================================================================
// gen-shape-baseline-live.mts — the answer-shape check for every live question
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/gen-shape-baseline-live.mts
//
// Founders' reply 17A (2026-10-04): a new question whose correct option is
// clearly longer than the others must not go live. The check already existed in
// _gate.mjs since 2026-08-28, but only on the draft route. Most questions come
// from template banks (data/questions/*-bank.ts and similar) and never passed
// through it: 5,035 published MC questions (20%) were over the margin that day.
//
// This script writes the two files the test
// data/questions/__tests__/answer-shape-live.test.mts reads:
//
// 1. scripts/qbank/shape-baseline-live.json — the questions over the margin when
//    the check started. They are exempt ("only new questions", reply 17A).
//    The list can only shrink: on every later run it keeps only ids that were
//    already listed AND are still over the margin. Fixing a question removes it;
//    a new question over the margin is never added — it fails the test instead.
//
// 2. scripts/qbank/mc-ids-2026-10-04.json — every MC id that existed on
//    2026-10-04, written once and never changed. A question not in it is "new"
//    for the subject-level rate (reply 17A-2a). Rewriting an old question keeps
//    its id, so the 17B rewrites are not counted as new.
// ============================================================================
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const BASELINE = join(ROOT, 'scripts/qbank/shape-baseline-live.json')
const SNAPSHOT = join(ROOT, 'scripts/qbank/mc-ids-2026-10-04.json')

const idx = (await import(join(ROOT, 'data/questions/index.ts'))) as {
  getSubjectQuestionsRaw: (id: string) => { id: string; type?: string; options?: string[]; correctIndex?: number }[]
}
const { subjects } = (await import(join(ROOT, 'data/subjects.ts'))) as { subjects: { id: string; isActive?: boolean }[] }
const g = (await import(join(ROOT, 'scripts/qbank/_gate.mjs'))) as unknown as {
  answerShapeMargin: (o: string[], i: number) => number
  SHAPE_MARGIN_LIMIT: number
}

const active = subjects.filter((s) => s.isActive !== false)
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date())

// Every authored MC question, published or not: a withdrawn question that comes
// back later is still an old question, not a new one.
const mcBySubject: Record<string, string[]> = {}
const over: string[] = []
for (const s of active) {
  const ids: string[] = []
  for (const q of idx.getSubjectQuestionsRaw(s.id)) {
    if ((q.type ?? 'mc') !== 'mc' || !Array.isArray(q.options) || q.options.length !== 4) continue
    if (!Number.isInteger(q.correctIndex)) continue
    ids.push(q.id)
    if (g.answerShapeMargin(q.options, q.correctIndex as number) >= g.SHAPE_MARGIN_LIMIT) over.push(`${s.id}/${q.id}`)
  }
  mcBySubject[s.id] = ids.sort()
}

// ── 1. exempt list (shrink only) ─────────────────────────────────────────────
const NOTE = [
  'Answer-shape check for every live question (founders\' reply 17A, 2026-10-04).',
  'These questions were over the margin when the check started, so they are exempt.',
  'This list may only shrink. Do not add ids: fix the wrong options of a new question instead.',
  'Regenerate with: npx tsx scripts/qbank/gen-shape-baseline-live.mts',
  'Margin: the correct option is at least `limit` visual characters wider than the widest wrong option.',
]
let ids: string[]
let added = 0
if (existsSync(BASELINE)) {
  const prev = new Set<string>(JSON.parse(readFileSync(BASELINE, 'utf8')).ids)
  ids = over.filter((k) => prev.has(k))
  added = over.length - ids.length
} else {
  ids = over
}
ids.sort()
const prevCount = existsSync(BASELINE) ? (JSON.parse(readFileSync(BASELINE, 'utf8')).count as number) : null
writeFileSync(BASELINE, JSON.stringify({ _note: NOTE, generatedAt: today, limit: g.SHAPE_MARGIN_LIMIT, count: ids.length, ids }, null, 1) + '\n')
console.log(`✓ shape-baseline-live.json: ${ids.length} exempt${prevCount === null ? ' (first run)' : ` (was ${prevCount})`}`)
if (added > 0) console.log(`✗ ${added} question(s) over the margin are NOT exempt — the test will fail until their wrong options are rewritten.`)

// ── 2. id snapshot (written once) ────────────────────────────────────────────
if (existsSync(SNAPSHOT)) {
  console.log('· mc-ids-2026-10-04.json already exists; left unchanged')
} else {
  const body = Object.entries(mcBySubject).map(([s, list]) => `  ${JSON.stringify(s)}: ${JSON.stringify(list)}`).join(',\n')
  writeFileSync(
    SNAPSHOT,
    `{\n  "_note": ${JSON.stringify('Every MC question id that existed on 2026-10-04. Never regenerate or edit: a question not listed here is new (founders\' reply 17A-2a).')},\n  "subjects": {\n${body.replace(/^/gm, '  ')}\n  }\n}\n`,
  )
  const n = Object.values(mcBySubject).reduce((a, l) => a + l.length, 0)
  console.log(`✓ mc-ids-2026-10-04.json: ${n} ids in ${active.length} subjects`)
}
