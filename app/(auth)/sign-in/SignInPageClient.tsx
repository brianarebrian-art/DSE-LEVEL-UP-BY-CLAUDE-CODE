'use client'

import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function SignInPageClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const params = useSearchParams()
  const err = params.get('error')

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">
          {en ? 'Sign in' : '登入'}
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          {en
            ? 'Sign in once with Google to sync progress across devices. Still 100% free — sign-in never unlocks paid content. Practice without signing in keeps progress only until you leave this page.'
            : '用 Google 登入一次就可以跨裝置同步進度。仍然 100% 免費 —— 登入唔會解鎖任何付費內容。未登入練習嘅進度只喺呢次瀏覽有效，離開頁面就會消失。'}
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
      </div>
    </div>
  )
}
