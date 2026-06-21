'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import MathText from '@/components/MathText'
import { useT } from '@/lib/i18n'

// Language-neutral emoji per framework, zipped by index with the translated copy
// in t.methodology.frameworks. (Examples span Maths, Chemistry, Biology, Economics.)
const fwEmojis = ['🔄', '⚗️', '🧬', '📈']

export default function MethodologyPage() {
  const t = useT()
  const m = t.methodology

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6 text-sm text-amber-300">
            {m.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {m.title1}
            <br />
            <span className="text-amber-400">{m.title2}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {m.intro}
          </p>
        </div>

        {/* The core insight */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold mb-4">{m.insightTitle}</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            {m.insightP1Pre}<strong className="text-amber-400">{m.insightP1Strong}</strong>{m.insightP1Post}
          </p>
          <p className="text-slate-400 text-sm">
            {m.insightP2}
          </p>
        </div>

        {/* 4 Frameworks */}
        <h2 className="text-2xl font-bold mb-8">{m.fwSectionTitle}</h2>

        <div className="space-y-10">
          {m.frameworks.map((f, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {/* Framework header */}
              <div className="border-b border-slate-800 px-6 py-5 flex items-center gap-4">
                <span className="text-3xl">{fwEmojis[i]}</span>
                <div>
                  <h3 className="text-lg font-bold">{f.name}</h3>
                  <p className="text-slate-400 text-sm">{f.tagline}</p>
                </div>
                <div className="ml-auto hidden sm:flex gap-2 flex-wrap justify-end">
                  {f.topics.map((tp) => (
                    <span key={tp} className="text-xs text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 text-slate-400 text-sm leading-relaxed border-b border-slate-800/50">
                {f.description}
              </div>

              {/* 3-column breakdown */}
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {/* Official */}
                <div className="p-5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">{m.officialLabel}</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    <MathText>{f.content}</MathText>
                  </p>
                  <div className="text-xs text-slate-600">
                    {m.answerLabel}<MathText>{f.answer}</MathText>
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-5 bg-amber-500/5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">{m.analysisLabel}</div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <MathText>{f.analysis}</MathText>
                  </p>
                </div>

                {/* Rewritten */}
                <div className="p-5 bg-green-500/5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">{m.rewrittenLabel}</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    <MathText>{f.rwContent}</MathText>
                  </p>
                  <div className="text-xs text-slate-600 mb-4">
                    {m.answerLabel}<MathText>{f.rwAnswer}</MathText>
                  </div>
                  <Link
                    href="/practice"
                    className="text-xs text-green-400 bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 px-3 py-1.5 rounded-lg transition-all inline-block"
                  >
                    {m.practiseSimilar}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{m.ctaTitle}</h2>
          <p className="text-slate-500 mb-6">{m.ctaSub}</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl transition-all"
          >
            {m.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
