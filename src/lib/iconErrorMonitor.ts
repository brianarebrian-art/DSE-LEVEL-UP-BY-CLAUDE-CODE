/**
 * Icon Error Monitoring
 * Logs SVG rendering failures and missing assets to Sentry.
 */

import * as Sentry from '@sentry/nextjs'

export function logIconRenderError(iconName: string, error?: unknown): void {
  const message = `[IconError] Failed to render SVG icon: ${iconName}`
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error)
  }
  try {
    Sentry.captureMessage(message, {
      level: 'warning',
      tags: {
        component: 'Icon',
        iconName,
      },
      extra: {
        error: error instanceof Error ? error.message : String(error),
      },
    })
  } catch {
    // Sentry capture failsafe
  }
}
