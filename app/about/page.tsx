'use client'

import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { useT } from '@/lib/i18n'

export default function AboutPage() {
  const t = useT()
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
                href="mailto:dselevelup@gmail.com"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                <Mail size={16} className="text-amber-400" /> dselevelup@gmail.com
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
