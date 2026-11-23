import { completeSeoMetadata, breadcrumbJsonLd, articleJsonLd } from '@/lib/seo'
import { topicNotesSeoDescription } from '@/lib/dynamicSeoDescriptions'
import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { getStudyNote } from '@/lib/notes/studyNotes'
import { topicLearningPath, topicStudyFaq } from '@/lib/notes/topicLearning'
import { JsonLd } from '@/components/Seo/JsonLd'
import TopicStudyNote from '@/components/TopicStudyNote'
import { TOPIC_LESSONS } from '@/data/notes/lessons'
import StudyNoteActions from '@/components/StudyNoteActions'
import Link from 'next/link'
import MathText from '@/components/MathText'
import { SITE_ORIGIN } from '@/lib/site'
import { topicExplainerSrc } from '@/data/notes/explainers'

// Structured data mirrors the Traditional Chinese visible note.

export function generateStaticParams() {
  return getActiveSubjects().flatMap((s) =>
    (SUBJECT_TOPICS[s.id] ?? []).map((t) => ({ subject: s.id, topic: t.id })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>
}) {
  const { subject, topic } = await params
  const meta = getSubject(subject)
  const note = await getStudyNote(subject, topic)
  if (!meta || !note) notFound()
  const title = `${note.titleZh}自學筆記 | ${meta.name} | DSE Level Up` // i18n-exempt: SEO title
  const description = topicNotesSeoDescription({ name: meta.name, titleZh: note.titleZh })
  return completeSeoMetadata(
    { title, description },
    `/notes/${subject}/${topic}`,
  )
}

export default async function NotesTopicPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>
}) {
  const { subject, topic } = await params
  const meta = getSubject(subject)
  const note = await getStudyNote(subject, topic)
  if (!meta || !note) notFound()

  const path = `/notes/${subject}/${topic}`
  const practice = topicLearningPath(subject, topic)
  const lesson = TOPIC_LESSONS[`${subject}:${topic}`]
  const explainer = subject === 'math' && topic === 'quadratic_equations' ? '/explainers/math-quadratic-study.svg' : topicExplainerSrc(subject, topic, note.explainerSrc)
  const h1 = `${note.titleZh}自學筆記`  // i18n-exempt: requested Traditional Chinese H1

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...articleJsonLd({
          path,
          title: h1,
          description: note.conceptZh.slice(0, 160),
          dateModified: lesson?.updated,
        }),
        '@type': 'TechArticle',
        learningResourceType: '自學筆記', // i18n-exempt: Traditional Chinese resource type
        educationalLevel: '香港中學文憑試（DSE）', // i18n-exempt: truthful existing target level
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        ...(explainer ? {image:{'@type':'ImageObject',contentUrl:new URL(explainer,SITE_ORIGIN).href,caption:`${note.titleZh}的概念關係圖`}} : {}), // i18n-exempt: matches the visible diagram alternative text
      },
      breadcrumbJsonLd([
        { name: 'DSE Level Up', path: '/' },
        { name: '所有科目筆記', path: '/notes' }, // i18n-exempt: requested Traditional Chinese breadcrumb
        { name: meta.name, path: `/notes/${subject}` },
        { name: note.titleZh, path },
      ]),
      {
        '@type': 'FAQPage',
        mainEntity: topicStudyFaq(note).map(f => ({
          '@type': 'Question', name:f.question,
          acceptedAnswer:{'@type':'Answer',text:f.answer},
        })),
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-surface text-ink-soft">
        {/* A single server-rendered document serves both screen and print. */}
        <div className="topic-note-layout mx-auto max-w-4xl px-4 py-8 pb-28">
          <nav aria-label="筆記導覽" className="no-print mb-6 flex flex-wrap gap-3 text-sm text-accent">{/* i18n-exempt: Traditional Chinese navigation */}
            <Link href="/notes">所有科目筆記</Link><span aria-hidden>／</span><Link href={`/notes/${subject}`}>{meta.name}</Link>{/* i18n-exempt: Traditional Chinese navigation */}
          </nav>
          <article id="topic-study-note" className="topic-note-document space-y-6" lang="zh-HK">
            <header className="space-y-3">
              <p className="text-sm font-semibold text-accent">{meta.name} · 香港中學文憑試（DSE）</p>{/* i18n-exempt: Traditional Chinese editorial page */}
              <h1 className="break-words text-3xl font-semibold leading-tight text-ink sm:text-4xl">{h1}</h1>
              <p className="text-base leading-8 text-ink-soft"><MathText>{note.conceptZh}</MathText></p>
              <p className="text-sm text-ink-muted">編輯：{lesson?.author ?? 'DSE Level Up 既有筆記摘要'}；內容未經註冊教師審定。{lesson ? `更新：${lesson.updated}。編輯草稿，待覆核。` : '完整教材仍待逐課題補充。'}</p>{/* i18n-exempt: transparent Traditional Chinese provenance */}
            </header>
            <p className="text-sm text-ink-muted">文件生成日期：{new Date().toLocaleDateString('zh-HK', {timeZone:'Asia/Hong_Kong'})}</p>{/* i18n-exempt: actual document generation date, not content review date */}
            <StudyNoteActions subject={meta.name} topic={note.titleZh} subjectId={subject} topicId={topic} />
            <Link href={practice} className="no-print inline-flex min-h-12 items-center rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover">立即做練習：{note.titleZh}</Link>{/* i18n-exempt: Traditional Chinese CTA */}
            <TopicStudyNote note={note} subjectName={meta.name} lesson={lesson} />
          </article>
        </div>
      </div>
    </>
  )
}
