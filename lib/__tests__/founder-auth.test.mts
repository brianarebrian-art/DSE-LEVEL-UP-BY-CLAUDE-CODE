// Founder OS 授權閘 —— 覆蓋規格第十二章安全測試要點（可喺 unit 層覆蓋嘅部分）。
//
// Mock 身份只用於測試；正式環境路徑見 lib/auth/founderAllowlist.ts，
// 唔會讀取任何測試 bypass 旗標。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const {
  founderFromUser,
  FOUNDER_EMAIL,
  founderBindingInstructions,
  googleSubFromAuthUser,
} = await import('../auth/founderIdentity.ts')

const BOUND_SUB = 'google-sub-founder-bound-001'
const opts = { requireVerifiedEmail: true } as const

test('正確電郵 + 正確 sub + 已驗證 → 放行', () => {
  const r = founderFromUser(
    { email: FOUNDER_EMAIL, name: 'Brian', emailVerified: true, googleSub: BOUND_SUB },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, true)
  if (r.ok) {
    assert.equal(r.identity.email, FOUNDER_EMAIL)
    assert.equal(r.identity.googleSub, BOUND_SUB)
  }
})

test('電郵大小寫唔影響比對', () => {
  const r = founderFromUser(
    { email: 'BrianAreBrian@Gmail.com', emailVerified: true, googleSub: BOUND_SUB },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, true)
})

test('其他 Gmail → 拒絕', () => {
  const r = founderFromUser(
    { email: 'student@gmail.com', emailVerified: true, googleSub: BOUND_SUB },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'email_mismatch')
})

test('一般管理員電郵（喺 ADMIN_EMAILS 但唔係創辦人）→ 拒絕', () => {
  const r = founderFromUser(
    { email: 'editor@example.com', emailVerified: true, googleSub: 'admin-sub-xyz' },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'email_mismatch')
})

test('電郵相同但 sub 不符 → 拒絕', () => {
  const r = founderFromUser(
    { email: FOUNDER_EMAIL, emailVerified: true, googleSub: 'different-sub' },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'sub_mismatch')
})

test('未驗證電郵 → 拒絕', () => {
  assert.equal(
    founderFromUser(
      { email: FOUNDER_EMAIL, emailVerified: false, googleSub: BOUND_SUB },
      BOUND_SUB,
      opts,
    ).ok,
    false,
  )
  assert.equal(
    founderFromUser(
      { email: FOUNDER_EMAIL, emailVerified: null, googleSub: BOUND_SUB },
      BOUND_SUB,
      opts,
    ).ok,
    false,
  )
  assert.equal(
    founderFromUser(
      { email: FOUNDER_EMAIL, googleSub: BOUND_SUB },
      BOUND_SUB,
      opts,
    ).ok,
    false,
  )
})

test('缺少創辦人 sub 設定 → 拒絕（唔自動認領）', () => {
  const r = founderFromUser(
    { email: FOUNDER_EMAIL, emailVerified: true, googleSub: BOUND_SUB },
    undefined,
    opts,
  )
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'founder_sub_unset')

  const r2 = founderFromUser(
    { email: FOUNDER_EMAIL, emailVerified: true, googleSub: BOUND_SUB },
    '   ',
    opts,
  )
  assert.equal(r2.ok, false)
  if (!r2.ok) assert.equal(r2.reason, 'founder_sub_unset')
})

test('未登入／缺電郵／缺 Google sub → 拒絕', () => {
  assert.equal(founderFromUser(null, BOUND_SUB, opts).ok, false)
  assert.equal(founderFromUser({ name: 'x', emailVerified: true, googleSub: BOUND_SUB }, BOUND_SUB, opts).ok, false)
  const r = founderFromUser(
    { email: FOUNDER_EMAIL, emailVerified: true, googleSub: '' },
    BOUND_SUB,
    opts,
  )
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'missing_google_sub')
})

test('前端可編輯欄位唔存在於判斷介面（無 role／isFounder）', () => {
  const src = readFileSync(fileURLToPath(new URL('../auth/founderIdentity.ts', import.meta.url)), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
  assert.doesNotMatch(src, /\bisFounder\b/)
  assert.doesNotMatch(src, /\brole\s*[:=]/)
  assert.doesNotMatch(src, /NEXT_PUBLIC_/)
})

test('綁定說明唔洩露 sub 值，並指明唯一電郵', () => {
  const text = founderBindingInstructions()
  assert.match(text, /FOUNDER_GOOGLE_SUB/)
  assert.match(text, new RegExp(FOUNDER_EMAIL.replace('.', '\\.')))
  assert.doesNotMatch(text, /google-sub-/)
  assert.match(text, /2FA|Passkey/)
})

test('接線：founderAllowlist 經 getAuthUser，要求 verified email，讀 FOUNDER_GOOGLE_SUB', () => {
  const src = readFileSync(fileURLToPath(new URL('../auth/founderAllowlist.ts', import.meta.url)), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
  assert.match(src, /FOUNDER_GOOGLE_SUB/)
  assert.match(src, /getAuthUser/)
  assert.match(src, /googleSubFromAuthUser/)
  assert.match(src, /emailVerifiedFromAuthUser/)
  assert.match(src, /requireVerifiedEmail:\s*true/)
  assert.doesNotMatch(src, /requireVerifiedEmail:\s*false/)
  assert.doesNotMatch(src, /NEXT_PUBLIC_FOUNDER/)
  assert.match(src, /founderFromUser\(/)
  assert.doesNotMatch(src, /from '@\/auth'/)
  // 唔准用 auth.users.id 當 Google sub
  assert.doesNotMatch(src, /googleSub:\s*user\.id/)
})

test('googleSubFromAuthUser：優先 identity_data.sub，唔用 auth.users.id', () => {
  const sub = googleSubFromAuthUser({
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    identities: [
      {
        provider: 'google',
        id: '111222333',
        identity_data: { sub: BOUND_SUB, email_verified: true },
      },
    ],
    user_metadata: {},
  })
  assert.equal(sub, BOUND_SUB)
})

test('googleSubFromAuthUser：冇 Google identity → null', () => {
  assert.equal(
    googleSubFromAuthUser({
      id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      identities: [{ provider: 'email', id: 'x', identity_data: {} }],
      user_metadata: {},
    }),
    null,
  )
})

test('FOUNDER_GOOGLE_SUB 唔出現喺任何 NEXT_PUBLIC 檔案命名慣例', () => {
  const files = ['../auth/founderIdentity.ts', '../auth/founderAllowlist.ts']
  for (const f of files) {
    const src = readFileSync(fileURLToPath(new URL(f, import.meta.url)), 'utf8')
    assert.doesNotMatch(src, /NEXT_PUBLIC_.*FOUNDER|FOUNDER.*NEXT_PUBLIC/)
  }
})
