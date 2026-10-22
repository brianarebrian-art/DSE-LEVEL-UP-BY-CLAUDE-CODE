import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, InternalLinkCard } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE English 英文學習路線：寫作格式、閱讀與自評 | DSE Level Up', // i18n-exempt: zh-Hant SEO metadata
  description: 'DSE English 學習路線由目的、讀者和語氣開始，連到 Letter、Article、Report 與 Speech 的格式比較、大綱及寫作錯誤。配合英文筆記、閱讀材料與寫作自評，練習設計段落、核對連接詞和修改文法。文體慣例應服從題目指定要求；本站沒有 AI 作文評分或官方閱卷功能，學生需參照教師回饋自行訂正。', // i18n-exempt: zh-Hant SEO metadata
  path: '/dse-english', type: 'website',
})

export default function DseEnglishPage() {
  const topics = [
    { href: '/dse-english/writing-format', title: 'Letter、Article、Report 與 Speech 格式指南', description: '比較讀者、語氣、段落目的及原創寫作大綱。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/writing', title: '英文寫作自評工具', description: '按內容、組織及語言表達自行檢查；不是 AI 作文評分。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/notes/english', title: 'English 課題筆記', description: '整理現有字詞、文法及閱讀課題，配合練習核對理解。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/reading', title: '閱讀材料與詞彙學習', description: '閱讀時核對句子語境，而不是只背單字中文解釋。' }, // i18n-exempt: zh-Hant editorial content
  ]
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE English', path: '/dse-english' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
    <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
      <article className="max-w-3xl">
        <header><p className="text-sm font-medium text-accent">HKDSE English Language</p><h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">DSE English 英文學習路線：寫作、閱讀與自評</h1><p className="mt-5 text-lg leading-8 text-ink-muted">先辨認題目要求你向誰說話、達到什麼目的，再處理文體和語言。華麗詞彙不能取代清楚的意思。</p></header> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="english-start"><h2 id="english-start" className="text-2xl font-medium">先決定你需要練習什麼</h2><div className="mt-5 overflow-x-auto"><table className="w-full text-left leading-7"><caption className="mb-3 text-left text-ink-muted">從常見困難選擇學習入口</caption><thead><tr><th scope="col" className="p-3">目前困難</th><th scope="col" className="p-3">可操作的下一步</th></tr></thead><tbody><tr><td className="p-3">不懂作文格式</td><td className="p-3">圈出角色、讀者、文體及目的，再閱讀文體比較表。</td></tr><tr><td className="p-3">段落只有立場，沒有說明</td><td className="p-3">每段寫一個觀點，補原因、具體例子及它如何支持目的。</td></tr><tr><td className="p-3">閱讀只會抄原文</td><td className="p-3">判斷問題要主旨、細節還是推論，再選相關證據。</td></tr><tr><td className="p-3">同類文法錯誤反覆出現</td><td className="p-3">一次集中檢查時態、主謂一致或代詞指向中的一項。</td></tr></tbody></table></div></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="audience-example"><h2 id="audience-example" className="text-2xl font-medium">原創示例：同一個主題，兩種讀者</h2><p className="mt-4 leading-8">主題是學校增設閱讀角。若向校長提出建議，先說明目的和可行安排；若在學生刊物寫文章，則先用學生熟悉的情境引入。不要因為主題相同就沿用同一套開頭。</p><p lang="en" className="mt-4 rounded-xl bg-surface-sunken p-5 leading-8">Letter: I am writing to suggest setting up a reading corner in the library, where students can exchange books during lunch breaks.</p><p lang="en" className="mt-4 rounded-xl bg-surface-sunken p-5 leading-8">Article: Looking for a quiet place to read at lunch? A student-run reading corner could make books easier to share.</p><p className="mt-4 leading-8">第一句直接提出建議，語氣較正式；第二句以讀者問題切入，語氣較親切。這些是原創教學例子，不是官方範文或保證高分句式。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="revision"><h2 id="revision" className="text-2xl font-medium">三步修改一篇文章</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8"><li>核對內容：題目要求的每個重點有沒有真正回答？</li><li>核對組織：每段是否有單一主要目的，例子是否支持觀點？</li><li>核對語言：語氣是否適合讀者，時態是否一致，連接詞是否表達正確關係？</li></ol><p className="mt-4 leading-8">先解決漏答或偏題，再修小型文法錯誤。本站寫作工具協助你自評，不會提供教師評分、官方分數或 AI 作文批改。</p><Link href="/writing" className="mt-5 inline-flex rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">使用英文寫作自評清單</Link></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="instructions"><h2 id="instructions" className="text-2xl font-medium">格式慣例必須服從題目</h2><p className="mt-4 leading-8">題目若指定刊物、收信人、演講場合或資料來源，先按指定要求處理。地址、日期或標題並非所有情境都必須出現，不能只背一張格式表。請配合當年評核要求與教師回饋核對。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
      </article>
      <section className="mt-12" aria-labelledby="english-links"><h2 id="english-links" className="mb-4 text-2xl font-medium">英文寫作與閱讀入口</h2><div className="grid gap-4 sm:grid-cols-2">{topics.map(topic => <InternalLinkCard key={topic.href} {...topic} />)}</div></section> {/* i18n-exempt: zh-Hant editorial content */}
    </section>
  </>
}
