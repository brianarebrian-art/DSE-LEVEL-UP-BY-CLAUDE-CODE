// Admin = ADMIN_EMAILS allowlist + Supabase Auth Google session.
// Pure adminFromUser behaviour is still tested; Better Auth wiring is gone.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const { adminFromUser, parseAllowlist, isAdminEmail } = await import('../auth/adminIdentity.ts')

const LIST = parseAllowlist(' Founder@Example.com ,second@example.com,')

test('白名單解析：去空格、細楷、剔走空項', () => {
  assert.deepEqual(LIST, ['founder@example.com', 'second@example.com'])
  assert.deepEqual(parseAllowlist(undefined), [], '冇設 ADMIN_EMAILS = 冇人係 admin')
})

test('requireVerifiedEmail=true：未驗證 → 唔係 admin', () => {
  const attacker = { email: 'founder@example.com', name: 'x', emailVerified: false }
  assert.equal(adminFromUser(attacker, LIST, { requireVerifiedEmail: true }), null)
})

test('requireVerifiedEmail=true：emailVerified 唔見／null → 唔係 admin', () => {
  assert.equal(adminFromUser({ email: 'founder@example.com' }, LIST, { requireVerifiedEmail: true }), null)
  assert.equal(adminFromUser({ email: 'founder@example.com', emailVerified: null }, LIST, { requireVerifiedEmail: true }), null)
})

test('驗證咗而且喺白名單 → 係 admin', () => {
  const r = adminFromUser({ email: 'FOUNDER@example.com', name: 'F', emailVerified: true }, LIST, { requireVerifiedEmail: true })
  assert.deepEqual(r, { email: 'FOUNDER@example.com', name: 'F' })
})

test('驗證咗但唔喺白名單 → 唔係 admin', () => {
  assert.equal(adminFromUser({ email: 'someone@example.com', emailVerified: true }, LIST, { requireVerifiedEmail: true }), null)
})

test('冇登入、冇電郵 → 唔係 admin', () => {
  assert.equal(adminFromUser(null, LIST, { requireVerifiedEmail: false }), null)
  assert.equal(adminFromUser({ name: 'x' }, LIST, { requireVerifiedEmail: false }), null)
  assert.equal(isAdminEmail('', LIST), false)
})

test('接線：requireAdmin 經 getAuthUser + adminFromUser，唔經 Auth.js／Better Auth', () => {
  const src = readFileSync(fileURLToPath(new URL('../auth/adminAllowlist.ts', import.meta.url)), 'utf8')
  assert.match(src, /getAuthUser/)
  assert.match(src, /adminFromUser/)
  assert.doesNotMatch(src, /better-auth|nextAuth|from ['"]@\/auth['"]/)
  assert.doesNotMatch(src, /\.includes\(\s*[a-z.]*email/i, 'admin 判斷唔可以繞過 adminFromUser')
})
