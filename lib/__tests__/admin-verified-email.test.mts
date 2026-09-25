// Admin 一定要係驗證咗嘅電郵。
//
// 2026-09-25 保安審計：Better Auth 開咗電郵＋密碼註冊（autoSignIn，冇電郵驗證），
// 而 requireAdmin() 原本只睇電郵喺唔喺白名單。Better Auth 一開，任何人用創辦人
// 個電郵註冊就即刻係 admin。當時 production 未開 Better Auth（資料庫入面冇佢嘅
// user／session 表），所以呢個係一個【將來一切換就會爆】嘅洞。
//
// 兩層測試：① 純函數嘅行為（真係餵 user 入去）；② 接線 —— adminAllowlist.ts
// 嘅 Better Auth 分支真係有傳 requireVerifiedEmail: true。淨係測 ① 唔夠：
// 函數啱，但有人喺 caller 度傳咗 false，一樣係個洞。

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

test('Better Auth：用創辦人電郵註冊但未驗證 → 唔係 admin（就係呢個洞）', () => {
  const attacker = { email: 'founder@example.com', name: 'x', emailVerified: false }
  assert.equal(adminFromUser(attacker, LIST, { requireVerifiedEmail: true }), null)
})

test('Better Auth：emailVerified 唔見咗或者係 null，一律當未驗證', () => {
  assert.equal(adminFromUser({ email: 'founder@example.com' }, LIST, { requireVerifiedEmail: true }), null)
  assert.equal(adminFromUser({ email: 'founder@example.com', emailVerified: null }, LIST, { requireVerifiedEmail: true }), null)
})

test('Better Auth：驗證咗而且喺白名單 → 係 admin', () => {
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

test('接線：Better Auth 分支傳 requireVerifiedEmail: true，Auth.js 分支先准 false', () => {
  const src = readFileSync(fileURLToPath(new URL('../auth/adminAllowlist.ts', import.meta.url)), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
  const ba = src.slice(src.indexOf('if (betterAuthEnabled'), src.indexOf('const session = await nextAuth()'))
  assert.ok(ba.length > 0, '搵唔到 Better Auth 分支 —— requireAdmin 嘅結構改咗，請同步更新呢條測試')
  assert.match(ba, /requireVerifiedEmail:\s*true/, 'Better Auth 分支一定要要求電郵已驗證')
  assert.doesNotMatch(ba, /requireVerifiedEmail:\s*false/)
  // 所有判斷都要經 adminFromUser —— 唔准喺呢個檔另外寫一套電郵比對
  assert.doesNotMatch(src, /\.includes\(\s*[a-z.]*email/i, 'admin 判斷唔可以繞過 adminFromUser')
})
