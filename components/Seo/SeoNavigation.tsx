import Link from 'next/link'
import { breadcrumbJsonLd } from '@/lib/seo'

type Crumb = { name: string; path: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="麵包屑導覽" className="mx-auto max-w-5xl px-4 pt-6 text-sm text-ink-muted">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link className="underline underline-offset-4 hover:text-accent" href={item.path}>{item.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }} />
    </>
  )
}

export function InternalLinkCard({ href, title, description }: { href: string; title: string; description: string }) {
  return <Link href={href} className="group block rounded-2xl border border-line bg-surface-raised p-5 transition hover:border-accent hover:shadow-sm">
    <h3 className="font-medium text-ink group-hover:text-accent">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
  </Link>
}

export function RelatedTopics({ topics }: { topics: Array<{ href: string; title: string; description: string }> }) {
  return <section aria-labelledby="related-topics" className="mx-auto max-w-5xl px-4 py-10">
    <h2 id="related-topics" className="mb-4 text-2xl font-medium text-ink">相關學習內容</h2>
    <div className="grid gap-4 sm:grid-cols-3">{topics.map((topic) => <InternalLinkCard key={topic.href} {...topic} />)}</div>
  </section>
}

export function NextPrevChapter({ previous, next }: { previous?: Crumb; next?: Crumb }) {
  return <nav aria-label="章節導覽" className="mx-auto flex max-w-5xl justify-between gap-4 px-4 py-8 text-sm">
    {previous ? <Link href={previous.path} className="max-w-[45%] underline underline-offset-4">← {previous.name}</Link> : <span />}
    {next ? <Link href={next.path} className="max-w-[45%] text-right underline underline-offset-4">{next.name} →</Link> : <span />}
  </nav>
}

export function RelatedPastPapers({ href = '/subjects' }: { href?: string }) {
  return <section className="mx-auto max-w-5xl px-4 py-8"><div className="rounded-2xl bg-surface-sunken p-6"><h2 className="text-xl font-medium text-ink">延伸做 Past Paper</h2><p className="mt-2 text-ink-muted">把剛學的概念放入限時題目，檢查自己是否能在考試語境中應用。</p><Link href={href} className="mt-4 inline-flex font-medium text-accent underline underline-offset-4">查看 DSE 科目與練習</Link></div></section>
}
