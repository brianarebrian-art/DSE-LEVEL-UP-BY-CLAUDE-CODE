import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parsePracticeCount, toRpcArgs, PRACTICE_COUNTS_ENABLED } from '@/lib/practiceCount'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// POST /api/practice-count — add one to today's count for a subject (founders' reply 40a,
// 2026-10-08; lib/practiceCount.ts). Stores no account, IP, device or time of day: the
// route never looks up the session, the IP address or the user agent. Abuse is limited per
// IP in proxy.ts (in memory only).
//
// Counts only on the production deployment, and only while PRACTICE_COUNTS_ENABLED is on;
// otherwise it answers { ok: true, counted: false } and touches nothing, so local and
// preview runs never write to the shared database.

export const dynamic = 'force-dynamic'

const FN = 'bump_practice_count'

export async function POST(request: Request) {
  if (!PRACTICE_COUNTS_ENABLED || process.env.VERCEL_ENV !== 'production') {
    return NextResponse.json({ ok: true, counted: false })
  }
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const parsed = parsePracticeCount(read.value)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const { error } = await getServiceSupabase().rpc(FN, toRpcArgs(parsed.value))
    if (error) {
      // PGRST202 / 42883: the function does not exist yet (migration not applied).
      const missing = error.code === 'PGRST202' || error.code === '42883'
      safeLog('error', 'api/practice-count rpc', error)
      return NextResponse.json({ error: missing ? 'unavailable' : 'internal error' }, { status: missing ? 503 : 500 })
    }
    return NextResponse.json({ ok: true, counted: true })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or functions.
    safeLog('error', 'api/practice-count', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
