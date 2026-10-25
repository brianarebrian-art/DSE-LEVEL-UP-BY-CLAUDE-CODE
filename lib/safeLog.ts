import { createCorrelationId, normalizeCorrelationId } from '@/lib/api/correlationId'

type Level = 'error' | 'warn' | 'info'

// Public log fields are deliberately allowlisted. Never emit err.message, stack,
// SQL, request data, table names, cookies, tokens, or arbitrary context text.
const OPERATION_CODES = new Map<string, string>([
  ['getSyncUserId: google account has no accountId', 'auth.sync.google_account_id_missing'],
  ['getSyncUserId: listUserAccounts failed — refusing to guess a key', 'auth.sync.account_lookup_failed'],
  ['getSyncUserId: identity mapping failed — refusing to guess a key', 'auth.sync.identity_mapping_failed'],
  ['api/feedback insert', 'api.feedback.insert'],
  ['api/feedback', 'api.feedback'],
  ['cron/exam-day-nudge:select', 'cron.push.select'],
  ['cron/exam-day-nudge:bookkeeping', 'cron.push.bookkeeping'],
  ['api/sync/settings GET', 'api.sync.settings.get'],
  ['api/sync/settings DELETE', 'api.sync.settings.delete'],
  ['api/sync/settings POST', 'api.sync.settings.post'],
  ['admin users stats failed', 'api.admin.users_stats'],
  ['api/admin decisions GET failed', 'api.admin.decisions.get'],
  ['api/admin decisions POST failed', 'api.admin.decisions.post'],
  ['api/admin quality GET failed', 'api.admin.quality.get'],
  ['api/admin quality POST failed', 'api.admin.quality.post'],
  ['api/result/verify', 'api.result.verify'],
  ['api/account/delete partial', 'api.account.delete.partial'],
  ['api/account/delete', 'api.account.delete'],
  ['push/subscribe', 'api.push.subscribe'],
  ['push/unsubscribe', 'api.push.unsubscribe'],
  ['api/progress GET', 'api.progress.get'],
  ['api/progress POST', 'api.progress.post'],
  ['api/practice-count rpc', 'api.practice_count.rpc'],
  ['api/practice-count', 'api.practice_count'],
  ['api/privacy/consent GET', 'api.privacy.consent.get'],
  ['api/privacy/consent POST', 'api.privacy.consent.post'],
  ['admin: sensei dir unreadable', 'admin.sensei_dir.read'],
  ['admin: drafts dir unreadable', 'admin.drafts_dir.read'],
  ['admin: supabase unavailable, local-only mode', 'admin.supabase.unavailable'],
])

const ALLOWED_ERROR_CODES = new Set([
  '23503', '23505', '23514', '42501', '42703', '42P01', '57014',
  'PGRST116', 'PGRST301', 'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED',
  'ENOTFOUND', 'EAI_AGAIN', 'APP_PARTIAL_FAILURE', 'APP_INTERNAL_FAILURE',
])

function operationCode(context: string): string {
  const exact = OPERATION_CODES.get(context)
  if (exact) return exact
  if (context.startsWith('admin: bad sensei drafts file ')) return 'admin.sensei_draft.invalid'
  if (context.startsWith('admin: bad drafts file ')) return 'admin.draft.invalid'
  return 'app.unclassified'
}

function errorCode(err: unknown): string {
  try {
    if (!err || typeof err !== 'object') return 'UNKNOWN'
    const code = (err as { code?: unknown }).code
    return typeof code === 'string' && ALLOWED_ERROR_CODES.has(code) ? code : 'UNKNOWN'
  } catch {
    return 'UNKNOWN'
  }
}

/** Emits only bounded, low-sensitivity diagnostic metadata in every environment. */
export function safeLog(level: Level, context: string, err?: unknown, correlationId?: string): string {
  const id = normalizeCorrelationId(correlationId) ?? createCorrelationId()
  const payload = JSON.stringify({
    event: 'application_error',
    operation: operationCode(context),
    code: errorCode(err),
    correlationId: id,
  })
  console[level](`[safe-log] ${payload}`)
  return id
}
