import { completeSeoMetadata, breadcrumbJsonLd, articleJsonLd } from '@/lib/seo'
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
  const title = `${note.titleZh}自學筆記 | ${meta.name} | DSE Level Up` // i18n-exempt: SEO title
  const description =
    `${note.titleZh}（${note.titleEn}）DSE ${meta.name}自學筆記：概念、必記要點、考試技巧與常見陷阱。免費列印／PDF，掃碼即開練習。`.slice(0, 160) // i18n-exempt: SEO description
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
  const practice = practiceTopicPath(subject, topic)
  const h1 = `${note.titleZh}自學筆記 · ${note.titleEn} revision notes` // i18n-exempt: bilingual H1

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      articleJsonLd({
        path,
        title: h1,
        description: note.conceptZh.slice(0, 160),
        dateModified: '2026-11-19',
      }),
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
            name: `${note.titleZh}要記咩？`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: note.mustKnowZh.join('；'),
            },
          },
          {
            '@type': 'Question',
            name: `${note.titleZh}常見陷阱係咩？`,
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
          <p className="mt-2 text-sm leading-relaxed" lang="en">{note.conceptEn}</p>
          <p className="mt-4 text-sm">
            <Link href={practice}>開始「{note.titleZh}」練習 · Start practice</Link>
          </p>
        </header>

        <NotesSubjectClient subjectId={subject} initialTopic={topic} />
      </div>
    </>
  )
}
