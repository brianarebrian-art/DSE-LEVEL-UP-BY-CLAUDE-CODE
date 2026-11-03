import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const { hashString, sanitizeAuditMetadata, formatAuditRow } = await import('../auth/securityAuditCore.ts')

test('SEC-AUDIT-001: formatAuditRow scrubs passwords, tokens and secrets from metadata', () => {
  const dirtyMetadata = {
    password: 'super-secret-password',
    token: 'jwt-bearer-token',
    secret: 'service-key',
    key: 'private-key',
    allowedField: 'safe-public-data',
    score: 95,
  }

  const cleaned = sanitizeAuditMetadata(dirtyMetadata)
  assert.equal(cleaned.password, undefined, 'password must be deleted')
  assert.equal(cleaned.token, undefined, 'token must be deleted')
  assert.equal(cleaned.secret, undefined, 'secret must be deleted')
  assert.equal(cleaned.key, undefined, 'key must be deleted')
  assert.equal(cleaned.allowedField, 'safe-public-data')
  assert.equal(cleaned.score, 95)
})

test('SEC-AUDIT-002: hashString hashes IP addresses and handles nulls predictably', () => {
  const ip1 = '192.168.1.1'
  const ip2 = '192.168.1.1'
  const ip3 = '10.0.0.1'

  assert.equal(hashString(null), 'anonymous')
  assert.equal(hashString(undefined), 'anonymous')
  assert.equal(hashString(ip1), hashString(ip2), 'Identical IPs must generate identical hashes')
  assert.notEqual(hashString(ip1), hashString(ip3), 'Different IPs must generate distinct hashes')
  assert.equal(hashString(ip1).length, 32, 'Hash should be 32 characters')
  assert.doesNotMatch(hashString(ip1), /192\.168/, 'Hash must not leak cleartext IP octets')
})

test('SEC-AUDIT-003: formatAuditRow generates correct schema conforming row', () => {
  const row = formatAuditRow({
    actorId: 'test-user-id',
    actorRole: 'student',
    action: 'sync_progress',
    resourceType: 'user_progress',
    resourceId: 'test-user-id',
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 TestSuite',
    metadata: {
      password: 'cleartext-password',
      count: 10,
    },
  })

  assert.equal(row.actor_id, 'test-user-id')
  assert.equal(row.actor_role, 'student')
  assert.equal(row.action, 'sync_progress')
  assert.equal(row.resource_type, 'user_progress')
  assert.equal(row.metadata.password, undefined)
  assert.equal(row.metadata.count, 10)
  assert.ok(row.timestamp, 'timestamp must be defined')
})

test('SEC-IDOR-004: Sensitive endpoints enforce requireVerifiedUser server-side authorization', () => {
  const progressRoute = readFileSync(resolve(process.cwd(), 'app/api/progress/route.ts'), 'utf8')
  const settingsRoute = readFileSync(resolve(process.cwd(), 'app/api/sync/settings/route.ts'), 'utf8')

  assert.match(progressRoute, /requireVerifiedUser\(\)/, '/api/progress must enforce verified identity')
  assert.match(progressRoute, /recordSecurityAudit\(/, '/api/progress must audit mutations')

  assert.match(settingsRoute, /requireVerifiedUser\(\)/, '/api/sync/settings must enforce verified identity')
  assert.match(settingsRoute, /recordSecurityAudit\(/, '/api/sync/settings must audit mutations')
})

test('SEC-MIGRATION-005: audit_logs and profiles role migrations follow Deny-All RLS model', () => {
  const migration = readFileSync(resolve(process.cwd(), 'supabase/migrations/0032_security_baseline_audit_and_roles.sql'), 'utf8')
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/, 'audit_logs must have RLS enabled')
  assert.match(migration, /REVOKE ALL ON TABLE public\.audit_logs FROM anon, authenticated, public/, 'Must revoke public access')
  assert.match(migration, /GRANT ALL ON TABLE public\.audit_logs TO service_role/, 'Only service_role allowed')
  assert.match(migration, /profiles ADD COLUMN role/, 'Profiles must support role hierarchy')
})
