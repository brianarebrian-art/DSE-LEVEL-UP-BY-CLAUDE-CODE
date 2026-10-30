import test from 'node:test'
import assert from 'node:assert/strict'
import { stripEmoji, containsEmoji } from '../stripEmoji.ts'

test('stripEmoji removes pictographs and collapses spaces', () => {
  assert.equal(stripEmoji('練判斷🎯唔係背答案'), '練判斷唔係背答案')
  assert.equal(stripEmoji('💡 正解思路'), '正解思路')
  assert.equal(stripEmoji('A · B'), 'A · B')
  assert.equal(stripEmoji('前  🌱  後'), '前 後')
})

test('containsEmoji detects banned glyphs', () => {
  assert.equal(containsEmoji('純文字'), false)
  assert.equal(containsEmoji('有🌱emoji'), true)
})
