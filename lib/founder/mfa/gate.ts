import 'server-only'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { getServiceSupabase } from '@/utils/supabase/server'
import {
  founderFromUser,
  googleSubFromAuthUser,
  emailVerifiedFromAuthUser,
  type FounderIdentity,
  type FounderDenyReason,
} from '@/lib/auth/founderIdentity'
import { founderMfaIdleSec, founderMfaMaxAgeSec, founderMfaRecentAuthSec } from '@/lib/founder/mfa/config'
import { getActiveRecoverySession } from '@/lib/founder/mfa/recovery'
import { safeLog } from '@/lib/safeLog'

export type FounderGateState =
  | { state: 'denied'; reason: FounderDenyReason | 'mfa_config' | 'session_error' }
  | { state: 'needs_enroll'; identity: FounderIdentity; authUserId: string; recentAuth: boolean }
  | {
      state: 'needs_challenge'
      identity: FounderIdentity
      authUserId: string
      factorId: string
    }
  | {
      state: 'recovery_reenroll'
      identity: FounderIdentity
      authUserId: string
      recoverySessionId: string
    }
  | {
      state: 'full'
      identity: FounderIdentity
      authUserId: string
      factorId: string
      factorVersion: number
      mfaVerifiedAt: number
    }

type AmrEntry = { method?: string; timestamp?: number }

function totpVerifiedAt(amr: AmrEntry[] | undefined): number | null {
  if (!Array.isArray(amr)) return null
  for (const e of amr) {
    const m = e?.method
    if ((m === 'totp' || m === 'mfa/totp') && typeof e.timestamp === 'number') {
      return e.timestamp * 1000
    }
  }
  return null
}

function oauthAt(amr: AmrEntry[] | undefined): number | null {
  if (!Array.isArray(amr)) return null
  for (const e of amr) {
    if ((e?.method === 'oauth' || e?.method === 'oauth_provider/authorization_code') && typeof e.timestamp === 'number') {
      return e.timestamp * 1000
    }
  }
  return null
}

async function readFactorState(): Promise<{ factorId: string | null; factorVersion: number; revokedAt: string | null }> {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_mfa_factor_state')
      .select('factor_id, factor_version, revoked_at')
      .eq('id', true)
      .maybeSingle()
    if (error) throw error
    return {
      factorId: data?.factor_id ?? null,
      factorVersion: typeof data?.factor_version === 'number' ? data.factor_version : 0,
      revokedAt: data?.revoked_at ?? null,
    }
  } catch (e) {
    safeLog('warn', 'founder mfa factor state unread', e)
    return { factorId: null, factorVersion: 0, revokedAt: null }
  }
}

/**
 * Founder 閘狀態機（伺服器）。
 * full = Google 身份 + AAL2 + MFA 未超時 + 因素版本有效。
 */
export async function getFounderGate(): Promise<FounderGateState> {
  const founderSub = process.env.FOUNDER_GOOGLE_SUB
  let supabase
  try {
    supabase = await getSupabaseServer()
  } catch {
    return { state: 'denied', reason: 'session_error' }
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData.user) return { state: 'denied', reason: 'not_signed_in' }
  const user = userData.user

  const identityResult = founderFromUser(
    {
      email: user.email,
      name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email,
      emailVerified: emailVerifiedFromAuthUser(user),
      googleSub: googleSubFromAuthUser(user),
    },
    founderSub,
    { requireVerifiedEmail: true },
  )
  if (!identityResult.ok) return { state: 'denied', reason: identityResult.reason }
  const identity = identityResult.identity

  const recovery = await getActiveRecoverySession(identity.googleSub)

  const { data: aalData, error: aalErr } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aalErr) {
    safeLog('warn', 'founder mfa AAL check failed', aalErr)
    return { state: 'denied', reason: 'session_error' }
  }

  const currentLevel = aalData?.currentLevel ?? 'aal1'
  const nextLevel = aalData?.nextLevel ?? 'aal1'
  const amr = aalData?.currentAuthenticationMethods as AmrEntry[] | undefined

  const { data: factorsData } = await supabase.auth.mfa.listFactors()
  const totpFactors = (factorsData?.totp ?? []).filter((f) => f.status === 'verified')
  const verifiedFactor = totpFactors[0]

  const factorState = await readFactorState()
  if (factorState.revokedAt && verifiedFactor) {
    // 因素已被緊急撤銷但 IdP 仍有 factor —— 當 needs_enroll 並要求重新綁定
    return {
      state: 'needs_enroll',
      identity,
      authUserId: user.id,
      recentAuth: isRecentAuth(amr),
    }
  }

  const now = Date.now()
  const mfaAt = totpVerifiedAt(amr)
  const maxAgeMs = founderMfaMaxAgeSec() * 1000
  const idleMs = founderMfaIdleSec() * 1000

  if (currentLevel === 'aal2' && verifiedFactor && mfaAt != null) {
    if (now - mfaAt > maxAgeMs || now - mfaAt > idleMs) {
      return {
        state: 'needs_challenge',
        identity,
        authUserId: user.id,
        factorId: verifiedFactor.id,
      }
    }
    // 因素版本：若 DB 有記錄 factor_id 且唔一致 → 要求重新挑戰／綁定
    if (factorState.factorId && factorState.factorId !== verifiedFactor.id) {
      return {
        state: 'needs_enroll',
        identity,
        authUserId: user.id,
        recentAuth: isRecentAuth(amr),
      }
    }
    return {
      state: 'full',
      identity,
      authUserId: user.id,
      factorId: verifiedFactor.id,
      factorVersion: factorState.factorVersion,
      mfaVerifiedAt: mfaAt,
    }
  }

  if (verifiedFactor || nextLevel === 'aal2') {
    return {
      state: 'needs_challenge',
      identity,
      authUserId: user.id,
      factorId: verifiedFactor?.id ?? '',
    }
  }

  if (recovery) {
    return {
      state: 'recovery_reenroll',
      identity,
      authUserId: user.id,
      recoverySessionId: recovery.id,
    }
  }

  return {
    state: 'needs_enroll',
    identity,
    authUserId: user.id,
    recentAuth: isRecentAuth(amr),
  }
}

function isRecentAuth(amr: AmrEntry[] | undefined): boolean {
  const t = oauthAt(amr)
  if (t == null) return false
  return Date.now() - t <= founderMfaRecentAuthSec() * 1000
}

export function isRecentAuthFromAmr(amr: AmrEntry[] | undefined): boolean {
  return isRecentAuth(amr)
}
