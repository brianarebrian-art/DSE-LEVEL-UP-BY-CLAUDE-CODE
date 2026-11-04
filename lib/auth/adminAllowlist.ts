import 'server-only'
import { getAuthUser } from '@/lib/auth/server'
import { adminFromUser, parseAllowlist, type AdminIdentity } from '@/lib/auth/adminIdentity'
import { emailVerifiedFromAuthUser } from '@/lib/auth/founderIdentity'

export type { AdminIdentity }

/**
 * Admin = email in ADMIN_EMAILS allowlist + verified email claim.
 * Use the same verification helper as founder — never treat "has email string" as verified
 * (blocks future password-signup footguns; Google identities still pass when confirmed).
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
          emailVerified: emailVerifiedFromAuthUser(user),
        }
      : null,
    allowlist,
    { requireVerifiedEmail: true },
  )
}
