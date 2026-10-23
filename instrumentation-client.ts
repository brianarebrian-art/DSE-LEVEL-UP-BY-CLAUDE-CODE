import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Session Replay is intentionally OFF until founders approve capture of UI
// that can show student answers / SEN settings on a 12–18 audience.
// Re-enable only with maskAllText + blockAllMedia and a documented decision.
Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  // No replayIntegration — do not record student screens by default.
  enableLogs: false,
  // Tag intentional smoke-test errors from the dev-only /sentry-example-page
  // so alerts and issue views can exclude them (smoke_test:true).
  beforeSend(event) {
    const url = event.request?.url ?? (typeof window !== 'undefined' ? window.location.href : '')
    if (url.includes('/sentry-example-page')) {
      event.tags = { ...event.tags, smoke_test: 'true' }
    }
    return event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
