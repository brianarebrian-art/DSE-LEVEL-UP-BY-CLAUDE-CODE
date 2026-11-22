import { notFound } from 'next/navigation'
import CalmDseExperience from '@/app/(quiz)/components/CalmDseExperience'

export const metadata = {
  title: 'Calm practice demo (development only)',
  robots: { index: false, follow: false },
}

export default function CalmDemoPage() {
  // Preview deployments also run in production mode. No public demo or fake session.
  if (process.env.NODE_ENV !== 'development') notFound()
  return <CalmDseExperience />
}
