'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useAuthSession } from '@/lib/auth/session'
import { loadAttempts } from '@/lib/progress'
import { loadActiveSession } from '@/lib/sessionResume'

const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

/** 學生已睇過解析（練習頁寫入，唔上雲）。 */
export const SEEN_EXPLANATION_KEY = 'dse_seen_explanation'

/**
 * 登入說明只喺學生已經攞到價值之後先出：做完一節、揭曉過解析，
 * 或者未做完但已經答過至少一題。開站第一屏唔出。
 */
export function practiceValueEarned(): boolean {
  if (typeof window === 'undefined') return false
  if (loadAttempts().length > 0) return true
  const session = loadActiveSession()
  if (session?.answers.some((a) => a != null)) return true
  try {
    if (sessionStorage.getItem(SEEN_EXPLANATION_KEY) === '1') return true
    const raw = localStorage.getItem('dse_result')
    if (!raw || raw === 'null') return false
    const parsed = JSON.parse(raw) as { total?: unknown }
    return typeof parsed?.total === 'number' && parsed.total > 0
  } catch {
    return false
  }
}

// 登入前的同步說明（audit loop T39；創辦人 2026-10-03 回覆 Q-T39：要短、講明係可選）。
// 擺喺登入掣附近，唔係彈窗。完整同步清單同刪除方法交由私隱頁，呢度只放連結，
// 所以唔會同私隱頁分叉。`withButton`：練習完成後（結果頁）先提示，附登入掣。
// P1.3：未練習、未見過解析之前唔渲染，避免第一屏變成註冊牆。
// G-A3：掣去 /sign-in（Google＋可選電郵），唔鎖死單一 OAuth。
function Note({ className, withButton }: { className?: string; withButton?: boolean }) {
  const { user, status } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
  const [earned, setEarned] = useState(false)

  useEffect(() => {
    const read = () => setEarned(practiceValueEarned())
    read()
    window.addEventListener('dse:practice-value', read)
    window.addEventListener('dse:progress-changed', read)
    return () => {
      window.removeEventListener('dse:practice-value', read)
      window.removeEventListener('dse:progress-changed', read)
    }
  }, [])

  if (status !== 'unauthenticated' || user || !earned) return null
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
      <Link
        href="/sign-in"
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-4 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <LogIn size={14} aria-hidden /> {en ? 'Sign in' : '去登入'}
      </Link>
    </div>
  )
}

export default function SignInNote({ className, withButton }: { className?: string; withButton?: boolean }) {
  if (!AUTH_ENABLED) return null
  return <Note className={className} withButton={withButton} />
}
