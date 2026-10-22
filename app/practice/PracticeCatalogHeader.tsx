'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * 練習頁上方題庫導覽。有 `?subject=` 時改為 sr-only：學生首屏見題目，
 * 內容仍留喺 DOM 畀讀屏／誠實說明；無參數時可見（揀科入口）。
 * 頁面本身維持 noindex —— 公開索引靠 /subjects。
 */
function CatalogBody({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useSearchParams()
  const inSession = Boolean(params.get('subject'))
  return (
    <header
      className={
        inSession
          ? 'sr-only'
          : 'mx-auto max-w-4xl px-4 pt-8 pb-4 border-b border-line mb-2'
      }
    >
      {children}
    </header>
  )
}

export default function PracticeCatalogHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <header className="mx-auto max-w-4xl px-4 pt-8 pb-4 border-b border-line mb-2">
          {children}
        </header>
      }
    >
      <CatalogBody>{children}</CatalogBody>
    </Suspense>
  )
}
