import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, InternalLinkCard } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Maths 數學筆記與題解：核心概念、公式及練習 | DSE Level Up',
  description: '整理 DSE Maths 常考概念、公式、例題與 Past Paper 題解，從一元二次方程到函數和微積分，幫你按章節建立數學解題框架。',
  path: '/dse-maths',
  type: 'website',
})

export default function DseMathsPage() {
  const topics = [
    { href: '/dse-maths/quadratic-equations', title: '一元二次方程完整筆記', description: '因式分解、公式法、判別式、例題與常見失分位。' },
    { href: '/notes/mathematics', title: 'DSE Maths 課題筆記', description: '按課題瀏覽現有練習與概念重點。' },
    { href: '/subjects/mathematics', title: 'DSE Maths 練習題', description: '用限時練習檢查自己能否應用公式。' },
  ]
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE Maths', path: '/dse-maths' }]} />
    <main id="main-content" className="mx-auto max-w-5xl px-4 pb-16 pt-10">
      <article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: String(metadata.title), description: String(metadata.description), path: '/dse-maths' })) }} />
        <p className="mb-3 text-sm font-medium text-accent">HKDSE Mathematics</p>
        <h1 className="max-w-3xl text-4xl font-medium leading-tight text-ink sm:text-5xl">DSE Maths 數學筆記與題解</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">由概念、公式到 Past Paper 題解，逐章整理你真正需要用來解題的數學思路。</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/subjects/mathematics" className="rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">開始 DSE Maths 練習</Link><Link href="/dse-maths/quadratic-equations" className="rounded-xl border border-line px-5 py-3 font-medium text-accent">先讀一元二次方程</Link></div>
        <section className="mt-14" aria-labelledby="what-you-learn"><h2 id="what-you-learn" className="text-2xl font-medium text-ink">這個科目頁可以幫你什麼？</h2><ul className="mt-5 grid gap-3 text-ink-soft sm:grid-cols-2"><li className="rounded-xl bg-surface-sunken p-4">把公式放回題目語境，而不是只背公式。</li><li className="rounded-xl bg-surface-sunken p-4">找出最常見的符號、步驟與計算失誤。</li><li className="rounded-xl bg-surface-sunken p-4">從短例題再連到 Past Paper 練習。</li><li className="rounded-xl bg-surface-sunken p-4">按自己的弱項選擇下一個章節。</li></ul></section>
      </article>
    </main>
    <section className="mx-auto max-w-5xl px-4 pb-10"><h2 className="mb-4 text-2xl font-medium text-ink">DSE Maths 熱門內容</h2><div className="grid gap-4 sm:grid-cols-3">{topics.map((topic) => <InternalLinkCard key={topic.href} {...topic} />)}</div></section>
  </>
}
