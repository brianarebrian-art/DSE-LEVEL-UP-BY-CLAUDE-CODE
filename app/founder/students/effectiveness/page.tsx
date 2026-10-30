import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="學習成效" titleEn="Effectiveness" status="partial" statusDetail="正確率係練習表現估算，唔等於官方 DSE 等級。">
      <ModuleBody route="/founder/students/effectiveness" />
    </ModuleFrame>
  )
}
