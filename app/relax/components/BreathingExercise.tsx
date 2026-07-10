'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadSensoryPref } from './SensoryMenu'

// 全屏 4-7-8 呼吸 + SpeechSynthesis 語音引導（Ian 得獎方案）。
// - 語音：zh-HK → zh-TW → zh-CN，rate 0.8 / pitch 0.9，一掣靜音，不支援即降級純文字
// - prefers-reduced-motion：停用圓圈縮放，只顯示文字指示
// - SEN：無圈數統計、無成就、無壓力；醫療提示（哮喘）常駐
// 註：呢個係避風港嘅全屏版；/focus 卡片版（components/BreathingExercise.tsx）照舊。

type Phase = 'in' | 'hold' | 'out'
const PHASE_MS: Record<Phase, number> = { in: 4000, hold: 7000, out: 8000 }
const NEXT: Record<Phase, Phase> = { in: 'hold', hold: 'out', out: 'in' }
const LABEL: Record<Phase, string> = { in: '吸氣', hold: 'hold', out: '呼氣' }

export default function BreathingExercise() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('in')
  const [muted, setMuted] = useState(false)
  const [speechOk, setSpeechOk] = useState(false)
  const [reduced, setReduced] = useState(false)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  // 揀中文語音（voices 係非同步載入）
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSpeechOk(true)
    const pick = () => {
      const vs = window.speechSynthesis.getVoices()
      voiceRef.current =
        vs.find((v) => v.lang === 'zh-HK') ??
        vs.find((v) => v.lang === 'zh-TW') ??
        vs.find((v) => v.lang.startsWith('zh')) ??
        null
    }
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pick)
      window.speechSynthesis.cancel()
    }
  }, [])

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
      u.lang = voiceRef.current?.lang ?? 'zh-HK'
      u.rate = 0.8
      u.pitch = 0.9
      window.speechSynthesis.speak(u)
    } catch { /* 降級純文字 */ }
  }, [])

  // 相位循環 + 每次轉相位讀一次
  useEffect(() => {
    speak(LABEL[phase] === 'hold' ? 'hold' : LABEL[phase])
    const t = setTimeout(() => setPhase(NEXT[phase]), PHASE_MS[phase])
    return () => clearTimeout(t)
  }, [phase, speak])

  const expanded = phase === 'in' || phase === 'hold'

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(10,10,15,0.96)] flex flex-col items-center justify-center p-6">
      {/* 呼吸圈（reduced-motion 時唔縮放，只轉文字） */}
      <div className="flex items-center justify-center h-64 mb-6">
        <div
          className="w-20 h-20 rounded-full border-[3px] border-[#00F5D4] flex items-center justify-center"
          style={
            reduced
              ? undefined
              : {
                  transform: `scale(${expanded ? 1.8 : 1})`,
                  transition: `transform ${phase === 'hold' ? 300 : PHASE_MS[phase]}ms ease-in-out`,
                }
          }
        >
          <span className="text-sm text-[#E8E8EC]">{LABEL[phase]}</span>
        </div>
      </div>

      <p className="text-[13px] text-white/60 mb-1">4-7-8 呼吸法 · 跟住個圈{reduced ? '（已按系統設定停用動畫）' : ''}</p>
      <p className="text-xs text-white/50 mb-8 text-center max-w-xs leading-relaxed">
        如有呼吸系統疾病（如哮喘），請改為自然呼吸，唔好強迫深呼吸。
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            window.speechSynthesis?.cancel()
            router.push('/relax')
          }}
          className="min-h-11 px-5 py-2.5 rounded-[10px] border border-white/40 text-white/90 text-[13px] hover:bg-white/10 transition-colors"
        >
          結束呼吸
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
              muted ? 'border-white/20 text-white/50' : 'border-[#00F5D4]/50 text-[#00F5D4]'
            }`}
          >
            {muted ? '🔇 已靜音' : '🫁 語音引導中'}
          </button>
        )}
      </div>
      {!speechOk && <p className="text-[11px] text-white/40 mt-3">此瀏覽器不支援語音，已用純文字引導。</p>}

      {/* 緊急熱線（Sarah — NON-NEGOTIABLE）：全屏 overlay 遮住 layout 橫幅，
          所以喺 overlay 內再現一次，確保呼吸頁都「見到」 */}
      <p className="absolute bottom-4 left-4 right-4 text-center text-[11px] text-white/45 leading-relaxed">
        覺得頂唔順？撒瑪利亞會 24hr：<a href="tel:28960000" className="text-[#00F5D4]/80 underline underline-offset-2">2896 0000</a>
        {' · '}生命熱線：<a href="tel:23820000" className="text-[#00F5D4]/80 underline underline-offset-2">2382 0000</a>
        {' · '}緊急請致電 999
      </p>
    </div>
  )
}
