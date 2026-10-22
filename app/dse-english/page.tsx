import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, InternalLinkCard } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE English 英文筆記與寫作技巧：格式、範文及題解 | DSE Level Up',
  description: '整理 DSE English writing format、文章結構、語氣、常見文法錯誤與閱讀技巧，配合例子和練習，幫你建立可重複使用的英文答題方法。',
  path: '/dse-english',
  type: 'website',
})

export default function DseEnglishPage() {
  const topics = [
    { href: '/dse-english/writing-format', title: '英文寫作格式指南', description: 'letter、article、report 的結構、語氣和檢查方法。' },
    { href: '/writing', title: '英文寫作練習', description: '用清晰步驟整理你的寫作思路。' },
    { href: '/notes/english-language', title: 'DSE English 課題筆記', description: '按課題瀏覽字詞、文法與閱讀重點。' },
  ]
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE English', path: '/dse-english' }]} />
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-10">
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: String(metadata.title), description: String(metadata.description), path: '/dse-english' })) }} />
        <p className="mb-3 text-sm font-medium text-accent">HKDSE English Language</p>
        <h1 className="max-w-3xl text-4xl font-medium leading-tight text-ink sm:text-5xl">DSE English 英文筆記與寫作技巧</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">先理解題型要你做什麼，再用合適的結構、語氣和例子寫出清楚答案。</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/writing" className="rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">開始英文寫作練習</Link><Link href="/dse-english/writing-format" className="rounded-xl border border-line px-5 py-3 font-medium text-accent">查看 writing format</Link></div>
        <section className="mt-14" aria-labelledby="study-path"><h2 id="study-path" className="text-2xl font-medium text-ink">建議溫習路線</h2><ol className="mt-5 grid gap-3 text-ink-soft sm:grid-cols-3"><li className="rounded-xl bg-surface-sunken p-4"><b>1. 認清文體</b><br />先分辨 letter、article 或 report。</li><li className="rounded-xl bg-surface-sunken p-4"><b>2. 設計段落</b><br />每段有清楚目的和連接。</li><li className="rounded-xl bg-surface-sunken p-4"><b>3. 修改答案</b><br />最後檢查語氣、文法與內容覆蓋。</li></ol></section>
      </article>
    </main>
    <section className="mx-auto max-w-5xl px-4 pb-10"><h2 className="mb-4 text-2xl font-medium text-ink">DSE English 熱門內容</h2><div className="grid gap-4 sm:grid-cols-3">{topics.map((topic) => <InternalLinkCard key={topic.href} {...topic} />)}</div></section>
  </>
}
