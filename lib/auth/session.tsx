'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/auth/supabase-browser'
import { signInWithGoogle, signOutSupabase } from '@/lib/auth/google-auth'

// Supabase Auth session seam for the whole app. Components use `useAuthSession()`
// and `authSignOut*` helpers — never import @supabase/ssr directly in UI.

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface UnifiedUser {
  id?: string
  name?: string | null
  email?: string | null
}

export interface UnifiedSession {
  user: UnifiedUser | null
  status: AuthStatus
}

const AuthCtx = createContext<UnifiedSession>({ user: null, status: 'loading' })

export function useAuthSession(): UnifiedSession {
  return useContext(AuthCtx)
}

function mapUser(u: User | null | undefined): UnifiedUser | null {
  if (!u) return null
  const meta = u.user_metadata ?? {}
  return {
    id: u.id,
    name: (meta.full_name as string | undefined) ?? (meta.name as string | undefined) ?? null,
    email: u.email ?? null,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<UnifiedSession>({ user: null, status: 'loading' })

  useEffect(() => {
    let alive = true
    let supabase: ReturnType<typeof getSupabaseBrowser>
    try {
      supabase = getSupabaseBrowser()
    } catch {
      setValue({ user: null, status: 'unauthenticated' })
      return
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      const u = data.session?.user ?? null
      setValue({
        user: mapUser(u),
        status: u ? 'authenticated' : 'unauthenticated',
      })
    }).catch(() => {
      if (alive) setValue({ user: null, status: 'unauthenticated' })
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return
      const u = session?.user ?? null
      setValue({
        user: mapUser(u),
        status: u ? 'authenticated' : 'unauthenticated',
      })
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

/** Start Google OAuth. Prefer `GoogleSignInButton` in UI. */
export function authSignInGoogle(to?: string): void {
  const target =
    to ??
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '/dashboard')
  void signInWithGoogle(target).then((r) => {
    if (r.error && typeof window !== 'undefined') {
      window.location.href = `/sign-in?error=${encodeURIComponent(r.error)}`
    }
  })
}

export function authSignOut(): void {
  void signOutSupabase().then(() => {
    if (typeof window !== 'undefined') window.location.href = '/'
  })
}

/**
 * Sign out and wait — used after account wipe so SyncProvider does not
 * immediately re-create a cloud row.
 */
export async function authSignOutAndWait(): Promise<void> {
  try {
    await signOutSupabase()
  } catch {
    /* ignore — cloud + local already cleared */
  }
}
