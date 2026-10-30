// Founder MFA：可喺 unit 層覆蓋嘅規格要點（唔連真實 IdP／DB）。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createHash, randomBytes } from 'node:crypto'

const { isSixDigitCode, normalizeTotpCode } = await import('../founder/mfa/codes.ts')
const {
  generateRecoveryCodes,
  normalizeRecoveryCode,
  hashRecoveryCode,
  sha256Hex,
  randomTokenHex,
  safeEqualStr,
} = await import('../founder/mfa/crypto.ts')
const { FOUNDER_MFA_ISSUER, FOUNDER_TOTP_HINT } = await import('../founder/mfa/config.ts')
const { mfaErrorBody } = await import('../founder/mfa/clientErrors.ts')
const { FOUNDER_EMAIL } = await import('../auth/founderIdentity.ts')

test('TOTP 格式：只接受 6 位數字', () => {
  assert.equal(isSixDigitCode('123456'), true)
  assert.equal(isSixDigitCode('12345'), false)
  assert.equal(isSixDigitCode('1234567'), false)
  assert.equal(isSixDigitCode('12 3456'), false)
  assert.equal(isSixDigitCode(normalizeTotpCode('12 34 56')), true)
})

test('Enrollment token：高熵 hex 64 字元；只存雜湊語意', () => {
  const token = randomTokenHex(32)
  assert.match(token, /^[a-f0-9]{64}$/)
  const hash = sha256Hex(token)
  assert.equal(hash.length, 64)
  assert.notEqual(hash, token)
  assert.equal(sha256Hex(token), hash)
})

test('復原碼：可讀、可正規化、雜湊唔可逆推', () => {
  const codes = generateRecoveryCodes(10)
  assert.equal(codes.length, 10)
  for (const c of codes) {
    assert.match(c, /^[A-Z0-9]{5}-[A-Z0-9]{5}$/)
    const h = hashRecoveryCode(c)
    assert.equal(h, hashRecoveryCode(c.toLowerCase().replace('-', ' ')))
    assert.notEqual(h, normalizeRecoveryCode(c))
  }
  const set = new Set(codes)
  assert.equal(set.size, 10)
})

test('Authenticator 建議設定與帳戶', () => {
  assert.equal(FOUNDER_MFA_ISSUER, 'DSE Level Up')
  assert.equal(FOUNDER_TOTP_HINT.digits, 6)
  assert.equal(FOUNDER_TOTP_HINT.periodSec, 30)
  assert.equal(FOUNDER_EMAIL, 'brianarebrian@gmail.com')
})

test('客戶端錯誤唔洩露繞過細節', () => {
  assert.equal(mfaErrorBody('invalid').error, 'invalid')
  assert.equal(mfaErrorBody('failed').error, 'invalid')
  assert.doesNotMatch(mfaErrorBody('invalid').error, /totp|secret|factor/i)
})

test('safeEqualStr 長度不符 → false', () => {
  assert.equal(safeEqualStr('abc', 'abd'), false)
  assert.equal(safeEqualStr('aa', 'a'), false)
  const a = createHash('sha256').update('x').digest('hex')
  assert.equal(safeEqualStr(a, a), true)
})

test('接線：requireFounderApi 用於 founder API；MFA 閘存在', () => {
  const allow = readFileSync(fileURLToPath(new URL('../auth/founderAllowlist.ts', import.meta.url)), 'utf8')
  assert.match(allow, /requireFounderApi/)
  assert.match(allow, /getFounderGate/)
  assert.match(allow, /mfa_enroll_required|mfa_required/)

  const gate = readFileSync(fileURLToPath(new URL('../founder/mfa/gate.ts', import.meta.url)), 'utf8')
  assert.match(gate, /getAuthenticatorAssuranceLevel/)
  assert.match(gate, /aal2/)
  assert.match(gate, /needs_challenge/)
  assert.match(gate, /needs_enroll/)

  const overview = readFileSync(
    fileURLToPath(new URL('../../app/api/founder/overview/route.ts', import.meta.url)),
    'utf8',
  )
  assert.match(overview, /requireFounderApi/)
  assert.doesNotMatch(overview, /requireFounder\(\)/)
})

