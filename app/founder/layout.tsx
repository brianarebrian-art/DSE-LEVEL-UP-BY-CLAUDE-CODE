import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { completeSeoMetadata } from '@/lib/seo'
import {
  getVerifiedFounderSession,
  founderBindingInstructions,
} from '@/lib/auth/founderAllowlist'
import FounderShell from '@/components/founder/FounderShell'
import { getFounderDeployEnv, founderEnvLabel } from '@/lib/founder/env'
import { loadPlatformOverview } from '@/lib/founder/metrics'

export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata(
  {
    title: 'Founder OS | DSE Level Up',
    description: 'DSE Level Up 創辦人指揮中心。僅限已綁定之創辦人 Google 帳戶。',
    robots: { index: false, follow: false },
  },
  '/founder',
)

export default async function FounderLayout({ children }: { children: React.ReactNode }) {
  const auth = await getVerifiedFounderSession()
  if (!auth.ok) {
    if (auth.reason === 'founder_sub_unset') {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-slate-800">
          <h1 className="text-xl font-semibold">Founder OS 尚未完成身份綁定</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{founderBindingInstructions()}</p>
          <p className="mt-4 text-sm text-slate-500">為安全起見，系統拒絕進入，唔會自動認領或暫時放行。</p>
          <Link href="/" className="mt-6 inline-block text-sm text-teal-800 underline">
            返回首頁
          </Link>
        </div>
      )
    }
    // 唔洩露後台存在細節畀未授權者 —— 同 /admin 一致彈返首頁
    redirect('/')
  }

  let badges: Record<string, number> = {}
  let platformStatus = 'unknown'
  try {
    const overview = await loadPlatformOverview()
    platformStatus = overview.platformStatus
    badges = {
      reports: overview.metrics.openReports.state === 'ok' ? overview.metrics.openReports.value : 0,
      reviews:
        overview.metrics.pendingQualityReviews.state === 'ok'
          ? overview.metrics.pendingQualityReviews.value
          : 0,
      aiJobs: overview.aiJobs.failed ?? 0,
      ops: overview.opsTasks.open ?? 0,
      decisions: overview.intel.filter((i) => i.severity === 'alert' || i.severity === 'warn').length,
      incidents: overview.intel.filter((i) => i.href.includes('/incidents')).length,
    }
  } catch {
    /* layout 仍可開；首頁會再載 */
  }

  const envLabel = founderEnvLabel(getFounderDeployEnv())

  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#050D18] p-6 text-cyan-200">載入 Founder OS…</div>}>
      <FounderShell
        email={auth.identity.email}
        name={auth.identity.name}
        envLabel={envLabel}
        platformStatus={platformStatus}
        badges={badges}
      >
        {children}
      </FounderShell>
    </Suspense>
  )
}
