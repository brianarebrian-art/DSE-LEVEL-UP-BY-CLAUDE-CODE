import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { assertNoAnswerLeak } from '@/lib/practice/serverSession'
import { loadMcBank, loadWrittenBank } from '@/lib/practice/bankCache'
import { projectPaperMc, projectPaperWritten } from '@/lib/practice/publicQuestion'
import { buildPaper, buildWrittenSection, encodePaperCode, type PaperSpec } from '@/lib/paper/paper'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/
const TOPIC_ID = /^[a-z0-9_]{0,80}$/
const SEED = /^[a-z0-9]{4,12}$/

/**
 * POST /api/paper/build
 * Questions-only responses omit answer index, explanations, and model answers.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited<{
    subject?: unknown
    topic?: unknown
    size?: unknown
    seed?: unknown
    written?: unknown
    withExplain?: unknown
  }>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'invalid_body' }, { status: read.status })
  }

  const subject = read.value?.subject
  const topic = typeof read.value?.topic === 'string' ? read.value.topic : ''
  const seed = read.value?.seed
  const size = read.value?.size
  const written = read.value?.written
  const withExplain = read.value?.withExplain === true

  if (typeof subject !== 'string' || !SUBJECT_ID.test(subject)) {
    return NextResponse.json({ error: 'invalid_subject' }, { status: 400 })
  }
  if (!TOPIC_ID.test(topic)) {
    return NextResponse.json({ error: 'invalid_topic' }, { status: 400 })
  }
  if (typeof seed !== 'string' || !SEED.test(seed)) {
    return NextResponse.json({ error: 'invalid_seed' }, { status: 400 })
  }
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1 || size > 40) {
    return NextResponse.json({ error: 'invalid_size' }, { status: 400 })
  }
  const writtenN =
    typeof written === 'number' && Number.isInteger(written) && written >= 0 && written <= 3
      ? written
      : 0

  const spec: PaperSpec = {
    subject,
    topic,
    size,
    seed,
    ...(writtenN > 0 ? { written: writtenN } : {}),
  }

  const pool = topic
    ? (await loadMcBank(subject)).filter((q) => q.topic === topic)
    : await loadMcBank(subject)
  const items = buildPaper(spec, pool).map((item) => projectPaperMc(item, withExplain))
  if (items.length === 0) {
    return NextResponse.json({ error: 'empty_paper' }, { status: 404 })
  }
  const writtenPool = writtenN > 0 ? await loadWrittenBank(subject) : []
  // Model answers stay off the printable payload. The answer sheet returns them
  // after the student confirms they have finished.
  const writtenItems = buildWrittenSection(spec, writtenPool).map((q) => projectPaperWritten(q, false))

  const body = {
    spec,
    code: encodePaperCode(spec),
    withExplain,
    items,
    writtenItems,
  }
  if (!withExplain) {
    const leaks = assertNoAnswerLeak(body)
    if (leaks.length) {
      return NextResponse.json({ error: 'answer_leak_guard' }, { status: 500 })
    }
  }
  return NextResponse.json(body, { headers: { 'cache-control': 'no-store' } })
}
