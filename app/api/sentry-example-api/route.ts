import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'SentryExampleAPIError'
  }
}

/**
 * Dev-only smoke route that throws so server-side Sentry capture can be verified.
 * Production returns 404 — a public intentional-500 endpoint is abuse and noise.
 */
export function GET() {
  if (process.env.NODE_ENV === 'production') notFound()
  throw new SentryExampleAPIError('Sentry Example API Route Error')
  return NextResponse.json({ data: 'Testing Sentry Error...' })
}
