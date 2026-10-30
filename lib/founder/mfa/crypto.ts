import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/** SHA-256 hex of utf8 input（enrollment token／復原碼雜湊）。 */
export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex')
}

/** 高熵 token（hex）。 */
export function randomTokenHex(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}

/** 復原碼：可讀、高熵（每組 10 碼，每碼 10 字元）。 */
export function generateRecoveryCodes(count = 10): string[] {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const buf = randomBytes(10)
    let s = ''
    for (let j = 0; j < 10; j++) s += alphabet[buf[j]! % alphabet.length]
    codes.push(`${s.slice(0, 5)}-${s.slice(5)}`)
  }
  return codes
}

export function normalizeRecoveryCode(raw: string): string {
  return raw.replace(/[\s-]+/g, '').toUpperCase()
}

export function hashRecoveryCode(raw: string): string {
  return sha256Hex(normalizeRecoveryCode(raw))
}

/** 常數時間比較兩個 hex／字串。 */
export function safeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export { isSixDigitCode, normalizeTotpCode } from '@/lib/founder/mfa/codes'
