// /.well-known/security.txt (RFC 9116): tells security researchers where to report a
// problem. Added 2026-10-02 (audit loop T36). Expires must stay in the future, so this
// test fails before the file lapses and someone has to renew it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const txt = readFileSync('public/.well-known/security.txt', 'utf8')
const field = (name: string) => txt.match(new RegExp(`^${name}: (.+)$`, 'm'))?.[1]

test('security.txt has the required Contact and Expires fields', () => {
  assert.equal(field('Contact'), 'mailto:dselevelup@gmail.com')
  assert.equal(field('Canonical'), 'https://dse-level-up-by-claude-code.vercel.app/.well-known/security.txt')
})

test('security.txt has not expired and expires within a year and a month', () => {
  const expires = Date.parse(field('Expires') ?? '')
  assert.ok(Number.isFinite(expires), 'Expires is not a valid date')
  assert.ok(expires > Date.now(), 'security.txt has expired: renew Expires')
  assert.ok(expires - Date.now() < 396 * 24 * 3600 * 1000, 'RFC 9116 recommends less than a year')
})
