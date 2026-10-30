import 'server-only'
import { redirect } from 'next/navigation'
import {
  founderBindingInstructions,
  googleSubFromAuthUser,
  emailVerifiedFromAuthUser,
  type FounderIdentity,
  type FounderAuthResult,
  type FounderDenyReason,
} from '@/lib/auth/founderIdentity'
import { getFounderGate, type FounderGateState } from '@/lib/founder/mfa/gate'

export type { FounderIdentity, FounderAuthResult, FounderDenyReason, FounderGateState }
export { founderBindingInstructions, googleSubFromAuthUser, emailVerifiedFromAuthUser, getFounderGate }

/**
 * 只驗證 Google 創辦人身份（未要求 TOTP）。
 * 僅供 MFA 綁定／驗證／復原頁使用 —— 唔授予後台資料權限。
 */
export async function requireFounderIdentity(): Promise<FounderIdentity | null> {
  const gate = await getFounderGate()
  if (gate.state === 'denied') return null
  return gate.identity
}

/**
 * 完整 Founder 授權：Google 身份 + Session 有效 + TOTP（AAL2）未超時。
 * 所有 Founder 資料頁、API、Server Actions、下載、AI 必須經呢度。
 */
export async function getVerifiedFounderSession(): Promise<
  FounderAuthResult | { ok: false; reason: FounderDenyReason | 'mfa_required' | 'mfa_enroll_required' | 'mfa_config' | 'session_error' }
> {
  const gate = await getFounderGate()
  if (gate.state === 'full') return { ok: true, identity: gate.identity }
  if (gate.state === 'denied') return { ok: false, reason: gate.reason }
  if (gate.state === 'needs_enroll' || gate.state === 'recovery_reenroll') {
    return { ok: false, reason: 'mfa_enroll_required' }
  }
  return { ok: false, reason: 'mfa_required' }
}

/**
 * 頁面用：未完成 MFA 則 redirect 去驗證／綁定頁；身份不符則回家。
 * API 請用 requireFounderApi()。
 */
export async function requireFounder(): Promise<FounderIdentity | null> {
  const gate = await getFounderGate()
  if (gate.state === 'full') return gate.identity
  if (gate.state === 'denied') {
    if (gate.reason === 'founder_sub_unset') return null
    if (gate.reason === 'not_signed_in') redirect('/founder/mfa/login')
    redirect('/')
  }
  if (gate.state === 'needs_enroll' || gate.state === 'recovery_reenroll') {
    redirect('/founder/mfa/enroll')
  }
  redirect('/founder/mfa/verify')
}

/** API／Server Action：唔 redirect，回 null；caller 回 403。 */
export async function requireFounderApi(): Promise<FounderIdentity | null> {
  const gate = await getFounderGate()
  return gate.state === 'full' ? gate.identity : null
}

export function founderForbiddenBody(
  reason?: string,
): { error: string; code: string } {
  if (reason === 'founder_sub_unset') return { error: 'forbidden', code: 'FOUNDER_SUB_UNSET' }
  if (reason === 'mfa_required') return { error: 'forbidden', code: 'FOUNDER_MFA_REQUIRED' }
  if (reason === 'mfa_enroll_required') return { error: 'forbidden', code: 'FOUNDER_MFA_ENROLL_REQUIRED' }
  return { error: 'forbidden', code: 'FOUNDER_FORBIDDEN' }
}
