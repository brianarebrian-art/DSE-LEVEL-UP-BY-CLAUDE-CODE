import { test } from 'node:test'
import assert from 'node:assert/strict'

type Mod = typeof import('../progressPortability.ts')
const raw = (await import('../progressPortability.ts')) as Mod & { default?: Mod }
const { isUsableAttemptShape, isUsableResultShape, sanitizePortableValue } = raw.default ?? raw

const goodAttempt = {
  subjectId: 'math',
  score: 7,
  total: 10,
  timestamp: Date.now(),
  topicResults: [],
}

test('rejects impossible scores and empty result shells', () => {
  assert.equal(isUsableAttemptShape({ ...goodAttempt, score: 11 }), false)
  assert.equal(isUsableAttemptShape(goodAttempt), true)
  assert.equal(isUsableResultShape({}), false)
  assert.equal(
    isUsableResultShape({ score: 7, total: 10, elapsed: 12, topicResults: [] }),
    true,
  )
})

test('sanitizePortableValue drops bad progress and keeps good', () => {
  assert.equal(sanitizePortableValue('dse_progress', [{ score: 9, total: 1 }]), undefined)
  const ok = sanitizePortableValue('dse_progress', [goodAttempt, { junk: true }])
  assert.ok(Array.isArray(ok) && ok.length === 1)
  assert.equal(sanitizePortableValue('dse_result', {}), undefined)
})
