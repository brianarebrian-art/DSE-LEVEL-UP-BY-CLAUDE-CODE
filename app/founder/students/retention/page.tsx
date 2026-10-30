import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="留存及分群" titleEn="Retention" status="partial" statusDetail="以 returnedAnotherDay／多日活躍為準；冇遙測唔推算流失原因。">
      <ModuleBody route="/founder/students/retention" />
    </ModuleFrame>
  )
}
