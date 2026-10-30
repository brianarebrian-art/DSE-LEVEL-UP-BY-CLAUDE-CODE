import 'server-only'
import { getFounderGate } from '@/lib/founder/mfa/gate'

/** 敏感操作要求嘅近期 MFA 窗口（秒）。 */
export function founderMfaStepUpSec(): number {
  const n = Number(process.env.FOUNDER_MFA_STEP_UP_SEC ?? 5 * 60)
  return Number.isFinite(n) && n >= 60 ? Math.floor(n) : 5 * 60
}

/**
 * 檢查目前 full session 嘅 MFA 是否仍喺 step-up 窗口內。
 * 唔接受重放上一個已用 time step；窗口外必須重新 TOTP。
 */
export async function requireRecentMfaStepUp(): Promise<
  { ok: true } | { ok: false; reason: 'forbidden' | 'step_up_required' }
> {
  const gate = await getFounderGate()
  if (gate.state !== 'full') return { ok: false, reason: 'forbidden' }
  const ageMs = Date.now() - gate.mfaVerifiedAt
  if (ageMs > founderMfaStepUpSec() * 1000) {
    return { ok: false, reason: 'step_up_required' }
  }
  return { ok: true }
}
