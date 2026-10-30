import { redirect } from 'next/navigation'
import { getFounderGate } from '@/lib/auth/founderAllowlist'
import MfaRecoveryForm from '@/components/founder/mfa/MfaRecoveryForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FounderMfaRecoveryPage() {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    if (gate.reason === 'not_signed_in') redirect('/founder/mfa/login')
    redirect('/')
  }
  if (gate.state === 'full') redirect('/founder/settings/security')
  if (gate.state === 'recovery_reenroll') redirect('/founder/mfa/enroll')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-100">使用復原碼</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          每個復原碼只能用一次。成功後會進入受限復原工作階段，必須重新綁定 Authenticator，唔會永久關閉 MFA。
        </p>
      </div>
      <MfaRecoveryForm />
      <p className="text-sm text-slate-500">
        <Link href="/founder/mfa/verify" className="text-cyan-300 underline">
          返回驗證碼
        </Link>
      </p>
    </div>
  )
}
