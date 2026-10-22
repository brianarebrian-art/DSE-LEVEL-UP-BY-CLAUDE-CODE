import { completeSeoMetadata } from '@/lib/seo'
import SenseiClient from './SenseiClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '知識卡 · SENSEI | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '以知識卡瀏覽 DSE 題庫相關的概念、例子、應試提示與常見陷阱；頁面只顯示已編輯的卡片內容，不會在你開啟時自行生成答案或替你判分，讓學生可按學科與課題自行查閱，並把卡片視為練習前後的補充，而非取代教師指導、官方課程或個人判斷。卡片內容會因可用學科資料而異，學生可回到題目和解析核對原有學習脈絡與使用界線。', // i18n-exempt: zh-Hant fixed search metadata
}, '/sensei')

export default function Page() {
  return <SenseiClient />
}
