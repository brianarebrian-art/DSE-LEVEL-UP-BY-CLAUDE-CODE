import { redirect } from 'next/navigation'
import { requireFounder, getFounderGate } from '@/lib/auth/founderAllowlist'
import ModuleFrame from '@/components/founder/ModuleFrame'
import SecuritySettingsClient from '@/components/founder/mfa/SecuritySettingsClient'
import { founderMfaIdleSec, founderMfaMaxAgeSec, FOUNDER_TOTP_HINT } from '@/lib/founder/mfa/config'
import { founderMfaStepUpSec } from '@/lib/founder/mfa/stepUp'

export const dynamic = 'force-dynamic'

export default async function FounderSecuritySettingsPage() {
  const founder = await requireFounder()
  if (!founder) redirect('/')
  const gate = await getFounderGate()
  if (gate.state !== 'full') redirect('/founder/mfa/verify')

  return (
    <ModuleFrame
      title="安全設定"
      titleEn="Security"
      status="live"
      statusDetail="Google + TOTP；復原碼輪替需近期第二因素。"
    >
      <div className="space-y-6 text-sm text-slate-300">
        <section className="space-y-2">
          <h3 className="text-cyan-300">目前狀態</h3>
          <ul className="list-inside list-disc space-y-1 text-slate-400">
            <li>Google：{founder.email}</li>
            <li>MFA：已啟用（因素版本 {gate.factorVersion}）</li>
            <li>
              TOTP：{FOUNDER_TOTP_HINT.digits} 位／{FOUNDER_TOTP_HINT.periodSec}s／
              {FOUNDER_TOTP_HINT.algorithm}
            </li>
            <li>
              Session：最長 {founderMfaMaxAgeSec()}s · 閒置 {founderMfaIdleSec()}s · step-up{' '}
              {founderMfaStepUpSec()}s
            </li>
            <li>每次新登入都要 TOTP；唔做無限期信任裝置。</li>
          </ul>
        </section>
        <SecuritySettingsClient />
        <section className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-amber-100/90">
          <h3 className="font-medium text-amber-200">遺失手機且冇復原碼</h3>
          <p>
            不提供僅靠電郵停用 MFA。請由部署擁有人執行受控離線復原（見{' '}
            <code className="text-xs">docs/founder-os.md</code>
            ），會撤銷舊 Session 並留下審計紀錄。唔存在公開 reset endpoint 或萬用驗證碼。
          </p>
        </section>
      </div>
    </ModuleFrame>
  )
}
