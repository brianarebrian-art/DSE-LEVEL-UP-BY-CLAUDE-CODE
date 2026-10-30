import { redirect } from 'next/navigation'
import { getFounderGate } from '@/lib/auth/founderAllowlist'
import FounderGoogleLogin from '@/components/founder/mfa/FounderGoogleLogin'

export const dynamic = 'force-dynamic'

export default async function FounderMfaLoginPage() {
  const gate = await getFounderGate()
  if (gate.state === 'full') redirect('/founder')
  if (gate.state === 'needs_challenge') redirect('/founder/mfa/verify')
  if (gate.state === 'needs_enroll' || gate.state === 'recovery_reenroll') redirect('/founder/mfa/enroll')
  if (gate.state === 'denied' && gate.reason !== 'not_signed_in') {
    if (gate.reason === 'founder_sub_unset') redirect('/founder')
    redirect('/')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-100">用 Google 登入</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          只接受已綁定嘅創辦人帳戶。登入成功後仍需完成 Authenticator（TOTP）先可進入後台。
        </p>
      </div>
      <FounderGoogleLogin next="/founder" />
      <p className="text-xs leading-relaxed text-slate-500">
        其他帳戶即使持有正確驗證碼亦無法進入。學生登入流程不受影響。
      </p>
    </div>
  )
}
