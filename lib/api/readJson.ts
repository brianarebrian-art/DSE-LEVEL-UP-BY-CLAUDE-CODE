// Reads a JSON request body with a size ceiling (UX loop 28, 2026-09-30; hardening prompt §30).
//
// Before this, every API route called `request.json()` directly, so a signed-in client could
// send a body of any size and /api/progress would store it. Measured in production on
// 2026-09-30: the largest user_progress row is 29.6 KB (median 1.1 KB, 214 rows); the largest
// user_settings row is 308 bytes. The limits below leave ample room for real use.
//
// The rate limiter in proxy.ts is per instance (lib/rateLimit.ts); this ceiling holds on every
// instance because it is checked on each request.
// The limit counts bytes yielded by Request.body after upstream runtime/proxy processing.
// Vercel's Content-Encoding decompression point has not been independently verified; this
// helper is not a decompression-bomb defense and does not replace platform-level limits.

export const BODY_LIMIT = {
  /** /api/progress: the whole progress snapshot. About 35 times today's largest row. */
  progress: 1024 * 1024,
  /** Every other JSON route: settings, subscriptions, reports, verification, deletion. */
  small: 64 * 1024,
} as const

export type ReadResult<T> = { ok: true; value: T } | { ok: false; status: 400 | 413; error: string }

export async function readJsonLimited<T = unknown>(request: Request, maxBytes: number): Promise<ReadResult<T>> {
  const contentLength = request.headers.get('content-length')
  if (contentLength !== null && /^\d+$/.test(contentLength)) {
    const declared = Number(contentLength)
    if (Number.isFinite(declared) && declared > maxBytes) {
      try { await request.body?.cancel() } catch { /* preserve early 413 */ }
      return { ok: false, status: 413, error: 'body too large' }
    }
  }

  const reader = request.body?.getReader()
  if (!reader) return { ok: false, status: 400, error: 'unreadable body' }
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let text = ''
  let bytesRead = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!(value instanceof Uint8Array)) return { ok: false, status: 400, error: 'unreadable body' }
      if (value.byteLength > maxBytes - bytesRead) {
        try {
          await reader.cancel()
        } catch {
          // Cancellation is best-effort; preserve the size-limit result.
        }
        return { ok: false, status: 413, error: 'body too large' }
      }
      bytesRead += value.byteLength
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
  } catch {
    return { ok: false, status: 400, error: 'unreadable body' }
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // A failed read/cancel may leave the stream locked; do not mask the result.
    }
  }

  try {
    return { ok: true, value: JSON.parse(text) as T }
  } catch {
    return { ok: false, status: 400, error: 'invalid JSON body' }
  }
}
