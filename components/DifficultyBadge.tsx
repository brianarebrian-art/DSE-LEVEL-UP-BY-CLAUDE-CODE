import type { Difficulty } from '@/data/questions'
import { difficultyTier } from '@/lib/difficulty'

// Minimal difficulty chip (UI 降噪). HARD renders NOTHING — its difficulty is felt
// through the question itself, not announced. Single render path for every label.
export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const t = difficultyTier(difficulty)
  if (!t.label) return null
  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md border ${t.badgeClass}`}
    >
      {t.label}
    </span>
  )
}
