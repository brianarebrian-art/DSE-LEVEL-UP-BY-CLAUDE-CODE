export default function AdSlot({ className = '' }: { className?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className={`flex min-h-24 w-full items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface-sunken/60 px-4 py-3 text-center text-xs text-ink-muted ${className}`} 
    >
      <span>贊助位置 · Sponsored space</span>
    </aside>
  )
}
