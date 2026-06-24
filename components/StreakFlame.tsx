'use client'

import { useEffect, useState } from 'react'
import { getStreak } from '@/lib/gamify'

// The "溫書火苗": a flickering flame + day count in the navbar once a streak exists.
// Reads localStorage after mount (avoids any SSR/hydration mismatch).
export default function StreakFlame() {
  const [days, setDays] = useState(0)
  useEffect(() => {
    setDays(getStreak())
  }, [])

  if (days < 1) return null
  return (
    <span
      title="連續溫書日數 · Day streak"
      className="inline-flex items-center gap-1 text-sm font-bold text-orange-400 select-none"
    >
      <span className="animate-flame inline-block">🔥</span>
      {days}
    </span>
  )
}
