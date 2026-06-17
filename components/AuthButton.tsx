'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { LogIn, LogOut } from 'lucide-react'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// Inner component calls useSession — only mounted when auth is enabled (so the
// SessionProvider is guaranteed to wrap it).
function AuthButtonInner({ onAction }: { onAction?: () => void }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-7 h-7 rounded-full bg-slate-800 animate-pulse" />
  }

  if (session?.user) {
    const label = session.user.name ?? session.user.email ?? '用戶'
    const initial = label.charAt(0).toUpperCase()
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-amber-500 text-black grid place-items-center text-xs font-bold"
          title={session.user.email ?? label}
        >
          {initial}
        </div>
        <button
          onClick={() => {
            onAction?.()
            signOut()
          }}
          className="text-sm text-slate-400 hover:text-slate-100 flex items-center gap-1"
        >
          <LogOut size={14} /> 登出
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        onAction?.()
        signIn('google')
      }}
      className="flex items-center gap-2 text-sm border border-slate-700 hover:border-slate-500 text-slate-200 rounded-lg px-3 py-1.5 transition-colors"
    >
      <LogIn size={14} /> Google 登入
    </button>
  )
}

export default function AuthButton({ onAction }: { onAction?: () => void }) {
  if (!AUTH_ENABLED) return null
  return <AuthButtonInner onAction={onAction} />
}
