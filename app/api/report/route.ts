import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parseReport, toRow } from '@/lib/questionReport'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// POST /api/report — a question problem report (audit #7, founders' reply "a", 2026-10-04).
//
// Stores only the question id, category and interface language (lib/questionReport.ts).
// No sign-in is needed and none is read: the route never looks up the session, the IP address
// or the user agent, so a report cannot be linked to a student. Abuse is limited per IP in
// proxy.ts (in memory only, never written down).
//
// The button treats anything other than { ok: true } as "not sent" and offers email instead.
// If the table has not been created yet (migration 0020 not applied), the answer is 503 and
// the student is pointed to email, so a report is never silently lost.

export const dynamic = 'force-dynamic'

const TABLE = 'question_reports'

export async function POST(request: Request) {
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const parsed = parseReport(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const { error } = await getServiceSupabase().from(TABLE).insert(toRow(parsed.value))
    if (error) {
      // PGRST205 / 42P01: the table does not exist yet.
      const missing = error.code === 'PGRST205' || error.code === '42P01'
      safeLog('error', 'api/report insert', error)
      return NextResponse.json({ error: missing ? 'unavailable' : 'internal error' }, { status: missing ? 503 : 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or constraints.
    safeLog('error', 'api/report', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
