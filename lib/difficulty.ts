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

/**
 * 「下一題想要邊個層級」選擇器用嘅字（第 3 週 · 引擎五，規格書 §4.6）。
 *
 * 點解唔直接用 DIFFICULTY_TIERS 嘅 label？因為 hard 嘅 label 係 `null` ——
 * 上面嗰句「Invisible hardest core: no badge at all」係刻意設計：最深嗰層
 * 由題目本身講，唔用一個徽章去宣告。呢個決定喺【徽章】上維持不變。
 *
 * 但選擇器係另一回事：學生要主動揀一樣嘢，總要有個名叫得出。
 * 所以 hard 喺呢度用「再深入啲」而唔係「拔尖」—— 佢係一個請求，唔係一個評級，
 * 亦唔會令題目上面出返個徽章。easy／medium 直接沿用徽章嘅字，
 * 免得同一個層級喺兩個地方兩個叫法。
 */
export const TIER_REQUEST_LABELS: Record<Difficulty, { zh: string; en: string }> = {
  easy: { zh: DIFFICULTY_TIERS.easy.label ?? '基礎', en: DIFFICULTY_TIERS.easy.labelEn ?? 'Foundation' },
  medium: { zh: DIFFICULTY_TIERS.medium.label ?? '進階', en: DIFFICULTY_TIERS.medium.labelEn ?? 'Advanced' },
  hard: { zh: '再深入啲', en: 'Go deeper' },
}
