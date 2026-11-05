import test from 'node:test'
import assert from 'node:assert/strict'
import * as poolerNs from '../db/pooler.ts'

const pooler = (poolerNs as unknown as { default?: typeof poolerNs }).default ?? poolerNs

test('an unset database URL stays on the HTTPS client path', () => {
  assert.deepEqual(pooler.inspectDatabaseUrl(undefined), { ok: true, mode: 'unset' })
  assert.deepEqual(pooler.inspectDatabaseUrl(''), { ok: true, mode: 'unset' })
})

test('transaction pooler port 6543 is accepted', () => {
  const check = pooler.inspectDatabaseUrl('postgresql://user:secret@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres')
  assert.deepEqual(check, { ok: true, mode: 'transaction' })
})

test('direct port 5432 and the session pooler are refused', () => {
  assert.equal(pooler.inspectDatabaseUrl('postgresql://user:secret@db.example.supabase.co:5432/postgres').mode, 'direct')
  assert.equal(pooler.inspectDatabaseUrl('postgresql://user:secret@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres').mode, 'session-pooler')
  assert.equal(pooler.inspectDatabaseUrl('not a url').ok, false)
})
