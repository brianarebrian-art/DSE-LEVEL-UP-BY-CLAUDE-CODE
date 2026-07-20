'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Play, Pause, RotateCcw, Share2, MessageCircle, Users, Send } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import BreathingExercise from '@/components/BreathingExercise'

const FOCUS_MIN = 25
const BREAK_MIN = 5
const GOAL_POMODOROS = 4 // 4 × 25 = 100 min deep focus → parent report becomes sendable

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
  const unlocked = pomodoros >= GOAL_POMODOROS

  const inviteText = en
    ? `Studying together on DSE Level Up 🍅 Join my focus room: ${shareUrl}`
    : `一齊喺 DSE Level Up 自律操卷 🍅 入嚟我個專注房間：${shareUrl}`
  const reportText = en
    ? `📚 Self-discipline report: I focused ${minutes} min (${pomodoros} pomodoros) today on DSE Level Up — helping mum save the tutoring fees 💪 ${shareUrl}`
    : `📚 自律戰報：我今日喺 DSE Level Up 專注咗 ${minutes} 分鐘（${pomodoros} 個番茄鐘），幫阿媽慳返私補堂費 💪 ${shareUrl}`

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
    <div className="min-h-screen px-4 py-12 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-2 text-4xl">🍅</div>
        <h1 className="text-2xl font-medium text-center mb-1 text-[#1A1A1A]">
          {en ? 'Focus Room' : '自律番茄鐘'}
        </h1>
        <p className="text-center text-[#6B6B6B] text-sm mb-8">
          {en ? '25 min focus · 5 min break' : '專注 25 分鐘 · 休息 5 分鐘'}
        </p>

        {/* Timer card */}
        <div className="bg-white border border-black/[0.06] rounded-3xl p-8 mb-5 text-center">
          <div
            className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-5 ${
              mode === 'focus'
                ? 'text-[#B8860B] bg-[#B8860B]/10 border border-[#B8860B]/20'
                : 'text-[#008B84] bg-[#008B84]/10 border border-[#008B84]/20'
            }`}
          >
            {mode === 'focus' ? (en ? '🎯 Focus' : '🎯 專注中') : en ? '☕ Break' : '☕ 小休'}
          </div>

          <div className="text-6xl font-medium tabular-nums mb-5 tracking-tight text-[#1A1A1A]">{fmt(secondsLeft)}</div>

          <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-500 ${mode === 'focus' ? 'bg-[#B8860B]' : 'bg-[#008B84]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-6 py-3 rounded-xl transition-all"
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? (en ? 'Pause' : '暫停') : en ? 'Start' : '開始'}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#2D2D2D] px-4 py-3 rounded-xl transition-all text-sm"
            >
              <RotateCcw size={16} /> {en ? 'Reset' : '重設'}
            </button>
          </div>
        </div>

        {/* Today's tally */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white border border-black/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-medium text-[#008B84]" style={{ fontVariantNumeric: 'tabular-nums' }}>{minutes}</div>
            <div className="text-xs text-[#6B6B6B] mt-1">{en ? 'Focus min today' : '今日專注（分鐘）'}</div>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-2xl p-4 text-center">
            <div className="text-2xl font-medium text-[#008B84]" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {pomodoros}
              <span className="text-sm text-[#9CA3AF] font-normal"> / {GOAL_POMODOROS}</span>
            </div>
            <div className="text-xs text-[#6B6B6B] mt-1">{en ? 'Pomodoros' : '番茄鐘'}</div>
          </div>
        </div>

        {/* Room — URL-based "study together", honest about no real-time sync */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-[#008B84]" />
            <span className="font-medium text-sm text-[#1A1A1A]">{en ? 'Study room' : '自律房間'}</span>
            <span className="ml-auto font-mono text-[#008B84] text-lg tracking-widest">{room || '····'}</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mb-4 leading-relaxed">
            {en
              ? 'Share the link so classmates join the same room code. Each person keeps their own timer (no server / no live sync) — it’s a shared commitment, not a video call.'
              : 'share 條 link 俾同學，大家入同一個房號一齊溫。各自計時（純前端、冇即時同步）—— 係一種互相監督嘅約定，唔係視像通話。'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#2D2D2D] px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <Share2 size={15} /> {copied ? (en ? 'Copied!' : '已複製！') : en ? 'Copy link' : '複製連結'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0e6f64] text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>

        {/* 家長戰報：做夠 100 分鐘（4 個番茄鐘）即可一鍵發送。純功能性門檻 ——
            冇「勳章／解鎖／成就」等 gamification 框架（憲章 §2）；只係一個「做夠先報」嘅合理閘。 */}
        <div
          className={`rounded-2xl p-5 border text-center transition-all ${
            unlocked ? 'bg-[#008B84]/[0.08] border-[#008B84]/40' : 'bg-white border-black/[0.06] opacity-80'
          }`}
        >
          <Send size={22} className={`mx-auto mb-2 ${unlocked ? 'text-[#008B84]' : 'text-[#9CA3AF]'}`} />
          <div className="font-medium mb-1 text-[#1A1A1A]">
            {en ? 'Parent report' : '家長戰報'}
            <span className="text-[#6B6B6B] font-normal"> · {pomodoros}/{GOAL_POMODOROS}</span>
          </div>
          <p className="text-xs text-[#6B6B6B] mb-4">
            {unlocked
              ? en
                ? '100 minutes done — send today’s focus report to your parents in one tap.'
                : '做夠 100 分鐘啦，一鍵將今日專注戰報發俾家長。'
              : en
                ? `Complete ${GOAL_POMODOROS} pomodoros (100 min) and you can send the parent report.`
                : `完成 ${GOAL_POMODOROS} 個番茄鐘（100 分鐘），就可以發送家長戰報。`}
          </p>
          <a
            href={unlocked ? `https://wa.me/?text=${encodeURIComponent(reportText)}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!unlocked}
            onClick={(e) => {
              if (!unlocked) e.preventDefault()
            }}
            className={`inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-xl transition-all w-full ${
              unlocked
                ? 'bg-[#128C7E] hover:bg-[#0e6f64] text-white'
                : 'bg-[#F5F5F0] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <MessageCircle size={18} /> {en ? 'Send report to parents' : '一鍵發送家長戰報'}
          </a>
        </div>

        {/* 情緒急救：4-7-8 呼吸練習（小休或攰嘅時候用） */}
        <div className="mt-5">
          <BreathingExercise />
        </div>

        {/* 呼吸空間入口 */}
        <a
          href="/relax"
          className="mt-5 block text-center text-sm text-[#6B6B6B] hover:text-[#008B84] border border-black/[0.10] hover:border-[#008B84]/40 rounded-xl py-3 min-h-11 transition-all"
        >
          🌬️ {en ? 'Really wiped today? Go to the Breathing Space and rest up →' : '今日真係好攰？去呼吸空間唞一唞 →'}
        </a>
      </div>
    </div>
  )
}

export default function FocusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#6B6B6B]">…</div>}>
      <FocusRoom />
    </Suspense>
  )
}
