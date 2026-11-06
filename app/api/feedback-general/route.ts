import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parseGeneralFeedback } from '@/lib/generalFeedback'
import { safeLog } from '@/lib/safeLog'
import { getServiceSupabase } from '@/utils/supabase/server'

// POST /api/feedback-general — anonymous scenario feedback from /feedback.
//
// Inserts `{ payload }` only. Does not read the session, cookies, IP, user agent
// or auth header. Identity keys in the body are dropped by parseGeneralFeedback.
// Logs a short error code, never the payload.

export const dynamic = 'force-dynamic'

const TABLE = 'general_feedback'

export async function POST(request: Request) {
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })

  const parsed = parseGeneralFeedback(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const { error } = await getServiceSupabase().from(TABLE).insert({ payload: parsed.value })
    if (error) {
      const missing = error.code === 'PGRST205' || error.code === '42P01'
      safeLog('error', 'api/feedback-general insert', error.code ?? 'insert failed')
      return NextResponse.json({ error: missing ? 'unavailable' : 'internal error' }, { status: missing ? 503 : 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/feedback-general', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
