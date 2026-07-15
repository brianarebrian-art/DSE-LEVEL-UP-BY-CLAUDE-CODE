import type { ReactNode } from 'react'
import EmergencyBanner from './components/EmergencyBanner'
import ExitBar from './components/ExitBar'

// 🫁 呼吸空間（前身「化城避風港」→「Buff 補給艙」，CEO 指令 2026-07-15 統一命名）—
// 情緒安全網原封不動：Sarah 緊急熱線橫幅（每頁必現，NON-NEGOTIABLE）+ Emma 感官菜單
// + Ian 語音引導呼吸。自成一區（app/relax/**），深空黑 + 霓虹，無壓力指標、無倒數壓迫。
// 遊戲術語（MP／補血補藍／單排／開黑）已全數移除。

export const metadata = {
  // FIX: [A1] 頁面標題統一為「呼吸空間」
  title: '🫁 呼吸空間 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale 切換
  // FIX: [A1][A3] 副標移除 MP／補血補藍
  description: '溫書攰咗？入嚟唞一唞：聽聲、回氣、傾偈。你唔係一個人。', // i18n-exempt: 靜態 SEO meta description
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
