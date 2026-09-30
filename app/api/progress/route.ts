import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { CLOUD_PROGRESS_KEYS } from '@/lib/cloudKeys'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// Per-user, request-time only — never cached or prerendered.
export const dynamic = 'force-dynamic'

const TABLE = 'user_progress'

// Identity is resolved by the backend-agnostic helper (Auth.js today, Better Auth once
// flipped). It returns the stable Google `sub` either way, so the row key — and thus
// every user's existing synced progress — is preserved across the cutover.
async function currentUserId(): Promise<string | null> {
  return getSyncUserId()
}

// GET — pull this user's cloud progress (null if they have none yet).
export async function GET() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .select('progress_data, updated_at')
      .eq('user_id', userId) // ownership enforced here (service role bypasses RLS)
      .maybeSingle()
    if (error) throw error
    return NextResponse.json({
      progress: data?.progress_data ?? null,
      updated_at: data?.updated_at ?? null,
    })
  } catch (e) {
    // Never echo the raw error to the client — a Supabase/Postgres message can leak
    // table/column names or constraint details. Log server-side, return a generic body.
    safeLog('error', 'api/progress GET', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

// POST — upsert this user's progress snapshot. Body: { progress: <snapshot object> }.
export async function POST(request: Request) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const read = await readJsonLimited<{ progress?: unknown }>(request, BODY_LIMIT.progress)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value
  if (body?.progress == null || typeof body.progress !== 'object' || Array.isArray(body.progress)) {
    return NextResponse.json({ error: 'missing progress object' }, { status: 400 })
  }
  // Server-side allow-list (charter §16.E): only the approved keys are stored, whatever the
  // client sends. The browser already sends only these; this makes the promise hold even for
  // a modified client. updatedAt / syncedAt are bookkeeping the merge needs.
  const allowed = new Set<string>([...CLOUD_PROGRESS_KEYS, 'updatedAt', 'syncedAt'])
  const progress = Object.fromEntries(
    Object.entries(body.progress as Record<string, unknown>).filter(([k]) => allowed.has(k)),
  )

  try {
    const supabase = getServiceSupabase()
    const updated_at = new Date().toISOString()
    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { user_id: userId, progress_data: progress, updated_at },
        { onConflict: 'user_id' },
      )
    if (error) throw error
    return NextResponse.json({ ok: true, updated_at })
  } catch (e) {
    safeLog('error', 'api/progress POST', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
