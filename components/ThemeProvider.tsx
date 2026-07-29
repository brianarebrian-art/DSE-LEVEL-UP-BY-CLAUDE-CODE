'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { THEME_KEY, readPref, resolveTheme, sunTimes, type ThemeName, type ThemePref } from '@/lib/theme'

// 主題狀態。與語言完全獨立：各自一個 localStorage 鍵、各自一個 Provider，
// 切換其中一樣不會影響另一樣（Brian 2026-07-29 要求「語言轉換隔離」）。

interface ThemeCtx {
  pref: ThemePref
  theme: ThemeName
  setPref: (p: ThemePref) => void
  /** 「自動」模式下，今日香港的日出／日落（小時數），供介面說明用。 */
  sun: { sunrise: number; sunset: number }
}

const Ctx = createContext<ThemeCtx | null>(null)

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useTheme must be used inside <ThemeProvider>')
  return c
}

const apply = (t: ThemeName) => {
  document.documentElement.setAttribute('data-theme', t)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 首次 render 一律用 'auto'，與伺服器輸出一致，避免 hydration 不匹配。
  // 真實偏好於 mount 後讀取；在此之前畫面已由 layout 的防閃爍腳本著色。
  const [pref, setPrefState] = useState<ThemePref>('auto')
  const [theme, setTheme] = useState<ThemeName>('light')
  const [sun, setSun] = useState({ sunrise: 6, sunset: 18 })

  useEffect(() => {
    const p = readPref()
    setPrefState(p)
    const t = resolveTheme(p)
    setTheme(t)
    apply(t)
    setSun(sunTimes(new Date()))
  }, [])

  // 自動模式下要跟住日夜走：頁面長開（例如通宵溫書跨過日出）亦要正確切換。
  // 每 5 分鐘檢查一次，成本可忽略；非自動模式不掛計時器。
  useEffect(() => {
    if (pref !== 'auto') return
    const tick = () => {
      const t = resolveTheme('auto')
      setTheme((prev) => (prev === t ? prev : (apply(t), t)))
    }
    const id = window.setInterval(tick, 5 * 60 * 1000)
    // 由背景分頁返回時亦即時校正一次，唔使等下一個 tick。
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [pref])

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p)
    window.localStorage.setItem(THEME_KEY, p)
    const t = resolveTheme(p)
    setTheme(t)
    apply(t)
  }, [])

  return <Ctx.Provider value={{ pref, theme, setPref, sun }}>{children}</Ctx.Provider>
}
