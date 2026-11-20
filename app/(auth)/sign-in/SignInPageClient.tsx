'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function SignInPageClient({ error }: { error?: string | null }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const err = error || null

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">
          {en ? 'Sign in' : '登入'}
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          {en
            ? 'Sign in once with Google to sync progress across devices and keep practising after the free trial set. Still 100% free — sign-in never unlocks paid content. Without signing in you can finish one practice set; progress stays on this device only.'
            : '用 Google 登入一次就可以跨裝置同步進度，並喺免費試用額度之後繼續練習。仍然 100% 免費 —— 登入唔會解鎖任何付費內容。未登入最多可完成一節練習；進度只留喺呢部機。'}
        </p>

        <p className="text-xs text-ink-muted mb-4">
          {en
            ? 'If you opened this inside Instagram, Facebook, WeChat or LINE, use your system browser (Safari / Chrome) to sign in.'
            : '若你喺 Instagram、Facebook、WeChat 或 LINE 內置瀏覽器打開，請改用系統瀏覽器（Safari／Chrome）登入。'}
        </p>

        {err && (
          <p className="text-sm text-rose mb-3" role="alert">
            {err === 'cancelled'
              ? en
                ? 'Sign-in was cancelled. You can still practise without an account.'
                : '已取消登入。你仍然可以唔登入繼續練習。'
              : en
                ? 'Google sign-in failed. Please try again, or practise without signing in.'
                : 'Google 登入失敗。請再試，或者唔登入繼續練習。'}
          </p>
        )}

        <GoogleSignInButton next="/dashboard?sync=ok" />

        <p className="text-sm text-ink-muted mt-4 text-center">
          {en ? 'New here? ' : '第一次嚟？'}
          <Link href="/sign-up" className="text-accent hover:underline">
            {en ? 'Create account' : '建立帳戶'}
          </Link>
        </p>
      </div>
    </div>
  )
}
