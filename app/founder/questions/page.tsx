import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireFounder } from '@/lib/auth/founderAllowlist'
import { listFounderQuestions } from '@/lib/founder/questions'
import ModuleFrame from '@/components/founder/ModuleFrame'
import QuestionsWorkbench from '@/components/founder/QuestionsWorkbench'

export const dynamic = 'force-dynamic'

export default async function FounderQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const founder = await requireFounder()
  if (!founder) redirect('/')

  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const subject = typeof sp.subject === 'string' ? sp.subject : ''
  const difficulty = typeof sp.difficulty === 'string' ? sp.difficulty : ''
  const page = Number(typeof sp.page === 'string' ? sp.page : '1') || 1
  const sort = (typeof sp.sort === 'string' ? sp.sort : 'id') as 'id' | 'topic' | 'difficulty'

  const data = listFounderQuestions({ q, subject, difficulty, page, sort, pageSize: 50 })

  return (
    <ModuleFrame
      title="題庫工場"
      titleEn="Question Workshop"
      status="partial"
      statusDetail={data.note}
      actions={
        <div className="flex gap-2 text-xs">
          <Link href="/founder/questions/batches" className="text-[var(--fos-cyan)]">
            發佈批次
          </Link>
          <Link href="/founder/questions/import" className="text-[var(--fos-cyan)]">
            批量匯入
          </Link>
        </div>
      }
    >
      <QuestionsWorkbench initial={data} query={{ q, subject, difficulty, page, sort }} />
    </ModuleFrame>
  )
}
