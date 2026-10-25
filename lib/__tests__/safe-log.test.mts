import { test } from 'node:test'
import assert from 'node:assert/strict'
const loaded: any = await import('../safeLog.ts')
const safeLog = loaded.default?.safeLog ?? loaded.safeLog

function capture(level: 'error' | 'warn' | 'info', run: () => void): string {
  const original = console[level]
  let output = ''
  console[level] = (...args: unknown[]) => { output = args.map(String).join(' ') }
  try { run() } finally { console[level] = original }
  return output
}

test('safeLog emits only allowlisted operation/code and correlation ID', () => {
  const output = capture('error', () => safeLog(
    'error',
    'api/account/delete partial',
    { message: 'SENTINEL_STUDENT_EMAIL@example.invalid SQL SELECT * FROM private_table', code: '42501', stack: 'SENTINEL_STACK' },
    'test-correlation-01',
  ))
  assert.match(output, /api\.account\.delete\.partial/)
  assert.match(output, /"code":"42501"/)
  assert.match(output, /"correlationId":"test-correlation-01"/)
  for (const secret of ['SENTINEL_STUDENT_EMAIL', 'SELECT *', 'private_table', 'SENTINEL_STACK']) {
    assert.ok(!output.includes(secret), `log leaked ${secret}`)
  }
})

test('safeLog suppresses arbitrary context and unrecognized error codes', () => {
  const output = capture('warn', () => safeLog(
    'warn',
    'SENTINEL_USER@example.invalid /api/admin/table_name',
    { message: 'SENTINEL_RAW_MESSAGE', code: 'SENTINEL_SQL_TABLE' },
  ))
  assert.match(output, /app\.unclassified/)
  assert.match(output, /"code":"UNKNOWN"/)
  for (const secret of ['SENTINEL_USER', 'table_name', 'SENTINEL_RAW_MESSAGE', 'SENTINEL_SQL_TABLE']) {
    assert.ok(!output.includes(secret), `log leaked ${secret}`)
  }
})
