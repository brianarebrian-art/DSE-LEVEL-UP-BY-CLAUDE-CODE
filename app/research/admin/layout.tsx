import { AdminShell } from '@/components/research/AdminShell'

export default function ResearchAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
