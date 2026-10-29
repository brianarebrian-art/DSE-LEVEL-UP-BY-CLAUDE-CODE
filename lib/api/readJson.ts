// Reads a JSON request body with a size ceiling (UX loop 28, 2026-09-30; hardening prompt §30).
//
// Before this, every API route called `request.json()` directly, so a signed-in client could
// send a body of any size and /api/progress would store it. Measured in production on
// 2026-09-30: the largest user_progress row is 29.6 KB (median 1.1 KB, 214 rows); the largest
// user_settings row is 308 bytes. The limits below leave ample room for real use.
//
// The rate limiter in proxy.ts is per instance (lib/rateLimit.ts); this ceiling holds on every
// instance because it is checked on each request.
//
// SEC-R1-004 / FIX-DSE-APP-004: count bytes while streaming. Content-Length is only a
// pre-check — never the sole defence. Without a length header (or with a lying one), we
// still stop reading as soon as actual bytes exceed maxBytes, instead of buffering first.

export const BODY_LIMIT = {
  /** /api/progress: the whole progress snapshot. About 35 times today's largest row. */
  progress: 1024 * 1024,
  /** Every other JSON route: settings, subscriptions, reports, verification, deletion. */
  small: 64 * 1024,
} as const

export type ReadResult<T> = { ok: true; value: T } | { ok: false; status: 400 | 413; error: string }

function concatChunks(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.byteLength
  }
  return out
}

export async function readJsonLimited<T = unknown>(request: Request, maxBytes: number): Promise<ReadResult<T>> {
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, status: 413, error: 'body too large' }
  }

  const body = request.body
  // No stream (e.g. already-consumed body, or empty): treat as zero bytes then parse.
  if (!body) {
    try {
      return { ok: true, value: JSON.parse('') as T }
    } catch {
      return { ok: false, status: 400, error: 'invalid JSON body' }
    }
  }

  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value || value.byteLength === 0) continue
      total += value.byteLength
      if (total > maxBytes) {
        // Stop reading immediately — do not buffer the rest of an oversized body.
        await reader.cancel('body too large').catch(() => {})
        return { ok: false, status: 413, error: 'body too large' }
      }
      chunks.push(value)
    }
  } catch {
    await reader.cancel('unreadable body').catch(() => {})
    return { ok: false, status: 400, error: 'unreadable body' }
  }

  const text = new TextDecoder().decode(concatChunks(chunks, total))
  try {
    return { ok: true, value: JSON.parse(text) as T }
  } catch {
    return { ok: false, status: 400, error: 'invalid JSON body' }
  }
}
