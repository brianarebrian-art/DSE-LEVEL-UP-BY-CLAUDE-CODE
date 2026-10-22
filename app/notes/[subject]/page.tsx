import { completeSeoMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
import { SITE_ORIGIN } from '@/lib/site'
import { JsonLd } from '@/components/Seo/JsonLd'
import { notesSeoDescription } from '@/lib/dynamicSeoDescriptions'
import NotesSubjectClient from './NotesSubjectClient'

// 每科一版靜態頁（同 /subjects/[subject] 一致），課題用 ?topic= 深連結 ——
// 唔為每個 subject×topic 起一版（25 科 × ~15 課題 = ~375 版，冇必要）。
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) notFound()
  const n = getSubjectQuestions(subject).length
  const topicCount = getSubjectTopics(subject).length
  return completeSeoMetadata({
    title: `${meta.name}筆記 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
    description: notesSeoDescription({ name: meta.name, questionCount: n, topicCount }), // i18n-exempt: 靜態 SEO meta description
  }, `/notes/${subject}`)
}

export default async function NotesSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) notFound()

  // 課題清單同題數本來就係靜態資料（唔涉及任何個人進度），完全可以喺 server 端渲染。
  // 保持為可見內容：這是真實頁面導覽，不是只給爬蟲或讀屏軟件的隱藏文字。
  const topics = getSubjectTopics(subject)
  const total = getSubjectQuestions(subject).length
  const description = notesSeoDescription({ name: meta.name, questionCount: total, topicCount: topics.length })
  const h1 = `${meta.name}知識凝結筆記 · ${meta.name} revision notes` // i18n-exempt: actual bilingual resource title
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${SITE_ORIGIN}/notes/${subject}#resource`,
        url: `${SITE_ORIGIN}/notes/${subject}`,
        name: h1, // i18n-exempt: 與可見 H1 完全一致的 server-only JSON-LD 名稱
        headline: h1,
        description,
        learningResourceType: 'Revision notes',
        educationalLevel: 'Hong Kong Diploma of Secondary Education (HKDSE)',
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        isPartOf: { url: `${SITE_ORIGIN}/notes` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/notes/${subject}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          { '@type': 'ListItem', position: 2, name: '所有科目', item: `${SITE_ORIGIN}/notes` }, // i18n-exempt: 可見返回連結文字
          { '@type': 'ListItem', position: 3, name: h1 },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-surface text-ink-soft">
        <header className="mx-auto max-w-4xl px-4 pt-8">
          <h1>{meta.name}知識凝結筆記 · {meta.name} revision notes{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
          <p>本頁按課題整理{meta.name}的重點與常見陷阱，題庫現有 {total} 條獨立改寫題目，分為 {topics.length} 個課題。所有題目均為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
          <p>
            Topic-by-topic revision notes for {meta.name}, covering {total} independently rewritten questions across{' '}
            {topics.length} topics. Not affiliated with the HKEAA.
          </p>
          <section aria-labelledby="topic-list-heading">
            <h2 id="topic-list-heading">課題一覽 · Topics{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h2>
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
          </section>
        </header>

        <NotesSubjectClient subjectId={subject} />
      </div>
    </>
  )
}
