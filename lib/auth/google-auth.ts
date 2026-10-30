'use client'

import { getSupabaseBrowser } from '@/lib/auth/supabase-browser'
import { safeInternalPath } from '@/lib/auth/safeRedirect'

/** Start Google OAuth via Supabase Auth. */
export async function signInWithGoogle(nextPath?: string): Promise<{ error?: string }> {
  try {
    const supabase = getSupabaseBrowser()
    const next = safeInternalPath(nextPath, '/dashboard')
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
    if (error) return { error: 'oauth' }
    return {}
  } catch {
    return { error: 'oauth' }
  }
}

export async function signOutSupabase(): Promise<void> {
  try {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
  } catch {
    /* ignore — UI will still clear local session state */
  }
}
