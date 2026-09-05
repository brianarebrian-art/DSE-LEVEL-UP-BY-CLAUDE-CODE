'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

export type ThankYouState = 'done' | 'processing' | 'unknown'

// 三個狀態都唔用紅色、唔用「錯誤」「失敗」字眼（§7 大愛設計）。
// 一個啱啱畀完錢嘅學生見到紅色警告，會即刻諗「我啲錢係咪冇咗」。

export default function ThankYouClient({ state }: { state: ThankYouState }) {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      {state === 'done' && (
        <>
          <h1 className="text-2xl font-semibold text-ink mb-3">
            {en ? 'All set — thank you 🌱' : '搞掂喇，多謝你 🌱'}
          </h1>
          <p className="text-ink-soft leading-relaxed mb-2">
            {en
              ? 'Your Plus access is active. It will simply end when the period is up — there is nothing to cancel, and nothing will be charged again.'
              : '你嘅 Plus 已經開通。到期就自然完結 —— 冇嘢要取消，亦唔會再扣任何錢。'}
          </p>
          <p className="text-ink-soft leading-relaxed">
            {en
              ? 'Twenty percent of what you paid goes to the fee-reduction fund and to education charities. That part is not ours.'
              : '你畀嘅錢入面有兩成會去基層減免基金同教育慈善機構。嗰部分唔屬於我哋。'}
          </p>
        </>
      )}

      {state === 'processing' && (
        <>
          <h1 className="text-2xl font-semibold text-ink mb-3">
            {en ? 'Still finishing up' : '仲處理緊'}
          </h1>
          <p className="text-ink-soft leading-relaxed mb-2">
            {en
              ? 'Your payment went through. We are just waiting for it to land on our side — refresh this page in a moment and it should be done.'
              : '你嘅付款已經過咗。我哋而家等緊佢喺我哋呢邊入賬 —— 等陣刷新一次呢版就應該搞掂。'}
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            {en
              ? 'Nothing is lost if you close this page. Your access is tied to your account, not to this tab.'
              : '就算你而家熄咗呢版都唔會有嘢唔見。你嘅權限綁住你個帳戶，唔係綁住呢個分頁。'}
          </p>
        </>
      )}

      {state === 'unknown' && (
        <>
          <h1 className="text-2xl font-semibold text-ink mb-3">
            {en ? 'Nothing to show here' : '呢度暫時冇嘢顯示'}
          </h1>
          <p className="text-ink-soft leading-relaxed">
            {en
              ? 'This page shows the result of a purchase made while signed in. If you just paid, make sure you are signed in with the same account and open the link again.'
              : '呢一版顯示嘅係登入狀態下完成嘅購買結果。如果你啱啱畀咗錢，請確認你登入緊同一個帳戶，再開一次條連結。'}
          </p>
        </>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/practice"
          className="flex-1 rounded-xl bg-accent-strong text-on-accent px-5 py-3 font-medium text-center transition-all duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {en ? 'Back to practice' : '返去做題'}
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-xl border border-line px-5 py-3 font-medium text-ink-soft text-center inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {en ? 'Home' : '返首頁'}
        </Link>
      </div>
    </div>
  )
}
