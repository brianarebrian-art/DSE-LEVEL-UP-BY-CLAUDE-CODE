/**
 * Only allow same-origin relative paths (open-redirect defence).
 * Rejects protocol-relative URLs, absolute URLs, and ambiguous encoded paths.
 */
export function safeInternalPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw || typeof raw !== 'string') return fallback
  const t = raw.trim()
  if (!t.startsWith('/') || /[\\\u0000-\u001f\u007f]/.test(t)) return fallback

  // Decode once to catch encoded separators and controls without changing valid output.
  let decoded: string
  try {
    decoded = decodeURIComponent(t)
  } catch {
    return fallback
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\') || /[\u0000-\u001f\u007f]/.test(decoded)) return fallback

  try {
    const parsed = new URL(t, 'http://localhost')
    if (parsed.origin !== 'http://localhost' || parsed.username || parsed.password) return fallback
  } catch {
    return fallback
  }
  return t
}
