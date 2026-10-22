import { completeSeoMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import LongSessionHarness from './LongSessionHarness'

// 開發專用：用樣本題目跑一次完整嘅書寫題練習流程（?mode=long 嘅 runner）。
// 存在理由同 /dev/answer-cards 一樣 —— 首批書寫題必須留喺 drafts/ 等真人逐題批
// （機器永不自動入庫），所以 live 題庫暫時攞唔到書寫題，冇得端到端驗證 runner。
//
// ⚠️ 呢版會真正寫入本機 localStorage（課題掌握度／錯題本），同真實練習一樣。
// 只作開發驗證用；生產環境一律 404。
export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata({
  title: '長練習開發驗證 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '只供開發驗證書寫題長練習流程的內部頁面，正式環境不提供。', // i18n-exempt: zh-Hant fixed search metadata
}, '/dev/long-session')

export default function DevLongSessionPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <LongSessionHarness />
}
