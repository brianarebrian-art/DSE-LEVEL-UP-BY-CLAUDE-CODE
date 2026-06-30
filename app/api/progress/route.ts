import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'

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
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// POST — upsert this user's progress snapshot. Body: { progress: <snapshot object> }.
export async function POST(request: Request) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { progress?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  if (body.progress == null || typeof body.progress !== 'object') {
    return NextResponse.json({ error: 'missing progress object' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const updated_at = new Date().toISOString()
    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { user_id: userId, progress_data: body.progress, updated_at },
        { onConflict: 'user_id' },
      )
    if (error) throw error
    return NextResponse.json({ ok: true, updated_at })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
