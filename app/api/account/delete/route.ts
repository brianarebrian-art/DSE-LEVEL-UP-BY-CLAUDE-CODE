import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { USER_SCOPED_TABLES } from '@/lib/privacy/userData'

// PDPO erasure right — the signed-in user deletes their OWN server-side data. Scoped
// entirely to the caller's id (never another user's). Server-side data = cloud progress
// = every table in USER_SCOPED_TABLES (lib/privacy/userData.ts). Requires an explicit
// { confirm: true } to avoid misfires.
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
    // Every table keyed on the caller's id — driven off the single registry in
    // lib/privacy/userData.ts so that adding a new user-scoped table without adding
    // it here fails lib/__tests__/user-data-erasure.test.mts. Before 2026-08-20 this
    // route hard-coded two tables and silently left user_settings / wall_posts behind.
    //
    // Tables that no longer exist (e.g. user_sessions once 0010 is applied) are a
    // tolerated no-op: supabase-js returns an error rather than throwing, and we do
    // NOT fail the erasure on it — a partial failure must not block the rest.
    const failed: string[] = []
    for (const table of USER_SCOPED_TABLES) {
      const { error } = await supabase.from(table).delete().eq('user_id', userId)
      // 42P01 = undefined_table（表已 drop）→ 當作已清走，唔算失敗。
      if (error && error.code !== '42P01') failed.push(table)
    }
    if (failed.length > 0) {
      // 講真話：唔可以喺有嘢刪唔到嘅情況下回 ok。用戶要知道要跟進。
      safeLog('error', 'api/account/delete partial', { failed })
      return NextResponse.json({ error: 'partial', tables: failed }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/account/delete', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
