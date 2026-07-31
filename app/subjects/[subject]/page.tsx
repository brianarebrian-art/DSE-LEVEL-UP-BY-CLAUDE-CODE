import { notFound } from 'next/navigation'
import { getSubject, getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
import SubjectDetailView from './SubjectDetailView'

// Pre-render the active subject routes at build time.
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) return { title: '科目 | DSE Level Up' } // i18n-exempt: 靜態 SEO <title> fallback（generateMetadata 唔跟 client locale）
  return {
    title: `${meta.name} | DSE Level Up`,
    description: meta.description,
    // 每科自報 canonical，令 25 個科目頁各自獨立收錄（此前繼承根 layout 的
    // `canonical: '/'`，等同全部指向首頁）。
    alternates: { canonical: `/subjects/${subject}` },
  }
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)

  if (!meta) notFound()

  const questions = getSubjectQuestions(subject)
  const topics = getSubjectTopics(subject)

  return (
    <SubjectDetailView meta={meta} questionsCount={questions.length} topics={topics} />
  )
}
