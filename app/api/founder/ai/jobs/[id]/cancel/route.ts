import { NextResponse } from 'next/server'
import { requireFounderApi, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { assertSameOrigin } from '@/lib/founder/origin'
import { founderCacheHeaders } from '@/lib/founder/env'
import { writeFounderAudit } from '@/lib/founder/audit'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const founder = await requireFounderApi()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), { status: 403, headers: founderCacheHeaders() })
  }
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403, headers: founderCacheHeaders() })
  }
  const { id } = await ctx.params
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('founder_ai_jobs')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)
      .in('status', ['queued', 'running'])
      .select('id')
      .maybeSingle()
    if (error) throw error
    if (!data) {
      await writeFounderAudit({
        actor: founder,
        action: 'ai_job.cancel',
        targetType: 'ai_job',
        targetId: id,
        result: 'error',
        summary: 'Job not found or not cancellable',
      })
      return NextResponse.json({ error: 'not_found' }, { status: 404, headers: founderCacheHeaders() })
    }
    await writeFounderAudit({
      actor: founder,
      action: 'ai_job.cancel',
      targetType: 'ai_job',
      targetId: id,
      result: 'ok',
      summary: 'Cancelled AI job',
    })
    return NextResponse.json({ ok: true }, { headers: founderCacheHeaders() })
  } catch (e) {
    safeLog('error', 'ai job cancel failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: founderCacheHeaders() })
  }
}
