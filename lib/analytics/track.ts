'use client'

import { ANALYTICS_EVENT_NAMES, type AnalyticsEventName, type AnalyticsPayload } from './events'

const ANON_KEY = 'dse_analytics_aid'
const ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_EVENTS !== 'false'

function getAnonymousId(): string {
  try {
    const existing = localStorage.getItem(ANON_KEY)
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 32)
        : `a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(ANON_KEY, id)
    return id
  } catch {
    return `ephemeral${Date.now().toString(36)}`.slice(0, 24)
  }
}

function coarsePlatform(): 'mobile' | 'desktop' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent || ''
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'mobile'
  if (ua) return 'desktop'
  return 'unknown'
}

/**
 * Fire-and-forget product event. Never throws into the learning UI.
 * Opt out: NEXT_PUBLIC_ANALYTICS_EVENTS=false
 */
export function trackEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (!ENABLED) return
  if (!(ANALYTICS_EVENT_NAMES as readonly string[]).includes(eventName)) return
  try {
    const body = {
      eventName,
      anonymousId: getAnonymousId(),
      platform: 'web' as const,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
      payload: { ...payload, platformHint: coarsePlatform() },
    }
    const json = JSON.stringify(body)
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const ok = navigator.sendBeacon('/api/analytics/event', new Blob([json], { type: 'application/json' }))
      if (ok) return
    }
    void fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {
      /* analytics must never break practice */
    })
  } catch {
    /* ignore */
  }
}
