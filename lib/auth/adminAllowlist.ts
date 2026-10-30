import 'server-only'
import { getAuthUser } from '@/lib/auth/server'
import { adminFromUser, parseAllowlist, type AdminIdentity } from '@/lib/auth/adminIdentity'

export type { AdminIdentity }

/**
 * Admin = email in ADMIN_EMAILS allowlist.
 * Google via Supabase Auth is provider-verified; no password-signup path remains.
 */
export async function requireAdmin(): Promise<AdminIdentity | null> {
  const allowlist = parseAllowlist(process.env.ADMIN_EMAILS)
  const user = await getAuthUser()
  return adminFromUser(
    user
      ? {
          email: user.email,
          name:
            (user.user_metadata?.full_name as string | undefined) ??
            (user.user_metadata?.name as string | undefined) ??
            user.email,
          emailVerified: Boolean(user.email),
        }
      : null,
    allowlist,
    { requireVerifiedEmail: false },
  )
}
