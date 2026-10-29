import { completeSeoMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import ReportsTriageClient from './ReportsTriageClient'

export const dynamic = 'force-dynamic'
export const metadata = completeSeoMetadata(
  {
    title: '題目回報 triage | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
    description: 'Admin-only queue for student question reports (category only; no free-text).', // i18n-exempt
  },
  '/admin/reports',
)

export default async function AdminReportsPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/')
  return <ReportsTriageClient />
}
