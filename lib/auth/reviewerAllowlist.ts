import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'
import { parseAllowlist, type AdminIdentity, type SessionUser } from '@/lib/auth/adminIdentity'

export type ReviewerRole = 'admin' | 'teacher' | 'subject_editor' | 'volunteer'
export interface ReviewerIdentity extends AdminIdentity {
  role: ReviewerRole
}

// REVIEWER_EMAILS 格式：email=teacher,email2=volunteer,email3=subject_editor。
// ADMIN_EMAILS 仍然保留最高權限；未設定 REVIEWER_EMAILS 時，只有 admin 可進入。
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
  if (adminEmails.includes(email)) return { email: user.email, name: user.name || user.email, role: 'admin' }
  const role = reviewerEmails.get(email)
  return role ? { email: user.email, name: user.name || user.email, role } : null
}

export async function requireReviewer(): Promise<ReviewerIdentity | null> {
  const adminEmails = parseAllowlist(process.env.ADMIN_EMAILS)
  const reviewerEmails = parseReviewerAllowlist(process.env.REVIEWER_EMAILS)
  if (betterAuthEnabled && betterAuthServer) {
    const session = await betterAuthServer.api.getSession({ headers: await headers() })
    return reviewerFromUser(session?.user, adminEmails, reviewerEmails, { requireVerifiedEmail: true })
  }
  const session = await nextAuth()
  return reviewerFromUser(session?.user, adminEmails, reviewerEmails, { requireVerifiedEmail: false })
}
