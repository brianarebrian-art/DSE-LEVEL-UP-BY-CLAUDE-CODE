import * as Sentry from '@sentry/nextjs'
import { scrubSentryEvent } from '@/lib/sentry/scrubEvent'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn: dsn || undefined,
  enabled: process.env.VERCEL_ENV === 'production' && Boolean(dsn),
  sendDefaultPii: false,
  beforeSend: (event) => scrubSentryEvent(event),
  beforeSendTransaction: () => null,
  tracesSampleRate: 0,
  enableLogs: false,
})
