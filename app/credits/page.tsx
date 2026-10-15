import type { Metadata } from 'next'
import { ExternalLink, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: '守護者致謝名單 | DSE Level Up',
  description: '感謝願意為 DSE Level Up 學生付出時間與技術的社群同路人。',
}

const contributions = [
  '發現數學科微積分題分類錯誤',
  '協助驗證 Supabase 性能架構',
  '提出 localStorage 篡改防禦方案',
]

export default function CreditsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-bg-dark text-text-primary">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 border-b border-white/10 pb-10 sm:mb-12 sm:pb-12">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
            <ShieldCheck size={30} aria-hidden="true" />
          </div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neon-cyan">DSE LEVEL UP / COMMUNITY</p>
          <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">守護者致謝名單</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
            DSE Level Up 係一個 $0 預算、純粹幫全港 DSE 考生輕鬆溫書嘅非營利專案。以下係願意為學生付出嘅技術同路人——
          </p>
        </header>

        <section aria-labelledby="contributors-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-neon-cyan">01 / CONTRIBUTORS</p>
              <h2 id="contributors-heading" className="mt-2 text-2xl font-semibold text-white">一齊守住學習體驗</h2>
            </div>
            <span className="hidden rounded-full border border-white/15 px-3 py-1 text-xs text-text-secondary sm:inline-flex">1 位守護者</span>
          </div>

          <article className="overflow-hidden rounded-2xl border border-neon-cyan/25 bg-bg-dark-2 shadow-[0_0_40px_rgba(0,245,212,0.06)]">
            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neon-cyan font-mono text-lg font-bold text-bg-dark">HW</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">HugoWong</h3>
                    <span className="mt-1 inline-flex rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 text-xs font-medium text-neon-cyan">科目審核 / 技術協作者</span>
                  </div>
                </div>
                <a href="https://github.com/hugow0528" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 self-start rounded-lg border border-white/15 px-3 text-sm text-text-secondary transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan" aria-label="前往 HugoWong 的 GitHub">
                  <ExternalLink size={15} aria-hidden="true" />
                  github.com/hugow0528
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2" aria-label="負責科目">
                {['ICT', 'Biology', 'Mathematics'].map((subject) => (
                  <span key={subject} className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-text-secondary">{subject}</span>
                ))}
              </div>

              <div className="mt-7 grid gap-7 border-t border-white/10 pt-7 md:grid-cols-[1fr_0.9fr]">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-white">核心貢獻</h4>
                  <ul className="space-y-3 text-sm leading-6 text-text-secondary">
                    {contributions.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" aria-hidden="true" />{item}</li>)}
                  </ul>
                </div>
                <blockquote className="border-l-2 border-neon-cyan/60 bg-neon-cyan/5 px-5 py-4 text-sm italic leading-7 text-text-primary">
                  「掌握邏輯，唔係背答案。寫 code 同溫書，其實都係同一個道理。」
                </blockquote>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-10 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/5 p-5 sm:mt-12 sm:p-7" aria-labelledby="community-heading">
          <p className="text-sm text-neon-cyan">02 / COMMUNITY CALL</p>
          <h2 id="community-heading" className="mt-2 text-xl font-semibold text-white">一齊令平台變得更好</h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
            如果你都發現咗 Bug、洞察，或者有安全疑慮，歡迎 DM 我哋。我哋冇 Bug Bounty、冇獎金、冇禮品，但想送你一份心意：永久公開嘅「守護者致謝名單」。
          </p>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-7 text-xs leading-6 text-text-secondary">
          <p>免責聲明：本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局 (HKEAA) 官方試題。官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。</p>
          <p className="mt-3 text-text-secondary">© 2026 DSE Level Up · 非商業用途 · 保留所有權利</p>
        </footer>
      </div>
    </main>
  )
}
