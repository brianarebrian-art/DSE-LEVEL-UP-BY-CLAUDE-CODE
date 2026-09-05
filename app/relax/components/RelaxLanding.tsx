'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import type { SensoryPref } from './SensoryMenu'
import Mascot from '@/components/Mascot'

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
        {/* FIX: [A1] ⚡ Buff 補給艙 → 🫁 呼吸空間
            2026-09-03：🫁 再換成吉祥物（梳化捧杯、閉眼）。
            呢一版講嘅就係「入嚟唞一唞」，而呢隻姿勢本身已經係嗰句說話 ——
            比一個肺部 emoji 講得準，亦冇咗醫療聯想。 */}
        <div className="flex justify-center mb-2">
          <Mascot pose="armchair" height={132} />
        </div>
        <h1 className="text-2xl font-bold text-ink">{en ? 'Breathing Space' : '呼吸空間'}</h1>
        {/* FIX: [A1][A3] 「溫書耗 MP？入嚟補」→「溫書攰咗？入嚟唞一唞」（MP 概念整體移除） */}
        <p className="text-sm text-accent mt-2 font-medium">
          {en ? 'Study-tired? Come take a breather · recharge before heading back out' : '溫書攰咗？入嚟唞一唞 · 狀態回滿再出發'}
        </p>
        <p className="text-sm text-ink-soft mt-1 leading-relaxed">
          {en ? 'Just opening this today already takes guts. No questions here, no countdown, no one rushing you.' : '今日肯打開嚟已經好叻。呢度冇題目、冇倒數、冇人會催促你。'}
        </p>
        {/* FIX: [B7] 純文字連結 → 高對比 cyan + underline-offset-4 + 更大觸控區（min-h-11 保留） */}
        <button
          onClick={onReopenMenu}
          className="mt-2 text-sm text-accent hover:text-accent-hover underline underline-offset-4 min-h-11 py-2 px-4 transition-colors"
        >
          {en ? 'Reset sensory preferences' : '重新設定感官偏好'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Link
          href="/relax/solo"
          style={{ ["--relax-in-delay" as string]: "0ms" }}
          className={`relax-in block rounded-xl bg-surface-raised border border-line hover:border-accent/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
            pref.quiet ? 'opacity-90' : ''
          }`}
        >
          <div className="text-2xl mb-2" aria-hidden>🎧</div>
          {/* FIX: [A3] 「單排補 MP」→「獨處充電」 */}
          <div className="font-bold text-ink mb-1">🎧 {en ? 'Solo Recharge' : '獨處充電'}</div>
          <div className="text-sm text-ink-soft">
            {pref.quiet
              ? en ? 'Text-only breather, zone out (quiet mode)' : '文字回氣、放空（安靜模式）'
              : en ? 'Listen, breathe, zone out for a bit' : '聽聲、回氣、放空一陣'}
          </div>
        </Link>

        <Link
          href="/relax/group"
          style={{ ["--relax-in-delay" as string]: "70ms" }}
          className="relax-in block rounded-xl bg-surface-raised border border-line hover:border-subj-rose/50 p-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <div className="text-2xl mb-2" aria-hidden>👥</div>
          {/* FIX: [A3][A4][B9] 「組隊開黑」→「同戰友傾偈」；「打卡」→「記錄心情」；描述完整顯示 */}
          <div className="font-bold text-ink mb-1">👥 {en ? 'Chat with study buddies' : '同戰友傾偈'}</div>
          <div className="text-sm text-ink-soft">
            {en ? 'Chat, ask questions, or just watch others log their mood' : '傾偈、問問題、純粹睇人記錄心情都得'}
          </div>
        </Link>
      </div>

      {/* FIX: [A3] 「回藥術」（遊戲術語）→「呼吸」 */}
      <Link
        href="/relax/breathing"
        style={{ ["--relax-in-delay" as string]: "140ms" }}
        className="relax-in block w-full text-center rounded-[10px] border border-accent/30 text-accent text-sm py-3 min-h-11 hover:bg-accent/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🌬️ {en ? 'Let me do a 4-7-8 breath first (1 min)' : '我先做個 4-7-8 呼吸（1 分鐘）'}
      </Link>

      {/* 5-4-3-2-1 落地練習（SEN-07 靜態安全網）：慌／解離感時用五官拉返當下 */}
      <Link
        href="/relax/grounding"
        className="block w-full text-center rounded-[10px] border border-accent/30 text-accent text-sm py-3 min-h-11 mt-3 hover:bg-accent/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🧭 {en ? '5-4-3-2-1 grounding · pull myself back to now' : '5-4-3-2-1 落地練習 · 拉自己返到當下'}
      </Link>

      {/* 🛒 虛擬超市：純瀏覽減壓，零貨幣零結帳零計時（2026-08-04） */}
      <Link
        href="/relax/virtual-supermarket"
        className="block w-full text-center rounded-[10px] border border-subj-rose/40 text-subj-rose text-sm py-3 min-h-11 mt-3 hover:bg-subj-rose/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🛒 {en ? 'Wander a virtual supermarket · nothing to buy' : '行下虛擬超市 · 冇嘢要買'}
      </Link>

      {/* 放榜前緩衝空間（第 4 週端到端 QA 發現）：/waiting 一直喺 sitemap 入面，
          但全站冇任何一條連結指過去 —— 即係只有由搜尋引擎入嚟先搵得到。
          嗰版有每日一句、呼吸、時間囊同真實求助熱線，係做完晒之後嗰段最難捱嘅
          日子先用得着，所以擺喺呼吸空間落面，唔擺喺練習流程入面。 */}
      <Link
        href="/waiting"
        className="block w-full text-center rounded-[10px] border border-accent/30 text-accent text-sm py-3 min-h-11 mt-3 hover:bg-accent/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🕯️ {en ? 'Before results day · a slower place to wait' : '放榜前 · 一個慢啲嘅地方等'}
      </Link>

      {/* FIX: [A3][B5] 「補 1 格 MP 都得」→「唞 1 分鐘都得」；提升對比度 */}
      <p className="text-xs text-ink-soft text-center mt-4">
        {en ? "Even one minute counts. Skip it if you're not up for it — no one will blame you." : '唞 1 分鐘都得。唔想做就唔做，冇人會怪你。'}
      </p>
    </div>
  )
}
