import { completeSeoMetadata } from '@/lib/seo'
import StartRedirect from './StartRedirect'

// /start —— 「開始練習」的去處（UX 循環 LOOP 31；第二份 loop prompt §11）。
// 內容全部由本機紀錄決定，伺服器端只是空殼，所以 noindex。
export const metadata = completeSeoMetadata({
  title: '開始練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '根據你裝置上的練習紀錄前往合適的下一步練習頁。', // i18n-exempt: zh-Hant fixed search metadata
}, '/start')

export default function Page() {
  return <StartRedirect />
}
