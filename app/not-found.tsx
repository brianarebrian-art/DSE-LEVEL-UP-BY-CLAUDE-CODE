'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// Custom 404 — replaces Next's default so no framework/version detail is implied,
// and the user always has a way back. Client component so text follows the language toggle.
export default function NotFound() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-6xl mb-4" aria-hidden>🧭</div>
        <h1 className="text-2xl font-extrabold mb-2">{en ? 'Page not found' : '搵唔到呢一頁'}</h1>
        {/* light-first 遷移漏網：text-slate-400 落 #FAFAF8 只有 2.52:1，未過 AA。 */}
        <p className="text-ink-muted mb-6 text-sm">
          {en ? 'The link may have changed, or the address was mistyped.' : '連結可能已經改咗，或者你打錯咗網址。'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-bold px-5 py-2.5 rounded-xl transition-all"
        >
          {en ? 'Back to home' : '返回首頁'}
        </Link>
      </div>
    </div>
  )
}
