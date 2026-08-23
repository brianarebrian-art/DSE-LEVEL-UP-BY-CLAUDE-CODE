import type { Difficulty } from '@/data/questions'

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty display — deliberately low-key (UI 降噪) and calm in tone (因材施教).
// The question data keeps its original 'easy' | 'medium' | 'hard' enum; this is
// the single source that maps each key to its (minimal) on-screen label.
//
//   easy   → 基礎 / Foundation
//   medium → 進階 / Advanced
//   hard   → (no label) — the hardest core is felt through the question itself,
//            not announced. `label: null` ⇒ DifficultyBadge renders nothing.
// ─────────────────────────────────────────────────────────────────────────────

export interface DifficultyTier {
  /** 中文標籤；`null` = 唔顯示徽章。 */
  label: string | null
  /**
   * 英文標籤。
   *
   * 2026-08-23 補回：呢兩個標籤一直只有中文，於是英文介面每一科、每一條題目
   * 都出住「基礎」「進階」。i18n-guard 掃唔到 —— 佢只掃 app/ 同 components/
   * 嘅 .tsx，而呢個常數喺 lib/ 嘅 .ts 入面。
   *
   * 同中文科課題名同一個決策（創辦人 2026-08-23）：非華語考生要讀得明導覽層。
   */
  labelEn: string | null
  badgeClass: string
}

// 2026-07-30 對比度修正：兩個徽章原本用深色系 slate/amber，係 light-first 遷移漏網。
// 淺色主題下 amber-300/90 落 amber-500/10 淡底（合成 #FEF4E5）只有 1.30:1 ——
// 即係「進階」兩個字實際上睇唔到。改用主題 token 後，Light 4.86:1 / Cyber 7.66:1。
export const DIFFICULTY_TIERS: Record<Difficulty, DifficultyTier> = {
  easy: {
    label: '基礎',
    labelEn: 'Foundation',
    badgeClass: 'text-ink-muted bg-surface-sunken border-line-strong',
  },
  medium: {
    label: '進階',
    labelEn: 'Advanced',
    badgeClass: 'text-gold bg-gold/10 border-gold/30',
  },
  hard: {
    // Invisible hardest core: no badge at all.
    label: null,
    labelEn: null,
    badgeClass: '',
  },
}

export function difficultyTier(d: Difficulty): DifficultyTier {
  return DIFFICULTY_TIERS[d]
}
