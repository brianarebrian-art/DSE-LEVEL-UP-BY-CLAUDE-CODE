import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { insertOnlyIfSignedIn, signedInsertHttp } from '@/lib/api/signedWrite'
import { getSyncUserId } from '@/lib/auth/server'
import { parseGeneralFeedback } from '@/lib/generalFeedback'
import { safeLog } from '@/lib/safeLog'
import { getServiceSupabase } from '@/utils/supabase/server'

// POST /api/feedback-general — scenario feedback from /feedback.
//
// 2026-11-20: a Supabase Auth session is required. Unsigned requests return 401 and do not
// insert. Inserts `{ payload }` only. The user id is a gate, not part of the payload.
// Identity keys in the body are dropped by parseGeneralFeedback. Does not read IP or
// user agent. Logs a short error code, never the payload.

export const dynamic = 'force-dynamic'

const TABLE = 'general_feedback'

export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })

  const parsed = parseGeneralFeedback(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const outcome = await insertOnlyIfSignedIn(userId, { payload: parsed.value }, async (row) => {
      const { error } = await getServiceSupabase().from(TABLE).insert(row)
      if (error) safeLog('error', 'api/feedback-general insert', error.code ?? 'insert failed')
      return { error }
    })
    const http = signedInsertHttp(outcome)
    return NextResponse.json(http.body, { status: http.status })
  } catch (e) {
    safeLog('error', 'api/feedback-general', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
