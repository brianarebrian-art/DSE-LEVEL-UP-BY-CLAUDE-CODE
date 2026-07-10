'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { loadSensoryPref } from './SensoryMenu'
import NowPlayingBar from './NowPlayingBar'

// 自己靜靜地 — 四段聲音（Ian/Web Audio）。版權紅線：除官方 YouTube iframe 外，
// 所有聲音一律程序生成（原創、零檔案）；全部 3 秒淡入，冇突發聲響（SEN）。
// 同一時間只播一段；離開頁面自動停。
//
// 誠實聲明：雙耳節拍（binaural beat）研究證據好參差，效果因人而異——
// 文案唔會作出任何醫療級聲稱。

type TrackId = 'lofi' | 'pink' | 'binaural' | 'pomodoro'

const POMODORO_MIN = 25

export default function SoloPlayer() {
  const [playing, setPlaying] = useState<TrackId | null>(null)
  const [quietMode, setQuietMode] = useState(false)
  const [showTime, setShowTime] = useState(false) // 番茄鐘：預設隱藏倒數（減焦慮）
  const [pomodoroLeft, setPomodoroLeft] = useState(POMODORO_MIN * 60)
  const [stereoOk, setStereoOk] = useState(true)

  const ctxRef = useRef<AudioContext | null>(null)
  const teardownRef = useRef<(() => void) | null>(null)
  const pomodoroTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const p = loadSensoryPref()
    if (p && (p.quiet || !p.sound)) setQuietMode(true)
    return () => stopAll() // 離開頁面即停
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function ensureCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
      setStereoOk(ctxRef.current.destination.maxChannelCount >= 2)
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }

  function stopAll() {
    teardownRef.current?.()
    teardownRef.current = null
    if (pomodoroTimer.current) clearInterval(pomodoroTimer.current)
    pomodoroTimer.current = null
    setPomodoroLeft(POMODORO_MIN * 60)
    setPlaying(null)
  }

  // 淡出後停止（0.6s），避免爆音
  function fadeOutStop(ctx: AudioContext, gain: GainNode, stops: (() => void)[]) {
    const t = ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.6)
    setTimeout(() => stops.forEach((s) => { try { s() } catch { /* already stopped */ } }), 700)
  }

  // ── Pink Noise（1/f，Paul Kellet 濾波）：4 秒循環 buffer，程序生成原創 ──
  function playPink() {
    const ctx = ensureCtx()
    const len = ctx.sampleRate * 4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3) // 3 秒淡入
    src.connect(gain).connect(ctx.destination)
    src.start()
    teardownRef.current = () => fadeOutStop(ctx, gain, [() => src.stop()])
  }

  // ── 雙耳節拍：左 200Hz、右 210Hz（10Hz 差頻），必須立體聲 ──
  function playBinaural() {
    const ctx = ensureCtx()
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3)
    const mk = (freq: number, pan: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq // 20Hz–20kHz 可聽範圍內
      const p = new StereoPannerNode(ctx, { pan })
      osc.connect(p).connect(gain)
      osc.start()
      return osc
    }
    const l = mk(200, -1)
    const r = mk(210, 1)
    gain.connect(ctx.destination)
    teardownRef.current = () => fadeOutStop(ctx, gain, [() => l.stop(), () => r.stop()])
  }

  // ── 番茄鐘音樂：Cmaj7 正弦和弦墊（C4/E4/G4/B4），25 分鐘，尾段 10 秒漸弱 ──
  function playPomodoro() {
    const ctx = ensureCtx()
    const master = ctx.createGain()
    const t0 = ctx.currentTime
    const total = POMODORO_MIN * 60
    master.gain.setValueAtTime(0, t0)
    master.gain.linearRampToValueAtTime(1, t0 + 3)
    master.gain.setValueAtTime(1, t0 + total - 10)
    master.gain.linearRampToValueAtTime(0, t0 + total) // 10 秒溫柔漸弱提醒
    const oscs = [261.63, 329.63, 392.0, 493.88].map((f) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = 0.035
      osc.connect(g).connect(master)
      osc.start()
      osc.stop(t0 + total + 0.5)
      return osc
    })
    master.connect(ctx.destination)
    setPomodoroLeft(total)
    pomodoroTimer.current = setInterval(() => {
      setPomodoroLeft((s) => {
        if (s <= 1) { stopAll(); return POMODORO_MIN * 60 }
        return s - 1
      })
    }, 1000)
    teardownRef.current = () => fadeOutStop(ctx, master, oscs.map((o) => () => o.stop()))
  }

  function select(id: TrackId) {
    if (playing === id) { stopAll(); return }
    stopAll()
    if (id === 'pink') playPink()
    else if (id === 'binaural') playBinaural()
    else if (id === 'pomodoro') playPomodoro()
    // lofi：純 iframe，無 Web Audio
    setPlaying(id)
  }

  const TRACKS: { id: TrackId; emoji: string; tint: string; name: string; desc: string }[] = [
    { id: 'lofi', emoji: '🎹', tint: 'bg-[#00F5D4]/15', name: '深夜溫書 Lo-fi', desc: '鋼琴 + 雨聲 · 適合背書前平靜心情' },
    { id: 'pink', emoji: '🌧️', tint: 'bg-emerald-400/15', name: 'Pink Noise：海邊風聲', desc: '自然頻譜 · 適合做完卷後減壓' },
    { id: 'binaural', emoji: '🧘', tint: 'bg-white/10', name: '低頻雙耳節拍', desc: '低頻穩定節奏 · 有人覺得幫到專注（效果因人而異，請戴耳機）' },
    { id: 'pomodoro', emoji: '⏳', tint: 'bg-[#9B5DE5]/15', name: '25 分鐘番茄鐘音樂', desc: '輕音樂漸弱提醒 · 唔使驚倒數壓力' },
  ]

  const names: Record<TrackId, string> = { lofi: '深夜溫書 Lo-fi', pink: 'Pink Noise：海邊風聲', binaural: '低頻雙耳節拍', pomodoro: '25 分鐘番茄鐘音樂' }

  if (quietMode) {
    return (
      <div className="text-center py-10">
        <div className="text-2xl mb-3" aria-hidden>🔇</div>
        <p className="text-[#E8E8EC] mb-2">你揀咗「安靜模式」，呢度唔會有任何聲音。</p>
        <p className="text-sm text-[#8B8B96] mb-6">可以試下純文字嘅呼吸練習，或者返主頁改返感官偏好。</p>
        <Link
          href="/relax/breathing"
          className="inline-flex min-h-11 items-center rounded-[10px] border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-5 py-3 hover:bg-[#00F5D4]/10 transition-colors"
        >
          🫁 靜音呼吸練習
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {TRACKS.map((t) => {
          const on = playing === t.id
          return (
            <div key={t.id} className={`rounded-xl bg-[#14141B] border transition-colors ${on ? 'border-[#00F5D4]/50' : 'border-white/10'}`}>
              <button
                onClick={() => select(t.id)}
                aria-pressed={on}
                className="w-full min-h-11 flex items-center gap-3 text-left p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4] rounded-xl"
              >
                <span className={`w-10 h-10 rounded-lg ${t.tint} flex items-center justify-center text-lg shrink-0`} aria-hidden>{t.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-[#E8E8EC]">{t.name}</span>
                  <span className="block text-xs text-[#8B8B96] mt-0.5">{t.desc}</span>
                </span>
                <span className="text-xs text-[#00F5D4] shrink-0">{on ? '停止' : '播放'}</span>
              </button>

              {/* Lo-fi：只在播放時載入官方 nocookie iframe（rel=0；私隱優先） */}
              {t.id === 'lofi' && on && (
                <div className="px-4 pb-4">
                  <iframe
                    className="w-full aspect-video rounded-lg border border-white/10"
                    src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&rel=0"
                    title="Lo-fi 溫書音樂（官方嵌入）"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              )}

              {t.id === 'binaural' && on && !stereoOk && (
                <p className="px-4 pb-3 text-xs text-amber-300/80">此裝置似乎只有單聲道輸出——請使用耳機以獲得雙耳節拍效果。</p>
              )}

              {t.id === 'pomodoro' && on && (
                <div className="px-4 pb-4">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#9B5DE5]/70 rounded-full transition-all duration-1000"
                      style={{ width: `${(100 * (POMODORO_MIN * 60 - pomodoroLeft)) / (POMODORO_MIN * 60)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8B8B96]">
                    <span>{showTime ? `剩餘 ${Math.floor(pomodoroLeft / 60)}:${String(pomodoroLeft % 60).padStart(2, '0')}` : '進行中 · 唔使數住時間'}</span>
                    <button onClick={() => setShowTime((v) => !v)} className="min-h-11 px-2 underline underline-offset-2 hover:text-[#E8E8EC]">
                      {showTime ? '隱藏剩餘時間' : '顯示剩餘時間'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <NowPlayingBar name={playing ? names[playing] : null} onStop={stopAll} />
    </div>
  )
}
