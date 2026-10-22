import { completeSeoMetadata } from '@/lib/seo'
import { ExternalLink, ShieldCheck } from 'lucide-react'
import ExternalLinkGate from '@/components/ExternalLinkGate'

export const metadata = completeSeoMetadata({
  title: '守護者致謝名單 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '認識曾為 DSE Level Up 提供學科覆核、技術檢查或安全建議的協作者及其公開貢獻；本頁只記錄可核實的協助項目，並說明如何回報錯誤、提出內容洞察或安全疑慮，讓學生可了解平台持續改善背後的實際參與，而非把致謝名單當作成效或認證聲明。所有列出的資料均以公開頁面所示內容為準，亦不代表任何人對平台作出成效保證。', // i18n-exempt: zh-Hant fixed search metadata
}, '/credits')

const contributions = [
  { zh: '發現數學科微積分題分類錯誤', en: 'Identified misclassified calculus questions in the maths bank.' },
  { zh: '協助驗證 Supabase 性能架構', en: 'Helped examine the Supabase performance architecture.' },
  { zh: '提出 localStorage 篡改防禦方案', en: 'Proposed protection against localStorage tampering.' },
]

export default function CreditsPage() {
  return (
    <section className="min-h-screen bg-ml-canvas text-ml-ink">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 border-b border-ml-line/40 pb-10 sm:mb-12 sm:pb-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-ml-sage/45 bg-ml-muted text-ml-sage"><ShieldCheck size={30} aria-hidden="true" /></div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-ml-sage">DSE LEVEL UP / COMMUNITY</p>
          <h1 className="font-serif text-4xl leading-tight text-ml-ink sm:text-5xl">守護者致謝名單 · Contributor acknowledgements</h1>{/* i18n-exempt: actual bilingual static text */}
          <p lang="zh-Hant" className="mt-5 max-w-2xl text-base leading-8 text-ml-ink-soft sm:text-lg">DSE Level Up 係一個 $0 預算、純粹幫全港 DSE 考生輕鬆溫書嘅非營利專案。以下係願意為學生付出嘅技術同路人。</p>{/* i18n-exempt: paired with English paragraph below */}
          <p lang="en" className="mt-3 max-w-2xl text-base leading-8 text-ml-ink-soft">DSE Level Up is a zero-budget, non-profit project that helps Hong Kong DSE students revise. We acknowledge the technical collaborators who have contributed to that work.</p>
        </header>
        <section aria-labelledby="contributors-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-sm text-ml-sage">01 / CONTRIBUTORS</p><h2 id="contributors-heading" className="mt-2 text-2xl font-semibold text-ml-ink">一齊守住學習體驗 · Supporting the learning experience</h2>{/* i18n-exempt: actual bilingual static text */}</div>
            <span className="hidden rounded-full border border-ml-line/55 px-3 py-1 text-xs text-ml-ink-soft sm:inline-flex">1 位守護者 · 1 contributor</span>{/* i18n-exempt: actual bilingual static text */}
          </div>
          <article className="overflow-hidden rounded-2xl border border-ml-line/55 bg-ml-surface shadow-sm">
            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ml-sage font-mono text-lg font-bold text-ml-on-brand">HW</div>
                  <div><h3 className="text-xl font-semibold text-ml-ink">HugoWong</h3><span className="mt-1 inline-flex rounded-full border border-ml-sage/45 bg-ml-muted px-2.5 py-1 text-xs font-medium text-ml-sage">科目審核／技術協作者 · Subject review / technical collaborator</span>{/* i18n-exempt: actual bilingual static text */}</div>
                </div>
                <ExternalLinkGate href="https://github.com/hugow0528" platform="GitHub" className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg border border-ml-line/55 px-3 text-sm text-ml-ink-soft transition-colors hover:border-ml-sage hover:text-ml-sage"><ExternalLink size={15} aria-hidden="true" />github.com/hugow0528</ExternalLinkGate>
              </div>
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Subjects supported">{['ICT', 'Biology', 'Mathematics'].map((subject) => <span key={subject} className="rounded-md border border-ml-line/55 px-2.5 py-1 text-xs text-ml-ink-soft">{subject}</span>)}</div>
              <div className="mt-7 grid gap-7 border-t border-ml-line/40 pt-7 md:grid-cols-[1fr_0.9fr]">
                <div><h4 className="mb-3 text-sm font-medium text-ml-ink">核心貢獻 · Contributions</h4>{/* i18n-exempt: actual bilingual static text */}<ul className="space-y-3 text-sm leading-6 text-ml-ink-soft">{contributions.map((item) => <li key={item.en} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ml-sage" aria-hidden="true" /><div><p lang="zh-Hant">{item.zh}</p><p lang="en">{item.en}</p></div></li>)}</ul></div>
                <blockquote className="border-l-2 border-ml-sage bg-ml-muted px-5 py-4 text-sm italic leading-7 text-ml-ink"><p lang="zh-Hant">掌握邏輯，唔係背答案。寫 code 同溫書，其實都係同一個道理。</p>{/* i18n-exempt: paired English translation */}<p lang="en" className="mt-2">Understand the logic, rather than memorising answers. Coding and revision share that principle.</p></blockquote>
              </div>
            </div>
          </article>
        </section>
        <section className="mt-10 rounded-2xl border border-ml-line/55 bg-ml-muted p-5 sm:mt-12 sm:p-7" aria-labelledby="community-heading">
          <p className="text-sm text-ml-sage">02 / COMMUNITY CALL</p>
          <h2 id="community-heading" className="mt-2 text-xl font-semibold text-ml-ink">一齊令平台變得更好 · Help improve the platform</h2>{/* i18n-exempt: actual bilingual static text */}
          <p lang="zh-Hant" className="mt-4 text-sm leading-7 text-ml-ink-soft sm:text-base">如果你發現 Bug、內容問題或者安全疑慮，可以透過平台公開聯絡方式回報。我哋冇 Bug Bounty、獎金或禮品，公開致謝亦不代表對平台作出成效認證。</p>{/* i18n-exempt: paired English paragraph */}
          <p lang="en" className="mt-3 text-sm leading-7 text-ml-ink-soft">Report bugs, content issues or safety concerns through the platform&apos;s public contact channels. We offer no bug bounty, prizes or gifts. An acknowledgement is not a certification of the platform&apos;s effectiveness.</p>
        </section>
        <footer className="mt-12 border-t border-ml-line/40 pt-7 text-xs leading-6 text-ml-ink-soft">
          <p lang="zh-Hant">本平台試題為獨立改寫版本，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請從 HKEAA 合法渠道取得。練習表現只反映本站作答紀錄，不是官方成績或預測；最終成績以 HKEAA 公布為準。</p>{/* i18n-exempt: paired English disclaimer */}
          <p lang="en" className="mt-3">Questions are independently rewritten, not official HKEAA questions. Obtain official past papers through legitimate HKEAA channels. Practice performance reflects answers recorded here, not official results or predictions; final results are determined by the HKEAA.</p>
          <p className="mt-3">© 2026 DSE Level Up · 非商業用途 · Non-commercial use · 保留所有權利 · All rights reserved</p>{/* i18n-exempt: actual bilingual static text */}
        </footer>
      </div>
    </section>
  )
}
