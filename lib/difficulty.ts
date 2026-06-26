import type { Difficulty } from '@/data/questions'

// ─────────────────────────────────────────────────────────────────────────────
// V1.0 HELL-MODE difficulty schema.
// The question data keeps the original 'easy' | 'medium' | 'hard' enum for full
// backward compatibility (no per-question migration); this module is the SINGLE
// source that maps each underlying key to its Hell-tier label, target DSE grade
// and badge styling. Render via <DifficultyBadge>, never hard-code the labels.
//
//   easy   → 🔥 HELL          地獄          穩奪 L3–4
//   medium → 💀 HELL 18       地獄十八層     衝刺 L5
//   hard   → 👁️ HELL OF HELL  地獄中之地獄   奪星 5**
// ─────────────────────────────────────────────────────────────────────────────

export type HellTierKey = 'HELL' | 'HELL_18' | 'HELL_OF_HELL'

export interface HellTier {
  key: HellTierKey
  emoji: string
  en: string // HELL / HELL 18 / HELL OF HELL
  zh: string // 地獄 / 地獄十八層 / 地獄中之地獄
  target: string // 穩奪 L3–4 / 衝刺 L5 / 奪星 5**
  targetEn: string
  badgeClass: string // wrapper colour/border styling (Tailwind + custom)
  anim: string // pulse / neon animation class ('' = none)
}

export const HELL_TIERS: Record<Difficulty, HellTier> = {
  // EASY → 地獄：暗紅背景 / 灰邊
  easy: {
    key: 'HELL',
    emoji: '🔥',
    en: 'HELL',
    zh: '地獄',
    target: '穩奪 L3–4',
    targetEn: 'Secure L3–4',
    badgeClass: 'text-red-300 bg-red-950/70 border-slate-600',
    anim: '',
  },
  // NORMAL → 地獄十八層：鮮紅背景 / 高對比脈衝（安全版閃爍）
  medium: {
    key: 'HELL_18',
    emoji: '💀',
    en: 'HELL 18',
    zh: '地獄十八層',
    target: '衝刺 L5',
    targetEn: 'Push for L5',
    badgeClass: 'text-red-50 bg-red-600/30 border-red-500/80',
    anim: 'animate-hell-pulse',
  },
  // HARD → 地獄中之地獄：深黑背景 / 血紅霓虹邊框 / 燙金文字
  hard: {
    key: 'HELL_OF_HELL',
    emoji: '👁️',
    en: 'HELL OF HELL',
    zh: '地獄中之地獄',
    target: '奪星 5**',
    targetEn: 'Star limit 5**',
    badgeClass: 'hell-of-hell',
    anim: 'animate-hell-neon',
  },
}

export function hellTier(d: Difficulty): HellTier {
  return HELL_TIERS[d]
}
