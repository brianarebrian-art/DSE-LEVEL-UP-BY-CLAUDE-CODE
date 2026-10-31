import test from 'node:test'
import assert from 'node:assert/strict'

// 動態 import：npm test 釘死 tsx@4.19.2，靜態具名 ESM import .ts 會報
// 「does not provide an export named …」（見 privacy-page.test.mts 檔頭同一說明）。
const { stripEmoji, containsEmoji } = await import('../stripEmoji.ts')

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
