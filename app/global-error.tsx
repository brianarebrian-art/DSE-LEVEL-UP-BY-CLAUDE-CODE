'use client'

// Global error boundary — the last line before Next's built-in error screen. In
// production Next already strips stack traces from the client (only a `digest` is
// sent), but this guarantees users see an on-brand, detail-free page and a recovery
// action instead of a bare framework fallback. Must render its own <html>/<body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="zh-HK">
      <body style={{ background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>暫時出咗少少問題</h1>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              我哋已經記錄咗，麻煩你試多次。
            </p>
            <button
              onClick={() => reset()}
              style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer' }}
            >
              重新載入
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
