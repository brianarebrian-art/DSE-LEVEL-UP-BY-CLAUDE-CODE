import 'server-only'
import { getAuthUser } from '@/lib/auth/server'
import { parseAllowlist, type AdminIdentity, type SessionUser } from '@/lib/auth/adminIdentity'

export type ReviewerRole = 'admin' | 'teacher' | 'subject_editor' | 'volunteer'
export interface ReviewerIdentity extends AdminIdentity {
  role: ReviewerRole
}

function parseReviewerAllowlist(raw: string | undefined): Map<string, ReviewerRole> {
  const result = new Map<string, ReviewerRole>()
  for (const item of (raw ?? '').split(',')) {
    const [emailRaw, roleRaw] = item.split('=').map((s) => s.trim().toLowerCase())
    if (!emailRaw || !roleRaw) continue
    if (roleRaw === 'teacher' || roleRaw === 'subject_editor' || roleRaw === 'volunteer') {
      result.set(emailRaw, roleRaw)
    }
  }
  return result
}

function reviewerFromUser(
  user: SessionUser | null | undefined,
  adminEmails: readonly string[],
  reviewerEmails: ReadonlyMap<string, ReviewerRole>,
  opts: { requireVerifiedEmail: boolean },
): ReviewerIdentity | null {
  if (!user?.email) return null
  if (opts.requireVerifiedEmail && user.emailVerified !== true) return null
  const email = user.email.trim().toLowerCase()
  if (adminEmails.includes(email)) {
    return { email: user.email, name: user.name || user.email, role: 'admin' }
  }
  const role = reviewerEmails.get(email)
  return role ? { email: user.email, name: user.name || user.email, role } : null
}

export async function requireReviewer(): Promise<ReviewerIdentity | null> {
  const adminEmails = parseAllowlist(process.env.ADMIN_EMAILS)
  const reviewerEmails = parseReviewerAllowlist(process.env.REVIEWER_EMAILS)
  const user = await getAuthUser()
  return reviewerFromUser(
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
    adminEmails,
    reviewerEmails,
    { requireVerifiedEmail: false },
  )
}
