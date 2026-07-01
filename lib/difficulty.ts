import type { Difficulty } from '@/data/questions'

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty display — deliberately low-key (UI 降噪) and calm in tone (因材施教).
// The question data keeps its original 'easy' | 'medium' | 'hard' enum; this is
// the single source that maps each key to its (minimal) on-screen label.
//
//   easy   → 基礎
//   medium → 進階
//   hard   → (no label) — the hardest core is felt through the question itself,
//            not announced. `label: null` ⇒ DifficultyBadge renders nothing.
// ─────────────────────────────────────────────────────────────────────────────

export interface DifficultyTier {
  label: string | null
  badgeClass: string
}

export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyTier> = {
  easy: {
    label: '基礎',
    badgeClass: 'text-slate-400 bg-slate-800/60 border-slate-700/70',
  },
  medium: {
    label: '進階',
    badgeClass: 'text-amber-300/90 bg-amber-500/10 border-amber-500/30',
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
