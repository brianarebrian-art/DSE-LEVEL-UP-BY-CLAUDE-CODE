import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="服務健康" titleEn="Health" status="partial" statusDetail="整合狀態表；冇遙測就標未接駁。">
      <ModuleBody route="/founder/engineering" />
    </ModuleFrame>
  )
}
