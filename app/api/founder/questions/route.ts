import { NextResponse } from 'next/server'
import { requireFounder, founderForbiddenBody } from '@/lib/auth/founderAllowlist'
import { listFounderQuestions } from '@/lib/founder/questions'
import { founderCacheHeaders } from '@/lib/founder/env'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const founder = await requireFounder()
  if (!founder) {
    return NextResponse.json(founderForbiddenBody(), { status: 403, headers: founderCacheHeaders() })
  }
  const url = new URL(request.url)
  const data = listFounderQuestions({
    q: url.searchParams.get('q') ?? undefined,
    subject: url.searchParams.get('subject') ?? undefined,
    difficulty: url.searchParams.get('difficulty') ?? undefined,
    page: Number(url.searchParams.get('page') || '1') || 1,
    pageSize: Number(url.searchParams.get('pageSize') || '50') || 50,
    sort: (url.searchParams.get('sort') as 'id' | 'topic' | 'difficulty') || 'id',
  })
  return NextResponse.json(data, { headers: founderCacheHeaders() })
}
