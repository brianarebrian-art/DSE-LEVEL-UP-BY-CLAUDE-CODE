// proxy.ts 嘅限流（lib/rateLimit.ts）—— 2026-09-25 保安審計 + Supabase Auth 重建。
//
// 守兩件事：
//   ① Map 有上限。
//   ② OAuth callback／migrate 行嚴格桶。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const {
  createLimiter,
  isAuthSensitivePath,
  isUnmeteredApiPath,
  apiRouteClass,
  limitForRouteClass,
} = await import('../rateLimit.ts')

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
  const l = createLimiter({ maxKeys: 1_000_000 })
  for (let i = 0; i < 5000; i++) l.allow(`ip${i}`, 60_000, 60, 1000 + i)
  assert.equal(l.size(), 5000)
})

test('嚴格桶：Supabase callback 同 migrate、以及殘餘舊 auth 入口', () => {
  for (const p of [
    '/auth/callback',
    '/api/auth/migrate-legacy',
    '/api/auth/signin',
    '/api/auth/signin/google',
    '/api/auth/callback/google',
    '/api/auth/sign-in/email',
    '/api/auth/sign-in/social',
    '/api/auth/sign-up/email',
  ]) {
    assert.equal(isAuthSensitivePath(p), true, p)
  }
})

test('嚴格桶：其他 API 唔包（否則正常用戶會被 429）', () => {
  for (const p of ['/api/progress', '/api/auth/csrf', '/dashboard', '/sign-in']) {
    assert.equal(isAuthSensitivePath(p), false, p)
  }
})

test('健康探測唔計入限流，其他 API 仍然計', () => {
  assert.equal(isUnmeteredApiPath('/api/health'), true)
  for (const p of ['/api/healthz', '/api/health/extra', '/api/progress', '/api/auth/session', '/health']) {
    assert.equal(isUnmeteredApiPath(p), false, p)
  }
})

test('route class：sync／count 與 general 分開，避免學校 NAT 被單一 60/min 誤傷', () => {
  assert.equal(apiRouteClass('/api/progress'), 'sync')
  assert.equal(apiRouteClass('/api/sync/session'), 'sync')
  assert.equal(apiRouteClass('/api/sync/settings'), 'sync')
  assert.equal(apiRouteClass('/api/practice-count'), 'count')
  assert.equal(apiRouteClass('/api/report'), 'report')
  assert.equal(apiRouteClass('/auth/callback'), 'auth')
  assert.equal(apiRouteClass('/api/me'), 'general')
  assert.equal(limitForRouteClass('sync').limit, 120)
  assert.equal(limitForRouteClass('count').limit, 120)
  assert.equal(limitForRouteClass('general').limit, 60)
  assert.ok(limitForRouteClass('sync').limit > limitForRouteClass('general').limit)
})

test('共用 IP（學校 NAT）：sync／count 闊桶可撑約 500 次練習流量；唔 ban，只 429', () => {
  // 驗收：「共用IP 學校 500 request 唔會被 block」—— 指練習／count 路徑，
  // 唔係永久 IP ban。proxy 只回 429；無 blacklist。
  const sync = limitForRouteClass('sync')
  const count = limitForRouteClass('count')
  assert.equal(sync.limit, 120)
  assert.equal(count.limit, 120)
  // 10 分鐘視窗內，兩個闊桶合計可消化 ≥500 次（學校一班齊撳）
  const tenMinSyncHits = Math.floor((10 * 60_000) / sync.windowMs) * sync.limit
  assert.ok(tenMinSyncHits + count.limit >= 500, `capacity=${tenMinSyncHits + count.limit}`)

  const l = createLimiter()
  const schoolIp = 'nat-school-1'
  const start = 1_000
  // 500 次練習 sync，均勻攤喺 10 分鐘 —— 闊桶應全部放行（唔 ban）
  let syncAllowed = 0
  for (let i = 0; i < 500; i++) {
    const t = start + Math.floor((i / 500) * 10 * 60_000)
    const { windowMs, limit } = limitForRouteClass('sync')
    if (l.allow(`${schoolIp}:sync`, windowMs, limit, t)) syncAllowed++
  }
  assert.equal(syncAllowed, 500, `school NAT 500 sync should all pass; got ${syncAllowed}`)

  // 同 IP 另開 report 窄桶：仍會 429，證明限流在生效而唔係永久 ban
  const rep = limitForRouteClass('report')
  let reportDenied = 0
  for (let i = 0; i < 15; i++) {
    if (!l.allow(`${schoolIp}:report`, rep.windowMs, rep.limit, start + i * 1000)) reportDenied++
  }
  assert.ok(reportDenied >= 5, `report burst should 429; denied=${reportDenied}`)
})

test('report 窄桶：同 IP 10 分鐘內第 11 次擋；唔寫入 IP 黑名單結構', () => {
  const { windowMs, limit } = limitForRouteClass('report')
  assert.equal(limit, 10)
  assert.equal(windowMs, 10 * 60_000)
  const l = createLimiter()
  const key = 'shared-ip:report'
  for (let i = 0; i < 10; i++) assert.equal(l.allow(key, windowMs, limit, 1000 + i), true)
  assert.equal(l.allow(key, windowMs, limit, 1010), false)
  // 過窗口後放返 —— 證明係滑動限流，唔係永久 ban
  assert.equal(l.allow(key, windowMs, limit, 1000 + windowMs), true)
})
