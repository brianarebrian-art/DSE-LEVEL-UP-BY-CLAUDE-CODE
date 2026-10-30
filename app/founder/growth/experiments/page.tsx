import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="實驗" titleEn="Experiments" status="unconnected" statusDetail="樣本不足時唔自動宣稱顯著提升。">
      <ModuleBody route="/founder/growth/experiments" />
    </ModuleFrame>
  )
}
