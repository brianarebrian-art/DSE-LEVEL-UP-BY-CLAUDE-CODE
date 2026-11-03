import { createHash } from 'node:crypto'

export interface AuditLogEntry {
  actorId?: string | null
  actorRole: 'student' | 'reviewer' | 'admin' | 'founder' | 'system'
  action: string
  resourceType: string
  resourceId?: string | null
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown>
}

export function hashString(input: string | null | undefined): string {
  if (!input) return 'anonymous'
  return createHash('sha256').update(input).digest('hex').slice(0, 32)
}

export function sanitizeAuditMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
  const clean = { ...(metadata ?? {}) }
  delete clean.password
  delete clean.token
  delete clean.secret
  delete clean.key
  return clean
}

export function formatAuditRow(entry: AuditLogEntry) {
  return {
    actor_id: entry.actorId ?? null,
    actor_role: entry.actorRole,
    action: entry.action,
    resource_type: entry.resourceType,
    resource_id: entry.resourceId ?? null,
    ip_hash: hashString(entry.ip),
    user_agent_hash: hashString(entry.userAgent),
    metadata: sanitizeAuditMetadata(entry.metadata),
    timestamp: new Date().toISOString(),
  }
}
