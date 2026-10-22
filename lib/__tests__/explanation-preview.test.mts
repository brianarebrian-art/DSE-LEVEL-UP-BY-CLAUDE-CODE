import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { previewSteps, splitSentences } = await import('../explanationPreview.ts')

test('two or three sentences stay open; a fourth waits', () => {
  const two = previewSteps('先因式分解。再驗根。')
  assert.deepEqual(two.steps, ['先因式分解。', '再驗根。'])
  assert.deepEqual(two.rest, [])

  const four = previewSteps('第一句。第二句。第三句。第四句。')
  assert.equal(four.steps.length, 3)
  assert.deepEqual(four.rest, ['第四句。'])
})

test('a decimal inside math is not a sentence break', () => {
  const parts = splitSentences('根是 $x = 1.5$。下一步再代入。')
  assert.equal(parts.length, 2)
  assert.match(parts[0], /\$x = 1\.5\$/)
  assert.doesNotMatch(parts[0], /^根是 \$x = 1\.$/)
})

test('one sentence is shown whole, not collapsed to a fragment', () => {
  const text = '因式分解之後兩個根都要變號再逐個代入原式核對。'
  const preview = previewSteps(text)
  assert.deepEqual(preview.steps, [text])
  assert.deepEqual(preview.rest, [])
})

test('the scolding always-show control is gone from the explanation component', () => {
  const src = readFileSync(new URL('../../components/StagedExplanation.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(src, /以後唔好收埋/)
  assert.match(src, /previewSteps/)
})
