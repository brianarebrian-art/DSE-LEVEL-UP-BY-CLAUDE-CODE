import type { Metadata } from 'next'
import StartRedirect from './StartRedirect'

// /start —— 「開始練習」的去處（UX 循環 LOOP 31；第二份 loop prompt §11）。
// 內容全部由本機紀錄決定，伺服器端只是空殼，所以 noindex。
export const metadata: Metadata = {
  title: '開始練習 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  robots: { index: false, follow: false },
}

export default function Page() {
  return <StartRedirect />
}
