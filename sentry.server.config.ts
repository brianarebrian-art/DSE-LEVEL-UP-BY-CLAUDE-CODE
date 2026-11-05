import * as Sentry from '@sentry/nextjs'
import { scrubSentryEvent } from '@/lib/logScrub'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  // PII stays off by SDK default; @sentry/nextjs@11.10.0 types omit sendDefaultPii.
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  // SEC-R1-002 / FIX-DSE-APP-002
  beforeSend(event) {
    return scrubSentryEvent(event)
  },
})
