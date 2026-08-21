'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/i18n'

// 路由層錯誤邊界（App Router `error.tsx`）。
//
// ══ 點解要有呢一層 ══
// 之前全站【只有】`global-error.tsx`。佢係最後一道防線，要自己 render 成個
// `<html>`／`<body>` —— 即係話任何一頁 render 出錯，學生會失去成個外殼：
// 導航冇咗、語言切換冇咗、無障礙浮動掣冇咗，連返去邊度都冇路。
// 而且 global-error 喺 Provider 之外，讀唔到 locale，只能寫死雙語。
//
// 呢一層唔同：佢係 root layout 【之內】嘅邊界，出事時 layout（導航、頁尾、
// A11y 掣）照樣留喺畫面，locale 亦讀得到。學生失去嘅只係出事嗰一段內容。
//
// ══ 唔會 render error.message ══
// 生產環境下 Next 會把伺服器端錯誤訊息換成通用文字，但【客戶端】render 錯誤
// 嘅原訊息係會照樣送到瀏覽器嘅。原訊息可以帶住檔案路徑同內部結構，
// 故此同 `global-error.tsx` 一樣，一律唔展示，只展示 `digest`。
//
// ══ digest 唔係裝飾 ══
// 佢係 Next 為每個錯誤生成嘅識別碼。展示出嚟，學生報障時貼得返畀我哋，
// 我哋就對得返伺服器日誌。同題目勘誤入口一樣：唔淨係話「出咗事」，
// 而係畀返一條實際搵得到人嘅路。
const REPORT_EMAIL = 'dselevelup@gmail.com'

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const headingRef = useRef<HTMLHeadingElement>(null)

  // 出錯之後畫面內容整段換走，鍵盤／讀屏用戶原本嘅焦點已經唔存在。
  // 把焦點搬去標題，先至講得返「而家喺邊、可以做咩」。
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const mailto = (() => {
    const subject = en ? '[DSE Level Up] Page error' : '[DSE Level Up] 頁面出錯'
    const body = (
      en
        ? [
            `Page: ${typeof window === 'undefined' ? '' : window.location.pathname}`,
            `Error ID: ${error.digest ?? '(none)'}`,
            '',
            'What I was doing when it happened:',
            '',
          ]
        : [
            `出事嘅頁面：${typeof window === 'undefined' ? '' : window.location.pathname}`,
            `錯誤編號：${error.digest ?? '（冇）'}`, // i18n-exempt: 上面三元式已有英文版 'Error ID:'
            '',
            '出事嗰陣我喺度做緊：', // i18n-exempt: 對應 'What I was doing when it happened:'
            '',
          ]
    ).join('\n')
    return `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  })()

  return (
    <div role="alert" className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-medium text-ink focus:outline-none"
        >
          {en ? 'This page ran into a problem' : '呢一版出咗少少問題'}
        </h1>
        {/* 唔講「我哋已經記錄咗」—— 除非真係有 error tracking，否則嗰句係空頭支票。
            改為講學生實際做得到嘅嘢。 */}
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Your practice progress is stored on this device and is not affected. Try again — if it keeps happening, tell us and we will look at it.'
            : '你嘅練習紀錄存喺呢部裝置度，冇受影響。試多次先；如果一直都係咁，話我哋知，我哋會睇。'}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent-strong px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {en ? 'Try again' : '試多次'}
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line-strong px-5 text-sm text-ink-soft transition-colors hover:border-accent/40"
          >
            {en ? 'Back to home' : '返回首頁'}
          </Link>
        </div>

        {/* 錯誤編號 —— 貼得返畀我哋就對得返伺服器日誌。冇編號時唔留空位。 */}
        {error.digest && (
          <p className="mt-6 font-mono text-[11px] text-ink-muted">
            {en ? 'Error ID' : '錯誤編號'}: {error.digest}
          </p>
        )}
        <p className="mt-2 text-[11px] text-ink-muted">
          <a href={mailto} className="text-accent hover:underline">
            {en ? 'Tell us what happened' : '話我哋知發生咗咩事'}
          </a>
        </p>
      </div>
    </div>
  )
}
