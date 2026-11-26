import { NextResponse } from 'next/server'
import { CONCEPT_TEXTS } from '@/lib/conceptNet'
import { conceptPreview } from '@/lib/practice/conceptPreview'
import { loadMcBank } from '@/lib/practice/bankCache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const TEXT_ID = /^[a-z0-9-]{1,40}$/

/**
 * GET /api/concept-net/preview?text=lunyu
 * At most four stems and explanations, after the student opens that text.
 * No options and no correctIndex.
 */
export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get('text') ?? ''
  if (!TEXT_ID.test(text) || !CONCEPT_TEXTS.some((t) => t.id === text)) {
    return NextResponse.json({ error: 'invalid_text' }, { status: 400 })
  }
  const bank = await loadMcBank('chinese')
  const items = conceptPreview(bank, text)
  for (const item of items) {
    if ('correctIndex' in item || 'options' in item || 'referenceAnswer' in item) {
      return NextResponse.json({ error: 'answer_leak_guard' }, { status: 500 })
    }
  }
  return NextResponse.json({ text, items }, { headers: { 'cache-control': 'no-store' } })
}
