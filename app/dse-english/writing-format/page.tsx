import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics, NextPrevChapter } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'

const title = 'DSE English Writing Format：Letter、Article、Report 結構 | DSE Level Up'
const description = 'DSE English writing format 指南：比較 letter、article、report 的結構、語氣、開首與結尾，附寫作前規劃和交卷前檢查清單。'
export const metadata: Metadata = createSeoMetadata({ title, description, path: '/dse-english/writing-format' })

export default function WritingFormatPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE English', path: '/dse-english' }, { name: 'Writing format', path: '/dse-english/writing-format' }]} />
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-10">
      <article className="max-w-3xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title, description, path: '/dse-english/writing-format' })) }} />
        <p className="text-sm font-medium text-accent">DSE English Language · Writing</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">DSE English writing format 指南</h1>
        <p className="mt-5 text-lg leading-8 text-ink-muted">先認清文體，再決定格式、語氣和段落功能；格式不是死背模板，而是幫讀者快速理解你的目的。</p>
        <section className="mt-12" aria-labelledby="compare"><h2 id="compare" className="text-2xl font-medium text-ink">三種常見文體怎樣分？</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead><tr className="border-b border-line"><th className="p-3">文體</th><th className="p-3">你要交代什麼</th><th className="p-3">語氣提醒</th></tr></thead><tbody><tr className="border-b border-line"><td className="p-3 font-medium">Letter / Email</td><td className="p-3">寫給特定收件人，目的和關係要清楚</td><td className="p-3">按收件人調整正式程度</td></tr><tr className="border-b border-line"><td className="p-3 font-medium">Article</td><td className="p-3">吸引讀者並有條理地分享觀點</td><td className="p-3">標題和開首要直接，避免離題</td></tr><tr><td className="p-3 font-medium">Report</td><td className="p-3">整理觀察、資料和建議</td><td className="p-3">客觀、清晰，可用小標題</td></tr></tbody></table></div></section>
        <section className="mt-10" aria-labelledby="plan"><h2 id="plan" className="text-2xl font-medium text-ink">寫之前用三分鐘規劃</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft"><li>圈出題目要求的讀者、目的和所有 bullet points。</li><li>每一個 bullet point 寫一句核心意思，再安排段落順序。</li><li>決定開首如何交代背景，結尾如何回應目的或提出下一步。</li></ol></section>
        <section className="mt-10 rounded-2xl bg-surface-sunken p-6" aria-labelledby="check"><h2 id="check" className="text-2xl font-medium text-ink">交卷前檢查</h2><ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink-soft"><li>每一項題目要求都有回應，不只寫自己熟悉的部分。</li><li>全文語氣一致，沒有在正式 letter 中突然使用 slang。</li><li>段落之間有清楚連接，句子不會全部由 and / also 開始。</li><li>檢查時態、主謂一致、拼字和標點，特別是人名與地名。</li></ul></section>
        <div className="mt-10 rounded-2xl border border-accent/30 p-6"><h2 className="text-xl font-medium text-ink">想把格式變成習慣？</h2><p className="mt-2 text-ink-muted">完成一題，再用清單逐項檢查你的答案。</p><Link href="/writing" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white">開始英文寫作</Link></div>
      </article>
    </main>
    <RelatedTopics topics={[{ href: '/dse-english', title: '返回 DSE English 科目頁', description: '繼續瀏覽英文筆記與練習。' }, { href: '/notes/english-language', title: '英文課題筆記', description: '按課題整理語文重點。' }, { href: '/dse-maths/quadratic-equations', title: 'Maths 一元二次方程', description: '轉到另一個完整主題筆記。' }]} />
    <NextPrevChapter next={{ name: 'DSE English 科目頁', path: '/dse-english' }} />
  </>
}
