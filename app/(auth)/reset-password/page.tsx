import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export const metadata: Metadata = {
  title: 'Reset password · DSE Level Up',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ResetPasswordClient />
    </Suspense>
  )
}
