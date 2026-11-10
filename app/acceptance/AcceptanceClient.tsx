'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getFunnelMetrics, recordFunnelStep } from '@/lib/analytics/funnel'

export default function AcceptanceClient() {
  const [metrics, setMetrics] = useState<Record<string, number>>({})

  useEffect(() => {
    setMetrics(getFunnelMetrics())
  }, [])

  const triggerStep = (step: 'landing_view' | 'click_start' | 'register_complete' | 'finish_first_session') => {
    recordFunnelStep(step)
    setMetrics(getFunnelMetrics())
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-ink">
      <div className="mb-8 border-b border-line pb-6">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          Internal Only · 隔離驗收路由 {/* i18n-exempt: admin acceptance */}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Phase 8 成果隔離驗收儀表板 (Isolated Acceptance) {/* i18n-exempt: admin acceptance */}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          展示 UI/UX 轉換漏斗重設、SEO/GEO/AEO 題目靜態頁與 AI 爬蟲支援、以及廣告 Landing 與預算控管成果。 {/* i18n-exempt: admin acceptance */}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* D1: UI/UX 驗收 */}
        <section className="rounded-xl border border-line bg-surface-sunken p-6 shadow-sm">
          <h2 className="text-xl font-bold text-accent">D1: UI/UX 視覺與轉換漏斗 {/* i18n-exempt: admin acceptance */}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">Before vs After 對比 {/* i18n-exempt: admin acceptance */}</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-ink-muted text-xs">
                <li>舊版：首頁需向下滾動 3 屏才見開始練習按鈕，視覺為偏向後台之傳統列表。 {/* i18n-exempt: admin acceptance */}</li>
                <li>新版：Morandi 色系 + 玻璃擬態，3 秒直達「免費 2 萬多題 即刻開始」核心 CTA。 {/* i18n-exempt: admin acceptance */}</li>
                <li>加入動態真實試卷數據 SocialProof，去除浮誇文案，合規香港考生用語。 {/* i18n-exempt: admin acceptance */}</li>
                <li>練習介面 PracticeGameUI：提供即時反饋、零干擾進度條，提升完成感。 {/* i18n-exempt: admin acceptance */}</li>
              </ul>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">轉化漏斗 Live Tracker (localStorage) {/* i18n-exempt: admin acceptance */}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-surface-sunken p-2 border border-line">
                  <div className="text-ink-muted">首頁瀏覽 (landing_view) {/* i18n-exempt */}</div>
                  <div className="text-lg font-bold text-accent">{metrics.landing_view || 0}</div>
                </div>
                <div className="rounded bg-surface-sunken p-2 border border-line">
                  <div className="text-ink-muted">點擊開始 (click_start) {/* i18n-exempt */}</div>
                  <div className="text-lg font-bold text-accent">{metrics.click_start || 0}</div>
                </div>
                <div className="rounded bg-surface-sunken p-2 border border-line">
                  <div className="text-ink-muted">完成註冊 (register_complete) {/* i18n-exempt */}</div>
                  <div className="text-lg font-bold text-accent">{metrics.register_complete || 0}</div>
                </div>
                <div className="rounded bg-surface-sunken p-2 border border-line">
                  <div className="text-ink-muted">完成首卷 (finish_first_session) {/* i18n-exempt */}</div>
                  <div className="text-lg font-bold text-accent">{metrics.finish_first_session || 0}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => triggerStep('landing_view')}
                  className="rounded bg-surface-raised px-2.5 py-1 text-xs font-medium border border-line hover:border-accent"
                >
                  測試首頁瀏覽 {/* i18n-exempt */}
                </button>
                <button
                  type="button"
                  onClick={() => triggerStep('click_start')}
                  className="rounded bg-surface-raised px-2.5 py-1 text-xs font-medium border border-line hover:border-accent"
                >
                  測試點擊開始 {/* i18n-exempt */}
                </button>
                <button
                  type="button"
                  onClick={() => triggerStep('register_complete')}
                  className="rounded bg-surface-raised px-2.5 py-1 text-xs font-medium border border-line hover:border-accent"
                >
                  測試註冊 {/* i18n-exempt */}
                </button>
                <button
                  type="button"
                  onClick={() => triggerStep('finish_first_session')}
                  className="rounded bg-surface-raised px-2.5 py-1 text-xs font-medium border border-line hover:border-accent"
                >
                  測試完成卷 {/* i18n-exempt */}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* D2: SEO / GEO / AEO 驗收 */}
        <section className="rounded-xl border border-line bg-surface-sunken p-6 shadow-sm">
          <h2 className="text-xl font-bold text-accent">D2: SEO + GEO + AEO 架構 {/* i18n-exempt: admin acceptance */}</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">AI 爬蟲與標準規範端點 {/* i18n-exempt: admin acceptance */}</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-ink-muted">
                <li>
                  <Link href="/robots.txt" className="text-accent underline">
                    /robots.txt
                  </Link>
                  ：明確放行 GPTBot、ClaudeBot、Google-Extended、PerplexityBot。 {/* i18n-exempt: admin acceptance */}
                </li>
                <li>
                  <Link href="/llms-full.txt" className="text-accent underline">
                    /llms-full.txt
                  </Link>
                  ：LLM 語料全文與 Sitemap 引用索引。 {/* i18n-exempt: admin acceptance */}
                </li>
                <li>
                  <Link href="/ai.txt" className="text-accent underline">
                    /ai.txt
                  </Link>
                  ：AI 授權與爬蟲導引。 {/* i18n-exempt: admin acceptance */}
                </li>
                <li>
                  <Link href="/sitemap-questions.xml" className="text-accent underline">
                    /sitemap-questions.xml
                  </Link>
                  ：海量題目獨立 URL 分批索引。 {/* i18n-exempt: admin acceptance */}
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">靜態題目頁與 QAPage Schema {/* i18n-exempt: admin acceptance */}</h3>
              <p className="mt-1 text-xs text-ink-muted">
                隨機題目頁抽驗（包含麵包屑、完整解析、題目關聯及 Google QAPage JSON-LD）： {/* i18n-exempt: admin acceptance */}
              </p>
              <div className="mt-2 flex flex-col gap-1.5 text-xs">
                <Link
                  href="/questions/math/sample-math-1"
                  className="text-accent underline"
                >
                  /questions/math/sample-math-1 (數學科範例題) {/* i18n-exempt */}
                </Link>
                <Link
                  href="/questions/physics/sample-phy-1"
                  className="text-accent underline"
                >
                  /questions/physics/sample-phy-1 (物理科範例題) {/* i18n-exempt */}
                </Link>
                <Link
                  href="/questions/chemistry/sample-chem-1"
                  className="text-accent underline"
                >
                  /questions/chemistry/sample-chem-1 (化學科範例題) {/* i18n-exempt */}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* D3: Sell 免費驗收 */}
        <section className="rounded-xl border border-line bg-surface-sunken p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-bold text-accent">D3: Sell 免費與廣告轉換投放 {/* i18n-exempt: admin acceptance */}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">Landing 1: /free {/* i18n-exempt */}</h3>
              <p className="mt-1 text-xs text-ink-muted">
                主打海量題庫全免費、免註冊直接刷題。 {/* i18n-exempt: admin acceptance */}
              </p>
              <div className="mt-3">
                <Link
                  href="/free?utm_source=meta&utm_medium=cpc&utm_campaign=free_qbank"
                  className="inline-block text-xs font-medium text-accent underline"
                >
                  預覽 /free (帶 Meta UTM) → {/* i18n-exempt */}
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">Landing 2: /free-vs-tutor {/* i18n-exempt */}</h3>
              <p className="mt-1 text-xs text-ink-muted">
                月省 $3,000+ 補習費，即時錯題診斷與詳解。 {/* i18n-exempt: admin acceptance */}
              </p>
              <div className="mt-3">
                <Link
                  href="/free-vs-tutor?utm_source=meta&utm_medium=cpc&utm_campaign=tutor_cost"
                  className="inline-block text-xs font-medium text-accent underline"
                >
                  預覽 /free-vs-tutor (帶 Meta UTM) → {/* i18n-exempt */}
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-surface p-4 border border-line">
              <h3 className="font-semibold text-ink">Landing 3: /dse-2027 {/* i18n-exempt */}</h3>
              <p className="mt-1 text-xs text-ink-muted">
                緊貼 2027 DSE 最新考綱，剔除過期考法。 {/* i18n-exempt: admin acceptance */}
              </p>
              <div className="mt-3">
                <Link
                  href="/dse-2027?utm_source=google&utm_medium=cpc&utm_campaign=dse2027_new"
                  className="inline-block text-xs font-medium text-accent underline"
                >
                  預覽 /dse-2027 (帶 Google UTM) → {/* i18n-exempt */}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-surface p-4 border border-line text-xs text-ink-muted">
            <h4 className="font-semibold text-ink">小額預算控制規則 (docs/ads-budget-control.md) {/* i18n-exempt */}</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>每日預算嚴格限制：$50 - $100 HKD，嚴禁暴衝。 {/* i18n-exempt: admin acceptance */}</li>
              <li>自動止損機制：單日 CPA &gt; $15 HKD 即時自動暫停 Campaign。 {/* i18n-exempt: admin acceptance */}</li>
              <li>UTM 自動化捕獲：各 Landing 均掛載 UTMTracker 自動留存來源數據至本機漏斗。 {/* i18n-exempt: admin acceptance */}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
