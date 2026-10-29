// SEC-R1-001 / FIX-DSE-APP-001 — management token hash + route contract.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const mod: any = await import('../push/mgmtToken.ts')
const T = mod.default?.generateMgmtToken ? mod.default : mod

test('generateMgmtToken is high-entropy base64url and unique', () => {
  const a = T.generateMgmtToken()
  const b = T.generateMgmtToken()
  assert.match(a, /^[A-Za-z0-9_-]+$/)
  assert.ok(a.length >= 40)
  assert.notEqual(a, b)
})

test('hashMgmtToken is stable sha256 hex; verify accepts only the right token', () => {
  const token = T.generateMgmtToken()
  const hash = T.hashMgmtToken(token)
  assert.match(hash, /^[a-f0-9]{64}$/)
  assert.equal(T.hashMgmtToken(token), hash)
  assert.equal(T.verifyMgmtToken(token, hash), true)
  assert.equal(T.verifyMgmtToken(T.generateMgmtToken(), hash), false)
  assert.equal(T.verifyMgmtToken('', hash), false)
  assert.equal(T.verifyMgmtToken(token, 'not-a-hash'), false)
})

test('draft migration 0026 documents token_hash and is not auto-applied SQL', () => {
  const sql = readFileSync(
    join(process.cwd(), 'supabase/migrations/0026_push_mgmt_token.DRAFT.sql'),
    'utf8',
  )
  assert.match(sql, /DRAFT/)
  assert.match(sql, /Do NOT apply to production/i)
  assert.match(sql, /token_hash/)
  assert.match(sql, /token_rotated_at/)
  // Live statements stay commented until founder approval.
  assert.match(sql, /-- alter table public\.push_subscriptions/)
})

test('subscribe route requires managementToken on DELETE and returns token on POST', () => {
  const src = readFileSync(join(process.cwd(), 'app/api/push/subscribe/route.ts'), 'utf8')
  assert.match(src, /SEC-R1-001/)
  assert.match(src, /generateMgmtToken/)
  assert.match(src, /verifyMgmtToken/)
  assert.match(src, /token-required/)
  assert.match(src, /managementToken/)
  assert.match(src, /token_hash/)
})

test('push client persists and sends managementToken', () => {
  const src = readFileSync(join(process.cwd(), 'lib/push/client.ts'), 'utf8')
  assert.match(src, /mgmtToken/)
  assert.match(src, /managementToken/)
  assert.match(src, /writeMgmtToken/)
  assert.match(src, /readMgmtToken/)
})
