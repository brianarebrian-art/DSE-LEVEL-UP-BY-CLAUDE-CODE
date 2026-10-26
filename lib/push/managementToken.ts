import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/** CSPRNG-created opaque owner credential. It is only returned to the HTTP cookie layer. */
export function createManagementToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashManagementToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export function validManagementToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value)
}

export function constantTimeDigestMatch(expectedHex: string, suppliedHex: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(expectedHex) || !/^[a-f0-9]{64}$/i.test(suppliedHex)) return false
  return timingSafeEqual(Buffer.from(expectedHex, 'hex'), Buffer.from(suppliedHex, 'hex'))
}
