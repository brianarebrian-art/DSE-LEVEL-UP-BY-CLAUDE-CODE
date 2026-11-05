import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { socraticReply } from '@/lib/tutor/socratic'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const started = performance.now()
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return withTiming(NextResponse.json({ error: read.error }, { status: read.status }), started)
  const body = read.value ?? {}
  const topicId = body.topicId
  const misses = body.misses
  const studentText = body.studentText
  if (typeof topicId !== 'string' || typeof misses !== 'number' || !Number.isFinite(misses)) {
    return withTiming(NextResponse.json({ error: 'invalid-tutor-request' }, { status: 400 }), started)
  }
  if (studentText !== undefined && typeof studentText !== 'string') {
    return withTiming(NextResponse.json({ error: 'invalid-text' }, { status: 400 }), started)
  }
  const reply = socraticReply(topicId, misses, typeof studentText === 'string' ? studentText.slice(0, 500) : '')
  if (!reply) return withTiming(NextResponse.json({ error: 'unknown-topic' }, { status: 404 }), started)
  return withTiming(NextResponse.json(reply), started)
}

function withTiming(response: NextResponse, started: number): NextResponse {
  response.headers.set('Server-Timing', `handler;dur=${(performance.now() - started).toFixed(2)}`)
  return response
}
