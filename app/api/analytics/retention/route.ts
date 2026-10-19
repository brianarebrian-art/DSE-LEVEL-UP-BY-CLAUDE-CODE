import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

const EVENTS = new Set([
  'homepage_viewed',
  'short_practice_started',
  'short_practice_completed',
  'question_report_opened',
  'question_report_submitted',
  'privacy_choice_selected',
  'teacher_badge_seen',
])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object' || !EVENTS.has(body.name) || typeof body.anonymousId !== 'string') {
      return NextResponse.json({ error: 'invalid event' }, { status: 400 })
    }
    const payload = {
      event_name: body.name,
      anonymous_id: body.anonymousId.slice(0, 80),
      subject: typeof body.subject === 'string' ? body.subject.slice(0, 80) : null,
      variant: typeof body.variant === 'string' ? body.variant : null,
      occurred_at: typeof body.occurredAt === 'string' ? body.occurredAt : new Date().toISOString(),
    }
    const { error } = await getServiceSupabase().from('retention_events').insert(payload)
    if (error) {
      safeLog('error', 'api/analytics/retention insert', error)
      return NextResponse.json({ ok: false }, { status: 202 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    safeLog('error', 'api/analytics/retention', error)
    return NextResponse.json({ ok: false }, { status: 202 })
  }
}
