import PaperWarriorClient from './PaperWarriorClient'

// 紙筆戰士 —— 生成可打印 A4 卷（純前端 window.print()，$0，無後端 PDF 服務）。
// <body> 係暗色，本頁跟 light-first 慣例補底色。
export default function PaperWarriorPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PaperWarriorClient />
    </div>
  )
}
