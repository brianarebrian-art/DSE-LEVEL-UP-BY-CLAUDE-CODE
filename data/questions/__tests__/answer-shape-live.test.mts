// ============================================================================
// answer-shape-live.test.mts — "pick the longest option" must not work on new questions
// ----------------------------------------------------------------------------
// Founders' replies 17A and 17A-2a (2026-10-04). On that day, picking the single
// longest option was correct for 50.7% of the 25,400 live MC questions (25% by
// chance), and for 99.2% in Chinese History. Options are shuffled at display time,
// so length is the only shape signal a student can use.
//
// Two checks, both on the published practice pool, whatever route a question
// took into the bank (draft gate, template bank, auto-promote):
//
// 1. Per question: the correct option may not be SHAPE_MARGIN_LIMIT or more visual
//    characters wider than the widest wrong option (same rule as _gate.mjs).
//    Questions over the margin on 2026-10-04 are exempt
//    (scripts/qbank/shape-baseline-live.json); that list may only shrink.
// 2. Per subject: across all questions added after 2026-10-04
//    (ids not in scripts/qbank/mc-ids-2026-10-04.json), picking the longest
//    option may succeed at most SUBJECT_LONGEST_LIMIT of the time, once there are
//    SUBJECT_MIN_NEW questions with a single longest option.
//
// The fix for a failure is to rewrite the wrong options to the same weight as the
// correct one, never to add an exemption.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { getSubjectQuestions } = await import('../index.ts')
const { subjects } = await import('../../subjects.ts')
const g = (await import('../../../scripts/qbank/_gate.mjs')) as unknown as {
  visualLength: (s: string) => number
  answerShapeMargin: (o: string[], i: number) => number
  longestOptionStats: (qs: { options?: string[]; correctIndex?: number }[]) => { unique: number; correct: number }
  SHAPE_MARGIN_LIMIT: number
  SUBJECT_LONGEST_LIMIT: number
  SUBJECT_MIN_NEW: number
}

type MC = { id: string; type?: string; options?: string[]; correctIndex?: number }
const active = subjects.filter((s: { isActive?: boolean }) => s.isActive !== false) as { id: string }[]
const isMc = (q: MC) => (q.type ?? 'mc') === 'mc' && Array.isArray(q.options) && q.options.length === 4 && Number.isInteger(q.correctIndex)
const live = active.map((s) => ({ id: s.id, mc: (getSubjectQuestions(s.id) as MC[]).filter(isMc) }))

const BASELINE = JSON.parse(readFileSync('scripts/qbank/shape-baseline-live.json', 'utf8')) as { ids: string[]; count: number; limit: number }
const SNAPSHOT = JSON.parse(readFileSync('scripts/qbank/mc-ids-2026-10-04.json', 'utf8')) as { subjects: Record<string, string[]> }
const FIX = 'rewrite the wrong options so they carry the same weight as the correct one (see the header of this file)'

/** The subject-level rule (reply 17A-2a). Returns a reason when the rate is over the limit, else null. */
function subjectRateProblem(qs: MC[]): string | null {
  const { unique, correct } = g.longestOptionStats(qs)
  if (unique < g.SUBJECT_MIN_NEW) return null
  const rate = correct / unique
  return rate > g.SUBJECT_LONGEST_LIMIT
    ? `picking the longest option is correct in ${correct}/${unique} (${(rate * 100).toFixed(1)}%), limit ${g.SUBJECT_LONGEST_LIMIT * 100}%`
    : null
}

// ── The rules themselves (synthetic questions) ───────────────────────────────
const q = (options: string[], correctIndex: number, id = 'probe'): MC => ({ id, options, correctIndex })
const LONG = '這是一個寫得比其他選項稍長的正確答案'
const biased = Array.from({ length: 20 }, (_, i) => q([LONG, '較短的錯誤選項甲', '較短的錯誤選項乙', '較短的錯誤選項丙'], 0, `b${i}`))

test('subject rule: 20 new questions where the longest option is always correct — fails', () => {
  assert.match(subjectRateProblem(biased) ?? '', /20\/20/)
})

test('subject rule: fewer than SUBJECT_MIN_NEW countable questions — not judged yet', () => {
  assert.equal(subjectRateProblem(biased.slice(0, g.SUBJECT_MIN_NEW - 1)), null)
})

test('subject rule: longest option correct 8 times in 20 (40%) — passes; 9 in 20 — fails', () => {
  const wrongLongest = q(['較短的正確答案', LONG, '較短的錯誤選項乙', '較短的錯誤選項丙'], 0)
  const mix = (k: number) => [...biased.slice(0, k), ...Array.from({ length: 20 - k }, () => wrongLongest)]
  assert.equal(subjectRateProblem(mix(8)), null)
  assert.ok(subjectRateProblem(mix(9)))
})

test('subject rule: questions without a single longest option are not counted', () => {
  const tie = q(['長度相同的選項一', '長度相同的選項二', '長度相同的選項三', '長度相同的選項四'], 0)
  assert.deepEqual(g.longestOptionStats(Array.from({ length: 30 }, () => tie)), { unique: 0, correct: 0 })
})

// ── The live bank ────────────────────────────────────────────────────────────
test('no published question outside the exempt list has a clearly longest correct option', () => {
  const exempt = new Set(BASELINE.ids)
  const bad: string[] = []
  for (const s of live) {
    for (const x of s.mc) {
      const key = `${s.id}/${x.id}`
      if (exempt.has(key)) continue
      const m = g.answerShapeMargin(x.options!, x.correctIndex!)
      if (m >= g.SHAPE_MARGIN_LIMIT) bad.push(`${key} (+${m})`)
    }
  }
  assert.deepEqual(bad, [], `${bad.length} question(s) have a correct option ${g.SHAPE_MARGIN_LIMIT}+ characters wider than every wrong one: ${FIX}`)
})

test('the exempt list only shrinks', () => {
  assert.equal(BASELINE.ids.length, BASELINE.count, 'count and ids differ — rerun gen-shape-baseline-live.mts')
  assert.equal(BASELINE.limit, g.SHAPE_MARGIN_LIMIT, 'the list was made with a different margin than _gate.mjs')
  assert.equal(new Set(BASELINE.ids).size, BASELINE.ids.length, 'duplicate ids in the exempt list')
  // Pinned by hand so that any growth shows up in a diff. Lower it after fixing
  // questions; never raise it. 5,267 on 2026-10-04 (published and unpublished);
  // 5,219 after the Chinese History pilot rewrite of the same day (reply 17B, 48 questions).
  const CEILING = 5219
  assert.ok(BASELINE.ids.length <= CEILING, `exempt list grew from ${CEILING} to ${BASELINE.ids.length}: ${FIX}`)
})

test('the 2026-10-04 id snapshot is untouched', () => {
  // Regenerating it would quietly turn new questions into old ones.
  const n = Object.values(SNAPSHOT.subjects).reduce((a, l) => a + l.length, 0)
  assert.equal(n, 26261, 'mc-ids-2026-10-04.json changed — it must never be regenerated or edited')
})

test('per subject, new questions do not reward picking the longest option', () => {
  const problems: string[] = []
  for (const s of live) {
    const old = new Set(SNAPSHOT.subjects[s.id] ?? [])
    const fresh = s.mc.filter((x) => !old.has(x.id))
    const p = subjectRateProblem(fresh)
    if (p) problems.push(`${s.id}: ${p}`)
  }
  assert.deepEqual(problems, [], `new questions: ${FIX}`)
})
