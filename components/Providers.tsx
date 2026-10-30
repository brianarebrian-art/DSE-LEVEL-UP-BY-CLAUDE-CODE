'use client'

import { LanguageProvider } from '@/lib/i18n'
import SyncProvider from '@/components/SyncProvider'
import SettingsSync from '@/components/SettingsSync'
import ThemeProvider from '@/components/ThemeProvider'
import { AuthProvider } from '@/lib/auth/session'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

// LanguageProvider wraps everything so the whole UI can switch 中/EN client-side.
// AuthProvider mounts Supabase Auth session listener and exposes useAuthSession()
// app-wide. Login UI stays opt-in via NEXT_PUBLIC_AUTH_ENABLED inside AuthButton.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // ThemeProvider 與 LanguageProvider 平行、互不巢狀依賴：主題用 `dse-theme`、
    // 語言用自己的鍵，切換其中一樣完全唔會觸碰另一樣（Brian 要求「語言轉換隔離」）。
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        {/* SyncProvider = 進度／做緊嘅卷（/api/progress snapshot）
            SettingsSync = SEN 偏好設定（/api/sync/settings）—— 兩者數據唔重疊，
            所以唔會出現「兩條通道爭同一份數據」嘅時間戳競賽。 */}
          <SyncProvider>
            <SettingsSync>{children}</SettingsSync>
            {/* 離線層登記（唔 render 任何嘢）—— 見 components/ServiceWorkerRegister.tsx */}
            <ServiceWorkerRegister />
          </SyncProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
