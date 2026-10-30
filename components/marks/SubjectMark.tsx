/**
 * Original subject mark — monogram tile (not emoji).
 * Uses the subject short label so every subject has a stable, product-owned glyph.
 */
import type { SubjectMeta } from '@/data/subjects'

export default function SubjectMark({
  subject,
  size = 'md',
  className = '',
}: {
  subject: Pick<SubjectMeta, 'short' | 'shortEn' | 'accent'> | { short: string; shortEn?: string; accent?: string }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const label = (subject.short || subject.shortEn || '?').slice(0, 2)
  const dim =
    size === 'sm' ? 'h-7 w-7 text-[10px]' : size === 'lg' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs'

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-line-strong bg-surface-sunken font-semibold tracking-tight text-ink ${dim} ${className}`}
    >
      {label}
    </span>
  )
}
