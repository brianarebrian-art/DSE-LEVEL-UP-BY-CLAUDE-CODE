import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="工單與任務" titleEn="Ops" status="partial" statusDetail="founder_operational_tasks。">
      <ModuleBody route="/founder/ops" />
    </ModuleFrame>
  )
}
