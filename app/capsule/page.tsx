import { completeSeoMetadata } from '@/lib/seo'
import CapsuleClient from './CapsuleClient'

// /capsule —— 時間囊。接替已刪除嘅「影子溫書室」。
//
// 見 docs/DECISION-no-interaction.md：本平台永久唔提供任何用戶對用戶互動。
// 舊功能真正服務緊嘅唔係「有人回覆你」，而係「有人明白你」—— 呢度將嗰件事
// 由「陌生人明白你」換成「幾個月後嘅你，會睇返幾個月前嘅你講過乜」。
//
// 零 server、零同步、零互動。內容一律留喺學生部機。
export const metadata = completeSeoMetadata({
  title: '時間囊 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '把想留給未來自己的文字在本機封存，到指定日期再開啟的個人時間囊工具。', // i18n-exempt: zh-Hant fixed search metadata
}, '/capsule')

export default function CapsulePage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <CapsuleClient />
    </div>
  )
}
