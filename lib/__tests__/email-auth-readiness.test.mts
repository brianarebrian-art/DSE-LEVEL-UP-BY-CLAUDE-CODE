// ============================================================================
// email-auth-readiness.test.mts —— Supabase Auth Google 重建後：電郵／抹除／身份 key
// ----------------------------------------------------------------------------
// Better Auth email/password 已拆除。呢檔改守：
//   ① 私隱頁承認 profiles 存電郵
//   ② 刪帳號唔再引用 BETTER_AUTH_TABLES；profiles 用 id 欄
//   ③ getSyncUserId = Supabase auth.users.id（uuid），唔再猜 Google sub
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('① 私隱頁承認 Google／profiles 存電郵', () => {
  assert.match(read('app/privacy/page.tsx'), /storesEmail=\{true\}/)
  const c = read('app/privacy/PrivacyClient.tsx')
  assert.match(c, /storesEmail\s*\?/, 'PrivacyClient 要按 storesEmail 分支')
  assert.ok(c.includes('單向雜湊值') || c.includes('電郵'), '存電郵文案要喺度')
})

test('② 刪帳號覆蓋新學習表；profiles 用 id', () => {
  const reg = read('lib/privacy/userData.ts')
  assert.doesNotMatch(reg, /BETTER_AUTH_TABLES/)
  for (const t of ['learning_profiles', 'learning_progress', 'practice_attempts', 'auth_identity_map']) {
    assert.ok(reg.includes(`'${t}'`), `USER_SCOPED 漏咗 ${t}`)
  }
  assert.match(reg, /userScopeKey/)
  const route = read('app/api/account/delete/route.ts')
  assert.match(route, /userScopeKey/)
  assert.doesNotMatch(route, /better-auth|BETTER_AUTH/)
})

test('③ getSyncUserId 用 Supabase getUser，唔再猜 Better Auth／Auth.js key', () => {
  const s = read('lib/auth/server.ts')
  assert.match(s, /getSupabaseServer|getAuthUser|auth\.getUser/)
  assert.doesNotMatch(s, /better-auth|nextAuth|listUserAccounts/)
  assert.doesNotMatch(s, /from ['"]@\/auth['"]/)
})
