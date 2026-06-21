// Single source of truth for who gets premium and what each plan includes.
// Framework-agnostic and side-effect free, so it can be imported from BOTH the
// server (Auth.js callbacks in auth.ts) and client components (UI gating) without
// pulling in server-only code.

// Anyone signing in with a verified email under this domain gets premium, free,
// forever. Change this one constant if the school domain ever changes.
export const SCHOOL_DOMAIN = 'lhymss.net'

export type Plan = 'free' | 'premium'

/**
 * Premium-by-school-email check.
 * - email must end in `@<SCHOOL_DOMAIN>` (case-insensitive)
 * - if the identity provider explicitly reports the email as unverified, deny.
 *   (Google normally reports email_verified=true; it is only ever omitted, never
 *   falsely true — so treating undefined as acceptable is safe here.)
 */
export function isSchoolEmail(
  email?: string | null,
  emailVerified?: boolean,
): boolean {
  if (!email) return false
  if (emailVerified === false) return false
  return email.trim().toLowerCase().endsWith('@' + SCHOOL_DOMAIN)
}

/** Resolve a plan label from the premium flag. */
export function planFor(isPremium: boolean | undefined): Plan {
  return isPremium ? 'premium' : 'free'
}

// ── Free-tier limits ─────────────────────────────────────────────────────────
// Subjects a FREE (non-premium) user may practise. Everyone else is premium-only.
export const FREE_SUBJECTS = ['chinese', 'english', 'math', 'csd'] as const

// Questions drawn per practice run.
export const FREE_SESSION_SIZE = 10
export const PREMIUM_SESSION_SIZE = 20

// How many practice runs a free user may complete per subject.
export const FREE_ATTEMPTS_PER_SUBJECT = 10

// Subscription prices, in HKD. Adjust to taste.
export const PREMIUM_PRICE_MONTHLY_HKD = 38
export const PREMIUM_PRICE_YEARLY_HKD = 388

/** What the annual plan saves versus paying monthly for a year (HKD). */
export function yearlySavingHkd(): number {
  return PREMIUM_PRICE_MONTHLY_HKD * 12 - PREMIUM_PRICE_YEARLY_HKD
}

/** Is this subject available on the free plan? */
export function isFreeSubject(subjectId: string): boolean {
  return (FREE_SUBJECTS as readonly string[]).includes(subjectId)
}

/** Can a user with this premium status practise this subject at all? */
export function canAccessSubject(isPremium: boolean, subjectId: string): boolean {
  return isPremium || isFreeSubject(subjectId)
}

/** Questions per practice run for this plan. */
export function sessionSizeFor(isPremium: boolean): number {
  return isPremium ? PREMIUM_SESSION_SIZE : FREE_SESSION_SIZE
}

/** Per-subject attempt cap for this plan; `null` means unlimited. */
export function attemptCapFor(isPremium: boolean): number | null {
  return isPremium ? null : FREE_ATTEMPTS_PER_SUBJECT
}

// ── Manual Premium grants (Plan A: offline payment) ──────────────────────────
/** Parse a comma-separated email env var into a normalised, lower-cased list. */
export function parseEmailList(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * True if the email has been manually granted Premium via the PREMIUM_EMAILS env
 * var. This is the Plan-A unlock: a user pays offline, WhatsApps you proof, and you
 * add their email here + redeploy — no database required. Server-side only.
 */
export function isManuallyGrantedPremium(email?: string | null): boolean {
  if (!email) return false
  return parseEmailList(process.env.PREMIUM_EMAILS).includes(email.trim().toLowerCase())
}

/** True if the email is on ALLOWED_EMAILS (your testers/team get Premium free). */
export function isAllowlistedEmail(email?: string | null): boolean {
  if (!email) return false
  const list = parseEmailList(process.env.ALLOWED_EMAILS)
  const allowlist = list.length ? list : ['yunawong0128@gmail.com']
  return allowlist.includes(email.trim().toLowerCase())
}

/**
 * Single source of truth for Premium. A user is Premium if ANY of:
 *  - a verified @lhymss.net school email (free, automatic, no approval)
 *  - on PREMIUM_EMAILS (paid users you unlocked)
 *  - on ALLOWED_EMAILS (your testers / team)
 * Everyone else — guests and other Google accounts — gets the free tier.
 */
export function resolveIsPremium(email?: string | null, emailVerified?: boolean): boolean {
  return (
    isSchoolEmail(email, emailVerified) ||
    isManuallyGrantedPremium(email) ||
    isAllowlistedEmail(email)
  )
}
