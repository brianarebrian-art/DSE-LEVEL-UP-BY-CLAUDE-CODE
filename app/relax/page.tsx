'use client'

import { useEffect, useState } from 'react'
import SensoryMenu, { DEFAULT_PREF, loadSensoryPref, saveSensoryPref, type SensoryPref } from './components/SensoryMenu'
import RelaxLanding from './components/RelaxLanding'

// /relax — ⚡ Buff 補給艙主頁：首次進入先過感官菜單（Emma），之後直入主選擇。
export default function RelaxPage() {
  const [pref, setPref] = useState<SensoryPref>(DEFAULT_PREF)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadSensoryPref()
    if (saved) {
      setPref(saved)
      setMenuOpen(false)
    } else {
      setMenuOpen(true) // 第一次入場：先揀感官偏好
    }
    setReady(true)
  }, [])

  if (!ready) return <div className="min-h-[40vh]" />

  return (
    <>
      {menuOpen && (
        <SensoryMenu
          pref={pref}
          onChange={setPref}
          onDone={() => {
            saveSensoryPref(pref)
            setMenuOpen(false)
          }}
        />
      )}
      <RelaxLanding pref={pref} onReopenMenu={() => setMenuOpen(true)} />
    </>
  )
}
