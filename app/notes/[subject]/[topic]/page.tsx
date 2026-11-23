import { completeSeoMetadata, breadcrumbJsonLd, articleJsonLd } from '@/lib/seo'
import { topicNotesSeoDescription } from '@/lib/dynamicSeoDescriptions'
import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { getStudyNote } from '@/lib/notes/studyNotes'
import { practiceTopicPath } from '@/lib/notes/practiceLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import NotesSubjectClient from '../NotesSubjectClient'
import Link from 'next/link'

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
  const title = `${note.titleZh}自學筆記｜${meta.name}｜DSE Level Up`
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
  const basePracticePath = practiceTopicPath(subject, topic)
  const practiceParams = new URLSearchParams(basePracticePath.split('?')[1] ?? '')
  practiceParams.set('setup', '1')
  const practice = `/practice?${practiceParams.toString()}`
  const h1 = `${note.titleZh}自學筆記`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...articleJsonLd({
          path,
          title: h1,
          description: note.conceptZh.slice(0, 160),
          dateModified: '2026-11-23',
        }),
        '@type': 'TechArticle',
        inLanguage: 'zh-HK',
        educationalLevel: '香港中學',
        learningResourceType: '自學筆記',

      },
      breadcrumbJsonLd([
        { name: 'DSE Level Up', path: '/' },
        { name: '所有科目筆記', path: '/notes' },
        { name: meta.name, path: `/notes/${subject}` },
        { name: note.titleZh, path },
      ]),
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `「${note.titleZh}」要記住甚麼？`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: note.mustKnowZh.join('；'),
            },
          },
          {
            '@type': 'Question',
            name: `「${note.titleZh}」常見陷阱是甚麼？`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: note.commonTrapZh,
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-surface text-ink-soft">
        {/* SEO／AEO 可見正文：列印同螢幕互動版交俾 client（MathText＋QR），避免雙份。 */}
        <header className="no-print mx-auto max-w-4xl px-4 pt-8">
          <h1>{h1}</h1>
          <p className="mt-2 text-sm leading-relaxed">{note.conceptZh}</p>
          <p className="mt-4 text-sm">
            <Link href={practice}>開始「{note.titleZh}」練習</Link>
          </p>
        </header>

        <NotesSubjectClient subjectId={subject} initialTopic={topic} />
      </div>
    </>
  )
}
