'use client'

import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import DailyQuote from '@/components/waiting/DailyQuote'
import BreathingExercise from '@/components/BreathingExercise'

// 方向二：等放榜專區（light-first，靜態安全版）。
// 金句輪播 + 4-7-8 呼吸法 + 真危機熱線信號牌（用返站內已驗證號碼）。
// 社群互助牆（完整 UGC + 人手審核）係另一個較大 build —— 此處先放清楚標示嘅預留位，
// 唔會喺未有審核流程前開匿名公開發帖（Luna/Sarah 紅線）。

export default function WaitingPage() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl" aria-hidden>🫂</div>
          <h1 className="mb-3 text-3xl font-medium text-ink sm:text-4xl">
            {en ? 'Before results day, we’re with you' : '放榜前，我哋陪你'}
          </h1>
          <p className="mx-auto max-w-xl text-ink-muted leading-relaxed">
            {en
              ? 'The waiting can feel heavy. Take a slow breath — whatever the result, you deserve respect.'
              : '等待嘅日子可能好難捱。深呼吸，無論結果點，你都值得被尊重。'}
          </p>
        </div>

        {/* 每日金句 */}
        <section className="mb-8">
          <DailyQuote />
        </section>

        {/* 4-7-8 呼吸法 */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-ink">
            {en ? 'Take a breather' : '唞一唞'}
          </h2>
          <BreathingExercise />
        </section>

        {/* 時間囊 —— 取代已刪除嘅「社群互助牆」預留位。
            舊位寫住「匿名打氣互助牆準備緊 · 即將推出」，但該功能已於 2026-08-21
            決定永久唔做（見 docs/DECISION-no-interaction.md）。留住一個唔會兌現嘅
            「即將推出」，係一個細但真實嘅失信。 */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-ink">
            {en ? 'Write to a later you' : '寫畀之後嘅自己'}
          </h2>
          <Link
            href="/capsule"
            className="block rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-accent/40"
          >
            <Lock size={20} className="mb-3 text-accent" aria-hidden />
            <p className="text-sm leading-relaxed text-ink-soft">
              {en
                ? 'Waiting is its own kind of hard. Write down where you are right now, seal it, and pick a day to read it back.'
                : '等，本身都係一種難捱。寫低你而家喺邊個位置，封存佢，揀一日開返嚟睇。'}
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              {en
                ? 'Stays on your device · nobody else can read it →'
                : '留喺你部機 · 冇其他人睇得到 →'}
            </p>
          </Link>
        </section>

        {/* 危機熱線信號牌 —— 真實已驗證號碼（撒瑪利亞會 / 生命熱線）+ 醫療免責 */}
        <section className="mb-10">
          <div className="rounded-2xl border border-rose/15 bg-rose/[0.04] p-5 text-center">
            <p className="text-sm leading-relaxed text-ink-soft">
              {en ? 'Feeling overwhelmed? You’re not alone. The Samaritans 24-hr hotline: ' : '覺得頂唔順？你唔係一個人。撒瑪利亞會 24 小時熱線：'}
              <a href="tel:28960000" className="mx-1 inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-2">2896 0000</a>
              {' | '}
              {en ? 'Suicide Prevention Services: ' : '生命熱線：'}
              <a href="tel:23820000" className="mx-1 inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-2">2382 0000</a>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {en
                ? 'This platform is not a professional medical service; the above is for reference only. In an emergency, call 999 immediately or go to the nearest A&E.'
                : '本平台非專業醫療機構，以上資訊僅供參考。如情況緊急，請立即致電 999 或前往就近急症室。'}
            </p>
          </div>
        </section>

        {/* 返首頁 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={15} /> {en ? 'Back to home' : '返回首頁'}
          </Link>
        </div>
      </div>
    </div>
  )
}
