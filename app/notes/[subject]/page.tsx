import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
import NotesSubjectClient from './NotesSubjectClient'

// 每科一版靜態頁（同 /subjects/[subject] 一致），課題用 ?topic= 深連結 ——
// 唔為每個 subject×topic 起一版（25 科 × ~15 課題 = ~375 版，冇必要）。
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) return { title: '知識凝結 | DSE Level Up' } // i18n-exempt: 靜態 SEO <title> fallback，Next.js metadata 唔跟 client locale
  const n = getSubjectQuestions(subject).length
  return {
    title: `${meta.name}筆記 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
    description: `${meta.name}課題筆記與常見陷阱整理，涵蓋 ${n} 條獨立改寫題目。`, // i18n-exempt: 靜態 SEO meta description
    alternates: { canonical: `/notes/${subject}` },
  }
}

export default async function NotesSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) notFound()

  // ── 伺服器端內容（2026-07-29，Backlog A-34）──────────────────────────────────
  // 原本本頁 server 端只輸出一個空 wrapper，內容全部由 client 讀 localStorage 產生，
  // 即 25 版對爬蟲嚟講係零標題零內文嘅白紙。
  //
  // 課題清單同題數本來就係靜態資料（唔涉及任何個人進度），完全可以喺 server 端渲染。
  // 用 `sr-only` 係因為可見版面由 client 元件負責，加多一個可見標題會重複。
  // 水合之後 client 亦有一個 h1；爬蟲讀嘅係 SSR HTML，嗰陣只有下面呢一個。
  const topics = getSubjectTopics(subject)
  const total = getSubjectQuestions(subject).length

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="sr-only">
        <h1>{meta.name}知識凝結筆記 · {meta.name} revision notes{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
        <p>本頁按課題整理{meta.name}的重點與常見陷阱，題庫現有 {total} 條獨立改寫題目，分為 {topics.length} 個課題。所有題目均為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
        <p>
          Topic-by-topic revision notes for {meta.name}, covering {total} independently rewritten questions across{' '}
          {topics.length} topics. Not affiliated with the HKEAA.
        </p>
        <h2>課題一覽 · Topics{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h2>
        <ul>
          {topics.map((t) => (
            <li key={t.id}>
              <a href={`/notes/${subject}?topic=${t.id}`}>
                {t.zh}
                {t.en ? ` · ${t.en}` : ''} — {t.count}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <NotesSubjectClient subjectId={subject} />
    </div>
  )
}
