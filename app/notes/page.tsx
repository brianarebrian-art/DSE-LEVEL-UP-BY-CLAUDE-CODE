import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import NotesOverview from './NotesOverview'

// 知識凝結（CONDENSE）總覽。內容 100% 由真題庫 + 你自己嘅 localStorage 聚合，
// 冇 AI 摘要、冇生成內容（見 lib/notes/notes.ts 檔頭）。

export const metadata = completeSeoMetadata({
  title: '學科筆記 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '瀏覽按 DSE 學科與課題整理的知識凝結筆記索引；每科頁面把題庫既有解析、常見陷阱和你的本機練習紀錄分開呈現，不在開啟時由模型即時改寫內容，讓你可回到原有題目脈絡溫習，並清楚分辨公開題庫資料與只屬於自己的練習紀錄。各項題數與課題會按現有資料顯示，學生可從索引進入相應科目繼續閱讀，方便作有脈絡的溫習。', // i18n-exempt: zh-Hant fixed search metadata
}, '/notes')

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/notes" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <header className="mx-auto max-w-4xl px-4 pt-8">
        <h1>學科筆記 · Subject revision notes{/* i18n-exempt: server component 無 locale hook */}</h1>
        <p>按學科與課題瀏覽題庫既有解析和常見陷阱；個人練習紀錄只會在你的裝置上顯示。{/* i18n-exempt: server component 無 locale hook */}</p>
      </header>
      <NotesOverview />
    </div>
  )
}
