import 'server-only'
import { randomUUID } from 'node:crypto'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import type { FounderIdentity } from '@/lib/auth/founderIdentity'

export type AuditResult = 'ok' | 'denied' | 'error' | 'cancelled'

export type AuditInput = {
  actor: FounderIdentity
  action: string
  targetType: string
  targetId?: string | null
  result: AuditResult
  /** 最小化摘要；唔好放完整學生答案、token、secret。 */
  summary?: string | null
  correlationId?: string | null
  meta?: Record<string, unknown>
}

const SENSITIVE_META_KEYS = /^(password|secret|token|cookie|authorization|api[_-]?key|service[_-]?role)$/i

function scrubMeta(meta: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!meta) return {}
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_META_KEYS.test(k)) continue
    if (typeof v === 'string' && v.length > 200) out[k] = `${v.slice(0, 200)}…`
    else out[k] = v
  }
  return out
}

/** 寫入審計事件。表未 migrate 時唔抛爆 caller，只記 safeLog。 */
export async function writeFounderAudit(input: AuditInput): Promise<{ correlationId: string }> {
  const correlationId = input.correlationId?.trim() || randomUUID()
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('founder_audit_events').insert({
      actor_sub: input.actor.googleSub,
      actor_email: input.actor.email,
      action: input.action.slice(0, 80),
      target_type: input.targetType.slice(0, 80),
      target_id: input.targetId ? String(input.targetId).slice(0, 200) : null,
      result: input.result,
      summary: input.summary ? input.summary.slice(0, 500) : null,
      correlation_id: correlationId.slice(0, 80),
      meta: scrubMeta(input.meta),
    })
    if (error) throw error
  } catch (e) {
    safeLog('warn', 'founder audit write skipped/failed', e)
  }
  return { correlationId }
}

export function newCorrelationId(): string {
  return randomUUID()
}
