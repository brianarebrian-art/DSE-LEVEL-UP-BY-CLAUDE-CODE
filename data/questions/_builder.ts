import type { Question, Topic } from './types'

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
