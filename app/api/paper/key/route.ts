import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { loadMcBank, loadWrittenBank } from '@/lib/practice/bankCache'
import { buildPaper, buildWrittenSection, decodePaperCode } from '@/lib/paper/paper'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/paper/key
 * Full key for one paper code. The questions-only sheet must not link here
 * until the student confirms they have finished. This route does not write progress.
 */
export async function POST(request: Request) {
  const read = await readJsonLimited<{ code?: unknown }>(request, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json({ error: 'invalid_body' }, { status: read.status })
  }
  const code = read.value?.code
  if (typeof code !== 'string' || code.length < 4 || code.length > 120) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
  }
  const spec = decodePaperCode(code)
  if (!spec) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 })
  }

  const pool = spec.topic
    ? (await loadMcBank(spec.subject)).filter((q) => q.topic === spec.topic)
    : await loadMcBank(spec.subject)
  const items = buildPaper(spec, pool)
  if (items.length === 0) {
    return NextResponse.json({ error: 'empty_paper' }, { status: 404 })
  }
  const writtenItems = spec.written
    ? buildWrittenSection(spec, await loadWrittenBank(spec.subject))
    : []

  return NextResponse.json(
    { spec, items, writtenItems },
    { headers: { 'cache-control': 'no-store' } },
  )
}
