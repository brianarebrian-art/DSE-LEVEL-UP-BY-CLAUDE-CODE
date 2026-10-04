// Q-T11 (founders, 2026-10-03): 同類型再一題／難啲／易啲／換課題 only reorder the rest of
// the set, never swap questions in or out.
import { test } from 'node:test'
import assert from 'node:assert/strict'

type Mod = typeof import('../adaptiveOrder.ts')
const raw = (await import('../adaptiveOrder.ts')) as Mod & { default?: Mod }
const A = raw.default ?? raw

const rest = [
  { difficulty: 'easy' as const, topic: 'algebra' },
  { difficulty: 'hard' as const, topic: 'geometry' },
  { difficulty: 'medium' as const, topic: 'algebra' },
]

test('same topic, change topic', () => {
  assert.equal(A.wishIndex(rest, { difficulty: 'medium', topic: 'geometry' }, 'same'), 1)
  assert.equal(A.wishIndex(rest, { difficulty: 'medium', topic: 'algebra' }, 'switch'), 1)
  assert.equal(A.wishIndex(rest, { difficulty: 'medium', topic: 'statistics' }, 'same'), -1)
})

test('harder and easier move one tier and stop at the ends', () => {
  assert.equal(A.wishIndex(rest, { difficulty: 'medium', topic: 'x' }, 'harder'), 1)
  assert.equal(A.wishIndex(rest, { difficulty: 'medium', topic: 'x' }, 'easier'), 0)
  assert.equal(A.wishIndex(rest, { difficulty: 'easy', topic: 'x' }, 'harder'), 2)
  assert.equal(A.wishIndex(rest, { difficulty: 'hard', topic: 'x' }, 'harder'), -1)
  assert.equal(A.wishIndex(rest, { difficulty: 'easy', topic: 'x' }, 'easier'), -1)
})
