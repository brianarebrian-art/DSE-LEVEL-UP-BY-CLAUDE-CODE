// Two share cards (UX audit A2 (c); Yuna 2026-09-21, carried out 2026-09-26).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')
const cc: any = await import('../causeCard.ts')
const CC = cc.default?.buildCauseCardData ? cc.default : cc

const NOW = new Date('2026-09-26T15:00:00+08:00').getTime()
const e = (cause: string, subjectId = 'economics', ts = NOW - 3_600_000) => ({
  subjectId, questionId: 'q', topic: 't', topicId: 't', cause, selected: '', correct: '', ts,
})
const meta = { date: '26/9/2026', subject: '經濟', siteUrl: 'example.test' }

test('the cause card has no score: no accuracy, counts, time or tiers', () => {
  const src = read('components/CauseCard.tsx')
  for (const bad of ['accuracy', 'correctCount', 'totalCount', 'timeSpent', 'avgPerQuestion', 'tiers']) {
    assert.ok(!src.includes(bad), `CauseCard must not show ${bad}`)
  }
  assert.doesNotMatch(src, /\}\s*%/, 'no value rendered as a percentage')
  assert.doesNotMatch(src, /color-neon|#00F5D4|#FF006E/, 'the cause card uses the Morandi palette')
})

test('today only, this subject only, most frequent first, without counts', () => {
  const log = [e('B'), e('A'), e('B'), e('C', 'physics'), e('C', 'economics', NOW - 3 * 86_400_000)]
  const data = CC.buildCauseCardData(log, 'economics', meta, NOW)
  assert.deepEqual(data.causes, ['B', 'A'])
  assert.equal('counts' in data, false)
})

test('no cause recorded today gives no cause card', () => {
  assert.equal(CC.buildCauseCardData([], 'economics', meta, NOW), null)
  assert.equal(CC.buildCauseCardData([e('A', 'physics')], 'economics', meta, NOW), null)
})

test('both cards exist; the cause card is the default and is disabled when empty', () => {
  const btn = read('components/ShareStatsCardButton.tsx')
  assert.match(btn, /<CauseCard ref=\{cardRef\}/)
  assert.match(btn, /<DailyStatsCard ref=\{cardRef\}/)
  assert.match(btn, /useState<Variant>\('cause'\)/)
  assert.match(btn, /picked === 'cause' && causeData \? 'cause' : 'score'/)
  assert.match(btn, /今日冇錯因紀錄/)
  assert.match(btn, /傳統成績卡/)
  const page = read('app/result/ResultPageClient.tsx')
  assert.match(page, /<ShareStatsCardButton data=\{cardData\} causeData=\{causeCardData\}/)
})
