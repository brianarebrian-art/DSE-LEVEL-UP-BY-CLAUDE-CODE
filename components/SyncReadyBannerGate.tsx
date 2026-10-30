'use client'

import { Suspense } from 'react'
import SyncReadyBanner from '@/components/SyncReadyBanner'

/** Suspense gate — `useSearchParams` requires a boundary in the App Router. */
export default function SyncReadyBannerGate() {
  return (
    <Suspense fallback={null}>
      <SyncReadyBanner />
    </Suspense>
  )
}
