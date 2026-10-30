// SEC-R1-002 / FIX-DSE-APP-002 — production log + Sentry scrub must not keep
// emails, bearer tokens, JWTs, push endpoints, or cookie/authorization headers.
import { test } from 'node:test'
import assert from 'node:assert/strict'

const scrub: any = await import('../logScrub.ts')
const S = scrub.default?.scrubLogText ? scrub.default : scrub

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signaturepart'

test('scrubLogText redacts email, bearer, JWT, push endpoint, postgres URL', () => {
  const raw =
    `user student@example.com Bearer abcdefghijklmnop ` +
    `${SAMPLE_JWT} ` +
    `https://fcm.googleapis.com/fcm/send/abc123xyz ` +
    `postgresql://user:secret@db.example.com:5432/app`
  const out = S.scrubLogText(raw)
  assert.equal(out.includes('student@example.com'), false)
  assert.equal(out.includes('abcdefghijklmnop'), false)
  assert.equal(out.includes(SAMPLE_JWT), false)
  assert.equal(out.includes('fcm.googleapis.com'), false)
  assert.equal(out.includes('postgresql://'), false)
  assert.match(out, /\[redacted\]/)
})

test('safeErrorFields keeps short vendor codes, scrubs message', () => {
  const { message, code } = S.safeErrorFields({
    message: 'duplicate key for student@school.edu',
    code: '23505',
  })
  assert.equal(code, '23505')
  assert.equal(message.includes('student@school.edu'), false)
  assert.match(message, /\[redacted\]/)
})

test('safeErrorFields string input', () => {
  const { message } = S.safeErrorFields('fail for a@b.co')
  assert.equal(message.includes('a@b.co'), false)
})

test('scrubSentryEvent strips Authorization/Cookie and endpoint bodies', () => {
  const event = {
    message: 'boom student@x.com',
    request: {
      url: 'https://fcm.googleapis.com/fcm/send/device-token-here',
      headers: {
        Authorization: 'Bearer super-secret-token-value-here',
        Cookie: 'session=abc; other=xyz',
        'Content-Type': 'application/json',
      },
      cookies: { session: 'abc' },
      data: { endpoint: 'https://fcm.googleapis.com/fcm/send/xyz', note: 'ok' },
    },
    exception: { values: [{ value: 'Authorization: Bearer leakytokenvalue000' }] },
    extra: { detail: 'mail me@you.com' },
  }
  const out = S.scrubSentryEvent(event)
  assert.equal(out.message.includes('student@x.com'), false)
  assert.equal(out.request.headers.Authorization, '[redacted]')
  assert.match(out.request.headers.Cookie, /session=\[redacted\]/)
  assert.equal(out.request.headers['Content-Type'], 'application/json')
  assert.equal(out.request.cookies, '[redacted]')
  assert.equal(out.request.data.endpoint, '[redacted]')
  assert.equal(out.request.url.includes('fcm.googleapis.com'), false)
  assert.equal(out.exception.values[0].value.includes('leakytokenvalue000'), false)
  assert.equal(out.extra.detail.includes('me@you.com'), false)
})

test('safeLog production path uses scrubbed message (no raw email)', async () => {
  // process.env.NODE_ENV is typed readonly under Next/TS — mutate via defineProperty.
  const prevDesc = Object.getOwnPropertyDescriptor(process.env, 'NODE_ENV')
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'production',
    configurable: true,
    enumerable: true,
    writable: true,
  })
  const lines: unknown[][] = []
  const orig = console.error
  console.error = (...args: unknown[]) => {
    lines.push(args)
  }
  try {
    // Fresh import so module sees production NODE_ENV if it ever caches; safeLog reads env each call.
    const mod: any = await import('../safeLog.ts')
    const safeLog = mod.safeLog ?? mod.default?.safeLog
    safeLog('error', 'test-ctx', { message: 'fail for kid@school.hk', code: 'XX' })
    assert.equal(lines.length, 1)
    const joined = String(lines[0]?.[0] ?? '')
    assert.match(joined, /\[test-ctx\]/)
    assert.equal(joined.includes('kid@school.hk'), false)
    assert.match(joined, /\[redacted\]/)
    assert.match(joined, /code: XX/)
  } finally {
    console.error = orig
    if (prevDesc) Object.defineProperty(process.env, 'NODE_ENV', prevDesc)
    else delete (process.env as { NODE_ENV?: string }).NODE_ENV
  }
})
