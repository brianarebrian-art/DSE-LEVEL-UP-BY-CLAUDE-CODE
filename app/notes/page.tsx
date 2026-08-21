import NotesOverview from './NotesOverview'

// 知識凝結（CONDENSE）總覽。內容 100% 由真題庫 + 你自己嘅 localStorage 聚合，
// 冇 AI 摘要、冇生成內容（見 lib/notes/notes.ts 檔頭）。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '學科筆記 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '25 科重點筆記索引 —— 由已覆核嘅解析整理，並非 AI 即時改寫。', // i18n-exempt
}

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <NotesOverview />
    </div>
  )
}
