'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

/** Sign-up is Google-only after the Supabase Auth rebuild (no email/password). */
export default function SignUpPageClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-surface-raised border border-line rounded-2xl p-6">
        <h1 className="text-xl font-bold text-ink mb-1">
          {en ? 'Create account' : '建立帳戶'}
        </h1>
        <p className="text-sm text-ink-muted mb-5">
          {en
            ? 'Create a free account with Google to sync progress across devices. If you used Google before, we map your old progress on first sign-in.'
            : '用 Google 建立免費帳戶，跨裝置同步進度。以前用過 Google 嘅進度會喺首次登入時對應過來。'}
        </p>

        <p className="text-xs text-ink-muted mb-4">
          {en
            ? 'If you opened this inside Instagram, Facebook, WeChat or LINE, use your system browser (Safari / Chrome) to sign in.'
            : '若你喺 Instagram、Facebook、WeChat 或 LINE 內置瀏覽器打開，請改用系統瀏覽器（Safari／Chrome）登入。'}
        </p>

        <GoogleSignInButton next="/dashboard?sync=ok" />

        <p className="text-sm text-ink-muted mt-4 text-center">
          {en ? 'Already have an account? ' : '已有帳戶？'}
          <Link href="/sign-in" className="text-accent hover:underline">
            {en ? 'Sign in' : '登入'}
          </Link>
        </p>
      </div>
    </div>
  )
}
