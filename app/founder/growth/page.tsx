import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="來源與漏斗" titleEn="Growth" status="unconnected" statusDetail="未接駁行銷／來源遙測；唔顯示假漏斗。">
      <ModuleBody route="/founder/growth" />
    </ModuleFrame>
  )
}
