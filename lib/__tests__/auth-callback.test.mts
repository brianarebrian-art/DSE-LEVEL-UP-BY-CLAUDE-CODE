// ============================================================================
// auth-callback.test.mts —— Supabase Google OAuth redirect safety
// ----------------------------------------------------------------------------
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const { safeInternalPath } = await import('../auth/safeRedirect.ts')

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

test('safeInternalPath: 嚴格阻擋 open-redirect 攻擊向量', () => {
  // Protocol-relative & absolute URLs
  assert.equal(safeInternalPath('//evil.com'), '/dashboard')
  assert.equal(safeInternalPath('https://evil.com'), '/dashboard')
  assert.equal(safeInternalPath('http://evil.com'), '/dashboard')

  // Backslash / separator tricks
  assert.equal(safeInternalPath('/\\evil.com'), '/dashboard')
  assert.equal(safeInternalPath('/\\\\evil.com'), '/dashboard')
  assert.equal(safeInternalPath('\\evil.com'), '/dashboard')

  // URL-encoded separators & null bytes
  assert.equal(safeInternalPath('/%5c%5cattacker'), '/dashboard')
  assert.equal(safeInternalPath('/%2f%2fattacker'), '/dashboard')
  assert.equal(safeInternalPath('/foo%00bar'), '/dashboard')
  assert.equal(safeInternalPath('/foo\x00bar'), '/dashboard')

  // Executable schemes
  assert.equal(safeInternalPath('/path?next=javascript:alert(1)'), '/dashboard')
  assert.equal(safeInternalPath('javascript:alert(1)'), '/dashboard')
  assert.equal(safeInternalPath('data:text/html,test'), '/dashboard')

  // Empty / invalid
  assert.equal(safeInternalPath(''), '/dashboard')
  assert.equal(safeInternalPath(null), '/dashboard')
  assert.equal(safeInternalPath(undefined), '/dashboard')

  // Custom fallback
  assert.equal(safeInternalPath('//evil.com', '/custom-fallback'), '/custom-fallback')

  // Legitimate internal paths preserved
  assert.equal(safeInternalPath('/'), '/')
  assert.equal(safeInternalPath('/dashboard'), '/dashboard')
  assert.equal(safeInternalPath('/subjects/math?q=1#top'), '/subjects/math?q=1#top')
  assert.equal(safeInternalPath('/practice/session'), '/practice/session')
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