test('Layout：未 full 唔載入後台 overview', () => {
  const src = readFileSync(fileURLToPath(new URL('../../app/founder/layout.tsx', import.meta.url)), 'utf8')
  // loadPlatformOverview 只應出現喺 full 分支之後嘅語意；確保有 getFounderGate／非 full 早退
  assert.match(src, /getFounderGate/)
  assert.match(src, /FounderMfaChrome/)
  assert.match(src, /gate\.state !== 'full'/)
})

test('Migration 0032 存在且 revoke anon／authenticated', () => {
  const path = join(process.cwd(), 'supabase/migrations/0032_founder_mfa.sql')
  assert.ok(existsSync(path))
  const sql = readFileSync(path, 'utf8')
  assert.match(sql, /founder_mfa_enrollment_tokens/)
  assert.match(sql, /founder_mfa_recovery_codes/)
  assert.match(sql, /founder_mfa_rate_hit/)
  assert.match(sql, /revoke all on table public\.founder_mfa_enrollment_tokens from anon, authenticated/)
  assert.match(sql, /last_totp_step/)
})

test('MFA 頁面同 API 路由存在', () => {
  const root = process.cwd()
  for (const p of [
    'app/founder/mfa/login/page.tsx',
    'app/founder/mfa/enroll/page.tsx',
    'app/founder/mfa/verify/page.tsx',
    'app/founder/mfa/recovery/page.tsx',
    'app/founder/mfa/recovery-codes/page.tsx',
    'app/founder/settings/security/page.tsx',
    'app/api/founder/mfa/enroll/start/route.ts',
    'app/api/founder/mfa/enroll/confirm/route.ts',
    'app/api/founder/mfa/verify/route.ts',
    'app/api/founder/mfa/recovery/route.ts',
    'app/api/founder/mfa/recovery-codes/regenerate/route.ts',
    'scripts/founder-mfa-enroll-token.mts',
    'scripts/founder-mfa-emergency-revoke.mts',
  ]) {
    assert.ok(existsSync(join(root, p)), p)
  }
})

test('QR／enroll UI 唔用第三方 QR API host', () => {
  const enroll = readFileSync(
    fileURLToPath(new URL('../../components/founder/mfa/MfaQrPanel.tsx', import.meta.url)),
    'utf8',
  )
  assert.doesNotMatch(enroll, /qrserver|google\.com\/chart|api\.qrserver|chart\.googleapis/i)
  assert.match(enroll, /data:image\/svg\+xml/)
})

test('文件聲明：唔係防釣魚；secret 由 IdP 管理；唔聲稱零風險', () => {
  const doc = readFileSync(fileURLToPath(new URL('../../docs/founder-os.md', import.meta.url)), 'utf8')
  assert.match(doc, /唔係.*防釣魚|防釣魚驗證/)
  assert.match(doc, /Supabase Auth MFA/)
  assert.match(doc, /0032_founder_mfa/)
  assert.match(doc, /FOUNDER_MFA_/)
  assert.match(doc, /唔會聲稱零風險/)
})

test('限流 deny-by-default 當 store 不可用', () => {
  const src = readFileSync(fileURLToPath(new URL('../founder/mfa/rateLimit.ts', import.meta.url)), 'utf8')
  assert.match(src, /rate_store_unavailable/)
  assert.match(src, /founder_mfa_rate_hit/)
})

test('隨機 token 熵：32 bytes', () => {
  const a = randomBytes(32).toString('hex')
  const b = randomBytes(32).toString('hex')
  assert.notEqual(a, b)
  assert.equal(a.length, 64)
})
