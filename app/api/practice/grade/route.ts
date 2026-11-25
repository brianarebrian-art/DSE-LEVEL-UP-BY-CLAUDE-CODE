import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getSyncUserId } from '@/lib/auth/server'
import {
  assertNoAnswerLeak,
  decodeSession,
  gradeSession,
  serverGradeEnabled,
  serverGradeReady,
} from '@/lib/practice/serverSession'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { MCQuestion } from '@/data/questions/types'

export const dynamic = 'force-dynamic'

/**
 * POST /api/practice/grade
 * Scores against session itemIds (total = session length). Duplicates ignored.
 */
export async function POST(request: Request) {
  if (!serverGradeEnabled()) {
    return NextResponse.json({ error: 'server_grade_disabled' }, { status: 503 })
  }
  if (!serverGradeReady()) {
    return NextResponse.json({ error: 'hmac_secret_required' }, { status: 503 })
  }

  const userId = await getSyncUserId()
  if (!userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const read = await readJsonLimited<{
    token?: unknown
    answers?: unknown
    subjectId?: unknown
    includeExplanations?: unknown
  }>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'invalid_body' }, { status: read.status })
  }

  const token = read.value?.token
  const answers = read.value?.answers
  if (typeof token !== 'string' || token.length < 20) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 })
  }
  if (!Array.isArray(answers) || answers.length > 40) {
    return NextResponse.json({ error: 'invalid_answers' }, { status: 400 })
  }

  const session = decodeSession(token)
  if (!session) {
    return NextResponse.json({ error: 'invalid_or_expired_session' }, { status: 400 })
  }

  const subjectId =
    typeof read.value?.subjectId === 'string' && read.value.subjectId.length > 0
      ? read.value.subjectId
      : session.subjectId
  if (subjectId !== session.subjectId) {
    return NextResponse.json({ error: 'subject_mismatch' }, { status: 400 })
  }

  const normalized: Array<{ id: string; chosenIndex: number }> = []
  for (const a of answers) {
    if (!a || typeof a !== 'object') continue
    const row = a as Record<string, unknown>
    if (typeof row.id !== 'string' || typeof row.chosenIndex !== 'number') continue
    if (row.chosenIndex < 0 || row.chosenIndex > 5) continue
    normalized.push({ id: row.id, chosenIndex: Math.floor(row.chosenIndex) })
  }

  const bank = await loadSubjectQuestions(subjectId)
  const mc = bank.filter((q): q is MCQuestion => q.type === 'mc')
  const graded = gradeSession(token, normalized, mc)
  if (!graded.ok) {
    return NextResponse.json({ error: graded.error }, { status: 400 })
  }

  let explanations: Record<string, { zh: string; en?: string }> | undefined
  if (read.value?.includeExplanations === true) {
    const map = new Map(
      mc.map((q) => [q.id, { zh: q.explanation, en: q.explanationEn }]),
    )
    explanations = {}
    for (const d of graded.details) {
      const e = map.get(d.id)
      if (e) explanations[d.id] = e
    }
  }

  const body = {
    score: graded.score,
    total: graded.total,
    details: graded.details,
    explanations,
    predictionDisclaimer:
      '任何等級或表現估算均為 DSE Level Up 非官方預測，受樣本量與題目校準限制；非考評局評級。',
    calibration: {
      written: false,
      reason: 'charter_2B_C3_unsigned',
    },
  }

  void assertNoAnswerLeak({ score: body.score, total: body.total })
  return NextResponse.json(body)
}
