import { redirect } from 'next/navigation'
import { getFounderGate } from '@/lib/auth/founderAllowlist'
import MfaVerifyForm from '@/components/founder/mfa/MfaVerifyForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FounderMfaVerifyPage() {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    if (gate.reason === 'not_signed_in') redirect('/founder/mfa/login')
    redirect('/')
  }
  if (gate.state === 'full') redirect('/founder')
  if (gate.state === 'needs_enroll' || gate.state === 'recovery_reenroll') redirect('/founder/mfa/enroll')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-100">Authenticator 驗證碼</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          開啟 Google Authenticator（或相容應用），輸入 6 位數字。每次新登入都需要驗證。
        </p>
      </div>
      <MfaVerifyForm factorId={gate.factorId} />
      <p className="text-sm text-slate-500">
        冇手機？{' '}
        <Link href="/founder/mfa/recovery" className="text-cyan-300 underline">
          使用復原碼
        </Link>
      </p>
    </div>
  )
}
