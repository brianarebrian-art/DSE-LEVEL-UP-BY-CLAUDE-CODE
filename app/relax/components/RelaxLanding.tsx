'use client'

import Link from 'next/link'
import { ArrowRight, Coffee, Footprints, Headphones, Wind, Leaf } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import type { SensoryPref } from './SensoryMenu'
import Mascot from '@/components/Mascot'

// 🫁 呼吸空間主頁（前身「Buff 補給艙」，CEO 指令 2026-07-15 統一改名）：
// 兩大選擇 + 4-7-8 呼吸入口。零遊戲術語（MP／單排／開黑已全清），保留共情、
// 無壓力指標、無排行 —— 「戰友式共情」係硬要求。
//
// ══ 2026-09-19：Night Study 版面（Claude Design `templates/night-study/Breathing`）══
// 跟咗：襯線斜體標題、呼吸圓圈卡、四個細休息建議、卡片樣式。
// 刻意唔跟嘅四處：
//   ① 模板將四個細休息叫「Virtual Supermarket」。虛擬超市 2026-09-05 由 Brian
//      裁決剷除（憲章 §8.1.1），而一個寫住「可以加」嘅名，落一個 session
//      就會被讀成待辦。四樣建議本身（熱茶、行吓、聽歌、透氣）冇問題，照收。
//   ② 模板將呼吸圓圈叫「Panic Attack First Aid」。「急救」係醫療聲稱（§16.D）——
//      一個真係驚恐發作嘅學生，需要嘅係熱線，唔係一個叫自己做急救嘅網頁。
//      熱線由 layout 嘅 EmergencyBanner 喺每一頁底部出，呢度唔再重複一張。
//   ③ 模板個圓圈會郁。呢度係一個選單，唔係練習本身 —— 會郁嘅版本喺
//      /relax/breathing，嗰度已經處理好減少動態同舒適模式。喺選單多加一個
//      會郁嘅嘢，只係多一個要關嘅動畫。
//   ④ 四個細休息係【建議】，唔係掣。模板畫成按鈕，但撳落去乜都唔會發生 ——
//      一個睇落撳得、撳落冇反應嘅嘢，比冇更差。
export default function RelaxLanding({
  pref,
  onReopenMenu,
}: {
  pref: SensoryPref
  onReopenMenu: () => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'

  const resets = [
    { Icon: Coffee, title: en ? 'Something warm' : '一杯暖嘢', body: en ? 'Tea, milk, water — just hold it for a bit.' : '茶、奶、暖水都得，揸住一陣。' },
    { Icon: Footprints, title: en ? 'Five-minute walk' : '行五分鐘', body: en ? 'Move your body and your head loosens too.' : '郁下個身，個腦都會鬆啲。' },
    { Icon: Headphones, title: en ? 'Quiet music' : '靜靜聽歌', body: en ? 'Nothing to follow along to. Just let it play.' : '唔使跟住唱，由佢播。' },
    { Icon: Wind, title: en ? 'Fresh air' : '透透氣', body: en ? 'Open a window. One long breath out.' : '開個窗，長長咁呼一口氣。' },
  ]

  return (
    <div>
      <header className="mb-8 text-center">
        {/* FIX: [A1] ⚡ Buff 補給艙 → 🫁 呼吸空間
            2026-09-03：🫁 再換成吉祥物（梳化捧杯、閉眼）。
            呢一版講嘅就係「入嚟唞一唞」，而呢隻姿勢本身已經係嗰句說話 ——
            比一個肺部 emoji 講得準，亦冇咗醫療聯想。 */}
        <div className="mb-2 flex justify-center">
          <Mascot pose="armchair" height={132} />
        </div>
        <p className="text-sm tracking-[0.08em] text-gold-strong">{en ? 'Breathing Space' : '呼吸空間'}</p>
        <h1 className="mt-1 font-serif text-3xl italic text-ink text-balance sm:text-4xl">
          {en ? "You don't have to push every minute." : '唔使每一分鐘都逼自己。'}
        </h1>
        {/* FIX: [A1][A3] 「溫書耗 MP？入嚟補」→「溫書攰咗？入嚟唞一唞」（MP 概念整體移除） */}
        <p className="mt-3 text-sm font-medium text-accent">
          {en ? 'Study-tired? Come take a breather · recharge before heading back out' : '溫書攰咗？入嚟唞一唞 · 狀態回滿再出發'}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {en ? 'Just opening this today already takes guts. No questions here, no countdown, no one rushing you.' : '今日肯打開嚟已經好叻。呢度冇題目、冇倒數、冇人會催促你。'}
        </p>
        {/* FIX: [B7] 純文字連結 → 高對比 cyan + underline-offset-4 + 更大觸控區（min-h-11 保留） */}
        <button
          onClick={onReopenMenu}
          className="mt-2 min-h-11 px-4 py-2 text-sm text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
        >
          {en ? 'Reset sensory preferences' : '重新設定感官偏好'}
        </button>
      </header>

      {/* 呼吸圓圈卡（模板右欄）。圓圈靜止，見檔頭 ③。 */}
      <Link
        href="/relax/breathing"
        style={{ ['--relax-in-delay' as string]: '0ms' }}
        className="relax-in mb-4 flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface-raised p-6 text-center transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:flex-row sm:text-left"
      >
        <span
          aria-hidden
          className="flex size-28 shrink-0 flex-col items-center justify-center rounded-full bg-accent/25 ring-8 ring-accent/10"
        >
          <span className="text-sm text-ink">{en ? 'Breathe in' : '吸氣'}</span>
          <span className="font-serif text-3xl text-ink tabular-nums">4</span>
          <span className="text-xs text-ink-soft">{en ? 'sec' : '秒'}</span>
        </span>
        <span className="flex-1">
          <span className="block font-serif text-xl text-ink">
            {en ? 'When it gets too much · 4-7-8 breathing' : '緊張嗰陣 · 4-7-8 呼吸'}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
            {en ? 'A quiet 4-7-8 cycle. Nothing needs to be solved in this moment.' : '一個靜靜哋嘅 4-7-8 循環。呢一刻，乜都唔使解決。'}
          </span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {en ? 'Start (1 min)' : '開始（1 分鐘）'}
            <ArrowRight size={15} aria-hidden />
          </span>
        </span>
      </Link>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/relax/solo"
          style={{ ['--relax-in-delay' as string]: '70ms' }}
          className={`relax-in block rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
            pref.quiet ? 'opacity-90' : ''
          }`}
        >
          <div className="mb-2 text-2xl" aria-hidden>🎧</div>
          {/* FIX: [A3] 「單排補 MP」→「獨處充電」 */}
          <div className="mb-1 font-serif text-lg text-ink">{en ? 'Solo Recharge' : '獨處充電'}</div>
          <div className="text-sm text-ink-soft">
            {pref.quiet
              ? en ? 'Text-only breather, zone out (quiet mode)' : '文字回氣、放空（安靜模式）'
              : en ? 'Listen, breathe, zone out for a bit' : '聽聲、回氣、放空一陣'}
          </div>
        </Link>

        <Link
          href="/relax/group"
          style={{ ['--relax-in-delay' as string]: '140ms' }}
          className="relax-in block rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-subj-rose/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <div className="mb-2 text-2xl" aria-hidden>👥</div>
          {/* FIX: [A3][A4][B9] 「組隊開黑」→「同戰友傾偈」；「打卡」→「記錄心情」；描述完整顯示 */}
          <div className="mb-1 font-serif text-lg text-ink">{en ? 'Chat with study buddies' : '同戰友傾偈'}</div>
          <div className="text-sm text-ink-soft">
            {en ? 'Chat, ask questions, or just watch others log their mood' : '傾偈、問問題、純粹睇人記錄心情都得'}
          </div>
        </Link>
      </div>

      {/* 細休息（模板嘅「Virtual Supermarket」，見檔頭 ①④）。係一張清單，唔係一排掣。 */}
      <section className="mb-4 rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-serif text-lg text-ink">
          <Leaf size={16} strokeWidth={1.2} aria-hidden className="text-gold" />
          {en ? 'Small resets' : '細休息'}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          {en ? 'Nothing to tap — pick one and go do it.' : '唔使㩒 —— 揀一樣，去做就得。'}
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {resets.map(({ Icon, title, body }) => (
            <li key={title} className="rounded-xl bg-surface-sunken p-4 text-center">
              <Icon size={26} strokeWidth={1.2} aria-hidden className="mx-auto text-gold" />
              <p className="mt-2 font-serif text-base text-ink">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5-4-3-2-1 落地練習（SEN-07 靜態安全網）：慌／解離感時用五官拉返當下 */}
      <Link
        href="/relax/grounding"
        className="block min-h-11 w-full rounded-[10px] border border-accent/30 py-3 text-center text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🧭 {en ? '5-4-3-2-1 grounding · pull myself back to now' : '5-4-3-2-1 落地練習 · 拉自己返到當下'}
      </Link>

      {/* 放榜前緩衝空間（第 4 週端到端 QA 發現）：/waiting 一直喺 sitemap 入面，
          但全站冇任何一條連結指過去 —— 即係只有由搜尋引擎入嚟先搵得到。
          嗰版有每日一句、呼吸、時間囊同真實求助熱線，係做完晒之後嗰段最難捱嘅
          日子先用得着，所以擺喺呼吸空間落面，唔擺喺練習流程入面。 */}
      <Link
        href="/waiting"
        className="mt-3 block min-h-11 w-full rounded-[10px] border border-accent/30 py-3 text-center text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        🕯️ {en ? 'Before results day · a slower place to wait' : '放榜前 · 一個慢啲嘅地方等'}
      </Link>

      {/* FIX: [A3][B5] 「補 1 格 MP 都得」→「唞 1 分鐘都得」；提升對比度 */}
      <p className="mt-4 text-center text-xs text-ink-soft">
        {en ? "Even one minute counts. Skip it if you're not up for it — no one will blame you." : '唞 1 分鐘都得。唔想做就唔做，冇人會怪你。'}
      </p>
    </div>
  )
}
