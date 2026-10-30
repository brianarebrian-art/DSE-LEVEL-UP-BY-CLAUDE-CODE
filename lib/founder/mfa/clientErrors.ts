/** MFA API 對外錯誤 —— 刻意含糊，避免洩露繞過資訊。 */

export type MfaClientErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'invalid'
  | 'rate_limited'
  | 'expired'
  | 'step_up_required'
  | 'config'
  | 'failed'

export function mfaErrorBody(code: MfaClientErrorCode): { error: string; code: string } {
  switch (code) {
    case 'unauthorized':
      return { error: 'unauthorized', code: 'FOUNDER_MFA_UNAUTHORIZED' }
    case 'forbidden':
      return { error: 'forbidden', code: 'FOUNDER_MFA_FORBIDDEN' }
    case 'rate_limited':
      return { error: 'try_later', code: 'FOUNDER_MFA_RATE_LIMITED' }
    case 'expired':
      return { error: 'expired', code: 'FOUNDER_MFA_EXPIRED' }
    case 'step_up_required':
      return { error: 'reauth', code: 'FOUNDER_MFA_STEP_UP' }
    case 'config':
      return { error: 'unavailable', code: 'FOUNDER_MFA_CONFIG' }
    case 'invalid':
    case 'failed':
    default:
      return { error: 'invalid', code: 'FOUNDER_MFA_INVALID' }
  }
}
