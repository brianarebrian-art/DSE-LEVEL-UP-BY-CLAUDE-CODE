import test from 'node:test'
import assert from 'node:assert/strict'
import * as tutorNs from '../tutor/socratic.ts'

const tutor = (tutorNs as unknown as { default?: typeof tutorNs }).default ?? tutorNs

test('three misses on Differentiation trace to Algebra and never name the correct option', () => {
  const drill = tutor.tutorDrill('m2-differentiation')
  assert.ok(drill)
  const reply = tutor.socraticReply('m2-differentiation', 3, '我寫了式但沒有用詞')
  assert.ok(reply)
  assert.equal(reply.kind, 'similar')
  assert.equal(reply.revealsAnswer, false)
  assert.equal(reply.prerequisites.some((node) => node.id === 'm2-algebra'), true)
  assert.equal(tutor.replyLeaksAnswer(reply, drill), false)
  assert.ok(reply.similar)
  assert.equal(reply.explainerSrc, '/explainers/m2-differentiation.svg')
  assert.ok(reply.keywordPrompt)
})

test('the first two misses stay on simplify and analogy', () => {
  assert.equal(tutor.socraticReply('chem-electrolysis', 1)?.kind, 'simplify')
  assert.equal(tutor.socraticReply('bio-genetics', 2)?.kind, 'analogy')
  assert.equal(tutor.socraticReply('bio-genetics', 2)?.similar, null)
})

test('every drill hides its correct option inside hints and the similar item', () => {
  for (const drill of tutor.TUTOR_DRILLS) {
    for (const misses of [1, 2, 3]) {
      const reply = tutor.socraticReply(drill.topicId, misses, '沒有關鍵詞')
      assert.ok(reply)
      assert.equal(tutor.replyLeaksAnswer(reply, drill), false, drill.topicId)
    }
  }
})

test('a written answer that already contains a keyword is not prompted again', () => {
  assert.equal(tutor.keywordGap('m2-differentiation', '這是導數的定義'), null)
  assert.ok(tutor.keywordGap('m2-differentiation', ''))
})
