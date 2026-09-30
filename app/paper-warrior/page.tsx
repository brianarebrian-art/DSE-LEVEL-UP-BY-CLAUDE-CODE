import PaperWarriorClient from './PaperWarriorClient'

// 紙筆戰士 —— 生成可打印 A4 卷（純前端 window.print()，$0，無後端 PDF 服務）。
// <body> 係暗色，本頁跟 light-first 慣例補底色。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '列印練習卷 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '列印 A4 練習卷，用紙筆做完再返嚟對答案，錯題照樣記入進度。全部原創題，並非 HKEAA 官方試題。', // i18n-exempt
}

export default function PaperWarriorPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PaperWarriorClient />
    </div>
  )
}
