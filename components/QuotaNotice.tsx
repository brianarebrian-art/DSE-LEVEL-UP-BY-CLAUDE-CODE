'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { hasReachedDailyLimit, isSenComfortMode, FREE_DAILY_LIMIT } from '@/lib/quota'
import { usePlusTier } from '@/lib/payment/usePlusTier'

// 每日額度提示（修補 4）。
//
// ══ 兩個版本，唔係一個版本加個開關 ══
// 一般版講返件事實：今日做咗 40 題，想繼續可以支持平台。
// SEN 版連「額度」呢個框架都唔提 —— 佢講嘅係「今日夠喇，去唞下」。
//
// 修補 4 禁語（唔准喺 SEN 版出現）：「限制」「額度用完」「無限制」。
// 呢三個詞共通點係都將學生放喺一個被攔住嘅位置。一個 ADHD 學生
// 半夜做到第 40 題，見到「額度用完」同見到「今日夠喇」，
// 係兩件完全唔同嘅事。
//
// ══ 兩個版本都要守嘅嘢（§7 大愛設計）══
// 零紅色、零橙色、零閃爍、零倒數。SEN 版嘅「休息」係主要按鈕，
// 但「我想繼續」永遠喺度、永遠撳得到 —— 唔准收埋。
//
// ══ 暗部署 ══
// hasReachedDailyLimit() 喺 NEXT_PUBLIC_PLUS_ENABLED 未開之前永遠 false，
// 所以呢個組件而家喺任何情況下都唔會渲染任何嘢。

export default function QuotaNotice() {
  const { locale } = useLocale()
  const en = locale === 'en'

  // Plus 用戶冇每日上限，所以呢個提示對佢哋嚟講完全冇意義 ——
  // 更差嘅係，佢會向一個【已經畀咗錢】嘅學生推銷佢已經買咗嘅嘢。
  const { tier, loading } = usePlusTier()

  // localStorage 要喺 client 讀 —— 直接喺 render 讀會令 SSR 同首次
  // client render 唔一致（hydration mismatch）。
  const [state, setState] = useState<{ reached: boolean; sen: boolean } | null>(null)
  useEffect(() => {
    setState({ reached: hasReachedDailyLimit(), sen: isSenComfortMode() })
  }, [])

  // loading 期間唔渲染：寧可遲半秒先出，都好過向 Plus 用戶閃一閃個推銷。
  if (loading || tier === 'plus' || !state?.reached) return null

  if (state.sen) {
    // ── SEN 無壓力版 ──
    return (
      <div className="no-print rounded-2xl border border-line bg-surface-raised p-5">
        <p className="text-ink font-medium mb-1.5">
          {en ? 'Today’s goal is done 🌱' : '今日目標達成 🌱'}
        </p>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">
          {en
            ? 'You have done plenty of practice today. Rest a bit, listen to a song, and pick it up again tomorrow.'
            : '你今日已經完成咗足夠嘅練習量。休息一下，聽首歌，明日再繼續。'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/relax"
            className="flex-1 rounded-xl bg-accent-strong text-on-accent px-5 py-3 font-medium text-center transition-all duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {en ? 'Go rest' : '去唞一唞'}
          </Link>
          {/* 次要，但永遠喺度、永遠撳得到 —— 唔准收埋（修補 4）。 */}
          <Link
            href="/confirm-payment?plan=plus_season"
            className="flex-1 rounded-xl border border-line px-5 py-3 text-sm text-ink-soft text-center inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {en ? 'I want to keep studying' : '我想繼續溫書'}
          </Link>
        </div>
      </div>
    )
  }

  // ── 一般版 ──
  return (
    <div className="no-print rounded-2xl border border-line bg-surface-raised p-5">
      <p className="text-ink font-medium mb-1.5">
        {en
          ? `That’s ${FREE_DAILY_LIMIT} questions today — nicely done.`
          : `今日做咗 ${FREE_DAILY_LIMIT} 題，好嘢。`}
      </p>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        {en
          ? 'Free practice starts fresh tomorrow. If this platform is useful to you, Plus keeps it running — and lifts the daily count.'
          : '免費練習聽日重新開始。如果呢個平台幫到你，Plus 幫我哋捱住伺服器 —— 順便解開每日題數。'}
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <Link
          href="/confirm-payment?plan=plus_season"
          className="flex-1 rounded-xl bg-accent-strong text-on-accent px-5 py-3 font-medium text-center transition-all duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {en ? 'Support the platform' : '支持平台'}
        </Link>
        {/* 同等大小。免費繼續唔係一個要縮細嘅選擇（規格 §7.1 按鈕紅線）。 */}
        <Link
          href="/"
          className="flex-1 rounded-xl border border-line px-5 py-3 font-medium text-ink-soft text-center inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {en ? 'See you tomorrow' : '聽日見'}
        </Link>
      </div>
    </div>
  )
}
