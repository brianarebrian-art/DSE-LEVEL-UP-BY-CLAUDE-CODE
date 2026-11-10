import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubject } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { completeSeoMetadata } from '@/lib/seo'
import { subjectExplainSeo } from '@/lib/subjectExplainSeo'
import { JsonLd } from '@/components/Seo/JsonLd'

function explainFor(
  subject: string,
  topic: string,
  id: string,
  subjectName: string,
  question: { topicZh: string; content: string; explanation?: string },
) {
  return subjectExplainSeo({
    subjectId: subject,
    subjectName,
    topicName: question.topicZh || topic,
    questionContent: question.content,
    explanation: question.explanation,
    pagePath: `/subject/${subject}/${topic}/${id}`,
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; topic: string; id: string }>
}) {
  const { subject, topic, id } = await params
  const meta = getSubject(subject)
  const question = getSubjectQuestions(subject).find((q) => q.id === id)

  if (!meta || !question) notFound()

  const seo = explainFor(subject, topic, id, meta.name, question)

  return completeSeoMetadata(
    {
      title: seo.title,
      description: seo.description,
      openGraph: {
        type: 'article',
      },
    },
    seo.pagePath,
  )
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string; id: string }>
}) {
  const { subject, topic, id } = await params
  const meta = getSubject(subject)
  const question = getSubjectQuestions(subject).find((q) => q.id === id)

  if (!meta || !question) notFound()

  const topicName = question.topicZh || topic
  const seo = explainFor(subject, topic, id, meta.name, question)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={seo.jsonLd} />

      <nav aria-label="麵包屑導航 · Breadcrumb" className="mb-6 text-sm text-ink-muted"> {/* i18n-exempt: nav label */}
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:underline">DSE Level Up</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/subjects/${subject}`} className="hover:underline">{meta.name}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-ink">{topicName}</li>
        </ol>
      </nav>

      <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="mb-4 inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
          <span>{meta.name} · {topicName}</span>
          <span className="mx-1.5">·</span>
          <span>難度 · Difficulty：{question.difficulty || 'medium'}</span> {/* i18n-exempt: bilingual */}
        </div>

        <h1 className="mb-6 text-xl font-bold leading-relaxed text-stone-900 dark:text-stone-50">
          {question.content}
        </h1>

        {'options' in question && Array.isArray((question as { options?: string[] }).options) && (
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400">選項 · Options</h2> {/* i18n-exempt: bilingual */}
            <ul className="space-y-2">
              {(question as { options: string[]; correctIndex?: number }).options.map((opt: string, idx: number) => {
                const isCorrect = idx === (question as { correctIndex?: number }).correctIndex
                return (
                  <li
                    key={idx}
                    className={`rounded-xl border p-3 text-sm transition-colors ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200'
                        : 'border-stone-200 bg-stone-50 text-stone-800 dark:border-stone-800 dark:bg-stone-800/40 dark:text-stone-200'
                    }`}
                  >
                    <span className="mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                    {isCorrect && (
                      <span className="ml-2 inline-flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        (正解 · Correct) {/* i18n-exempt: bilingual */}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/60">
          <h2 className="mb-2 text-sm font-bold text-stone-900 dark:text-stone-100">解題思維與分析 · Analysis</h2> {/* i18n-exempt: bilingual */}
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
            {question.explanation || '此題目重點考察考生概念理解與細心審題能力。'} {/* i18n-exempt: fallback */}
          </p>
        </div>
      </article>

      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="mb-4 text-base font-bold text-stone-900 dark:text-stone-100">常見問題 · FAQ</h2> {/* i18n-exempt: bilingual */}
        <div className="space-y-4 text-sm">
          {seo.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-stone-800 dark:text-stone-200">{item.question}</h3>
              <p className="mt-1 text-stone-600 dark:text-stone-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link
          href={`/practice?subject=${subject}&topic=${topic}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-900 px-6 font-medium text-white shadow-xs transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          立即開始 {meta.name} 練習 · Practice Now {/* i18n-exempt: bilingual */}
        </Link>
      </div>
    </main>
  )
}
