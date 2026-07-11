'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { loadSensoryPref } from './SensoryMenu'
import NowPlayingBar from './NowPlayingBar'

// 🎧 單排補 MP — 官方 YouTube 電台（Lo-fi／落雨）+ Web Audio 雙耳節拍 + 番茄鐘。
// 版權紅線：除官方 YouTube-nocookie iframe 外，所有聲音一律程序生成（原創、零檔案，
// 無本地 MP3、無第三方 CDN 音頻）。全部淡入，冇突發聲響（SEN）。同一時間只播一段；
// 離開頁面自動停。誠實聲明：雙耳節拍效果因人而異，文案唔會作醫療級聲稱。

type TrackId = 'lofi' | 'rain' | 'binaural' | 'pomodoro'

const POMODORO_MIN = 25

// 官方影片嵌入（YouTube-nocookie，rel=0，只在播放時載入 iframe，私隱優先）。
// ⚠️ 一定要用「常規上載影片」ID，唔好用直播（live）—— 直播 ID 會輪替，結束後變成無法
// 嵌入嘅「錄影存檔」（就係之前 Lo-fi 播唔到嘅原因）。以下兩條都係長青上載片，ID 穩定。
const YT: Record<'lofi' | 'rain', { src: string; open: string; thumb?: string }> = {
  lofi: {
    // Lofi Girl「1 A.M Study Session」—— 經典上載片（非直播），ID 穩定、可嵌入。
    src: 'https://www.youtube-nocookie.com/embed/lTRiuFIWV54?autoplay=1&rel=0',
    open: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    thumb: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
  },
  rain: {
    src: 'https://www.youtube-nocookie.com/embed/nMfPqeZjc2c?autoplay=1&rel=0',
    open: 'https://www.youtube.com/watch?v=nMfPqeZjc2c',
    thumb: 'https://i.ytimg.com/vi/nMfPqeZjc2c/hqdefault.jpg',
  },
}

