import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics, RelatedPastPapers, NextPrevChapter } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'

const title = 'DSE Maths 一元二次方程：公式、判別式與題解 | DSE Level Up'
const description = '完整整理 DSE Maths 一元二次方程的因式分解、公式法、判別式與常見考試陷阱，附分步例題與練習方向。'
export const metadata: Metadata = createSeoMetadata({ title, description, path: '/dse-maths/quadratic-equations' })

export default function QuadraticEquationsPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE Maths', path: '/dse-maths' }, { name: '一元二次方程', path: '/dse-maths/quadratic-equations' }]} />
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-10">
      <article className="prose prose-slate max-w-3xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title, description, path: '/dse-maths/quadratic-equations' })) }} />
        <p className="text-sm font-medium text-accent">DSE Maths · Algebra</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">DSE Maths 一元二次方程</h1>
        <p className="mt-5 text-lg leading-8 text-ink-muted">你會學到如何選擇解法、正確使用判別式，並在最後一步檢查答案是否符合題目。</p>
        <section className="mt-12" aria-labelledby="concept"><h2 id="concept" className="text-2xl font-medium text-ink">一元二次方程是什麼？</h2><p className="mt-4 leading-8 text-ink-soft">標準形式是 <strong>ax² + bx + c = 0</strong>，其中 a ≠ 0。解題前先把所有項移到同一邊，整理成標準形式，才不會把係數和常數項看錯。</p></section>
        <section className="mt-10" aria-labelledby="methods"><h2 id="methods" className="text-2xl font-medium text-ink">三種常用解法</h2><ol className="mt-4 space-y-4 text-ink-soft"><li><strong>因式分解：</strong>當兩個整數因子容易找出時，速度最快。</li><li><strong>公式法：</strong>使用 x = (−b ± √(b² − 4ac)) / 2a，代入前先標出 a、b、c。</li><li><strong>判別式：</strong>Δ = b² − 4ac；Δ &gt; 0 有兩個實根，Δ = 0 有一個重根，Δ &lt; 0 沒有實根。</li></ol></section>
        <section className="mt-10" aria-labelledby="example"><h2 id="example" className="text-2xl font-medium text-ink">分步例題：2x² − 5x − 3 = 0</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft"><li>辨認 a = 2、b = −5、c = −3。</li><li>代入公式：x = (5 ± √(25 + 24)) / 4。</li><li>化簡 √49 = 7，所以 x = (5 ± 7) / 4。</li><li>得到 x = 3 或 x = −1/2，再代回原式核對。</li></ol></section>
        <section className="mt-10 rounded-2xl bg-surface-sunken p-6" aria-labelledby="mistakes"><h2 id="mistakes" className="text-2xl font-medium text-ink">常見失分位</h2><ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink-soft"><li>把 b = −5 寫成 b = 5，令 −b 和 b² 都出錯。</li><li>忘記公式分母是 2a，而不是 2。</li><li>只寫答案，沒有列出足夠步驟讓閱卷者跟進。</li><li>題目有範圍限制時，沒有檢查根是否可接受。</li></ul></section>
        <section className="mt-10" aria-labelledby="exam"><h2 id="exam" className="text-2xl font-medium text-ink">DSE 考試重點</h2><p className="mt-4 leading-8 text-ink-soft">遇到二次方程，先整理形式，再按係數和題目要求選方法。若題目問根的性質，判別式往往比完整求根更直接。每一步保留清楚的等式鏈，方便自己檢查，也讓答案可獲得方法分。</p></section>
        <div className="mt-10 rounded-2xl border border-accent/30 p-6"><h2 className="text-xl font-medium text-ink">想即時操練？</h2><p className="mt-2 text-ink-muted">用一組一元二次方程題目測試自己能否獨立選擇解法。</p><Link href="/subjects/mathematics" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white">開始 Maths 練習</Link></div>
      </article>
    </main>
    <RelatedPastPapers href="/subjects/mathematics" />
    <RelatedTopics topics={[{ href: '/dse-maths', title: '返回 DSE Maths 科目頁', description: '按章節選擇下一個數學主題。' }, { href: '/writing', title: '英文寫作技巧', description: '轉到另一個熱門 DSE 學習主題。' }, { href: '/practice', title: '開始全科練習', description: '用短練習檢查自己的弱項。' }]} />
    <NextPrevChapter next={{ name: 'DSE Maths 科目頁', path: '/dse-maths' }} />
  </>
}
