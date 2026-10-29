// SEC-R1-003 / FIX-DSE-APP-003 — account erasure client errors must not name tables.
//
// Dynamic import: npm test pins tsx@4.19.2, which cannot do named ESM imports from .ts
// (same constraint as lib/__tests__/api-body-limit.test.mts).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const mod: any = await import('../privacy/erasureResponse.ts')
const R = mod.default?.makePartialErasureFailure ? mod.default : mod

const KNOWN = [
  'user_progress',
  'user_settings',
  'profiles',
  'user_sessions',
  'privacy_consents',
  'session',
  'account',
  'user',
  'verification',
] as const

test('partial failure: stable error code, correlationId, no tables key, no table names on the wire', () => {
  const { clientBody, logMessage, logCode, correlationId } = R.makePartialErasureFailure([
    'user_progress',
    'profiles',
  ])
  assert.equal(clientBody.error, R.PARTIAL_ERASURE)
  assert.equal(clientBody.correlationId, correlationId)
  assert.equal(logCode, R.PARTIAL_ERASURE)
  assert.match(logMessage, /partial_erasure/)
  assert.match(logMessage, /user_progress/)
  assert.match(logMessage, /profiles/)
  assert.equal(R.clientBodyLeaksTableName(clientBody, KNOWN), null)
  assert.ok(!('tables' in clientBody))
  assert.deepEqual(Object.keys(clientBody).sort(), ['correlationId', 'error'])
})

test('partial failure with empty steps still refuses success shape', () => {
  const { clientBody } = R.makePartialErasureFailure([])
  assert.equal(clientBody.error, R.PARTIAL_ERASURE)
  assert.equal(R.clientBodyLeaksTableName(clientBody, KNOWN), null)
})

test('internal erasure error: stable code + correlationId only', () => {
  const { clientBody, correlationId } = R.makeInternalErasureFailure()
  assert.equal(clientBody.error, R.INTERNAL_ERASURE_ERROR)
  assert.equal(clientBody.correlationId, correlationId)
  assert.equal(R.clientBodyLeaksTableName(clientBody, KNOWN), null)
  assert.deepEqual(Object.keys(clientBody).sort(), ['correlationId', 'error'])
})

test('leak detector flags a tables array or embedded table name', () => {
  assert.equal(
    R.clientBodyLeaksTableName({ error: 'partial', tables: ['user_progress'] }, KNOWN),
    'tables',
  )
  assert.equal(
    R.clientBodyLeaksTableName({ error: 'x', detail: 'failed on user_settings' }, KNOWN),
    'user_settings',
  )
})

test('delete route wires partial_erasure and never returns tables: failed', () => {
  const src = readFileSync('app/api/account/delete/route.ts', 'utf8')
  assert.match(src, /makePartialErasureFailure/)
  assert.match(src, /makeInternalErasureFailure/)
  assert.doesNotMatch(src, /tables:\s*failed/)
  assert.doesNotMatch(src, /error:\s*'partial'/)
  assert.match(src, /status:\s*500/, 'partial / internal failure must stay non-200')
  assert.match(src, /failed\.length\s*>\s*0/)
})

test('/api/me still re-exports the single delete implementation', () => {
  const me = readFileSync('app/api/me/route.ts', 'utf8')
  assert.match(me, /export \{ POST as DELETE \} from '\.\.\/account\/delete\/route'/)
  assert.match(me, /partial_erasure/)
})
