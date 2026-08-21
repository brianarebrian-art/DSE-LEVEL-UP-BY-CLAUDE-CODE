import type { Metadata } from 'next'
import TrustClient from './TrustClient'

// /trust —— 信任中心。
//
// ══ 點解要多一版 ══
// 到 2026-08-21 為止，可驗證嘅資料散落喺六版：/transparency、/privacy、
// /community-safety、/prediction-method、/accessibility、/methodology。
// 每一版本身都準，但一個家長或者老師想「快速判斷呢個平台可唔可以畀學生用」，
// 要自己喺 footer 逐條撳入去砌返個全貌。
//
// 呢版唔加任何新聲稱 —— 佢只做一件事：將已經存在嘅答案排好，並且喺最頂寫清楚
// 我哋【唔係】咩。頭三行就講唔係官方、唔係認證、唔係危機服務，係刻意嘅：
// 一版信任頁如果由「我哋幾好」開始，讀者第一個反應就係戒備。
export const metadata: Metadata = {
  title: '信任中心 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '一版睇齊：我哋係邊個、唔係咩、題目點嚟、資料點處理、等級點計、無障礙做到幾多。每項都有得查。', // i18n-exempt
}

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <TrustClient />
    </div>
  )
}
