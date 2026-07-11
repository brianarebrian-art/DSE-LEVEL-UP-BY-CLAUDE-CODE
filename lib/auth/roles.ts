import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { getSyncUserId, getSyncUserEmail } from '@/lib/auth/server'
import { isLHYMSSTeacher, isTeacherOverride } from '@/lib/lhymss-verification'

// Teacher Radar — role source of truth (Phase 0 foundation).
//
// Identity comes from the SAME backend-agnostic helper the progress sync uses
// (getSyncUserId → Auth.js today, Better Auth once flipped), so the profiles row is
// keyed on the stable Google `sub`. A profile is auto-provisioned as 'student' on the
// user's first authenticated request; elevation to 'teacher'/'admin' is ADMIN-ONLY and
// never self-serve.
//
// FAIL-SAFE: any infra problem (Supabase env absent, table not migrated yet, query
// error) degrades to role 'student' — the LEAST-privileged role — so a failure can
// never accidentally hand someone teacher/admin access. Callers that need elevation
// must use requireRole(), which denies on anything below the requested role.

export type Role = 'student' | 'teacher' | 'admin'

const RANK: Record<Role, number> = { student: 0, teacher: 1, admin: 2 }

export interface CurrentProfile {
  userId: string
  role: Role
}

/**
 * The signed-in user's id + role, provisioning a default 'student' profile on first
 * visit. Returns null only when there is NO authenticated session.
 */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const userId = await getSyncUserId()
  if (!userId) return null

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    // An EXISTING row is authoritative — this is what lets an admin promote/demote via
    // set-role and have it stick, overriding the domain heuristic below.
    if (data?.role) return { userId, role: normaliseRole(data.role) }

    // First authenticated visit — provision the initial role from the verified school
    // email. @lhymss.net with no digit → teacher (school convention); everyone else →
    // student. See lib/lhymss-verification.ts for the escalation caveat + backstops.
    const email = await getSyncUserEmail()
    const initial: Role = isLHYMSSTeacher(email ?? '') || isTeacherOverride(email) ? 'teacher' : 'student'
    const { error: insErr } = await supabase.from('profiles').insert({ user_id: userId, role: initial })
    if (insErr) {
      // Lost a create race — re-read the authoritative row rather than guessing.
      if (insErr.code === '23505') {
        const { data: again } = await supabase.from('profiles').select('role').eq('user_id', userId).maybeSingle()
        return { userId, role: normaliseRole(again?.role ?? 'student') }
      }
      throw insErr
    }
    return { userId, role: initial }
  } catch (e) {
    // Pre-migration / no-Supabase / transient error → safe least-privilege fallback.
    console.error('[roles.getCurrentProfile] falling back to student:', e)
    return { userId, role: 'student' }
  }
}

/**
 * Gate a server route to a minimum role. Returns the profile when the caller is at or
 * above `min`, otherwise null (route should respond 401/403). Never throws.
 */
export async function requireRole(min: Role): Promise<CurrentProfile | null> {
  const profile = await getCurrentProfile()
  if (!profile) return null
  return RANK[profile.role] >= RANK[min] ? profile : null
}

function normaliseRole(v: string): Role {
  return v === 'teacher' || v === 'admin' ? v : 'student'
}
