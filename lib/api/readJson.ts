// Reads a JSON request body with a size ceiling (UX loop 28, 2026-09-30; hardening prompt §30).
//
// Before this, every API route called `request.json()` directly, so a signed-in client could
// send a body of any size and /api/progress would store it. Measured in production on
// 2026-09-30: the largest user_progress row is 29.6 KB (median 1.1 KB, 214 rows); the largest
// user_settings row is 308 bytes. The limits below leave ample room for real use.
//
// The rate limiter in proxy.ts is per instance (lib/rateLimit.ts); this ceiling holds on every
// instance because it is checked on each request.

export const BODY_LIMIT = {
  /** /api/progress: the whole progress snapshot. About 35 times today's largest row. */
  progress: 1024 * 1024,
  /** Every other JSON route: settings, subscriptions, reports, verification, deletion. */
  small: 64 * 1024,
} as const

export type ReadResult<T> = { ok: true; value: T } | { ok: false; status: 400 | 413; error: string }

export async function readJsonLimited<T = unknown>(request: Request, maxBytes: number): Promise<ReadResult<T>> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413, error: 'body too large' }
  let text: string
  try {
    text = await request.text()
  } catch {
    return { ok: false, status: 400, error: 'unreadable body' }
  }
  // Checked again after reading: the header can be absent or wrong.
  if (new TextEncoder().encode(text).length > maxBytes) return { ok: false, status: 413, error: 'body too large' }
  try {
    return { ok: true, value: JSON.parse(text) as T }
  } catch {
    return { ok: false, status: 400, error: 'invalid JSON body' }
  }
}
