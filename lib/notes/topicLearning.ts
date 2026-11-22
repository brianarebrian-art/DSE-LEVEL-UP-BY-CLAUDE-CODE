import type { Difficulty, MCQuestion } from '@/data/questions/types'
import { SITE_ORIGIN } from '@/lib/site'

export const NOTE_LEVELS = [
  { value: 'easy', label: '基礎', description: '鞏固核心概念' },
  { value: 'medium', label: '進階', description: '應用與多步驟推理' },
  { value: 'hard', label: '挑戰', description: '綜合應用與比較' },
] as const
export function parseNoteDifficulty(raw: string | null | undefined): Difficulty | undefined {
  return raw === 'easy' || raw === 'medium' || raw === 'hard' ? raw : undefined
}
export function topicLearningPath(subject: string, topic: string): string {
  return `/practice/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}`
}
export function topicLearningUrl(subject: string, topic: string): string {
  return SITE_ORIGIN + topicLearningPath(subject, topic)
}
/** Explicit filters never borrow a different topic or difficulty to fill a set. */
export function filterNotePractice<T extends Pick<MCQuestion, 'topic' | 'difficulty'>>(bank: T[], topic: string | null, difficulty?: Difficulty): T[] {
  return bank.filter(q => (!topic || q.topic === topic) && (!difficulty || q.difficulty === difficulty))
}
export function noteFilename(subject: string, topic: string): string {
  return Array.from(`${subject}-${topic}-自學筆記`).map(char => char.charCodeAt(0) < 32 || '/\\:*?"<>|'.includes(char) ? '-' : char).join('')
}

export function topicStudyFaq(note: {titleZh:string;mustKnowZh:string[];commonTrapZh:string}) {
  return [
    {question:`${note.titleZh}有哪些重點？`,answer:note.mustKnowZh.join('；')},
    {question:`${note.titleZh}有哪些常見錯誤？`,answer:note.commonTrapZh},
  ]
}
