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

// 2026-07-30 對比度修正：兩個徽章原本用深色系 slate/amber，係 light-first 遷移漏網。
// 淺色主題下 amber-300/90 落 amber-500/10 淡底（合成 #FEF4E5）只有 1.30:1 ——
// 即係「進階」兩個字實際上睇唔到。改用主題 token 後，Light 4.86:1 / Cyber 7.66:1。
export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyTier> = {
  easy: {
    label: '基礎',
    badgeClass: 'text-ink-muted bg-surface-sunken border-line-strong',
  },
  medium: {
    label: '進階',
    badgeClass: 'text-gold bg-gold/10 border-gold/30',
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
