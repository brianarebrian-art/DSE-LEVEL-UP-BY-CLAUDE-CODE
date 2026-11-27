import 'server-only'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { AnyQuestion, MCQuestion, WrittenQuestion } from '@/data/questions/types'
import { isWrittenQuestion } from '@/data/questions/types'

const cache = new Map<string, Promise<AnyQuestion[]>>()

/** One bank load per subject per server instance. Never send this array to the client. */
export function loadBank(subjectId: string): Promise<AnyQuestion[]> {
  let pending = cache.get(subjectId)
  if (!pending) {
    pending = loadSubjectQuestions(subjectId)
    cache.set(subjectId, pending)
  }
  return pending
}

export async function loadMcBank(subjectId: string): Promise<MCQuestion[]> {
  const all = await loadBank(subjectId)
  return all.filter((q): q is MCQuestion => q.type === 'mc')
}

export async function loadWrittenBank(subjectId: string): Promise<WrittenQuestion[]> {
  const all = await loadBank(subjectId)
  return all.filter(isWrittenQuestion)
}
