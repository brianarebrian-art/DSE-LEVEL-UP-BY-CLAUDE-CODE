import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// 影子溫書室 · 真人審核 API —— 只限 ADMIN_EMAILS 白名單（兩位創辦人）。
//   GET  — 待審 queue（最舊在前，清 backlog 用）。
//   POST — 對一條帖落決定 approved / rejected。reviewer 一律取自 session，唔信 client。
// 呢個係 minor UGC 出街嘅【唯一】閘：冇任何自動路徑令帖由 pending 變 approved。
export const dynamic = 'force-dynamic'

const DECISIONS = ['approved', 'rejected'] as const

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const supabase = getServiceSupabase()
    const { data: pending, error } = await supabase
      .from('wall_posts')
      .select('id, author_hash, content, tags, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }) // 最舊先審
      .limit(100)
    if (error) throw error

    // 今日已處理數（approved + rejected，moderated_at 喺過去 24h）——俾後台一個進度感。
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const { count: doneToday } = await supabase
      .from('wall_posts')
      .select('id', { count: 'exact', head: true })
      .neq('status', 'pending')
      .gte('moderated_at', since)

    return NextResponse.json({ pending: pending ?? [], doneToday: doneToday ?? 0 })
  } catch (e) {
    safeLog('error', 'api/wall/moderate GET', e)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: { id?: unknown; decision?: unknown; note?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }
  const id = typeof body.id === 'string' ? body.id : ''
  const decision = typeof body.decision === 'string' ? body.decision : ''
  if (!id || !(DECISIONS as readonly string[]).includes(decision)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  const note = typeof body.note === 'string' && body.note.trim() ? body.note.slice(0, 500) : null

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from('wall_posts')
      .update({
        status: decision,
        moderator_email: admin.email,
        moderator_note: note,
        moderated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'pending') // 只可以審仲喺 pending 嘅帖（防重複/覆寫已審）
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/wall/moderate POST', e)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
