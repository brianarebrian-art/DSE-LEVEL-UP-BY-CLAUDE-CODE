// LHYMSS (嶺南衡怡紀念中學) role classification from the Google-verified email.
//
// This is a SIGNAL, not a hard security boundary. It reads only the OAuth-verified email
// (no new PII, no external service, $0). The "no digit in the local part = teacher" rule
// is the SCHOOL'S naming convention, administered by the school's IT — it is trusted, not
// proven, here.
//
// ⚠️ Escalation caveat: the one dangerous misclassification is a @lhymss.net STUDENT whose
// email happens to have no digit → they'd be seen as a teacher. This is safe ONLY as long
// as the school guarantees students always carry a digit (e.g. s12345678@lhymss.net). Two
// backstops keep this contained: (1) an admin can always demote via /api/admin/set-role,
// and the DB role is authoritative after first-visit provisioning; (2) the teacher role
// exposes NO student data until a student joins that teacher's class AND grants consent.

const LHYMSS_DOMAIN = '@lhymss.net'

function normalise(email: string): string {
  return email.toLowerCase().trim()
}

export function isLHYMSSDomain(email: string): boolean {
  return normalise(email).endsWith(LHYMSS_DOMAIN)
}

export function isLHYMSSTeacher(email: string): boolean {
  if (!isLHYMSSDomain(email)) return false
  const localPart = normalise(email).split('@')[0]
  return !/\d/.test(localPart) // no digit → teacher (per school convention)
}

export function isLHYMSSStudent(email: string): boolean {
  if (!isLHYMSSDomain(email)) return false
  const localPart = normalise(email).split('@')[0]
  return /\d/.test(localPart) // has a digit → student
}

export type LHYMSSRole = 'teacher' | 'student' | 'external'

export function determineLHYMSSRole(email: string | null | undefined): LHYMSSRole {
  if (!email || !isLHYMSSDomain(email)) return 'external'
  return isLHYMSSTeacher(email) ? 'teacher' : 'student'
}

// Founder override for edge cases (e.g. a teacher whose email does carry a digit). Kept
// empty by design — the primary, authoritative override is an admin using set-role. Add
// full email addresses here only with the school's confirmation.
const TEACHER_WHITELIST = new Set<string>([])

export function isTeacherOverride(email: string | null | undefined): boolean {
  return email ? TEACHER_WHITELIST.has(normalise(email)) : false
}
