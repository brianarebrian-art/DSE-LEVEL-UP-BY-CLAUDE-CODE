/**
 * Original cause marks A / B / C — letter tiles, never emoji.
 */
import type { ReverseCause } from '@/lib/reverseLog'

const TONE: Record<ReverseCause, string> = {
  A: 'bg-violet/15 text-violet border-violet/40',
  B: 'bg-gold/15 text-gold border-gold/40',
  C: 'bg-success/15 text-success border-success/40',
}

export default function CauseMark({
  cause,
  size = 'md',
  className = '',
}: {
  cause: ReverseCause
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dim =
    size === 'sm' ? 'h-7 w-7 text-xs' : size === 'lg' ? 'h-12 w-12 text-lg' : 'h-9 w-9 text-sm'

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border font-semibold ${TONE[cause]} ${dim} ${className}`}
    >
      {cause}
    </span>
  )
}
