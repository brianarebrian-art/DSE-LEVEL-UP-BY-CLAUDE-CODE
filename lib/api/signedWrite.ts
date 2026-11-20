// Gate for product-improvement writes (session feedback, /feedback, question reports).
//
// A Supabase Auth user id is required before insert. The id is not copied onto the row:
// these tables still have no user_id, email, IP or device column. Callers that pass a
// missing id must not invoke `insert` at all.

export type DbWriteError = { code?: string } | null

export type SignedInsertOutcome =
  | { status: 'unauthenticated' }
  | { status: 'ok' }
  | { status: 'error'; code?: string }

export async function insertOnlyIfSignedIn<T>(
  userId: string | null,
  row: T,
  // Infer T from the row only. The callback parameter is contravariant, so if it
  // is also an inference site a union of row shapes collapses to `never`.
  insert: (row: NoInfer<T>) => Promise<{ error: DbWriteError }>,
): Promise<SignedInsertOutcome> {
  if (typeof userId !== 'string' || userId.length === 0) return { status: 'unauthenticated' }
  const { error } = await insert(row)
  if (error) return { status: 'error', code: error.code }
  return { status: 'ok' }
}

/** Same 401 body as /api/progress. Missing-table codes stay 503. */
export function signedInsertHttp(outcome: SignedInsertOutcome): {
  body: { ok: true } | { error: 'unauthenticated' | 'unavailable' | 'internal error' }
  status: 200 | 401 | 503 | 500
} {
  if (outcome.status === 'unauthenticated') {
    return { body: { error: 'unauthenticated' }, status: 401 }
  }
  if (outcome.status === 'error') {
    const missing = outcome.code === 'PGRST205' || outcome.code === '42P01'
    return {
      body: { error: missing ? 'unavailable' : 'internal error' },
      status: missing ? 503 : 500,
    }
  }
  return { body: { ok: true }, status: 200 }
}
