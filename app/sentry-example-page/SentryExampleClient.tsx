'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryExampleClient() {
  const [serverResult, setServerResult] = useState<string | null>(null)

  return (
    <main style={{ maxWidth: 560, margin: '4rem auto', padding: '0 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sentry example</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        Development only. Click a button to send a test error to project <code>javascript-nextjs</code>, then
        check Issues in Sentry.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => {
            // Same trigger as Sentry's Next.js verify docs — must run in-app, not the browser console.
            // @ts-expect-error intentional missing function for Sentry smoke test
            myUndefinedFunction()
          }}
          style={buttonStyle}
        >
          Throw sample error (client)
        </button>

        <button
          type="button"
          onClick={async () => {
            Sentry.startSpan({ name: 'Example Frontend Span', op: 'test' }, async () => {
              const res = await fetch('/api/sentry-example-api')
              setServerResult(res.ok ? 'Unexpected success' : `Server responded ${res.status}`)
            })
          }}
          style={buttonStyle}
        >
          Throw sample error (server)
        </button>
      </div>

      {serverResult ? (
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>{serverResult}</p>
      ) : null}
    </main>
  )
}

const buttonStyle = {
  background: '#f59e0b',
  color: '#000',
  fontWeight: 700,
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left' as const,
}
