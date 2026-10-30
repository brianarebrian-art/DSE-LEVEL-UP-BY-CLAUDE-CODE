import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="營運知識庫" titleEn="Knowledge Base" status="partial" statusDetail="連去 docs／憲章唯讀索引；唔複製機密。">
      <ModuleBody route="/founder/ops/kb" />
    </ModuleFrame>
  )
}
