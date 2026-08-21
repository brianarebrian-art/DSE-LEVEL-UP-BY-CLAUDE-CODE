import type { Metadata } from 'next'
import AccessibilityClient from './AccessibilityClient'

// /accessibility —— WCAG 2.2 AA 自評。
//
// ══ 「自評」兩個字要企硬 ══
// 呢版【唔係】無障礙認證，亦唔係第三方審計。我哋冇做過螢幕閱讀器實測，
// 亦冇請人審過。寫成「已符合 WCAG 2.2 AA」係一句兌現唔到嘅宣稱 ——
// 而對一個標榜 SEN 友善嘅平台嚟講，喺呢一項講大話特別難原諒。
//
// 所以呢版分三欄：已提供／已知未達／未測試。第三欄同頭兩欄一樣重要。
//
// 2026-08-21 對住代碼核實嘅數字（唔硬編喺文案，見 AccessibilityClient 註解）。
export const metadata: Metadata = {
  title: '無障礙自評 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '對照 WCAG 2.2 AA 嘅自評：我哋已提供咩、邊啲已知未達標、邊啲未測試過。呢個係自評，唔係認證。', // i18n-exempt
}

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <AccessibilityClient />
    </div>
  )
}
