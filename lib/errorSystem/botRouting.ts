// Subject → Grok bot routing (Phase 4). Mirrors `.grok-bots/*-bot.md`.
// No niche-subject dual-review exemption — routing only, never skips L2.

export type BotId =
  | 'chi-bot'
  | 'eng-bot'
  | 'math-bot'
  | 'sci-bot'
  | 'commerce-bot'
  | 'general-bot'

export const BOT_IDS: readonly BotId[] = [
  'chi-bot',
  'eng-bot',
  'math-bot',
  'sci-bot',
  'commerce-bot',
  'general-bot',
] as const

const CHI = new Set(['chinese', 'chinese-literature'])
const ENG = new Set(['english', 'english-literature'])
const MATH = new Set(['math', 'm1', 'm2'])
const SCI = new Set(['physics', 'chemistry', 'biology'])
const COMMERCE = new Set(['economics', 'bafs', 'ict'])

/** Map a `data/subjects.ts` id to the investigating bot. Unknown → general-bot. */
export function botForSubject(subject: string): BotId {
  if (CHI.has(subject)) return 'chi-bot'
  if (ENG.has(subject)) return 'eng-bot'
  if (MATH.has(subject)) return 'math-bot'
  if (SCI.has(subject)) return 'sci-bot'
  if (COMMERCE.has(subject)) return 'commerce-bot'
  return 'general-bot'
}

export function subjectsForBot(botId: BotId): readonly string[] | 'fallback' {
  switch (botId) {
    case 'chi-bot':
      return [...CHI]
    case 'eng-bot':
      return [...ENG]
    case 'math-bot':
      return [...MATH]
    case 'sci-bot':
      return [...SCI]
    case 'commerce-bot':
      return [...COMMERCE]
    case 'general-bot':
      return 'fallback'
  }
}

/** True if this bot should pick up a queue report for `subject`. */
export function botClaimsSubject(botId: BotId, subject: string): boolean {
  if (botId === 'general-bot') {
    return botForSubject(subject) === 'general-bot'
  }
  return botForSubject(subject) === botId
}

/** Subjects that must never be treated as dual-review exempt (documentation lock). */
export const NO_DUAL_REVIEW_EXEMPTION_SUBJECTS = [
  'm1',
  'm2',
  'design-tech',
  'music',
  'visual-arts',
  'pe',
] as const
