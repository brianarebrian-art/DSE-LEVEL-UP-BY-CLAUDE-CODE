import type { Metadata } from 'next'
import PredictionMethodClient from './PredictionMethodClient'

// /prediction-method —— 「今次表現等級」係點計出嚟。
//
// ══ 點解要有呢版 ══
// 信譽審核 §4：「網站已在多處說明等級預測只供參考，這是正確的；但看不到樣本數、
// 校準方法、誤差範圍或最低作答量。」講「僅供參考」係一句免責，唔係一個解釋 ——
// 學生睇完仍然唔知道嗰個 Level 4 憑咩嚟。
//
// 呢版嘅取態：唔係為個算法辯護，係公開佢有幾粗糙。實際數值（92%／83%／70%…）
// 直接由 data/cutoffs.ts 抄過嚟並標明佢係近似值，唔係考評局公布嘅分界線。
export const metadata: Metadata = {
  title: '表現等級點計 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '「今次表現等級」用咩計、用邊條分界線、點解會顯示一個範圍而唔係一個數字，同埋佢唔代表咩。', // i18n-exempt
}

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PredictionMethodClient />
    </div>
  )
}
