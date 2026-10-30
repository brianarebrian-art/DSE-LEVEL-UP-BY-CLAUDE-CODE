import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="預算與成本" titleEn="Finance" status="partial" statusDetail="founder_budgets；保留原始幣別。憲章成本死鎖 US$200。">
      <ModuleBody route="/founder/finance" />
    </ModuleFrame>
  )
}
