// ============================================================================
// auth-callback.test.mts —— Supabase Google OAuth redirect safety
// ----------------------------------------------------------------------------
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const googleAuth = readFileSync(join(ROOT, 'lib/auth/google-auth.ts'), 'utf8')
const safeRedirect = readFileSync(join(ROOT, 'lib/auth/safeRedirect.ts'), 'utf8')
const callback = readFileSync(join(ROOT, 'app/auth/callback/route.ts'), 'utf8')
const session = readFileSync(join(ROOT, 'lib/auth/session.tsx'), 'utf8')

test('Google OAuth 用 Supabase signInWithOAuth，redirect 去 /auth/callback', () => {
  assert.match(googleAuth, /signInWithOAuth/)
  assert.match(googleAuth, /provider:\s*['"]google['"]/)
  assert.match(googleAuth, /\/auth\/callback/)
})

test('open-redirect 防衛：只接受同源相對 path', () => {
  assert.match(safeRedirect, /safeInternalPath/)
  assert.match(callback, /safeInternalPath/)
  assert.match(googleAuth, /safeInternalPath/)
})

test('登入之後預設返返原本嗰版，唔係一律掉去 /dashboard', () => {
  assert.match(
    session,
    /window\.location\.pathname \+ window\.location\.search/,
    'authSignInGoogle 冇用返當前路徑做預設',
  )
  assert.ok(
    !/authSignInGoogle\(to = '\/dashboard'\)/.test(session),
    '預設又寫死咗 /dashboard',
  )
})

test('業務碼唔再依賴 next-auth / better-auth', () => {
  assert.doesNotMatch(session, /next-auth|better-auth/)
  assert.doesNotMatch(callback, /next-auth|better-auth/)
  assert.doesNotMatch(googleAuth, /next-auth|better-auth/)
})
