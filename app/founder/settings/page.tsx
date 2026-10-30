import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="Founder 身份" titleEn="Identity" status="live" statusDetail="唯讀顯示綁定狀態；唔提供新增其他創辦人。">
      <ModuleBody route="/founder/settings" />
    </ModuleFrame>
  )
}
