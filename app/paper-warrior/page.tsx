import { completeSeoMetadata } from '@/lib/seo'
import PaperWarriorClient from './PaperWarriorClient'

// 紙筆戰士 —— 生成可打印 A4 卷（純前端 window.print()，$0，無後端 PDF 服務）。
// <body> 係暗色，本頁跟 light-first 慣例補底色。

export const metadata = completeSeoMetadata({
  title: '列印練習卷 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '從題庫建立可列印的 A4 練習卷，供你以紙筆完成後再回來自行對照答案。', // i18n-exempt: zh-Hant fixed search metadata
}, '/paper-warrior')

export default function PaperWarriorPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PaperWarriorClient />
    </div>
  )
}
