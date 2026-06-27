import type { Difficulty } from '@/data/questions'

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty display — deliberately low-key (UI 降噪).
// The question data keeps its original 'easy' | 'medium' | 'hard' enum; this is
// the single source that maps each key to its (minimal) on-screen label.
//
//   easy   → 地獄
//   medium → 地獄十八層
//   hard   → (no label) — the hardest core is felt through the question itself,
//            not announced. `label: null` ⇒ DifficultyBadge renders nothing.
// ─────────────────────────────────────────────────────────────────────────────

export interface DifficultyTier {
  label: string | null
  badgeClass: string
}

export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyTier> = {
  easy: {
    label: '地獄',
    badgeClass: 'text-red-300/80 bg-red-950/50 border-slate-700/70',
  },
  medium: {
    label: '地獄十八層',
    badgeClass: 'text-red-200/90 bg-red-800/20 border-red-700/50',
  },
  hard: {
    // Invisible hardest core: no badge at all.
    label: null,
    badgeClass: '',
  },
}

export function difficultyTier(d: Difficulty): DifficultyTier {
  return DIFFICULTY_TIERS[d]
}
