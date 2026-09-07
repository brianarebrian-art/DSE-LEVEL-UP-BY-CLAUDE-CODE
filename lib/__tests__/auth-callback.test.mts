// ============================================================================
// auth-callback.test.mts —— 兩個 auth backend 嘅 callback option 名唔可以撈亂
// ----------------------------------------------------------------------------
// 2026-09-05 發現：`authSignInGoogle` 兩個分支都傳 `callbackURL`。
//
//   Better Auth → callbackURL   ✓
//   Auth.js v5  → redirectTo    ✗ 收唔到 callbackURL
//
// Auth.js 嘅 `SignInOptions extends Record<string, unknown>`
//（node_modules/next-auth/lib/client.d.ts:36），所以錯嘅 key 過到 tsc、
// 過到 build、過到所有測試 —— 只係喺 runtime 靜靜哋唔生效，
// 然後 Auth.js 行返佢自己嘅預設。
//
// 後果係同一粒登入掣喺兩個 backend 之下行為唔同，而兩邊都唔係有人揀過嘅。
// 呢類「型別過到但語意錯」冇得靠 tsc 捉，所以要一條測試盯住個字串。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(join(ROOT, 'lib/auth/session.tsx'), 'utf8')

test('Auth.js 分支用 redirectTo，唔用 Better Auth 嘅 callbackURL', () => {
  const m = src.match(/nextSignIn\('google',\s*\{([^}]*)\}/)
  assert.ok(m, '搵唔到 nextSignIn(\'google\', …) —— 呢條測試要跟住改')
  assert.match(m[1], /redirectTo/, 'Auth.js v5 收 redirectTo')
  assert.ok(!/callbackURL/.test(m[1]),
    'Auth.js 收唔到 callbackURL（嗰個係 Better Auth 嘅名）—— 會靜靜哋被忽略')
})

test('Better Auth 分支用 callbackURL，唔用 Auth.js 嘅 redirectTo', () => {
  const m = src.match(/authClient\.signIn\.social\(\{([^}]*)\}/)
  assert.ok(m, '搵唔到 authClient.signIn.social(…)')
  assert.match(m[1], /callbackURL/, 'Better Auth 收 callbackURL')
  assert.ok(!/redirectTo/.test(m[1]), 'Better Auth 收唔到 redirectTo')
})

test('登入之後預設返返原本嗰版，唔係一律掉去 /dashboard', () => {
  // 學生喺練習頁撳登入，唔應該被掉去 dashboard 然後自己搵返條題目。
  assert.match(src, /window\.location\.pathname \+ window\.location\.search/,
    'authSignInGoogle 冇用返當前路徑做預設')
  assert.ok(!/authSignInGoogle\(to = '\/dashboard'\)/.test(src),
    '預設又寫死咗 /dashboard')
})
