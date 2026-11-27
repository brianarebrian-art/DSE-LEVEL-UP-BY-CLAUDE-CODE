import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

const buttonBase =
  'inline-flex min-h-11 select-none items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium touch-manipulation transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:scale-[0.98]'

const buttonVariant = {
  primary: 'bg-accent text-on-accent [@media(hover:hover)]:hover:bg-accent-hover',
  secondary: 'border border-line-strong bg-surface-raised text-ink [@media(hover:hover)]:hover:bg-surface-sunken',
  warning: 'bg-warning text-on-warning [@media(hover:hover)]:hover:bg-warning-strong',
  quiet: 'bg-transparent text-ink underline-offset-4 [@media(hover:hover)]:hover:underline',
} as const

export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariant }) {
  return <button type={type} className={cx(buttonBase, buttonVariant[variant], className)} {...props} />
}

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink">
      {children}
    </label>
  )
}

const controlClass =
  'w-full min-h-11 rounded-lg border border-line-strong bg-surface-raised px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(controlClass, props.className)} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(controlClass, 'min-h-28 py-2', props.className)} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(controlClass, props.className)} />
}

export function Disclaimer() {
  return (
    <p className="mx-auto max-w-6xl px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs leading-5 text-ink-muted">
      © DSE Level Up 2026. Not affiliated with HKEAA. All questions are independently rewritten for educational purposes.
      與考評局無從屬關係。研究頁面嘅數字由呢部瀏覽器入面嘅示範回覆計出，唔係考評局數據。
    </p>
  )
}

export function LoadingState({ exitHref }: { exitHref?: string }) {
  return (
    <div role="status" className="rounded-2xl border border-line bg-surface-raised p-6">
      <p className="text-base font-medium text-ink">正在讀取呢部瀏覽器入面嘅研究資料</p>
      <div className="mt-4 space-y-2" aria-hidden="true">
        <div className="h-3 w-2/3 rounded bg-surface-sunken motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-3 w-full rounded bg-surface-sunken motion-safe:animate-pulse motion-reduce:animate-none" />
        <div className="h-3 w-1/2 rounded bg-surface-sunken motion-safe:animate-pulse motion-reduce:animate-none" />
      </div>
      {exitHref ? (
        <a href={exitHref} className="mt-4 inline-flex min-h-11 items-center text-sm text-accent underline-offset-4 hover:underline">
          返回研究設定
        </a>
      ) : null}
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-surface-raised p-6">
      <h2 className="text-lg font-semibold text-ink">未有可以顯示嘅研究資料</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        示範問卷同回覆仍然留喺呢部瀏覽器。呢個係設定入面嘅空白預覽，冇刪走任何資料。
      </p>
      <a href="/research/admin/settings" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-accent underline-offset-4 hover:underline">
        返回研究設定
      </a>
    </div>
  )
}

export function ErrorState({ onRetry, onRestore }: { onRetry: () => void; onRestore: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-warning bg-surface-raised p-6">
      <h2 className="text-lg font-semibold text-ink">讀取研究資料時出錯</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        可以再試一次。如果資料壞咗，還原示範數據會覆寫呢部瀏覽器入面嘅研究問卷，唔會影響學生練習。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={onRetry}>再試</Button>
        <Button variant="warning" onClick={onRestore}>還原示範數據</Button>
      </div>
    </div>
  )
}

export function Panel({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface-raised p-4 sm:p-5">
      {title || action ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title ? <h2 className="text-base font-semibold text-ink">{title}</h2> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}
