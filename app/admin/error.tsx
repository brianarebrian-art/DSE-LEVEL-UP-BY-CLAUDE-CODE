'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

// /admin 專屬路由錯誤邊界（中文單語內部工具，i18n-exempt 全檔適用）。
// 當 SSR 或客戶端渲染遇到非預期錯誤（例如損毀之草稿 JSON）時，保護後台不崩潰。
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
    Sentry.captureException(error)
  }, [error])

  return (
    <div role="alert" className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface-raised p-6 text-center text-ink-soft">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-medium text-ink focus:outline-none"
        >
          內容審核面板載入失敗{/* i18n-exempt: admin 內部工具，只限創辦人 */}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          讀取草稿批次或審核紀錄時發生非預期錯誤。已將此異常回報至 Sentry。{/* i18n-exempt: admin 內部工具，只限創辦人 */}
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-xs text-ink-muted">
            錯誤編號: {error.digest}{/* i18n-exempt: admin 內部工具，只限創辦人 */}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            重試{/* i18n-exempt: admin 內部工具，只限創辦人 */}
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line-strong px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent"
          >
            返回首頁{/* i18n-exempt: admin 內部工具，只限創辦人 */}
          </Link>
        </div>
      </div>
    </div>
  )
}
