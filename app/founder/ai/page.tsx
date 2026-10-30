import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="AI 任務" titleEn="AI Jobs" status="partial" statusDetail="列表來自 founder_ai_jobs；重試／取消經受控 API。">
      <ModuleBody route="/founder/ai" />
    </ModuleFrame>
  )
}
