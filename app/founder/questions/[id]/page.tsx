import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import { getFounderQuestion } from '@/lib/founder/questions'
import ModuleFrame from '@/components/founder/ModuleFrame'

export const dynamic = 'force-dynamic'

export default async function FounderQuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const founder = await requireFounder()
  if (!founder) redirect('/')

  const { id } = await params
  const q = getFounderQuestion(decodeURIComponent(id))
  if (!q) notFound()

  const raw = q.raw as unknown as Record<string, unknown>
  const options = Array.isArray(raw.options) ? (raw.options as string[]) : null
  const explanation = typeof raw.explanation === 'string' ? raw.explanation : null
  const referenceAnswer = typeof raw.referenceAnswer === 'string' ? raw.referenceAnswer : null

  return (
    <ModuleFrame
      title={`題目 ${q.id}`}
      titleEn={q.subjectName}
      status="partial"
      statusDetail="唯讀檢視已發佈題庫。版本歷史／草稿編輯寫入需接 QuestionRevision 表後開放；而家唔會改動正式檔。"
    >
      <div className="fos-panel space-y-3 p-4 text-sm">
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase text-[var(--fos-faint)]">科目</dt>
            <dd>{q.subjectName}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-[var(--fos-faint)]">課題</dt>
            <dd>{q.topic || '—'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-[var(--fos-faint)]">難度</dt>
            <dd>{q.difficulty || '—'}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase text-[var(--fos-faint)]">題型</dt>
            <dd>{q.type}</dd>
          </div>
        </dl>
        <div>
          <h2 className="fos-panel-title mb-1">題幹</h2>
          <p className="whitespace-pre-wrap text-[var(--fos-ink)]">{q.stemPreview}</p>
        </div>
        {options && (
          <div>
            <h2 className="fos-panel-title mb-1">選項</h2>
            <ol className="list-decimal space-y-1 pl-5">
              {options.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>
            {'correctIndex' in raw && typeof raw.correctIndex === 'number' && (
              <p className="mt-2 text-xs text-[var(--fos-ok)]">正解索引：{raw.correctIndex}</p>
            )}
          </div>
        )}
        {referenceAnswer && (
          <div>
            <h2 className="fos-panel-title mb-1">參考答案</h2>
            <p className="whitespace-pre-wrap">{referenceAnswer}</p>
          </div>
        )}
        {explanation && (
          <div>
            <h2 className="fos-panel-title mb-1">解析</h2>
            <p className="whitespace-pre-wrap text-[var(--fos-muted)]">{explanation}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-2 text-xs">
          <Link href="/founder/questions" className="text-[var(--fos-cyan)]">
            ← 返回列表
          </Link>
          <Link
            href={`/founder/quality?question=${encodeURIComponent(q.id)}`}
            className="text-[var(--fos-cyan)]"
          >
            建立／查看覆核
          </Link>
        </div>
      </div>
    </ModuleFrame>
  )
}
