import PaperWarriorClient from './PaperWarriorClient'

// 紙筆戰士 —— 生成可打印 A4 卷（純前端 window.print()，$0，無後端 PDF 服務）。
// <body> 係暗色，本頁跟 light-first 慣例補底色。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '模擬卷練習 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '計時模擬卷，做完即見錯因分佈。全部原創改寫題，並非 HKEAA 官方試題。', // i18n-exempt
}

export default function PaperWarriorPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PaperWarriorClient />
    </div>
  )
}
