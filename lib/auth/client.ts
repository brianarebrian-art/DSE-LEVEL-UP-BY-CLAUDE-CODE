'use client'

import { createAuthClient } from 'better-auth/react'

// Which auth backend is live. BUILD-TIME constant (NEXT_PUBLIC_*), so it never changes
// across renders — the AuthProvider can branch on it to mount a single, stable bridge
// without ever violating the rules of hooks. Default = the existing Auth.js (next-auth)
// path, so the live app keeps working until you flip (see FLIP-TO-BETTER-AUTH.md).
export const AUTH_BACKEND: 'next-auth' | 'better-auth' =
  process.env.NEXT_PUBLIC_AUTH_BACKEND === 'better-auth' ? 'better-auth' : 'next-auth'

// Pure HTTP client to /api/auth — constructing it needs NO database, so it is safe to
// import anywhere. baseURL defaults to the current origin when unset.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined,
})
