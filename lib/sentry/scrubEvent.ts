const SAFE_EXCEPTION_TYPES = new Set(['Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError', 'NetworkError'])
const SAFE_FRAME_TEXT = /^[A-Za-z0-9_.$<>-]{1,100}$/
const SAFE_FILENAME = /^[A-Za-z0-9_.()[\]-]{1,120}$/
const EVENT_ID = /^[a-f0-9]{32}$/i

function safeFrame(frame: unknown) {
  if (!frame || typeof frame !== 'object') return null
  const value = frame as Record<string, unknown>
  let filename = '[redacted]'
  if (typeof value.filename === 'string') {
    const base = value.filename.split(/[?#]/, 1)[0].replace(/\\/g, '/').split('/').pop() ?? ''
    if (SAFE_FILENAME.test(base)) filename = base
  }
  const fn = typeof value.function === 'string' && SAFE_FRAME_TEXT.test(value.function) ? value.function : '<unknown>'
  const line = Number.isInteger(value.lineno) && (value.lineno as number) >= 0 ? value.lineno : undefined
  const column = Number.isInteger(value.colno) && (value.colno as number) >= 0 ? value.colno : undefined
  return { filename, function: fn, lineno: line, colno: column, in_app: value.in_app === true }
}

/** Scrub all user/request/error content before an event reaches Sentry. */
export function scrubSentryEvent<T extends object>(event: T): T {
  const source = event as Record<string, unknown>
  const safe = { ...source }
  const values = (source.exception as { values?: unknown[] } | undefined)?.values ?? []
  const firstType = values.length && values[0] && typeof values[0] === 'object'
    ? (values[0] as Record<string, unknown>).type
    : undefined
  const safeType = typeof firstType === 'string' && SAFE_EXCEPTION_TYPES.has(firstType) ? firstType : 'Error'
  const safeValues = values.slice(0, 5).map((item) => {
    const value = item && typeof item === 'object' ? item as Record<string, unknown> : {}
    const stack = value.stacktrace && typeof value.stacktrace === 'object'
      ? (value.stacktrace as Record<string, unknown>).frames
      : undefined
    const frames = Array.isArray(stack) ? stack.map(safeFrame).filter(Boolean).slice(-40) : []
    return {
      type: typeof value.type === 'string' && SAFE_EXCEPTION_TYPES.has(value.type) ? value.type : safeType,
      value: 'UNCLASSIFIED_ERROR',
      ...(frames.length ? { stacktrace: { frames } } : {}),
    }
  })

  for (const key of [
    'request', 'user', 'extra', 'breadcrumbs', 'contexts', 'debug_meta', 'modules',
    'transaction', 'culprit', 'logentry', 'message', 'fingerprint', 'attachments',
    'spans', 'measurements', 'profile',
  ]) delete safe[key]

  safe.exception = safeValues.length ? { values: safeValues } : { values: [{ type: safeType, value: 'UNCLASSIFIED_ERROR' }] }
  safe.tags = {
    safe_error_type: safeType,
    ...(typeof source.event_id === 'string' && EVENT_ID.test(source.event_id)
      ? { correlation_id: source.event_id.toLowerCase() }
      : {}),
    ...((source.tags as Record<string, unknown> | undefined)?.smoke_test === 'true'
      ? { smoke_test: 'true' }
      : {}),
  }
  return safe as T
}
