import { completeSeoMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { getActiveSubjects, getSubject } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
import { SITE_ORIGIN } from '@/lib/site'
import { JsonLd } from '@/components/Seo/JsonLd'
import { notesSeoDescription } from '@/lib/dynamicSeoDescriptions'
import SubjectMark from '@/components/marks/SubjectMark'
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
  const h1 = `${meta.name}自學筆記總覽` // i18n-exempt: requested Traditional Chinese resource title
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
        <header className="mx-auto max-w-4xl space-y-5 px-4 pt-8" lang="zh-HK">
          <SubjectMark subject={meta} size="md" />
          <h1 className="text-3xl font-semibold leading-tight">{h1}</h1>
          <p className="leading-8">本頁按課題整理{meta.name}的概念與常見錯誤，並連結至每個課題的筆記、列印及練習入口。現有 {topics.length} 個課題摘要；完整教材仍須逐一補充及覆核。</p>{/* i18n-exempt: requested Traditional Chinese editorial content */}
          <p className="text-sm leading-7 text-ink-muted">適用程度：香港中學文憑試（DSE）。題庫現有 {total} 條獨立改寫題目，並非考評局官方試題，未經註冊教師審定。</p>{/* i18n-exempt: requested Traditional Chinese disclosure */}
          <a href={`/api/notes-pdf/${encodeURIComponent(subject)}`} download className="inline-flex min-h-12 items-center rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">下載本科課題摘要 PDF 合集</a>{/* i18n-exempt: accurately labelled Traditional Chinese collection download */}
          <p className="text-sm leading-7 text-ink-muted">合集收錄現有課題摘要與待覆核教材，不代表完整教科書或已完成學科審核。</p>{/* i18n-exempt: truthful collection scope */}
          <section aria-labelledby="topic-list-heading">
            <h2 id="topic-list-heading" className="mb-4 text-xl font-semibold">課題與學習重點</h2>{/* i18n-exempt: requested Traditional Chinese heading */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {topics.map((t,i) => <li key={t.id}>
                <a href={`/notes/${subject}/${t.id}`} className="flex min-h-16 items-center gap-4 rounded-xl border border-line bg-surface-raised p-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent hover:border-accent">
                  <span aria-hidden className="font-semibold text-accent">{String(i+1).padStart(2,'0')}</span>
                  <span className="min-w-0 break-words"><strong>{t.zh}</strong><span className="mt-1 block text-sm text-ink-muted">{t.count} 題 · 筆記、列印與練習</span></span>{/* i18n-exempt: requested Traditional Chinese link description */}
                </a>
              </li>)}
            </ul>
          </section>
        </header>

        <NotesSubjectClient subjectId={subject} />
      </div>
    </>
  )
}
