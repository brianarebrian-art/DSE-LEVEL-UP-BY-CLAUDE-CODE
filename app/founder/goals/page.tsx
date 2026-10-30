import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="目標及任務" titleEn="Goals" status="partial" statusDetail="讀取 founder_operational_tasks；表未 migrate 時顯示未接駁。">
      <ModuleBody route="/founder/goals" />
    </ModuleFrame>
  )
}
