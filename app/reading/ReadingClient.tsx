'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpenCheck, CheckCircle, XCircle, Brain } from 'lucide-react'
import { readingPassages } from '@/data/reading'
import { useLocale } from '@/lib/i18n'

// Light-first migration (Kate/Leo 2026-07-21, task #97): 清晨圖書館 palette.
// English accent = purple #7C3AED; part badge gold #B8860B; correct = teal #008B84,
// wrong = rose #C2185B (never 鮮紅). Weight 400/500 only.

const LETTERS = ['A', 'B', 'C', 'D']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Prepared {
  key: string
  options: { text: string; correct: boolean }[]
}

export default function ReadingClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, eng: string) => (en ? eng : zh)

  // Shuffle each question's options once (correct answer is options[0] in the data).
  const prepared = useMemo<Record<string, Prepared['options']>>(() => {
    const map: Record<string, Prepared['options']> = {}
    for (const p of readingPassages) {
      p.questions.forEach((q, i) => {
        map[`${p.id}-${i}`] = shuffle(q.options.map((text, idx) => ({ text, correct: idx === 0 })))
      })
    }
    return map
  }, [])

  // Which option text the student picked, per question key.
  const [picked, setPicked] = useState<Record<string, string>>({})

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-violet bg-violet/[0.08] border border-violet/25 px-3 py-1 rounded-full mb-3">
            <BookOpenCheck size={13} /> {tr('英文卷一・閱讀理解', 'English Paper 1 · Reading')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-ink mb-2">
            {tr('原創平行對齊閱讀篇章', 'Original Parallel Reading Passages')}
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            {tr(
              '三篇 100% 原創篇章，主題、句式與底層考核技能平行對齊 DSE 卷一甲／乙部（非官方試題複本）。',
              'Three 100%-original passages, parallel-aligned to the underlying skills of DSE Paper 1 Parts A & B — not reproductions of any HKEAA text.',
            )}
          </p>
        </div>

        <div className="space-y-8">
          {readingPassages.map((p) => (
            <article key={p.id} className="bg-surface-raised border border-line rounded-2xl p-6 sm:p-8">
              {/* Passage meta */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[11px] font-medium text-gold bg-gold/[0.08] border border-gold/25 px-2.5 py-0.5 rounded-full">
                  {tr(p.partZh, p.part)}
                </span>
                <span className="text-[11px] font-medium text-violet bg-violet/[0.08] border border-violet/25 px-2.5 py-0.5 rounded-full">
                  🎯 {tr(p.skillZh, p.skill)}
                </span>
              </div>
              <h2 className="text-xl font-medium text-ink mb-4">{p.title}</h2>

              {/* Passage body */}
              <div className="space-y-3 text-[15px] leading-relaxed text-ink-soft mb-7 border-l-2 border-line-strong pl-4">
                {p.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {p.questions.map((q, qi) => {
                  const key = `${p.id}-${qi}`
                  const opts = prepared[key]
                  const chosen = picked[key]
                  const answered = chosen !== undefined
                  return (
                    <div key={key} className="border-t border-line pt-5">
                      <p className="font-medium text-ink mb-3 text-sm sm:text-base">
                        <span className="text-violet mr-1">{qi + 1}.</span> {q.q}
                      </p>
                      <div className="space-y-2">
                        {opts.map((opt, oi) => {
                          let style = 'border-line-strong bg-surface-raised hover:bg-surface-sunken cursor-pointer'
                          if (answered) {
                            if (opt.correct) style = 'border-accent bg-accent/[0.10]'
                            else if (opt.text === chosen) style = 'border-rose bg-rose/[0.10]'
                            else style = 'border-line bg-surface-sunken opacity-60'
                          }
                          return (
                            <button
                              key={oi}
                              disabled={answered}
                              onClick={() => setPicked((s) => ({ ...s, [key]: opt.text }))}
                              className={`w-full text-left flex items-start gap-3 border rounded-xl px-4 py-2.5 transition-all ${style}`}
                            >
                              <span className="shrink-0 w-6 h-6 rounded-md bg-surface-sunken flex items-center justify-center text-xs font-medium text-ink-muted mt-0.5">
                                {LETTERS[oi]}
                              </span>
                              <span className="text-sm leading-relaxed text-ink-soft">{opt.text}</span>
                              {answered && opt.correct && <CheckCircle size={16} className="text-accent ml-auto shrink-0 mt-1" />}
                              {answered && !opt.correct && opt.text === chosen && <XCircle size={16} className="text-rose ml-auto shrink-0 mt-1" />}
                            </button>
                          )
                        })}
                      </div>

                      {answered && (
                        <div className="mt-3 rounded-xl p-4 bg-gold/[0.08] border border-gold/25 animate-slide-up">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain size={15} className="text-gold" />
                            <span className="text-gold font-medium text-xs">
                              {tr('解析 · 干擾項致命剖析', 'Explanation · Distractor autopsy')}
                            </span>
                          </div>
                          <p className="text-sm text-ink-soft leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="no-print mt-8">
          <Link href="/subjects/english" className="text-violet hover:text-violet-strong text-sm inline-flex items-center gap-1">
            {tr('← 返回英文科', '← Back to English')}
          </Link>
        </div>
      </div>
    </div>
  )
}
