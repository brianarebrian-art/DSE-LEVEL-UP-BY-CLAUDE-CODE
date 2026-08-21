import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

// /privacy —— 私隱政策。
//
// ══ 呢一版嘅唯一價值就係「每一句都真」══
// 一版靠模板寫出嚟嘅私隱政策，比冇更差：家長／學校一核對就發現同實際唔同，
// 而佢哋唔會覺得係「寫漏」，佢哋會覺得係「呃人」。
//
// 所以呢版嘅事實全部喺 2026-08-20 對住實物核實過，唔靠記憶亦唔靠任何文件聲稱：
//   • localStorage key —— 掃全 repo 字面（37 個），對住 CLOUD_* 常數分「上雲／純本機」
//   • Supabase 實表 —— 直接 query information_schema（7 張表）
//   • 分析／追蹤 SDK —— 掃 gtag/GA/GTM/PostHog/Mixpanel/Sentry/Hotjar/fbq/Plausible
//     /Umami/@vercel/analytics：【零命中】
//   • email 持久化 —— 全 repo 冇任何路徑將學生 email 寫入資料庫
//   • `profiles` 表 —— 零讀寫路徑（純遺留，6 行）
//
// 上雲 key 清單【由 components/StoredDataInspector.tsx import】而唔係喺呢度重抄一次。
// 抄一次就等於開咗第二個真相來源，兩邊遲早唔同步 —— 而唔同步嘅嗰日，錯嘅一定
// 係呢版（因為冇人跑得起佢）。lib/__tests__/privacy-page.test.mts 守住呢點。
export const metadata: Metadata = {
  title: '私隱政策 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記必須同行，故此句唔換行）
  description: '我哋收集咩、點解收、放喺邊、留幾耐、你點樣刪除。對照香港《個人資料（私隱）條例》寫，每項都對得返實際代碼同資料庫。', // i18n-exempt
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PrivacyClient />
    </div>
  )
}
