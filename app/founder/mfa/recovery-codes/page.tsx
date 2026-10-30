import { redirect } from 'next/navigation'
import { getFounderGate } from '@/lib/auth/founderAllowlist'
import RecoveryCodesOnce from '@/components/founder/mfa/RecoveryCodesOnce'

export const dynamic = 'force-dynamic'

export default async function FounderRecoveryCodesPage() {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    if (gate.reason === 'not_signed_in') redirect('/founder/mfa/login')
    redirect('/')
  }
  // 只允許剛完成綁定後（full）或仍喺流程中查看一次性顯示頁
  if (gate.state !== 'full' && gate.state !== 'needs_challenge') {
    // needs_challenge 理論上剛綁完會係 full；若 session 尚未刷新仍可顯示 client 暫存
    if (gate.state === 'needs_enroll' || gate.state === 'recovery_reenroll') {
      redirect('/founder/mfa/enroll')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium text-slate-100">保存復原碼</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          呢組碼只顯示一次。請離線保存；伺服器只存雜湊。遺失手機又冇復原碼時，需要部署擁有人執行受控離線復原——冇電郵自助關閉 MFA。
        </p>
      </div>
      <RecoveryCodesOnce />
    </div>
  )
}
