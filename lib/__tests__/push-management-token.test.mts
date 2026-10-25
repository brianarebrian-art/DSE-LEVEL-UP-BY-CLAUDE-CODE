import assert from 'node:assert/strict'
import test from 'node:test'
import { createHmac, randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { createManagementToken, hashManagementToken, constantTimeDigestMatch, validManagementToken, verifyPushOwnershipProof } = require('../push/managementToken.ts') as typeof import('../push/managementToken')

const tokenRoute = readFileSync('app/api/push/subscribe/route.ts', 'utf8')
const claimRoute = readFileSync('app/api/push/subscribe/claim/route.ts', 'utf8')

test('management credential uses 32 CSPRNG bytes encoded as a 43-character base64url token', () => {
  const token = createManagementToken()
  assert.equal(Buffer.from(token, 'base64url').length, 32)
  assert.equal(validManagementToken(token), true)
})

test('only the SHA-256 digest is intended for database storage', () => {
  const token = createManagementToken()
  const digest = hashManagementToken(token)
  assert.equal(digest.length, 64)
  assert.notEqual(digest, token)
  assert.equal(hashManagementToken(token), digest)
})

test('constant-time digest helper accepts same digest and rejects wrong/malformed values', () => {
  const digest = hashManagementToken('synthetic-token')
  assert.equal(constantTimeDigestMatch(digest, digest), true)
  assert.equal(constantTimeDigestMatch(digest, hashManagementToken('wrong-token')), false)
  assert.equal(constantTimeDigestMatch(digest, 'bad'), false)
})

test('Push auth possession proof accepts only the matching key, nonce, and live expiry', () => {
  const nonce = randomBytes(32).toString('base64url')
  const authKey = randomBytes(16)
  const auth = authKey.toString('base64url')
  const proof = createHmac('sha256', authKey).update(nonce, 'utf8').digest('base64url')
  const expiry = Date.now() + 60_000
  assert.equal(verifyPushOwnershipProof(nonce, proof, auth, expiry), true)
  assert.equal(verifyPushOwnershipProof(nonce, proof, randomBytes(16).toString('base64url'), expiry), false)
  assert.equal(verifyPushOwnershipProof(randomBytes(32).toString('base64url'), proof, auth, expiry), false)
  assert.equal(verifyPushOwnershipProof(nonce, proof, auth, Date.now() - 1), false)
  assert.equal(verifyPushOwnershipProof('bad', proof, auth, expiry), false)
})

test('endpoint alone is insufficient; token update and challenge consumption are conditional on owner/version/nonce', () => {
  assert.match(tokenRoute, /if \(!priorToken\) return conflict\(\)/)
  assert.match(tokenRoute, /\.eq\('management_token_hash', oldHash\)\.eq\('version', existing\.version\)/)
  assert.match(claimRoute, /verifyPushOwnershipProof\(challenge, proof, row\.auth, expiresAt\)/)
  assert.match(claimRoute, /\.eq\('claim_nonce_hash', nonceHash\)/)
  assert.match(claimRoute, /claim_nonce_hash: null, claim_expires_at: null/)
  assert.match(claimRoute, /\.eq\('version', row\.version\)/)
})

test('subscription API uses insert, not endpoint-only upsert; errors never return endpoint/token', () => {
  assert.match(tokenRoute, /\.insert\(/)
  assert.doesNotMatch(tokenRoute, /\.upsert\(/)
  assert.match(tokenRoute, /httpOnly:\s*true/)
  assert.match(tokenRoute, /sameSite:\s*'strict'/)
  assert.doesNotMatch(tokenRoute, /console\.(?:log|error)\([^)]*(?:endpoint|token|auth)/i)
})

test('replay and stale claims are prevented by one-time nonce expiry and conditional consumption', () => {
  assert.match(claimRoute, /CHALLENGE_TTL_MS/)
  assert.match(claimRoute, /claim_nonce_hash: null/)
  assert.match(claimRoute, /\.gte\('claim_expires_at', now\)/)
})

test('missing, malformed, and unrelated management tokens fail validation', () => {
  assert.equal(validManagementToken(undefined), false)
  assert.equal(validManagementToken(''), false)
  assert.equal(validManagementToken('endpoint-only'), false)
  assert.equal(validManagementToken(randomBytes(32).toString('base64url')), true)
})
