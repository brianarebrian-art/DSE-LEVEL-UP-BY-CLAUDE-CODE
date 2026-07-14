// Production-safe logging. In production, log only the error message + code (never the full
// object, which can carry query text / row data into Vercel logs). In dev, log the
// whole thing for debugging. Vercel logs are private to the project owner, so this is
// defence-in-depth, not a critical control.
type Level = 'error' | 'warn' | 'info'

export function safeLog(level: Level, context: string, err?: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    const e = err as { message?: string; code?: string } | undefined
    const code = e?.code ? ` (code: ${e.code})` : ''
    console[level](`[${context}] ${level.toUpperCase()}: ${e?.message ?? 'error'}${code}`)
  } else {
    console[level](`[${context}]`, err)
  }
}
