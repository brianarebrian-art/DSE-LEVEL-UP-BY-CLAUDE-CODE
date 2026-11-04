'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/auth/supabase-browser'
import { signInWithGoogle, signOutSupabase } from '@/lib/auth/google-auth'
import { wipeThisDevice } from '@/lib/privacy/wipeDevice'
import { hasUnsyncedLocalProgress, snapshotLocal } from '@/lib/sync'

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

/**
 * Sign out for shared-device safety (v6 D5／S5):
 * 1. If local learning data may be unsynced, try one cloud push.
 * 2. If still unsynced, require an explicit confirm to abandon local data (or cancel).
 * 3. Sign out, wipe this device's platform data, full reload to `/`.
 */
export function authSignOut(): void {
  void (async () => {
    if (typeof window === 'undefined') return

    if (hasUnsyncedLocalProgress()) {
      let synced = false
      try {
        const progress = snapshotLocal()
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress }),
        })
        synced = res.ok
      } catch {
        synced = false
      }
      if (!synced) {
        const abandon = window.confirm(
          '未能同步本機練習資料。按「確定」會登出並清除本機資料（未上雲嘅進度可能會冇）；按「取消」保持登入，方便稍後再同步。',
        )
        if (!abandon) return
      }
    }

    try {
      await signOutSupabase()
    } catch {
      /* still wipe local so the next person cannot read this session's data */
    }
    try {
      await wipeThisDevice()
    } catch {
      /* best-effort */
    }
    window.location.href = '/'
  })()
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
