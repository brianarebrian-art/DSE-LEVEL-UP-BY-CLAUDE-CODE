import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="評測資料集" titleEn="Evals" status="unconnected" statusDetail="ModelEvaluation 實體待接駁；唔顯示自報信心當準確率。">
      <ModuleBody route="/founder/ai/evals" />
    </ModuleFrame>
  )
}
