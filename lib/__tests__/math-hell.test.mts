import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const { mathHellQuestions } = await import('../../data/questions/math-hell.ts')

describe('math hell hard pack', () => {
  it('adds hard MC into existing topic ids', () => {
    assert.ok(mathHellQuestions.length >= 8)
    for (const q of mathHellQuestions) {
      assert.equal(q.difficulty, 'hard')
      assert.equal(q.type, 'mc')
      assert.ok(q.topic)
      assert.equal(q.topic.startsWith('math_hell'), false)
      assert.equal(q.correctIndex, 0)
      assert.ok(q.options.length >= 4)
    }
  })
})
