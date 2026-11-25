import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getSyncUserId } from '@/lib/auth/server'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { MCQuestion } from '@/data/questions/types'
import { SESSION_SIZE } from '@/lib/entitlements'
import {
  assertNoAnswerLeak,
  buildSession,
  isPilotSubject,
  serverGradeEnabled,
} from '@/lib/practice/serverSession'

export const dynamic = 'force-dynamic'

/**
 * POST /api/practice/session
 * Feature flag: PRACTICE_SERVER_GRADE=1
 * Charter 2B C1 — DRAFT; default off until charter signed.
 */
export async function POST(request: Request) {
  if (!serverGradeEnabled()) {
    return NextResponse.json(
      { error: 'server_grade_disabled', hint: 'Set PRACTICE_SERVER_GRADE=1 after charter 2B sign-off' },
      { status: 503 },
    )
  }

  const userId = await getSyncUserId()
  if (!userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const read = await readJsonLimited<{ subjectId?: unknown; size?: unknown }>(
    request,
    BODY_LIMIT.small,
  )
  if (!read.ok) {
    return NextResponse.json({ error: 'invalid_body' }, { status: read.status })
  }
  const subjectId = read.value?.subjectId
  if (typeof subjectId !== 'string' || subjectId.length === 0 || subjectId.length > 60) {
    return NextResponse.json({ error: 'invalid_subjectId' }, { status: 400 })
  }
  if (!isPilotSubject(subjectId)) {
    return NextResponse.json(
      { error: 'subject_not_in_pilot', subjectId },
      { status: 400 },
    )
  }

  const size =
    typeof read.value?.size === 'number' && read.value.size > 0 && read.value.size <= 40
      ? Math.floor(read.value.size)
      : SESSION_SIZE

  const all = await loadSubjectQuestions(subjectId)
  const mc = all.filter((q): q is MCQuestion => q.type === 'mc')
  if (mc.length === 0) {
    return NextResponse.json({ error: 'empty_bank' }, { status: 404 })
  }

  const { token, publicItems, sessionId } = buildSession(subjectId, mc, size)
  const body = {
    sessionId,
    subjectId,
    token,
    items: publicItems,
    disclaimer:
      'DSE Level Up 非官方練習卷。答案鍵不在本回應內。題目未經註冊教師審定。',
  }
  const leaks = assertNoAnswerLeak(body)
  if (leaks.length) {
    return NextResponse.json({ error: 'answer_leak_guard', leaks }, { status: 500 })
  }
  return NextResponse.json(body)
}
