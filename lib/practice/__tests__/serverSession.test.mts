import assert from 'node:assert/strict'
import { describe, it, before } from 'node:test'
import type { MCQuestion } from '../../../data/questions/types.ts'
import {
  assertNoAnswerLeak,
  buildSession,
  decodeSession,
  gradeSession,
} from '../serverSession.ts'

before(() => {
  process.env.PRACTICE_SESSION_HMAC_SECRET = 'test-secret-at-least-32-characters-long!!'
})

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

const sample2: MCQuestion = {
  ...sample,
  id: 't_mc_2',
  options: ['a', 'b', 'c', 'd'],
  optionsEn: ['a', 'b', 'c', 'd'],
  correctIndex: 2,
}

describe('serverSession', () => {
  it('public session items and token do not leak answer keys', () => {
    const { token, publicItems } = buildSession('math', [sample, sample2], 2)
    assert.ok(token.includes('.'))
    const leaks = assertNoAnswerLeak({ token, items: publicItems })
    assert.deepEqual(leaks, [])
    const payload = decodeSession(token)
    assert.ok(payload)
    assert.equal(payload!.v, 2)
    assert.ok(Array.isArray(payload!.itemIds))
    assert.equal('items' in payload!, false)
    for (const item of publicItems) {
      assert.equal('correctShuffledIndex' in item, false)
      assert.equal('correctIndex' in item, false)
      assert.equal('explanation' in item, false)
    }
  })

  it('grades against shuffled indices with fixed session total', () => {
    const bank = [sample, sample2]
    const { token, publicItems } = buildSession('math', bank, 2)
    assert.equal(publicItems.length, 2)
    const answers = publicItems.map((item) => {
      // correct zh text: sample correct is options[correctIndex] in bank
      const bankQ = bank.find((q) => q.id === item.id)!
      const correctText = bankQ.options[bankQ.correctIndex]
      return { id: item.id, chosenIndex: item.options.indexOf(correctText) }
    })
    const g = gradeSession(token, answers, bank)
    assert.equal(g.ok, true)
    if (g.ok) {
      assert.equal(g.score, 2)
      assert.equal(g.total, 2)
    }
  })

  it('does not inflate score via duplicate ids; missing counts as wrong', () => {
    const bank = [sample, sample2]
    const { token, publicItems } = buildSession('math', bank, 2)
    const first = publicItems[0]
    const bankQ = bank.find((q) => q.id === first.id)!
    const correctText = bankQ.options[bankQ.correctIndex]
    const chosenIndex = first.options.indexOf(correctText)
    const g = gradeSession(
      token,
      [
        { id: first.id, chosenIndex },
        { id: first.id, chosenIndex },
        { id: first.id, chosenIndex },
      ],
      bank,
    )
    assert.equal(g.ok, true)
    if (g.ok) {
      assert.equal(g.total, 2)
      assert.equal(g.score, 1)
    }
  })
})
