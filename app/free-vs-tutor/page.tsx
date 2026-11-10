import { completeSeoMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import UTMTracker from '@/components/ads/UTMTracker'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'

export const metadata = completeSeoMetadata({
  title: '補習社成皮嘢？不如免費操 2萬多題 DSE 題庫 | DSE Level Up', // i18n-exempt: zh-Hant metadata
  description: '補習名師動輒幾千一個月，但你真係需要聽幾粒鐘廢話？DSE Level Up 提供 2萬多題免費真題改寫題庫，即時詳解，直擊考試重點。', // i18n-exempt: zh-Hant metadata
}, '/free-vs-tutor')

export default function FreeVsTutorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <UTMTracker />
      <div className="text-center">
        <span className="inline-block rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
          慳返每個月幾千蚊補習費 {/* i18n-exempt: ad heading */}
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          補習社成萬蚊？我們免費操到 5** {/* i18n-exempt: ad heading */}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink-muted">
          操卷先係升 Grade 關鍵。名師技巧聽完唔做都係零，不如每天 10 題精準操練判斷力。 {/* i18n-exempt: ad copy */}
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-surface-sunken text-ink">
            <tr>
              <th className="p-4 font-semibold">特點比較 {/* i18n-exempt */}</th>
              <th className="p-4 font-semibold text-accent">DSE Level Up</th>
              <th className="p-4 font-semibold text-ink-muted">大型連鎖補習社 {/* i18n-exempt */}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-soft">
            <tr>
              <td className="p-4 font-medium">每科費用 {/* i18n-exempt */}</td>
              <td className="p-4 font-bold text-emerald-800">$0 / 全免費 {/* i18n-exempt */}</td>
              <td className="p-4 text-ink-muted">約 $800 - $1,500 / 月 {/* i18n-exempt */}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">題目數量 {/* i18n-exempt */}</td>
              <td className="p-4 font-bold text-accent">{TOTAL_QUESTIONS.toLocaleString()} 題隨時做 {/* i18n-exempt */}</td>
              <td className="p-4 text-ink-muted">每星期十幾題 Exercise {/* i18n-exempt */}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">即時反饋 {/* i18n-exempt */}</td>
              <td className="p-4 font-bold text-accent">秒出解析與常犯錯因 {/* i18n-exempt */}</td>
              <td className="p-4 text-ink-muted">問助教等幾日或冇人理 {/* i18n-exempt */}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">時間彈性 {/* i18n-exempt */}</td>
              <td className="p-4 font-bold text-accent">搭車臨瞓隨時開操 {/* i18n-exempt */}</td>
              <td className="p-4 text-ink-muted">固定時間上堂浪費車程 {/* i18n-exempt */}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/start"
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-8 text-base font-semibold text-on-accent hover:bg-accent-hover"
        >
          <span>立即免費開操，留返啲錢食飯好過</span> {/* i18n-exempt: ad CTA */}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  )
}
