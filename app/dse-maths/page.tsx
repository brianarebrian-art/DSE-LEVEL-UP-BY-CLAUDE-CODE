import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, InternalLinkCard } from '@/components/Seo/SeoNavigation'
import { createSeoMetadata } from '@/lib/seo'

const h1 = 'DSE Maths 數學筆記與解題路線' // i18n-exempt: zh-Hant editorial content
export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Maths 數學筆記與解題路線：二次方程、判別式與練習 | DSE Level Up', // i18n-exempt: zh-Hant SEO metadata
  description: '整理 DSE Maths 必修部分的數學學習路線，從因式分解、配方法與二次公式，到判別式及參數題的完整推導。提供原創例題、符號檢查和常見錯誤修正，連接現有數學課題筆記與練習題庫。先找出卡住的步驟，再按概念選擇下一項練習；題型解析並非考評局官方題目或評分參考，延伸部分 M1、M2 需另按課程要求準備，不作成績保證。', // i18n-exempt: zh-Hant SEO metadata
  path: '/dse-maths', type: 'website',
})

export default function DseMathsPage() {
  const topics = [
    { href: '/dse-maths/quadratic-equations', title: '一元二次方程完整筆記', description: '因式分解、配方法、二次公式與三條分步例題。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/dse-maths/question-types/quadratic-discriminant', title: '判別式參數題原創解析', description: '根的性質、參數範圍與代回檢查；非官方题解。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/notes/math', title: 'Maths 課題筆記索引', description: '瀏覽現有課題與概念重點，按題目條件找出需要重溫的部分。' }, // i18n-exempt: zh-Hant editorial content
    { href: '/subjects/math', title: '數學原創練習題入口', description: '選擇科目及課題，完成題庫練習並核對解析。' }, // i18n-exempt: zh-Hant editorial content
  ]
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE Maths', path: '/dse-maths' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
    <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
      <article className="max-w-3xl">
        <header><p className="text-sm font-medium text-accent">HKDSE Mathematics · 必修部分學習入口</p><h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{h1}</h1><p className="mt-5 text-lg leading-8 text-ink-muted">不要一次重看所有公式。先找出你在題目中停下的位置，再選擇對應筆記、原創例題及練習。</p></header> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="route-choice"><h2 id="route-choice" className="text-2xl font-medium">如何選擇下一個數學主題？</h2><div className="mt-5 overflow-x-auto"><table className="w-full text-left leading-7"><caption className="mb-3 text-left text-ink-muted">按目前的解題困難安排溫習</caption><thead><tr><th scope="col" className="p-3">遇到的困難</th><th scope="col" className="p-3">先處理的概念</th></tr></thead><tbody><tr><td className="p-3">找不到方程的根</td><td className="p-3">整理標準形式，辨認 a、b、c，再選擇因式分解或二次公式。</td></tr><tr><td className="p-3">不懂參數值或重根條件</td><td className="p-3">先用判別式描述根的性質，再解參數方程或不等式。</td></tr><tr><td className="p-3">答案算出來但不合題意</td><td className="p-3">代回原式，核對長度、時間及指定範圍等限制。</td></tr></tbody></table></div></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="warm-up"><h2 id="warm-up" className="text-2xl font-medium">先用一條原創短題檢查基礎</h2><p className="mt-4 leading-8">解 x² − 5x + 6 = 0。常數項為 6，找乘積 6、和 −5 的兩數，得到 −2 和 −3。因此 (x − 2)(x − 3) = 0，利用零乘積法得到 x = 2 或 x = 3。</p><p className="mt-4 leading-8">代回檢查：2² − 5 × 2 + 6 = 0；3² − 5 × 3 + 6 = 0。若卡在配對因子，先讀因式分解；若不明白為何每個因式可以等於零，先重溫零乘積法，不要只抄答案。</p><Link href="/dse-maths/quadratic-equations" className="mt-4 inline-block text-accent underline underline-offset-4">閱讀二次方程三種解法及完整例題</Link></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="scope"><h2 id="scope" className="text-2xl font-medium">必修與延伸部分不要混在一起</h2><p className="mt-4 leading-8">此入口集中於必修部分的代數解題。延伸部分 M1、M2 的微積分及其他內容有各自的課程要求，不能把一張必修溫習表當成全部範圍。請配合學校教學進度及考評局當年評核要求使用。</p><p className="mt-4 leading-8">本站例題是原創教學，題型解析不等於官方 Past Paper 題解，也沒有官方 marking scheme。完成後，使用合法取得的試卷及教師指引練習表達步驟；不會聲稱任何主題必考，也不會保證升級。</p></section> {/* i18n-exempt: zh-Hant editorial content */}
        <section className="mt-10" aria-labelledby="practice-next"><h2 id="practice-next" className="text-2xl font-medium">由訂正決定下一組練習</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-8"><li>不看答案先寫出第一步和所用規則。</li><li>核對每個等號、符號與分母，不只核對最終數字。</li><li>記下是概念、讀題還是計算問題，翌日重做同類題。</li></ol><Link href="/subjects/math" className="mt-5 inline-flex rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">選擇 Maths 課題並開始原創練習</Link></section> {/* i18n-exempt: zh-Hant editorial content */}
      </article>
      <section className="mt-12" aria-labelledby="math-links"><h2 id="math-links" className="mb-4 text-2xl font-medium">數學筆記與練習入口</h2><div className="grid gap-4 sm:grid-cols-2">{topics.map(topic => <InternalLinkCard key={topic.href} {...topic} />)}</div></section> {/* i18n-exempt: zh-Hant editorial content */}
    </section>
  </>
}
