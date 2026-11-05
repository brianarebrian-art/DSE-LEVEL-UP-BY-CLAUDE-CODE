import test from 'node:test'
import assert from 'node:assert/strict'

const SG: any = await import('../socraticGuide.ts')
const {
  buildSocraticSteps,
  assessKeywordCoverage,
} = SG.default?.buildSocraticSteps ? SG.default : SG

test('Socratic Guide: 建立三級啟發引導階梯', () => {
  const steps = buildSocraticSteps({
    directionZh: '留意題目給出的已知條件中，圓半徑與切線有甚麼幾何關係？',
    directionEn: 'Notice the geometric relationship between the circle radius and the tangent.',
    conceptZh: '圓心至切點的連線必定垂直於切線（切線垂直半徑定理）。',
    conceptEn: 'The line from the centre to the point of contact is perpendicular to the tangent.',
    starterZh: '設圓心坐標為 (h, k)，先利用點到直線距離公式列出第一條等式。',
    starterEn: 'Let the center be (h, k), use the point-to-line distance formula to set up the first equation.',
  })

  assert.equal(steps.length, 3)
  assert.equal(steps[0].level, 1)
  assert.equal(steps[0].labelZh, '方向點撥')
  assert.equal(steps[1].level, 2)
  assert.equal(steps[1].labelZh, '原理聯想')
  assert.equal(steps[2].level, 3)
  assert.equal(steps[2].labelZh, '步驟起手')

  // 確保文字不包含常見 emoji
  for (const step of steps) {
    assert.doesNotMatch(step.promptZh, /[\u{1F300}-\u{1F6FF}]/u)
  }
})

test('Socratic Guide: 關鍵字覆蓋評估（比對考評局核心詞）', () => {
  const expectedKeywords = ['垂直', '半徑', '勾股定理']
  const studentNote = '我知道呢度有條切線，切線同半徑互相垂直，所以可以計出直角。'

  const { matched, missing } = assessKeywordCoverage(studentNote, expectedKeywords)

  assert.deepEqual(matched, ['垂直', '半徑'])
  assert.deepEqual(missing, ['勾股定理'])
})
