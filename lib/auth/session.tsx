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

/**
 * Google 登入。唔傳 `to` 就返返學生原本嗰版。
 *
 * ⚠️ 兩個 backend 嘅 option 名【唔同】，而且改錯咗係靜靜哋錯：
 *   Better Auth → `callbackURL`（大楷 URL）
 *   Auth.js v5  → `redirectTo`（`callbackUrl` 係 deprecated 別名）
 *
 * 2026-09-05 修正：原本兩邊都傳 `callbackURL`。Auth.js 嗰邊
 * `SignInOptions extends Record<string, unknown>`，所以個 key 過到 tsc
 * 但完全唔會被讀 —— 結果 Auth.js（預設 backend）行咗佢自己嘅預設
 * 「返返登入前嗰版」，而 Better Auth 就真係跳去 /dashboard。
 * 即係話同一粒掣喺兩個 backend 之下行為唔同，而兩邊都唔係有人揀過嘅。
 *
 * 現行行為：兩邊一致，預設返返原本嗰版（呢個亦係學生想要嘅 ——
 * 喺練習頁撳登入，唔應該被掉去 dashboard，之後仲要自己搵返條題目）。
 * 迴歸鎖：lib/__tests__/auth-callback.test.mts
 */
export function authSignInGoogle(to?: string): void {
  // 同源保證：只取 pathname + search，唔會變成 open redirect。
  const target = to
    ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/dashboard')
  if (AUTH_BACKEND === 'better-auth') {
    void authClient.signIn.social({ provider: 'google', callbackURL: target })
  } else {
    void nextSignIn('google', { redirectTo: target })
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
