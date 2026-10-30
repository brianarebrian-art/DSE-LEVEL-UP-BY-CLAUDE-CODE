import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

/**
 * 記錄已成功嘅 TOTP time step，防止同一 step 重放。
 * Supabase Auth 亦會拒絕重用；呢度係跨 instance 嘅應用層防衛。
 * periodSec = 30（Google Authenticator 相容）。
 */
export async function claimTotpTimeStep(
  factorId: string,
  factorVersion: number,
  periodSec = 30,
): Promise<boolean> {
  const step = Math.floor(Date.now() / 1000 / periodSec)
  try {
    const supabase = getServiceSupabase()
    const { data: cur, error: readErr } = await supabase
      .from('founder_mfa_factor_state')
      .select('last_totp_step, factor_id, factor_version')
      .eq('id', true)
      .maybeSingle()
    if (readErr) throw readErr
    if (cur?.last_totp_step === step && cur.factor_id === factorId) {
      return false
    }
    const { data, error } = await supabase
      .from('founder_mfa_factor_state')
      .update({
        last_totp_step: step,
        last_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', true)
      .eq('factor_id', factorId)
      .eq('factor_version', factorVersion)
      .or(`last_totp_step.is.null,last_totp_step.neq.${step}`)
      .select('id')
      .maybeSingle()
    if (error) throw error
    // 首次啟用時可能尚未寫入 factor_id；允許以 upsert 路徑
    if (!data && !cur?.factor_id) {
      const { error: upErr } = await supabase.from('founder_mfa_factor_state').upsert({
        id: true,
        factor_id: factorId,
        factor_version: factorVersion,
        last_totp_step: step,
        last_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      if (upErr) throw upErr
      return true
    }
    return Boolean(data)
  } catch (e) {
    safeLog('warn', 'founder totp step claim failed — denying', e)
    return false
  }
}
