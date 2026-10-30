import 'server-only'
import { cookies } from 'next/headers'
import { getServiceSupabase } from '@/utils/supabase/server'
import { hashRecoveryCode, normalizeRecoveryCode, randomTokenHex, sha256Hex, generateRecoveryCodes } from '@/lib/founder/mfa/crypto'
import { safeLog } from '@/lib/safeLog'
import type { FounderIdentity } from '@/lib/auth/founderIdentity'

const COOKIE = 'fos_mfa_recovery'
const COOKIE_MAX_AGE = 30 * 60

export async function createRecoveryCodes(factorVersion: number): Promise<string[]> {
  const codes = generateRecoveryCodes(10)
  const supabase = getServiceSupabase()
  // 新版本：標記舊碼全部失效（atomic batch）
  await supabase
    .from('founder_mfa_recovery_codes')
    .update({ used_at: new Date().toISOString(), used_by_sub: 'rotated' })
    .is('used_at', null)
    .neq('factor_version', -1)

  const rows = codes.map((c) => ({
    code_hash: hashRecoveryCode(c),
    factor_version: factorVersion,
  }))
  const { error } = await supabase.from('founder_mfa_recovery_codes').insert(rows)
  if (error) throw error
  return codes
}

/** 原子消耗一個復原碼；成功則建立受限 recovery session。 */
export async function consumeRecoveryCode(
  identity: FounderIdentity,
  rawCode: string,
): Promise<{ ok: true; recoveryToken: string } | { ok: false; reason: string }> {
  const hash = hashRecoveryCode(rawCode)
  if (normalizeRecoveryCode(rawCode).length < 8) return { ok: false, reason: 'invalid' }

  try {
    const supabase = getServiceSupabase()
    const { data: row, error } = await supabase
      .from('founder_mfa_recovery_codes')
      .update({
        used_at: new Date().toISOString(),
        used_by_sub: identity.googleSub,
      })
      .eq('code_hash', hash)
      .is('used_at', null)
      .select('id, factor_version')
      .maybeSingle()
    if (error) throw error
    if (!row) return { ok: false, reason: 'invalid' }

    const recoveryToken = randomTokenHex(32)
    const sessionHash = sha256Hex(recoveryToken)
    const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toISOString()
    const { error: sErr } = await supabase.from('founder_mfa_recovery_sessions').insert({
      session_hash: sessionHash,
      google_sub: identity.googleSub,
      expires_at: expires,
    })
    if (sErr) throw sErr

    const jar = await cookies()
    jar.set(COOKIE, recoveryToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/founder',
      maxAge: COOKIE_MAX_AGE,
    })

    return { ok: true, recoveryToken }
  } catch (e) {
    safeLog('error', 'founder recovery code consume failed', e)
    return { ok: false, reason: 'error' }
  }
}

export async function getActiveRecoverySession(
  googleSub: string,
): Promise<{ id: string } | null> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return null
    const sessionHash = sha256Hex(token)
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_mfa_recovery_sessions')
      .select('id, google_sub, expires_at, consumed_at')
      .eq('session_hash', sessionHash)
      .maybeSingle()
    if (error) throw error
    if (!data || data.consumed_at) return null
    if (data.google_sub !== googleSub) return null
    if (new Date(data.expires_at).getTime() < Date.now()) return null
    return { id: data.id }
  } catch (e) {
    safeLog('warn', 'founder recovery session read failed', e)
    return null
  }
}

export async function consumeRecoverySession(googleSub: string): Promise<boolean> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return false
    const sessionHash = sha256Hex(token)
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_mfa_recovery_sessions')
      .update({ consumed_at: new Date().toISOString() })
      .eq('session_hash', sessionHash)
      .eq('google_sub', googleSub)
      .is('consumed_at', null)
      .gt('expires_at', new Date().toISOString())
      .select('id')
      .maybeSingle()
    if (error) throw error
    jar.delete(COOKIE)
    return Boolean(data)
  } catch (e) {
    safeLog('warn', 'founder recovery session consume failed', e)
    return false
  }
}

export async function clearRecoveryCookie(): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/founder',
    maxAge: 0,
  })
}
