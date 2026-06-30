'use client'

import { createContext, useContext, useMemo } from 'react'
import {
  SessionProvider as NextAuthSessionProvider,
  useSession as useNextAuthSession,
  signIn as nextSignIn,
  signOut as nextSignOut,
} from 'next-auth/react'
import { authClient, AUTH_BACKEND } from './client'

// One unified auth surface for the whole app. Components consume `useAuthSession()`
// (a plain context read) and the `auth*` action helpers — they never import next-auth
// or better-auth directly, so flipping the backend is a single env change. The active
// backend is fixed at build time (AUTH_BACKEND), so exactly ONE bridge mounts for the
// life of the bundle and hook order is always stable.

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

const AuthCtx = createContext<UnifiedSession>({ user: null, status: 'unauthenticated' })

export function useAuthSession(): UnifiedSession {
  return useContext(AuthCtx)
}

// --- Auth.js (next-auth) bridge: only rendered in next-auth mode, always inside the
// next-auth SessionProvider, so useSession() is valid. ---
function NextAuthBridge({ children }: { children: React.ReactNode }) {
  const { data, status } = useNextAuthSession()
  const value = useMemo<UnifiedSession>(
    () => ({
      user: data?.user
        ? { id: data.user.id, name: data.user.name, email: data.user.email }
        : null,
      status,
    }),
    [data, status],
  )
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

// --- Better Auth bridge: only rendered in better-auth mode, so its useSession() (and
// the /api/auth/get-session fetch it triggers) never runs while next-auth is live. ---
function BetterAuthBridge({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession()
  const value = useMemo<UnifiedSession>(
    () => ({
      user: data?.user
        ? { id: data.user.id, name: data.user.name, email: data.user.email }
        : null,
      status: isPending ? 'loading' : data?.user ? 'authenticated' : 'unauthenticated',
    }),
    [data, isPending],
  )
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Branch on a build-time constant → returns a different component, NOT a conditional
  // hook call, so the rules of hooks hold. next-auth mode still needs its provider.
  if (AUTH_BACKEND === 'better-auth') {
    return <BetterAuthBridge>{children}</BetterAuthBridge>
  }
  return (
    <NextAuthSessionProvider>
      <NextAuthBridge>{children}</NextAuthBridge>
    </NextAuthSessionProvider>
  )
}

// --- Action helpers (plain functions, so branching on AUTH_BACKEND is fine here). ---

export function authSignInGoogle(callbackURL = '/dashboard'): void {
  if (AUTH_BACKEND === 'better-auth') {
    void authClient.signIn.social({ provider: 'google', callbackURL })
  } else {
    void nextSignIn('google', { callbackURL })
  }
}

export function authSignOut(): void {
  if (AUTH_BACKEND === 'better-auth') void authClient.signOut()
  else void nextSignOut()
}

// Email/password (Better Auth only). Returns Better Auth's { data, error } result so
// the sign-in/up pages can surface validation errors without throwing.
export async function authSignInEmail(email: string, password: string, callbackURL = '/dashboard') {
  return authClient.signIn.email({ email, password, callbackURL })
}

export async function authSignUpEmail(
  name: string,
  email: string,
  password: string,
  callbackURL = '/dashboard',
) {
  return authClient.signUp.email({ name, email, password, callbackURL })
}
