// Admin 判斷嘅純邏輯 —— 同 lib/auth/adminAllowlist.ts 分開，因為嗰個檔 import
// 'server-only'、next/headers 同兩個 auth backend，測試入面 import 唔到。
// 判斷本身冇任何 I/O，所以抽出嚟，測試就可以真係餵一個 user 入去睇結果，
// 唔使靠掃原始碼。

export interface AdminIdentity {
  email: string
  name: string
}

/** 兩個 backend 嘅 session user 共有嘅欄位。 */
export interface SessionUser {
  email?: string | null
  name?: string | null
  /** Better Auth 核心 schema 有呢欄，預設 false；Auth.js session 冇。 */
  emailVerified?: boolean | null
}

export function parseAllowlist(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined, allowlist: readonly string[]): boolean {
  if (!email) return false
  return allowlist.includes(email.trim().toLowerCase())
}

/**
 * 已登入且喺白名單 → 身份；否則 null。
 *
 * ⚠️ `requireVerifiedEmail` 對 Better Auth 一定要係 true。
 *
 * 2026-09-25 保安審計捉到：`lib/auth/better-auth.ts` 開咗電郵＋密碼註冊
 * （`autoSignIn: true`，冇 `requireEmailVerification`），而原本嘅判斷只睇
 * `user.email` 喺唔喺白名單。即係 Better Auth 一開，任何人用創辦人個電郵
 * 註冊一個帳戶，就即刻入到 /admin —— 睇到全部用戶統計、寫得入 review_decisions。
 *
 * 密碼註冊嘅帳戶 `emailVerified` 預設係 false（`@better-auth/core` user schema：
 * `z.boolean().default(false)`）；經 Google 登入嘅由 Google 提供。所以要求
 * `=== true`，唔係「唔係 false」—— 欄位唔見咗、係 null，一律當未驗證。
 *
 * Auth.js 路徑唔需要：嗰邊只有 Google OAuth，冇密碼註冊，電郵由 Google 擔保。
 */
export function adminFromUser(
  user: SessionUser | null | undefined,
  allowlist: readonly string[],
  opts: { requireVerifiedEmail: boolean },
): AdminIdentity | null {
  if (!user?.email) return null
  if (opts.requireVerifiedEmail && user.emailVerified !== true) return null
  if (!isAdminEmail(user.email, allowlist)) return null
  return { email: user.email, name: user.name || user.email }
}
