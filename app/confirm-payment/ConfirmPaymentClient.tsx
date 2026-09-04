'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { Lock, ArrowLeft, HeartHandshake } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// ══ SEN 紅線（§7、規格 §7.3）══
// 零紅色、零閃爍、零倒數計時、零彈窗遮罩。「返回」同「確認」同等大小 ——
// 一個令人覺得「返回」係次要選擇嘅版面，就係喺度谷人畀錢。
// 全流程鍵盤行得通：checkbox → 確認 → 返回，Tab 順序同視覺順序一致。

type Props = {
  sku: string
  amount: string
  labelZh: string
  labelEn: string
  periodZh: string
  periodEn: string
  consentTextVersion: string
  stripeReady: boolean
}

export default function ConfirmPaymentClient(props: Props) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const consentId = useId()
  const [consented, setConsented] = useState(false)
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<'signin' | 'general' | null>(null)

  const canProceed = consented && props.stripeReady && !busy

  async function goToStripe() {
    setBusy(true)
    setProblem(null)
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 只傳 plan，唔傳金額（§5.1）—— 價格由 server 查 Stripe 決定。
        body: JSON.stringify({ plan: props.sku, consent: true }),
      })
      if (r.status === 401) {
        setProblem('signin')
        setBusy(false)
        return
      }
      const data = (await r.json().catch(() => ({}))) as { url?: string }
      if (r.ok && data.url) {
        window.location.href = data.url
        return // 唔 setBusy(false)：頁面正離開，收返個掣可以令人再撳一次
      }
      setProblem('general')
    } catch {
      setProblem('general')
    }
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-2">
        {en ? 'Confirm your support' : '確認你嘅支持'}
      </h1>
      <p className="text-ink-soft leading-relaxed mb-7">
        {en
          ? 'Take a moment to check the details below. Nothing is charged until you continue to Stripe.'
          : '慢慢睇清楚下面嘅資料。你撳落去之前，唔會扣任何錢。'}
      </p>

      {/* ── 訂單詳情 ── */}
      <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-6">
        <div className="flex items-baseline justify-between gap-4 mb-1">
          <span className="text-ink font-medium">{en ? props.labelEn : props.labelZh}</span>
          <span className="text-ink text-lg font-semibold tabular-nums">{props.amount}</span>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          {en ? props.periodEn : props.periodZh}
        </p>
      </div>

      {/* ── 同意聲明（修補 2 / 憲章 §8.2 法律合規）──
          自我聲明式，唔收家長電郵 —— 收一個第三方嘅個人資料而完全唔通知
          該第三方，PDPO 下有問題。呢段文字嘅版本號會連同交易記入
          consent_logs.consent_text_version：文案改咗，舊紀錄仍然講得出
          當時用戶究竟同意咗邊個版本。改呢段字＝要 bump CONSENT_TEXT_VERSION。 */}
      <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-6">
        <label htmlFor={consentId} className="flex gap-3 items-start cursor-pointer">
          <input
            id={consentId}
            type="checkbox"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <span className="text-sm text-ink-soft leading-relaxed">
            {en
              ? 'I confirm that I am 18 or older, or that my parent or guardian knows about this purchase and agrees to it.'
              : '我確認自己已滿 18 歲；或者我未滿 18 歲，但家長／監護人知道呢次購買並且同意。'}
          </span>
        </label>
        <p className="text-xs text-ink-muted mt-3 pl-8">
          {en
            ? 'If you are under 18, please ask them first. There is no rush — the free version is always here.'
            : '如果你未夠 18 歲，請先問過佢哋。唔使急 —— 免費版一直都喺度。'}
        </p>
      </div>

      {/* ── 付款方式 ── */}
      <div className="flex gap-2.5 items-start text-sm text-ink-muted mb-7">
        <Lock className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
        <p className="leading-relaxed">
          {en
            ? 'Payment is handled by Stripe. This platform never sees or stores your card number.'
            : '付款由 Stripe 處理。本平台唔會見到、亦唔會儲存你嘅信用卡號碼。'}
        </p>
      </div>

      {/* ── 兩個按鈕，同等大小（修補 9 設計紅線）── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={goToStripe}
          disabled={!canProceed}
          className="flex-1 rounded-xl bg-accent-strong text-on-accent px-5 py-3 font-medium transition-all duration-200 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {busy
            ? en
              ? 'Opening Stripe…'
              : '開緊 Stripe…'
            : en
              ? 'Continue to Stripe'
              : '確認，前往 Stripe 付款'}
        </button>
        <Link
          href="/"
          className="flex-1 rounded-xl border border-line px-5 py-3 font-medium text-ink-soft text-center inline-flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {en ? 'Back — let me think' : '返回，我再諗下'}
        </Link>
      </div>

      {/* 未勾選同意 → 講返點解撳唔到。唔用紅色、唔用「錯誤」字眼（§7）。 */}
      {!consented && (
        <p className="text-sm text-ink-muted mt-3" role="status">
          {en
            ? 'Tick the box above when you are ready.'
            : '準備好嘅話，剔咗上面個格先。'}
        </p>
      )}

      {/* Stripe 未接好（暗部署 / 未設 key）。照顯示成版，但唔扮撳得。 */}
      {consented && !props.stripeReady && (
        <p className="text-sm text-ink-muted mt-3" role="status">
          {en
            ? 'Payments are not open yet. Nothing to do here for now — the free version has everything you need.'
            : '付款功能仲未開放。而家唔使做任何嘢 —— 免費版已經夠你用。'}
        </p>
      )}

      {/* 兩個問題狀態都唔用紅色、唔講「錯誤」（§7）。 */}
      {problem === 'signin' && (
        <p className="text-sm text-ink-soft mt-3 leading-relaxed" role="status">
          {en
            ? 'Plus is tied to your account, so you need to sign in first — otherwise there is nothing to attach it to.'
            : 'Plus 係綁住你個帳戶嘅，所以要先登入 —— 唔係就冇嘢可以綁。'}{' '}
          <Link href="/api/auth/signin" className="underline focus-visible:outline focus-visible:outline-2">
            {en ? 'Sign in' : '去登入'}
          </Link>
        </p>
      )}
      {problem === 'general' && (
        <p className="text-sm text-ink-soft mt-3 leading-relaxed" role="status">
          {en
            ? 'We could not open the payment page just now, and nothing has been charged. Try again in a moment.'
            : '而家開唔到付款頁，亦冇扣過任何錢。等陣再試一次。'}
        </p>
      )}

      {/* ── 基層減免（§17）。放喺最底，唔喺流程上攔人，但一定睇得到。
          ⚠️ 減免申請頁係 Phase 3.1，仲未起。所以呢度【唔擺連結】——
          擺一條指去 404 嘅連結，對一個啱啱鼓起勇氣想申請減免嘅學生嚟講，
          比冇連結更差。3.1 完成之後再改返做 <Link href="/support/discount">。 ── */}
      <div className="mt-8 pt-6 border-t border-line">
        <p className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
          <HeartHandshake className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            {en
              ? 'If money is tight right now, a 50% reduction will be available — no documents needed, we take your word for it. It opens together with payments.'
              : '如果你而家手頭緊，將會有 50% 減免 —— 唔使交任何證明文件，我哋信你。佢會同付款功能一齊開放。'}
          </span>
        </p>
      </div>
    </div>
  )
}
