import { test } from 'node:test'
import assert from 'node:assert/strict'
const loaded: any = await import('../sentry/scrubEvent.ts')
const scrubSentryEvent = loaded.default?.scrubSentryEvent ?? loaded.scrubSentryEvent

test('Sentry scrubber removes raw exceptions, request/user data, breadcrumbs and arbitrary tags', () => {
  const raw = {
    event_id: 'aabbccddeeff00112233445566778899',
    message: 'SENTINEL_RAW_MESSAGE',
    request: { url: 'https://example.test/?token=SENTINEL_TOKEN', headers: { cookie: 'SENTINEL_COOKIE' }, data: 'SENTINEL_BODY' },
    user: { email: 'SENTINEL_STUDENT@example.invalid', id: 'SENTINEL_USER_ID' },
    extra: { sql: 'SENTINEL_SQL_TABLE', detail: 'SENTINEL_ROW' },
    breadcrumbs: [{ message: 'SENTINEL_BREADCRUMB', data: { token: 'SENTINEL_CRUMB_TOKEN' } }],
    tags: { smoke_test: 'true', student_email: 'SENTINEL_TAG' },
    exception: { values: [{ type: 'TypeError', value: 'SENTINEL_EXCEPTION', stacktrace: { frames: [
      { filename: 'https://example.test/users/SENTINEL_ID/app.js?key=SENTINEL_QUERY', function: 'safeHandler', lineno: 7, colno: 2, context_line: 'SENTINEL_SOURCE_CONTEXT', vars: { row: 'SENTINEL_LOCAL' } },
    ] } }] },
  }
  const output = JSON.stringify(scrubSentryEvent(raw))
  for (const secret of [
    'SENTINEL_RAW_MESSAGE', 'SENTINEL_TOKEN', 'SENTINEL_COOKIE', 'SENTINEL_BODY',
    'SENTINEL_STUDENT', 'SENTINEL_USER_ID', 'SENTINEL_SQL_TABLE', 'SENTINEL_ROW',
    'SENTINEL_BREADCRUMB', 'SENTINEL_CRUMB_TOKEN', 'SENTINEL_TAG', 'SENTINEL_EXCEPTION',
    'SENTINEL_ID', 'SENTINEL_QUERY', 'SENTINEL_SOURCE_CONTEXT', 'SENTINEL_LOCAL',
  ]) assert.ok(!output.includes(secret), `Sentry event leaked ${secret}`)
  assert.match(output, /"safe_error_type":"TypeError"/)
  assert.match(output, /"correlation_id":"aabbccddeeff00112233445566778899"/)
  assert.match(output, /"smoke_test":"true"/)
  assert.match(output, /"filename":"app.js"/)
  assert.match(output, /"lineno":7/)
})
