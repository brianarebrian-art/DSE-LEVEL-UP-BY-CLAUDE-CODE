import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/** CSPRNG-created opaque owner credential. It is only returned to the HTTP cookie layer. */
export function createManagementToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashManagementToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export function createClaimNonce(): string {
  return randomBytes(32).toString('base64url')
}

export function hashClaimNonce(nonce: string): string {
  return createHash('sha256').update(nonce, 'utf8').digest('hex')
}

/** Compare validated equal-length digests without data-dependent byte comparison. */
export function constantTimeDigestMatch(expectedHex: string, suppliedHex: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(expectedHex) || !/^[a-f0-9]{64}$/i.test(suppliedHex)) return false
  const expected = Buffer.from(expectedHex, 'hex')
  const supplied = Buffer.from(suppliedHex, 'hex')
  return expected.length === supplied.length && timingSafeEqual(expected, supplied)
}

/**
 * Proves possession of a browser PushSubscription's 16-byte auth secret for token
 * recovery. This one-time HMAC proof is never reused as the management token.
 * The caller also has to validate/atomically consume the stored nonce and expiry.
 */
export function verifyPushOwnershipProof(
  nonce: string,
  proof: string,
  storedAuth: string,
  expiresAt: number,
  now = Date.now(),
): boolean {
  if (typeof nonce !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(nonce)) return false
  if (typeof proof !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(proof)) return false
  if (typeof storedAuth !== 'string' || !/^[A-Za-z0-9_-]{22}$/.test(storedAuth)) return false
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false
  try {
    const key = Buffer.from(storedAuth, 'base64url')
    const supplied = Buffer.from(proof, 'base64url')
    if (key.length !== 16 || supplied.length !== 32) return false
    const expected = createHmac('sha256', key).update(nonce, 'utf8').digest()
    return expected.length === supplied.length && timingSafeEqual(expected, supplied)
  } catch {
    return false
  }
}

export function validManagementToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
}
