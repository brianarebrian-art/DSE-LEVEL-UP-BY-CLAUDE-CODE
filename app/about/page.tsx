import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import { JsonLd } from '@/components/Seo/JsonLd'
import AboutClient from './AboutClient'
import { ABOUT_FAQS, faqPageSchema, localiseFaq } from '@/lib/faq'
import { SITE_ORIGIN } from '@/lib/site'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata = completeSeoMetadata({
  title: '關於我們 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '認識 DSE Level Up 為香港 DSE 考生提供原創改寫練習的原因、免費原則、資料處理方式與服務界線；頁面同時說明平台並非考評局、認證機構或危機支援服務，讓學生、家長和教師可按公開資料判斷是否適合使用。內容會隨實際服務更新，並連結相關政策供進一步核對，不以搜尋文案取代實際頁面揭示。可先核對。', // i18n-exempt: zh-Hant fixed search metadata
}, '/about')

// The FAQ near the foot of the page, as FAQPage structured data (founders' reply 61a).
// Same text as the visible list (components/FAQSection.tsx reads lib/faq.ts too).
const faqJsonLd = {
  '@context': 'https://schema.org',
  ...faqPageSchema(localiseFaq(ABOUT_FAQS, false), `${SITE_ORIGIN}/about`),
}

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/about" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <JsonLd data={faqJsonLd} />
      <AboutClient />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/about" meta={metadata} visibleHeadline="關於 DSE Level Up" />{/* i18n-exempt: zh-Hant visible H1 parity */}
    </>
  )
}
