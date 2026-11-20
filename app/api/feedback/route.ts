import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { insertOnlyIfSignedIn, signedInsertHttp } from '@/lib/api/signedWrite'
import { getSyncUserId } from '@/lib/auth/server'
import { parseFeedback, toFeedbackRow } from '@/lib/sessionFeedback'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// POST /api/feedback — one answer to the post-session questions (founders' reply 5a, 2026-10-04).
//
// 2026-11-20: a Supabase Auth session is required. Unsigned requests return 401 and do not
// insert. The stored row is still only subject, question, answer and interface language.
// The user id is a gate, not a column. No IP address or user agent is read.
// Abuse is limited per IP in proxy.ts (in memory only). The card shows the saved
// "thank you" only on { ok: true }; a missing table answers 503.

export const dynamic = 'force-dynamic'

const TABLE = 'session_feedback'

export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const parsed = parseFeedback(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const outcome = await insertOnlyIfSignedIn(userId, toFeedbackRow(parsed.value), async (row) => {
      const { error } = await getServiceSupabase().from(TABLE).insert(row)
      if (error) safeLog('error', 'api/feedback insert', error)
      return { error }
    })
    const http = signedInsertHttp(outcome)
    return NextResponse.json(http.body, { status: http.status })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or constraints.
    safeLog('error', 'api/feedback', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
