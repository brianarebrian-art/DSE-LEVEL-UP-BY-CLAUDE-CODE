'use client'

import { SessionProvider } from 'next-auth/react'

// Auth is opt-in via NEXT_PUBLIC_AUTH_ENABLED so the site runs perfectly before
// Google OAuth credentials are configured. Set it to "true" (plus AUTH_GOOGLE_ID,
// AUTH_GOOGLE_SECRET and AUTH_SECRET) to turn login on.
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!AUTH_ENABLED) return <>{children}</>
  return <SessionProvider>{children}</SessionProvider>
}
