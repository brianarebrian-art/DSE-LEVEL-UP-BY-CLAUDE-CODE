import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import NotesSubjectClient from './NotesSubjectClient'

// 每科一版靜態頁（同 /subjects/[subject] 一致），課題用 ?topic= 深連結 ——
// 唔為每個 subject×topic 起一版（25 科 × ~15 課題 = ~375 版，冇必要）。
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const meta = getSubject(subject)
  return { title: meta ? `${meta.name}筆記 | DSE Level Up` : '知識凝結 | DSE Level Up' } // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
}

export default async function NotesSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  if (!getSubject(subject)) notFound()
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <NotesSubjectClient subjectId={subject} />
    </div>
  )
}
