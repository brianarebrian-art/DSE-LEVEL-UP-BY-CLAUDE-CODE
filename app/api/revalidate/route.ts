import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { timingSafeEqual } from 'node:crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED = new Set(['/review/trace'])

function authorized(header: string, secret: string): boolean {
  const expected = `Bearer ${secret}`
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'revalidate-not-configured' }, { status: 503 })
  if (!authorized(req.headers.get('authorization') ?? '', secret)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const read = await readJsonLimited<{ path?: unknown }>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const path = typeof read.value?.path === 'string' ? read.value.path : '/review/trace'
  if (!ALLOWED.has(path)) return NextResponse.json({ error: 'path-not-allowed' }, { status: 400 })
  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path })
}
