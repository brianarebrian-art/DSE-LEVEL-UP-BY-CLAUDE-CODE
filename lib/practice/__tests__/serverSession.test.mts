import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { MCQuestion } from '../../../data/questions/types.ts'
import {
  assertNoAnswerLeak,
  buildSession,
  gradeSession,
} from '../serverSession.ts'

const sample: MCQuestion = {
  id: 't_mc_1',
  type: 'mc',
  subject: 'math',
  topic: 'quadratic_equations',
  topicZh: '二次方程',
  framework: 'f',
  frameworkZh: 'f',
  frameworkEmoji: '',
  difficulty: 'medium',
  year: 0,
  content: '解 x^2 - 5x + 6 = 0 的正根和為？',
  contentEn: 'Sum of positive roots of x^2-5x+6=0?',
  options: ['5', '6', '1', '0'],
  optionsEn: ['5', '6', '1', '0'],
  correctIndex: 0,
  explanation: '韋達定理：根之和為 5。',
  explanationEn: 'Vieta: sum of roots is 5.',
  marks: 1,
}

describe('serverSession', () => {
  it('public session items do not leak answer keys', () => {
    const { token, publicItems } = buildSession('math', [sample, { ...sample, id: 't_mc_2', options: ['a', 'b', 'c', 'd'], correctIndex: 2 }], 2)
    assert.ok(token.includes('.'))
    const leaks = assertNoAnswerLeak({ items: publicItems })
    assert.deepEqual(leaks, [])
    for (const item of publicItems) {
      assert.equal('correctShuffledIndex' in item, false)
      assert.equal('correctIndex' in item, false)
      assert.equal('explanation' in item, false)
    }
  })

  it('grades against shuffled indices', () => {
    const { token, publicItems } = buildSession('math', [sample], 1)
    const item = publicItems[0]
    // Find which displayed option equals stored correct text "5"
    const chosenIndex = item.options.indexOf('5')
    assert.ok(chosenIndex >= 0)
    const g = gradeSession(token, [{ id: item.id, chosenIndex }])
    assert.equal(g.ok, true)
    if (g.ok) {
      assert.equal(g.score, 1)
      assert.equal(g.total, 1)
      assert.equal(g.details[0].correct, true)
    }
  })
})
