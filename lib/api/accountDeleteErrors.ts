export const ACCOUNT_DELETE_ERRORS = {
  AUTHENTICATION_REQUIRED: { status: 401, message: 'Sign in before deleting account data.' },
  INVALID_REQUEST: { status: 400, message: 'The request is invalid.' },
  REQUEST_TOO_LARGE: { status: 413, message: 'The request is too large.' },
  CONFIRMATION_REQUIRED: { status: 400, message: 'Explicit confirmation is required.' },
  DELETION_INCOMPLETE: { status: 500, message: 'The deletion did not complete. Please retry later.' },
  DELETION_FAILED: { status: 500, message: 'The deletion could not be completed. Please retry later.' },
} as const

export type AccountDeleteErrorCode = keyof typeof ACCOUNT_DELETE_ERRORS

export function accountDeleteError(code: AccountDeleteErrorCode, correlationId: string) {
  const definition = ACCOUNT_DELETE_ERRORS[code]
  return {
    status: definition.status,
    body: { error: code, message: definition.message, correlationId },
  }
}
