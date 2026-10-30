import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import {
  founderMfaVerifyWindowMs,
  founderMfaVerifyLimit,
  founderMfaBlockMs,
} from '@/lib/founder/mfa/config'

export type MfaRateResult = { allowed: true; hits: number } | { allowed: false; reason: string; retryAfterMs?: number }

/**
 * 跨 instance 共享限流（Postgres）。表／函式未 migrate 時拒絕（deny-by-default）。
 */
export async function hitFounderMfaRateLimit(bucketKey: string): Promise<MfaRateResult> {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.rpc('founder_mfa_rate_hit', {
      p_key: bucketKey.slice(0, 200),
      p_window_ms: founderMfaVerifyWindowMs(),
      p_limit: founderMfaVerifyLimit(),
      p_block_ms: founderMfaBlockMs(),
    })
    if (error) throw error
    const row = data as { allowed?: boolean; reason?: string; hits?: number; retry_after_ms?: number } | null
    if (!row || row.allowed !== true) {
      return {
        allowed: false,
        reason: row?.reason ?? 'rate_limited',
        retryAfterMs: row?.retry_after_ms,
      }
    }
    return { allowed: true, hits: row.hits ?? 0 }
  } catch (e) {
    safeLog('warn', 'founder mfa rate limit unavailable — denying', e)
    return { allowed: false, reason: 'rate_store_unavailable' }
  }
}
