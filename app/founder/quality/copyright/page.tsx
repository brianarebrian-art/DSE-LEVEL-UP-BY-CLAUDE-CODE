import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="版權疑慮" titleEn="Copyright" status="partial" statusDetail="來源 category=copyright 嘅回報 + founder_review_cases。">
      <ModuleBody route="/founder/quality/copyright" />
    </ModuleFrame>
  )
}
