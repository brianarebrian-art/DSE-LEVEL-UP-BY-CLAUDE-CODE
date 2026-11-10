import { completeSeoMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import UTMTracker from '@/components/ads/UTMTracker'

export const metadata = completeSeoMetadata({
  title: '2027 DSE 改革考綱題庫 · 絕不操過期 Past Paper | DSE Level Up', // i18n-exempt: zh-Hant metadata
  description: '針對 2027 DSE 考綱調整，全面剔除過期題型與無效操練。提供最新考法與核心概念題庫，免費即做。', // i18n-exempt: zh-Hant metadata
}, '/dse-2027')

export default function Dse2027LandingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <UTMTracker />
      <span className="inline-block rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
        2027 DSE 改革專版 {/* i18n-exempt: ad heading */}
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        仲做緊 10 年前 Past Paper？小心操錯過期課題 {/* i18n-exempt: ad heading */}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
        考評局近年題型與課綱大幅精簡。DSE Level Up 題目緊密對齊最新考試要求，幫你慳返時間，精準命中考點。 {/* i18n-exempt: ad copy */}
      </p>

      <div className="mt-8 flex justify-center">
        <Link
          href="/start"
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-8 text-base font-semibold text-on-accent hover:bg-accent-hover"
        >
          <span>開始 2027 新綱精準練習</span> {/* i18n-exempt: ad CTA */}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-ink">剔除 Out of Syllabus 內容 {/* i18n-exempt */}</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            我們嚴格對照考評局最新課程指引，所有已刪除、不再考核的題型均已封存，絕不浪費學生寶貴溫習時間。 {/* i18n-exempt */}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-ink">注重概念判斷，拒絕盲目背誦 {/* i18n-exempt */}</h2>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            近年 DSE 考核著重靈活應用與陷阱辨識。我們的題目專為訓練解題敏銳度而設計，幫你真正掌握考點。 {/* i18n-exempt */}
          </p>
        </div>
      </div>
    </div>
  )
}
