import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// PDPO erasure right — the signed-in user deletes their OWN server-side data. Scoped
// entirely to the caller's id (never another user's). Server-side data = cloud progress
// (user_progress) + the profiles row if one exists (legacy; harmless no-op otherwise —
// supabase-js returns errors rather than throwing, and we deliberately don't fail the
// erasure on it). Requires an explicit { confirm: true } to avoid misfires.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { confirm?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  if (body.confirm !== true) {
    return NextResponse.json({ error: 'confirmation required' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    // Cloud progress (standalone table, no cascade).
    await supabase.from('user_progress').delete().eq('user_id', userId)
    // Legacy profiles row (if the table exists) — tolerated as a no-op otherwise.
    await supabase.from('profiles').delete().eq('user_id', userId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/account/delete', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
