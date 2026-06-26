'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpenCheck, CheckCircle, XCircle, Brain } from 'lucide-react'
import { readingPassages } from '@/data/reading'
import { useLocale } from '@/lib/i18n'

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

export default function ReadingPage() {
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
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full mb-3">
            <BookOpenCheck size={13} /> {tr('英文卷一・閱讀理解', 'English Paper 1 · Reading')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {tr('原創平行對齊閱讀篇章', 'Original Parallel Reading Passages')}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {tr(
              '三篇 100% 原創篇章，主題、句式與底層考核技能平行對齊 DSE 卷一甲／乙部（非官方試題複本）。',
              'Three 100%-original passages, parallel-aligned to the underlying skills of DSE Paper 1 Parts A & B — not reproductions of any HKEAA text.',
            )}
          </p>
        </div>

        <div className="space-y-8">
          {readingPassages.map((p) => (
            <article key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
              {/* Passage meta */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
                  {tr(p.partZh, p.part)}
                </span>
                <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-full">
                  🎯 {tr(p.skillZh, p.skill)}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-100 mb-4">{p.title}</h2>

              {/* Passage body */}
              <div className="space-y-3 text-[15px] leading-relaxed text-slate-300 mb-7 border-l-2 border-slate-700 pl-4">
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
                    <div key={key} className="border-t border-slate-800 pt-5">
                      <p className="font-semibold text-slate-100 mb-3 text-sm sm:text-base">
                        <span className="text-indigo-300 mr-1">{qi + 1}.</span> {q.q}
                      </p>
                      <div className="space-y-2">
                        {opts.map((opt, oi) => {
                          let style = 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer'
                          if (answered) {
                            if (opt.correct) style = 'border-green-500 bg-green-500/10'
                            else if (opt.text === chosen) style = 'border-red-500 bg-red-500/10'
                            else style = 'border-slate-800 bg-slate-800/30 opacity-50'
                          }
                          return (
                            <button
                              key={oi}
                              disabled={answered}
                              onClick={() => setPicked((s) => ({ ...s, [key]: opt.text }))}
                              className={`w-full text-left flex items-start gap-3 border rounded-xl px-4 py-2.5 transition-all ${style}`}
                            >
                              <span className="shrink-0 w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 mt-0.5">
                                {LETTERS[oi]}
                              </span>
                              <span className="text-sm leading-relaxed">{opt.text}</span>
                              {answered && opt.correct && <CheckCircle size={16} className="text-green-400 ml-auto shrink-0 mt-1" />}
                              {answered && !opt.correct && opt.text === chosen && <XCircle size={16} className="text-red-400 ml-auto shrink-0 mt-1" />}
                            </button>
                          )
                        })}
                      </div>

                      {answered && (
                        <div className="mt-3 rounded-xl p-4 bg-amber-500/10 border border-amber-500/25 animate-slide-up">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain size={15} className="text-amber-400" />
                            <span className="text-amber-300 font-semibold text-xs">
                              {tr('解析 · 干擾項致命剖析', 'Explanation · Distractor autopsy')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
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
          <Link href="/subjects/english" className="text-indigo-300 hover:text-indigo-200 text-sm inline-flex items-center gap-1">
            {tr('← 返回英文科', '← Back to English')}
          </Link>
        </div>
      </div>
    </div>
  )
}
