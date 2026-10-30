import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="公告" titleEn="Announcements" status="unconnected" statusDetail="公告草稿表尚未建立。">
      <ModuleBody route="/founder/ops/announcements" />
    </ModuleFrame>
  )
}
