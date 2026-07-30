import NotesOverview from './NotesOverview'

// 知識凝結（CONDENSE）總覽。內容 100% 由真題庫 + 你自己嘅 localStorage 聚合，
// 冇 AI 摘要、冇生成內容（見 lib/notes/notes.ts 檔頭）。
export default function NotesPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <NotesOverview />
    </div>
  )
}
