// 裝置 token（Phase 2.3 方案 B 嘅 client 一半）。
//
// ══ 呢串字係咩、唔係咩 ══
// 係：一串 crypto.randomUUID() 出嚟嘅隨機字，存喺 localStorage。
// 唔係：指紋。佢唔由 IP、user-agent、螢幕尺寸、字型清單、時區
//       或者任何硬件特徵推導。兩部一模一樣嘅手機會有兩個唔同 token；
//       同一部機兩個瀏覽器設定檔都係兩個。
//
// 即係話佢識別嘅係「一個瀏覽器設定檔」，唔係「一個人」或者「一部機」。
// 學生清 localStorage 就變新 token —— 繞得過。呢個係刻意接受嘅：
// 一個繞得過嘅機制，換一個唔會追蹤未成年人裝置嘅設計。
//
// ⚠️ 唔准將呢串字放入 URL query。佢會出現喺伺服器日誌、referrer、
// 瀏覽紀錄同分享出去嘅連結入面。一律用 POST body 送。

const KEY = 'dse_device_token'

/**
 * 攞（或第一次生成）本瀏覽器嘅 token。
 *
 * localStorage 用唔到（私隱模式／滿咗）就回 null ——
 * server 收到 null 會當「唔知邊部機」，直接畀返 Plus（fail-open）。
 * 一個開緊無痕模式嘅付費學生，唔應該因此見唔到自己買咗嘅嘢。
 */
export function getDeviceToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const fresh = crypto.randomUUID()
    localStorage.setItem(KEY, fresh)
    return fresh
  } catch {
    return null
  }
}
