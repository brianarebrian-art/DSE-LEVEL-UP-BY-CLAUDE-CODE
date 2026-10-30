import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="每日簡報" titleEn="Daily Briefing" status="partial" statusDetail="彙整指揮中心真實指標草擬簡報；AI 潤飾需 FOUNDER_AI_*。">
      <ModuleBody route="/founder/briefing" />
    </ModuleFrame>
  )
}
