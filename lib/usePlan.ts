'use client'

import { useSession } from 'next-auth/react'

// Auth (and therefore the paywall) is opt-in via NEXT_PUBLIC_AUTH_ENABLED. When it
// is OFF there is no way to sign in or pay, so the site falls back to its original
// behaviour: everything is unlocked for everyone. SessionProvider always wraps the
// app (see components/Providers.tsx), so calling useSession() here is always safe.
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

export interface PlanState {
  /** Full access: a school email, a paid user, or auth disabled entirely. */
  isPremium: boolean
  /** A user is signed in (only meaningful when auth is enabled). */
  signedIn: boolean
  /** The session is still resolving — gate UI should wait. */
  loading: boolean
  /** Whether the paywall is active at all. */
  authEnabled: boolean
}

/** Client hook: the current user's plan, derived from the Auth.js session. */
export function usePlan(): PlanState {
  const { data, status } = useSession()
  if (!AUTH_ENABLED) {
    return { isPremium: true, signedIn: false, loading: false, authEnabled: false }
  }
  return {
    isPremium: Boolean(data?.user?.isPremium),
    signedIn: status === 'authenticated',
    loading: status === 'loading',
    authEnabled: true,
  }
}
