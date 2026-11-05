import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { socraticReply } from '@/lib/tutor/socratic'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value ?? {}
  const topicId = body.topicId
  const misses = body.misses
  const studentText = body.studentText
  if (typeof topicId !== 'string' || typeof misses !== 'number' || !Number.isFinite(misses)) {
    return NextResponse.json({ error: 'invalid-tutor-request' }, { status: 400 })
  }
  if (studentText !== undefined && typeof studentText !== 'string') {
    return NextResponse.json({ error: 'invalid-text' }, { status: 400 })
  }
  const reply = socraticReply(topicId, misses, typeof studentText === 'string' ? studentText.slice(0, 500) : '')
  if (!reply) return NextResponse.json({ error: 'unknown-topic' }, { status: 404 })
  return NextResponse.json(reply)
}
