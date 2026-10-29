// Client-safe account-erasure error bodies (FIX-DSE-APP-003 / SEC-R1-003).
//
// Partial deletion must not report success, but the browser must not receive
// schema/table names, SQL, or stack traces. Founders diagnose via correlationId
// plus a server log that keeps step labels off the wire.

import { randomUUID } from 'node:crypto'

export const PARTIAL_ERASURE = 'partial_erasure' as const
export const INTERNAL_ERASURE_ERROR = 'internal_error' as const

export type PartialErasureClientBody = {
  error: typeof PARTIAL_ERASURE
  correlationId: string
}

export type InternalErasureClientBody = {
  error: typeof INTERNAL_ERASURE_ERROR
  correlationId: string
}

/** Build the public partial-failure payload and the matching server log line. */
export function makePartialErasureFailure(failedSteps: readonly string[]): {
  correlationId: string
  clientBody: PartialErasureClientBody
  /** For safeLog `.message` — includes step labels for operator diagnosis only. */
  logMessage: string
  logCode: typeof PARTIAL_ERASURE
} {
  const correlationId = randomUUID()
  const n = failedSteps.length
  // Step labels stay server-side. Do not put this string (or failedSteps) on the wire.
  const logMessage = `partial_erasure cid=${correlationId} n=${n} steps=${failedSteps.join(',')}`
  return {
    correlationId,
    clientBody: { error: PARTIAL_ERASURE, correlationId },
    logMessage,
    logCode: PARTIAL_ERASURE,
  }
}

export function makeInternalErasureFailure(): {
  correlationId: string
  clientBody: InternalErasureClientBody
} {
  const correlationId = randomUUID()
  return {
    correlationId,
    clientBody: { error: INTERNAL_ERASURE_ERROR, correlationId },
  }
}

/** True if a JSON-serialised client body appears to name a schema table. */
export function clientBodyLeaksTableName(
  body: object,
  knownTables: readonly string[],
): string | null {
  const wire = JSON.stringify(body)
  if (Object.prototype.hasOwnProperty.call(body, 'tables')) return 'tables'
  for (const t of knownTables) {
    if (t && wire.includes(t)) return t
  }
  return null
}
