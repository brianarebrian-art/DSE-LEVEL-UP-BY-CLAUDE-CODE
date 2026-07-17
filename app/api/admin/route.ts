import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// Admin 審核 API — 只服務 /admin 面板（ADMIN_EMAILS 白名單）。
// decisions 只寫入 Supabase（傳送層）；入庫仍然係本地 pull-decisions → promote。
export const dynamic = 'force-dynamic'

const TABLE = 'review_decisions'
const DECISIONS = ['approved', 'rejected', 'pending'] as const

// GET — 審核歷史（最新 200 筆）。
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .select('batch, draft_id, subject, topic, decision, comment, reviewer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return NextResponse.json({ decisions: data ?? [] })
  } catch (e) {
    safeLog('error', 'admin decisions GET failed', e)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}

// POST — 記錄一筆逐題決定。reviewer 一律取自 session（唔信 client 自報身份）。
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }
  const { batch, draft_id, subject, topic, decision, comment } = (body ?? {}) as Record<string, unknown>

  if (
    typeof batch !== 'string' || !batch.trim() ||
    typeof draft_id !== 'string' || !draft_id.trim() ||
    typeof subject !== 'string' || !subject.trim() ||
    typeof decision !== 'string' || !(DECISIONS as readonly string[]).includes(decision)
  ) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from(TABLE).insert({
      batch: batch.trim(),
      draft_id: draft_id.trim(),
      subject: subject.trim(),
      topic: typeof topic === 'string' ? topic.slice(0, 200) : null,
      decision,
      comment: typeof comment === 'string' && comment.trim() ? comment.slice(0, 1000) : null,
      reviewer_email: admin.email,
      reviewer_name: admin.name,
    })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'admin decisions POST failed', e)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }
}
