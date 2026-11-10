import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubject } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { qaPageJsonLd } from '@/lib/seo/schemas'
import { SITE_ORIGIN } from '@/lib/site'
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react'

interface QuestionPageProps {
  params: Promise<{
    subject: string
    id: string
  }>
}

export async function generateMetadata({ params }: QuestionPageProps) {
  const { subject: subjectId, id } = await params
  const subject = getSubject(subjectId)
  if (!subject) return {}

  const questions = getSubjectQuestions(subjectId)
  const question = questions.find((q) => q.id === id)
  if (!question) return {}

  const content = question.content || ''

  return {
    title: `${content.slice(0, 50)}... | ${subject.name} DSE 題目解析`, // i18n-exempt: zh-Hant search metadata
    description: `DSE ${subject.name} 題目詳細解析：${question.explanation?.slice(0, 120) || '即時線上對照解答'}`, // i18n-exempt: zh-Hant search metadata
    alternates: {
      canonical: `${SITE_ORIGIN}/questions/${subjectId}/${id}`,
    },
  }
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { subject: subjectId, id } = await params
  const subject = getSubject(subjectId)
  if (!subject) notFound()

  const questions = getSubjectQuestions(subjectId)
  const question = questions.find((q) => q.id === id)
  if (!question) notFound()

  const pageUrl = `${SITE_ORIGIN}/questions/${subjectId}/${id}`
  const schema = qaPageJsonLd(question, subject.name, pageUrl)
  const isMc = question.type === 'mc'

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Schema.org QAPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-muted">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              首頁 {/* i18n-exempt: zh-Hant breadcrumb */}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/subjects" className="hover:text-accent">
              科目 {/* i18n-exempt: zh-Hant breadcrumb */}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/subjects/${subject.id}`} className="hover:text-accent">
              {subject.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-semibold text-ink" aria-current="page">
            題目 {question.id} {/* i18n-exempt: zh-Hant breadcrumb */}
          </li>
        </ol>
      </nav>

      {/* Stem */}
      <article className="rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {subject.name} · {question.topicZh || question.topic || '綜合練習'} {/* i18n-exempt: dynamic topic tag */}
          </span>
          <span className="text-xs text-ink-muted">
            難度：{question.difficulty === 'hard' ? '進階' : question.difficulty === 'medium' ? '中等' : '基礎'} {/* i18n-exempt */}
          </span>
        </div>

        <h1 className="text-lg font-medium leading-relaxed text-ink">
          {question.content}
        </h1>

        {/* Options */}
        {isMc && question.options && (
          <div className="mt-6 space-y-2.5">
            {question.options.map((opt: string, idx: number) => {
              const isAnswer = idx === question.correctIndex
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-lg border p-3.5 text-sm ${
                    isAnswer
                      ? 'border-emerald-600 bg-emerald-50 font-medium text-emerald-900'
                      : 'border-line bg-surface-sunken/40 text-ink-soft'
                  }`}
                >
                  <span className="font-semibold text-ink-muted">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isAnswer && (
                    <CheckCircle
                      size={18}
                      className="shrink-0 text-emerald-800"
                      aria-label="正確答案" // i18n-exempt: zh-Hant label
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Explanation */}
        <div className="mt-8 rounded-lg bg-surface-sunken p-4 border border-line">
          <div className="flex items-center gap-2 font-semibold text-sm text-accent mb-2">
            <BookOpen size={16} aria-hidden />
            <span>考評解析與解題思維</span> {/* i18n-exempt */}
          </div>
          <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
            {question.explanation || '本題暫未提供額外解析，請對照考評局評卷參考。'} {/* i18n-exempt */}
          </p>
        </div>

        {/* Practice CTA */}
        <div className="mt-8 flex justify-center border-t border-line pt-6">
          <Link
            href={`/practice?subject=${subject.id}`}
            className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-6 text-sm font-semibold text-on-accent hover:bg-accent-hover"
          >
            <span>開始操練更多 {subject.name} 題目</span> {/* i18n-exempt */}
          </Link>
        </div>
      </article>
    </div>
  )
}
