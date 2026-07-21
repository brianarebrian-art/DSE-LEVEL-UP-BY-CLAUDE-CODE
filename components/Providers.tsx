'use client'

import { LanguageProvider } from '@/lib/i18n'
import SyncProvider from '@/components/SyncProvider'
import SettingsSync from '@/components/SettingsSync'
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
        {/* SyncProvider = 進度／做緊嘅卷（/api/progress snapshot）
            SettingsSync = SEN 偏好設定（/api/sync/settings）—— 兩者數據唔重疊，
            所以唔會出現「兩條通道爭同一份數據」嘅時間戳競賽。 */}
        <SyncProvider>
          <SettingsSync>{children}</SettingsSync>
        </SyncProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
