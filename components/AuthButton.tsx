'use client'

import { LogIn, LogOut } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { useAuthSession, authSignInGoogle, authSignOut } from '@/lib/auth/session'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// Inner component calls useSession — only mounted when auth is enabled (so the
// SessionProvider is guaranteed to wrap it).
function AuthButtonInner({ onAction }: { onAction?: () => void }) {
  const { user, status } = useAuthSession()
  const t = useT()

  if (status === 'loading') {
    return <div className="w-7 h-7 rounded-full bg-black/10 animate-pulse" />
  }

  if (user) {
    const label = user.name ?? user.email ?? t.auth.user
    const initial = label.charAt(0).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-[#00726C] text-white grid place-items-center text-xs font-medium"
          title={user.email ?? label}
        >
          {initial}
        </div>
        <button
          onClick={() => {
            onAction?.()
            authSignOut()
          }}
          className="min-h-11 text-sm text-[#6B6B6B] hover:text-[#008B84] flex items-center gap-1 px-1"
        >
          <LogOut size={14} /> {t.auth.signOut}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        onAction?.()
        authSignInGoogle()
      }}
      className="min-h-11 flex items-center gap-2 text-sm border border-black/[0.12] hover:border-[#008B84] text-[#2D2D2D] hover:text-[#008B84] rounded-lg px-3 py-1.5 transition-colors"
    >
      <LogIn size={14} /> {t.auth.signIn}
    </button>
  )
}

export default function AuthButton({ onAction }: { onAction?: () => void }) {
  if (!AUTH_ENABLED) return null
  return <AuthButtonInner onAction={onAction} />
}
