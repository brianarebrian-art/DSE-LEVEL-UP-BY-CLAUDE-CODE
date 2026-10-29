import type { Metadata } from 'next'
import MagicLinkClient from './MagicLinkClient'

export const metadata: Metadata = {
  title: 'Magic link · DSE Level Up',
  robots: { index: false, follow: false },
}

export default function MagicLinkPage() {
  return <MagicLinkClient />
}
