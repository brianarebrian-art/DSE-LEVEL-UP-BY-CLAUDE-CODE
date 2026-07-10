'use client'

import Link from 'next/link'
import type { SensoryPref } from './SensoryMenu'

// 避風港主頁兩大選擇 + 一分鐘呼吸入口。無壓力指標、無打卡、無排行。
export default function RelaxLanding({
  pref,
  onReopenMenu,
}: {
  pref: SensoryPref
  onReopenMenu: () => void
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-3xl mb-2" aria-hidden>🏮</div>
        <h1 className="text-2xl font-bold text-[#E8E8EC]">化城避風港</h1>
        <p className="text-sm text-[#8B8B96] mt-2 leading-relaxed">
          今日能打開嚟已經好叻。呢度冇題目、冇倒數、冇人會催你。
        </p>
        <button
          onClick={onReopenMenu}
          className="mt-2 text-xs text-[#8B8B96] hover:text-[#00F5D4] underline underline-offset-2 min-h-11 px-2 transition-colors"
        >
          重新設定感官偏好
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
          <div className="font-bold text-[#E8E8EC] mb-1">自己靜靜地</div>
          <div className="text-sm text-[#8B8B96]">
            {pref.quiet ? '文字呼吸、放空（安靜模式）' : '聽歌、呼吸、放空'}
          </div>
        </Link>

        <Link
          href="/relax/group"
          className="block rounded-xl bg-[#14141B] border border-white/10 hover:border-[#FF006E]/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF006E]"
        >
          <div className="text-2xl mb-2" aria-hidden>👥</div>
          <div className="font-bold text-[#E8E8EC] mb-1">同大家一齊</div>
          <div className="text-sm text-[#8B8B96]">傾偈、問問題、純粹睇人吹水都得</div>
        </Link>
      </div>

      <Link
        href="/relax/breathing"
        className="block w-full text-center rounded-[10px] border border-[#00F5D4]/30 text-[#00F5D4] text-sm py-3 min-h-11 hover:bg-[#00F5D4]/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4]"
      >
        🫁 我先做個 4-7-8 呼吸（1 分鐘）
      </Link>

      <p className="text-xs text-[#8B8B96] text-center mt-4">
        聽 1 首歌都得。唔想做就唔做，冇人會怪你。
      </p>
    </div>
  )
}
