import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="功能開關" titleEn="Flags" status="partial" statusDetail="founder_feature_flags。">
      <ModuleBody route="/founder/settings/flags" />
    </ModuleFrame>
  )
}
