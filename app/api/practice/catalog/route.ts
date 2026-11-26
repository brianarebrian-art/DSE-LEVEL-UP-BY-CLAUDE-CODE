import { NextResponse } from 'next/server'
import { assertNoAnswerLeak } from '@/lib/practice/serverSession'
import { loadMcBank, loadWrittenBank } from '@/lib/practice/bankCache'
import { toPublicMc, toPublicWritten } from '@/lib/practice/publicQuestion'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/

/**
 * GET /api/practice/catalog?subject=math&kind=mc|written
 * Stems and options only. No correctIndex, explanation, or reference answer.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const subjectId = url.searchParams.get('subject') ?? ''
  const kind = url.searchParams.get('kind') ?? 'mc'
  if (!SUBJECT_ID.test(subjectId)) {
    return NextResponse.json({ error: 'invalid_subject' }, { status: 400 })
  }
  if (kind !== 'mc' && kind !== 'written') {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 })
  }

  const questions =
    kind === 'written'
      ? (await loadWrittenBank(subjectId)).map(toPublicWritten)
      : (await loadMcBank(subjectId)).map((q) => toPublicMc(q))

  if (questions.length === 0) {
    return NextResponse.json({ error: 'empty_bank' }, { status: 404 })
  }

  const body = { subjectId, kind, questions }
  const leaks = assertNoAnswerLeak(body)
  if (leaks.length) {
    return NextResponse.json({ error: 'answer_leak_guard' }, { status: 500 })
  }
  return NextResponse.json(body, {
    headers: { 'cache-control': 'no-store' },
  })
}
