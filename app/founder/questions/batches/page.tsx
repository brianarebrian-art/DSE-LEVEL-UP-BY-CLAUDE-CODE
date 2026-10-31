import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'
import BatchStatusActions from '@/components/founder/BatchStatusActions'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame
      title="發佈批次"
      titleEn="Publish Batches"
      status="partial"
      statusDetail="預覽／確認會寫 founder_publish_batches；表未 migrate 時確認會失敗且唔改靜態題庫。"
    >
      <BatchStatusActions />
      <ModuleBody route="/founder/questions/batches" />
    </ModuleFrame>
  )
}
