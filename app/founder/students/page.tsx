import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="學生總覽" titleEn="Students" status="live" statusDetail="全站聚合指標（無逐人身份列）。逐人旅程需明確查詢且受憲章 §16.E 約束。">
      <ModuleBody route="/founder/students" />
    </ModuleFrame>
  )
}
