import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'

export const dynamic = 'force-dynamic'

const CONTENT_TYPES = ['question', 'explanation', 'ai_output', 'ugc'] as const
const REASONS = ['incorrect', 'unclear', 'outdated', 'inappropriate', 'other'] as const
const ID = /^[a-zA-Z0-9_-]{1,120}$/

export async function POST(request: Request) {
  const read = await readJsonLimited(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value as Record<string, unknown>
  const contentType = body.contentType
  const contentId = body.contentId
  const reason = body.reason
  const note = body.note

  if (!CONTENT_TYPES.includes(contentType as (typeof CONTENT_TYPES)[number])) {
    return NextResponse.json({ error: 'invalid content type' }, { status: 400 })
  }
  if (typeof contentId !== 'string' || !ID.test(contentId)) {
    return NextResponse.json({ error: 'invalid content id' }, { status: 400 })
  }
  if (!REASONS.includes(reason as (typeof REASONS)[number])) {
    return NextResponse.json({ error: 'invalid reason' }, { status: 400 })
  }
  if (note !== undefined && (typeof note !== 'string' || note.length > 500)) {
    return NextResponse.json({ error: 'invalid note' }, { status: 400 })
  }

  // Phase 1 keeps reports ephemeral until the moderation schema is approved.
  // The contract is intentionally stable so a persistence adapter can be added later.
  const reportId = `report_${crypto.randomUUID()}`
  return NextResponse.json({ reportId, status: 'received' }, { status: 202 })
}
