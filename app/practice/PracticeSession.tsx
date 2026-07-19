'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MathText from '@/components/MathText'
// P1-6-R2: 指令字高亮 — 自診「審題陷阱」後題幹指令字先亮
import CommandWordText from '@/components/CommandWordText'
// P1-6-R1: 沙漏 SVG 取代數字倒數
import HourglassTimer from '@/components/HourglassTimer'
// P1-6-R3: 鎖尾 5 秒溫和提示音（程序化生成，靜默降級）
import { playLockChime } from '@/lib/lockChime'
// #83: 計數機貼士卡 — 解析底部折疊區（未經真機驗證嘅卡 production 唔 render）
import CalcTipCard from '@/components/CalcTipCard'
import EmotionTags from '@/components/EmotionTags'
import type { Question, Difficulty } from '@/data/questions'
import { getSubject } from '@/data/subjects'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { recordAttempt } from '@/lib/progress'
import { getSeen, recordSeen } from '@/lib/seen'
import { weakestTopics, recordTopicOutcomes } from '@/lib/topicStats'
import { useLocale } from '@/lib/i18n'
import { CheckCircle, XCircle, ChevronRight, Clock, Brain, Zap, Lock } from 'lucide-react'
import DifficultyBadge from '@/components/DifficultyBadge'
import { logReverseError, type ReverseCause } from '@/lib/reverseLog'
import { pickLockoutQuestion, type LPair } from '@/lib/lockoutQuestions'
import { startServerLockout, verifyServerUnlock } from '@/lib/lockout/client'
// F-EMO: 情緒溫度計（拉分題答錯 → 先問感受再入反思鎖；「好慌」直去呼吸空間）
import EmotionThermometer from '@/components/EmotionThermometer'
import { logEmotion, type EmotionTag } from '@/lib/emotionLog'
// F-PRG: 今日學習光譜 — 每答一題按難度記一筆（本地）
import { recordSpectrumAnswer } from '@/lib/dailySpectrum'

// The forced-lock countdown (seconds) after a wrong answer on a HARD question.
const LOCKOUT_SECONDS = 60

// A lockout follow-up prepared for display: options shuffled, correct tracked by text.
interface PreparedLockout {
  prompt: LPair
  options: LPair[]
  correctZh: string
  explain: LPair
}

