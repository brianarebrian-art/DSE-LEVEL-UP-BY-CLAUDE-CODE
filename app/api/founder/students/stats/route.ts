import { NextResponse } from 'next/server'
import { requireFounderApi, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { founderCacheHeaders } from '@/lib/founder/env'
import { writeFounderAudit } from '@/lib/founder/audit'
import { loadPlatformOverview } from '@/lib/founder/metrics'

export const dynamic = 'force-dynamic'

/**
 * Founder-only 學生聚合。唔返回逐人身份／逐題答案（憲章 §16.E）。
 * 授權用 requireFounderApi()，唔依賴 ADMIN_EMAILS。
 */
export async function GET() {
  const founder = await requireFounderApi()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), { status: 403, headers: founderCacheHeaders() })
  }

  await writeFounderAudit({
    actor: founder,
    action: 'students.stats.read',
    targetType: 'user_progress_aggregate',
    result: 'ok',
    summary: 'Founder requested aggregate student stats',
  })

  const overview = await loadPlatformOverview()
  return NextResponse.json(
    {
      scope: 'aggregate_only',
      charterNote: '§16.E：無逐人身份、無逐題答案、無排名',
      metrics: overview.metrics,
      subjectNodes: overview.subjectNodes.map((n) => ({
        id: n.id,
        name: n.name,
        questionCount: n.questionCount,
        sessions30d: n.sessions30d,
      })),
      notComputable: overview.notComputable,
      updatedAt: overview.updatedAt,
    },
    { headers: founderCacheHeaders() },
  )
}
