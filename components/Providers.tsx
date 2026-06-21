'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from '@/lib/i18n'

// LanguageProvider wraps everything so the whole UI can switch 中/EN client-side.
// SessionProvider always wraps too, so useSession()/usePlan() are safe everywhere;
// when auth is disabled it simply yields no session and the app treats everyone as
// having full access (see lib/usePlan.ts). Login UI stays opt-in via the
// NEXT_PUBLIC_AUTH_ENABLED flag inside AuthButton.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SessionProvider>{children}</SessionProvider>
    </LanguageProvider>
  )
}
