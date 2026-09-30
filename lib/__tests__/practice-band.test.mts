// The result page describes one session in three neutral bands, never a DSE level
// (refinement loop 2, 2026-09-30).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// tsx loads lib/*.ts as CommonJS here, so the named exports sit on `default`.
type Mod = typeof import('../practiceBand.ts')
const raw = (await import('../practiceBand.ts')) as Mod & { default?: Mod }
const { getPracticePerformanceBand, MIN_BAND_EVIDENCE, PRACTICE_BAND_LABEL } = raw.default ?? raw

test('too few questions gives no band, even at 100%', () => {
  assert.equal(getPracticePerformanceBand(1, 1), 'insufficient')
  assert.equal(getPracticePerformanceBand(MIN_BAND_EVIDENCE - 1, MIN_BAND_EVIDENCE - 1), 'insufficient')
  assert.equal(getPracticePerformanceBand(0, 0), 'insufficient')
})

test('bands by share of correct answers once there is enough evidence', () => {
  assert.equal(getPracticePerformanceBand(4, 10), 'consolidate')
  assert.equal(getPracticePerformanceBand(5, 10), 'developing')
  assert.equal(getPracticePerformanceBand(7, 10), 'developing')
  assert.equal(getPracticePerformanceBand(8, 10), 'stable')
  assert.equal(getPracticePerformanceBand(MIN_BAND_EVIDENCE, MIN_BAND_EVIDENCE), 'stable')
})

test('bad input is clamped, not trusted', () => {
  assert.equal(getPracticePerformanceBand(15, 10), 'stable')
  assert.equal(getPracticePerformanceBand(-3, 10), 'consolidate')
  assert.equal(getPracticePerformanceBand(NaN, 10), 'consolidate')
  assert.equal(getPracticePerformanceBand(5, NaN), 'insufficient')
})

test('labels are the neutral words, with no mastery or level wording', () => {
  assert.deepEqual(
    Object.values(PRACTICE_BAND_LABEL).map((l) => l.zh),
    ['證據不足', '需要鞏固', '發展中', '相對穩定'],
  )
  for (const l of Object.values(PRACTICE_BAND_LABEL)) {
    assert.doesNotMatch(l.zh + l.en, /掌握|精通|master|level|等級|5\*/i)
  }
})

test('the result page shows no DSE level', () => {
  const src = readFileSync(new URL('../../app/result/ResultPageClient.tsx', import.meta.url), 'utf8')
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
  assert.match(code, /getPracticePerformanceBand\(result\.score, result\.total\)/)
  for (const banned of [/predictGrade/, /gradeRange/, /'5\*\*'/, /🏆/, /MasteryEstimate/, /marksToNext/, /TIER_LEVEL_BANDS/, /真實水平/, /歷屆試題/]) {
    assert.doesNotMatch(code, banned, `result page still uses ${banned}`)
  }
})

test('the result strings carry no grade wording', () => {
  const dict = readFileSync(new URL('../dictionary.ts', import.meta.url), 'utf8')
  const block = (from: string) => {
    const a = dict.indexOf('  result: {', dict.indexOf(from))
    return dict.slice(a, dict.indexOf('\n  dashboard: {', a))
  }
  for (const b of [block('const zh = {'), block('const en: typeof zh')]) {
    const code = b.replace(/\/\/.*$/gm, '')
    assert.doesNotMatch(code, /gradeMessages|predictedGrade|marksToNext|表現等級|Level \{|level for this set/)
  }
})
