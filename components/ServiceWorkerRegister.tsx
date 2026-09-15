'use client'

import { useEffect } from 'react'
import { offlineEnabled, SW_URL } from '@/lib/pwa/swUrl'

// 離線層嘅登記點（root Providers 掛載，唔 render 任何嘢）。
//
// 開咗離線：登記 SW_URL，然後將呢一頁用過嘅同源資源報畀 SW 補存。
//   點解要補存：SW 係喺第一次載入【之後】先裝好，嗰一頁嘅 HTML 同 chunk
//   冇經過佢。唔補的話，學生第一次開完即刻斷網，reload 會缺 chunk ——
//   睇到個殼但撳乜都冇反應，比出「冇網絡」頁更差。
//
// 關咗離線（回滾）：如果部機已經裝咗離線版（scriptURL 帶 offline=1），
//   就用冇離線嘅 URL 重新登記。新 SW activate 時會刪晒離線快取。
//   冇登記過嘅機【唔會】因為呢度而多咗個 SW —— 推送功能自己會登記。
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let cancelled = false

    const run = async () => {
      try {
        if (!offlineEnabled()) {
          const reg = await navigator.serviceWorker.getRegistration('/')
          const url = reg?.active?.scriptURL ?? reg?.waiting?.scriptURL ?? reg?.installing?.scriptURL ?? ''
          if (url.includes('offline=1')) await navigator.serviceWorker.register(SW_URL)
          return
        }
        await navigator.serviceWorker.register(SW_URL)
        const ready = await navigator.serviceWorker.ready
        if (cancelled) return
        const origin = location.origin
        const urls = [
          location.href,
          ...performance
            .getEntriesByType('resource')
            .map((e) => e.name)
            .filter((u) => u.startsWith(origin)),
        ]
        ready.active?.postMessage({ type: 'dse-warm', urls })
      } catch {
        /* 登記失敗（私隱模式、封鎖咗）—— 網站照常用，只係冇離線 */
      }
    }

    // 等頁面載入完先做：唔同首屏搶頻寬，而且 performance entries 先齊。
    if (document.readyState === 'complete') void run()
    else window.addEventListener('load', () => void run(), { once: true })
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
