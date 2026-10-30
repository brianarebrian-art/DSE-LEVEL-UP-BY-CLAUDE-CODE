import { NextResponse } from 'next/server'
import { requireFounderApi, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { loadPlatformOverview } from '@/lib/founder/metrics'
import { founderCacheHeaders } from '@/lib/founder/env'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

export async function GET() {
  const founder = await requireFounderApi()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), {
      status: 403,
      headers: founderCacheHeaders(),
    })
  }
  try {
    const data = await loadPlatformOverview()
    return NextResponse.json(data, { headers: founderCacheHeaders() })
  } catch (e) {
    safeLog('error', 'founder overview API failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: founderCacheHeaders() })
  }
}
