import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import {
  constantTimeDigestMatch,
  createClaimNonce,
  createManagementToken,
  hashClaimNonce,
  hashManagementToken,
  verifyPushOwnershipProof,
} from '@/lib/push/managementToken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const COOKIE = 'push-management'
const COOKIE_PATH = '/api/push/subscribe'
const MAX_AGE = 60 * 60 * 24 * 365
const CHALLENGE_TTL_MS = 3 * 60 * 1000
const conflict = () => NextResponse.json({ error: 'subscription-conflict' }, { status: 409 })

function validEndpoint(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 1024) return false
  try { return new URL(value).protocol === 'https:' } catch { return false }
}
function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin')
  return !!origin && origin === new URL(req.url).origin
}
function setOwnerCookie(res: NextResponse, token: string, req: Request) {
  // HttpOnly prevents direct JS reads, not same-origin XSS from invoking this API.
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: new URL(req.url).protocol === 'https:',
    sameSite: 'strict',
    path: COOKIE_PATH,
    maxAge: MAX_AGE,
  })
}
const text = (value: unknown, max: number) => typeof value === 'string' && value.length > 0 && value.length <= max ? value : null

export async function POST(req: Request) {
  if (!originAllowed(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.status === 413 ? 'body too large' : 'bad-json' }, { status: read.status })
  const body = (read.value ?? {}) as Record<string, unknown>
  const endpoint = body.endpoint
  if (!validEndpoint(endpoint)) return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })

  try {
    const supabase = getServiceSupabase()
    if (body.action === 'start') {
      const { data: existing, error } = await supabase.from('push_subscriptions')
        .select('version').eq('endpoint', endpoint).maybeSingle()
      if (error) throw error
      if (!existing) return conflict()
      const challenge = createClaimNonce()
      const nonceHash = hashClaimNonce(challenge)
      const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString()
      const { data: updated, error: updateError } = await supabase.from('push_subscriptions')
        .update({ claim_nonce_hash: nonceHash, claim_expires_at: expiresAt })
        .eq('endpoint', endpoint).eq('version', existing.version).select('endpoint').maybeSingle()
      if (updateError) throw updateError
      if (!updated) return conflict()
      // A challenge is not a management credential. It expires quickly and is usable once.
      return NextResponse.json({ challenge })
    }

    if (body.action !== 'complete') return NextResponse.json({ error: 'bad-request' }, { status: 400 })
    const challenge = text(body.challenge, 64)
    const proof = text(body.proof, 64)
    if (!challenge || !proof || !/^[A-Za-z0-9_-]{43}$/.test(challenge)) return conflict()

    const { data: row, error } = await supabase.from('push_subscriptions')
      .select('auth, management_token_hash, claim_nonce_hash, claim_expires_at, version')
      .eq('endpoint', endpoint).maybeSingle()
    if (error) throw error
    if (!row?.claim_nonce_hash || !row.claim_expires_at) return conflict()
    const nonceHash = hashClaimNonce(challenge)
    if (!constantTimeDigestMatch(row.claim_nonce_hash, nonceHash)) return conflict()
    const expiresAt = Date.parse(row.claim_expires_at)
    if (!verifyPushOwnershipProof(challenge, proof, row.auth, expiresAt)) return conflict()

    // Possession of the Push auth secret is only a one-time recovery proof. A new,
    // independent 256-bit management token is issued and only its digest is stored.
    const token = createManagementToken()
    const tokenHash = hashManagementToken(token)
    const now = new Date().toISOString()
    const { data: consumed, error: consumeError } = await supabase.from('push_subscriptions')
      .update({ management_token_hash: tokenHash, claim_nonce_hash: null, claim_expires_at: null, version: row.version + 1 })
      .eq('endpoint', endpoint)
      .eq('version', row.version)
      .eq('claim_nonce_hash', nonceHash)
      .gte('claim_expires_at', now)
      .select('endpoint')
      .maybeSingle()
    if (consumeError) throw consumeError
    if (!consumed) return conflict()

    const res = NextResponse.json({ ok: true })
    setOwnerCookie(res, token, req)
    return res
  } catch (error) {
    safeLog('error', 'push/subscribe', error)
    return NextResponse.json({ error: 'recovery-failed' }, { status: 500 })
  }
}
