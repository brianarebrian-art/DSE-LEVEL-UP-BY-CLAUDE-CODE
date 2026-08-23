import type { Metadata } from 'next'
import HomesteadView from './HomesteadView'

// 邏輯家園（SPEC-GAMIFY-P1 §模組二）。四個區域的等級全部由既有練習數據當場
// 導出，沒有任何家園專用的儲存——理由見 lib/homestead.ts 檔首。
export const metadata: Metadata = {
  title: '邏輯家園 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，不跟 client locale
  robots: { index: false, follow: false },
}

export default function HomesteadPage() {
  return <HomesteadView />
}
