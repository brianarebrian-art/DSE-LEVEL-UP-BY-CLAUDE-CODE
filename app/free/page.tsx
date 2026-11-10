import { completeSeoMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import UTMTracker from '@/components/ads/UTMTracker'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'

export const metadata = completeSeoMetadata({
  title: '全免費 DSE 題庫 · 2萬多題真題改寫 | DSE Level Up', // i18n-exempt: zh-Hant metadata
  description: '全港涵蓋海量 DSE 真題改寫題庫，高中甲類全覆蓋。零費用、無廣告、唔使登入，即時開始在線操練。', // i18n-exempt: zh-Hant metadata
}, '/free')

export default function FreeLandingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <UTMTracker />
      <span className="inline-block rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
        100% Free · 全免操卷 {/* i18n-exempt: ad heading */}
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        涵蓋 {TOTAL_QUESTIONS.toLocaleString()} 題 DSE 免費題庫，何必畀錢買 Past Paper？ {/* i18n-exempt: ad heading */}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
        {TOTAL_QUESTIONS.toLocaleString()} 條甲類科目真題改寫，緊貼 2027 考綱。無收費牆、無鎖題、唔使睇廣告，隨時隨地用電話即時開操。 {/* i18n-exempt: ad copy */}
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/start"
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-8 text-base font-semibold text-on-accent hover:bg-accent-hover"
        >
          <span>即刻免費開始</span> {/* i18n-exempt: ad CTA */}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="font-semibold text-ink">0 費用 0 廣告</div> {/* i18n-exempt */}
          <p className="mt-2 text-xs text-ink-muted">
            我們承諾永久全免費，絕無隱藏收費或做幾題就要睇 30 秒廣告。 {/* i18n-exempt */}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="font-semibold text-ink">{TOTAL_QUESTIONS.toLocaleString()} 題海量題庫</div> {/* i18n-exempt */}
          <p className="mt-2 text-xs text-ink-muted">
            覆蓋中英數通識及所有選修科，連冷門選修都有充足題目。 {/* i18n-exempt */}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="font-semibold text-ink">即時詳盡解析</div> {/* i18n-exempt */}
          <p className="mt-2 text-xs text-ink-muted">
            每條題目均附帶考評局常見思維陷阱分析，做錯即刻明。 {/* i18n-exempt */}
          </p>
        </div>
      </div>
    </div>
  )
}
