import 'server-only'
import { getSupabaseServer } from '@/lib/auth/supabase-server'

/**
 * Stable per-user key for cloud progress / RLS-scoped rows.
 *
 * After the Supabase Auth rebuild this is `auth.users.id` (uuid).
 * Legacy Google `sub` rows in `user_progress` are migrated via `auth_identity_map`.
 */
export async function getSyncUserId(): Promise<string | null> {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return data.user.id
  } catch {
    return null
  }
}

/**
 * Strict server-side authorization guard.
 *
 * Enforces authenticated identity without trusting any client-supplied user_id.
 * Throws an explicit error if unauthenticated, preventing IDOR vulnerabilities.
 */
export async function requireVerifiedUser(): Promise<{ id: string; email: string | null }> {
  const user = await getAuthUser()
  if (!user || !user.id) {
    throw new Error('UNAUTHORIZED')
  }
  return {
    id: user.id,
    email: user.email ?? null,
  }
}

/** Current Supabase Auth user (server). Prefer over re-reading cookies elsewhere. */
export async function getAuthUser() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return data.user
  } catch {
    return null
  }
}
