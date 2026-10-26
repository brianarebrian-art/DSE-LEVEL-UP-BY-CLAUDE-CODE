import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getServiceSupabase } from '@/utils/supabase/server'
import { isAllowedPushEndpoint, vapidFromEnv } from '@/lib/push/vapid'
import { safeLog } from '@/lib/safeLog'
import { constantTimeDigestMatch, createManagementToken, hashManagementToken, validManagementToken } from '@/lib/push/managementToken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const COOKIE = 'push-management'
const COOKIE_PATH = '/api/push/subscribe'
const MAX_AGE = 60 * 60 * 24 * 365
function validEndpoint(u: unknown): u is string {
  return isAllowedPushEndpoint(u)
}
const str = (v: unknown, max: number) => typeof v === 'string' && v.length > 0 && v.length <= max ? v : null
function cookieValue(req: Request): string | null {
  const pair = (req.headers.get('cookie') ?? '').split(';').map((s) => s.trim()).find((s) => s.startsWith(`${COOKIE}=`))
  const value = pair?.slice(COOKIE.length + 1)
  return validManagementToken(value) ? value : null
}
function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin')
  return !!origin && origin === new URL(req.url).origin
}
function setOwnerCookie(res: NextResponse, token: string, req: Request) {
  // HttpOnly prevents direct JS reads, not same-origin XSS from invoking this API.
  res.cookies.set(COOKIE, token, { httpOnly: true, secure: new URL(req.url).protocol === 'https:', sameSite: 'strict', path: COOKIE_PATH, maxAge: MAX_AGE })
}
const conflict = () => NextResponse.json({ error: 'subscription-conflict' }, { status: 409 })

export async function POST(req: Request) {
  if (!originAllowed(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  if (!vapidFromEnv()) return NextResponse.json({ error: 'push-not-configured' }, { status: 503 })
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.status === 413 ? 'body too large' : 'bad-json' }, { status: read.status })
  const body = (read.value ?? {}) as Record<string, unknown>
  const endpoint = body.endpoint
  const p256dh = str(body.p256dh, 256)
  const auth = str(body.auth, 256)
  if (!validEndpoint(endpoint) || !p256dh || !auth) return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })

  try {
    const supabase = getServiceSupabase()
    const priorToken = cookieValue(req)
    const nextToken = createManagementToken()
    const nextHash = hashManagementToken(nextToken)
    const { data: inserted, error: insertError } = await supabase.from('push_subscriptions')
      .insert({ endpoint, p256dh, auth, fail_count: 0, management_token_hash: nextHash, version: 1 })
      .select('version').maybeSingle()
    if (!insertError && inserted) {
      const res = NextResponse.json({ ok: true })
      setOwnerCookie(res, nextToken, req)
      return res
    }
    if (insertError && insertError.code !== '23505') throw insertError
    // A failed insert can only be treated as an existing endpoint after verifying the
    // opaque cookie against its stored hash; a legacy NULL hash cannot be claimed.
    if (!priorToken) return conflict()
    const oldHash = hashManagementToken(priorToken)
    const { data: existing, error: lookupError } = await supabase.from('push_subscriptions')
      .select('management_token_hash, version').eq('endpoint', endpoint).maybeSingle()
    if (lookupError || !existing || !existing.management_token_hash || !constantTimeDigestMatch(existing.management_token_hash, oldHash)) return conflict()
    const { data: updated, error: updateError } = await supabase.from('push_subscriptions')
      .update({ p256dh, auth, fail_count: 0, management_token_hash: nextHash, version: existing.version + 1 })
      .eq('endpoint', endpoint).eq('management_token_hash', oldHash).eq('version', existing.version).select('version').maybeSingle()
    if (updateError) throw updateError
    if (!updated) return conflict()
    const res = NextResponse.json({ ok: true })
    setOwnerCookie(res, nextToken, req)
    return res
  } catch (e) {
    safeLog('error', 'push/subscribe', e)
    return NextResponse.json({ error: 'store-failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!originAllowed(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const token = cookieValue(req)
  if (!token) return conflict()
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.status === 413 ? 'body too large' : 'bad-json' }, { status: read.status })
  const endpoint = (read.value ?? {}).endpoint
  if (!validEndpoint(endpoint)) return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })
  try {
    const tokenHash = createHash('sha256').update(token).digest('hex')
    const { data, error } = await getServiceSupabase().from('push_subscriptions').delete()
      .eq('endpoint', endpoint).eq('management_token_hash', tokenHash).select('endpoint').maybeSingle()
    if (error) throw error
    if (!data) return conflict()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, '', { httpOnly: true, secure: new URL(req.url).protocol === 'https:', sameSite: 'strict', path: COOKIE_PATH, maxAge: 0 })
    return res
  } catch (e) {
    safeLog('error', 'push/unsubscribe', e)
    return NextResponse.json({ error: 'delete-failed' }, { status: 500 })
  }
}
