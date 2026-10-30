import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="操作審計" titleEn="Audit" status="partial" statusDetail="founder_audit_events。">
      <ModuleBody route="/founder/settings/audit" />
    </ModuleFrame>
  )
}
