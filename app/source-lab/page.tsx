import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import SourceLabPageClient from './SourceLabPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '史料判讀室 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '透過 DSE 歷史科資料題的史料判讀練習，分開閱讀來源中的事實、詮釋與立場，並查看每則材料的來源狀態；未能查證的資料會在頁面標示，內容供練習如何提出和檢驗歷史論證，不把整理結果當作唯一史實或 HKEAA 官方試題、答案和評分準則。學生可把不同層次的陳述分別記錄，再逐項回到原始材料本身檢查證據是否足夠。', // i18n-exempt: zh-Hant fixed search metadata
}, '/source-lab')

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/source-lab" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <SourceLabPageClient />
    </>
  )
}
