// K5 (math-parametric): the "full base side" distractor must be arccos(side/edge),
// the same angle the explanation names. The previous generator used atan2 and
// then described a different formula.
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { mathParametricQuestions } = await import('../math-parametric.ts')

test('mp_k5 distractor matches arccos of the full base side', () => {
  const qs = mathParametricQuestions.filter((q) => q.id.startsWith('mp_k5_'))
  assert.equal(qs.length, 10)
  for (const q of qs) {
    const side = Number(q.content.match(/邊長 \$(\d+)\$/)?.[1])
    const edge = Number(q.content.match(/側棱（頂點到底角）長 \$(\d+)\$/)?.[1])
    assert.ok(side > 0 && edge > side, q.id)
    const dSide = Math.round((Math.acos(side / edge) * 180) / Math.PI)
    assert.equal(q.options[3], `$${dSide}^\\circ$`, q.id)
    assert.equal(new Set(q.options).size, 4, q.id)
    assert.ok(q.explanation.includes(`$${dSide}^\\circ$`), q.id)
    assert.ok(q.explanation.includes(`\\cos^{-1}(${side}/${edge})`), q.id)
  }
})
