import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { requireFounderApi, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { assertSameOrigin } from '@/lib/founder/origin'
import { founderCacheHeaders } from '@/lib/founder/env'
import { writeFounderAudit } from '@/lib/founder/audit'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

const STATUSES = ['open', 'fixed', 'rejected'] as const

/** 更新錯題回報狀態（持久化）。 */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const founder = await requireFounderApi()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), { status: 403, headers: founderCacheHeaders() })
  }
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: founderCacheHeaders() })
  }
  const { id } = await ctx.params
  const reportId = Number(id)
  if (!Number.isFinite(reportId) || reportId <= 0) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400, headers: founderCacheHeaders() })
  }
  const read = await readJsonLimited<{ status?: string }>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'bad_json' }, { status: read.status, headers: founderCacheHeaders() })
  }
  const status = read.value?.status
  if (typeof status !== 'string' || !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400, headers: founderCacheHeaders() })
  }
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('question_reports')
      .update({ status })
      .eq('id', reportId)
      .select('id, status')
      .maybeSingle()
    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: founderCacheHeaders() })
    }
    await writeFounderAudit({
      actor: founder,
      action: 'question_report.update_status',
      targetType: 'question_report',
      targetId: String(reportId),
      result: 'ok',
      summary: `status→${status}`,
    })
    return NextResponse.json({ ok: true, report: data }, { headers: founderCacheHeaders() })
  } catch (e) {
    safeLog('error', 'founder report patch failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: founderCacheHeaders() })
  }
}
