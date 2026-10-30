import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="科目星圖" titleEn="Subjects" status="live" statusDetail="動態讀取 subjects 與題庫題數；節點可下鑽。">
      <ModuleBody route="/founder/subjects" />
    </ModuleFrame>
  )
}
