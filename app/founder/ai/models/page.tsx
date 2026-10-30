import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="模型與供應商" titleEn="Models" status="unconnected" statusDetail="只顯示是否已設定伺服器端 AI；Secret 永不回傳。">
      <ModuleBody route="/founder/ai/models" />
    </ModuleFrame>
  )
}
