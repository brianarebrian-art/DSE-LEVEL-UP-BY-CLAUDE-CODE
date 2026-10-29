import type { Metadata } from 'next'
import ForgotPasswordClient from './ForgotPasswordClient'

export const metadata: Metadata = {
  title: 'Forgot password · DSE Level Up',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}
