import type { ReactNode } from 'react'
import Link from 'next/link'
import EmergencyBanner from './components/EmergencyBanner'

// 化城避風港（Relax Zone 3.0）— 27 專家腦震盪得票方案：
// Sarah 緊急熱線橫幅（每頁必現，NON-NEGOTIABLE）+ Emma 感官菜單 + Ian 語音引導呼吸。
// 自成一區（app/relax/**），深空黑 + 柔和青，無壓力指標、無倒數壓迫。

export const metadata = {
  title: '化城避風港 | DSE Level Up',
  description: '一個冇壓力嘅空間：聽聲音、呼吸、傾偈。你唔係一個人。',
}

export default function RelaxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E8EC]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 一鍵離開（SEN 要求：任何頁面一 click 返 Dashboard） */}
        <div className="flex justify-end mb-2">
          <Link
            href="/dashboard"
            className="text-xs text-[#8B8B96] hover:text-[#E8E8EC] transition-colors min-h-11 inline-flex items-center px-2"
          >
            離開避風港 →
          </Link>
        </div>

        {children}

        {/* Sarah 嘅得獎方案：緊急熱線橫幅 — /relax/** 每一頁都必須出現 */}
        <EmergencyBanner />
      </div>
    </div>
  )
}
