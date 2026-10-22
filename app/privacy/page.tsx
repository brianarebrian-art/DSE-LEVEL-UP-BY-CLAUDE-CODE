import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import PrivacyClient from './PrivacyClient'
import { betterAuthEnabled } from '@/lib/auth/better-auth'

// /privacy —— 私隱政策。
//
// ══ 呢一版嘅唯一價值就係「每一句都真」══
// 一版靠模板寫出嚟嘅私隱政策，比冇更差：家長／學校一核對就發現同實際唔同，
// 而佢哋唔會覺得係「寫漏」，佢哋會覺得係「呃人」。
//
// 所以呢版嘅事實全部喺 2026-08-20 對住實物核實過，唔靠記憶亦唔靠任何文件聲稱：
//   • localStorage key —— 掃全 repo 字面（37 個），對住 CLOUD_* 常數分「上雲／純本機」
//   • Supabase 實表 —— 直接 query information_schema（7 張表）
//   • 分析／追蹤 SDK —— 掃 gtag/GA/GTM/PostHog/Mixpanel/Hotjar/fbq/Plausible
//     /Umami/@vercel/analytics：除 Vercel Web Analytics 外零命中；Sentry 僅作錯誤監察
//     （見 PrivacyClient「啲資料去咗邊」），Session Replay 預設關閉
//   • email 持久化 —— 全 repo 冇任何路徑將學生 email 寫入資料庫
//   • `profiles` 表 —— 零讀寫路徑（純遺留，6 行）
//
// 上雲 key 清單【由 components/StoredDataInspector.tsx import】而唔係喺呢度重抄一次。
// 抄一次就等於開咗第二個真相來源，兩邊遲早唔同步 —— 而唔同步嘅嗰日，錯嘅一定
// 係呢版（因為冇人跑得起佢）。lib/__tests__/privacy-page.test.mts 守住呢點。
export const metadata = completeSeoMetadata({
  title: '私隱政策 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '閱讀 DSE Level Up 對本機資料、同步資料、帳戶資料與保留期限的實際處理方式，並了解你可如何查看、刪除或停止同步個人紀錄；政策按現有程式與資料庫行為說明，不以空泛承諾取代細節，亦交代啟用不同登入後端時電郵資料是否會儲存的差異。你可在使用前先比較政策所述處理方式與自己選用的功能，作出知情的使用決定。', // i18n-exempt: zh-Hant fixed search metadata
}, '/privacy')

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/privacy" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      {/* 存唔存電郵【由實際 backend 決定】，唔係人手維護一句文字。
          email/password 一開，Better Auth 個 `user` 表就會存電郵 ——
          嗰一刻原本嗰句「我哋唔會將你嘅電郵地址存入資料庫」即刻變成假。
          衍生就唔會有「改咗代碼但漏咗改私隱政策」呢個窗口。 */}
      <PrivacyClient storesEmail={betterAuthEnabled} />
    </div>
  )
}
