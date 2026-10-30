import Link from 'next/link'

export default function ModuleFrame({
  title,
  titleEn,
  status,
  statusDetail,
  children,
  actions,
}: {
  title: string
  titleEn?: string
  status?: 'live' | 'partial' | 'unconnected'
  statusDetail?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  const badge =
    status === 'live'
      ? { className: 'fos-badge-ok', label: '已接通' }
      : status === 'partial'
        ? { className: 'fos-badge-warn', label: '部分接通' }
        : status === 'unconnected'
          ? { className: 'fos-badge-ai', label: '未接駁' }
          : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[var(--fos-ink)] md:text-xl">{title}</h1>
          {titleEn && <p className="text-xs text-[var(--fos-muted)]">{titleEn}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {badge && (
            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${badge.className}`} title={statusDetail}>
              {badge.label}
            </span>
          )}
          {actions}
        </div>
      </div>
      {statusDetail && status !== 'live' && (
        <p className="rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-3 py-2 text-sm text-[var(--fos-muted)]">
          {statusDetail}
        </p>
      )}
      {children}
      <p className="text-[10px] text-[var(--fos-faint)]">
        <Link href="/founder" className="text-[var(--fos-cyan)]">
          ← 返回指揮中心
        </Link>
      </p>
    </div>
  )
}
