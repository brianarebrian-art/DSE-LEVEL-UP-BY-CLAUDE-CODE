// proxy.ts 用嘅滑動窗口限流 —— 抽出嚟係為咗測得到行為（proxy.ts 本身
// import next/server，而且冇 export 呢部分）。純函數，冇 I/O。
//
// ⚠️ 誠實限制（同 proxy.ts 檔頭一致）：Vercel 上面每個 instance 各自有一個 Map，
// 唔共享 —— 呢個係「削峰」，唔係分散式限流。真正嘅分散式限流要喺 Vercel Firewall 設。

export interface Limiter {
  allow(key: string, windowMs: number, limit: number, now?: number): boolean
  size(): number
}

/**
 * @param maxKeys Map 最多記幾多個 key。
 *
 * 2026-09-25 保安審計：原本只會喺超過 2000 個 key 嗰陣，清走「10 分鐘內冇活動」
 * 嘅 key。短時間內有大量唔同 IP 嘅話，佢哋全部都未過 10 分鐘，一個都清唔走，
 * Map 就一路長。而家清完之後仲超過上限，就由最舊嗰啲開始丟。
 *
 * 丟咗一個 key ＝ 嗰個 IP 嘅計數重新開始。呢個係刻意嘅取捨：記憶體有上限
 * 比每個 IP 計得準更重要，因為一個食爆記憶體嘅 instance 會令【所有人】都用唔到。
 */
export function createLimiter({ maxKeys = 2000, staleMs = 10 * 60_000 } = {}): Limiter {
  const hits = new Map<string, number[]>()

  function allow(key: string, windowMs: number, limit: number, now = Date.now()): boolean {
    const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    if (list.length >= limit) {
      hits.set(key, list)
      return false
    }
    list.push(now)
    // 刪咗再 set，令呢個 key 排返去 Map 最尾 —— 下面「由最舊開始丟」先會丟到真正最耐冇郁嘅
    hits.delete(key)
    hits.set(key, list)
    if (hits.size > maxKeys) {
      for (const [k, v] of hits) if (v.every((t) => now - t > staleMs)) hits.delete(k)
      for (const k of hits.keys()) {
        if (hits.size <= maxKeys) break
        hits.delete(k)
      }
    }
    return true
  }

  return { allow, size: () => hits.size }
}

/**
 * 行嚴格桶（10 分鐘 30 次）嘅路徑：會被用嚟洗 OAuth 嘅入口。
 * Supabase Auth：`/auth/callback`（code exchange）。
 * 遷移 API：`/api/auth/migrate-legacy`（已登入，但防刷）。
 *
 * 舊 Auth.js／Better Auth 路徑已拆除；保留 pattern 只係防殘餘探測。
 */
export function isAuthSensitivePath(pathname: string): boolean {
  if (pathname === '/auth/callback' || pathname.startsWith('/auth/callback/')) return true
  if (pathname === '/api/auth/migrate-legacy') return true
  return /^\/api\/auth\/(signin|callback|sign-in|sign-up)(\/|$)/.test(pathname)
}
