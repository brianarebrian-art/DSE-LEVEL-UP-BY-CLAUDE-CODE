'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { signInErrorKind, SIGN_IN_ERROR_COPY } from '@/lib/auth/signInError'

export default function SignInErrorView() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const kind = signInErrorKind(useSearchParams().get('error'))
  const copy = SIGN_IN_ERROR_COPY[kind]

  return (
    <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-medium text-ink">{en ? 'Not signed in' : '未登入到'}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{en ? copy.en : copy.zh}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {en
          ? 'You can keep practising without signing in. Unsigned progress stays in this tab only; signing in syncs it across devices.'
          : '唔使登入都用得，照樣可以做題。未登入進度只留喺呢個分頁；登入之後先會跨機同步。'}
      </p>
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/subjects"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent-strong px-5 text-sm font-medium text-on-accent hover:bg-accent-hover"
        >
          {en ? 'Keep practising' : '返去練習'}
        </Link>
        {kind !== 'service' && (
          <div className="min-w-[12rem]">
            <GoogleSignInButton
              next="/dashboard"
              className="w-full min-h-12 rounded-xl border border-line-strong px-5 text-sm text-ink-soft hover:border-accent hover:text-accent bg-transparent font-medium inline-flex items-center justify-center gap-2"
            />
          </div>
        )}
      </div>
      {kind === 'service' && (
        <p className="mt-4 text-xs text-ink-muted">
          {en ? 'Try signing in again later. ' : '遲啲再試登入。'}
          <Link href="/trust" className="text-accent underline underline-offset-2">
            {en ? 'How your data is kept' : '你嘅資料點樣保存'}
          </Link>
        </p>
      )}
    </div>
  )
}
