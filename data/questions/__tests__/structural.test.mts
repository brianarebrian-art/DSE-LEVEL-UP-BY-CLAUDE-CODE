// Structural regression suite for every active subject's question bank.
// Formalises what `_scan.mts` only reports ad hoc into real pass/fail assertions
// so a broken bank (dup options, dup ids, out-of-range correctIndex, EN-array
// length mismatch) fails `npm test` / CI instead of depending on someone
// remembering to run `_scan.mts` by hand.
//
// NOTE: `createBank().add()` (see ../_parametric.ts) already drops any tuple
// whose 4 zh option strings collide, so a healthy bank should never trip the
// option-distinctness checks below — if one does, something bypassed that
// guard (e.g. a hand-authored file, or a bank not using createBank at all).
//
// Must import the question modules via dynamic import() from this .mts file —
// a static `import ... from '../index'` silently resolves to only a `default`
// export in this project's tsx/Node setup (the `.ts` file is loaded as CJS
// under static import, but correctly as ESM under dynamic import()). This is
// the same reason the existing `_scan.mts` uses `await import(...)`.

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getActiveSubjects } = await import('../../subjects.ts')
const { getSubjectQuestions } = await import('../index.ts')

const subjects = getActiveSubjects()

test('at least one active subject is registered', () => {
  assert.ok(subjects.length > 0, 'getActiveSubjects() returned nothing — subjects.ts registry broken?')
})

test('every active subject has at least one question', () => {
  const empty = subjects.filter((s) => getSubjectQuestions(s.id).length === 0)
  assert.deepEqual(empty.map((s) => s.id), [], `subjects with zero questions: ${empty.map((s) => s.id).join(', ')}`)
})

for (const s of subjects) {
  test(`${s.id}: question ids are unique, options are well-formed`, () => {
    const qs = getSubjectQuestions(s.id)
    const seenIds = new Set()
    for (const q of qs) {
      assert.ok(!seenIds.has(q.id), `duplicate id "${q.id}" in subject "${s.id}"`)
      seenIds.add(q.id)

      assert.ok(q.id && q.id.length > 0, `empty id in subject "${s.id}"`)
      assert.ok(q.content && q.content.length > 0, `${q.id}: empty content`)

      assert.equal(q.options.length, 4, `${q.id}: expected 4 options, got ${q.options.length}`)
      assert.equal(
        new Set(q.options).size, 4,
        `${q.id}: duplicate option text (zh) — ${JSON.stringify(q.options)}`,
      )

      if (q.optionsEn) {
        assert.equal(q.optionsEn.length, q.options.length, `${q.id}: optionsEn/options length mismatch`)
        assert.equal(
          new Set(q.optionsEn).size, q.optionsEn.length,
          `${q.id}: duplicate option text (en) — ${JSON.stringify(q.optionsEn)}`,
        )
      }

      assert.ok(
        Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `${q.id}: correctIndex ${q.correctIndex} out of bounds for ${q.options.length} options`,
      )
    }
  })
}
