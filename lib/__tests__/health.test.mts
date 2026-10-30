// GET /api/health 嘅狀態彙總（lib/health.ts）同 proxy 豁免。
// 資料庫 I/O 唔喺度打：用假 query 覆蓋 ok／慢／失敗／未設定。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const {
  DB_SLOW_MS,
  DB_TIMEOUT_MS,
  buildHealthBody,
  healthHttpStatus,
  overallStatus,
  probeDatabase,
} = await import('../health.ts')

const fixed = new Date('2026-10-22T09:00:00.000Z')

test('ok：程序同資料庫都正常，HTTP 200', async () => {
  let called = false
  const database = await probeDatabase(true, {
    query: async () => {
      called = true
      return { error: null }
    },
  }, () => 1_000)
  // now() 兩次都係 1000，latency 0
  assert.equal(called, true)
  assert.deepEqual(database, { status: 'ok', latencyMs: 0 })
  const body = buildHealthBody(database, fixed)
  assert.equal(body.status, 'ok')
  assert.equal(body.service, 'dse-level-up')
  assert.equal(body.timestamp, '2026-10-22T09:00:00.000Z')
  assert.deepEqual(body.checks.app, { status: 'ok' })
  assert.equal(healthHttpStatus(body.status), 200)
})

test('degraded：資料庫有回應但慢過門檻，HTTP 仍然 200', async () => {
  let tick = 0
  const database = await probeDatabase(true, {
    query: async () => ({ error: null }),
  }, () => (tick++ === 0 ? 0 : DB_SLOW_MS))
  assert.deepEqual(database, { status: 'degraded', latencyMs: DB_SLOW_MS, reason: 'slow' })
  assert.equal(buildHealthBody(database, fixed).status, 'degraded')
  assert.equal(healthHttpStatus('degraded'), 200)
})

test('error：查詢失敗或拋錯都係連唔上，HTTP 503，而且唔係 degraded', async () => {
  const failed = await probeDatabase(true, {
    query: async () => ({ error: { message: 'relation does not exist', code: '42P01' } }),
  }, () => 50)
  assert.equal(failed.status, 'error')
  assert.equal(failed.reason, 'unreachable')
  assert.equal(failed.latencyMs, 0)
  assert.equal('message' in failed, false)

  let tick = 0
  const thrown = await probeDatabase(true, {
    query: async () => {
      throw new Error('timeout secret=should-not-leak')
    },
  }, () => (tick++ === 0 ? 0 : DB_TIMEOUT_MS))
  assert.deepEqual(thrown, { status: 'error', latencyMs: DB_TIMEOUT_MS, reason: 'unreachable' })
  assert.equal(JSON.stringify(thrown).includes('secret'), false)
  assert.equal(healthHttpStatus('error'), 503)
})

test('未設定 Supabase env 時唔呼叫 query，當關鍵依賴缺失', async () => {
  let called = false
  const database = await probeDatabase(false, {
    query: async () => {
      called = true
      return { error: null }
    },
  })
  assert.equal(called, false)
  assert.deepEqual(database, { status: 'error', latencyMs: 0, reason: 'not_configured' })
  assert.equal(overallStatus(['ok', 'error']), 'error')
  assert.equal(overallStatus(['ok', 'degraded']), 'degraded')
  assert.equal(overallStatus(['ok', 'ok']), 'ok')
})

test('路由唔把資料庫錯誤原文寫入 JSON，而且 proxy 豁免限流', () => {
  const route = readFileSync('app/api/health/route.ts', 'utf8')
  assert.match(route, /question_bank_versions/)
  assert.match(route, /Cache-Control/)
  assert.doesNotMatch(route, /error\.message/)
  assert.match(route, /export async function GET/)
  assert.doesNotMatch(route, /authorization/i)

  const proxy = readFileSync('proxy.ts', 'utf8')
  assert.match(proxy, /auth\/callback/, '要保留 OAuth callback 限流')
  const apiBlockStart = proxy.indexOf("pathname.startsWith('/api/')")
  assert.ok(apiBlockStart > -1, 'proxy 要處理 /api')
  const apiBlock = proxy.slice(apiBlockStart)
  const exempt = apiBlock.indexOf('isUnmeteredApiPath(pathname)')
  const limit = apiBlock.indexOf('return rateLimit(request)')
  assert.ok(exempt > -1, 'proxy 要呼叫 isUnmeteredApiPath')
  assert.ok(limit > exempt, '豁免要發生喺計限流之前')
})
