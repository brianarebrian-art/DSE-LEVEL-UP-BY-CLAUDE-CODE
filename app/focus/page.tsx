'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Play, Pause, RotateCcw, Share2, MessageCircle, Users, Award } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import BreathingExercise from '@/components/BreathingExercise'

const FOCUS_MIN = 25
const BREAK_MIN = 5
const GOAL_POMODOROS = 4 // 4 × 25 = 100 min deep focus → unlock the badge

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
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-2 text-4xl">🍅</div>
        <h1 className="text-2xl font-extrabold text-center mb-1">
          {en ? 'Focus Room' : '自律番茄鐘'}
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">
          {en ? '25 min focus · 5 min break' : '專注 25 分鐘 · 休息 5 分鐘'}
        </p>

        {/* Timer card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-5 text-center">
          <div
            className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-5 ${
              mode === 'focus'
                ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                : 'text-sky-400 bg-sky-400/10 border border-sky-400/20'
            }`}
          >
            {mode === 'focus' ? (en ? '🎯 Focus' : '🎯 專注中') : en ? '☕ Break' : '☕ 小休'}
          </div>

          <div className="text-6xl font-extrabold tabular-nums mb-5 tracking-tight">{fmt(secondsLeft)}</div>

          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-all duration-500 ${mode === 'focus' ? 'bg-amber-500' : 'bg-sky-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? (en ? 'Pause' : '暫停') : en ? 'Start' : '開始'}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 rounded-xl transition-all text-sm"
            >
              <RotateCcw size={16} /> {en ? 'Reset' : '重設'}
            </button>
          </div>
        </div>

        {/* Today's tally */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-400">{minutes}</div>
            <div className="text-xs text-slate-500 mt-1">{en ? 'Focus min today' : '今日專注（分鐘）'}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-400">
              {pomodoros}
              <span className="text-sm text-slate-500 font-normal"> / {GOAL_POMODOROS}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{en ? 'Pomodoros' : '番茄鐘'}</div>
          </div>
        </div>

        {/* Room — URL-based "study together", honest about no real-time sync */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-sky-400" />
            <span className="font-bold text-sm">{en ? 'Study room' : '自律房間'}</span>
            <span className="ml-auto font-mono text-amber-400 text-lg tracking-widest">{room || '····'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
            {en
              ? 'Share the link so classmates join the same room code. Each person keeps their own timer (no server / no live sync) — it’s a shared commitment, not a video call.'
              : 'share 條 link 俾同學，大家入同一個房號一齊溫。各自計時（純前端、冇即時同步）—— 係一種互相監督嘅約定，唔係視像通話。'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <Share2 size={15} /> {copied ? (en ? 'Copied!' : '已複製！') : en ? 'Copy link' : '複製連結'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600/90 hover:bg-green-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Self-discipline badge + parent report (unlocks at 4 pomodoros) */}
        <div
          className={`rounded-2xl p-5 border text-center transition-all ${
            unlocked ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900 border-slate-800 opacity-70'
          }`}
        >
          <Award size={26} className={`mx-auto mb-2 ${unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
          <div className="font-bold mb-1">
            {unlocked
              ? en
                ? '🏅 Self-Discipline Medal unlocked!'
                : '🏅 解鎖「自律勳章」！'
              : en
                ? `Self-Discipline Medal · ${pomodoros}/${GOAL_POMODOROS}`
                : `自律勳章 · ${pomodoros}/${GOAL_POMODOROS}`}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            {unlocked
              ? en
                ? 'Send today’s battle report to your parents in one tap.'
                : '一鍵將今日嘅自律戰報發俾家長。'
              : en
                ? `Complete ${GOAL_POMODOROS} pomodoros (100 min) to unlock the parent report.`
                : `完成 ${GOAL_POMODOROS} 個番茄鐘（100 分鐘）即解鎖家長戰報。`}
          </p>
          <a
            href={unlocked ? `https://wa.me/?text=${encodeURIComponent(reportText)}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!unlocked}
            onClick={(e) => {
              if (!unlocked) e.preventDefault()
            }}
            className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all w-full ${
              unlocked
                ? 'bg-green-500 hover:bg-green-400 text-black'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <MessageCircle size={18} /> {en ? 'Send report to parents' : '一鍵發送家長戰報'}
          </a>
        </div>

        {/* 情緒急救：4-7-8 呼吸練習（小休或攰嘅時候用） */}
        <BreathingExercise />

        {/* 化城避風港入口 */}
        <a
          href="/relax"
          className="block text-center text-sm text-slate-500 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 rounded-xl py-3 transition-all"
        >
          🏮 今日真係好攰？入化城避風港唞返夠先 →
        </a>
      </div>
    </div>
  )
}

export default function FocusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">…</div>}>
      <FocusRoom />
    </Suspense>
  )
}
