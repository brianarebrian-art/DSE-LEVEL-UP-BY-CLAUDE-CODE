import type { Question, Difficulty } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// SHARED PARAMETRIC-BANK ENGINE (Mode A — correct-by-construction)
// ---------------------------------------------------------------------------
// One audited factory reused by every quantitative subject bank (physics /
// chemistry / m1 / m2 / …). `createBank(subject)` returns an `add()` that:
//   • puts the CORRECT value at index 0 (the practice runner shuffles at render),
//   • SKIPS any parameter tuple whose 4 option strings aren't all distinct
//     (so no ambiguous / duplicate-option item is ever emitted, and the build
//      never throws on a degenerate tuple).
// EVERY option (answer + 3 distractors) must be COMPUTED by formula by the caller
// — distractors model named mistakes. This is the 生死線: nothing here is a
// guessed answer. math-bank.ts / math-parametric.ts predate this helper and keep
// their own inline copies; new banks import from here.
// ═══════════════════════════════════════════════════════════════════════════

export type Pair = [zh: string, en: string]
export const n = (s: string): Pair => [s, s] // language-free (numbers / LaTeX)

export interface TopicMeta { id: string; zh: string; en: string }
export interface FwMeta { id: string; zh: string; en: string; emoji: string }

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

/** Reduce num/den to a LaTeX fraction (or an integer string when it divides). */
export function frac(num: number, den: number): string {
  if (num === 0) return '0'
  const g = gcd(num, den) || 1
  let p = num / g, q = den / g
  if (q < 0) { p = -p; q = -q }
  return q === 1 ? `${p}` : `\\frac{${p}}{${q}}`
}

/** Round to at most `dp` decimals, dropping trailing zeros (for clean option text). */
export function round(x: number, dp = 2): string {
  return String(Number(x.toFixed(dp)))
}

export interface Bank {
  bank: Question[]
  add: (
    id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
    content: Pair, opts: Pair[], explanation: Pair,
  ) => void
}

export function createBank(subject: string): Bank {
  const bank: Question[] = []
  const add: Bank['add'] = (id, topic, fw, difficulty, content, opts, explanation) => {
    if (opts.length !== 4) return
    const zh = opts.map((o) => o[0])
    if (new Set(zh).size !== 4) return // degenerate parameters → drop, never ship an ambiguous item
    bank.push({
      id, type: 'mc', subject,
      topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
      framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
      difficulty, year: 0,
      content: content[0], contentEn: content[1],
      options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
      correctIndex: 0,
      explanation: explanation[0], explanationEn: explanation[1],
      marks: difficulty === 'hard' ? 2 : 1,
    })
  }
  return { bank, add }
}
