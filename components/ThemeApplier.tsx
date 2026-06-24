'use client'

import { useEffect } from 'react'
import { applyTheme } from '@/lib/gamify'

// Reflects any gacha-unlocked active theme onto <html data-theme> on load.
// Renders nothing; mounted once inside Providers.
export default function ThemeApplier() {
  useEffect(() => {
    applyTheme()
  }, [])
  return null
}
