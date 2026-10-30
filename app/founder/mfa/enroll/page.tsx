import { redirect } from 'next/navigation'
import { getFounderGate } from '@/lib/auth/founderAllowlist'
import MfaEnrollForm from '@/components/founder/mfa/MfaEnrollForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FounderMfaEnrollPage() {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    if (gate.reason === 'not_signed_in') redirect('/founder/mfa/login')
    redirect('/')
  }
  if (gate.state === 'full') redirect('/founder')
  if (gate.state === 'needs_challenge') redirect('/founder/mfa/verify')

  const viaRecovery = gate.state === 'recovery_reenroll'
  const recentAuth = gate.state === 'needs_enroll' ? gate.recentAuth : true

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-100">
          {viaRecovery ? '重新綁定 Authenticator' : '首次設定 Google Authenticator'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {viaRecovery
            ? '你正處於受限復原工作階段。完成綁定前無法進入後台。'
            : '需要部署擁有人發出嘅一次性 enrollment token，以及近期 Google 重新登入。'}
        </p>
      </div>
      {!recentAuth && !viaRecovery ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          Google 登入已超過安全時限。請先{' '}
          <Link href="/founder/mfa/login" className="underline">
            重新用 Google 登入
          </Link>{' '}
          再繼續綁定。
        </div>
      ) : (
        <MfaEnrollForm viaRecovery={viaRecovery} />
      )}
      {!viaRecovery ? (
        <p className="text-sm text-slate-500">
          已有 Authenticator？{' '}
          <Link href="/founder/mfa/verify" className="text-cyan-300 underline">
            去驗證
          </Link>
        </p>
      ) : null}
    </div>
  )
}
