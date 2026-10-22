import { completeSeoMetadata } from '@/lib/seo'
import SoloPageClient from './SoloPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '獨處充電 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '使用 lo-fi 電台、雨聲白噪音、雙耳節拍與番茄鐘，為自己安排一段可自行開始或停止的安靜溫習時間；不同聲音對不同人感受不一，本頁不作醫療或效果保證，也不收集你的情緒或健康資料，若使用時感到不適，請停止並向可信任人士、學校或專業服務尋求合適協助。你可依當下需要調整或關閉聲音與計時，不必完成任何指定時長或分享使用狀態。', // i18n-exempt: zh-Hant fixed search metadata
}, '/relax/solo')

export default function Page() {
  return <SoloPageClient />
}
