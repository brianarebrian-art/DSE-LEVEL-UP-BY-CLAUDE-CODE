'use client'

import { useEffect, useState } from 'react'
import { getDeviceToken } from './deviceToken'

// Client 端攞 Plus 狀態。
//
// ⚠️ 呢個【唔係】安全邊界。回傳值住喺 React state，學生用 devtools 改到。
// 任何真正需要守住嘅嘢（例如將來生成 PDF、開計時卷）必須喺 server 再核一次
// getEntitlement()。呢個 hook 淨係決定「畫唔畫個 UI」。
//
// ⚠️ 亦【唔准】攞嚟鎖 §3.1 永久免費層。呢度 return 'free' 唔應該令任何
// 免費功能消失 —— 佢淨係決定加速工具嘅入口出唔出現。

export type PlusTierState = { tier: 'free' | 'plus'; loading: boolean }

export function usePlusTier(): PlusTierState {
  const [state, setState] = useState<PlusTierState>({ tier: 'free', loading: true })

  useEffect(() => {
    const ctrl = new AbortController()
    // token 送 POST body，唔送 URL —— 見 lib/payment/deviceToken.ts。
    fetch('/api/entitlement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device: getDeviceToken() }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((v: { tier?: string } | null) => {
        setState({ tier: v?.tier === 'plus' ? 'plus' : 'free', loading: false })
      })
      // 離線／失敗一律靜靜當 free。免費層完整可用，所以呢個唔會傷到人。
      .catch(() => setState({ tier: 'free', loading: false }))
    return () => ctrl.abort()
  }, [])

  return state
}