// 三維逆向錯因 (the forced self-diagnosis behind the "答錯即鎖死" lockout). The student
// must own WHICH underlying trap caught them before the Marking Scheme unlocks.
const REVERSE_CAUSES: {
  key: ReverseCause; emoji: string; zh: string; zhDesc: string; en: string; enDesc: string
}[] = [
  { key: 'A', emoji: '🧠', zh: '概念盲區', en: 'Conceptual Blindspot',
    zhDesc: '未完全理解定理底層邏輯（如忽略定義域或公式前提條件）',
    enDesc: "Didn't fully grasp the underlying theorem (e.g. ignored a domain or a formula precondition)" },
  { key: 'B', emoji: '🎯', zh: '審題陷阱', en: 'HKEAA Reading Trap',
    zhDesc: '踩中題目隱蔽字眼、關鍵限制或雙重否定句',
    enDesc: 'Fell for a hidden keyword, constraint or double-negative in the question' },
  { key: 'C', emoji: '🧮', zh: '運算粗心', en: 'Execution / Calculator Error',
    zhDesc: '按錯計算機或純運算失誤，思路其實正確',
    enDesc: 'Mis-keyed the calculator or a pure arithmetic slip — the method was right' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// An option carries both languages so the display can switch 中/EN while grading
// stays anchored to the (always-present) Chinese text.
interface PreparedOption {
  zh: string
  en: string | null
}

// A question prepared for display: options shuffled as zh/en pairs, with the
// correct answer kept by its Chinese TEXT — so grading compares a stable,
// language-independent value (never an index, and unaffected by the toggle).
type PreparedQuestion = Question & { shuffledOptions: PreparedOption[]; correctZh: string }

function prepareQuestion(q: Question): PreparedQuestion {
  const pairs: PreparedOption[] = q.options.map((zh, i) => ({ zh, en: q.optionsEn?.[i] ?? null }))
  return { ...q, shuffledOptions: shuffle(pairs), correctZh: q.options[q.correctIndex] }
}

// DSE difficulty mix served per run: 30% 基礎(easy) / 50% 普通(medium) / 20% 拔尖(hard).
// Owner-mandated target = 300/500/200 per 1,000-question subject bank (the standard
// foundation-weighted pyramid). pickByDifficulty tops up from whatever's left if a bank
// is thin on a tier, so it never returns fewer than it can.
const DIFF_RATIO: Record<Difficulty, number> = { easy: 0.3, medium: 0.5, hard: 0.2 }

// Pick `size` questions from a recency-ordered pool honouring the 3:5:2 mix.
// `ordered` is already in preference order (unseen first, then longest-ago-seen);
// we draw per difficulty in that order, then top up from whatever's left if a
// difficulty bucket runs short — so a thin bank never returns fewer than it can.
function pickByDifficulty(ordered: Question[], size: number): Question[] {
  if (ordered.length <= size) return ordered

  const target: Record<Difficulty, number> = {
    easy: Math.round(size * DIFF_RATIO.easy),
    hard: Math.round(size * DIFF_RATIO.hard),
    medium: 0,
  }
  target.medium = size - target.easy - target.hard

  const buckets: Record<Difficulty, Question[]> = { easy: [], medium: [], hard: [] }
  for (const q of ordered) buckets[q.difficulty]?.push(q)

  const chosen: Question[] = []
  const taken = new Set<string>()
  const take = (d: Difficulty, n: number) => {
    for (const q of buckets[d]) {
      if (chosen.length >= size || n <= 0) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
      n--
    }
  }
  take('easy', target.easy)
  take('medium', target.medium)
  take('hard', target.hard)

  // Top up any shortfall from the remaining pool, keeping recency preference.
  if (chosen.length < size) {
    for (const q of ordered) {
      if (chosen.length >= size) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
    }
  }
  return chosen
}

function buildPool(
  bank: Question[],
  subjectId: string,
  topicFilter: string | null,
  sessionSize: number,
  mode: 'normal' | 'weakness',
): PreparedQuestion[] {
  const scoped = topicFilter ? bank.filter((q) => q.topic === topicFilter) : bank
  // Serve the full 30/50/20 mix (補底/普通/拔尖) — pickByDifficulty stratifies below.
  // (Superseded the old 拔尖 hard-only serving so every tier surfaces per the mandate.)
  const base = scoped

  let ordered: Question[]
  if (mode === 'weakness') {
    // Repair worksheet: surface the user's weakest topics (lowest win-rate) first,
    // padded by the rest so a 20-Q run can still fill. Stratification below is
    // unchanged, so the 3:5:2 mix still holds within the weakness slice.
    // (Stratification below is unchanged, so the 30/50/20 mix still holds within the slice.)
    const weak = new Set(weakestTopics({ subjectId, min: 1, limit: 4 }).map((e) => e.topic))
    const weakQs = shuffle(base.filter((q) => weak.has(q.topic)))
    const rest = shuffle(base.filter((q) => !weak.has(q.topic)))
    ordered = [...weakQs, ...rest]
  } else {
    // Prefer questions the user hasn't been shown recently: unseen ones first (in
    // random order), then the longest-ago-seen, so re-doing a subject surfaces
    // fresh questions and only repeats once the whole bank is exhausted.
    const seen = getSeen(subjectId) // recently-shown ids, most-recent first
    const recency = new Map(seen.map((id, i) => [id, i]))
    const unseen = shuffle(base.filter((q) => !recency.has(q.id)))
    const seenOldestFirst = base
      .filter((q) => recency.has(q.id))
      .sort((a, b) => recency.get(b.id)! - recency.get(a.id)!)
    ordered = [...unseen, ...seenOldestFirst]
  }

  // Stratify to the DSE 30/50/20 mix, then shuffle so difficulties aren't clustered.
  return shuffle(pickByDifficulty(ordered, sessionSize)).map(prepareQuestion)
}

type AnswerState = { selectedZh: string; isCorrect: boolean } | null

// Per-tier tally (L2–3 / L4 / L5+) powering the result page's diagnostic warning:
// scoring 100% on L2–3 yet missing any L4/L5+ question is the "執分位 ≠ 5**" trap.
export type DifficultyResults = Record<Difficulty, { correct: number; total: number }>
function buildDifficultyResults(qs: PreparedQuestion[], ans: AnswerState[]): DifficultyResults {
  const out: DifficultyResults = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  }
  qs.forEach((q, i) => {
    out[q.difficulty].total++
    if (ans[i]?.isCorrect) out[q.difficulty].correct++
  })
  return out
}

function buildTopicResults(qs: PreparedQuestion[], ans: AnswerState[]) {
  const map: Record<string, { topic: string; correct: number; total: number }> = {}
  qs.forEach((q, i) => {
    if (!map[q.topic]) map[q.topic] = { topic: q.topicZh, correct: 0, total: 0 }
    map[q.topic].total++
    if (ans[i]?.isCorrect) map[q.topic].correct++
  })
  return Object.values(map)
}

// Per-topic outcomes keyed by topic ID (+ display label) for the weakness tally.
function buildTopicOutcomes(qs: PreparedQuestion[], ans: AnswerState[]) {
  const map: Record<string, { topic: string; label: string; correct: number; total: number }> = {}
  qs.forEach((q, i) => {
    const e = map[q.topic] ?? { topic: q.topic, label: q.topicZh, correct: 0, total: 0 }
    e.total++
    if (ans[i]?.isCorrect) e.correct++
    map[q.topic] = e
  })
  return Object.values(map)
}

const optionLetters = ['A', 'B', 'C', 'D']

interface SessionProps {
  bank: Question[]
  subjectId: string
  topicFilter: string | null
  sessionSize: number
  mode?: 'normal' | 'weakness'
}

// A single practice run. This component is loaded client-only (via next/dynamic
// ssr:false in page.tsx), so the lazy `useState` initializers below can safely use
// Math.random()/Date.now() without causing a server/client hydration mismatch.
// It is re-mounted (via `key`) whenever subject/topic changes, re-running the shuffle.
export default function PracticeSession({
  bank,
  subjectId,
  topicFilter,
  sessionSize,
  mode = 'normal',
}: SessionProps) {
  const router = useRouter()
  const { locale, t } = useLocale()
  const subjectMeta = getSubject(subjectId)

  const [questions] = useState<PreparedQuestion[]>(() => buildPool(bank, subjectId, topicFilter, sessionSize, mode))
  const [startTime] = useState(() => Date.now())
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [answerState, setAnswerState] = useState<AnswerState>(null)
  // Which reverse-cause the student admitted to for the current wrong answer.
  // While null on a WRONG answer, the lockout overlay hides the Marking Scheme.
  const [diagnosed, setDiagnosed] = useState<ReverseCause | null>(null)
  // 60-second forced lockout (HARD wrong answers only): a metacognition follow-up
  // about the chosen error cause + a countdown that both must clear before "Next".
  const [followup, setFollowup] = useState<PreparedLockout | null>(null)
  const [followupPick, setFollowupPick] = useState<string | null>(null)
  const [lockSecs, setLockSecs] = useState(0)
  // P1-6-R1: 鎖嘅絕對死線（timestamp）。剩餘秒由死線倒推 —— 逐秒 setTimeout 鏈
  // 會累積漂移，60 秒尾誤差可以超過 100ms；deadline 制冇呢個問題。
  const lockDeadlineRef = useRef<number | null>(null)
  // P1-6-R3: 每次上鎖只響一次（server re-hold 跳返 3 秒都唔會重複響）
  const chimeFiredRef = useRef(false)
  const [elapsed, setElapsed] = useState(0)
  // Optional server-signed lockout token (defence-in-depth; null = client timer only).
  const [lockToken, setLockToken] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  // 柔和計時（Emma/UDL 焦慮模式）：60 秒反思鎖照樣執行，但以進度條代替紅色
  // 數字倒數、以暖色代替紅黑 —— 只改呈現，不改教學法。設定存 localStorage。
  const [calmLock, setCalmLock] = useState(false)
  useEffect(() => {
    try { setCalmLock(localStorage.getItem('dse_calm_lock') === '1') } catch { /* ignore */ }
  }, [])
  const toggleCalmLock = useCallback(() => {
    setCalmLock((v) => {
      try { localStorage.setItem('dse_calm_lock', v ? '0' : '1') } catch { /* ignore */ }
      return !v
    })
  }, [])

  // 隱藏練習計時器（SEN／焦慮友善）：A11yPanel 寫入 dse_hide_timer 並派 `dse-a11y` 事件，
  // 練習頁即時套用。只影響顯示 —— elapsed 照計，結果頁時間統計不受影響。
  const [hideTimer, setHideTimer] = useState(false)
  useEffect(() => {
    const read = () => { try { setHideTimer(localStorage.getItem('dse_hide_timer') === '1') } catch { /* ignore */ } }
    read()
    window.addEventListener('dse-a11y', read)
    return () => window.removeEventListener('dse-a11y', read)
  }, [])

  // Show the English string when the UI is in English and a translation exists;
  // otherwise fall back to the Chinese original (so untranslated subjects still work).
  const tr = useCallback(
    (zh: string, en?: string | null) => (locale === 'en' && en ? en : zh),
    [locale]
  )

  // Remember which questions were shown so the next run can avoid repeating them.
  useEffect(() => {
    recordSeen(subjectId, questions.map((q) => q.id))
  }, [subjectId, questions])

  // Live timer.
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])

  const currentQ = questions[current]
  const totalQ = questions.length
  const progress = totalQ > 0 ? (current / totalQ) * 100 : 0
  // The "Next" button is held while the forced lock is active: until the follow-up
  // is answered correctly AND the countdown has run out.
  const followupCorrect = followup !== null && followupPick === followup.correctZh
  const lockHeld = followup !== null && (lockSecs > 0 || !followupCorrect)

  // F-EMO: 情緒溫度計狀態。gentleLock = 揀咗「有啲失落」→ 反思鎖轉柔和呈現 + 溫和標題
  const [emoOpen, setEmoOpen] = useState(false)
  const [gentleLock, setGentleLock] = useState(false)

  const selectOption = useCallback(
    (zh: string) => {
      if (answerState !== null || !currentQ) return
      const isCorrect = zh === currentQ.correctZh
      setAnswerState({ selectedZh: zh, isCorrect })
      // F-PRG: 記入今日光譜（真實作答先記，唔靠估算）
      recordSpectrumAnswer(currentQ.difficulty)
      // F-EMO: 拉分難度（hard = 5** 級）答錯 → 60 秒鎖之前先問感受
      if (!isCorrect && currentQ.difficulty === 'hard') setEmoOpen(true)
    },
    [answerState, currentQ]
  )

  // F-EMO: 情緒選擇處理 — 記錄純本地（隱私紅線：永不入報告／排行榜）。
  // 「好慌」= 跳過鎖死，直接導航去呼吸空間（Sarah 安全網優先於教學法）。
  const pickEmotion = useCallback(
    (tag: EmotionTag) => {
      logEmotion(tag, subjectId)
      setEmoOpen(false)
      if (tag === 'anxious') {
        router.push('/relax')
        return
      }
      if (tag === 'neutral') setGentleLock(true)
    },
    [router, subjectId]
  )

  // Student completes the forced 3-way self-diagnosis → record the reverse cause
  // to the local error log, which unlocks the Marking Scheme below.
  const chooseCause = useCallback(
    (cause: ReverseCause) => {
      if (!currentQ || answerState === null) return
      setDiagnosed(cause)
      logReverseError({
        subjectId,
        questionId: currentQ.id,
        topic: currentQ.topicZh,
        topicId: currentQ.topic, // F-REV: 畀重溫排程砌返正確嘅 ?topic= 連結
        cause,
        selected: answerState.selectedZh,
        correct: currentQ.correctZh,
        ts: Date.now(),
      })
      // HARD questions: arm the 60-second forced-reflection lock with a follow-up
      // logic question about this error cause. Easy/medium keep the lighter flow.
      if (currentQ.difficulty === 'hard') {
        const lq = pickLockoutQuestion(cause)
        setFollowup({
          prompt: lq.prompt,
          options: shuffle(lq.options),
          correctZh: lq.options[0][0],
          explain: lq.explain,
        })
        setFollowupPick(null)
        lockDeadlineRef.current = Date.now() + LOCKOUT_SECONDS * 1000
        chimeFiredRef.current = false
        setLockSecs(LOCKOUT_SECONDS)
        // Defence-in-depth: also register a server-signed lock (no-op unless enabled).
        setLockToken(null)
        const qid = currentQ.id
        void startServerLockout(qid).then((r) => {
          if (r) setLockToken(r.token)
        })
      }
    },
    [currentQ, answerState, subjectId]
  )

  // Tick the forced-lock countdown from its absolute deadline (P1-6-R1: the old
  // per-second setTimeout chain accumulated drift; 250ms polls off a timestamp
  // keep the 60s total accurate to well under 100ms).
  const lockActive = lockSecs > 0
  useEffect(() => {
    if (!lockActive) return
    const id = setInterval(() => {
      const dl = lockDeadlineRef.current
      setLockSecs(dl === null ? 0 : Math.max(0, Math.ceil((dl - Date.now()) / 1000)))
    }, 250)
    return () => clearInterval(id)
  }, [lockActive])

  // P1-6-R3: 鎖尾 5 秒溫和提示音（每次上鎖只響一次；柔和模式降頻減音量）
  useEffect(() => {
    if (followup === null) return
    if (lockSecs > 0 && lockSecs <= 5 && !chimeFiredRef.current) {
      chimeFiredRef.current = true
      playLockChime(calmLock || gentleLock)
    }
  }, [lockSecs, followup, calmLock, gentleLock])

  const next = useCallback(() => {
    const newAnswers = [...answers, answerState]
    setAnswers(newAnswers)
    setAnswerState(null)
    setDiagnosed(null)
    setFollowup(null)
    setFollowupPick(null)
    lockDeadlineRef.current = null
    setLockSecs(0)
    setLockToken(null)
    setGentleLock(false) // F-EMO: 柔和呈現只限本題

    if (current + 1 >= totalQ) {
      const score = newAnswers.filter((a) => a?.isCorrect).length
      const subjectName = subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : tr('練習', 'Practice')
      const topicResults = buildTopicResults(questions, newAnswers)
      const difficultyResults = buildDifficultyResults(questions, newAnswers)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const grade = predictGrade(score, getPracticeCutoffs(totalQ, subjectId)).grade
      const resultData = {
        score,
        total: totalQ,
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        topicResults,
        difficultyResults,
        elapsed,
      }
      localStorage.setItem('dse_result', JSON.stringify(resultData))
      // Persist to the long-term progress log (powers the dashboard / streaks).
      recordAttempt({
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        score,
        total: totalQ,
        grade,
        topicResults,
        elapsed,
        timestamp: Date.now(),
      })
      // Update the weakness tally (powers the dashboard radar / repair worksheet).
      recordTopicOutcomes(subjectId, buildTopicOutcomes(questions, newAnswers))
      router.push('/result')
    } else {
      setCurrent((c) => c + 1)
    }
  }, [answers, answerState, current, totalQ, questions, startTime, router, subjectId, subjectMeta, topicFilter, tr])

  // Proceed past a question. When a server-signed lock exists, do a final server check
  // (blocks a DevTools-zeroed countdown). FAIL-OPEN: any disabled/offline/error path
  // returns OK, so a student is never wrongly stuck. A genuine "not expired" reply
  // re-holds the client lock for a few seconds.
  const proceed = useCallback(async () => {
    if (lockHeld || verifying) return
    if (lockToken) {
      setVerifying(true)
      const ok = await verifyServerUnlock(lockToken)
      setVerifying(false)
      if (!ok) {
        lockDeadlineRef.current = Date.now() + 3000
        setLockSecs(3)
        return
      }
    }
    next()
  }, [lockHeld, verifying, lockToken, next])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // No questions for this subject/topic yet.
  if (totalQ === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-[#FAFAF8] text-[#2D2D2D]">
        <div className="text-5xl">{subjectMeta?.emoji ?? '📝'}</div>
        <p className="text-[#6B6B6B]">
          {subjectMeta
            ? t.practice.notLive.replace('{subject}', tr(subjectMeta.name, subjectMeta.nameEn))
            : t.practice.notLiveGeneric}
        </p>
        <Link href="/subjects" className="text-[#008B84] hover:text-[#00726C] underline">
          {t.practice.otherSubjects}
        </Link>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#6B6B6B]">{t.practice.loading}</div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-2xl mx-auto">

        {/* Subject label + weakness badge */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          {subjectMeta && (
            <>
              <span>{subjectMeta.emoji}</span>
              <span className="text-[#2D2D2D] font-medium">{tr(subjectMeta.name, subjectMeta.nameEn)}</span>
            </>
          )}
          {mode === 'weakness' && (
            <span className="inline-flex items-center gap-1 text-xs text-[#B8860B] bg-[#B8860B]/10 border border-[#B8860B]/20 px-2 py-0.5 rounded-full">
              🛠️ {tr('盲點修復卷', 'Repair worksheet')}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[#6B6B6B] mb-2">
            <span>
              {t.practice.progress.replace('{n}', String(current + 1)).replace('{total}', String(totalQ))}
            </span>
            {!hideTimer && (
              <span className="flex items-center gap-1">
                <Clock size={13} /> {formatTime(elapsed)}
              </span>
            )}
          </div>
          <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00726C] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-8 mb-4 animate-slide-up">
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <DifficultyBadge difficulty={currentQ.difficulty} />
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B8860B] bg-[#B8860B]/10 px-3 py-1 rounded-full">
              <span>{currentQ.frameworkEmoji}</span>
              {tr(currentQ.frameworkZh, currentQ.frameworkEn)}
            </span>
            <span className="text-xs text-[#6B6B6B] bg-[#F5F5F0] px-3 py-1 rounded-full">
              {tr(currentQ.topicZh, currentQ.topicEn)}
            </span>
            <span className="text-xs text-[#6B6B6B] bg-[#F5F5F0] px-3 py-1 rounded-full ml-auto">
              {currentQ.year}
            </span>
          </div>

          {/* Content — P1-6-R2: 自診咗「B. 審題陷阱」先高亮題幹指令字 */}
          <p className="text-lg leading-relaxed mb-8 text-[#1A1A1A]">
            {diagnosed === 'B' && answerState !== null && !answerState.isCorrect ? (
              <CommandWordText
                text={tr(currentQ.content, currentQ.contentEn)}
                soft={calmLock || gentleLock}
              />
            ) : (
              <MathText>{tr(currentQ.content, currentQ.contentEn)}</MathText>
            )}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.shuffledOptions.map((opt, idx) => {
              const isCorrectOpt = opt.zh === currentQ.correctZh
              const isSelectedWrong =
                answerState !== null && opt.zh === answerState.selectedZh && !answerState.isCorrect

              let style =
                'border-black/[0.10] bg-[#F5F5F0] hover:bg-[#EDEDE8] hover:border-[#008B84]/40 cursor-pointer'

              if (answerState !== null) {
                if (isCorrectOpt) {
                  style = 'border-[#008B84] bg-[#008B84]/[0.10] cursor-default'
                } else if (isSelectedWrong) {
                  style = 'border-[#C2185B] bg-[#C2185B]/[0.10] cursor-default'
                } else {
                  style = 'border-black/[0.06] bg-[#F5F5F0] opacity-50 cursor-default'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectOption(opt.zh)}
                  disabled={answerState !== null}
                  className={`w-full text-left flex items-start gap-3 border rounded-xl px-4 py-3 transition-all option-btn ${style}`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-[#EDEDE8] flex items-center justify-center text-sm font-medium text-[#6B6B6B] mt-0.5">
                    {optionLetters[idx]}
                  </span>
                  <span className="leading-relaxed text-sm sm:text-base text-[#2D2D2D]">
                    <MathText>{tr(opt.zh, opt.en)}</MathText>
                  </span>
                  {answerState !== null && isCorrectOpt && (
                    <CheckCircle size={18} className="text-[#008B84] ml-auto shrink-0 mt-0.5" />
                  )}
                  {isSelectedWrong && (
                    <XCircle size={18} className="text-[#C2185B] ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback + Next */}
        {answerState !== null && (
          <div className="animate-slide-up">
            {!answerState.isCorrect && diagnosed === null ? (
              /* 答錯 → 停一停: a wrong answer holds the solution behind a short, forced
                 3-way reverse-cause self-diagnosis. Calm gold, reflective (因材施教). */
              <div className="rounded-2xl p-6 mb-4 border border-[#B8860B]/40 bg-[#B8860B]/[0.06]">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={18} className="text-[#B8860B]" />
                  <span className="text-[#B8860B] font-medium tracking-wide text-sm">
                    ✋ {tr('停一停，諗一諗', 'Pause & reflect')}
                  </span>
                </div>
                <p className="text-[#2D2D2D] text-xs font-medium mb-1">
                  {tr('答錯唔緊要 —— 一齊搵出今次嘅錯因，跟住就解鎖詳解。',
                      'A wrong answer is fine — let’s find what tripped you up, then the solution unlocks.')}
                </p>
                <p className="text-[#6B6B6B] text-xs mb-4 leading-relaxed">
                  {tr('誠實諗諗：你今次主要中咗邊一種底層陷阱？',
                      'Honestly: which underlying trap caught you this time?')}
                </p>
                <div className="space-y-2">
                  {REVERSE_CAUSES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => chooseCause(c.key)}
                      className="w-full text-left flex items-start gap-3 border border-black/[0.10] bg-[#F5F5F0] hover:bg-[#EDEDE8] hover:border-[#B8860B]/50 rounded-xl px-4 py-3 transition-all"
                    >
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-[#EDEDE8] text-[#B8860B] flex items-center justify-center text-sm font-medium">
                        {c.key}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-[#1A1A1A]">{c.emoji} {tr(c.zh, c.en)}</span>
                        <span className="block text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{tr(c.zhDesc, c.enDesc)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {answerState.isCorrect ? (
                  /* Correct — calm acknowledgement, no fanfare. */
                  <div className="rounded-2xl p-5 mb-4 border bg-[#008B84]/[0.10] border-[#008B84]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={18} className="text-[#008B84]" />
                      <span className="text-[#008B84] font-medium">{t.practice.correct}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-sm text-[#2D2D2D] leading-relaxed">
                      <Brain size={14} className="text-[#B8860B] shrink-0 mt-0.5" />
                      <MathText>{tr(currentQ.explanation, currentQ.explanationEn)}</MathText>
                    </div>
                  </div>
                ) : (
                  /* Wrong → unlocked after self-diagnosis: the error IS the lesson. */
                  <div className="rounded-2xl p-5 mb-4 border bg-[#B8860B]/[0.10] border-[#B8860B]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain size={18} className="text-[#B8860B]" />
                      <span className="text-[#B8860B] font-medium">{tr('🔍 思維逆襲解密', '🔍 Mind-flip decode')}</span>
                    </div>
                    {(() => {
                      const c = REVERSE_CAUSES.find((x) => x.key === diagnosed)
                      return (
                        <p className="text-xs text-[#C2185B] mb-3 leading-relaxed">
                          {tr('已記錄錯因：', 'Logged cause: ')}
                          <strong>{c ? `${c.emoji} ${tr(c.zh, c.en)}` : ''}</strong>
                          {tr(' → 已寫入逆向錯題本。', ' → saved to your reverse error log.')}
                        </p>
                      )
                    })()}
                    <div className="text-sm text-[#2D2D2D] leading-relaxed border-t border-[#B8860B]/15 pt-3">
                      <span className="text-[#B8860B] text-xs font-medium mr-1">💡 {tr('正解思路：', 'Reasoning: ')}</span>
                      <MathText>{tr(currentQ.explanation, currentQ.explanationEn)}</MathText>
                    </div>
                    {/* F01 錯題情緒標籤（key 按題重置） */}
                    <EmotionTags key={currentQ.id} />
                  </div>
                )}

                {/* Path B — 名師速解 / MC Hack (the exam shortcut, distinct from the
                    formal Path A reasoning above). Shown whenever the question carries one. */}
                {currentQ.mcHack && (
                  <div className="rounded-2xl p-5 mb-4 border bg-[#7C3AED]/[0.08] border-[#7C3AED]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={18} className="text-[#7C3AED]" />
                      <span className="text-[#7C3AED] font-medium">{tr('⚡ 名師速解（MC Hack）', '⚡ MC Hack — exam shortcut')}</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mb-3 leading-relaxed">
                      {tr(
                        '考場上唔使寫足證明 —— 呢招專為 MC 而設，秒級攞分。',
                        'No full proof needed in the exam — this is the MC-only quick kill.',
                      )}
                    </p>
                    <div className="text-sm text-[#2D2D2D] leading-relaxed border-t border-[#7C3AED]/15 pt-3">
                      <MathText>{tr(currentQ.mcHack, currentQ.mcHackEn)}</MathText>
                    </div>
                  </div>
                )}

                {/* #83 計數機貼士卡 — 解析底部折疊區（按 topic 命中；未驗證卡 production 隱藏） */}
                <CalcTipCard topicId={currentQ.topic} />

                {/* 60-second forced reflection lock (HARD wrong answers): read the
                    breakdown above, answer the cause follow-up correctly, AND wait out
                    the countdown before "Next" unlocks. No skipping.
                    憲章 §4.4：反思遮罩用奶油白（非黑）、非鮮紅 —— 兩種模式都用暖淺色。 */}
                {followup && (
                  /* F-EMO: gentleLock（揀咗「有啲失落」）⇒ 強制柔和呈現 + 溫和標題，
                     教學法不變（60 秒 + 反思題照舊），只改語氣同色調 */
                  <div className={`rounded-2xl p-5 mb-4 border-2 ${(calmLock || gentleLock) ? 'border-[#B8860B]/40 bg-[#FDFCF8]' : 'border-[#C2185B]/45 bg-[#FDFBF8]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`flex items-center gap-2 font-medium text-sm tracking-wide ${(calmLock || gentleLock) ? 'text-[#B8860B]' : 'text-[#C2185B]'}`}>
                        <Lock size={16} />{' '}
                        {gentleLock
                          ? tr('慢啲嚟，你發現咗一個新盲點💡', 'Take it slow — you just found a new blind spot 💡')
                          : tr('60 秒冷靜艙', '60-second calm capsule')}
                      </span>
                      <button
                        onClick={toggleCalmLock}
                        title={tr('柔和模式：沙漏放慢、色調更靜', 'Calm mode: slower hourglass, softer tones')}
                        className={`text-[10px] px-2 py-1 rounded-full border transition-all ${calmLock ? 'border-[#B8860B]/40 text-[#B8860B] bg-[#B8860B]/10' : 'border-black/[0.12] text-[#6B6B6B] hover:text-[#2D2D2D]'}`}
                      >
                        {tr('柔和', 'Calm')}
                      </button>
                    </div>
                    {/* P1-6-R1: 沙漏 SVG 取代數字倒數 —— 非線性沙流（前快後慢），
                        柔和／情緒柔和模式下減速降飽和。準確計時由 deadline 效應負責。 */}
                    <div className="flex justify-center mb-4">
                      <HourglassTimer
                        remaining={lockSecs}
                        total={LOCKOUT_SECONDS}
                        soft={calmLock || gentleLock}
                        label={
                          gentleLock
                            ? tr('唞一唞，你發現咗新盲點💡', 'Take a breather — you found a new blind spot 💡')
                            : calmLock
                              ? tr('慢啲嚟，發現盲點💡', 'Slow down — a blind spot found 💡')
                              : tr('診斷緊你嘅錯因 DNA', 'Diagnosing your error DNA')
                        }
                        ariaLabel={tr('60 秒冷靜艙，請診斷錯因', '60-second calm capsule — diagnose your error cause')}
                      />
                    </div>
                    {/* 憲章 v3.0 §1.2 失敗學定稿文案：做錯 ≠ 失敗，由呢一瞬間開始 */}
                    <p className="text-xs text-[#6B6B6B] text-center mb-3 leading-relaxed">
                      {tr('過去係過去，未來係未來。由呢一瞬間開始。',
                          'The past is the past, the future is the future. Start from this very moment.')}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mb-3 leading-relaxed">
                      {tr('讀完上面嘅錯因拆解，答對以下反思題，並等倒數完結，先可以解鎖下一題。',
                          'Read the breakdown above, answer the reflection question correctly, and wait out the countdown to unlock the next question.')}
                    </p>
                    <p className="text-sm font-medium text-[#1A1A1A] mb-3">{tr(followup.prompt[0], followup.prompt[1])}</p>
                    <div className="space-y-2">
                      {followup.options.map((o, i) => {
                        const picked = followupPick === o[0]
                        const isCorrectOpt = o[0] === followup.correctZh
                        let st = 'border-black/[0.10] bg-[#F5F5F0] hover:border-[#008B84]/40 cursor-pointer'
                        if (followupPick !== null) {
                          if (isCorrectOpt) st = 'border-[#008B84] bg-[#008B84]/[0.10]'
                          else if (picked) st = 'border-[#C2185B] bg-[#C2185B]/[0.10]'
                          else st = 'border-black/[0.06] bg-[#F5F5F0] opacity-50'
                        }
                        return (
                          <button
                            key={i}
                            disabled={followupCorrect}
                            onClick={() => setFollowupPick(o[0])}
                            className={`w-full text-left text-sm text-[#2D2D2D] border rounded-xl px-4 py-2.5 transition-all ${st}`}
                          >
                            {tr(o[0], o[1])}
                          </button>
                        )
                      })}
                    </div>
                    {followupPick !== null && !followupCorrect && (
                      <p className="text-xs text-[#C2185B] mt-2">
                        {tr('再諗深一層 —— 揀返最能根治呢個錯因嘅做法。',
                            'Think again — pick the approach that actually fixes this error type.')}
                      </p>
                    )}
                    {followupCorrect && (
                      <p className="text-xs text-[#2D2D2D] mt-3 leading-relaxed border-t border-black/[0.10] pt-2">
                        <span className="text-[#008B84] font-medium">✓ </span>
                        {tr(followup.explain[0], followup.explain[1])}
                      </p>
                    )}
                  </div>
                )}

                {/* Next button — disabled while the forced lock is held or verifying. */}
                <button
                  onClick={proceed}
                  disabled={lockHeld || verifying}
                  className={`w-full font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    lockHeld || verifying
                      ? 'bg-[#F5F5F0] text-[#9CA3AF] cursor-not-allowed'
                      : 'bg-[#00726C] hover:bg-[#005F5A] text-white'
                  }`}
                >
                  {lockHeld || verifying ? (
                    <>
                      <Lock size={16} />
                      {tr(`解鎖中…${lockSecs > 0 ? ` (${lockSecs}s)` : ''}`,
                          `Locked…${lockSecs > 0 ? ` (${lockSecs}s)` : ''}`)}
                    </>
                  ) : current + 1 >= totalQ ? t.practice.seeResult : (
                    <>{t.practice.next} <ChevronRight size={18} /></>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Score tracker */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalQ }).map((_, i) => {
            let color = 'bg-black/[0.08]'
            if (i < answers.length) {
              color = answers[i]?.isCorrect ? 'bg-[#008B84]' : 'bg-[#C2185B]'
            } else if (i === current) {
              color = 'bg-[#00726C]'
            }
            return <div key={i} className={`w-3 h-3 rounded-full ${color} transition-colors`} />
          })}
        </div>
      </div>

      {/* F-EMO: 情緒溫度計 — 拉分題答錯後、反思鎖之前先問感受 */}
      {emoOpen && <EmotionThermometer onPick={pickEmotion} />}
    </div>
  )
}
