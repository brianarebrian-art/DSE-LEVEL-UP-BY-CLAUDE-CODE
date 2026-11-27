import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { assertNoAnswerLeak } from '@/lib/practice/serverSession'
import { loadBank } from '@/lib/practice/bankCache'
import { toStem } from '@/lib/practice/publicQuestion'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/

function validId(id: string): boolean {
  return id.length >= 1 && id.length <= 120 && !/[\s<>"'\\]/.test(id)
}

/**
 * POST /api/questions/bundle
 * Stems for the bookmark ids the student already saved. No answer keys.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited<{ subjectId?: unknown; ids?: unknown }>(request, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: 'invalid_body' }, { status: read.status })

  const subjectId = read.value?.subjectId
  const ids = read.value?.ids
  if (typeof subjectId !== 'string' || !SUBJECT_ID.test(subjectId)) {
    return NextResponse.json({ error: 'invalid_subject' }, { status: 400 })
  }
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 80) {
    return NextResponse.json({ error: 'invalid_ids' }, { status: 400 })
  }
  const wanted = new Set<string>()
  for (const id of ids) {
    if (typeof id !== 'string' || !validId(id)) {
      return NextResponse.json({ error: 'invalid_ids' }, { status: 400 })
    }
    wanted.add(id)
  }

  const bank = await loadBank(subjectId)
  const questions = bank.filter((q) => wanted.has(q.id)).map(toStem)
  const body = { subjectId, questions }
  const leaks = assertNoAnswerLeak(body)
  if (leaks.length) return NextResponse.json({ error: 'answer_leak_guard' }, { status: 500 })
  return NextResponse.json(body, { headers: { 'cache-control': 'no-store' } })
}
