import type { Difficulty } from '@/data/questions'
import { hellTier } from '@/lib/difficulty'

// V1.0 Hell-Mode difficulty badge. Single render path for every difficulty label
// in the app — sources its text/target/styling from lib/difficulty.ts so the
// schema stays in one place. The "閃爍" is a smooth pulse / neon breathe (see the
// hell-pulse / hell-neon keyframes in globals.css), NOT a photosensitive strobe.
export default function DifficultyBadge({
  difficulty,
  locale = 'zh',
  showTarget = true,
}: {
  difficulty: Difficulty
  locale?: 'zh' | 'en'
  showTarget?: boolean
}) {
  const t = hellTier(difficulty)
  return (
    <span
      className={`hell-badge inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-md border ${t.badgeClass} ${t.anim}`}
    >
      <span className="text-sm leading-none">{t.emoji}</span>
      <span>{t.en}</span>
      <span className="font-bold tracking-normal">{t.zh}</span>
      {showTarget && (
        <span className="ml-0.5 font-semibold normal-case opacity-70">
          · {locale === 'en' ? t.targetEn : t.target}
        </span>
      )}
    </span>
  )
}
