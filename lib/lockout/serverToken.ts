import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'

// Server-validated lockout tokens — defence-in-depth for the 60s reflection gate so a
// student can't simply zero the client countdown (via React DevTools) to skip it.
//
// STATELESS: the signed token carries {questionId, startedAt, expiresAt}; verification
// re-checks the HMAC and the expiry, so no DB/KV is needed. The secret is read from
// process.env.LOCKOUT_SECRET and NEVER written to a file. If the secret is absent the
// feature is simply disabled and the app falls back to the client timer.
//
// CEILING (be honest): all questions + answers ship in the static client bundle, so
// this raises the bar against casual tampering but cannot make the lock absolute — a
// determined user can always read the bundled answer. It is a nudge, not DRM.

const SECRET = process.env.LOCKOUT_SECRET
export const lockoutServerEnabled = Boolean(SECRET)

// Slightly under the client's 60s so normal clock skew never blocks a legitimate unlock
// (the server is authoritative and should always expire first for an honest user).
const DURATION_MS = 58_000

function macOf(body: string): string {
  return createHmac('sha256', SECRET as string).update(body).digest('base64url')
}

export function startLockout(questionId: string): { token: string; expiresAt: number } | null {
  if (!SECRET) return null
  const startedAt = Date.now()
  const expiresAt = startedAt + DURATION_MS
  const body = `${questionId}:${startedAt}:${expiresAt}`
  const token = `${Buffer.from(body).toString('base64url')}.${macOf(body)}`
  return { token, expiresAt }
}

export function verifyUnlock(token: string): { valid: boolean; expired: boolean } {
  if (!SECRET) return { valid: false, expired: true }
  const [bodyB64, mac] = token.split('.')
  if (!bodyB64 || !mac) return { valid: false, expired: false }

  let body: string
  try {
    body = Buffer.from(bodyB64, 'base64url').toString()
  } catch {
    return { valid: false, expired: false }
  }

  const expected = macOf(body)
  const a = Buffer.from(mac)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false, expired: false }

  const expiresAt = Number(body.split(':')[2])
  return { valid: true, expired: Number.isFinite(expiresAt) && Date.now() >= expiresAt }
}
