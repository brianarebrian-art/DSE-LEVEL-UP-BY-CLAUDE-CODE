// GET /api/health 嘅狀態彙總。純函數，冇 I/O，方便測試。
// 真正打去 Supabase 嘅查詢喺 app/api/health/route.ts。

export const HEALTH_SERVICE = 'dse-level-up' as const

/** 資料庫有回應但慢過呢個數，整體標 degraded（仍然 200）。 */
export const DB_SLOW_MS = 500

/**
 * 單次探測最長等幾耐。成個 handler 目標係 1 秒內返回，留少少畀序列化同 proxy。
 * 超時就當連唔上，唔好吊住個監控。
 */
export const DB_TIMEOUT_MS = 800

export type HealthStatus = 'ok' | 'degraded' | 'error'

export type DatabaseReason = 'not_configured' | 'unreachable' | 'slow'

export interface DatabaseCheck {
  status: HealthStatus
  latencyMs: number
  reason?: DatabaseReason
}

export interface HealthBody {
  status: HealthStatus
  service: typeof HEALTH_SERVICE
  timestamp: string
  checks: {
    app: { status: 'ok' }
    database: DatabaseCheck
  }
}

export function overallStatus(parts: readonly HealthStatus[]): HealthStatus {
  if (parts.includes('error')) return 'error'
  if (parts.includes('degraded')) return 'degraded'
  return 'ok'
}

/** error → 503，等監控分到「關鍵依賴掛咗」同「慢但仲應到」。ok／degraded 都係 200。 */
export function healthHttpStatus(status: HealthStatus): 200 | 503 {
  return status === 'error' ? 503 : 200
}

export function buildHealthBody(database: DatabaseCheck, now = new Date()): HealthBody {
  return {
    status: overallStatus(['ok', database.status]),
    service: HEALTH_SERVICE,
    timestamp: now.toISOString(),
    checks: {
      app: { status: 'ok' },
      database,
    },
  }
}

/**
 * 將一次資料庫探測變成 checks.database。
 * `configured === false` 時唔會呼叫 query，避免未設定 key 都去起 client。
 */
export async function probeDatabase(
  configured: boolean,
  probe: { query: () => Promise<{ error: unknown }> },
  now: () => number = Date.now,
): Promise<DatabaseCheck> {
  if (!configured) return { status: 'error', latencyMs: 0, reason: 'not_configured' }
  const started = now()
  try {
    const { error } = await probe.query()
    const latencyMs = Math.max(0, now() - started)
    if (error) return { status: 'error', latencyMs, reason: 'unreachable' }
    if (latencyMs >= DB_SLOW_MS) return { status: 'degraded', latencyMs, reason: 'slow' }
    return { status: 'ok', latencyMs }
  } catch {
    return { status: 'error', latencyMs: Math.max(0, now() - started), reason: 'unreachable' }
  }
}
