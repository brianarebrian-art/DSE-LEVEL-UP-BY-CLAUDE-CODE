// ============================================================================
// option-length-disclosure.test.mts — founders' reply 17C (2026-10-04)
// ----------------------------------------------------------------------------
// Where picking the longest option is right more than half the time, the practice
// estimate pages say the estimate may be too high. Wording approved as drafted
// ("17C ok"). The subject list comes from the live bank, never a hand-kept list.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const bias = await import('../optionLengthBias.ts')
const { LONGEST_OPTION } = await import('../../data/questions/option-length.generated.ts')
const read = (p: string) => readFileSync(p, 'utf8')

test('a subject is listed only when the longest option is right more than half the time', () => {
  assert.equal(bias.LENGTH_BIAS_THRESHOLD, 0.5)
  for (const id of Object.keys(LONGEST_OPTION)) {
    const { unique, correct } = LONGEST_OPTION[id]
    assert.equal(bias.isLengthBiased(id), unique > 0 && correct / unique > 0.5, id)
  }
  assert.equal(bias.isLengthBiased('no-such-subject'), false)
})

test('maths, M1 and physics are not listed; Chinese History is (2026-10-04 figures)', () => {
  // Pins the measured picture so a broken generator cannot empty or flood the list unnoticed.
  // Update this test, not the threshold, when questions are fixed.
  const list = bias.lengthBiasedSubjects()
  for (const id of ['math', 'm1', 'physics']) assert.ok(!list.includes(id), `${id} should not be listed`)
  assert.ok(list.includes('chinese-history'))
})

test('the practice estimate cards carry the approved sentence, on /predictor only', () => {
  const card = read('components/MasteryEstimate.tsx')
  assert.ok(card.includes('注意：呢科部分選擇題嘅正確答案往往係最長嗰個選項，唔識都可能估中，所以呢科嘅估算可能偏高。'))
  assert.match(card, /lengthBiasNote && isLengthBiased\(subjectId\)/)
  assert.match(read('app/predictor/PredictorClient.tsx'), /<MasteryEstimate[^>]*lengthBiasNote/)
  assert.doesNotMatch(read('app/result/ResultPageClient.tsx'), /lengthBiasNote/)
})

test('the method page carries the approved paragraph with the derived subject list', () => {
  const page = read('app/prediction-method/PredictionMethodClient.tsx')
  for (const part of [
    '我哋自己測試過：喺以下科目，揀最長嗰個選項有超過一半機會答中（亂揀應該只有大約四分之一），所以呢啲科目嘅練習表現估算可能偏高：',
    '。新題目已經有自動檢查擋住呢個問題。',
    'lengthBiasedSubjects()',
    'OPTION_LENGTH_MEASURED_AT',
  ]) assert.ok(page.includes(part), part)
})
