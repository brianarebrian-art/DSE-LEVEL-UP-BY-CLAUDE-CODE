'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import type { SensoryPref } from './SensoryMenu'

// ⚡ Buff 補給艙主頁：兩大選擇 + 4-7-8 回藥術入口。00 後遊戲化包裝，但保留共情、
// 無壓力指標、無打卡、無排行 —— 「戰友式共情」係硬要求。
export default function RelaxLanding({
  pref,
  onReopenMenu,
}: {
  pref: SensoryPref
  onReopenMenu: () => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-3xl mb-2" aria-hidden>⚡</div>
        <h1 className="text-2xl font-bold text-[#E8E8EC]">⚡ {en ? 'Buff Station' : 'Buff 補給艙'}</h1>
        <p className="text-sm text-[#00F5D4] mt-2 font-medium">
          {en ? 'Studying drained your MP? Refill here · recharge before heading back out' : '溫書耗 MP？入嚟補 · 狀態回滿再出發'}
        </p>
        <p className="text-sm text-[#8B8B96] mt-1 leading-relaxed">
          {en ? 'Just opening this today already takes guts. No questions here, no countdown, no one rushing you.' : '今日肯打開嚟已經好叻。呢度冇題目、冇倒數、冇人會催你。'}
        </p>
        <button
          onClick={onReopenMenu}
          className="mt-2 text-xs text-[#8B8B96] hover:text-[#00F5D4] underline underline-offset-2 min-h-11 px-2 transition-colors"
        >
          {en ? 'Reset sensory preferences' : '重新設定感官偏好'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Link
          href="/relax/solo"
          className={`block rounded-xl bg-[#14141B] border border-white/10 hover:border-[#00F5D4]/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4] ${
            pref.quiet ? 'opacity-90' : ''
          }`}
        >
          <div className="text-2xl mb-2" aria-hidden>🎧</div>
          <div className="font-bold text-[#E8E8EC] mb-1">🎧 {en ? 'Solo Recharge' : '單排補 MP'}</div>
          <div className="text-sm text-[#8B8B96]">
            {pref.quiet
              ? en ? 'Text-only breather, zone out (quiet mode)' : '文字回氣、放空（安靜模式）'
              : en ? 'Listen, breathe, zone out for a bit' : '聽聲、回氣、放空一陣'}
          </div>
        </Link>

        <Link
          href="/relax/group"
          className="block rounded-xl bg-[#14141B] border border-white/10 hover:border-[#FF006E]/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF006E]"
        >
          <div className="text-2xl mb-2" aria-hidden>👥</div>
          <div className="font-bold text-[#E8E8EC] mb-1">👥 {en ? 'Squad Up' : '組隊開黑'}</div>
          <div className="text-sm text-[#8B8B96]">
            {en ? 'Chat with study buddies, ask questions, or just watch others check in' : '同戰友傾偈、問問題、純粹睇人打卡都得'}
          </div>
        </Link>
      </div>

      <Link
        href="/relax/breathing"
        className="block w-full text-center rounded-[10px] border border-[#00F5D4]/30 text-[#00F5D4] text-sm py-3 min-h-11 hover:bg-[#00F5D4]/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4]"
      >
        🌬️ {en ? 'Let me do a 4-7-8 recovery breath first (1 min)' : '我先做個 4-7-8 回藥術（1 分鐘）'}
      </Link>

      <p className="text-xs text-[#8B8B96] text-center mt-4">
        {en ? "Even one bar of MP counts. Skip it if you're not up for it — no one will blame you." : '補 1 格 MP 都得。唔想做就唔做，冇人會怪你。'}
      </p>
    </div>
  )
}
