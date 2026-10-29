import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { createHash } from 'node:crypto'

export const dynamic = 'force-dynamic'

const STATUSES = new Set(['ai_drafted', 'human_review', 'approved', 'rejected', 'published'])

function hashReviewerIdentity(value: string | null | undefined): string | null {
  if (!value) return null
  const normalized = String(value).trim().toLowerCase()
  if (!normalized) return null
  return createHash('sha256').update(normalized).digest('hex').slice(0, 32)
}

/** GET — AI draft / human review queue. */
export async function GET(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const status = new URL(request.url).searchParams.get('status') || 'queue'

  try {
    const sb = getServiceSupabase()
    let q = sb
      .from('question_revisions')
      .select(
        'id, created_at, question_id, source_report_id, revision_status, ai_confidence, change_summary, diff_json, reviewed_at',
      )
      .order('created_at', { ascending: false })
      .limit(50)
    if (status === 'queue') q = q.in('revision_status', ['ai_drafted', 'human_review'])
    else if (STATUSES.has(status)) q = q.eq('revision_status', status)
    const { data, error } = await q
    if (error) {
      safeLog('error', 'api/admin/revisions GET', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }
    return NextResponse.json({ rows: data ?? [] })
  } catch (e) {
    safeLog('error', 'api/admin/revisions GET', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

/**
 * POST — create an AI-assisted draft revision (always starts as ai_drafted / human_review).
 * Never sets published. Human must approve separately.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const b = read.value as Record<string, unknown>

  const questionId = typeof b.questionId === 'string' ? b.questionId.slice(0, 100) : ''
  const changeSummary = typeof b.changeSummary === 'string' ? b.changeSummary.trim().slice(0, 2000) : ''
  if (!questionId || changeSummary.length < 1) {
    return NextResponse.json({ error: 'questionId and changeSummary required' }, { status: 400 })
  }

  const revisionStatus =
    b.revisionStatus === 'human_review' ? 'human_review' : 'ai_drafted'
  const aiConfidence =
    typeof b.aiConfidence === 'number' && b.aiConfidence >= 0 && b.aiConfidence <= 1
      ? b.aiConfidence
      : null
  const sourceReportId =
    typeof b.sourceReportId === 'number' && Number.isInteger(b.sourceReportId)
      ? b.sourceReportId
      : null
  const diffJson =
    b.diffJson && typeof b.diffJson === 'object' && !Array.isArray(b.diffJson) ? b.diffJson : {}

  try {
    const { data, error } = await getServiceSupabase()
      .from('question_revisions')
      .insert({
        question_id: questionId,
        source_report_id: sourceReportId,
        revision_status: revisionStatus,
        ai_confidence: aiConfidence,
        change_summary: changeSummary,
        diff_json: diffJson,
      })
      .select('id')
      .maybeSingle()
    if (error) {
      safeLog('error', 'api/admin/revisions POST', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    safeLog('error', 'api/admin/revisions POST', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

/** PATCH — human approve / reject. Published requires explicit approve path + reviewed_at. */
export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const b = read.value as Record<string, unknown>
  const id = typeof b.id === 'string' ? b.id : ''
  const decision = b.decision
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  if (decision !== 'approve' && decision !== 'reject' && decision !== 'human_review') {
    return NextResponse.json({ error: 'invalid decision' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {
    reviewer_email_hash: hashReviewerIdentity(admin.email),
    reviewed_at: new Date().toISOString(),
  }
  if (decision === 'approve') patch.revision_status = 'approved'
  else if (decision === 'reject') patch.revision_status = 'rejected'
  else patch.revision_status = 'human_review'

  try {
    const { error } = await getServiceSupabase().from('question_revisions').update(patch).eq('id', id)
    if (error) {
      safeLog('error', 'api/admin/revisions PATCH', error)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'api/admin/revisions PATCH', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
