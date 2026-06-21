'use client'

import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import { getActiveSubjects } from '@/data/subjects'
import {
  FREE_SESSION_SIZE,
  PREMIUM_SESSION_SIZE,
  FREE_ATTEMPTS_PER_SUBJECT,
  PREMIUM_PRICE_MONTHLY_HKD,
  PREMIUM_PRICE_YEARLY_HKD,
  yearlySavingHkd,
} from '@/lib/entitlements'

export default function UpgradePage() {
  const { t } = useLocale()
  const p = t.premium
  const { isPremium, authEnabled } = usePlan()
  const n = getActiveSubjects().length
  const alreadyPremium = authEnabled && isPremium

  return (
    <div className="min-h-screen px-4 py-14">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sparkles size={14} /> {p.badgePremium}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{p.pageTitle}</h1>
          <p className="text-slate-400 text-lg">{p.pageSubtitle.replace('{n}', String(n))}</p>
        </div>

        {alreadyPremium && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-center text-amber-300 font-medium">
            {p.alreadyPremium}
          </div>
        )}

        {/* Plan comparison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="font-bold text-lg mb-1">{p.freeColTitle}</div>
            <div className="text-2xl font-extrabold mb-4">HK$0</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><Check size={16} className="text-slate-500 shrink-0 mt-0.5" />{p.featSubjectsFree}</li>
              <li className="flex gap-2"><Check size={16} className="text-slate-500 shrink-0 mt-0.5" />{p.featPerRunFree.replace('{n}', String(FREE_SESSION_SIZE))}</li>
              <li className="flex gap-2"><Check size={16} className="text-slate-500 shrink-0 mt-0.5" />{p.featAttemptsFree.replace('{n}', String(FREE_ATTEMPTS_PER_SUBJECT))}</li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-amber-500/10 to-slate-900 border border-amber-500/40 rounded-2xl p-6">
            <div className="font-bold text-lg mb-3 text-amber-400">{p.premiumColTitle}</div>
            <ul className="space-y-2 text-sm text-slate-200 mb-4">
              <li className="flex gap-2"><Check size={16} className="text-amber-400 shrink-0 mt-0.5" />{p.featSubjectsPremium.replace('{n}', String(n))}</li>
              <li className="flex gap-2"><Check size={16} className="text-amber-400 shrink-0 mt-0.5" />{p.featPerRunPremium.replace('{n}', String(PREMIUM_SESSION_SIZE))}</li>
              <li className="flex gap-2"><Check size={16} className="text-amber-400 shrink-0 mt-0.5" />{p.featAttemptsPremium}</li>
            </ul>
            <div className="pt-4 border-t border-slate-700/60">
              <div className="text-xs text-slate-500 mb-2">{p.pickPlan}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-2">
                  <span className="text-sm text-slate-300">{p.monthly}</span>
                  <span className="font-bold">
                    HK${PREMIUM_PRICE_MONTHLY_HKD}
                    <span className="text-xs font-normal text-slate-400">{p.perMonth}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                  <span className="text-sm text-amber-300 flex items-center gap-1.5">
                    {p.yearly}
                    <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded-full">{p.bestValue}</span>
                  </span>
                  <span className="text-right leading-tight">
                    <span className="font-bold">
                      HK${PREMIUM_PRICE_YEARLY_HKD}
                      <span className="text-xs font-normal text-slate-400">{p.perYear}</span>
                    </span>
                    <span className="block text-[10px] text-emerald-400">
                      {p.yearlySave.replace('{save}', String(yearlySavingHkd()))}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="font-bold mb-1">{p.payTitle}</div>
          <p className="text-xs text-slate-500 mb-4">{p.payCurrency}</p>
          <div className="grid grid-cols-3 gap-3">
            {[p.payAlipay, p.payFps, p.payWechat].map((m) => (
              <div
                key={m}
                className="bg-slate-800/60 border border-slate-700 rounded-xl py-3 text-center text-sm text-slate-300"
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Checkout (Stage 2: wired to the PSP) */}
        <div className="text-center">
          {alreadyPremium ? (
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl transition-all"
            >
              {p.backHome}
            </Link>
          ) : (
            <>
              <button
                type="button"
                disabled
                title={p.checkoutSoon}
                className="inline-flex items-center gap-2 bg-amber-500/60 text-black/70 font-bold px-8 py-3 rounded-xl cursor-not-allowed"
              >
                <Sparkles size={16} /> {p.checkout}
              </button>
              <p className="text-xs text-slate-500 mt-3">{p.checkoutSoon}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
