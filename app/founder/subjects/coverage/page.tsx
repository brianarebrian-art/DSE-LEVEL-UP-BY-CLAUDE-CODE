import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="題庫覆蓋缺口" titleEn="Coverage Gaps" status="partial" statusDetail="以活躍科目題數為基礎；課題樹細節可接 gap 腳本輸出。">
      <ModuleBody route="/founder/subjects/coverage" />
    </ModuleFrame>
  )
}
