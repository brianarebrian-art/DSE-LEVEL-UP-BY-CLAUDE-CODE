import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="安全事件" titleEn="Security" status="partial" statusDetail="審計 denied／安全相關事件。">
      <ModuleBody route="/founder/engineering/security" />
    </ModuleFrame>
  )
}
