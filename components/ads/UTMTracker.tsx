'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UTMTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) return
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')

    if (utmSource || utmCampaign) {
      try {
        const stored = {
          utm_source: utmSource || '',
          utm_medium: utmMedium || '',
          utm_campaign: utmCampaign || '',
          timestamp: Date.now(),
        }
        localStorage.setItem('dse_ad_utm', JSON.stringify(stored))
      } catch {
        // Safe fallback for quota or blocked storage
      }
    }
  }, [searchParams])

  return null
}
