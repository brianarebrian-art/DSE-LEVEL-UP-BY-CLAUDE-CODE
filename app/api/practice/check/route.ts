import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { loadBank } from '@/lib/practice/bankCache'
import { checkMc, writtenKey } from '@/lib/practice/publicQuestion'
import { isMCQuestion, isWrittenQuestion } from '@/data/questions/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/

function validQuestionId(id: string): boolean {
  return id.length >= 1 && id.length <= 120 && !/[\s<>"'\\]/.test(id)
}

/**
 * POST /api/practice/check
 * One question, after the student submits. Does not write progress.
 * Guests are allowed: charter §3.1 still forbids cloud progress for them.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited<{
    subjectId?: unknown
    questionId?: unknown
    chosenText?: unknown
    submittedText?: unknown
  }>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'invalid_body' }, { status: read.status })
  }

  const subjectId = read.value?.subjectId
  const questionId = read.value?.questionId
  if (typeof subjectId !== 'string' || !SUBJECT_ID.test(subjectId)) {
    return NextResponse.json({ error: 'invalid_subject' }, { status: 400 })
  }
  if (typeof questionId !== 'string' || !validQuestionId(questionId)) {
    return NextResponse.json({ error: 'invalid_question' }, { status: 400 })
  }

  const bank = await loadBank(subjectId)
  const question = bank.find((q) => q.id === questionId)
  if (!question) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const noStore = { 'cache-control': 'no-store' }

  if (isMCQuestion(question)) {
    const chosenText = read.value?.chosenText
    if (typeof chosenText !== 'string' || chosenText.length === 0 || chosenText.length > 4000) {
      return NextResponse.json({ error: 'invalid_choice' }, { status: 400 })
    }
    const graded = checkMc(question, chosenText)
    if (!graded) {
      return NextResponse.json({ error: 'unknown_option' }, { status: 400 })
    }
    return NextResponse.json(graded, { headers: noStore })
  }

  if (isWrittenQuestion(question)) {
    const submittedText = read.value?.submittedText
    if (typeof submittedText !== 'string' || submittedText.trim().length === 0 || submittedText.length > 20000) {
      return NextResponse.json({ error: 'invalid_submission' }, { status: 400 })
    }
    return NextResponse.json(writtenKey(question), { headers: noStore })
  }

  return NextResponse.json({ error: 'not_found' }, { status: 404 })
}
