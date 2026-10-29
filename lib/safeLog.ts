// Production-safe logging. In production, log only a scrubbed message + short code
// (never the full object, which can carry query text / row data / tokens into Vercel
// logs). In dev, log the whole thing for debugging.
//
// SEC-R1-002 / FIX-DSE-APP-002: scrub emails, bearer/JWT, push endpoints, and
// connection strings out of the message before it hits production sinks.
import { safeErrorFields } from '@/lib/logScrub'

type Level = 'error' | 'warn' | 'info'

export function safeLog(level: Level, context: string, err?: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    const { message, code } = safeErrorFields(err)
    const codeSuffix = code ? ` (code: ${code})` : ''
    console[level](`[${context}] ${level.toUpperCase()}: ${message}${codeSuffix}`)
  } else {
    console[level](`[${context}]`, err)
  }
}
