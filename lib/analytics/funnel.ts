export type FunnelStep =
  | 'landing_view'
  | 'click_start'
  | 'register_complete'
  | 'finish_first_session'

const STORAGE_KEY = 'dse_funnel_v1'

export function recordFunnelStep(step: FunnelStep): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const metrics: Record<string, number> = raw ? JSON.parse(raw) : {}
    metrics[step] = (metrics[step] || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
  } catch {
    // 忽略 localStorage 配額或私密瀏覽錯誤
  }
}

export function getFunnelMetrics(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
