/** Founder MFA 可配置項（server env；有合理預設）。 */

export function founderMfaMaxAgeSec(): number {
  const n = Number(process.env.FOUNDER_MFA_MAX_AGE_SEC ?? 12 * 60 * 60)
  return Number.isFinite(n) && n >= 300 ? Math.floor(n) : 12 * 60 * 60
}

export function founderMfaIdleSec(): number {
  const n = Number(process.env.FOUNDER_MFA_IDLE_SEC ?? 2 * 60 * 60)
  return Number.isFinite(n) && n >= 300 ? Math.floor(n) : 2 * 60 * 60
}

/** 首次綁定要求嘅近期 Google 登入窗口（秒）。 */
export function founderMfaRecentAuthSec(): number {
  const n = Number(process.env.FOUNDER_MFA_RECENT_AUTH_SEC ?? 15 * 60)
  return Number.isFinite(n) && n >= 60 ? Math.floor(n) : 15 * 60
}

export function founderMfaVerifyWindowMs(): number {
  return 10 * 60_000
}

export function founderMfaVerifyLimit(): number {
  return 8
}

export function founderMfaBlockMs(): number {
  return 5 * 60_000
}

export const FOUNDER_MFA_ISSUER = 'DSE Level Up'

export const FOUNDER_TOTP_HINT = {
  digits: 6,
  periodSec: 30,
  algorithm: 'SHA1',
  note: 'Google Authenticator 相容標準設定；容差由 Supabase Auth 管理（通常 ±1 步）。',
} as const
