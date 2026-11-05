'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

export interface RelatedNotesProps {
  subjectId: string
  subjectName: string
  isNotesPage?: boolean
}

export function RelatedNotes({ subjectId, subjectName, isNotesPage = false }: RelatedNotesProps) {
  const { locale } = useLocale()
  const en = locale === 'en'

  if (isNotesPage) {
    return (
      <aside aria-label={en ? 'Related Practice Questions' : '相關題庫練習'} className="mt-8 rounded-xl border border-line bg-surface-raised p-6">
        <h2 className="text-lg font-semibold text-ink">{en ? 'Practice Questions' : '配套題庫操練 · Practice Questions'}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? `After reviewing revision notes for ${subjectName}, start practice questions right away to test your understanding and spot common traps.`
            : `讀完 ${subjectName} 筆記重點後，立即進入題庫進行即時概念判斷與選擇題操練，鞏固記憶與辨析常犯陷阱。`}
        </p>
        <div className="mt-4">
          <Link
            href={`/subjects/${subjectId}`}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {en ? `Go to ${subjectName} practice →` : `前往 ${subjectName} 練習題庫 →`}
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <aside aria-label={en ? 'Related Revision Notes' : '相關精讀筆記'} className="mt-8 rounded-xl border border-line bg-surface-raised p-6">
      <h2 className="text-lg font-semibold text-ink">{en ? 'Revision Notes' : '配套精讀筆記 · Revision Notes'}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {en
          ? `Encountering difficulties while practising ${subjectName} questions? Check topic-by-topic revision notes to master key concepts.`
          : `操練 ${subjectName} 題目時遇到疑惑？查閱按課題整理的核心概念精讀筆記，迅速掌握常考知識點。`}
      </p>
      <div className="mt-4">
        <Link
          href={`/notes/${subjectId}`}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {en ? `View ${subjectName} DSE notes →` : `查閱 ${subjectName} DSE 筆記 →`}
        </Link>
      </div>
    </aside>
  )
}
