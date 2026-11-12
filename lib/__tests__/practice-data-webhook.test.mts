// practice-data-webhook.test.mts — $0 wake after a finished practice set is stored.
// The POST is optional. Unset env must not call the destination. The body names
// the Hong Kong day only.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const W = await import('../practiceDataWebhook.ts')

const URL = 'https://api2.cursor.sh/automations/webhook/example'
const KEY = 'test-sender-key'

function env(partial: Record<string, string | undefined> = {}): Record<string, string | undefined> {
  return {
    PRACTICE_DATA_WEBHOOK_URL: URL,
    PRACTICE_DATA_WEBHOOK_KEY: KEY,
    ...partial,
  }
}

test('unset, blank, http, or userinfo config does not arm a wake', () => {
  assert.equal(W.readPracticeWebhookConfig({}), null)
  assert.equal(W.readPracticeWebhookConfig({ PRACTICE_DATA_WEBHOOK_URL: '  ', PRACTICE_DATA_WEBHOOK_KEY: KEY }), null)
  assert.equal(W.readPracticeWebhookConfig({ PRACTICE_DATA_WEBHOOK_URL: URL, PRACTICE_DATA_WEBHOOK_KEY: '   ' }), null)
  assert.equal(W.readPracticeWebhookConfig({ PRACTICE_DATA_WEBHOOK_URL: URL }), null)
  assert.equal(W.readPracticeWebhookConfig({ PRACTICE_DATA_WEBHOOK_KEY: KEY }), null)
  assert.equal(W.readPracticeWebhookConfig(env({ PRACTICE_DATA_WEBHOOK_URL: 'http://api2.cursor.sh/automations/webhook/example' })), null)
  assert.equal(W.readPracticeWebhookConfig(env({ PRACTICE_DATA_WEBHOOK_URL: 'https://user:secret@api2.cursor.sh/hook' })), null)
  assert.equal(W.readPracticeWebhookConfig(env({ PRACTICE_DATA_WEBHOOK_URL: 'not a url' })), null)
  const armed = W.readPracticeWebhookConfig(env())
  assert.deepEqual(armed, { url: URL, key: KEY })
  const upper = W.readPracticeWebhookConfig(env({
    PRACTICE_DATA_WEBHOOK_URL: 'https://API2.cursor.sh/automations/webhook/example',
  }))
  assert.equal(upper?.url, URL)
})

test('the sender key may be pasted as the key or as the panel Authorization line', () => {
  assert.equal(W.normalizeSenderKey('  test-sender-key  '), KEY)
  assert.equal(W.normalizeSenderKey('Bearer test-sender-key'), KEY)
  assert.equal(W.normalizeSenderKey('Authorization: Bearer test-sender-key'), KEY)
  assert.equal(W.normalizeSenderKey('Bearer test-sender-key extra'), null)
  const fromHeader = W.readPracticeWebhookConfig(env({
    PRACTICE_DATA_WEBHOOK_KEY: 'Authorization: Bearer test-sender-key',
  }))
  assert.equal(fromHeader?.key, KEY)
})

test('Hong Kong calendar day flips at 16:00 UTC', () => {
  assert.equal(W.hongKongCalendarDay(new Date('2026-11-11T15:59:59.000Z')), '2026-11-11')
  assert.equal(W.hongKongCalendarDay(new Date('2026-11-11T16:00:00.000Z')), '2026-11-12')
})

test('completed-session totals reject anything that is not a safe non-negative integer', () => {
  assert.equal(W.sumCompletedSessions(null), null)
  assert.equal(W.sumCompletedSessions([]), 0)
  assert.equal(W.sumCompletedSessions([{ sessions: 2 }, { sessions: 3 }, { sessions: '8' }]), 13)
  assert.equal(W.sumCompletedSessions([{ sessions: '0' }]), 0)
  for (const bad of [-1, 1.5, '01', '1e2', null, undefined, 'x']) {
    assert.equal(W.sumCompletedSessions([{ sessions: bad }]), null, JSON.stringify(bad))
  }
})

test('only the first completed session of the day wakes', () => {
  assert.equal(W.shouldWakePracticeData({ event: 'completed', priorCompletedSessions: 0 }), true)
  assert.equal(W.shouldWakePracticeData({ event: 'completed', priorCompletedSessions: 1 }), false)
  assert.equal(W.shouldWakePracticeData({ event: 'completed', priorCompletedSessions: null }), false)
  assert.equal(W.shouldWakePracticeData({ event: 'started', priorCompletedSessions: 0 }), false)
})

