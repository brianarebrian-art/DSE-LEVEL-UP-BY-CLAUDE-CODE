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
  if (!meta) return { title: '科目 | DSE Level Up' }
  return {
    title: `${meta.name} | DSE Level Up`,
    description: meta.description,
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
