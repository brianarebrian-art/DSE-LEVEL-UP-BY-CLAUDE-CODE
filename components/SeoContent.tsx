import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react'

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="麵包屑導覽" className="mb-8 text-sm text-ink-muted"><ol className="flex flex-wrap items-center gap-2">{items.map((item, i) => <li key={item.label} className="flex items-center gap-2">{i > 0 && <span aria-hidden="true">/</span>}{item.href ? <Link className="underline underline-offset-4 hover:text-accent" href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
}

export function RelatedLinks({ links }: { links: { href: string; title: string; description: string }[] }) {
  return <section aria-labelledby="related-heading" className="mt-14 border-t border-line pt-10"><h2 id="related-heading" className="mb-5 text-2xl font-medium text-ink">相關學習內容</h2><div className="grid gap-4 sm:grid-cols-2">{links.map((link) => <Link key={link.href} href={link.href} className="group rounded-2xl border border-line bg-surface-raised p-5 transition hover:border-accent"><BookOpen className="mb-4 text-accent" aria-hidden="true" /><h3 className="mb-2 font-medium text-ink group-hover:text-accent">{link.title}</h3><p className="text-sm leading-6 text-ink-muted">{link.description}</p></Link>)}</div></section>
}

export function SeoPageShell({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs: { label: string; href?: string }[] }) {
  return <main id="main-content"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16"><Breadcrumbs items={breadcrumbs} />{children}</div></main>
}

export function CtaBand({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <section className="mt-14 rounded-3xl bg-accent-strong p-7 text-on-accent sm:p-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-medium">{children}</h2><p className="mt-2 text-sm opacity-90">免費使用，按自己的節奏溫習。</p></div><Link href={href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-surface-raised px-5 font-medium text-ink hover:bg-surface-sunken">{label}<ArrowRight aria-hidden="true" /></Link></div></section>
}

export function ConceptList({ items }: { items: string[] }) { return <ul className="grid gap-3 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex gap-3 rounded-xl bg-surface-sunken p-4 text-ink-soft"><CheckCircle2 className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{item}</li>)}</ul> }
