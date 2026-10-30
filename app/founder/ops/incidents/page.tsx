import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="事故" titleEn="Incidents" status="partial" statusDetail="founder_incidents；事故模式共用同一資料。">
      <ModuleBody route="/founder/ops/incidents" />
    </ModuleFrame>
  )
}
