import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata, softwareApplicationJsonLd } from '@/lib/seo'

const title = 'AI DSE 練習題生成器：按科目和弱項操練 | DSE Level Up'
const description = '用 AI 按 DSE 科目、課題和難度建立練習方向，再配合原創題目檢查弱項；先理解概念，不以保證成績作承諾。'
export const metadata: Metadata = createSeoMetadata({ title, description, path: '/ai/practice-generator', type: 'website' })

export default function PracticeGeneratorPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'AI 學習工具', path: '/ai/practice-generator' }, { name: 'AI 練習題生成器', path: '/ai/practice-generator' }]} />
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-10"><article className="max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd({ name: title, description, path: '/ai/practice-generator' })) }} />
      <p className="text-sm font-medium text-accent">AI 學習工具</p><h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">AI DSE 練習題生成器</h1><p className="mt-5 text-lg leading-8 text-ink-muted">由科目和課題開始，將「我唔識」變成一個可以逐步練習的學習任務。</p>
      <section className="mt-12" aria-labelledby="how"><h2 id="how" className="text-2xl font-medium text-ink">工具怎樣幫你？</h2><ol className="mt-5 grid gap-4 sm:grid-cols-3"><li className="rounded-xl bg-surface-sunken p-4"><b>1. 選擇範圍</b><p className="mt-2 text-sm text-ink-muted">指定科目、課題和難度。</p></li><li className="rounded-xl bg-surface-sunken p-4"><b>2. 先做題</b><p className="mt-2 text-sm text-ink-muted">獨立寫出步驟，不急著看提示。</p></li><li className="rounded-xl bg-surface-sunken p-4"><b>3. 回看錯誤</b><p className="mt-2 text-sm text-ink-muted">把錯誤分類，再選下一組練習。</p></li></ol></section>
      <section className="mt-10 rounded-2xl border border-line p-6"><h2 className="text-xl font-medium text-ink">使用前要知道</h2><p className="mt-2 leading-7 text-ink-soft">AI 生成的解釋需要由你按課本、課程要求和題目條件核對。工具是學習輔助，不是教師評分，也不保證任何考試成績。</p><Link href="/practice" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white">前往練習平台</Link></section>
    </article></main>
    <RelatedTopics topics={[{ href: '/dse-maths/quadratic-equations', title: 'Maths 一元二次方程', description: '先閱讀一個完整概念頁。' }, { href: '/dse-english/writing-format', title: 'English writing format', description: '按文體整理英文寫作方法。' }, { href: '/ai/study-plan', title: 'AI 個人化學習計劃', description: '把弱項轉成下一步安排。' }]} />
  </>
}
