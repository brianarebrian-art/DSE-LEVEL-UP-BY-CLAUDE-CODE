'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import type { SensoryPref } from './SensoryMenu'

// 🫁 呼吸空間主頁（前身「Buff 補給艙」，CEO 指令 2026-07-15 統一改名）：
// 兩大選擇 + 4-7-8 呼吸入口。零遊戲術語（MP／單排／開黑已全清），保留共情、
// 無壓力指標、無排行 —— 「戰友式共情」係硬要求。
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
        {/* FIX: [A1] ⚡ Buff 補給艙 → 🫁 呼吸空間 */}
        <div className="text-3xl mb-2" aria-hidden>🫁</div>
        <h1 className="text-2xl font-bold text-[#E8E8EC]">{en ? 'Breathing Space' : '呼吸空間'}</h1>
        {/* FIX: [A1][A3] 「溫書耗 MP？入嚟補」→「溫書攰咗？入嚟唞一唞」（MP 概念整體移除） */}
        <p className="text-sm text-neon-cyan mt-2 font-medium">
          {en ? 'Study-tired? Come take a breather · recharge before heading back out' : '溫書攰咗？入嚟唞一唞 · 狀態回滿再出發'}
        </p>
        {/* FIX: [A4][B5] 「催你」→「催促你」；#8B8B96 → #C2C2CC 提升說明文字對比度 */}
        <p className="text-sm text-[#C2C2CC] mt-1 leading-relaxed">
          {en ? 'Just opening this today already takes guts. No questions here, no countdown, no one rushing you.' : '今日肯打開嚟已經好叻。呢度冇題目、冇倒數、冇人會催促你。'}
        </p>
        {/* FIX: [B7] 純文字連結 → 高對比 cyan + underline-offset-4 + 更大觸控區（min-h-11 保留） */}
        <button
          onClick={onReopenMenu}
          className="mt-2 text-sm text-neon-cyan hover:text-[#7FFAE8] underline underline-offset-4 min-h-11 py-2 px-4 transition-colors"
        >
          {en ? 'Reset sensory preferences' : '重新設定感官偏好'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Link
          href="/relax/solo"
          className={`block rounded-xl bg-[#14141B] border border-white/10 hover:border-neon-cyan/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${
            pref.quiet ? 'opacity-90' : ''
          }`}
        >
          <div className="text-2xl mb-2" aria-hidden>🎧</div>
          {/* FIX: [A3] 「單排補 MP」→「獨處充電」 */}
          <div className="font-bold text-[#E8E8EC] mb-1">🎧 {en ? 'Solo Recharge' : '獨處充電'}</div>
          {/* FIX: [B5] 卡片描述 #8B8B96 → #C2C2CC */}
          <div className="text-sm text-[#C2C2CC]">
            {pref.quiet
              ? en ? 'Text-only breather, zone out (quiet mode)' : '文字回氣、放空（安靜模式）'
              : en ? 'Listen, breathe, zone out for a bit' : '聽聲、回氣、放空一陣'}
          </div>
        </Link>

        <Link
          href="/relax/group"
          className="block rounded-xl bg-[#14141B] border border-white/10 hover:border-neon-pink/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-pink"
        >
          <div className="text-2xl mb-2" aria-hidden>👥</div>
          {/* FIX: [A3][A4][B9] 「組隊開黑」→「同戰友傾偈」；「打卡」→「記錄心情」；描述完整顯示 */}
          <div className="font-bold text-[#E8E8EC] mb-1">👥 {en ? 'Chat with study buddies' : '同戰友傾偈'}</div>
          <div className="text-sm text-[#C2C2CC]">
            {en ? 'Chat, ask questions, or just watch others log their mood' : '傾偈、問問題、純粹睇人記錄心情都得'}
          </div>
        </Link>
      </div>

      {/* FIX: [A3] 「回藥術」（遊戲術語）→「呼吸」 */}
      <Link
        href="/relax/breathing"
        className="block w-full text-center rounded-[10px] border border-neon-cyan/30 text-neon-cyan text-sm py-3 min-h-11 hover:bg-neon-cyan/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
      >
        🌬️ {en ? 'Let me do a 4-7-8 breath first (1 min)' : '我先做個 4-7-8 呼吸（1 分鐘）'}
      </Link>

      {/* 5-4-3-2-1 落地練習（SEN-07 靜態安全網）：慌／解離感時用五官拉返當下 */}
      <Link
        href="/relax/grounding"
        className="block w-full text-center rounded-[10px] border border-neon-cyan/30 text-neon-cyan text-sm py-3 min-h-11 mt-3 hover:bg-neon-cyan/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
      >
        🧭 {en ? '5-4-3-2-1 grounding · pull myself back to now' : '5-4-3-2-1 落地練習 · 拉自己返到當下'}
      </Link>

      {/* FIX: [A3][B5] 「補 1 格 MP 都得」→「唞 1 分鐘都得」；提升對比度 */}
      <p className="text-xs text-[#C2C2CC] text-center mt-4">
        {en ? "Even one minute counts. Skip it if you're not up for it — no one will blame you." : '唞 1 分鐘都得。唔想做就唔做，冇人會怪你。'}
      </p>
    </div>
  )
}
