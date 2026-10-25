import * as Sentry from '@sentry/nextjs'
import { scrubSentryEvent } from '@/lib/sentry/scrubEvent'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  sendDefaultPii: false,
  beforeSend: (event) => scrubSentryEvent(event),
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  enableLogs: false,
})
