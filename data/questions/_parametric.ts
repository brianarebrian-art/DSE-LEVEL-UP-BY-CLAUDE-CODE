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

/** 一個被丟棄的參數組合。丟棄本身正確，但必須留下紀錄。 */
export interface Drop {
  subject: string
  id: string
  reason: 'not-4-options' | 'duplicate-options'
  options: string[]
}

// ── 丟棄登記冊（2026-08-13）────────────────────────────────────────────────
// `add()` 一直會靜默丟棄退化的參數組合。丟棄本身正確 —— 寧可少出一題，也不能
// 向學生送出一題含有兩個相同選項的 MC。問題在於全程沒有任何提示。
//
// 實測：使用本工廠的 6 科合共丟棄 182 個參數組合，出題者收不到任何訊號。作者
// 以為寫出 40 個變體，實際入庫 28 個，差額無人知悉。此即「無限變體生成器」的
// 真正缺口 —— 並非生成不到，而是損耗看不見。
//
// 登記冊置於 module level：各 bank 於 import 時求值，故任何已 import 相關 bank
// 的工具或測試，均可事後讀取全量損耗。
const dropRegistry: Drop[] = []
/** 讀取各 bank 於載入期間被丟棄的參數組合（須先 import 相關 bank）。 */
export const getParametricDrops = (): readonly Drop[] => dropRegistry

export interface Bank {
  bank: Question[]
  /** 本 bank 被丟棄的參數組合（登記冊之中屬於本 subject 的部分）。 */
  drops: Drop[]
  add: (
    id: string, topic: TopicMeta, fw: FwMeta, difficulty: Difficulty,
    content: Pair, opts: Pair[], explanation: Pair,
  ) => void
}

export function createBank(subject: string): Bank {
  const bank: Question[] = []
  const drops: Drop[] = []
  const drop = (id: string, reason: Drop['reason'], options: string[]) => {
    const d: Drop = { subject, id, reason, options }
    drops.push(d)
    dropRegistry.push(d)
  }
  const add: Bank['add'] = (id, topic, fw, difficulty, content, opts, explanation) => {
    if (opts.length !== 4) return drop(id, 'not-4-options', opts.map((o) => o[0]))
    const zh = opts.map((o) => o[0])
    // degenerate parameters → drop, never ship an ambiguous item（同時登記，不再靜默）
    if (new Set(zh).size !== 4) return drop(id, 'duplicate-options', zh)
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
  return { bank, drops, add }
}
