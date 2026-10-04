// Privacy page facts re-checked against code and database on 2026-10-04 (audit #8, founders'
// reply 1a). Each assertion pins a sentence that had drifted from what the site does.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync('app/privacy/PrivacyClient.tsx', 'utf8')
const { USER_SCOPED_TABLES } = await import('../privacy/userData.ts')
const { CLOUD_SETTINGS_KEYS } = await import('../cloudKeys.ts')

test('the calm lock is no longer listed as synced (removed 2026-10-02)', () => {
  assert.doesNotMatch(page, /平靜鎖|calm lock/i)
  assert.ok(!(CLOUD_SETTINGS_KEYS as readonly string[]).includes('dse_calm_lock'))
})

test('the visit log says it keeps the time of the first open (user_sessions.first_seen)', () => {
  assert.match(page, /一日一行：日期，同埋你嗰日第一次開 app 嘅時間，冇其他。/)
  assert.match(page, /the date, and the time you first opened the app that day/)
  assert.doesNotMatch(page, /淨係一個日期，冇其他/)
})

test('account deletion lists only tables that exist', () => {
  assert.deepEqual([...USER_SCOPED_TABLES].sort(), ['privacy_consents', 'profiles', 'user_progress', 'user_sessions', 'user_settings'])
})

test('the wall data deletion date and the check date are the real ones', () => {
  assert.match(page, /2026 年 9 月 9 日由資料庫刪走/)
  assert.match(page, /最近一次喺 2026 年 10 月 4 日對住實際代碼同實際資料庫核實過/)
})
