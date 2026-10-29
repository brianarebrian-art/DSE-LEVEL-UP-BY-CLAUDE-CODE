import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

const STATUSES = new Set([
  'open',
  'new',
  'triaged',
  'ai_drafted',
  'human_review',
  'fixed',
  'rejected',
])

/** GET — list open-ish question reports for admin triage. */
export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || 'open'
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 50)))

  try {
    const sb = getServiceSupabase()
    let q = sb
      .from('question_reports')
      .select('id, created_at, question_id, category, locale, status, priority_score, triaged_at, admin_note')
      .order('priority_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status === 'open') {
      q = q.in('status', ['open', 'new', 'triaged', 'ai_drafted', 'human_review'])
    } else if (STATUSES.has(status)) {
      q = q.eq('status', status)
    }

    const { data, error } = await q
    if (error) {
      safeLog('error', 'api/admin/reports GET', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }
    return NextResponse.json({ rows: data ?? [] })
  } catch (e) {
    safeLog('error', 'api/admin/reports GET', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

/** PATCH — update triage status / priority / admin note (never student free text). */
export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value as Record<string, unknown>
  const id = typeof body.id === 'number' ? body.id : Number(body.id)
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (typeof body.status === 'string' && STATUSES.has(body.status)) patch.status = body.status
  if (typeof body.priority_score === 'number' && body.priority_score >= 0 && body.priority_score <= 100) {
    patch.priority_score = Math.floor(body.priority_score)
  }
  if (typeof body.admin_note === 'string') patch.admin_note = body.admin_note.slice(0, 1000)
  if (body.status === 'triaged' || body.status === 'ai_drafted' || body.status === 'human_review') {
    patch.triaged_at = new Date().toISOString()
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'empty patch' }, { status: 400 })

  try {
    const { error } = await getServiceSupabase().from('question_reports').update(patch).eq('id', id)
    if (error) {
      safeLog('error', 'api/admin/reports PATCH', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/admin/reports PATCH', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
