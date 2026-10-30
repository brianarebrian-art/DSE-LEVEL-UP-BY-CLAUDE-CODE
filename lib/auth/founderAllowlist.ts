import 'server-only'
import { getAuthUser } from '@/lib/auth/server'
import {
  founderFromUser,
  founderBindingInstructions,
  googleSubFromAuthUser,
  emailVerifiedFromAuthUser,
  type FounderIdentity,
  type FounderAuthResult,
  type FounderDenyReason,
} from '@/lib/auth/founderIdentity'

export type { FounderIdentity, FounderAuthResult, FounderDenyReason }
export { founderBindingInstructions, googleSubFromAuthUser, emailVerifiedFromAuthUser }

/**
 * 集中式 Founder 授權。所有 /founder 頁、API、Server Action、匯出、AI 入口必須經呢度。
 * Middleware／Layout 只係第一層；唔可以代替本函式。
 *
 * 永遠要求：
 *   - 經驗證嘅 Google 登入（Supabase Auth · Google provider）
 *   - 電郵已驗證
 *   - 電郵精確 = brianarebrian@gmail.com
 *   - Google sub = FOUNDER_GOOGLE_SUB（未設 → 拒絕）
 */
export async function getVerifiedFounderSession(): Promise<FounderAuthResult> {
  const founderSub = process.env.FOUNDER_GOOGLE_SUB
  const user = await getAuthUser()
  if (!user) return { ok: false, reason: 'not_signed_in' }

  const googleSub = googleSubFromAuthUser(user)
  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    ''

  return founderFromUser(
    {
      email: user.email,
      name,
      emailVerified: emailVerifiedFromAuthUser(user),
      googleSub,
    },
    founderSub,
    { requireVerifiedEmail: true },
  )
}

/** 已驗證創辦人 → 身份；否則 null。 */
export async function requireFounder(): Promise<FounderIdentity | null> {
  const result = await getVerifiedFounderSession()
  return result.ok ? result.identity : null
}

/** API 用：未授權時回 403 JSON 本體（唔洩露內部細節）。 */
export function founderForbiddenBody(reason?: FounderDenyReason): { error: string; code: string } {
  if (reason === 'founder_sub_unset') {
    return { error: 'forbidden', code: 'FOUNDER_SUB_UNSET' }
  }
  return { error: 'forbidden', code: 'FOUNDER_FORBIDDEN' }
}
