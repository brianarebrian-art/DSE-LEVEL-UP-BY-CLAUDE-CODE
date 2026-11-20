import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { insertOnlyIfSignedIn, signedInsertHttp } from '@/lib/api/signedWrite'
import { getSyncUserId } from '@/lib/auth/server'
import { parseReport, toRow } from '@/lib/questionReport'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// POST /api/report — a question problem report (audit #7, founders' reply "a", 2026-10-04).
//
// Stores only the question id, category and interface language (lib/questionReport.ts).
// 2026-11-20: a Supabase Auth session is required. Unsigned requests return 401 and do not
// insert. The user id is a gate, not a column, so a stored report still cannot be linked to
// a student. No IP address or user agent is read. Abuse is limited per IP in proxy.ts
// (in memory only, never written down).
//
// The button treats { error: 'unauthenticated' } as "not saved, please sign in", and any
// other non-{ ok: true } as "not sent" with email instead. If the table has not been
// created yet (migration 0020 not applied), the answer is 503 and the student is pointed
// to email, so a signed-in report is never silently lost.

export const dynamic = 'force-dynamic'

const TABLE = 'question_reports'

export async function POST(request: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const parsed = parseReport(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const outcome = await insertOnlyIfSignedIn(userId, toRow(parsed.value), async (row) => {
      const { error } = await getServiceSupabase().from(TABLE).insert(row)
      if (error) safeLog('error', 'api/report insert', error)
      return { error }
    })
    const http = signedInsertHttp(outcome)
    return NextResponse.json(http.body, { status: http.status })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or constraints.
    safeLog('error', 'api/report', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
