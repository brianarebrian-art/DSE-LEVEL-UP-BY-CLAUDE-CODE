'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Play, Pause, RotateCcw, Share2, MessageCircle, Users } from 'lucide-react'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import { useLocale } from '@/lib/i18n'
import BreathingExercise from '@/components/BreathingExercise'

// WhatsApp 家長戰報已移除（創辦人 2026-07-21 決定）：撞 doc §3.1 禁 WhatsApp + 家長專區傾向。
// 番茄鐘計時、今日 tally、自律房間（含 study-together WhatsApp 邀請）全部保留。
const FOCUS_MIN = 25
const BREAK_MIN = 5

interface FocusToday {
  date: string
  minutes: number
  pomodoros: number
}
function todayKey(): string {
  return new Date().toDateString()
}
function loadFocusToday(): FocusToday {
  const date = todayKey()
  if (typeof window === 'undefined') return { date, minutes: 0, pomodoros: 0 }
  try {
    const raw = localStorage.getItem('dse_focus_today')
    const p = raw ? JSON.parse(raw) : null
    if (p && p.date === date) {
      return { date, minutes: Number(p.minutes) || 0, pomodoros: Number(p.pomodoros) || 0 }
    }
  } catch {
    /* ignore */
  }
  return { date, minutes: 0, pomodoros: 0 }
}
function saveFocusToday(s: FocusToday): void {
  try {
    localStorage.setItem('dse_focus_today', JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

function FocusRoom() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const router = useRouter()
  const params = useSearchParams()

  const [room, setRoom] = useState<string>('')
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60)
  const [running, setRunning] = useState(false)
  const [minutes, setMinutes] = useState(0)
  const [pomodoros, setPomodoros] = useState(0)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Resolve / create the room code (shareable via the URL — no backend, no sockets).
  useEffect(() => {
    const fromUrl = params.get('room')
    if (fromUrl) {
      setRoom(fromUrl)
    } else {
      const code = Math.random().toString(36).slice(2, 6).toUpperCase()
      setRoom(code)
      router.replace(`/focus?room=${code}`)
    }
  }, [params, router])

  // Restore today's accumulated focus.
  useEffect(() => {
    const f = loadFocusToday()
    setMinutes(f.minutes)
    setPomodoros(f.pomodoros)
  }, [])

  // Resolve the shareable URL after mount (window.location during render would
  // mismatch the server-rendered ''; this keeps hydration clean).
  useEffect(() => {
    if (typeof window !== 'undefined') setShareUrl(window.location.href)
  }, [room])

  // Countdown tick.
  useEffect(() => {
    if (!running) return
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [running])

  // Phase transition when the clock hits zero.
  useEffect(() => {
    if (secondsLeft > 0) return
    if (mode === 'focus') {
      const next: FocusToday = {
        date: todayKey(),
        minutes: minutes + FOCUS_MIN,
        pomodoros: pomodoros + 1,
      }
      setMinutes(next.minutes)
      setPomodoros(next.pomodoros)
      saveFocusToday(next)
      setMode('break')
      setSecondsLeft(BREAK_MIN * 60) // auto-roll into the break
    } else {
      setMode('focus')
      setSecondsLeft(FOCUS_MIN * 60)
      setRunning(false) // pause before the next focus block
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-shot on hitting 0
  }, [secondsLeft])

  const reset = useCallback(() => {
    setRunning(false)
    setMode('focus')
    setSecondsLeft(FOCUS_MIN * 60)
  }, [])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const total = (mode === 'focus' ? FOCUS_MIN : BREAK_MIN) * 60
  const pct = total > 0 ? ((total - secondsLeft) / total) * 100 : 0
  const inviteText = en
    ? `Studying together on DSE Level Up 🍅 Join my focus room: ${shareUrl}`
    : `一齊喺 DSE Level Up 自律操卷 🍅 入嚟我個專注房間：${shareUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the link is visible above anyway */
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-2 text-4xl">🍅</div>
        <h1 className="text-2xl font-medium text-center mb-1 text-ink">
          {en ? 'Focus Room' : '自律番茄鐘'}
        </h1>
        <p className="text-center text-ink-muted text-sm mb-8">
          {en ? '25 min focus · 5 min break' : '專注 25 分鐘 · 休息 5 分鐘'}
        </p>

        {/* Timer card */}
        <div className="bg-surface-raised border border-line rounded-3xl p-8 mb-5 text-center">
          <div
            className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-5 ${
              mode === 'focus'
                ? 'text-gold bg-gold/10 border border-gold/20'
                : 'text-accent bg-accent/10 border border-accent/20'
            }`}
          >
            {mode === 'focus' ? (en ? '🎯 Focus' : '🎯 專注中') : en ? '☕ Break' : '☕ 小休'}
          </div>

          <div className="text-6xl font-medium tabular-nums mb-5 tracking-tight text-ink">{fmt(secondsLeft)}</div>

          <div className="h-1.5 bg-line rounded-full overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-500 ${mode === 'focus' ? 'bg-gold' : 'bg-accent'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-6 py-3 rounded-xl transition-all"
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? (en ? 'Pause' : '暫停') : en ? 'Start' : '開始'}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-surface-raised hover:bg-surface-sunken border border-line-strong text-ink-soft px-4 py-3 rounded-xl transition-all text-sm"
            >
              <RotateCcw size={16} /> {en ? 'Reset' : '重設'}
            </button>
          </div>
        </div>

        {/* Today's tally */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-raised border border-line rounded-2xl p-4 text-center">
            <div className="text-2xl font-medium text-accent" style={{ fontVariantNumeric: 'tabular-nums' }}>{minutes}</div>
            <div className="text-xs text-ink-muted mt-1">{en ? 'Focus min today' : '今日專注（分鐘）'}</div>
          </div>
          <div className="bg-surface-raised border border-line rounded-2xl p-4 text-center">
            <div className="text-2xl font-medium text-accent" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {pomodoros}
            </div>
            <div className="text-xs text-ink-muted mt-1">{en ? 'Pomodoros' : '番茄鐘'}</div>
          </div>
        </div>

        {/* Room — URL-based "study together", honest about no real-time sync */}
        <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-accent" />
            <span className="font-medium text-sm text-ink">{en ? 'Study room' : '自律房間'}</span>
            <span className="ml-auto font-mono text-accent text-lg tracking-widest">{room || '····'}</span>
          </div>
          <p className="text-[11px] text-ink-muted mb-4 leading-relaxed">
            {en
              ? 'Share the link so classmates join the same room code. Each person keeps their own timer (no server / no live sync) — it’s a shared commitment, not a video call.'
              : 'share 條 link 俾同學，大家入同一個房號一齊溫。各自計時（純前端、冇即時同步）—— 係一種互相監督嘅約定，唔係視像通話。'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-surface-raised hover:bg-surface-sunken border border-line-strong text-ink-soft px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <Share2 size={15} /> {copied ? (en ? 'Copied!' : '已複製！') : en ? 'Copy link' : '複製連結'}
            </button>
            <ExternalLinkGate
              href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}
              platform="WhatsApp"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-strong hover:bg-accent-strong text-on-accent font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <MessageCircle size={15} /> WhatsApp
            </ExternalLinkGate>
          </div>
        </div>

        {/* 情緒急救：4-7-8 呼吸練習（小休或攰嘅時候用） */}
        <div className="mt-5">
          <BreathingExercise />
        </div>

        {/* 呼吸空間入口 */}
        <a
          href="/relax"
          className="mt-5 block text-center text-sm text-ink-muted hover:text-accent border border-line-strong hover:border-accent/40 rounded-xl py-3 min-h-11 transition-all"
        >
          🌬️ {en ? 'Really wiped today? Go to the Breathing Space and rest up →' : '今日真係好攰？去呼吸空間唞一唞 →'}
        </a>
      </div>
    </div>
  )
}

export default function FocusClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-ink-muted">…</div>}>
      <FocusRoom />
    </Suspense>
  )
}
