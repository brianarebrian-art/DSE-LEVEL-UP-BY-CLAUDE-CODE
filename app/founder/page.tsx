import { requireFounder } from '@/lib/auth/founderAllowlist'
import { redirect } from 'next/navigation'
import { loadPlatformOverview } from '@/lib/founder/metrics'
import CommandCenter from '@/components/founder/CommandCenter'

export const dynamic = 'force-dynamic'

export default async function FounderHomePage() {
  const founder = await requireFounder()
  if (!founder) redirect('/')

  const data = await loadPlatformOverview()
  return <CommandCenter data={data} />
}
