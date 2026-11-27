/**
 * Public practice payloads. Answer keys stay on the server until a student submits.
 *
 * Allowlists only: a new secret field on the bank type is not copied by accident.
 */
import type {
  Difficulty,
  LongQuestion,
  MCQuestion,
  OptionNote,
  TextQuestion,
  WrittenQuestion,
} from '@/data/questions/types'

export type PublicMc = {
  id: string
  type: 'mc'
  subject: string
  topic: string
  topicZh: string
  topicEn?: string
  framework: string
  frameworkZh: string
  frameworkEn?: string
  frameworkEmoji: string
  difficulty: Difficulty
  year: number
  marks: number
  content: string
  contentEn?: string
  /** Already shuffled. Index 0 is not the stored correct option. */
  options: string[]
  optionsEn?: string[]
}

export type PublicWritten = {
  id: string
  type: 'text' | 'long'
  subject: string
  topic: string
  topicZh: string
  topicEn?: string
  framework: string
  frameworkZh: string
  frameworkEn?: string
  frameworkEmoji: string
  difficulty: Difficulty
  year: number
  marks: number
  content: string
  contentEn?: string
  suggestedMinutes?: number
}

export type OptionNotePublic = {
  optionText: string
  zh: string
  en?: string
}

export type McCheckResult = {
  correct: boolean
  correctText: string
  explanation: string
  explanationEn?: string
  steps?: string[]
  stepsEn?: string[]
  mcHack?: string
  mcHackEn?: string
  optionNotes?: OptionNotePublic[]
}

export type WrittenKeyResult = {
  referenceAnswer: string
  referenceAnswerEn?: string
  markingScheme?: string
  markingSchemeEn?: string
  explanation?: string
  explanationEn?: string
}

export type PublicPaperMc = {
  id: string
  content: string
  contentEn?: string
  options: string[]
  optionsEn: string[]
  answerIndex?: number
  explanation?: string
  explanationEn?: string
}

function shuffle<T>(list: readonly T[], random: () => number): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function toPublicMc(q: MCQuestion, random: () => number = Math.random): PublicMc {
  const order = shuffle(q.options.map((_, i) => i), random)
  const optionsEn = q.optionsEn
    ? order.map((i) => q.optionsEn![i] ?? q.options[i])
    : undefined
  return {
    id: q.id,
    type: 'mc',
    subject: q.subject,
    topic: q.topic,
    topicZh: q.topicZh,
    topicEn: q.topicEn,
    framework: q.framework,
    frameworkZh: q.frameworkZh,
    frameworkEn: q.frameworkEn,
    frameworkEmoji: q.frameworkEmoji,
    difficulty: q.difficulty,
    year: q.year,
    marks: q.marks,
    content: q.content,
    contentEn: q.contentEn,
    options: order.map((i) => q.options[i]),
    optionsEn,
  }
}

/** Client-side stand-in: answer fields are empty until /api/practice/check. */
export function withheldWritten(q: PublicWritten): WrittenQuestion {
  const shared = {
    id: q.id,
    subject: q.subject,
    topic: q.topic,
    topicZh: q.topicZh,
    topicEn: q.topicEn,
    framework: q.framework,
    frameworkZh: q.frameworkZh,
    frameworkEn: q.frameworkEn,
    frameworkEmoji: q.frameworkEmoji,
    difficulty: q.difficulty,
    year: q.year,
    marks: q.marks,
    content: q.content,
    contentEn: q.contentEn,
    referenceAnswer: '',
  }
  if (q.type === 'long') {
    const longQ: LongQuestion = { ...shared, type: 'long', suggestedMinutes: q.suggestedMinutes }
    return longQ
  }
  const textQ: TextQuestion = { ...shared, type: 'text', explanation: '' }
  return textQ
}

/** Bookmark lookup: stem only. No options, index, explanation, or model answer. */
export function toStem(q: {
  id: string
  type: string
  topic: string
  topicZh: string
  difficulty: string
  content: string
  contentEn?: string
}) {
  return {
    id: q.id,
    type: q.type,
    topic: q.topic,
    topicZh: q.topicZh,
    difficulty: q.difficulty,
    content: q.content,
    contentEn: q.contentEn,
  }
}

export function toPublicWritten(q: WrittenQuestion): PublicWritten {
  return {
    id: q.id,
    type: q.type,
    subject: q.subject,
    topic: q.topic,
    topicZh: q.topicZh,
    topicEn: q.topicEn,
    framework: q.framework,
    frameworkZh: q.frameworkZh,
    frameworkEn: q.frameworkEn,
    frameworkEmoji: q.frameworkEmoji,
    difficulty: q.difficulty,
    year: q.year,
    marks: q.marks,
    content: q.content,
    contentEn: q.contentEn,
    suggestedMinutes: q.type === 'long' ? q.suggestedMinutes : undefined,
  }
}

export function checkMc(q: MCQuestion, chosenText: string): McCheckResult | null {
  if (!q.options.includes(chosenText)) return null
  const correctText = q.options[q.correctIndex] ?? ''
  const optionNotes = notesFor(q)
  return {
    correct: chosenText === correctText,
    correctText,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
    steps: q.steps,
    stepsEn: q.stepsEn,
    mcHack: q.mcHack,
    mcHackEn: q.mcHackEn,
    optionNotes,
  }
}

function notesFor(q: MCQuestion): OptionNotePublic[] | undefined {
  if (!q.optionNotes?.length) return undefined
  const out: OptionNotePublic[] = []
  for (const note of q.optionNotes) {
    const optionText = q.options[note.optionId]
    if (!optionText) continue
    out.push({ optionText, zh: note.zh, en: note.en })
  }
  return out.length ? out : undefined
}

export function writtenKey(q: WrittenQuestion): WrittenKeyResult {
  if (q.type === 'long') {
    return {
      referenceAnswer: q.referenceAnswer,
      referenceAnswerEn: q.referenceAnswerEn,
      markingScheme: q.markingScheme,
      markingSchemeEn: q.markingSchemeEn,
      explanation: q.explanation,
      explanationEn: q.explanationEn,
    }
  }
  return {
    referenceAnswer: q.referenceAnswer,
    referenceAnswerEn: q.referenceAnswerEn,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
  }
}

/** Map stored option notes onto the options the student actually saw. */
export function notesInSeenOrder(
  notes: readonly OptionNotePublic[] | undefined,
  seen: readonly { zh: string; optionId: number }[],
): OptionNote[] {
  if (!notes?.length) return []
  const byText = new Map(notes.map((n) => [n.optionText, n]))
  const out: OptionNote[] = []
  for (const opt of seen) {
    const note = byText.get(opt.zh)
    if (!note) continue
    out.push({ optionId: opt.optionId, zh: note.zh, en: note.en })
  }
  return out
}

export function projectPaperMc(
  item: { question: MCQuestion; options: string[]; optionsEn: string[]; answerIndex: number },
  withExplain: boolean,
): PublicPaperMc {
  const base: PublicPaperMc = {
    id: item.question.id,
    content: item.question.content,
    contentEn: item.question.contentEn,
    options: item.options,
    optionsEn: item.optionsEn,
  }
  if (!withExplain) return base
  return {
    ...base,
    answerIndex: item.answerIndex,
    explanation: item.question.explanation,
    explanationEn: item.question.explanationEn,
  }
}

export function projectPaperWritten(q: WrittenQuestion, withExplain: boolean): PublicWritten | (PublicWritten & WrittenKeyResult) {
  const base = toPublicWritten(q)
  if (!withExplain) return base
  return { ...base, ...writtenKey(q) }
}
