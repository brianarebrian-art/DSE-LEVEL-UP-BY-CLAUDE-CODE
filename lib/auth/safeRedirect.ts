/**
 * Only allow same-origin relative paths (open-redirect defence).
 * Rejects protocol-relative URLs and absolute URLs.
 */
export function safeInternalPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw || typeof raw !== 'string') return fallback
  const t = raw.trim()
  if (!t.startsWith('/') || t.startsWith('//') || t.includes('\\')) return fallback
  if (t.includes('://')) return fallback
  return t
}
