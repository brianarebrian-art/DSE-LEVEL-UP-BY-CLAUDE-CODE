'use client'

import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useAuthSession, authSignInGoogle } from '@/lib/auth/session'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

// 登入前的同步說明（audit loop T39；創辦人 2026-10-03 回覆 Q-T39：要短、講明係可選）。
// 擺喺登入掣附近，唔係彈窗。完整同步清單同刪除方法交由私隱頁，呢度只放連結，
// 所以唔會同私隱頁分叉。`withButton`：練習完成後（結果頁）先提示，附登入掣。
function Note({ className, withButton }: { className?: string; withButton?: boolean }) {
  const { user, status } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
  if (status !== 'unauthenticated' || user) return null
  const text = (
    <p className="text-xs leading-relaxed text-ink-muted">
      {en
        ? 'Optional: sign in to sync your progress, so it follows you to another device. Everything works without signing in. '
        : '可選同步進度：登入之後，換部機都接得返；唔登入一樣用得。'}
      {en ? 'What is synced and how to delete it: ' : '會同步咩、點樣刪除：'}
      <Link href="/privacy" className="text-accent underline underline-offset-2">
        {en ? 'privacy policy' : '私隱政策'}
      </Link>
      {en ? '.' : '。'}
    </p>
  )
  if (!withButton) return <div className={className}>{text}</div>
  return (
    <div className={`no-print rounded-2xl border border-line bg-surface-raised p-4 ${className ?? ''}`}>
      {text}
      <button
        type="button"
        onClick={() => authSignInGoogle('/dashboard')}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
      >
        <LogIn size={14} aria-hidden /> {en ? 'Sign in with Google' : '用 Google 登入'}
      </button>
    </div>
  )
}

export default function SignInNote({ className, withButton }: { className?: string; withButton?: boolean }) {
  if (!AUTH_ENABLED) return null
  return <Note className={className} withButton={withButton} />
}
