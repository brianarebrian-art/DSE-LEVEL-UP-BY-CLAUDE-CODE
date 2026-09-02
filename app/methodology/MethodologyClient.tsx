'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'

// Language-neutral emoji per framework, zipped by index with the translated copy
// in t.methodology.frameworks. (Examples span Maths, Chemistry, Biology, Economics.)
const fwEmojis = ['🔄', '⚗️', '🧬', '📈']

export default function MethodologyClient() {
  const { t, locale } = useLocale()
  const m = t.methodology
  const en = locale === 'en'
  // Frameworks are collapsible (accordion) to cut the page's text density; the
  // first one is open by default so the page never looks empty.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-surface-sunken border border-gold/20 rounded-full px-4 py-2 mb-6 text-sm text-gold">
            {m.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mb-4 text-ink">
            {m.title1}
            <br />
            <span className="text-accent">{m.title2}</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto leading-relaxed">
            {m.intro}
          </p>
        </div>

        {/* The core insight */}
        <div className="bg-surface-sunken border border-gold/20 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-medium mb-4 text-ink">{m.insightTitle}</h2>
          <p className="text-ink-soft leading-relaxed mb-4">
            {m.insightP1Pre}<strong className="text-gold">{m.insightP1Strong}</strong>{m.insightP1Post}
          </p>
          <p className="text-ink-muted text-sm">
            {m.insightP2}
          </p>
        </div>

        {/* 4 Frameworks */}
        <h2 className="text-2xl font-medium mb-3 text-ink">{m.fwSectionTitle}</h2>

        {/* Methodology flow — how every framework gets turned into practice */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {[
            { icon: '📄', label: m.officialLabel },
            { icon: '🔍', label: m.analysisLabel },
            { icon: '✍️', label: m.rewrittenLabel },
            { icon: '🎯', label: en ? 'Your turn' : '你嚟做' },
          ].map((step, i, arr) => (
            <Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5 w-20 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-raised border border-line-strong grid place-items-center text-xl">
                  {step.icon}
                </div>
                <span className="text-[11px] text-ink-muted leading-tight">{step.label}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight className="text-ink-muted shrink-0" size={16} />}
            </Fragment>
          ))}
        </div>

        <div className="space-y-4">
          {m.frameworks.map((f, i) => {
            const isOpen = open.has(i)
            return (
              <div key={i} className="bg-surface-raised border border-line rounded-2xl overflow-hidden">
                {/* Framework header — click to expand/collapse */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-surface-sunken border border-gold/40 transition-colors"
                >
                  <span className="text-3xl">{fwEmojis[i]}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-ink">{f.name}</h3>
                    <p className="text-ink-muted text-sm">{f.tagline}</p>
                  </div>
                  <div className="ml-auto hidden md:flex gap-2 flex-wrap justify-end max-w-[40%]">
                    {f.topics.map((tp) => (
                      <span key={tp} className="text-xs text-gold bg-surface-sunken px-2 py-0.5 rounded-full">
                        {tp}
                      </span>
                    ))}
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-ink-muted shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <>
                    {/* Description */}
                    <div className="px-6 py-4 text-ink-muted text-sm leading-relaxed border-y border-line">
                      {f.description}
                    </div>

                    {/* 3-column breakdown */}
                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
                      {/* Official */}
                      <div className="p-5">
                        <div className="text-xs text-ink-muted uppercase tracking-wide mb-3 font-medium">{m.officialLabel}</div>
                        <p className="text-ink-soft text-sm leading-relaxed mb-3">
                          <MathText>{f.content}</MathText>
                        </p>
                        <div className="text-xs text-ink-muted">
                          {m.answerLabel}<MathText>{f.answer}</MathText>
                        </div>
                      </div>

                      {/* Analysis */}
                      <div className="p-5 bg-gold/[0.05]">
                        <div className="text-xs text-ink-muted uppercase tracking-wide mb-3 font-medium">{m.analysisLabel}</div>
                        <p className="text-ink-muted text-sm leading-relaxed">
                          <MathText>{f.analysis}</MathText>
                        </p>
                      </div>

                      {/* Rewritten */}
                      <div className="p-5 bg-accent/[0.05]">
                        <div className="text-xs text-ink-muted uppercase tracking-wide mb-3 font-medium">{m.rewrittenLabel}</div>
                        <p className="text-ink-soft text-sm leading-relaxed mb-3">
                          <MathText>{f.rwContent}</MathText>
                        </p>
                        <div className="text-xs text-ink-muted mb-4">
                          {m.answerLabel}<MathText>{f.rwAnswer}</MathText>
                        </div>
                        <Link
                          href="/practice"
                          className="text-xs text-accent bg-surface-sunken hover:bg-surface-raised border border-accent/20 px-3 py-1.5 rounded-lg transition-all inline-block"
                        >
                          {m.practiseSimilar}
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* 誠實披露：書寫題永不機器批改，自評唔計入任何數字。
            擺喺 CTA 之前 —— 學生撳去練習之前就應該知呢件事，而唔係做完先發現。 */}
        <div className="mt-16 rounded-2xl border border-line bg-surface-sunken p-6">
          <h2 className="text-base font-medium text-ink mb-2">
            ✍️ {locale === 'en' ? 'About written questions' : '關於書寫題'}
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            {locale === 'en'
              ? 'Short answers and long/structured responses are never machine-marked. After you submit, we reveal a reference answer (and a marking scheme for long questions) and you mark yourself on a three-level scale. Your self-assessment is yours alone — it does not feed the accuracy figure and does not move the predicted grade. Those two numbers come from multiple-choice answers only, so they stay honest.'
              : '短答題同長題／結構式題永遠唔會由機器批改。你交卷之後，我哋攤開參考答案（長題另有評分準則），由你自己三級自評。你嘅自評淨係你自己嘅事 —— 唔會計入準確率，亦唔會郁到等級預測。嗰兩個數字只由選擇題得出，咁先誠實。'}
          </p>
        </div>

        {/* 適用範圍與限制 —— 信譽審核明確要求：「/methodology 不應只解釋『為何有效』，
            更要解釋『在哪些情況未必有效』。」

            一版只講自己方法幾好嘅方法論頁，讀落同宣傳單張冇分別。老師同家長評估
            一個平台嗰陣，最想知嘅正正係「佢做唔到啲乜」—— 因為肯講嗰啲，先信得過
            佢講做得到嘅嘢。 */}
        <div className="mt-16 rounded-2xl border border-line bg-surface-raised p-6">
          <h2 className="text-base font-medium text-ink mb-3">
            🎯 {locale === 'en' ? 'What this method does and does not cover' : '呢套方法涵蓋到咩、涵蓋唔到咩'}
          </h2>

          <p className="text-sm text-ink-soft leading-relaxed mb-4">
            {locale === 'en' ? 'Rewritten MC practice trains a specific and narrow set of things well:' : '改寫 MC 練習訓練到嘅嘢好specific，亦都好窄：'}
          </p>
          <ul className="text-sm text-ink-muted leading-relaxed space-y-1.5 list-disc pl-5 mb-5">
            <li>{locale === 'en' ? 'Recognising a question type fast, and knowing which method it wants' : '快速認出題型，知道佢想你用邊個方法'}</li>
            <li>{locale === 'en' ? 'Spotting the trap wording that distinguishes near-identical options' : '睇穿分辨相近選項嗰個陷阱字眼'}</li>
            <li>{locale === 'en' ? 'Getting the arithmetic right under time pressure' : '喺時間壓力下計得啱'}</li>
            <li>{locale === 'en' ? 'Finding out which concepts you only think you understand' : '搵出邊啲概念你只係以為自己識'}</li>
          </ul>

          <p className="text-sm text-ink-soft leading-relaxed mb-4">
            {locale === 'en' ? 'It does not train these at all, and no amount of MC practice will:' : '佢完全訓練唔到以下呢啲，而且做幾多 MC 都訓練唔到：'}
          </p>
          <ul className="text-sm text-ink-muted leading-relaxed space-y-1.5 list-disc pl-5 mb-5">
            <li>
              {locale === 'en'
                ? 'Building an argument across several paragraphs — essays, DBQ answers, extended responses'
                : '喺幾段之內砌一個論證 —— 作文、資料題長答、論述題'}
            </li>
            <li>{locale === 'en' ? 'Speaking: fluency, turn-taking, responding to what someone just said' : '口試：流暢度、輪流發言、接住對方啱啱講嗰句'}</li>
            <li>{locale === 'en' ? 'Practical and lab work, fieldwork, and coursework' : '實驗、實地考察同校本評核'}</li>
            <li>{locale === 'en' ? 'Handwriting speed and managing a three-hour paper' : '寫字速度，同埋捱三個鐘一份卷嘅節奏'}</li>
          </ul>

          <p className="text-sm text-ink-soft leading-relaxed mb-2">
            {locale === 'en' ? 'So for those, use something else:' : '所以嗰啲要用第二啲方法：'}
          </p>
          <ul className="text-sm text-ink-muted leading-relaxed space-y-1.5 list-disc pl-5 mb-5">
            <li>
              {locale === 'en'
                ? 'Written papers: write full answers by hand, timed, then compare against a marking scheme — a teacher or a study partner reading it is worth more than any tool.'
                : '書寫卷：計時、手寫足本答案，之後對評分準則。搵老師或者同學睇一睇，價值高過任何工具。'}
            </li>
            <li>
              {locale === 'en'
                ? 'Speaking: practise out loud with other people. There is no substitute.'
                : '口試：同真人出聲練。冇替代品。'}
            </li>
            <li>
              {locale === 'en'
                ? 'Past papers: the HKEAA’s own papers are the real thing. We are practice between them, not a replacement for them.'
                : '歷屆試題：考評局自己嗰啲先係真嘢。我哋係佢哋之間嘅練習，唔係佢哋嘅替代品。'}
            </li>
          </ul>

          <p className="text-sm text-ink-soft leading-relaxed border-t border-line pt-4">
            {locale === 'en'
              ? 'And on the human/AI line: AI drafts and classifies; a person decides what goes live. Today 1.83% of live questions carry a named line-by-line approval record — we show that figure on every question rather than rounding it up.'
              : '至於人同 AI 嘅分工：AI 出初稿同分類，出唔出街由人決定。今日 live 題目入面有 1.83% 帶實名逐題審批紀錄 —— 我哋喺每條題目下面照寫呢個數，唔會四捨五入上去。'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-medium mb-4 text-ink">{m.ctaTitle}</h2>
          <p className="text-ink-muted mb-6">{m.ctaSub}</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-8 py-4 rounded-xl transition-all"
          >
            {m.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
