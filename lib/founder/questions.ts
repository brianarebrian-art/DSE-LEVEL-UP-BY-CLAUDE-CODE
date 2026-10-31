import 'server-only'
import { getActiveSubjects, subjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import type { AnyQuestion } from '@/data/questions/types'
import { stripEmoji } from '@/lib/stripEmoji'

export type FounderQuestionRow = {
  id: string
  subject: string
  subjectName: string
  topic: string
  difficulty: string
  type: string
  stemPreview: string
  status: 'published'
}

export type QuestionListQuery = {
  q?: string
  subject?: string
  difficulty?: string
  page?: number
  pageSize?: number
  sort?: 'id' | 'topic' | 'difficulty'
}

export type QuestionListResult = {
  rows: FounderQuestionRow[]
  total: number
  page: number
  pageSize: number
  subjects: { id: string; name: string; count: number }[]
  updatedAt: string
  source: 'static_bank'
  note: string
}

function preview(text: string, n = 80): string {
  const t = stripEmoji(text).replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : `${t.slice(0, n)}…`
}

function stemOf(q: AnyQuestion): string {
  if ('question' in q && typeof q.question === 'string') return q.question
  if ('stem' in q && typeof (q as { stem?: string }).stem === 'string') return (q as { stem: string }).stem
  return q.id
}

/**
 * 題庫列表 —— 伺服器分頁／篩選，唔一次 dump 全庫去瀏覽器。
 * 現階段來源係靜態 barrel（同學生前台一致）；草稿／下架狀態需接 review／DB 後擴充。
 */
export function listFounderQuestions(query: QuestionListQuery): QuestionListResult {
  const pageSize = Math.min(Math.max(query.pageSize ?? 50, 10), 100)
  const page = Math.max(query.page ?? 1, 1)
  const needle = (query.q ?? '').trim().toLowerCase()
  const subjectFilter = query.subject?.trim() || ''
  const difficultyFilter = query.difficulty?.trim() || ''

  const counts: { id: string; name: string; count: number }[] = []
  const all: FounderQuestionRow[] = []

  const pool = subjectFilter
    ? subjects.filter((s) => s.id === subjectFilter)
    : getActiveSubjects()

  for (const s of pool) {
    let qs: AnyQuestion[] = []
    try {
      qs = getSubjectQuestions(s.id)
    } catch {
      qs = []
    }
    counts.push({ id: s.id, name: s.name, count: qs.length })
    for (const q of qs) {
      const difficulty = String((q as { difficulty?: string }).difficulty ?? '')
      if (difficultyFilter && difficulty !== difficultyFilter) continue
      const topic = String((q as { topic?: string }).topic ?? '')
      const type = String((q as { type?: string }).type ?? 'mc')
      const stem = stemOf(q)
      if (needle) {
        const hay = `${q.id} ${topic} ${stem}`.toLowerCase()
        if (!hay.includes(needle)) continue
      }
      all.push({
        id: q.id,
        subject: s.id,
        subjectName: s.name,
        topic,
        difficulty,
        type,
        stemPreview: preview(stem),
        status: 'published',
      })
    }
  }

  // 未篩科目時，其餘活躍科目 count 仍要列出
  if (subjectFilter) {
    for (const s of getActiveSubjects()) {
      if (counts.some((c) => c.id === s.id)) continue
      try {
        counts.push({ id: s.id, name: s.name, count: getSubjectQuestions(s.id).length })
      } catch {
        counts.push({ id: s.id, name: s.name, count: 0 })
      }
    }
  }

  const sort = query.sort ?? 'id'
  all.sort((a, b) => {
    if (sort === 'topic') return a.topic.localeCompare(b.topic, 'zh-HK') || a.id.localeCompare(b.id)
    if (sort === 'difficulty') return a.difficulty.localeCompare(b.difficulty) || a.id.localeCompare(b.id)
    return a.id.localeCompare(b.id)
  })

  const total = all.length
  const start = (page - 1) * pageSize
  const rows = all.slice(start, start + pageSize)

  return {
    rows,
    total,
    page,
    pageSize,
    subjects: counts.sort((a, b) => a.name.localeCompare(b.name, 'zh-HK')),
    updatedAt: new Date().toISOString(),
    source: 'static_bank',
    note: '目前讀取已發佈靜態題庫；草稿／下架／版本歷史需接 DB 擴充後寫入。編輯唔會直接改正式題庫檔。',
  }
}

export function getFounderQuestion(id: string): (FounderQuestionRow & { raw: AnyQuestion }) | null {
  for (const s of subjects) {
    let qs: AnyQuestion[] = []
    try {
      qs = getSubjectQuestions(s.id)
    } catch {
      continue
    }
    const hit = qs.find((q) => q.id === id)
    if (!hit) continue
    return {
      id: hit.id,
      subject: s.id,
      subjectName: subjectMetaName(s.id) || s.name,
      topic: String((hit as { topic?: string }).topic ?? ''),
      difficulty: String((hit as { difficulty?: string }).difficulty ?? ''),
      type: String((hit as { type?: string }).type ?? 'mc'),
      stemPreview: preview(stemOf(hit), 200),
      status: 'published',
      raw: hit,
    }
  }
  return null
}

function subjectMetaName(id: string): string {
  return subjects.find((s) => s.id === id)?.name ?? id
}
