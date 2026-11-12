import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { parsePracticeCount, toRpcArgs, PRACTICE_COUNTS_ENABLED } from '@/lib/practiceCount'
import {
  hongKongCalendarDay,
  readPracticeWebhookConfig,
  sumCompletedSessions,
  wakeIfFirstCompletionToday,
} from '@/lib/practiceDataWebhook'
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
//
// Optional wake (lib/practiceDataWebhook.ts): after a stored `completed` bump, if
// PRACTICE_DATA_WEBHOOK_URL and PRACTICE_DATA_WEBHOOK_KEY are both set, POST once
// per Hong Kong calendar day. Unset env does nothing. A failed POST does not
// change this response. The body names the day only — no account, question, or email.

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
    const supabase = getServiceSupabase()
    // Only a finished set can wake, and only when the operator has configured
    // the destination. Started events, and every request while env is unset,
    // skip the extra read.
    const webhook = parsed.value.event === 'completed' ? readPracticeWebhookConfig() : null
    let priorCompletedSessions: number | null = null
    let day = ''
    if (webhook) {
      day = hongKongCalendarDay(new Date())
      priorCompletedSessions = await readPriorCompletedSessions(supabase, day)
    }

    const { error } = await supabase.rpc(FN, toRpcArgs(parsed.value))
    if (error) {
      // PGRST202 / 42883: the function does not exist yet (migration not applied).
      const missing = error.code === 'PGRST202' || error.code === '42883'
      safeLog('error', 'api/practice-count rpc', error)
      return NextResponse.json({ error: missing ? 'unavailable' : 'internal error' }, { status: missing ? 503 : 500 })
    }

    if (webhook) {
      try {
        const outcome = await wakeIfFirstCompletionToday({
          event: 'completed',
          priorCompletedSessions,
          day,
          config: webhook,
        })
        if (outcome === 'failed') safeLog('warn', 'api/practice-count wake', 'post failed')
      } catch (e) {
        // The count is already stored. Never turn a wake failure into a student error.
        safeLog('warn', 'api/practice-count wake', e)
      }
    }
    return NextResponse.json({ ok: true, counted: true })
  } catch (e) {
    // Never echo the raw error: a Postgres message can name tables, columns or functions.
    safeLog('error', 'api/practice-count', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// Service role only. The JSON response never includes this total.
async function readPriorCompletedSessions(
  supabase: ReturnType<typeof getServiceSupabase>,
  day: string,
): Promise<number | null> {
  if (!day) return null
  try {
    const { data, error } = await supabase
      .from('practice_counts')
      .select('sessions')
      .eq('day', day)
      .eq('event', 'completed')
    if (error) {
      safeLog('warn', 'api/practice-count wake-read', 'count read failed')
      return null
    }
    return sumCompletedSessions(data)
  } catch (e) {
    safeLog('warn', 'api/practice-count wake-read', e)
    return null
  }
}
