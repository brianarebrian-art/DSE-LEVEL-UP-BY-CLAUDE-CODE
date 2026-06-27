'use client'

import Link from 'next/link'
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n'

const QC_ITEMS: { zh: string; en: string }[] = [
  { zh: '學術精準度為「生死線」：每題答案與釋義均經人手核對，數理證明 100% 正確。', en: 'Academic precision is the red line: every answer and explanation is hand-verified, and all mathematical proofs are 100% correct.' },
  { zh: '嚴格對標 HKEAA：題型、考核深度與評分準則貼合文憑試標準。', en: 'Strict HKEAA alignment: question types, depth and marking criteria mirror the DSE.' },
  { zh: '雙軌詳解：Path A 標準證明（marking scheme）＋ Path B 名師速解（MC Hack）。', en: 'Dual-path solutions: Path A formal marking scheme plus Path B MC hacks.' },
  { zh: '三層地獄難度：🔥地獄（穩奪 L3–4）/ 💀地獄十八層（衝刺 L5）/ 👁️地獄中之地獄（奪星 5**）。', en: 'Three-tier Hell difficulty: 🔥 HELL (secure L3–4) / 💀 HELL 18 (push for L5) / 👁️ HELL OF HELL (star 5**).' },
  { zh: '零虛構數據：絕不杜撰試題內容、評卷準則或成績統計。', en: 'Zero fabricated data: no invented exam content, marking criteria or statistics.' },
]

export default function AboutPage() {
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'
  const a = t.about

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {a.titlePrefix}<span className="text-amber-400">DSE Level Up</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {a.intro}
          </p>
        </div>

        {/* Story */}
        <div className="space-y-6 text-slate-300 leading-relaxed">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">{a.whyTitle}</h2>
            <p className="text-slate-400 mb-4">
              {a.whyP1}
            </p>
            <p className="text-slate-300 font-medium mb-4">
              {a.whyQuote}
            </p>
            <p className="text-slate-400">
              {a.whyP2}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">{a.methodTitle}</h2>
            <ol className="space-y-3 text-slate-400">
              {a.methodSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-emerald-400" />
              <h2 className="font-bold text-lg">{en ? 'Quality Control Standards' : '品質保證標準'}</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              {en
                ? 'Every question on the platform passes these non-negotiable checks:'
                : '每一條題目，都通過以下不可妥協的把關：'}
            </p>
            <div className="space-y-2.5">
              {QC_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span>{en ? item.en : item.zh}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">{a.promiseTitle}</h2>
            <div className="space-y-2 text-slate-400">
              {a.promises.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span><strong className="text-slate-300">{p.k}</strong>{p.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">{a.contactTitle}</h2>
            <p className="text-slate-400 mb-4">
              {a.contactBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:brianarebrian@gmail.com"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                <Mail size={16} className="text-amber-400" /> brianarebrian@gmail.com
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-500">{a.legalLabel}</strong>
            {a.legalBody}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            {a.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
