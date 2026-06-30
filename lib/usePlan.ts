'use client'

import { useAuthSession } from '@/lib/auth/session'

// Sign-in is OPTIONAL and only powers cross-device progress sync — it unlocks nothing
// (the whole platform is free). This hook just reports whether a user is signed in,
// for the sync UI. AuthProvider always wraps the app (see components/Providers.tsx),
// so calling useAuthSession() here is always safe regardless of the auth backend.
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

export interface PlanState {
  /** A user is signed in (only meaningful when auth is enabled). */
  signedIn: boolean
  /** The session is still resolving. */
  loading: boolean
}

export function usePlan(): PlanState {
  const { status } = useAuthSession()
  if (!AUTH_ENABLED) return { signedIn: false, loading: false }
  return {
    signedIn: status === 'authenticated',
    loading: status === 'loading',
  }
}
