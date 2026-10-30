import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="錯題回報" titleEn="Question Reports" status="live" statusDetail="question_reports 聚合；無學生身份欄位。">
      <ModuleBody route="/founder/quality/reports" />
    </ModuleFrame>
  )
}
