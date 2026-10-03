// Founder answers of 2026-10-03 to FOUNDER-QUEUE Q-T02, Q-T04, Q-T10, Q-T11, Q-T39.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('Q-T10: the practice header button reads 先做到呢度, not 今日夠了', () => {
  const s = read('components/PracticeSupport.tsx')
  assert.match(s, /\{en \? 'Stop here for now' : '先做到呢度'\}/)
  assert.doesNotMatch(s.replace(/^\s*(\/\/|\/\*\*|\*).*$/gm, ''), /'今日夠了/)
})

test('Q-T02: the score share card carries no Instagram group link; the safety page says so', () => {
  assert.doesNotMatch(read('components/DailyStatsCard.tsx'), /igLink|ig\.me|IG 溫書室/)
  assert.doesNotMatch(read('app/result/ResultPageClient.tsx'), /igLink/)
  const safety = read('app/community-safety/CommunitySafetyClient.tsx')
  assert.doesNotMatch(safety, /分享卡同「呼吸空間」有一條|Your share card and the Breathing Space/)
  assert.match(safety, /「呼吸空間」有一條 Instagram 溫書群組連結/)
})