test('the POST is JSON, bearer-authenticated, and carries no student data or the key', async () => {
  const body = W.buildPracticeWakeBody('2026-11-12')
  assert.deepEqual(Object.keys(body), [...W.PRACTICE_WAKE_BODY_KEYS])
  assert.deepEqual(body, {
    event: 'practice_data_available',
    source: 'practice_counts',
    signal: 'completed_session',
    day: '2026-11-12',
    timezone: 'Asia/Hong_Kong',
  })
  let captured: { url: string; init: RequestInit } | null = null
  const result = await W.postPracticeDataWake(
    { url: URL, key: KEY },
    body,
    async (url, init) => {
      captured = { url, init }
      return new Response(null, { status: 200 })
    },
  )
  assert.equal(result.ok, true)
  assert.equal(result.status, 200)
  assert.ok(captured)
  const sent = captured as { url: string; init: RequestInit }
  assert.equal(sent.url, URL)
  assert.equal(sent.init.method, 'POST')
  assert.equal(sent.init.redirect, 'error')
  const headers = sent.init.headers as Record<string, string>
  assert.equal(headers.Authorization, 'Bearer test-sender-key')
  assert.equal(headers['Content-Type'], 'application/json')
  const parsed = JSON.parse(String(sent.init.body))
  assert.deepEqual(parsed, body)
  const raw = JSON.stringify(parsed)
  assert.equal(raw.includes(KEY), false)
  assert.equal(raw.includes('@'), false)
  assert.doesNotMatch(raw, /question|email|user_id|subject|answer|ip/i)
})

test('a non-2xx or a thrown POST fails quietly and does not retry inside the call', async () => {
  let calls = 0
  const failed = await W.postPracticeDataWake(
    { url: URL, key: KEY },
    W.buildPracticeWakeBody('2026-11-12'),
    async () => {
      calls += 1
      return new Response('no', { status: 503 })
    },
  )
  assert.deepEqual(failed, { ok: false, status: 503 })
  const thrown = await W.postPracticeDataWake(
    { url: URL, key: KEY },
    W.buildPracticeWakeBody('2026-11-12'),
    async () => {
      calls += 1
      throw new Error('network down')
    },
  )
  assert.deepEqual(thrown, { ok: false })
  assert.equal(calls, 2)
})

test('disabled, started, later, and unreadable totals do not POST', async () => {
  let calls = 0
  const post = async (): Promise<Response> => {
    calls += 1
    return new Response(null, { status: 200 })
  }
  const config = { url: URL, key: KEY }
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'completed', priorCompletedSessions: 0, day: '2026-11-12', config: null, post,
  }), 'disabled')
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'started', priorCompletedSessions: 0, day: '2026-11-12', config, post,
  }), 'not_first')
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'completed', priorCompletedSessions: 4, day: '2026-11-12', config, post,
  }), 'not_first')
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'completed', priorCompletedSessions: null, day: '2026-11-12', config, post,
  }), 'not_first')
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'completed', priorCompletedSessions: 0, day: '', config, post,
  }), 'not_first')
  assert.equal(calls, 0)
  assert.equal(await W.wakeIfFirstCompletionToday({
    event: 'completed', priorCompletedSessions: 0, day: '2026-11-12', config, post,
  }), 'sent')
  assert.equal(calls, 1)
})

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) return n === 'node_modules' || n === '__tests__' ? [] : files(p)
    return /\.(ts|tsx)$/.test(n) ? [p] : []
  })
}

test('the wake is wired after a stored completion and stays off the client', () => {
  const route = readFileSync('app/api/practice-count/route.ts', 'utf8')
  const early = route.indexOf("if (!PRACTICE_COUNTS_ENABLED || process.env.VERCEL_ENV !== 'production')")
  const readPrior = route.indexOf('await readPriorCompletedSessions(')
  const rpc = route.indexOf('.rpc(FN, toRpcArgs(parsed.value))')
  const rpcFail = route.indexOf("missing ? 'unavailable' : 'internal error'")
  const wake = route.indexOf('await wakeIfFirstCompletionToday(')
  const counted = route.lastIndexOf('return NextResponse.json({ ok: true, counted: true })')
  assert.ok(early >= 0 && readPrior > early && rpc > readPrior && rpcFail > rpc && wake > rpcFail && counted > wake)
  assert.match(route, /parsed\.value\.event === 'completed' \? readPracticeWebhookConfig\(\)/)
  assert.match(route, /from\('practice_counts'\)/)
  assert.match(route, /eq\('event', 'completed'\)/)
  assert.doesNotMatch(route, /practice_attempts|learning_progress|user_progress/)
  assert.doesNotMatch(route, /NEXT_PUBLIC_PRACTICE_DATA/)
  assert.match(readFileSync('.env.example', 'utf8'), /PRACTICE_DATA_WEBHOOK_URL/)
  assert.match(readFileSync('.env.example', 'utf8'), /PRACTICE_DATA_WEBHOOK_KEY/)
  assert.doesNotMatch(readFileSync('lib/practiceDataWebhook.ts', 'utf8'), /NEXT_PUBLIC_/)

  const clientish = [...files('app'), ...files('components')].filter((p) => !p.includes('/api/'))
  const importers = clientish.filter((p) => readFileSync(p, 'utf8').includes('practiceDataWebhook'))
  assert.deepEqual(importers, [])
})
