'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { TONE_DRILLS, SOUND_RULES, TRAPS, PRACTICE_STEPS } from '@/data/cantoneseLearn'

// 「點樣學廣東話」嘅呈現層。內容正本喺 data/cantoneseLearn.ts。

export default function LearnView() {
  const { t, locale } = useLocale()
  const c = t.cantonese
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-2xl">
        <nav
          aria-label={c.courseShort}
          className="mb-3 flex flex-wrap items-center gap-1 text-sm text-ink-muted"
        >
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span aria-hidden>/</span>
          <Link href="/cantonese" className="hover:text-accent">{c.courseShort}</Link>
          <span aria-hidden>/</span>
          <span className="text-ink-soft">{c.learnHubTitle}</span>
        </nav>

        <h1 className="text-2xl font-medium text-ink">{c.learnHubTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{c.learnHubLead}</p>

        {/* ── 六個聲調 ──
            擺第一，因為聲調係唯一一樣「讀錯就變咗另一個字」嘅嘢。
            一組同音節不同調嘅字擺埋一齊，係最快聽得出分別嘅方法 ——
            逐個孤立咁讀，永遠聽唔出 si1 同 si3 有乜分別。 */}
        <section className="mt-8">
          <h2 className="text-lg font-medium text-ink">{c.tonesTitle}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.tonesLead}</p>
          <div className="mt-4 space-y-4">
            {TONE_DRILLS.map((d) => (
              <div key={d.syllable} className="rounded-xl border border-line bg-surface-raised p-4">
                <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {d.syllable} 1–6
                </p>
                <ul className="mt-2 space-y-1.5">
                  {d.words.map((w) => (
                    <li key={w.jyut} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
                      <span className="w-5 shrink-0 font-mono text-xs text-ink-muted">{w.tone}</span>
                      <span className="text-base font-medium text-ink">{w.zh}</span>
                      <span className="font-mono text-xs tracking-tight text-accent">{w.jyut}</span>
                      <span className="text-ink-muted">{en ? w.meaningEn : w.meaningZh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── 對應規律 ──
            對一個識普通話嘅人嚟講，呢一節係全站最高槓桿嘅嘢：
            一條規律一次過解鎖幾百個字，比逐個詞背快好多。
            每條都要寫例外 —— 一條扮到冇例外嘅規律，學生一撞到例外
            就會覺得成套嘢唔可信。 */}
        <section className="mt-10">
          <h2 className="text-lg font-medium text-ink">{c.rulesTitle}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.rulesLead}</p>
          <div className="mt-4 space-y-4">
            {SOUND_RULES.map((r) => (
              <div key={r.titleZh} className="rounded-xl border border-line bg-surface-raised p-4 sm:p-5">
                <h3 className="text-base font-medium text-ink">{en ? r.titleEn : r.titleZh}</h3>
                <dl className="mt-3 space-y-1.5 text-sm leading-relaxed">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-medium text-ink-muted">{c.rulesFrom}</dt>
                    <dd className="text-ink-soft">{en ? r.fromEn : r.fromZh}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-medium text-ink-muted">{c.rulesTo}</dt>
                    <dd className="text-ink-soft">{en ? r.toEn : r.toZh}</dd>
                  </div>
                </dl>
                <ul className="mt-3 space-y-1">
                  {r.examples.map((ex) => (
                    <li key={ex.jyut} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                      <span className="font-medium text-ink">{ex.zh}</span>
                      <span className="text-ink-muted">{ex.pu}</span>
                      <span aria-hidden className="text-ink-muted">→</span>
                      <span className="font-mono text-xs tracking-tight text-accent">{ex.jyut}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-l-2 border-line pl-3 text-xs leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink-soft">{c.rulesException}</span>
                  <span aria-hidden> · </span>
                  {en ? r.exceptionEn : r.exceptionZh}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 陷阱 ── */}
        <section className="mt-10">
          <h2 className="text-lg font-medium text-ink">{c.trapsTitle}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{c.trapsLead}</p>
          <div className="mt-4 space-y-3">
            {TRAPS.map((tp) => (
              <div key={tp.titleZh} className="rounded-xl border border-line bg-surface-raised p-4">
                <h3 className="text-base font-medium text-ink">{en ? tp.titleEn : tp.titleZh}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {en ? tp.bodyEn : tp.bodyZh}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 每日五分鐘 ──
            唔寫「多聽多講」呢種講咗等於冇講嘅嘢。每步都要做得到、
            而且做完知道自己做咗。 */}
        <section className="mt-10 rounded-xl border border-line bg-surface-sunken p-4 sm:p-5">
          <h2 className="text-lg font-medium text-ink">{c.practiceTitle}</h2>
          <ol className="mt-3 space-y-2.5">
            {PRACTICE_STEPS.map((s, i) => (
              <li key={s.zh} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <span aria-hidden className="shrink-0 font-mono text-xs text-ink-muted">
                  {i + 1}
                </span>
                <span>{en ? s.en : s.zh}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 text-xs leading-relaxed text-ink-muted">{c.disclaimer}</p>

        <Link
          href="/cantonese"
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowLeft size={15} className="text-ink-muted" aria-hidden />
          {c.back}
        </Link>
      </div>
    </div>
  )
}
