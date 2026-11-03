/**
 * Only allow same-origin relative paths (open-redirect defence).
 * Rejects protocol-relative URLs, absolute URLs, backslashes, control characters,
 * URL-encoded path separators, and executable schemes.
 */
export function safeInternalPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw || typeof raw !== 'string') return fallback
  const t = raw.trim()

  // Must begin with a single '/', not '//' or '/\'
  if (!t.startsWith('/') || t.startsWith('//') || t.startsWith('/\\') || t.includes('\\')) return fallback

  // Reject control characters (0x00-0x1F, 0x7F)
  if (/[\x00-\x1f\x7f]/.test(t)) return fallback

  // Reject URL-encoded separators (%2f, %5c) and null bytes (%00)
  if (/%(2f|5c|00)/i.test(t)) return fallback

  // Reject explicit schemes or executable pseudo-schemes
  if (t.includes('://') || /javascript:/i.test(t) || /data:/i.test(t)) return fallback

  try {
    // Validate path resolution against a dummy origin
    const parsed = new URL(t, 'http://localhost')
    if (parsed.origin !== 'http://localhost') return fallback
    if (!parsed.pathname.startsWith('/') || parsed.pathname.startsWith('//')) return fallback
    return t
  } catch {
    return fallback
  }
}
