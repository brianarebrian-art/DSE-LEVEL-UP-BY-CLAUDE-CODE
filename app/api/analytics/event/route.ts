import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parseAnalyticsEvent } from '@/lib/analytics/events'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

const TABLE = 'analytics_events'

/**
 * POST /api/analytics/event — privacy-minimised product events.
 * Client may send anonymousId; if a session exists we attach subject_key from getSyncUserId().
 * Never trusts client-supplied subjectKey for a different user.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })

  const parsed = parseAnalyticsEvent(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  let subjectKey = parsed.value.subjectKey
  try {
    const uid = await getSyncUserId()
    if (uid) subjectKey = uid
  } catch {
    /* keep anonymous */
  }

  if (!subjectKey && !parsed.value.anonymousId) {
    return NextResponse.json({ error: 'actor required' }, { status: 400 })
  }

  try {
    const { error } = await getServiceSupabase().from(TABLE).insert({
      event_name: parsed.value.eventName,
      subject_key: subjectKey,
      anonymous_id: parsed.value.anonymousId,
      platform: parsed.value.platform,
      app_version: parsed.value.appVersion,
      payload: parsed.value.payload,
    })
    if (error) {
      const missing = error.code === 'PGRST205' || error.code === '42P01'
      safeLog('error', 'api/analytics/event insert', error)
      // Soft-fail for clients: analytics must not block learning UX
      return NextResponse.json({ ok: false, error: missing ? 'unavailable' : 'internal' }, { status: missing ? 503 : 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/analytics/event', e)
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 })
  }
}
