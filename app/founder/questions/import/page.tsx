import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="批量匯入" titleEn="Import" status="partial" statusDetail="預覽／驗證流程已預留 API；正式寫入題庫檔需創辦人批准。">
      <ModuleBody route="/founder/questions/import" />
    </ModuleFrame>
  )
}
