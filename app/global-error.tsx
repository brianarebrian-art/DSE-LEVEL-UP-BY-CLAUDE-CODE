'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

// Global error boundary — the last line before Next's built-in error screen. In
// production Next already strips stack traces from the client (only a `digest` is
// sent), but this guarantees users see an on-brand, detail-free page and a recovery
// action instead of a bare framework fallback. Must render its own <html>/<body>.
// Nielsen H9／H3：淺白雙語、具體下一步（再試／返主頁）；唔用 emoji／深藍科技風。
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="zh-HK">
      <body
        style={{
          margin: 0,
          background: '#F4F0EA',
          color: '#2C2A29',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '22rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 600, margin: '0 0 0.75rem' }}>
              暫時載唔到呢頁 · Something went wrong
              {/* i18n-exempt: 全域錯誤邊界喺 LanguageProvider 之外，讀唔到 locale，故雙語靜態 */}
            </h1>
            <p style={{ color: '#6B6560', margin: '0 0 1.5rem', fontSize: '0.875rem', lineHeight: 1.55 }}>
              問題已記錄。你可以再試一次，或者返主頁繼續。 We’ve logged it — try again, or go home.
              {/* i18n-exempt: 錯誤邊界喺 Provider 外，雙語靜態 */}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  background: '#7A9E7E',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '2.75rem',
                }}
              >
                再試一次 · Try again
                {/* i18n-exempt: 錯誤邊界喺 Provider 外，雙語靜態 */}
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFDF9',
                  color: '#2C2A29',
                  fontWeight: 500,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #D4CFC6',
                  textDecoration: 'none',
                  minHeight: '2.75rem',
                }}
              >
                返主頁 · Home
                {/* i18n-exempt: 錯誤邊界喺 Provider 外，雙語靜態 */}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
