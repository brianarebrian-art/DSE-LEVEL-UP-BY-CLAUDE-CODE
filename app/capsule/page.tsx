import type { Metadata } from 'next'
import CapsuleClient from './CapsuleClient'

// /capsule —— 時間囊。接替已刪除嘅「影子溫書室」。
//
// 見 docs/DECISION-no-interaction.md：本平台永久唔提供任何用戶對用戶互動。
// 舊功能真正服務緊嘅唔係「有人回覆你」，而係「有人明白你」—— 呢度將嗰件事
// 由「陌生人明白你」換成「幾個月後嘅你，會睇返幾個月前嘅你講過乜」。
//
// 零 server、零同步、零互動。內容一律留喺學生部機。
export const metadata: Metadata = {
  title: '時間囊 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '寫低而家嘅心情，揀一個日期封存，到期先開得返。只存喺你部機，冇人睇得到，亦冇任何人可以回覆你。', // i18n-exempt
  robots: { index: true, follow: true },
}

export default function CapsulePage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <CapsuleClient />
    </div>
  )
}
