// Service worker 登記 URL —— 【唯一】來源。
//
// ⚠️ 全 repo 登記 SW 嘅地方都要用 SW_URL，唔可以自己寫 '/sw.js'。
//    同一個 scope 只可以有一個 SW；兩個地方用唔同 URL 登記，後登記嗰個
//    會蓋咗前面嗰個 —— 推送訂閱一登記 '/sw.js'，離線功能就會靜靜哋熄咗。
//    lib/__tests__/sw-offline.test.mts 測試 ④ 守住。
//
// 開關（分階段 rollout，docs/top20-features-ledger.md #03 嘅前提之一）：
//   NEXT_PUBLIC_SW_OFFLINE='1' → 開
//   NEXT_PUBLIC_SW_OFFLINE='0' → 關（回滾：已裝咗離線版嘅機會換返冇離線嘅版本，
//                                 新 SW activate 時刪晒離線快取）
//   未設定                     → development 開、production 關
// 生產環境幾時開，由創辦人喺 Vercel 設定決定，唔係 deploy 咗就自動開。

export function offlineEnabled(): boolean {
  const v = process.env.NEXT_PUBLIC_SW_OFFLINE
  if (v === '1') return true
  if (v === '0') return false
  return process.env.NODE_ENV !== 'production'
}

export const SW_URL = offlineEnabled() ? '/sw.js?offline=1' : '/sw.js'
