'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n'
import { loadSensoryPref } from './SensoryMenu'
import {
  PATTERNS,
  PHASE_LABELS,
  PHASE_COLOR,
  cycleMs,
  type BreathingPattern,
} from '@/lib/breathingPatterns'

// 全屏呼吸引導 + SpeechSynthesis 語音（Ian 得獎方案）。
// B3（2026-07-22）升級：由單一 4-7-8 擴充到三個節奏 —— 4-7-8 / 方形 / 5-5 平衡。
// - 語音：跟 locale 揀 en-* 或 zh-HK → zh-TW → zh，rate 0.8 / pitch 0.9，一掣靜音，不支援即降級純文字
// - prefers-reduced-motion：停用圓圈縮放，只顯示文字指示
// - SEN：無圈數評價、無成就、無壓力；醫療提示（哮喘）常駐
// 註：呢個係呼吸空間嘅全屏版；/focus 卡片版（components/BreathingExercise.tsx）照舊。

const TARGET_CYCLES = 5

export default function BreathingExercise() {
  const router = useRouter()
  const { locale } = useLocale()
  const en = locale === 'en'

  const [pattern, setPattern] = useState<BreathingPattern>(PATTERNS[0])
  const [stepIdx, setStepIdx] = useState(0)
  // 圈數用 ref 唔用 state —— 呢個數字【刻意唔顯示】。原組件已定嘅 SEN 原則係
  // 「無圈數統計」：畫面出住「第 3 / 5 次」會令放鬆練習變成一件要完成嘅任務。
  const cyclesRef = useRef(0)
  const [done, setDone] = useState(false)
  const [muted, setMuted] = useState(false)
  const [speechOk, setSpeechOk] = useState(false)
  const [reduced, setReduced] = useState(false)
  const mutedRef = useRef(muted)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  useEffect(() => { mutedRef.current = muted }, [muted])

  const step = pattern.cycle[stepIdx]
  const phase = step.phase

  // 揀語音（voices 係非同步載入）：英文揀 en-*，中文揀 zh-HK → zh-TW → zh
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSpeechOk(true)
    const pick = () => {
      const vs = window.speechSynthesis.getVoices()
      voiceRef.current = en
        ? vs.find((v) => v.lang === 'en-GB') ?? vs.find((v) => v.lang.startsWith('en')) ?? null
        : vs.find((v) => v.lang === 'zh-HK') ?? vs.find((v) => v.lang === 'zh-TW') ?? vs.find((v) => v.lang.startsWith('zh')) ?? null
    }
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pick)
      window.speechSynthesis.cancel()
    }
  }, [en])

  useEffect(() => {
    // 尊重系統 reduced-motion 之外，亦尊重用戶嘅感官偏好（Emma）：
    // 揀咗「安靜」→ 預設靜音語音；熄咗「畫面」→ 停用縮放動畫
    const pref = loadSensoryPref()
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches || pref?.visual === false)
    if (pref?.quiet) setMuted(true)
  }, [])

  const speak = useCallback((text: string) => {
    if (mutedRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel() // 唔好排隊疊聲
      const u = new SpeechSynthesisUtterance(text)
      if (voiceRef.current) u.voice = voiceRef.current
      u.lang = voiceRef.current?.lang ?? (en ? 'en-GB' : 'zh-HK')
      u.rate = 0.8
      u.pitch = 0.9
      window.speechSynthesis.speak(u)
    } catch { /* 降級純文字 */ }
  }, [en])

  // 相位循環 + 每次轉相位讀一次。用 setTimeout 排程相位（唔係做動畫 ——
  // 縮放本身係 CSS transition），行完一個完整循環先數一次。
  useEffect(() => {
    if (done) return
    speak(en ? PHASE_LABELS[phase].en : PHASE_LABELS[phase].zh)
    const t = setTimeout(() => {
      const next = stepIdx + 1
      if (next < pattern.cycle.length) {
        setStepIdx(next)
      } else {
        setStepIdx(0)
        cyclesRef.current += 1
        if (cyclesRef.current >= TARGET_CYCLES) setDone(true)
      }
    }, step.ms)
    return () => clearTimeout(t)
  }, [stepIdx, pattern, step.ms, phase, speak, en, done])

  const choosePattern = (p: BreathingPattern) => {
    window.speechSynthesis?.cancel()
    setPattern(p)
    setStepIdx(0)
    cyclesRef.current = 0
    setDone(false)
  }

  const leave = () => {
    window.speechSynthesis?.cancel()
    router.push('/relax')
  }

  // 「你照顧咗自己幾耐」用真實時長計，唔寫死「1 分鐘」
  const mins = Math.max(1, Math.round((cycleMs(pattern) * TARGET_CYCLES) / 60000))
  const expanded = phase === 'in' || phase === 'hold'

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(10,10,15,0.96)] flex flex-col items-center justify-center p-6">
      {done ? (
        <div className="text-center max-w-xs">
          <div className="text-3xl mb-4" aria-hidden>🕊️</div>
          <p className="text-[#E8E8EC] mb-2">
            {en ? 'Breathing done.' : '呼吸完成。'}
          </p>
          <p className="text-sm text-white/60 mb-8 leading-relaxed">
            {en
              ? `You just looked after yourself for about ${mins} minute${mins > 1 ? 's' : ''}.`
              : `你照顧咗自己大約 ${mins} 分鐘。`}
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => choosePattern(pattern)}
              className="min-h-11 px-5 py-2.5 rounded-[10px] border border-neon-cyan/50 text-neon-cyan text-[13px] hover:bg-neon-cyan/10 transition-colors"
            >
              {en ? 'Go again' : '再嚟一次'}
            </button>
            <button
              onClick={leave}
              className="min-h-11 px-5 py-2.5 rounded-[10px] border border-white/40 text-white/90 text-[13px] hover:bg-white/10 transition-colors"
            >
              {en ? 'Back to the Breathing Space' : '返呼吸空間'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 模式揀選 —— 描述場景，唔分難度、唔評價用家 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="group">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => choosePattern(p)}
                aria-pressed={p.id === pattern.id}
                className={`min-h-11 px-4 py-2 rounded-full border text-[13px] transition-colors ${
                  p.id === pattern.id
                    ? 'border-neon-cyan/60 text-neon-cyan bg-neon-cyan/10'
                    : 'border-white/25 text-white/60 hover:text-white/90'
                }`}
              >
                {en ? p.labelEn : p.labelZh}
              </button>
            ))}
          </div>

          {/* 呼吸圈（reduced-motion 時唔縮放，只轉文字） */}
          <div className="flex items-center justify-center h-64 mb-6">
            <div
              className="w-20 h-20 rounded-full border-[3px] flex items-center justify-center"
              style={{
                borderColor: PHASE_COLOR[phase],
                ...(reduced
                  ? {}
                  : {
                      transform: `scale(${expanded ? 1.8 : 1})`,
                      transition: `transform ${step.ms}ms ease-in-out, border-color 600ms ease`,
                    }),
              }}
            >
              <span className="text-sm text-[#E8E8EC]">
                {en ? PHASE_LABELS[phase].en : PHASE_LABELS[phase].zh}
              </span>
            </div>
          </div>

          <p className="text-[13px] text-white/60 mb-1 text-center">
            🌬️ {en ? p_when(pattern, true) : p_when(pattern, false)}
            {reduced ? (en ? ' (animation off per your system setting)' : '（已按系統設定停用動畫）') : ''}
          </p>
          <p className="text-xs text-white/50 mb-8 text-center max-w-xs leading-relaxed">
            {en
              ? 'If you have a respiratory condition (e.g. asthma), breathe naturally — don’t force deep breaths or hold.'
              : '如有呼吸系統疾病（如哮喘），請改為自然呼吸，唔好強迫深呼吸或屏息。'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={leave}
              className="min-h-11 px-5 py-2.5 rounded-[10px] border border-white/40 text-white/90 text-[13px] hover:bg-white/10 transition-colors"
            >
              {en ? 'End breathing' : '結束呼吸'}
            </button>
            {speechOk && (
              <button
                onClick={() => {
                  setMuted((v) => {
                    if (!v) window.speechSynthesis?.cancel()
                    return !v
                  })
                }}
                aria-pressed={muted}
                className={`min-h-11 px-5 py-2.5 rounded-[10px] border text-[13px] transition-colors ${
                  muted ? 'border-white/20 text-white/50' : 'border-neon-cyan/50 text-neon-cyan'
                }`}
              >
                {muted ? (en ? '🔇 Muted' : '🔇 已靜音') : en ? '🫁 Voice guiding' : '🫁 語音引導中'}
              </button>
            )}
          </div>
          {!speechOk && (
            <p className="text-[11px] text-white/40 mt-3">
              {en ? 'This browser doesn’t support speech; text guidance is used.' : '此瀏覽器不支援語音，已用純文字引導。'}
            </p>
          )}
        </>
      )}

      {/* 緊急熱線（Sarah — NON-NEGOTIABLE）：全屏 overlay 遮住 layout 橫幅，
          所以喺 overlay 內再現一次，確保呼吸頁都「見到」 */}
      <p className="absolute bottom-4 left-4 right-4 text-center text-[11px] text-white/45 leading-relaxed">
        {en ? 'Feeling overwhelmed? The Samaritans 24hr: ' : '覺得頂唔順？撒瑪利亞會 24hr：'}
        <a href="tel:28960000" className="text-neon-cyan/80 underline underline-offset-2">2896 0000</a>
        {' · '}{en ? 'Suicide Prevention: ' : '生命熱線：'}
        <a href="tel:23820000" className="text-neon-cyan/80 underline underline-offset-2">2382 0000</a>
        {' · '}{en ? 'In an emergency call 999' : '緊急請致電 999'}
      </p>
    </div>
  )
}

function p_when(p: BreathingPattern, en: boolean) {
  return en ? `${p.labelEn} · ${p.whenEn}` : `${p.labelZh} · ${p.whenZh}`
}
