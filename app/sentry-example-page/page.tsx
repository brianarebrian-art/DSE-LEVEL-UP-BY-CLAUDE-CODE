import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SentryExampleClient from './SentryExampleClient'

/**
 * Dev-only smoke page for confirming Sentry captures client + server errors.
 * Production returns 404 — do not leave intentional error triggers publicly reachable.
 */
export const metadata: Metadata = {
  title: 'Sentry example (dev only)',
  robots: { index: false, follow: false },
}

export default function SentryExamplePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <SentryExampleClient />
}
