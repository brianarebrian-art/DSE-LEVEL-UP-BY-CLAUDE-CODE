import { test } from 'node:test'
import assert from 'node:assert/strict'
const loaded: any = await import('../api/accountDeleteErrors.ts')
const accountDeleteError = loaded.default?.accountDeleteError ?? loaded.accountDeleteError

test('partial deletion failure is generic, correlated, and does not expose internal table names', () => {
  const result = accountDeleteError('DELETION_INCOMPLETE', 'test-correlation-02')
  assert.equal(result.status, 500)
  assert.deepEqual(result.body, {
    error: 'DELETION_INCOMPLETE',
    message: 'The deletion did not complete. Please retry later.',
    correlationId: 'test-correlation-02',
  })
  const serialized = JSON.stringify(result.body)
  for (const internal of ['user_progress', 'privacy_consents', 'session', 'SQL', 'schema']) {
    assert.ok(!serialized.includes(internal), `response leaked ${internal}`)
  }
})

test('auth, malformed input, oversized input, and confirmation errors have explicit safe codes', () => {
  assert.equal(accountDeleteError('AUTHENTICATION_REQUIRED', 'test-correlation-03').status, 401)
  assert.equal(accountDeleteError('INVALID_REQUEST', 'test-correlation-04').status, 400)
  assert.equal(accountDeleteError('REQUEST_TOO_LARGE', 'test-correlation-05').status, 413)
  assert.equal(accountDeleteError('CONFIRMATION_REQUIRED', 'test-correlation-06').status, 400)
})
