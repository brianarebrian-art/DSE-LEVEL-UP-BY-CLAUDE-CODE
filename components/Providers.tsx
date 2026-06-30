'use client'

import { LanguageProvider } from '@/lib/i18n'
import SyncProvider from '@/components/SyncProvider'
import { AuthProvider } from '@/lib/auth/session'

// LanguageProvider wraps everything so the whole UI can switch 中/EN client-side.
// AuthProvider is the backend-agnostic seam: it mounts the active auth bridge (Auth.js
// by default, Better Auth once NEXT_PUBLIC_AUTH_BACKEND=better-auth) and exposes one
// useAuthSession() everywhere, so useAuthSession()/usePlan() are safe app-wide. When
// auth is disabled it yields no session and everyone has full access (lib/usePlan.ts).
// Login UI stays opt-in via the NEXT_PUBLIC_AUTH_ENABLED flag inside AuthButton.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SyncProvider>{children}</SyncProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
