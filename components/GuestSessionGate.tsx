'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { signInWithGoogle } from '@/lib/auth/google-auth'
import { GUEST_FREE_SESSION_QUESTIONS } from '@/lib/guestPracticeQuota'

/**
 * Shown when an unsigned visitor has used their one free practice set.
 * Cost control (Fluid Active CPU) — not a paid upgrade wall.
 */
export default function GuestSessionGate({ returnPath }: { returnPath: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-medium text-ink">
        {en ? 'You have finished the free trial set' : '你已完成免費試用額度'}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        {en
          ? `Without signing in you can complete one practice set of about ${GUEST_FREE_SESSION_QUESTIONS} questions. Sign in with Google to keep practising for free, sync progress across devices, and help us keep the site within its hosting budget.`
          : `未登入時最多可完成一節約 ${GUEST_FREE_SESSION_QUESTIONS} 題練習。登入 Google 帳戶後可繼續免費使用、保存進度，亦有助網站控制伺服器用量。`}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {en
          ? 'Still 100% free — sign-in never unlocks paid content.'
          : '仍然完全免費 —— 登入唔會解鎖任何付費內容。'}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => void signInWithGoogle(returnPath)}
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 text-sm font-medium text-on-accent hover:bg-accent-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {en ? 'Continue with Google' : '用 Google 繼續'}
        </button>
        <Link
          href="/subjects"
          className="inline-flex min-h-12 items-center px-3 text-sm text-accent underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {en ? 'Back to subjects' : '返回科目'}
        </Link>
      </div>
    </div>
  )
}
