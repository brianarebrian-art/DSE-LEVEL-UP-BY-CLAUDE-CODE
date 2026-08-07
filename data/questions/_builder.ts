import type { LongQuestion, Question, TextQuestion, Topic } from './types'

// Shared bilingual question builder used by every code-generated subject bank.
// Each subject calls `makeQ('<subject>')` to get a `q()` factory, then assembles
// 120 questions from parametrised generators / curated pools.
// opts[0] is ALWAYS the correct answer; PracticeSession shuffles display order and
// grades by the language-independent zh text.

export type Pair = [zh: string, en: string]
export type Difficulty = 'easy' | 'medium' | 'hard'
export interface TopicMeta { id: string; zh: string; en: string }
export interface FwMeta { id: string; zh: string; en: string; emoji: string }

export function makeQ(subject: string) {
  return function q(
    id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
    year: number, marks: number, content: Pair, opts: Pair[], explanation: Pair,
  ): Question {
    // Build-time guard: duplicate option text breaks shuffle-grading, so fail loudly.
    const zh = opts.map((o) => o[0])
    if (new Set(zh).size !== zh.length) {
      throw new Error(`[${subject}/${id}] duplicate option text: ${zh.join(' | ')}`)
    }
    if (opts.length < 2) throw new Error(`[${subject}/${id}] needs ≥2 options`)
    return {
      id, type: 'mc', subject,
      topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
      framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
      difficulty, year,
      content: content[0], contentEn: content[1],
      options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
      correctIndex: 0,
      explanation: explanation[0], explanationEn: explanation[1],
      marks,
    }
  }
}

// ── Written-response factories ──────────────────────────────────────────────
//
// `makeQ()` above is UNCHANGED. Its duplicate-option guard and correctIndex
// convention underpin all 5,178 existing MC items and must not shift because a
// new question type was added.
//
// These factories do NOT make written questions auto-markable. `referenceAnswer`
// is revealed after submission for the student to compare against; it is not a
// key for keyword matching. Platform-wide rule: written responses are never
// machine-marked, and never counted towards objective accuracy or grade
// prediction.
//
// Bilingual: `referenceAnswerEn` / `markingSchemeEn` are optional in the type
// (for backwards compatibility with older records) but REQUIRED here. The site
// is fully bilingual; a student on the English interface who is shown a Chinese
// reference answer has nothing to self-assess against. Narrowing at the entry
// point beats chasing it at the gate afterwards.

/** Short-answer factory (a few words to one line: a formula, value, definition). */
export function makeText(subject: string) {
  return function t(
    id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
    year: number, marks: number, content: Pair, referenceAnswer: Pair, explanation: Pair,
  ): TextQuestion {
    assertWritten(subject, id, marks, referenceAnswer)
    return {
      id, type: 'text', subject,
      topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
      framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
      difficulty, year,
      content: content[0], contentEn: content[1],
      referenceAnswer: referenceAnswer[0], referenceAnswerEn: referenceAnswer[1],
      explanation: explanation[0], explanationEn: explanation[1],
      marks,
    }
  }
}

/** Long / structured factory. `markingScheme` holds step marks — again, reference material for self-assessment only. */
export function makeLong(subject: string) {
  return function l(
    id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
    year: number, marks: number, content: Pair, referenceAnswer: Pair,
    opts: { markingScheme?: Pair; suggestedMinutes?: number } = {},
  ): LongQuestion {
    assertWritten(subject, id, marks, referenceAnswer)
    if (opts.markingScheme) {
      const [zh, en] = opts.markingScheme
      if (!zh?.trim() || !en?.trim()) {
        throw new Error(`[${subject}/${id}] markingScheme needs both zh and en, or omit it entirely`)
      }
    }
    if (opts.suggestedMinutes !== undefined && (!Number.isFinite(opts.suggestedMinutes) || opts.suggestedMinutes <= 0)) {
      throw new Error(`[${subject}/${id}] suggestedMinutes must be a positive number`)
    }
    return {
      id, type: 'long', subject,
      topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
      framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
      difficulty, year,
      content: content[0], contentEn: content[1],
      referenceAnswer: referenceAnswer[0], referenceAnswerEn: referenceAnswer[1],
      ...(opts.markingScheme
        ? { markingScheme: opts.markingScheme[0], markingSchemeEn: opts.markingScheme[1] }
        : {}),
      ...(opts.suggestedMinutes !== undefined ? { suggestedMinutes: opts.suggestedMinutes } : {}),
      marks,
    }
  }
}

/** Build-time guard shared by both written-response factories. */
function assertWritten(subject: string, id: string, marks: number, referenceAnswer: Pair): void {
  const [zh, en] = referenceAnswer ?? []
  // No reference answer means the student has nothing to compare against once
  // they finish — self-assessment becomes impossible. This must throw, not warn.
  if (!zh?.trim()) throw new Error(`[${subject}/${id}] referenceAnswer must not be empty`)
  if (!en?.trim()) throw new Error(`[${subject}/${id}] referenceAnswerEn must not be empty (the site is bilingual)`)
  if (!Number.isFinite(marks) || marks <= 0) throw new Error(`[${subject}/${id}] marks must be a positive number`)
}

// Build a Topic[] summary from topic metas + per-topic counts.
export function topicList(
  entries: { topic: TopicMeta; fw: FwMeta; count: number }[],
): Topic[] {
  return entries.map(({ topic, fw, count }) => ({
    id: topic.id, zh: topic.zh, en: topic.en,
    framework: fw.zh, frameworkEn: fw.en, emoji: fw.emoji, count,
  }))
}

// ── numeric / LaTeX formatting helpers (language-neutral) ───────────────────
export const sx = (b: number, v = 'x') => b === 0 ? '' : b === 1 ? ` + ${v}` : b === -1 ? ` - ${v}` : b > 0 ? ` + ${b}${v}` : ` - ${-b}${v}`
export const sc = (c: number) => c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`
export const rnd = (n: number, dp = 2) => Number.isInteger(n) ? `${n}` : `${parseFloat(n.toFixed(dp))}`
