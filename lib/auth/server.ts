import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'

// The stable per-user key for cloud progress (the `user_id` column of user_progress).
//
// DATA-COMPATIBILITY (directive: 保留現有用戶數據兼容性): existing rows were written by
// Auth.js keyed on the Google `sub`. Better Auth issues its own user ids, so after the
// cutover we look up the user's Google account and key on its `accountId` — which IS
// the same Google `sub` — so every existing user keeps their synced progress. Users who
// signed up with email/password (no Google account) key on the Better Auth user id.
//
// Until Better Auth is configured, this falls straight through to Auth.js → identical
// behaviour to today.
export async function getSyncUserId(): Promise<string | null> {
  if (betterAuthEnabled && betterAuthServer) {
    const hdrs = await headers()
    const session = await betterAuthServer.api.getSession({ headers: hdrs })
    if (!session?.user) return null

    try {
      const accounts = await betterAuthServer.api.listUserAccounts({ headers: hdrs })
      const google = Array.isArray(accounts)
        ? accounts.find((a: { providerId?: string; provider?: string }) =>
            (a.providerId ?? a.provider) === 'google',
          )
        : null
      const accountId = (google as { accountId?: string } | null | undefined)?.accountId
      if (accountId) return accountId
    } catch {
      // listUserAccounts shape can vary by version — fall back to the user id rather
      // than 500. Verify this mapping during the cutover (see FLIP-TO-BETTER-AUTH.md).
    }
    return session.user.id
  }

  const session = await nextAuth()
  return session?.user?.id ?? null
}

// The signed-in user's verified email (both backends expose it on session.user). Used
// for the LHYMSS domain role signal (lib/lhymss-verification.ts). Null when signed out.
export async function getSyncUserEmail(): Promise<string | null> {
  if (betterAuthEnabled && betterAuthServer) {
    const hdrs = await headers()
    const session = await betterAuthServer.api.getSession({ headers: hdrs })
    return session?.user?.email ?? null
  }
  const session = await nextAuth()
  return session?.user?.email ?? null
}
