import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="質素覆核隊列" titleEn="Quality Queue" status="partial" statusDetail="接 dse_question_quality_reviews；詳細評分仍可用 /admin/quality。">
      <ModuleBody route="/founder/quality" />
    </ModuleFrame>
  )
}
