import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="待決策事項" titleEn="Decisions" status="partial" statusDetail="來自錯題回報、質素覆核與事故情報；唔顯示假事件。">
      <ModuleBody route="/founder/decisions" />
    </ModuleFrame>
  )
}
