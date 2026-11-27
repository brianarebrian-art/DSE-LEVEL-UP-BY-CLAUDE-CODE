import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { loadBank } from '@/lib/practice/bankCache'
import { buildTopicNote } from '@/lib/notes/notes'
import { noteCount } from '@/lib/practice/noteCount'
import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import type { ReverseLogEntry } from '@/lib/reverseLog'
import type { TopicStatEntry } from '@/lib/topicStats'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/
const TOPIC_ID = /^[a-z0-9_]{1,80}$/

/**
 * POST /api/notes/topic
 * One topic note: counts, up to six trap excerpts, and explanations only for
 * questions this student already marked wrong. The full bank stays on the server.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited<{
    subjectId?: unknown
    topicId?: unknown
    mistakes?: unknown
    attempted?: unknown
    wrong?: unknown
  }>(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: 'invalid_body' }, { status: read.status })

  const subjectId = read.value?.subjectId
  const topicId = read.value?.topicId
  if (typeof subjectId !== 'string' || !SUBJECT_ID.test(subjectId)) {
    return NextResponse.json({ error: 'invalid_subject' }, { status: 400 })
  }
  if (typeof topicId !== 'string' || !TOPIC_ID.test(topicId)) {
    return NextResponse.json({ error: 'invalid_topic' }, { status: 400 })
  }

  const topic = (SUBJECT_TOPICS[subjectId] ?? []).find((t) => t.id === topicId)
  if (!topic) return NextResponse.json({ error: 'unknown_topic' }, { status: 404 })

  const mistakes = normalizeMistakes(read.value?.mistakes, topicId, topic.zh)
  const attempted = noteCount(read.value?.attempted)
  const wrong = noteCount(read.value?.wrong)
  const stat =
    attempted === null
      ? undefined
      : ({ subjectId, topic: topicId, total: attempted, wrong: wrong ?? 0 } as TopicStatEntry)

  const bank = await loadBank(subjectId)
  const note = buildTopicNote(topic.id, topic.zh, topic.emoji, bank, mistakes, stat)
  return NextResponse.json({ note }, { headers: { 'cache-control': 'no-store' } })
}

function normalizeMistakes(value: unknown, topicId: string, topicZh: string): ReverseLogEntry[] {
  if (!Array.isArray(value)) return []
  const out: ReverseLogEntry[] = []
  for (const row of value.slice(0, 40)) {
    if (!row || typeof row !== 'object') continue
    const item = row as Record<string, unknown>
    if (typeof item.questionId !== 'string' || item.questionId.length === 0 || item.questionId.length > 120) continue
    const cause = item.cause === 'A' || item.cause === 'B' || item.cause === 'C' ? item.cause : null
    if (!cause) continue
    const ts = typeof item.ts === 'number' && Number.isFinite(item.ts) ? item.ts : 0
    out.push({
      subjectId: '',
      questionId: item.questionId,
      topic: typeof item.topic === 'string' ? item.topic.slice(0, 80) : topicZh,
      topicId: typeof item.topicId === 'string' ? item.topicId : topicId,
      cause,
      selected: '',
      correct: '',
      ts,
    })
  }
  return out
}
