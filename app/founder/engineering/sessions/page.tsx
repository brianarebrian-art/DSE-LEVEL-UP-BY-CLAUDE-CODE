import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import { ModuleBody } from '@/components/founder/ModuleBodies'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  return (
    <ModuleFrame title="Session 管理" titleEn="Sessions" status="live" statusDetail="顯示 Google + TOTP session；撤銷＝登出、緊急 MFA revoke 或撤銷 Google 授權。">
      <ModuleBody route="/founder/engineering/sessions" />
    </ModuleFrame>
  )
}
