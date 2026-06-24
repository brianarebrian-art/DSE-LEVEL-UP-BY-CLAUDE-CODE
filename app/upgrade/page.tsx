'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, MessageCircle, QrCode } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import { getActiveSubjects } from '@/data/subjects'
import {
  FREE_SESSION_SIZE,
  PREMIUM_SESSION_SIZE,
  FREE_ATTEMPTS_TOTAL,
  PREMIUM_PRICE_MONTHLY_HKD,
  PREMIUM_PRICE_YEARLY_HKD,
  yearlySavingHkd,
} from '@/lib/entitlements'
import { PAYMENT } from '@/lib/payment'

export default function UpgradePage() {
  const { t } = useLocale()
  const p = t.premium
  const { isPremium, authEnabled } = usePlan()
  const n = getActiveSubjects().length
  const alreadyPremium = authEnabled && isPremium
  const [qrOpen, setQrOpen] = useState<{ label: string; qr: string } | null>(null)

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
              <li className="flex gap-2"><Check size={16} className="text-slate-500 shrink-0 mt-0.5" />{p.featAttemptsFree.replace('{n}', String(FREE_ATTEMPTS_TOTAL))}</li>
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

        {/* Manual payment (Plan A — no automated checkout) */}
        {alreadyPremium ? (
          <div className="text-center">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl transition-all"
            >
              {p.backHome}
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="font-bold mb-1">{p.payHowTitle}</div>
            <p className="text-xs text-slate-500 mb-4">{p.payCurrency}</p>

            {/* Payee */}
            <div className="flex items-center justify-between gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm mb-3">
              <span className="text-slate-400 shrink-0">{p.payee}</span>
              <span className="text-slate-100 font-medium">{PAYMENT.payeeName}</span>
            </div>

            {/* 轉數快 FPS — text */}
            <div className="flex items-center justify-between gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm mb-3">
              <span className="text-slate-400 shrink-0">{p.payFps}</span>
              <span className="font-mono text-slate-100 text-base tracking-wider">{PAYMENT.fpsId}</span>
            </div>

            {/* Alipay HK + WeChat Pay — tap to reveal the collection QR */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: p.payAlipay, qr: PAYMENT.alipayHkQr },
                { label: p.payWechat, qr: PAYMENT.wechatQr },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setQrOpen(m)}
                  className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-500 rounded-xl px-4 py-3 text-center transition-colors"
                >
                  <div className="text-sm font-medium text-slate-200">{m.label}</div>
                  <div className="text-[11px] text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                    <QrCode size={11} /> {p.showQr}
                  </div>
                </button>
              ))}
            </div>

            <ol className="text-sm text-slate-400 space-y-1.5 list-decimal list-inside mb-5">
              <li>{p.manualStep1}</li>
              <li>{p.manualStep2}</li>
              <li>{p.manualStep3}</li>
            </ol>

            <a
              href={`https://wa.me/${PAYMENT.whatsappNumber}?text=${encodeURIComponent(p.whatsappPrefill)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              <MessageCircle size={18} /> {p.whatsappCta}
            </a>
          </div>
        )}
      </div>

      {qrOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setQrOpen(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold mb-3">{qrOpen.label}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrOpen.qr}
              alt={qrOpen.label}
              onClick={() => setQrOpen(null)}
              className="w-full h-auto rounded-lg cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-3">{p.scanToPay}</p>
            <button
              type="button"
              onClick={() => setQrOpen(null)}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg py-2 text-sm"
            >
              {p.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
