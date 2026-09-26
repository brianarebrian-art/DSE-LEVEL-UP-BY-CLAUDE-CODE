// One difficulty label per MC family (data/questions/family.ts).
// Decided by Yuna on 2026-09-26; see docs/difficulty-family-unification-2026-09-26.md.

import { test } from 'node:test'
import assert from 'node:assert/strict'
// Dynamic imports, as in loader-parity.test.mts.
const { getSubjectQuestions, getSubjectQuestionsRaw } = await import('../index.ts')
const { loadSubjectQuestions } = await import('../load.ts')
const { subjects } = await import('../../subjects.ts')
const { familyKey, familyLabel, stemSkeleton } = await import('../family.ts')
const { DIFFICULTY_OVERRIDES } = await import('../difficulty-overrides.generated.ts')
const { isHiddenTopic } = await import('../hidden-topics.ts')

const active: string[] = subjects.filter((s: { isActive?: boolean }) => s.isActive !== false).map((s: { id: string }) => s.id)
const isMc = (q: { type?: string }) => (q.type ?? 'mc') === 'mc'
type Tier = 'easy' | 'medium' | 'hard'
type Row = { id: string; difficulty: Tier; topic: string }

test('the family label rule: majority, ties go to the middle', () => {
  assert.equal(familyLabel(['easy', 'easy', 'medium']), 'easy')
  assert.equal(familyLabel(['hard', 'hard', 'easy']), 'hard')
  assert.equal(familyLabel(['easy', 'medium']), 'medium')
  assert.equal(familyLabel(['medium', 'hard']), 'medium')
  assert.equal(familyLabel(['easy', 'hard']), 'medium')
  assert.equal(familyLabel(['easy', 'medium', 'hard']), 'medium')
})

test('a family differs only in digits: formulas and words still separate questions', () => {
  assert.equal(stemSkeleton('（第 1 組）求 $2x^{3}$'), stemSkeleton('（第 12 組）求 $7x^{3}$'))
  assert.notEqual(stemSkeleton('求 $\\frac{d}{dx}(2x^{3})$'), stemSkeleton('求 $\\frac{d}{dx}(\\sin x)$'))
  assert.notEqual(stemSkeleton('比喻'), stemSkeleton('借代'))
})

test('every MC family now carries exactly one label', () => {
  const bad: string[] = []
  for (const s of active) {
    const labels = new Map<string, Set<string>>()
    for (const q of getSubjectQuestions(s)) {
      if (!isMc(q)) continue
      const k = familyKey(s, q)
      labels.set(k, (labels.get(k) ?? new Set()).add(q.difficulty))
    }
    for (const [k, set] of labels) if (set.size > 1) bad.push(`${k.slice(0, 80)} → ${[...set].join('/')}`)
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} families still mixed; run npm run qbank:family-difficulty`)
})

test('the generated overrides match the source labels (file is not stale)', () => {
  const expected: Record<string, Record<string, string>> = {}
  for (const s of [...active].sort()) {
    const groups = new Map<string, Row[]>()
    for (const q of getSubjectQuestionsRaw(s)) {
      if (!isMc(q)) continue
      const k = familyKey(s, q)
      groups.set(k, [...(groups.get(k) ?? []), q])
    }
    const map: Record<string, string> = {}
    for (const qs of groups.values()) {
      const label = familyLabel(qs.map((q) => q.difficulty))
      for (const q of qs) if (q.difficulty !== label) map[q.id] = label
    }
    if (Object.keys(map).length) expected[s] = map
  }
  assert.deepEqual(DIFFICULTY_OVERRIDES, expected, 'run npm run qbank:family-difficulty, then npm run gen:summary')
})

test('overrides only change difficulty, and only on questions that exist', () => {
  for (const [s, map] of Object.entries<Record<string, string>>(DIFFICULTY_OVERRIDES)) {
    const raw = new Map<string, Row>(getSubjectQuestionsRaw(s).map((q: Row) => [q.id, q]))
    const out = new Map<string, Row>(getSubjectQuestions(s).map((q: Row) => [q.id, q]))
    for (const [id, d] of Object.entries(map)) {
      const before = raw.get(id), after = out.get(id)
      assert.ok(before, `${s}: override for unknown id ${id}`)
      // Families are computed on the whole bank, withheld topics included (hidden-topics.ts),
      // so their overrides stay ready for when they come back.
      if (!after) { assert.ok(isHiddenTopic(s, before.topic), `${s}/${id}: missing from the served bank`); continue }
      assert.notEqual(before.difficulty, d, `${s}/${id}: override does not change anything`)
      assert.deepEqual({ ...after, difficulty: before.difficulty }, before, `${s}/${id}: override changed more than difficulty`)
    }
  }
})

test('the bundled fallback path serves the same labels as the barrel', async () => {
  // On the server loadFromCloud returns null, so this exercises the static chunk path.
  for (const s of Object.keys(DIFFICULTY_OVERRIDES)) {
    const want = new Map(getSubjectQuestions(s).map((q: { id: string; difficulty: string }) => [q.id, q.difficulty]))
    for (const q of await loadSubjectQuestions(s)) assert.equal(q.difficulty, want.get(q.id), `${s}/${q.id}`)
  }
})
