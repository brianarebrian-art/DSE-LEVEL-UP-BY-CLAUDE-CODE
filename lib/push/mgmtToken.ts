// SEC-R1-001 / FIX-DSE-APP-001 — push subscription management tokens.
//
// Knowing only the Web Push `endpoint` must not be enough to delete or rotate a
// row. The browser receives a CSPRNG token once at subscribe time; the server
// stores only a SHA-256 hash. Rotate = issue a new token and overwrite the hash.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

const TOKEN_BYTES = 32

export function generateMgmtToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

export function hashMgmtToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

/** Constant-time compare of a presented token against a stored hex hash. */
export function verifyMgmtToken(token: string, storedHash: string): boolean {
  if (typeof token !== 'string' || typeof storedHash !== 'string') return false
  if (!token || !/^[a-f0-9]{64}$/i.test(storedHash)) return false
  const presented = Buffer.from(hashMgmtToken(token), 'utf8')
  const expected = Buffer.from(storedHash.toLowerCase(), 'utf8')
  if (presented.length !== expected.length) return false
  return timingSafeEqual(presented, expected)
}
