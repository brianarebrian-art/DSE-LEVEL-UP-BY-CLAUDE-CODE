// ============================================================================
// email-auth-readiness.test.mts —— 開 email/password 之前必須成立嘅三件事
// ----------------------------------------------------------------------------
// Brian 2026-09-07 裁決要開 email/password。真正嘅 cutover 步驟（設
// DATABASE_URL／BETTER_AUTH_SECRET、跑 migration）要人手做，但有三樣嘢
// 一 flip 就會即刻壞，而且【三樣都係靜靜哋壞】：
//
//   ① 私隱頁寫住「我哋唔會將你嘅電郵地址存入資料庫」——
//      Better Auth 個 `user` 表存電郵，嗰句即刻變假
//   ② 刪帳號只清 `user_id` 一套 key —— Better Auth 用 id／userId／identifier，
//      清唔到即係一個要求刪除嘅學生，電郵同密碼 hash 仲留喺度
//   ③ getSyncUserId 解析失敗會回落另一個 key ——
//      169 個 Google 帳號嘅雲端進度會永久失聯
//
// 三樣都唔會拋錯、唔會紅 build。所以要測試。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('① 私隱頁「存唔存電郵」由實際 backend 衍生，唔係寫死一句', () => {
  assert.match(read('app/privacy/page.tsx'), /storesEmail=\{betterAuthEnabled\}/,
    'privacy/page.tsx 要將 betterAuthEnabled 傳落去，唔可以人手維護嗰句')
  const c = read('app/privacy/PrivacyClient.tsx')
  assert.match(c, /storesEmail\s*\?/, 'PrivacyClient 要按 storesEmail 分支')
  // 兩邊文案都要在 —— 淨係剩一邊就代表有一個狀態講緊假話
  assert.ok(c.includes('唔會將你嘅電郵地址存入資料庫'), '未開 email 嗰句唔見咗')
  assert.ok(c.includes('單向雜湊值'), '開咗 email 嗰句唔見咗')
})

test('② 刪帳號覆蓋 Better Auth 嘅表，而且用返正確 key', () => {
  const reg = read('lib/privacy/userData.ts')
  assert.match(reg, /BETTER_AUTH_TABLES/, 'userData.ts 冇 BETTER_AUTH_TABLES')
  for (const t of ['session', 'account', 'user', 'verification']) {
    assert.ok(new RegExp(`table: '${t}'`).test(reg), `BETTER_AUTH_TABLES 漏咗 ${t}`)
  }
  // `user_id` 係 USER_SCOPED_TABLES 嗰套 key —— Better Auth 表用唔到，
  // 塞錯會撞 42703 令成個抹除 500。
  assert.ok(!/table: '(session|account|user|verification)', key: 'user_id'/.test(reg),
    'Better Auth 表唔可以用 user_id 做 key')
  const route = read('app/api/account/delete/route.ts')
  assert.match(route, /BETTER_AUTH_TABLES/, '刪帳號 route 冇用到 BETTER_AUTH_TABLES')
  assert.match(route, /if \(!value\) continue/, '攞唔到 key 值要跳過，唔可以用 undefined 去 delete')
})

test('③ getSyncUserId 解析唔到 Google accountId 時回 null，唔換 key', () => {
  const s = read('lib/auth/server.ts')
  // 舊寫法：catch 之後 `return session.user.id` —— 就係嗰個會 orphan 進度嘅回落
  assert.ok(!/\} catch \{[\s\S]*?\n *\}\n *return session\.user\.id/.test(s),
    'catch 之後又回落 session.user.id —— 會令 Google 用戶嘅雲端進度失聯')
  assert.match(s, /if \(!google\) return session\.user\.id/,
    '純 email/password 用戶（冇 Google 帳號）應該用 Better Auth id')
  assert.match(s, /refusing to guess a key/, '失敗路徑要有明確 log')
})
