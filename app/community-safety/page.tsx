import type { Metadata } from 'next'
import CommunitySafetyClient from './CommunitySafetyClient'

// /community-safety —— 學生安全。
//
// ══ 2026-08-21 重寫 ══
// 上一版寫嘅係「影子溫書室點樣審核」。而家個牆已經整個刪走（見
// docs/DECISION-no-interaction.md），所以呢版嘅答案由「我哋點管一個社群」
// 變成「我哋唔會有一個要管嘅社群」。
//
// 呢個唔係退場，係一個更硬嘅承諾：一個唔存在嘅功能，唔會失守。
//
// 2026-08-21 對住代碼核實：
//   · 零用戶對用戶路徑 —— 冇訊息、冇留言、冇心心、冇跟隨、冇配對、冇語音
//   · 零用戶內容表（migrations 掃過）
//   · 零在線人數（真實或虛構）
//   · /focus 房號係純前端、各自計時、零資料交換 —— 界線由測試釘死
//   全部由 lib/__tests__/no-interaction.test.mts 守住
export const metadata: Metadata = {
  title: '學生安全 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '本平台冇任何用戶對用戶互動 —— 冇私訊、冇留言、冇心心。點解咁決定，同埋離開本站之後你要注意咩。', // i18n-exempt
}

export default function CommunitySafetyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <CommunitySafetyClient />
    </div>
  )
}
