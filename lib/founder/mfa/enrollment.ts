import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { randomTokenHex, sha256Hex } from '@/lib/founder/mfa/crypto'
import { safeLog } from '@/lib/safeLog'

/** 部署腳本用：產生一次性 enrollment token（原碼只印出一次）。 */
export async function issueEnrollmentToken(opts: {
  ttlMinutes?: number
  label?: string
  note?: string
}): Promise<{ token: string; expiresAt: string }> {
  const token = randomTokenHex(32)
  const tokenHash = sha256Hex(token)
  const ttl = Math.min(Math.max(opts.ttlMinutes ?? 30, 5), 24 * 60)
  const expiresAt = new Date(Date.now() + ttl * 60_000).toISOString()
  const supabase = getServiceSupabase()
  const { error } = await supabase.from('founder_mfa_enrollment_tokens').insert({
    token_hash: tokenHash,
    expires_at: expiresAt,
    created_by_label: opts.label?.slice(0, 120) ?? 'deploy-operator',
    note: opts.note?.slice(0, 200) ?? null,
  })
  if (error) throw error
  return { token, expiresAt }
}

export function isEnrollmentTokenFormat(rawToken: string): boolean {
  return /^[a-f0-9]{64}$/i.test(rawToken.trim())
}

/** 檢查 token 仍然有效（唔消耗）。 */
export async function assertEnrollmentTokenValid(rawToken: string): Promise<boolean> {
  const token = rawToken.trim()
  if (!isEnrollmentTokenFormat(token)) return false
  const tokenHash = sha256Hex(token)
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_mfa_enrollment_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .is('consumed_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
    if (error) throw error
    return Boolean(data)
  } catch (e) {
    safeLog('error', 'enrollment token assert failed', e)
    return false
  }
}

/** 原子驗證並消耗 enrollment token。 */
export async function consumeEnrollmentToken(rawToken: string): Promise<boolean> {
  const token = rawToken.trim()
  if (!isEnrollmentTokenFormat(token)) return false
  const tokenHash = sha256Hex(token)
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_mfa_enrollment_tokens')
      .update({ consumed_at: new Date().toISOString() })
      .eq('token_hash', tokenHash)
      .is('consumed_at', null)
      .gt('expires_at', new Date().toISOString())
      .select('id')
      .maybeSingle()
    if (error) throw error
    return Boolean(data)
  } catch (e) {
    safeLog('error', 'enrollment token consume failed', e)
    return false
  }
}

export async function activateFactorState(factorId: string): Promise<number> {
  const supabase = getServiceSupabase()
  const { data: cur } = await supabase
    .from('founder_mfa_factor_state')
    .select('factor_version')
    .eq('id', true)
    .maybeSingle()
  const nextVersion = (cur?.factor_version ?? 0) + 1
  const { error } = await supabase
    .from('founder_mfa_factor_state')
    .upsert({
      id: true,
      factor_id: factorId,
      factor_version: nextVersion,
      enrolled_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString(),
      revoked_at: null,
      revoke_reason: null,
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
  return nextVersion
}

export async function touchFactorVerified(): Promise<void> {
  try {
    const supabase = getServiceSupabase()
    await supabase
      .from('founder_mfa_factor_state')
      .update({ last_verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', true)
  } catch (e) {
    safeLog('warn', 'touch factor verified failed', e)
  }
}

/** 緊急撤銷：遞增版本、標記 revoked；唔刪 IdP factor（需另用 Admin API）。 */
export async function revokeFactorState(reason: string): Promise<number> {
  const supabase = getServiceSupabase()
  const { data: cur } = await supabase
    .from('founder_mfa_factor_state')
    .select('factor_version')
    .eq('id', true)
    .maybeSingle()
  const nextVersion = (cur?.factor_version ?? 0) + 1
  const { error } = await supabase
    .from('founder_mfa_factor_state')
    .upsert({
      id: true,
      factor_id: null,
      factor_version: nextVersion,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason.slice(0, 200),
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
  // 失效未用復原碼
  await supabase
    .from('founder_mfa_recovery_codes')
    .update({ used_at: new Date().toISOString(), used_by_sub: 'revoked' })
    .is('used_at', null)
  return nextVersion
}
