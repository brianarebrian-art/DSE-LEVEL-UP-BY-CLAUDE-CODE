'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Lock, Sparkles, LogIn, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

/**
 * Popup modal shown when a FREE user hits the platform-wide attempt cap.
 * Distinct from the full-page subject lock (UpgradeWall) — this overlays the
 * practice screen as a dialog. Signed-out users are nudged to log in first
 * (it's free and may unlock Premium outright); signed-in users get the upgrade CTA.
 */
export default function UpgradeModal({
  cap,
  signedIn,
  onClose,
  title,
  body,
  kicker,
}: {
  cap: number
  signedIn: boolean
  onClose: () => void
  // Optional copy overrides — e.g. gating a Premium-only feature rather than the
  // practice cap. Fall back to the practice-limit strings when omitted.
  title?: string
  body?: string
  kicker?: string
}) {
  const { t } = useLocale()
  const p = t.premium

  // Close on Escape; lock body scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-7 text-center shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={p.close}
          className="absolute top-3.5 right-3.5 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center mb-4">
          <Lock className="text-amber-400" size={24} />
        </div>

        <div className="text-xs font-semibold tracking-wide text-amber-400/90 uppercase mb-1">
          {kicker ?? p.wallLimitKicker}
        </div>
        <h2 id="upgrade-modal-title" className="text-xl font-extrabold mb-2">
          {title ?? p.wallLimitTitle}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {body ?? p.wallLimitBody.replace('{cap}', String(cap))}
        </p>

        <div className="flex flex-col gap-2.5">
          {signedIn ? (
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              <Sparkles size={16} /> {p.upgrade}
            </Link>
          ) : (
            // Guest → log in first: free, and may unlock Premium outright
            // (school / registered / paid email), no payment needed.
            <button
              type="button"
              onClick={() => signIn('google')}
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              <LogIn size={16} /> {p.wallSignIn}
            </button>
          )}

          {!signedIn && (
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 text-sm py-1"
            >
              <Sparkles size={14} /> {p.upgrade}
            </Link>
          )}

          <Link
            href="/subjects"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3 rounded-xl transition-all text-sm"
          >
            {p.wallBack}
          </Link>
        </div>
      </div>
    </div>
  )
}
