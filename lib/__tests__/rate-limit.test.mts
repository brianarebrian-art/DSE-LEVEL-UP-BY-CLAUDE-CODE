// proxy.ts 嘅限流（lib/rateLimit.ts）—— 2026-09-25 保安審計。
//
// 守兩件事：
//   ① Map 有上限。原本短時間內大量唔同 IP 會令佢一路長，因為佢哋全部都未過
//      「10 分鐘冇活動」嘅清理門檻。
//   ② Better Auth 嘅密碼登入／註冊（/api/auth/sign-in、/api/auth/sign-up，有橫線）
//      行嚴格桶。原本只包 Auth.js 嘅 /api/auth/signin、/api/auth/callback。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { createLimiter, isAuthSensitivePath } = await import('../rateLimit.ts')

test('限流本身：窗口內超過上限就擋，過咗窗口放返', () => {
  const l = createLimiter()
  for (let i = 0; i < 3; i++) assert.equal(l.allow('ip1', 1000, 3, 0), true)
  assert.equal(l.allow('ip1', 1000, 3, 10), false, '第 4 次應該擋')
  assert.equal(l.allow('ip1', 1000, 3, 2000), true, '過咗窗口應該放返')
})

test('Map 有上限：5000 個唔同 IP 喺同一分鐘入嚟，size 唔會超過 maxKeys', () => {
  const l = createLimiter({ maxKeys: 100 })
  for (let i = 0; i < 5000; i++) l.allow(`ip${i}`, 60_000, 60, 1000 + i)
  assert.ok(l.size() <= 100, `size = ${l.size()}`)
})

test('丟 key 由最耐冇郁嗰啲開始，啱啱郁過嘅唔會被丟', () => {
  const l = createLimiter({ maxKeys: 10 })
  for (let i = 0; i < 10; i++) l.allow(`ip${i}`, 60_000, 2, 1000 + i)
  l.allow('ip0', 60_000, 2, 2000) // ip0 郁返，應該排到最新
  l.allow('fresh', 60_000, 2, 2001) // 超過上限，要丟一個 —— 應該係 ip1，唔係 ip0
  assert.equal(l.allow('ip0', 60_000, 2, 2002), false, 'ip0 嘅計數應該仲喺度（已經用咗 2 次）')
})

test('負向自測：冇上限嘅實作會長到 5000', () => {
  // 證明上面第二條唔係永遠都綠：用一個大到唔會觸發嘅上限，size 會真係長上去
  const l = createLimiter({ maxKeys: 1_000_000 })
  for (let i = 0; i < 5000; i++) l.allow(`ip${i}`, 60_000, 60, 1000 + i)
  assert.equal(l.size(), 5000)
})

test('嚴格桶：Auth.js 同 Better Auth 嘅登入入口都包', () => {
  for (const p of ['/api/auth/signin', '/api/auth/signin/google', '/api/auth/callback/google',
    '/api/auth/sign-in/email', '/api/auth/sign-in/social', '/api/auth/sign-up/email']) {
    assert.equal(isAuthSensitivePath(p), true, p)
  }
})

test('嚴格桶：session 輪詢同其他 API 唔包（否則正常用戶會被 429）', () => {
  for (const p of ['/api/auth/session', '/api/auth/get-session', '/api/auth/csrf', '/api/progress',
    '/api/auth/signinx', '/api/auth/sign-inx']) {
    assert.equal(isAuthSensitivePath(p), false, p)
  }
})
