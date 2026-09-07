'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// Custom 404 — replaces Next's default so no framework/version detail is implied,
// and the user always has a way back. Client component so text follows the language toggle.
//
// 2026-09-05：加咗 /sitemap.xml 同 /llms.txt 兩條連結。
// 個 status code 本身一直係真 404（實測 /some-path-that-does-not-exist → 404），
// 所以爬蟲同 agent 唔會當每條路徑都存在。但一個【只有「返回首頁」】嘅 404，
// 對一個行錯咗路嘅 agent 嚟講係死胡同 —— 佢知道呢頁唔存在，但唔知邊啲存在。
// 兩條連結成本近乎零，而且對人一樣有用（sitemap 係全站目錄）。
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
