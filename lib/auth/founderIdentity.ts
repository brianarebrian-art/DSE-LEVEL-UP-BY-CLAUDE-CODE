// Founder OS 身份判斷嘅純邏輯 —— 同 lib/auth/founderAllowlist.ts 分開，
// 方便 unit test 唔使 import server-only / next/headers。
//
// 規則（deny-by-default）：
//   1. 必須有登入身份同電郵
//   2. 電郵必須精確等於創辦人電郵（大小寫不敏感，trim 後比對）
//   3. 必須有 Google sub，且精確等於伺服器綁定嘅 FOUNDER_GOOGLE_SUB
//   4. FOUNDER_GOOGLE_SUB 未設定 → 一律拒絕（唔自動認領）
//   5. requireVerifiedEmail 時，emailVerified 必須 === true
//   6. 唔信任 role／isFounder／前端傳入欄位；caller 只傳經驗證嘅 IdP 資料

/** 唯一允許進入 Founder OS 嘅 Google 帳戶電郵。唔由 env 擴展。 */
export const FOUNDER_EMAIL = 'brianarebrian@gmail.com'

export interface FounderIdentity {
  email: string
  name: string
  /** Google account `sub`（Auth.js JWT sub／Better Auth Google accountId）。 */
  googleSub: string
}

/** 兩個 backend 共有、且只來自 IdP／session 嘅欄位。 */
export interface FounderSessionUser {
  email?: string | null
  name?: string | null
  emailVerified?: boolean | null
  /**
   * Google `sub`。Auth.js：`session.user.id`（由 JWT `token.sub` 寫入）。
   * Better Auth：必須係 Google account 嘅 `accountId`，唔可以係 Better Auth 自製 user id。
   */
  googleSub?: string | null
}

export type FounderDenyReason =
  | 'not_signed_in'
  | 'missing_email'
  | 'email_mismatch'
  | 'email_unverified'
  | 'missing_google_sub'
  | 'founder_sub_unset'
  | 'sub_mismatch'

export type FounderAuthResult =
  | { ok: true; identity: FounderIdentity }
  | { ok: false; reason: FounderDenyReason }

function normEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * 由經驗證嘅 session 用戶資料判斷係咪創辦人。
 * `founderGoogleSub` 係伺服器 env；空／未設一律拒絕。
 */
export function founderFromUser(
  user: FounderSessionUser | null | undefined,
  founderGoogleSub: string | undefined,
  opts: { requireVerifiedEmail: boolean },
): FounderAuthResult {
  if (!user) return { ok: false, reason: 'not_signed_in' }
  if (!user.email) return { ok: false, reason: 'missing_email' }
  if (opts.requireVerifiedEmail && user.emailVerified !== true) {
    return { ok: false, reason: 'email_unverified' }
  }
  if (normEmail(user.email) !== normEmail(FOUNDER_EMAIL)) {
    return { ok: false, reason: 'email_mismatch' }
  }
  const bound = (founderGoogleSub ?? '').trim()
  if (!bound) return { ok: false, reason: 'founder_sub_unset' }
  const sub = typeof user.googleSub === 'string' ? user.googleSub.trim() : ''
  if (!sub) return { ok: false, reason: 'missing_google_sub' }
  if (sub !== bound) return { ok: false, reason: 'sub_mismatch' }
  return {
    ok: true,
    identity: {
      email: user.email,
      name: user.name || user.email,
      googleSub: sub,
    },
  }
}

/** 綁定說明（唔含任何 secret／sub 值）。 */
export function founderBindingInstructions(): string {
  return [
    'Founder OS 需要伺服器環境變數 FOUNDER_GOOGLE_SUB（Google 帳戶 sub）。',
    '部署擁有人登入 Google 後，可喺 IdP／Supabase Auth identity_data.sub 取得；',
    '或喺 Google Account → Security → Your connections to third-party apps 核對。',
    '設定後重新部署；未設定前一律拒絕進入，唔會自動認領。',
    '建議喺該 Google 帳戶開啟 2FA／Passkey（由帳戶擁有人設定，程式唔會代為強制）。',
  ].join(' ')
}

/** Supabase Auth user 上用嚟抽 Google sub／驗證狀態嘅最小形狀（純邏輯，可測）。 */
export type AuthUserLike = {
  id?: string
  email?: string | null
  email_confirmed_at?: string | null
  identities?: {
    provider?: string
    id?: string
    identity_data?: Record<string, unknown> | null
  }[]
  user_metadata?: Record<string, unknown> | null
}

/**
 * 從 Auth user 抽出 Google `sub`。
 * 唔用 `auth.users.id`（UUID）—— Founder 綁定必須係 Google 帳戶 sub。
 */
export function googleSubFromAuthUser(user: AuthUserLike): string | null {
  const identities = user.identities ?? []
  const google = identities.find((i) => i.provider === 'google')
  if (google) {
    const data = google.identity_data ?? undefined
    if (data && typeof data.sub === 'string' && data.sub.trim()) return data.sub.trim()
    // 數字形 identity id 有時即 provider subject；UUID 則係 Supabase row id，唔用。
    if (typeof google.id === 'string' && /^\d+$/.test(google.id)) return google.id
  }
  const metaSub = user.user_metadata?.sub
  if (typeof metaSub === 'string' && metaSub.trim()) return metaSub.trim()
  return null
}

export function emailVerifiedFromAuthUser(user: AuthUserLike): boolean {
  if (user.email_confirmed_at) return true
  const google = (user.identities ?? []).find((i) => i.provider === 'google')
  if (!google) return false
  return google.identity_data?.email_verified === true
}
