'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { loadSensoryPref } from './SensoryMenu'

// 5-4-3-2-1 落地練習（grounding）—— SEN-07 靜態安全網（創辦人 2026-07-21 拍板：只做靜態版）。
// 憲章對齊：呢個係公開、非臨床嘅安定技巧，幫恐慌／解離感嘅同學用五官拉返自己到當下。
// 硬紅線（同 doc §41.7 spec 對比）：
//   ✗ 無自傷 NLP 偵測、✗ 無 crisis 自動彈窗、✗ 無「Sarah 社工介入」（Sarah 係虛擬 persona）
//   ✗ 零 server、零 localStorage 儲存（純 component state，唔記錄、唔上傳、唔追蹤）
//   ✓ 自定步速（冇倒數、冇壓力）、✓ 尊重感官偏好、✓ layout 已常駐真熱線（EmergencyBanner）
// 醫療免責由 /relax layout 嘅 EmergencyBanner 提供，唔喺度重複紅調元素。

type Sense = {
  n: number
  icon: string
  zh: string
  en: string
  hintZh: string
  hintEn: string
}

const SENSES: Sense[] = [
  { n: 5, icon: '👀', zh: '望一望四周，搵 5 樣你而家見到嘅嘢', en: 'Look around and find 5 things you can see', hintZh: '一枝筆、你隻手、窗、盞燈……乜都得，慢慢數。', hintEn: 'A pen, your hand, a window, a light… anything counts. Take your time.' },
  { n: 4, icon: '👂', zh: '靜一靜，留意 4 樣你而家聽到嘅聲音', en: 'Get still and notice 4 things you can hear', hintZh: '風扇聲、街外車聲、自己嘅呼吸……', hintEn: 'A fan, traffic outside, your own breathing…' },
  { n: 3, icon: '✋', zh: '感受 3 樣你而家掂到嘅嘢', en: 'Feel 3 things you can touch', hintZh: '你坐緊嘅櫈、枱面、衫嘅質感。', hintEn: 'The chair you sit on, the desk, the texture of your clothes.' },
  { n: 2, icon: '👃', zh: '慢慢深呼吸，留意 2 樣你聞到嘅氣味', en: 'Breathe in slowly and notice 2 things you can smell', hintZh: '如果聞唔到，諗返一陣你鍾意嘅氣味都得。', hintEn: 'If you can’t smell anything, recall two scents you like.' },
  { n: 1, icon: '🫁', zh: '最後，感受 1 樣 —— 你自己嘅呼吸', en: 'Finally, notice 1 thing — your own breath', hintZh: '一吸一呼，你已經返到當下喇。', hintEn: 'One breath in, one breath out. You’re back in the present now.' },
]

export default function GroundingExercise() {
  const router = useRouter()
  const { locale } = useLocale()
  const en = locale === 'en'
  // step: 0..4 = 五官，5 = 收結畫面
  const [step, setStep] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const pref = loadSensoryPref()
    setReduced(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || pref?.visual === false,
    )
  }, [])

  const done = step >= SENSES.length
  const current = done ? null : SENSES[step]
  const anim = reduced ? '' : 'animate-slide-up'

  return (
    <div>
      {/* 導引說明（非臨床框架） */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2" aria-hidden>🧭</div>
        <h1 className="text-2xl font-bold text-[#E8E8EC]">
          {en ? '5-4-3-2-1 Grounding' : '5-4-3-2-1 落地練習'}
        </h1>
        <p className="text-sm text-[#C2C2CC] mt-2 leading-relaxed max-w-md mx-auto">
          {en
            ? 'When you feel panicky or a bit “not here”, use your five senses to gently pull yourself back to now. Go slowly — there’s no right or wrong, and nothing here is recorded.'
            : '當你覺得好慌、或者好似「唔喺度」咁，用五官逐樣拉自己返到當下。慢慢嚟，冇對錯，呢度亦唔會記錄任何嘢。'}
        </p>
      </div>

      {/* 進度：5-4-3-2-1 五點 */}
      <div className="flex items-center justify-center gap-2 mb-6" aria-hidden>
        {SENSES.map((s, i) => (
          <span
            key={s.n}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-colors ${
              i < step
                ? 'border-neon-cyan/40 text-neon-cyan/50'
                : i === step
                  ? 'border-neon-cyan text-neon-cyan'
                  : 'border-white/10 text-white/30'
            }`}
          >
            {s.n}
          </span>
        ))}
      </div>

      {current ? (
        <div
          key={step}
          className={`rounded-2xl bg-[#14141B] border border-white/10 p-8 text-center ${anim}`}
          role="group"
          aria-label={en ? `Step, notice ${current.n}` : `第 ${current.n} 步`}
        >
          <div className="text-4xl mb-4" aria-hidden>{current.icon}</div>
          <div className="text-neon-cyan text-5xl font-bold mb-3 tabular-nums">{current.n}</div>
          <p className="text-[#E8E8EC] text-base leading-relaxed mb-2">
            {en ? current.en : current.zh}
          </p>
          <p className="text-sm text-[#C2C2CC] leading-relaxed mb-7 max-w-sm mx-auto">
            {en ? current.hintEn : current.hintZh}
          </p>

          <div className="flex items-center justify-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="min-h-11 px-5 py-2.5 rounded-[10px] border border-white/20 text-white/70 text-sm hover:bg-white/10 transition-colors"
              >
                {en ? 'Back' : '返上一步'}
              </button>
            )}
            <button
              onClick={() => setStep((s) => s + 1)}
              className="min-h-11 px-6 py-2.5 rounded-[10px] border border-neon-cyan/50 text-neon-cyan text-sm hover:bg-neon-cyan/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
            >
              {step < SENSES.length - 1
                ? en ? 'I found them · next' : '搵到喇 · 下一步'
                : en ? 'Done' : '完成'}
            </button>
          </div>
        </div>
      ) : (
        // 收結畫面：安定語（同苦化城・常不輕菩薩），零指標、零評分
        <div className={`rounded-2xl bg-[#14141B] border border-neon-cyan/20 p-8 text-center ${anim}`}>
          <div className="text-4xl mb-4" aria-hidden>🕊️</div>
          <p className="text-[#E8E8EC] text-lg leading-relaxed mb-2">
            {en ? 'You are safe. You are here, in this moment.' : '你係安全嘅，你係而家呢一刻。'}
          </p>
          <p className="text-sm text-[#C2C2CC] leading-relaxed mb-7 max-w-sm mx-auto">
            {en
              ? 'That took guts. Do it again anytime you need — or just sit here for a while.'
              : '你做得好好。有需要隨時可以再嚟一次，或者就咁坐一陣都得。'}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setStep(0)}
              className="min-h-11 px-5 py-2.5 rounded-[10px] border border-neon-cyan/50 text-neon-cyan text-sm hover:bg-neon-cyan/10 transition-colors"
            >
              {en ? 'Do it again' : '再嚟一次'}
            </button>
            <button
              onClick={() => router.push('/relax')}
              className="min-h-11 px-5 py-2.5 rounded-[10px] border border-white/20 text-white/80 text-sm hover:bg-white/10 transition-colors"
            >
              {en ? 'Back to Breathing Space' : '返去呼吸空間'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
