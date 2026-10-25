import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { authBackendSelection, betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'
import { resolveMappedBusinessUserId } from '@/lib/auth/identityMapping'
import { safeLog } from '@/lib/safeLog'

/** Stable business key used by user-scoped progress/settings/consent rows. */
export async function getSyncUserId(): Promise<string | null> {
  if (authBackendSelection.backend === 'better-auth') {
    if (!betterAuthEnabled || !betterAuthServer) return null
    const hdrs = await headers()
    const session = await betterAuthServer.api.getSession({ headers: hdrs })
    if (!session?.user) return null

    try {
      const accounts = await betterAuthServer.api.listUserAccounts({ headers: hdrs })
      const list = Array.isArray(accounts) ? accounts : []
      const google = list.find(
        (account: { providerId?: string; provider?: string }) => (account.providerId ?? account.provider) === 'google',
      )
      // Google is the only approved Better Auth method at this stage. A missing
      // provider account is not guessed to be an email-only account; email/password
      // remains disabled until its separate readiness approval and tests.
      if (!google || typeof (google as { accountId?: unknown }).accountId !== 'string') {
        safeLog('error', 'getSyncUserId: google account has no accountId')
        return null
      }
      const googleSubject = (google as { accountId: string }).accountId
      return await resolveMappedBusinessUserId(session.user.id, googleSubject)
    } catch (error) {
      // Mapping/lookup failures must not fall back to either email or an unverified id.
      safeLog('error', 'getSyncUserId: identity mapping failed — refusing to guess a key', error)
      return null
    }
  }

  if (authBackendSelection.backend === 'authjs') {
    const session = await nextAuth()
    return session?.user?.id ?? null
  }
  return null
}
