import type { ReactNode } from 'react'
import EmergencyBanner from './components/EmergencyBanner'
import ExitBar from './components/ExitBar'

// ⚡ Buff 補給艙（前身「化城避風港」，Relax Zone 3.0）— 00 後遊戲化包裝，
// 但情緒安全網原封不動：Sarah 緊急熱線橫幅（每頁必現，NON-NEGOTIABLE）+ Emma 感官菜單
// + Ian 語音引導呼吸。自成一區（app/relax/**），深空黑 + 霓虹，無壓力指標、無倒數壓迫。

export const metadata = {
  title: '⚡ Buff 補給艙 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale 切換
  description: '溫書耗 MP？入嚟補血補藍：聽聲、回氣、組隊。你唔係一個人。', // i18n-exempt: 靜態 SEO meta description
}

export default function RelaxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E8EC]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 一鍵離開（SEN 要求：任何頁面一 click 返 Dashboard） */}
        <ExitBar />

        {children}

        {/* Sarah 嘅得獎方案：緊急熱線橫幅 — /relax/** 每一頁都必須出現 */}
        <EmergencyBanner />
      </div>
    </div>
  )
}
