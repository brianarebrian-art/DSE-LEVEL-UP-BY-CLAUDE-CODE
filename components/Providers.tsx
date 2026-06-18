'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from '@/lib/i18n'

// Auth is opt-in via NEXT_PUBLIC_AUTH_ENABLED so the site runs perfectly before
// Google OAuth credentials are configured. Set it to "true" (plus AUTH_GOOGLE_ID,
// AUTH_GOOGLE_SECRET and AUTH_SECRET) to turn login on.
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// LanguageProvider wraps everything so the whole UI can switch 中/EN client-side,
// with auth staying opt-in inside it.
export default function Providers({ children }: { children: React.ReactNode }) {
  const tree = AUTH_ENABLED ? <SessionProvider>{children}</SessionProvider> : children
  return <LanguageProvider>{tree}</LanguageProvider>
}
