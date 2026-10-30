import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="Prompt 版本" titleEn="Prompts" status="partial" statusDetail="優先讀 dse_quality_prompt_versions。">
      <ModuleBody route="/founder/ai/prompts" />
    </ModuleFrame>
  )
}
