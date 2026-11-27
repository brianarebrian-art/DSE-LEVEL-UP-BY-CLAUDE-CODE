import type { Question, QuestionType, Survey } from '@/lib/research/types'

export function blankQuestion(type: QuestionType, id: string): Question {
  const choice = type === 'single' || type === 'multiple'
  return {
    id,
    type,
    prompt: type === 'sus' ? '請就你剛使用嘅 DSE Level Up 流程，回答下面十句。' : '',
    helpText: '',
    required: type !== 'text',
    options: choice
      ? [
          { id: `${id}-a`, label: '選項甲' },
          { id: `${id}-b`, label: '選項乙' },
        ]
      : [],
  }
}

export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction
  if (index < 0 || index >= items.length || next < 0 || next >= items.length) return [...items]
  const copy = items.slice()
  const [item] = copy.splice(index, 1)
  copy.splice(next, 0, item)
  return copy
}

export function duplicateSurvey(
  source: Survey,
  now: string,
  ids: { surveyId: string; questionIds: string[] },
): Survey {
  return {
    ...source,
    id: ids.surveyId,
    name: source.name.trim() ? `${source.name}（複本）` : '未命名問卷（複本）',
    status: 'draft',
    updatedAt: now,
    questions: source.questions.map((question, index) => ({
      ...question,
      id: ids.questionIds[index] ?? `${ids.surveyId}-q${index + 1}`,
      options: question.options.map((option) => ({ ...option })),
    })),
  }
}

export function createId(prefix: string): string {
  const token = globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  return `${prefix}-${token}`
}

export function nextRespondentCode(existing: readonly string[], rng: () => number = Math.random): string {
  const used = new Set(existing)
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const code = `R-${1000 + Math.floor(rng() * 9000)}`
    if (!used.has(code)) return code
  }
  let n = 1000
  while (used.has(`R-${n}`)) n += 1
  return `R-${n}`
}
