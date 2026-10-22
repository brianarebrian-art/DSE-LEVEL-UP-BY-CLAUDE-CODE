import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/Seo/JsonLd'

const h1 = 'DSE 題型解析：逐步核對條件與解法' // i18n-exempt: zh-Hant editorial content
const description = '學習拆解 DSE 題目的條件、未知量與解題步驟，先自行嘗試，再逐行核對公式及答案限制。本頁提供原創二次方程示例和訂正清單，連接概念筆記、判別式題型解析及現有題庫練習。本站目前不提供文件上傳功能，也不提供即時解答生成，不轉載官方試卷或虛構評分參考。請用合法取得的試卷配合教師指引，核對方法而非只抄答案。' // i18n-exempt: zh-Hant SEO metadata
export const metadata: Metadata = createSeoMetadata({ title: 'DSE 拆題流程與工具功能狀態 | DSE Level Up', description, path: '/ai/past-paper-explainer', type: 'article', noIndex: true }) // i18n-exempt: zh-Hant editorial content

export default function PastPaperExplainerPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: '拆題流程指南', path: '/ai/past-paper-explainer' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
    <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10"><article className="max-w-3xl">
      <JsonLd data={articleJsonLd({ title: h1, description, path: '/ai/past-paper-explainer' })} />
      <header><p className="text-sm font-medium text-accent">功能狀態：自動題解及文件上傳未提供 · 本頁暫不索引</p><h1 className="mt-3 text-4xl font-medium leading-tight sm:text-5xl">{h1}</h1><p className="mt-5 leading-8">本頁是手動拆題教學，不是 AI 答案生成介面。以下例題由本站原創，不是考評局官方題目，也不提供官方 marking scheme。</p></header> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">先寫出已知、所求與規則</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8"><li>已知：每個數值、範圍與單位。</li><li>所求：要找根、參數還是數量。</li><li>規則：第一步使用的公式及適用條件。</li></ol><p className="mt-4 leading-8">若第三項無法寫出，先返回概念筆記。直接抄解答會跳過真正卡住的地方。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">原創拆題示例</h2><p className="mt-4 leading-8">解 x² − 4x − 5 = 0。所求是實根。找乘積 −5、和 −4 的兩數，得到 −5 和 1，因此 (x − 5)(x + 1) = 0，利用零乘積法得到 x = 5 或 −1。</p><p className="mt-4 leading-8">代回：5² − 4 × 5 − 5 = 0；(−1)² − 4 × (−1) − 5 = 0。若題目原本要求正數長度，就只接受 5；本示例沒有該限制，所以兩根都保留。不能自行加上題目沒有說明的條件。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">訂正檢查清單</h2><ul className="mt-4 list-disc space-y-3 pl-6 leading-8"><li>哪一步把符號或數值讀錯？</li><li>每個等號是否仍代表原來條件？</li><li>平方根或除法有沒有遺漏根或限制？</li><li>答案能否代回？單位和範圍是否正確？</li></ul></section> {/* i18n-exempt: zh-Hant editorial content */}
      <section className="mt-10"><h2 className="text-2xl font-medium">版權與功能界線</h2><p className="mt-4 leading-8">合法取得試卷不代表可以公開完整轉載。未取得特定試卷許可時，本站只提供原創題型解析，不以虛構年份、卷號或題號作網址。本頁不會生成解答，也不接受檔案或圖片。題庫解析也不是官方評分標準；請配合課本、教師及當年評核要求核對。</p><Link href="/dse-maths/question-types/quadratic-discriminant" className="mt-5 inline-flex rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">閱讀原創判別式參數題解析</Link></section> {/* i18n-exempt: zh-Hant editorial content */}
    </article></section>
    <RelatedTopics topics={[{ href: '/dse-maths/quadratic-equations', title: '二次方程完整筆記', description: '理解公式與因式分解的每個步驟。' }, { href: '/subjects/math', title: 'Maths 原創題庫練習', description: '自行作答，再核對參考解析。' }, { href: '/methodology', title: '內容來源與核對方法', description: '了解原創題目及資料使用界線。' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
  </>
}
