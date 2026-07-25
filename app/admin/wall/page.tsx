import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import WallModeration from './WallModeration'

// 影子溫書室 · 真人審核後台 —— 只限 ADMIN_EMAILS 白名單（兩位創辦人）。
// 身份唔夠 → 直接彈返首頁。中文單語內部工具（同 /admin 一致）。
export const dynamic = 'force-dynamic'

export default async function WallAdminPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/')
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-[#1A1A1A]">🌙 影子溫書室 · 審核後台{/* i18n-exempt: admin 內部工具，只限創辦人 */}</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {admin.name}（{admin.email}）· 每則帖出街前【唯一】嘅閘。approve 咗先公開。{/* i18n-exempt: admin */}
          </p>
        </header>
        <WallModeration reviewer={admin.name} />
      </div>
    </div>
  )
}
