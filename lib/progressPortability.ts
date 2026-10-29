// Shared shape checks for DataPortability import (and tests).
// Keeps student progress files from injecting mathematically impossible attempts
// or empty result shells that crash the result page.

export function isUsableAttemptShape(a: unknown): boolean {
  if (typeof a !== 'object' || a === null) return false
  const r = a as Record<string, unknown>
  if (typeof r.subjectId !== 'string') return false
  if (typeof r.score !== 'number' || typeof r.total !== 'number' || typeof r.timestamp !== 'number') return false
  if (!Number.isFinite(r.score) || !Number.isFinite(r.total) || !Number.isFinite(r.timestamp)) return false
  if (!Number.isInteger(r.total) || r.total <= 0) return false
  if (!Number.isInteger(r.score) || r.score < 0 || r.score > r.total) return false
  if (!Array.isArray(r.topicResults)) return false
  return true
}

export function sanitizeProgressArray(raw: unknown): unknown[] | null {
  if (!Array.isArray(raw)) return null
  const kept = raw.filter(isUsableAttemptShape)
  return kept
}

export function isUsableResultShape(v: unknown): boolean {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  const r = v as Record<string, unknown>
  if (typeof r.score !== 'number' || typeof r.total !== 'number' || typeof r.elapsed !== 'number') return false
  if (!Number.isFinite(r.score) || !Number.isFinite(r.total) || !Number.isFinite(r.elapsed)) return false
  if (!Number.isInteger(r.total) || r.total <= 0) return false
  if (!Number.isInteger(r.score) || r.score < 0 || r.score > r.total) return false
  if (!Array.isArray(r.topicResults)) return false
  return true
}

export function sanitizePortableValue(key: string, value: unknown): unknown | undefined {
  if (key === 'dse_progress') {
    const arr = sanitizeProgressArray(value)
    return arr && arr.length > 0 ? arr : undefined
  }
  if (key === 'dse_result') {
    return isUsableResultShape(value) ? value : undefined
  }
  if (key === 'dse_reverse_log') {
    return Array.isArray(value) ? value : undefined
  }
  if (key === 'dse_topic_stats' || key === 'dse_review_done' || key === 'dse_daily_spectrum') {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value
    return undefined
  }
  return undefined
}
