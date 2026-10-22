import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/Seo/JsonLd'

const h1 = 'DSE 溫習計劃：先按待重溫課題安排下一步' // i18n-exempt: zh-Hant editorial content
const description = '用實際可完成的任務安排 DSE 溫習：先列出科目和待重溫課題，再留出訂正、重做及休息時間。本頁提供手動學習計劃示例，教你把「溫數學」拆成閱讀概念、完成原創例題和核對步驟，並連接科目筆記及練習題庫。本站目前沒有可輸入資料後即時生成計劃的 AI 功能，不會替你預測成績。請按學校進度與教師指引調整安排，不要提交個人敏感資料。' // i18n-exempt: zh-Hant SEO metadata
export const metadata: Metadata = createSeoMetadata({ title: 'DSE 手動溫習計劃與 AI 功能狀態 | DSE Level Up', description, path: '/ai/study-plan', type: 'article', noIndex: true }) // i18n-exempt: zh-Hant editorial content

export default function StudyPlanPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: '溫習計劃指南', path: '/ai/study-plan' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
    <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10"><article className="max-w-3xl">
      <JsonLd data={articleJsonLd({ title: h1, description, path: '/ai/study-plan' })} />
      <header><p className="text-sm font-medium text-accent">功能狀態：AI 自動生成未提供 · 本頁暫不索引</p><h1 className="mt-3 text-4xl font-medium leading-tight sm:text-5xl">{h1}</h1><p className="mt-5 leading-8">這是手動規劃指南，不是可輸入資料後產生計劃的 AI 工具。現有練習平台可讓你選擇科目及題目，不能代替教師評估或預測成績。</p></header> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">把模糊目標改成可核對的任務</h2><p className="mt-4 leading-8">「今晚溫 Maths」沒有完成標準。改為「不看筆記解三條二次方程，逐條代回核對，記下符號錯誤」，完成後就能知道下一步要重溫什麼。先挑一項弱點，不要同時重讀所有章節。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">原創手動計劃示例</h2><p className="mt-4 leading-8">情境：只有 45 分鐘，會因式分解，但二次公式經常代錯 b 的符號。以下只是手動示例，不是 AI 實際輸出或成效證據。</p><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8"><li>10 分鐘：閱讀二次公式，先標出 a、b、c。</li><li>15 分鐘：不看答案做三條原創例題。</li><li>10 分鐘：核對分母和正負號，代回原式。</li><li>5 分鐘：休息，離開螢幕。</li><li>5 分鐘：記下翌日要重做的一條錯題及錯誤原因。</li></ol></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">一週後如何調整？</h2><p className="mt-4 leading-8">以獨立完成的題目及可解釋的步驟作依據。若只會跟著範例計算，下一週仍保留概念與重做時間；若已能自行選解法，才加入混合題。做題數目不是理解程度，更不是預測正式 DSE 等級。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">資料與功能界線</h2><p className="mt-4 leading-8">本頁沒有計劃輸入表單，也不會把你的內容傳給模型。現有題庫及選用的帳戶同步另按私隱政策運作。不要把姓名、學校、電話或個人成績文件貼進外部工具；未支援的 AI 自動生成不會在此冒充可用功能。</p><Link href="/subjects" className="mt-5 inline-flex rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">按科目選擇現有練習</Link></section> {/* i18n-exempt: zh-Hant editorial content */}
    </article></section>
    <RelatedTopics topics={[{ href: '/dse-maths/quadratic-equations', title: '二次方程解法與訂正', description: '把範例拆成可完成的學習任務。' }, { href: '/dse-english/writing-format', title: '英文文體與寫作大綱', description: '先規劃一段，再檢查讀者與語氣。' }, { href: '/privacy', title: '資料使用與私隱政策', description: '了解本機資料與選用的帳戶同步。' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
  </>
}