export default function SoloPlayer() {
  const [playing, setPlaying] = useState<TrackId | null>(null)
  const [quietMode, setQuietMode] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [pomodoroLeft, setPomodoroLeft] = useState(POMODORO_MIN * 60)
  const [stereoOk, setStereoOk] = useState(true)
  const [binauralVol, setBinauralVol] = useState(6) // 預設 6%（回應「蚊子聲」：低音量純 sine）

  const ctxRef = useRef<AudioContext | null>(null)
  const teardownRef = useRef<(() => void) | null>(null)
  const pomodoroTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const binauralGainRef = useRef<GainNode | null>(null)

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
    binauralGainRef.current = null
    if (pomodoroTimer.current) clearInterval(pomodoroTimer.current)
    pomodoroTimer.current = null
    setPomodoroLeft(POMODORO_MIN * 60)
    setPlaying(null)
  }

  function fadeOutStop(ctx: AudioContext, gain: GainNode, stops: (() => void)[]) {
    const t = ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.6)
    setTimeout(() => stops.forEach((s) => { try { s() } catch { /* already stopped */ } }), 700)
  }

  // ── 雙耳節拍：左 200Hz、右 240Hz（40Hz 差頻，gamma），純 sine，預設 6% ──
  function playBinaural() {
    const ctx = ensureCtx()
    const gain = ctx.createGain()
    const target = binauralVol / 100
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 3) // 3 秒淡入
    binauralGainRef.current = gain
    const mk = (freq: number, pan: number) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq // 載波 200Hz，差頻端 240Hz —— 兩者皆 < 300Hz
      const p = new StereoPannerNode(ctx, { pan })
      osc.connect(p).connect(gain)
      osc.start()
      return osc
    }
    const l = mk(200, -1)
    const r = mk(240, 1)
    gain.connect(ctx.destination)
    teardownRef.current = () => fadeOutStop(ctx, gain, [() => l.stop(), () => r.stop()])
  }

  // 現場調整雙耳節拍音量（平滑，避免爆音）
  function setVol(v: number) {
    setBinauralVol(v)
    const g = binauralGainRef.current
    if (g && ctxRef.current) g.gain.setTargetAtTime(v / 100, ctxRef.current.currentTime, 0.05)
  }

  // ── 番茄鐘：Cmaj7 正弦和弦墊（C4/E4/G4/B4），25 分鐘，尾段 10 秒漸弱 ──
  function playPomodoro() {
    const ctx = ensureCtx()
    const master = ctx.createGain()
    const t0 = ctx.currentTime
    const total = POMODORO_MIN * 60
    master.gain.setValueAtTime(0, t0)
    master.gain.linearRampToValueAtTime(1, t0 + 3)
    master.gain.setValueAtTime(1, t0 + total - 10)
    master.gain.linearRampToValueAtTime(0, t0 + total)
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
    if (id === 'binaural') playBinaural()
    else if (id === 'pomodoro') playPomodoro()
    // lofi / rain：純 YouTube iframe，無 Web Audio
    setPlaying(id)
  }

  const TRACKS: { id: TrackId; emoji: string; tint: string; name: string; desc: string }[] = [
    { id: 'lofi', emoji: '🎹', tint: 'bg-[#00F5D4]/15', name: '深夜 Lo-fi 電台', desc: '鋼琴 + 雨聲 · 背書前平靜個心（Lofi Girl 官方影片）' },
    { id: 'rain', emoji: '🌧️', tint: 'bg-emerald-400/15', name: '落雨白噪音 · 回藍', desc: '真實雨聲 · 做完卷減壓（官方長時影片）' },
    { id: 'binaural', emoji: '🧘', tint: 'bg-[#9B5DE5]/15', name: '低頻專注 Buff（雙耳節拍）', desc: '低頻穩定節奏 · 有人覺得幫到專注（效果因人而異，請戴耳機）' },
    { id: 'pomodoro', emoji: '⏳', tint: 'bg-[#FF006E]/15', name: '25 分鐘專注 combo（番茄鐘）', desc: '輕音樂漸弱提醒 · 唔使驚倒數壓力' },
  ]

  const names: Record<TrackId, string> = {
    lofi: '深夜 Lo-fi 電台', rain: '落雨白噪音 · 回藍', binaural: '低頻專注 Buff', pomodoro: '25 分鐘專注 combo',
  }

  if (quietMode) {
    return (
      <div className="text-center py-10">
        <div className="text-2xl mb-3" aria-hidden>🔇</div>
        <p className="text-[#E8E8EC] mb-2">你揀咗「安靜模式」，呢度唔會有任何聲音。</p>
        <p className="text-sm text-[#8B8B96] mb-6">可以試下純文字嘅回藥術（呼吸練習），或者返主頁改返感官偏好。</p>
        <Link
          href="/relax/breathing"
          className="inline-flex min-h-11 items-center rounded-[10px] border border-[#00F5D4]/30 text-[#00F5D4] text-sm px-5 py-3 hover:bg-[#00F5D4]/10 transition-colors"
        >
          🌬️ 靜音回藥術
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* 頻譜條動畫（scoped keyframe；motion-reduce 自動停用） */}
      <style>{`
        @keyframes buffEq { 0%,100% { transform: scaleY(0.35) } 50% { transform: scaleY(1) } }
        .buff-eq-bar { transform-origin: bottom; animation: buffEq 900ms ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .buff-eq-bar { animation: none; transform: scaleY(0.6) } }
      `}</style>

      <div className="space-y-3 mb-4">
        {TRACKS.map((t) => {
          const on = playing === t.id
          const isYt = t.id === 'lofi' || t.id === 'rain'
          return (
            <div key={t.id} className={`rounded-xl bg-[#14141B] border transition-colors ${on ? 'border-[#00F5D4]/50' : 'border-white/10'}`}>
              <button
                onClick={() => select(t.id)}
                aria-pressed={on}
                className="w-full min-h-11 flex items-center gap-3 text-left p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4] rounded-xl"
              >
                {/* 有固定 video ID 嘅 YT 曲目顯示官方縮圖；頻道跟隨／生成類曲目用霓虹色塊 */}
                {isYt && YT[t.id as 'lofi' | 'rain'].thumb ? (
                  <span className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={YT[t.id as 'lofi' | 'rain'].thumb} alt="" className="w-full h-full object-cover" />
                    {!on && <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm" aria-hidden>▶</span>}
                  </span>
                ) : (
                  <span className={`w-10 h-10 rounded-lg ${t.tint} flex items-center justify-center text-lg shrink-0`} aria-hidden>{t.emoji}</span>
                )}
                <span className="flex-1">
                  <span className="block text-sm font-medium text-[#E8E8EC]">{t.name}</span>
                  <span className="block text-xs text-[#8B8B96] mt-0.5">{t.desc}</span>
                </span>
                <span className="text-xs text-[#00F5D4] shrink-0">{on ? '停止' : '播放'}</span>
              </button>

              {/* YT：播放時載入官方 iframe + 「喺 YouTube 開」後備（萬一嵌入播唔到） */}
              {isYt && on && (
                <div className="px-4 pb-4">
                  <iframe
                    className="w-full aspect-video rounded-lg border border-white/10"
                    src={YT[t.id as 'lofi' | 'rain'].src}
                    title={t.name}
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                  <a
                    href={YT[t.id as 'lofi' | 'rain'].open}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-[#8B8B96] hover:text-[#00F5D4] underline underline-offset-2"
                  >
                    ▶ 播唔到？喺 YouTube 開
                  </a>
                </div>
              )}

              {/* 雙耳節拍：頻譜條 + 霓虹漸層音量滑條 */}
              {t.id === 'binaural' && on && (
                <div className="px-4 pb-4">
                  {!stereoOk && (
                    <p className="text-xs text-amber-300/80 mb-2">此裝置似乎只有單聲道輸出——請使用耳機以獲得雙耳節拍效果。</p>
                  )}
                  <div className="flex items-end justify-center gap-1 h-10 mb-3" aria-hidden>
                    {[0.5, 0.9, 0.4, 1, 0.6, 0.85, 0.45, 0.75, 0.55].map((h, i) => (
                      <span
                        key={i}
                        className="buff-eq-bar w-1.5 rounded-full bg-gradient-to-t from-[#00F5D4] to-[#9B5DE5]"
                        style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
                      />
                    ))}
                  </div>
                  <label className="block text-[11px] text-[#8B8B96] mb-1">音量 · {binauralVol}%</label>
                  <input
                    type="range" min={0} max={12} step={1} value={binauralVol}
                    onChange={(e) => setVol(Number(e.target.value))}
                    aria-label="雙耳節拍音量"
                    className="w-full accent-[#FF006E] rounded-full"
                    style={{ background: 'linear-gradient(90deg,#00F5D4,#FF006E,#9B5DE5)' }}
                  />
                </div>
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
