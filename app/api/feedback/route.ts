import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parseFeedback, toFeedbackRow } from '@/lib/sessionFeedback'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// POST /api/feedback — one answer to the post-session questions (founders' reply 5a, 2026-10-04).
//
// Stores only subject, question, answer and interface language (lib/sessionFeedback.ts). No
// sign-in is read: the route never looks up the session, the IP address or the user agent.
// Abuse is limited per IP in proxy.ts (in memory only). The card shows "thank you" only on
// { ok: true }; a missing table answers 503.

export const dynamic = 'force-dynamic'

const TABLE = 'session_feedback'

export async function POST(request: Request) {
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const parsed = parseFeedback(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const { error } = await getServiceSupabase().from(TABLE).insert(toFeedbackRow(parsed.value))
    if (error) {
      // PGRST205 / 42P01: the table does not exist yet.
      const missing = error.code === 'PGRST205' || error.code === '42P01'
      safeLog('error', 'api/feedback insert', error)
      return NextResponse.json({ error: missing ? 'unavailable' : 'internal error' }, { status: missing ? 503 : 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or constraints.
    safeLog('error', 'api/feedback', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
