'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { greetingSlot, isNightSlot, type GreetingSlot } from '@/lib/greeting'
import { useT } from '@/lib/i18n'

// 頂部欄問候語 —— 規格 §3.2。
//
// ══ 點解 mount 之後先算 ══
// 伺服器嘅時區同用戶嘅唔一定一樣。喺 SSR 就計時段，會 render 出「早晨」
// 而 client 係「夜深了」—— hydration 不匹配，React 會喺 console 嘈，
// 而且畫面會閃一閃。所以首次 render 一律唔出（null），mount 之後先填。
// 同 ThemeProvider 嘅處理一致。
//
// ⚠️ 規格 §3.2 個格式係「Good night, Kai.」—— 有名。本站唔一定有名可用
// （未登入嘅學生佔多數，而且 §3 免費原則之下登入唔係前提），
// 所以只出時段，唔出名。硬塞一個「同學」落去只會令句嘢更假。

export default function Greeting() {
  const t = useT()
  const [slot, setSlot] = useState<GreetingSlot | null>(null)

  useEffect(() => {
    const tick = () => setSlot(greetingSlot(new Date().getHours()))
    tick()
    // 通宵溫書會跨過時段邊界（22:00 深夜、05:00 早晨）。每五分鐘校一次，
    // 成本可忽略，但唔會出現凌晨三點仲寫住「晚上好」。
    const id = window.setInterval(tick, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [])

  if (!slot) return null

  const Icon = isNightSlot(slot) ? Moon : Sun

  return (
    <p className="flex items-center gap-2 text-sm text-ink-muted">
      <span>{t.greeting[slot]}</span>
      <Icon size={15} strokeWidth={1.5} aria-hidden className="text-ink-faint" />
    </p>
  )
}
