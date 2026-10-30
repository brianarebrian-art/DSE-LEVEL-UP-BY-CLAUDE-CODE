import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import TermsClient from './TermsClient'

// /terms —— 使用條款。每一句都要對得上網站實際做法，不套用通用合約模板。
export const metadata = completeSeoMetadata({
  title: '使用條款 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '說明 DSE Level Up 不是香港考試及評核局，不會保證成績或等級。題目經自動檢查上線，未經註冊教師審定。有顯示的練習數字只反映本站練習，不是考評局公布的成績，部分科目不顯示等級範圍。不登入也可以做題。學生資料處理見私隱政策。本頁不是律師審定的合約，沒有聲稱通過法律審核。請配合課本及教師指引。', // i18n-exempt: zh-Hant fixed search metadata
}, '/terms')

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/terms" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <TermsClient />
    </div>
  )
}
