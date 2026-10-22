import { completeSeoMetadata } from '@/lib/seo'
import AccountPageClient from './AccountPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '個人檔案與帳戶 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '在 DSE Level Up 查看個人檔案、帳戶狀態與同步設定，了解訪客模式和登入後功能的分別。此頁只供本人管理設定，不是公開學習文章，也不會被列入網站地圖；個人練習資料仍受現有權限與私隱政策保護。學生可先閱讀資料處理說明，再決定是否使用帳戶功能；沒有登入不代表無法使用平台的免費筆記與原創練習入口。', // i18n-exempt: zh-Hant fixed search metadata
}, '/account')

export default function Page() {
  return <AccountPageClient />
}
