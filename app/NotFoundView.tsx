'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import Illustration from '@/src/components/ui/Illustration'

// Custom 404 body. The document title and robots tags live on the server
// not-found page so missing URLs are not published with the homepage metadata.
export default function NotFoundView() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="mb-4 flex justify-center text-warning" aria-hidden>
          <Illustration name="error-state" width={160} height={120} className="text-warning" />
        </div>
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

 <p className="mt-8 text-xs text-ink-muted">
          {en ? 'Looking for something specific?' : '想搵某一頁？'}
        </p>
 <p className="mt-1 text-xs">
 <a href="/sitemap.xml" className="min-h-11 inline-flex items-center px-2 text-accent hover:text-accent-hover hover:underline underline-offset-4">
            {en ? 'Every page (sitemap.xml)' : '全站頁面（sitemap.xml）'}
          </a>
 <span className="text-ink-faint" aria-hidden>·</span>
 <a href="/llms.txt" className="min-h-11 inline-flex items-center px-2 text-accent hover:text-accent-hover hover:underline underline-offset-4">
            {en ? 'What this site is (llms.txt)' : '呢個網站係咩（llms.txt）'}
          </a>
 </p>
 </div>
 </div>
  )
}
