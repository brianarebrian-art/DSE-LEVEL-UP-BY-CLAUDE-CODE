'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  loadActiveSession,
  saveActiveSession,
  clearActiveSession,
  isResumable,
  type ActiveSession,
  type PracticeMode,
} from '@/lib/sessionResume'
// recordAttempt() notifies on completion, but that fires BEFORE we clear the active
// session — so we re-stamp afterwards to push the cleared state up too.
import { notifyProgressChanged } from '@/lib/sync'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MathText from '@/components/MathText'
// P1-6-R1: 沙漏 SVG 取代數字倒數
// P1-6-R3: 鎖尾 5 秒溫和提示音（程序化生成，靜默降級）
// 第 1 週 · 引擎一：答對輕柔提示音（預設關閉，A11yPanel 可開）
import { playCorrectChime } from '@/lib/answerChime'
// #83: 計數機貼士卡 — 解析底部折疊區（未經真機驗證嘅卡 production 唔 render）
import CalcTipCard from '@/components/CalcTipCard'
import QuestionProvenance from '@/components/QuestionProvenance'
import BookmarkButton from '@/components/BookmarkButton'
import StagedExplanation from '@/components/StagedExplanation'
import OptionNotes from '@/components/OptionNotes'
import { displayOptions, type DisplayOption } from '@/lib/optionNotes'
import { FOCUS_LIGHT_KEY } from '@/components/GlobalA11y'
import type { Question, Difficulty } from '@/data/questions'
import { getSubject } from '@/data/subjects'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { recordAttempt } from '@/lib/progress'
import { cameFromResult, sendPracticeCount } from '@/lib/practiceCount'
import { getSeen, recordSeen } from '@/lib/seen'
import { weakestTopics, recordTopicOutcomes, getTopicStats } from '@/lib/topicStats'
// 第 2 週 · 引擎三：知識概念網（中文指定文言範文）
import { recordConceptHits, textsInQuestion } from '@/lib/conceptNet'
import { useLocale } from '@/lib/i18n'
import { CheckCircle, Lightbulb, ChevronRight, ChevronLeft, Clock, Brain, Zap, ChevronDown, Sprout, MapPin, Loader2 } from 'lucide-react'
import CauseMark from '@/components/marks/CauseMark'
// B2: 一鍵休息 —— 全屏呼吸遮罩，關閉時回報暫停時長畀呢度順延所有計時
import RestMode from '@/components/RestMode'
import PracticeMoreMenu from '@/components/PracticeMoreMenu'
import { A11yButton } from '@/components/A11yPanel'
import QuestionStatusStrip from '@/components/QuestionStatusStrip'
import PracticeContextRail from '@/components/PracticeContextRail'
import { questionStatuses } from '@/lib/questionStatus'
import { feedbackScrollDelta } from '@/lib/practiceScroll'
import { listPracticeFocusables, practiceTabDestination, slotFor, tabStopElement } from '@/lib/practiceFocusOrder'
import DifficultyBadge from '@/components/DifficultyBadge'
import { assignWrongAnswerCause, getReverseLog, logReverseError, type ReverseCause } from '@/lib/reverseLog'

const MC_CAUSES: { key: ReverseCause; zh: string; en: string }[] = [
  { key: 'A', zh: '概念未清', en: 'Concept to revisit' },
  { key: 'B', zh: '未睇清題目', en: 'Missed the question' },
  { key: 'C', zh: '計算步驟', en: 'A calculation step' },
]
import { orderByCause } from '@/lib/causeMode'
// F-EMO: 情緒溫度計（拉分題答錯 → 先問感受再入反思鎖；「好慌」直去呼吸空間）
// F-PRG: 今日學習光譜 — 每答一題按難度記一筆（本地）
import { recordSpectrumAnswer } from '@/lib/dailySpectrum'
import { pickByDifficulty } from '@/lib/sessionSample'
import { levelEstimateBlock } from '@/lib/levelEstimatePolicy'
// 第 3 週 · 引擎五：無聲難度自適應（只排序，唔重抽，故 3:5:2 分毫不變）
import { advanceStreak, nextIndex, preferredTier, wishIndex, EMPTY_STREAK, type StreakState, type NextWish } from '@/lib/adaptiveOrder'
import { weightedOrder } from '@/lib/empiricalWeighting'
// 第 3 週 · 引擎五之二：可選計時模式（預設關閉，時間到唔強制結束）
import { readTimerPref, type TimerPref } from '@/lib/timerPreference'
import { useQuiet } from '@/lib/quietMode'
import {
  getQuestionTimer, setQuestionTimer, remainingSeconds, isTimeUp,
  TIMER_OPTIONS, type TimerOption,
} from '@/lib/questionTimer'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// An option carries both languages so the display can switch 中/EN while grading
// stays anchored to the (always-present) Chinese text. Since 2026-09-29 it also
// carries `optionId`, its stored index, so per-option notes follow it through the
// shuffle (lib/optionNotes.ts).
type PreparedOption = DisplayOption

// A question prepared for display: options shuffled as zh/en pairs, with the
// correct answer kept by its Chinese TEXT — so grading compares a stable,
// language-independent value (never an index, and unaffected by the toggle).
type PreparedQuestion = Question & { shuffledOptions: PreparedOption[]; correctZh: string }

function prepareQuestion(q: Question): PreparedQuestion {
  return { ...q, shuffledOptions: displayOptions(q), correctZh: q.options[q.correctIndex] }
}

// 3:5:2 draw lives in lib/sessionSample.ts (same ratios, plus a family skip so
// one template with the numbers swapped does not fill the session).

function buildPool(
  bank: Question[],
  subjectId: string,
  topicFilter: string | null,
  sessionSize: number,
  mode: PracticeMode,
  cause: ReverseCause | null,
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
    // mode='cause' reorders this same recency order below (lib/causeMode.ts).
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
    // UX audit F1: questions matching the chosen error cause go first. Stratification
    // below is unchanged, so the 3:5:2 mix still holds.
    if (mode === 'cause' && cause) ordered = orderByCause(ordered, cause, getReverseLog(), subjectId)
  }

  // 實測難度加權（2027 目標書階段一第 2 項）。**預設完全唔生效** ——
  // EMPIRICAL_K = 0 之下 weightedOrder 原樣返回，即係現行行為一個字都冇改。
  //
  // 加權刻意落喺【排序】而唔係【分層】：下面 pickByDifficulty 照樣按 3:5:2
  // 分層，所以比例分毫不變，變嘅只係邊個課題填入每一層。憲章 §7 同
  // lib/adaptiveOrder.ts 都建基於嗰個比例。
  //
  // 開之前請讀 lib/empiricalWeighting.ts 檔頭 —— 特別係「k ≈ 3.1 會令五個
  // 課題食咗 61% 抽題量」同「§7.2 兩個月實驗期內改難度，條 curve 會讀唔到」。
  const weighted = weightedOrder(
    ordered,
    getTopicStats().filter((e) => e.subjectId === subjectId),
  )

  // Stratify to the DSE 30/50/20 mix, then shuffle so difficulties aren't clustered.
  return shuffle(pickByDifficulty(weighted, sessionSize, subjectId)).map(prepareQuestion)
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
  // labelEn 一併存低 —— 儀表板嘅英文介面先至有課題名睇（非華語考生）
  const map: Record<
    string,
    { topic: string; label: string; labelEn?: string; correct: number; total: number }
  > = {}
  qs.forEach((q, i) => {
    const e =
      map[q.topic] ?? { topic: q.topic, label: q.topicZh, labelEn: q.topicEn, correct: 0, total: 0 }
    e.total++
    if (ans[i]?.isCorrect) e.correct++
    map[q.topic] = e
  })
  return Object.values(map)
}

// 第 2 週 · 引擎三：一節練習之中，逐題推導佢觸及邊幾篇指定文言範文。
// 只喺中文科行 —— 概念網目前只覆蓋十二篇，其他科跑呢段純粹係浪費。
// 篇名由題幹原文辨認（lib/conceptNet），唔靠人手標註，所以題庫加題唔使改呢度。
function buildConceptRows(qs: PreparedQuestion[], ans: AnswerState[]) {
  return qs.map((q, i) => ({
    texts: textsInQuestion(q.content, q.topicZh),
    correct: !!ans[i]?.isCorrect,
  }))
}

const optionLetters = ['A', 'B', 'C', 'D']

interface SessionProps {
  bank: Question[]
  subjectId: string
  topicFilter: string | null
  sessionSize: number
  mode?: PracticeMode
  /** With mode='cause': which self-diagnosed cause to practise. */
  cause?: ReverseCause | null
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
  cause = null,
}: SessionProps) {
  const router = useRouter()
  const { locale, t } = useLocale()
  const subjectMeta = getSubject(subjectId)

  const [questions, setQuestions] = useState<PreparedQuestion[]>(() => buildPool(bank, subjectId, topicFilter, sessionSize, mode, cause))
  // 第 3 週 · 引擎五：連續答對／答錯狀態。純 session 內存 ——
  // 唔寫 localStorage：呢個係「今日呢一刻嘅節奏」，唔應該變成一個跟住學生走嘅標籤。
  const [streak, setStreak] = useState<StreakState>(EMPTY_STREAK)
  // 學生手動揀嘅層級。有值就永遠蓋過自適應（規格書 §4.6：始終保留手動選擇權）。
  // Q-T11（創辦人 2026-10-03）：學生對下一題嘅一次性要求；做完下一題就清返。
  const [nextWish, setNextWish] = useState<NextWish | null>(null)
  /** 本題可選錯因（唔鎖下一題）。略過＝null 且唔寫 cause。 */
  const [pickedCause, setPickedCause] = useState<ReverseCause | null>(null)
  /** 「下一題想要」預設摺疊，避免同主 CTA 搶注意力。 */
  const [wishOpen, setWishOpen] = useState(false)
  const [startTime, setStartTime] = useState(() => Date.now())
 const [current, setCurrent] = useState(0)
 const [answers, setAnswers] = useState<AnswerState[]>([])
  // v3.0 F1「多裝置續做」: an unfinished run for this exact subject/topic/mode — from this
  // device, or pulled from another one via the synced snapshot. Offered as a card the
  // student chooses, never silently auto-applied.
  const [resumeOffer, setResumeOffer] = useState<ActiveSession | null>(() => {
    const saved = loadActiveSession()
    if (!saved || !isResumable(saved, subjectId, topicFilter, mode)) return null
    // 2026-10-01（改進循環 2 R2-11）：只在保存的題目全部仍在題庫時才提出續做。
    // 原本科目已下架或不存在（題庫為空）時，仍會問「繼續做第 N 題」，撳完才發現做不到。
    const ids = new Set(bank.map((q) => q.id))
    return saved.questionIds.every((id) => ids.has(id)) ? saved : null
  })
  // Anonymous counts (founders' reply 40a): set when a resume is accepted; one start per set.
  const resumedRef = useRef(false)
  const startCounted = useRef(false)
  const [answerState, setAnswerState] = useState<AnswerState>(null)
  // Wave 2「再試一次」：畫面跟最新一揀；計分／session answers 用首次作答。
  const [firstAnswer, setFirstAnswer] = useState<AnswerState>(null)
  // 必須喺 selectOption／next 之前 declare —— React Compiler 唔准 TDZ 用 setter。
  const loggedIdsRef = useRef<Set<string>>(new Set())
  const [hintOpen, setHintOpen] = useState(false)
  const [hackOpen, setHackOpen] = useState(false)
  // 2026-09-09：呢度原本係反思鎖嘅 state。鎖已剷除（憲章 §7.2 實驗）。
  // about the chosen error cause + a countdown that both must clear before "Next".
  // P1-6-R1: 鎖嘅絕對死線（timestamp）。剩餘秒由死線倒推 —— 逐秒 setTimeout 鏈
  // 會累積漂移，倒數尾段誤差可以超過 100ms；deadline 制冇呢個問題。
  // P1-6-R3: 每次上鎖只響一次（server re-hold 跳返 3 秒都唔會重複響）
  const [elapsed, setElapsed] = useState(0)

  // 隱藏練習計時器（SEN／焦慮友善）：A11yPanel 寫入 dse_hide_timer 並派 `dse-a11y` 事件，
  // 練習頁即時套用。只影響顯示 —— elapsed 照計，結果頁時間統計不受影響。
  // B2「一鍵休息模式」：休息期間所有計時停低。收工時將暫停咗嘅毫秒數同時加落
  // startTime（練習計時）同反思鎖死線 —— 唞得幾耐，兩邊就順延幾耐，
  // 所以「休息」對成績同鎖時長零影響，學生唔使為咗唞而有心理負擔。
  // C6「只做 1 題」做完後嘅溫暖收結（唔跳 /result，見 next() 入面嘅理由）
  const [justOneDone, setJustOneDone] = useState(false)

  const [restOpen, setRestOpen] = useState(false)
  const closeRest = useCallback((pausedMs: number) => {
    setRestOpen(false)
    if (pausedMs <= 0) return
    setStartTime((t) => t + pausedMs)
    // 2026-09-09：原本仲要順延個 30 秒鎖嘅死線。鎖已剷除，休息只影響計時。
  }, [])

  // UX audit B4 (b): the running clock is hidden unless the student turns it on (lib/timerPreference.ts).
  const [timerPref, setTimerPref] = useState<TimerPref>('default')
  const hideTimer = timerPref === 'hide'
  // Quiet mode (UX audit B5, Yuna 2026-09-26) also hides the running clock.
  const quiet = useQuiet()
  const showElapsed = timerPref === 'show' && !quiet
  useEffect(() => {
    const read = () => setTimerPref(readTimerPref())
    read()
    window.addEventListener('dse-a11y', read)
    return () => window.removeEventListener('dse-a11y', read)
  }, [])

  // Focus 專注燈光模式（ADHD／UDL，2026-09-13）。<html> 個 class 由 GlobalA11y
  // 開機套用、由 A11yPanel 個掣 toggle；呢度淨係揸住【頁內嘅狀態顯示】同 Shift+F。
  //
  // 唔喺呢度讀 classList 而讀返 localStorage：兩處各自讀同一個真相來源，
  // 唔會因為 render 次序而見到唔同答案。A11yPanel 改完會派 dse-a11y，所以
  // 學生喺做緊題嗰陣由面板開關，呢度即刻跟到。
  const [focusLight, setFocusLight] = useState(false)
  useEffect(() => {
    const read = () => { try { setFocusLight(localStorage.getItem(FOCUS_LIGHT_KEY) === '1') } catch { /* ignore */ } }
    read()
    window.addEventListener('dse-a11y', read)
    return () => window.removeEventListener('dse-a11y', read)
  }, [])

  // Shift + F 切換。刻意做成同 A11yPanel 完全一樣嘅三步（寫 class、寫 storage、
  // 派事件），而唔係各自維護一份狀態 —— 兩個入口寫落唔同地方，就會出現
  // 「面板顯示關、畫面其實開住」呢種對唔上嘅狀態。
  const toggleFocusLight = useCallback(() => {
    const next = !(document.documentElement.classList.contains('focus-light'))
    document.documentElement.classList.toggle('focus-light', next)
    try { localStorage.setItem(FOCUS_LIGHT_KEY, next ? '1' : '0') } catch { /* ignore */ }
    window.dispatchEvent(new Event('dse-a11y'))
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

  // ── 第 3 週 · 引擎五之二：可選逐題計時 ──────────────────────────────────
  // 每條題目自己一個計時器。到零【唔會】自動交、唔會跳題、唔會扣任何嘢 ——
  // 只係出一句「時間到，休息一下」。RestMode 停低幾耐就順延幾耐（同總計時一致）。
  const [perQTimer, setPerQTimer] = useState<TimerOption>(0)
  const [qStart, setQStart] = useState(() => Date.now())
  const [qSpent, setQSpent] = useState(0)
  useEffect(() => {
    setPerQTimer(getQuestionTimer())
  }, [])
  // 換題就重新計。答咗之後停低 —— 睇解析唔應該計入答題時間。
  useEffect(() => {
    setQStart(Date.now())
    setQSpent(0)
  }, [current])
  useEffect(() => {
    if (perQTimer === 0 || answerState !== null) return
    const id = setInterval(() => setQSpent(Math.floor((Date.now() - qStart) / 1000)), 1000)
    return () => clearInterval(id)
  }, [perQTimer, qStart, answerState])
  // hideTimer 蓋過計時模式：一句「時間到」本身就係時間壓力，
  // 藏起數字而留低嗰句等於冇藏過（見 lib/questionTimer 檔頭）。
  const timerVisible = perQTimer !== 0 && !hideTimer
  const qLeft = remainingSeconds(perQTimer, qSpent)
  const qTimeUp = timerVisible && answerState === null && isTimeUp(perQTimer, qSpent)

  const currentQ = questions[current]
  const totalQ = questions.length
  // 2026-09-09：「下一題」原本會喺反思鎖期間扣住（要答啱追問題 ＋ 等夠 30 秒）。
  // 鎖已剷除，所以永遠唔扣 —— 學生揀完錯因即刻睇得到解析，撳得到下一題。

  // UX 循環 LOOP 4（2026-09-30）：答題後把回饋帶入視線（規則及實測見 lib/practiceScroll.ts）。
  // 減少動態（系統設定或 html.no-motion）時不做平滑捲動。
  const feedbackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (answerState === null) return
    const id = requestAnimationFrame(() => {
      const el = feedbackRef.current
      if (!el) return
      // R2-11（2026-10-01）：撳過的選項會變成 disabled，焦點因而跌回 <body>（Chrome 會延後才移走，
      // 此刻 activeElement 可能仍是那粒 disabled 掣）；鍵盤及讀屏用戶要由頁頂重新 Tab。
      // 焦點冇咗或者喺 disabled 掣上，才移到回饋區（唔捲動，捲動照下面規則）。
      // 選項改為 aria-disabled，焦點留在剛揀的選項上。只有焦點真的跌出文件時才放回該選項。
      const active = document.activeElement as HTMLElement | null
      const stayedOnOption = active?.hasAttribute('data-practice-option') ?? false
      if (!stayedOnOption && (!active || active === document.body || (active as HTMLButtonElement).disabled)) {
        const picked = document.querySelector<HTMLElement>('[data-practice-option][aria-pressed="true"]')
        picked?.focus({ preventScroll: true })
      }
      const reduce =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.classList.contains('no-motion')
      // 內層捲動只把解析頂部帶進視窗底部一帶，下一題掣維持在欄底，已聚焦的選項盡量仍留在畫面內。
      const scroller = el.closest('.practice-revealed-scroll')
      if (scroller instanceof HTMLElement) {
        const scrollerRect = scroller.getBoundingClientRect()
        const delta = el.getBoundingClientRect().top - (scrollerRect.bottom - 160)
        if (delta > 8) scroller.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
        return
      }
      const delta = feedbackScrollDelta(el.getBoundingClientRect().top, window.innerHeight)
      if (delta <= 0) return
      window.scrollBy({ top: delta, behavior: reduce ? 'auto' : 'smooth' })
    })
    return () => cancelAnimationFrame(id)
  }, [answerState])

  // 答題回饋：≤200ms 透明度提示（正確／錯誤力度一致）。唔再用衝擊波／粒子。
  // 揀即等於交；SEN／reduced-motion／no-motion 由 globals.css 直接靜止。
  const [flashIdx, setFlashIdx] = useState<number | null>(null)
 const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current) }, [])

  const selectOption = useCallback(
    (zh: string, idx: number) => {
      if (answerState !== null || !currentQ) return
      const isCorrect = zh === currentQ.correctZh
      setAnswerState({ selectedZh: zh, isCorrect })
      setPickedCause(null)
      setWishOpen(false)
      setHackOpen(false)
      setFlashIdx(idx)
      if (flashTimer.current) clearTimeout(flashTimer.current)
      flashTimer.current = setTimeout(() => setFlashIdx(null), 200)

      // 「再試一次」之後再揀：畫面可以重答，但進度／錯題 log 只記首次。
      const alreadyLogged = loggedIdsRef.current.has(currentQ.id)
      if (alreadyLogged) return
      loggedIdsRef.current.add(currentQ.id)
      setFirstAnswer({ selectedZh: zh, isCorrect })

      // 第 3 週 · 引擎五：更新連續狀態。刻意冇任何 UI 反映呢個數 ——
      // 「你連續答啱 3 題」睇落係鼓勵，但佢同時令中斷嗰下變成一件事，
      // 憲章第 7 條唔准出現咁樣嘅懲罰性回饋。所以連續數永遠唔顯示。
      setStreak((prev) => advanceStreak(prev, isCorrect))
      // 第 1 週 · 引擎一：答對輕柔「叮」聲。設定預設關閉，playCorrectChime 內部
      // 自行檢查，關閉時直接 return。答錯【刻意不設任何音效】——
      // 用聲音標示答錯等於把錯誤變成一個可聽見的判決，違反憲章第 7 條。
      if (isCorrect) playCorrectChime()
      // Wrong answers feed due reviews, topic nudges and recommendations (founders' reply 7a,
      // 2026-10-04). Until 2026-10-02 this was written by the cause card; no cause is asked now.
      // Only what the student picked is kept (charter §16.E constraint 5).
      else
        logReverseError({
          subjectId,
          questionId: currentQ.id,
          topic: currentQ.topicZh,
          topicEn: currentQ.topicEn,
          topicId: currentQ.topic,
          selected: zh,
          correct: currentQ.correctZh,
          ts: Date.now(),
          difficulty: currentQ.difficulty,
        })
      // F-PRG: 記入今日光譜（真實作答先記，唔靠估算）
      recordSpectrumAnswer(currentQ.difficulty, isCorrect)
    },
    [answerState, currentQ, subjectId]
  )

  const next = useCallback(() => {
    const scored = firstAnswer ?? answerState
    const newAnswers = [...answers, scored]
    setAnswers(newAnswers)
    setAnswerState(null)
    setFirstAnswer(null)

    if (current + 1 >= totalQ) {
      const score = newAnswers.filter((a) => a?.isCorrect).length
      const subjectName = subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : tr('練習', 'Practice')
      const topicResults = buildTopicResults(questions, newAnswers)
      const difficultyResults = buildDifficultyResults(questions, newAnswers)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)

      // C6「只做 1 題」收結：一題係出唔到有意義嘅等級嘅，硬計出嚟就係
      // 憑一個數據點貼標籤（違憲章 #2 零標籤傷害）。所以呢條路：
      //   • grade 記做 '—'，唔會喺進度頁扮成一次「Level X」
      //   • 唔寫 dse_result —— 嗰個 key 代表「最近一份完整卷」，一題唔算
      //     （亦令 /result 同溫書地圖報告完全唔使改）
      //   • 唔跳頁，就地出一個溫暖收結畫面
      if (totalQ === 1) {
        recordAttempt({
          subjectId, subjectName, topicFilter: topicFilter ?? null,
          score, total: 1, grade: '—', topicResults, elapsed, timestamp: Date.now(),
        })
        sendPracticeCount({ subject: subjectId, event: 'completed', fromResult: false, answered: 1 })
        recordTopicOutcomes(subjectId, buildTopicOutcomes(questions, newAnswers))
        if (subjectId === 'chinese') recordConceptHits(buildConceptRows(questions, newAnswers))
        clearActiveSession()
        notifyProgressChanged()
        setJustOneDone(true)
        return
      }

      // Subjects with no MC exam, or a longest-option hold, do not store a level.
      // The result page never renders this field; the predictor reads practice history.
      const grade = levelEstimateBlock(subjectId)
        ? '—'
        : predictGrade(score, getPracticeCutoffs(totalQ, subjectId), subjectId).grade
      const resultData = {
        score,
        total: totalQ,
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        topicResults,
        difficultyResults,
        elapsed,
        // 發現卡要知呢一節由幾時開始，先至數得返「呢一節發現咗幾多樣」。
        //
        // ⚠️ 刻意擺喺 `dse_result`（純本機）而唔係 recordAttempt ——
        // 後者寫入 `dse_progress`，而 `dse_progress` 係【上雲白名單】入面
        // 三個 key 之一（憲章 §16.E 執行第 1 點）。往嗰邊加欄位等於改雲端
        // schema，要創辦人書面批准；而呢個數字純粹係畀本機一版畫面用。
        startedAt: startTime,
        // 結果頁「練返最弱課題」要課題 id 先砌得到連結（lib/resultNextSteps.ts）。
        // topicResults 只存顯示名稱，而且同時寫入上雲的 dse_progress，所以 id 另存於此，
        // 理由同上面 startedAt 一樣：只供本機一版畫面用，不改雲端 schema。
        topicIds: Object.fromEntries(questions.map((q) => [q.topicZh, q.topic])),
        // 覆核用：逐題「題目 id + 揀咗邊個選項文字」。/result 會 POST 去
        // /api/result/verify 由服務端用答案庫重批一次對數。純本地＋一次過，
        // 唔存 server。用選項文字而唔用 index —— 選項每次 render 都洗牌。
        submitted: questions.map((q, i) => ({
          questionId: q.id,
          selectedZh: newAnswers[i]?.selectedZh ?? null,
        })),
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
        difficultyResults,
      })
      // Anonymous count (founders' reply 40a): sent before the move to /result, with keepalive.
      sendPracticeCount({ subject: subjectId, event: 'completed', fromResult: false, answered: totalQ })
      // Update the weakness tally (powers the dashboard radar / repair worksheet).
      recordTopicOutcomes(subjectId, buildTopicOutcomes(questions, newAnswers))
      if (subjectId === 'chinese') recordConceptHits(buildConceptRows(questions, newAnswers))
      clearActiveSession() // run finished — nothing left to resume, here or on any device
      notifyProgressChanged() // push the cleared state up so other devices stop offering it
      router.push('/result')
    } else {
      // ── 第 3 週 · 引擎五：無聲難度自適應 ────────────────────────────────
      // 只喺【未做嗰截】入面換位，做完嗰截原封不動，所以 answers[i] 同
      // questions[i] 永遠對得返。題目集合由頭到尾唔變 → 3:5:2 分毫不變。
      const nextStreak = advanceStreak(streak, scored?.isCorrect ?? false)
      const want = preferredTier(currentQ.difficulty, nextStreak)
      let ordered = questions
      const tail = questions.slice(current + 1)
      // 學生有要求就照要求揀；冇符合嘅題（例如已經係最難一級）就交返自適應。
      const wished = nextWish ? wishIndex(tail, currentQ, nextWish) : -1
      if (nextWish) setNextWish(null)
      if (wished >= 0 || want) {
        const pick = wished >= 0 ? wished : nextIndex(tail.map((q) => q.difficulty), want)
        if (pick > 0) {
          const swapped = [...questions]
          const at = current + 1
          ;[swapped[at], swapped[at + pick]] = [swapped[at + pick], swapped[at]]
          ordered = swapped
          setQuestions(swapped)
        }
      }
      setCurrent((c) => c + 1)
      setHintOpen(false)
      setHackOpen(false)
      // v3.0 F1: checkpoint the run so a refresh, a closed tab, or another device can
      // pick it up at exactly this question. Rides the existing synced snapshot.
      saveActiveSession({
        v: 1,
        subjectId,
        topicFilter: topicFilter ?? null,
        mode,
        // 用重排之後嘅次序 —— 唔係嘅話，refresh 返嚟會見到另一條題
        questionIds: ordered.map((q) => q.id),
        answers: newAnswers.map((a) => (a ? { selectedZh: a.selectedZh, isCorrect: a.isCorrect } : null)),
        current: current + 1,
        elapsed: Math.floor((Date.now() - startTime) / 1000),
        updatedAt: Date.now(),
      })
      notifyProgressChanged()
    }
  }, [answers, answerState, firstAnswer, current, totalQ, questions, startTime, router, subjectId, subjectMeta, topicFilter, tr, mode, streak, nextWish, currentQ])

  // Proceed past a question. When a server-signed lock exists, do a final server check
  // (blocks a DevTools-zeroed countdown). FAIL-OPEN: any disabled/offline/error path
  // returns OK, so a student is never wrongly stuck. A genuine "not expired" reply
  // re-holds the client lock for a few seconds.
  // 2026-09-09：原本要先向 server 驗一次個簽名鎖仲有效（防 DevTools 篡改倒數），
  // 驗完先放行。鎖已剷除，所以「下一題」就係直接落下一題。
  const proceed = next

  // 「下一題」掣出唔出、Enter 可唔可以推進 —— 【同一個判斷】，下面 JSX 同鍵盤
  // handler 都用佢，唔准各自寫一份。2026-10-02 起答錯唔使先揀錯因（憲章 §7.2），
  // 答完任何一題即可推進。
  const canProceed = answerState !== null
  const sessionRef = useRef<HTMLDivElement>(null)
  // Wave 2：答完可「再試一次」——只清本畫面，唔撤銷已記嘅首次作答；再揀唔重複記 log。

  const retryCurrent = useCallback(() => {
    if (answerState === null) return
    setAnswerState(null)
    setFlashIdx(null)
    setPickedCause(null)
    setWishOpen(false)
    setHackOpen(false)
  }, [answerState])

  // ── 鍵盤快捷鍵：1–4 ／ A–D 揀選項，Enter 落下一題 ────────────────────────
  //
  // ⚠️ 呢個【唔係】無障礙合規修補。選項掣本身一直 Tab 得到、Enter 撳得到，
  //    WCAG 2.1.1 本來就過。呢度做嘅係效率：一節 10 題，純鍵盤操作由
  //    「Tab ×N ＋ Enter」變成一下掣。對 ADHD 學生特別實際 ——
  //    每多一下操作就多一個分心位。講清楚呢點，係因為憲章 §16.D 判例
  //    就係「把一樣嘢講成保護學生」而實情唔係。
  //
  // 三條唔可以省嘅守則：
  //   ① 輸入焦點一律唔攔。學生喺 input／textarea／contenteditable 打緊字嗰陣
  //      撳「A」係要打一個 A，唔係揀 A。
  //   ② 有修飾鍵一律唔攔 —— ⌘A 全選、⌃D 等系統同瀏覽器快捷鍵要照行。
  //   ③ 答咗就唔再接受選項鍵。同 `disabled` 掣一致 —— 唔可以由鍵盤繞過一個
  //      介面上已經封咗嘅操作。
  //
  // Enter 只喺焦點【唔喺任何掣上面】先接手：焦點喺「下一題」嗰陣，
  // 瀏覽器自己已經會觸發一次，再攔多次就會一下撳跳兩題。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return

      // Shift + F：專注燈。擺喺兩個守衛之後 —— 輸入框打大階 F 唔可以變成切換，
      // 而 ⌘/⌃/⌥ 組合亦已經喺上面放行咗畀瀏覽器。
      // 唔理 answerState：睇解析嗰陣一樣想熄得返個燈。
      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault()
        toggleFocusLight()
        return
      }

      if (e.key === 'Enter') {
        // 同「下一題」掣同一個條件；休息模式開住嗰陣亦唔可以喺 modal 背後推進。
        if (!canProceed || restOpen) return
        if (el && /^(BUTTON|A)$/.test(el.tagName)) return // 交返畀瀏覽器原生觸發
        e.preventDefault()
        proceed()
        return
      }

      // 方向鍵只移動焦點，不提交。揭曉後選項仍可讀，一樣可以在選項之間移動。
      if (
        el?.hasAttribute('data-practice-option') &&
        (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft')
      ) {
        if (restOpen) return
        const group = el.closest('[data-practice-options]')
        const buttons = group ? [...group.querySelectorAll<HTMLButtonElement>('[data-practice-option]')] : []
        const at = buttons.indexOf(el as HTMLButtonElement)
        if (at >= 0 && buttons.length > 0) {
          e.preventDefault()
          const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1
          buttons[(at + dir + buttons.length) % buttons.length]?.focus()
        }
        return
      }

      // 休息模式係一個 modal —— 唔可以喺佢背後用鍵盤答題。
      // 揭曉後不再接受 1–4／A–D，與 aria-disabled 一致，鍵盤不能改已揀的答案。
      if (answerState !== null || !currentQ || restOpen) return
      const k = e.key.toUpperCase()
      const idx = /^[1-4]$/.test(k) ? Number(k) - 1 : 'ABCD'.indexOf(k)
      const opt = idx >= 0 ? currentQ.shuffledOptions[idx] : undefined
      if (!opt) return
      e.preventDefault()
      selectOption(opt.zh, idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answerState, currentQ, selectOption, proceed, toggleFocusLight, canProceed, restOpen])

  // Tab：選項 → 下一題 → 解析。下一題在版面上貼住欄底，DOM 在解析之後，所以由這裡改次序。
  // 無障礙浮動掣在頁面之後，不會插進 A–D 中間。
  useEffect(() => {
    if (answerState === null) return
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || e.altKey || e.metaKey || e.ctrlKey || restOpen) return
      const root = sessionRef.current
      const feedback = feedbackRef.current
      if (!root || !feedback) return
      const options = [...root.querySelectorAll<HTMLElement>('[data-practice-option]')]
 const nextBtn = root.querySelector<HTMLElement>('.practice-next-btn')
      if (!nextBtn || options.length === 0) return
      const inFeedback = listPracticeFocusables(feedback)
      const all = listPracticeFocusables(document.body)
      const nextIdx = all.indexOf(nextBtn)
      const afterNext = nextIdx >= 0 ? (all.slice(nextIdx + 1).find((el) => !feedback.contains(el)) ?? null) : null
      const active = document.activeElement as HTMLElement | null
      if (!active) return
      if (!root.contains(active) && active !== afterNext) return
      const slot = slotFor(active, { options, nextBtn, feedback, inFeedback, afterNext })
      const dest = practiceTabDestination(slot, e.shiftKey)
      if (!dest) return
      const target = tabStopElement(dest, { options, nextBtn, feedback, inFeedback, afterNext })
      if (!target) return
      e.preventDefault()
      target.focus(dest === 'next' || dest === 'option-last' ? { preventScroll: true } : undefined)
    }
    window.addEventListener('keydown', onTab)
    return () => window.removeEventListener('keydown', onTab)
  }, [answerState, restOpen])

  // Rebuild the exact run from the saved question IDs. Grading is anchored to option
  // TEXT (`correctZh`) and the drill is forward-only, so re-shuffling the options of
  // not-yet-seen questions changes nothing. Shifting `startTime` back by the elapsed
  // seconds keeps every existing elapsed calculation correct without touching them.
  const acceptResume = useCallback(() => {
    if (!resumeOffer) return
    const byId = new Map(bank.map((q) => [q.id, q]))
    const restored = resumeOffer.questionIds
      .map((id) => byId.get(id))
      .filter((q): q is Question => Boolean(q))
    if (restored.length !== resumeOffer.questionIds.length) {
      // The bank changed under us — start clean rather than resume a mismatched set.
      clearActiveSession()
      setResumeOffer(null)
      return
    }
    resumedRef.current = true // a resumed set was counted when it first started
    setQuestions(restored.map(prepareQuestion))
    setAnswers(resumeOffer.answers as AnswerState[])
    setCurrent(resumeOffer.current)
    setStartTime(Date.now() - resumeOffer.elapsed * 1000)
    setResumeOffer(null)
  }, [resumeOffer, bank])

  // Anonymous count (founders' reply 40a): one "started" per new set, once the first
  // question is on screen. Not while a resume card is waiting, and not for a resumed set.
  useEffect(() => {
    if (startCounted.current || resumedRef.current || resumeOffer || questions.length === 0) return
    if (current !== 0 || answers.length !== 0) return
    startCounted.current = true
    sendPracticeCount({ subject: subjectId, event: 'started', fromResult: cameFromResult(window.location.search), answered: 0 })
  }, [resumeOffer, questions.length, current, answers.length, subjectId])

  const declineResume = useCallback(() => {
    clearActiveSession()
    notifyProgressChanged()
    setResumeOffer(null)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // C6「只做 1 題」收結。刻意冇分數、冇等級、冇「你仲有 19 題未做」——
  // 呢個入口係畀低動機／焦慮嘅學生，收結唯一嘅任務係肯定佢今日打開咗個網。
  // 亦冇「連續做咗幾多日」之類嘅計數（憲章 §2 禁 streak／解鎖）。
  if (justOneDone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-ink-soft">
 <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-surface-raised p-7 text-center shadow-[var(--shadow-float)]">
 <Sprout size={36} aria-hidden className="mx-auto mb-3 text-success" />
 <h2 className="mb-2 text-lg font-semibold text-ink">
            {tr('你今日打開咗嚟，已經好叻。', 'You showed up today. That already counts.')}
          </h2>
 <p className="mb-6 text-sm leading-relaxed text-ink-muted">
            {tr(
              '做完 1 題就夠喇。想再做就再做，唔想就收工 —— 兩樣都冇問題。',
              'One question is enough. Do another if you feel like it, or stop here — both are fine.',
            )}
          </p>
 <div className="flex flex-col gap-2.5">
 <button
              onClick={() => window.location.reload()}
              className="pressable min-h-12 w-full rounded-[var(--radius-control)] bg-accent-strong px-6 py-3 font-medium text-on-accent hover:bg-accent-hover"
            >
              {tr('再做多 1 題', 'One more question')}
            </button>
 <Link
              href="/dashboard"
              className="pressable flex min-h-12 w-full items-center justify-center rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-6 py-3 text-sm text-ink-muted hover:bg-surface-sunken"
            >
              {tr('今日就到呢度', "That's it for today")}
            </Link>
 </div>
 </div>
 </div>
    )
  }

  // v3.0 F1: an unfinished run is waiting (this device, or synced from another one).
  // Never auto-applied — the student chooses. Light-first tokens, no pressure language.
  if (resumeOffer) {
    const doneCount = resumeOffer.current
    const totalCount = resumeOffer.questionIds.length
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-ink-soft">
 <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-surface-raised p-7 text-center shadow-[var(--shadow-float)]">
 <MapPin size={36} aria-hidden className="mx-auto mb-3 text-accent" />
 <h2 className="mb-2 text-lg font-semibold text-ink">
            {tr('你有份未做完嘅練習', 'You have an unfinished run')}
          </h2>
 <p className="mb-1 text-sm leading-relaxed text-ink-muted">
            {tr(
              `${subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : '練習'}・已經做咗 ${doneCount} / ${totalCount} 題`,
              `${subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : 'Practice'} · ${doneCount} of ${totalCount} done`,
            )}
          </p>
 <p className="mb-6 text-xs leading-relaxed text-ink-muted">
            {tr('喺邊部機做都好，接返落去就得。', 'Pick up right where you left off, on any device.')}
          </p>
 <div className="flex flex-col gap-2.5">
 <button
              onClick={acceptResume}
              className="pressable min-h-12 w-full rounded-[var(--radius-control)] bg-accent-strong px-6 py-3 font-medium text-on-accent hover:bg-accent-hover"
            >
              {tr(`繼續做第 ${doneCount + 1} 題`, `Continue from question ${doneCount + 1}`)}
            </button>
 <button
              onClick={declineResume}
              className="pressable min-h-12 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-6 py-3 text-sm text-ink-muted hover:bg-surface-sunken"
            >
              {tr('重新開始一份', 'Start a fresh one')}
            </button>
 </div>
 </div>
 </div>
    )
  }

  // No questions for this subject/topic yet.
  if (totalQ === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center text-ink-soft">
 <Brain size={40} aria-hidden className="text-ink-muted" />
 <p className="max-w-sm text-ink-muted">
          {subjectMeta
            ? t.practice.notLive.replace('{subject}', tr(subjectMeta.name, subjectMeta.nameEn))
            : t.practice.notLiveGeneric}
        </p>
 <Link
          href="/subjects"
          className="pressable inline-flex min-h-12 items-center rounded-[var(--radius-control)] border border-line-strong px-4 text-sm font-medium text-accent hover:bg-surface-sunken"
        >
          {t.practice.otherSubjects}
        </Link>
 </div>
    )
  }

  if (!currentQ) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-4 text-ink-muted"
        role="status"
        aria-live="polite"
      >
 <Loader2 size={28} aria-hidden className="animate-spin text-accent motion-reduce:animate-none" />
 <span className="text-sm">{t.practice.loading}</span>
 </div>
 )
 }

 return (
 <div ref={sessionRef} className={`practice-session min-h-screen bg-surface px-4 py-4 sm:py-10 text-ink-soft${answerState ? ' practice-session-revealed' : ''}`}>
      {/* lg（≥1024px）加闊到 6xl，題目與回饋並排（UX 循環 LOOP 8，見下方 grid 註解）。
          1440px 起再加左欄（LOOP 40），整體加闊到 1296px：兩邊各留 72px，右欄唔會落入右下情緒支援掣（x=1376 起）之下。 */}
      <div className="practice-session-column max-w-2xl mx-auto lg:max-w-6xl desk:max-w-[1296px]">
 <div className={answerState ? 'practice-revealed-scroll' : undefined}>

        {/* 練習頂欄：返回｜科目｜題序；次要工具收入「更多」。判斷軌喺下面。 */}
        <div className="focus-dim chrome-material sticky top-0 z-30 practice-sticky-head -mt-2 border-b border-line pt-2 pb-3 mb-3">
 <div className="flex items-center gap-2 text-sm">
 <Link
              href="/subjects"
              aria-label={tr('返回科目選擇', 'Back to subject list')}
              className="-ml-2 inline-flex items-center gap-0.5 min-h-12 pl-1 pr-2 rounded-lg text-ink-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
 <ChevronLeft size={16} aria-hidden />
 <span className="text-xs">{tr('返回', 'Back')}</span>
 </Link>
            {subjectMeta && (
              <span className="min-w-0 truncate text-ink-soft font-medium max-w-[42%] sm:max-w-[14rem]">
                {tr(subjectMeta.name, subjectMeta.nameEn)}
              </span>
            )}
            {mode === 'weakness' && (
              <span className="hidden sm:inline text-[11px] text-ink-muted">
                {tr('盲點修復', 'Repair set')}
              </span>
            )}
            {mode === 'cause' && cause && (
              <span className="hidden sm:inline text-[11px] text-ink-muted truncate max-w-[10rem]">
                {cause === 'A'
                  ? tr('專攻概念', 'Concept focus')
                  : cause === 'B'
                    ? tr('專攻審題', 'Question focus')
                    : tr('專攻運算', 'Calculation focus')}
              </span>
 )}
 <span className="ml-auto flex items-center gap-1.5 shrink-0">
 <span className="text-sm sm:text-base text-ink tabular-nums font-medium">
                {t.practice.progress.replace('{n}', String(current + 1)).replace('{total}', String(totalQ))}
              </span>
              {showElapsed && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-ink-muted">
 <Clock size={13} aria-hidden /> {formatTime(elapsed)}
                </span>
 )}
 <PracticeMoreMenu
                en={locale === 'en'}
                hideTimer={hideTimer}
                perQTimer={perQTimer}
                qLeftLabel={perQTimer !== 0 ? formatTime(qLeft) : null}
                qLeftUrgent={qLeft === 0}
                onCycleTimer={() => {
                  const i = TIMER_OPTIONS.indexOf(perQTimer)
                  const nextOpt = TIMER_OPTIONS[(i + 1) % TIMER_OPTIONS.length]
                  setPerQTimer(nextOpt)
                  setQuestionTimer(nextOpt)
                  setQStart(Date.now())
                  setQSpent(0)
                }}
                onRest={() => setRestOpen(true)}
              />
              {/* 無障礙入口：練習沉浸時頂欄常駐（含桌面），一撳可達。 */}
              <A11yButton className="!inline-flex" />
 </span>
 </div>
 <div className="mt-2">
 <QuestionStatusStrip statuses={questionStatuses(totalQ, answers, current)} current={current} en={locale === 'en'} />
 </div>
 </div>

        {/* 2026-09-30（UX 循環 LOOP 8）：≥1024px 題目與回饋並排。1024×768 實測，題目卡只佔中間 672px、
            兩邊各約 170px 空白，答題後回饋由 y=668 開始，「下一題」在 y=1171，要捲約 500px。
            並排後回饋在題目右邊由頂開始；1023px 或以下維持單欄，行為不變。 */}
        {/* lg:max-xl:pr-14：1024–1279px 時整個版面貼近右邊，右欄「下一題」右端會落在右下情緒支援掣
            （48px 加 16px 邊距）之下；留出 56px。xl 起版面已置中，右邊有足夠空位。 */}
        {/* desk（1440px，globals.css @theme）：左欄（PracticeContextRail）＋題目＋回饋三欄；左欄在 1440px 以下 display:none，不佔格。 */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:max-xl:pr-14 desk:grid-cols-[220px_1fr_1fr]">
 <PracticeContextRail subjectId={subjectId} topicLabel={tr(currentQ.topicZh, currentQ.topicEn)} />
        {/* Question card */}
        {/* 規格 §7.3A 頁面轉場：新題由右滑入（400ms）。key 綁題號，換題先重播。
            ⚠️ 只做【入場】—— 規格原文仲要「舊題向左滑出」，但離場動畫要留住
            舊 node 再等 400ms，等於每題多 0.4 秒延遲，一個 20 題 session 就係
            8 秒白等。方向感由入場方向已經帶到，離場暫時唔做。 */}
        <div key={currentQ.id} className="practice-q-card bg-surface-raised border border-line rounded-2xl p-5 sm:p-8 mb-4 ml-q-enter shadow-sm">
          {/* Meta：課題優先；難度次要。框架改入可選提示（Wave 2 brief）。 */}
          <div className="flex items-center gap-2 flex-wrap mb-5 sm:mb-6">
 <span className="text-xs font-medium text-ink bg-surface-sunken border border-line-strong px-3 py-1 rounded-full">
              {tr(currentQ.topicZh, currentQ.topicEn)}
            </span>
 <DifficultyBadge difficulty={currentQ.difficulty} />
            {/* 機器閘題目為原創改寫，並無對應年份，入庫時記為 0 —— 不可以憑空填一個
                年份充當「歷屆」（憲章 §8 禁止虛構數據），故 0 直接不顯示，
                而非印出一個「0」。 */}
            {currentQ.year ? (
              <span
                className="text-xs text-ink-muted bg-surface-sunken px-3 py-1 rounded-full ml-auto"
                title={tr('內部題庫標記，唔係考評局年份', 'An internal bank tag, not an HKEAA paper year')}
              >
                {tr(`內部標記 ${currentQ.year}`, `Bank tag ${currentQ.year}`)}
              </span>
 ) : null}
 </div>

          {/* 題幹維持無襯線：呢度係要逐字讀嘅正文，唔係標題（BDA）。只跟模板加大。 */}
          <p id="practice-question" className="text-lg sm:text-xl leading-relaxed mb-5 sm:mb-8 text-ink">
 <MathText>{tr(currentQ.content, currentQ.contentEn)}</MathText>
 </p>

          {answerState === null && (
            <div className="mb-5">
 <button
                type="button"
                aria-expanded={hintOpen}
                onClick={() => setHintOpen((v) => !v)}
 className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-line px-3 text-xs text-ink-muted hover:text-ink-soft transition-colors"
 >
 <Lightbulb size={14} aria-hidden className="text-gold" />
                {tr('提示（可選）', 'Hint (optional)')}
                <ChevronDown size={14} className={hintOpen ? 'rotate-180 transition-transform' : 'transition-transform'} aria-hidden />
 </button>
              {hintOpen && (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft rounded-xl border border-line bg-surface-sunken px-3 py-3">
                  {tr(
                    `可以試用「${currentQ.frameworkZh}」嚟諗——唔一定啱，只係一個起步。`,
                    `Try thinking with “${currentQ.frameworkEn}” — optional, just a starting point.`,
                  )}
                </p>
 )}
 </div>
          )}

          {/* ── 第 3 週 · 引擎五之二：時間到 ──────────────────────────────
              規格書 §4.9：「時間到，休息一下」。到此為止 —— 唔會自動交、
              唔會跳題、唔會封住選項、唔會記低你超時。學生想繼續就繼續。
              金色（發現／提醒），唔用紅色。 */}
          {qTimeUp && (
            <p className="blindspot-in mb-4 text-sm text-gold">
              {tr('時間到 —— 唞一唞都得，想繼續就繼續，冇嘢會因為咁而改變。',
                  'Time’s up — take a breather if you like. Carry on whenever; nothing changes because of it.')}
            </p>
          )}

          {/* Options. Real buttons: aria-pressed is the choice, aria-disabled keeps
              the text readable after reveal. Arrow keys move focus; Space or Enter selects. */}
          <div
            className="space-y-3 practice-options-stack"
            role="group"
            aria-labelledby="practice-question"
            data-practice-options
          >
            {currentQ.shuffledOptions.map((opt, idx) => {
              const isCorrectOpt = opt.zh === currentQ.correctZh
              const isSelected = answerState !== null && opt.zh === answerState.selectedZh
              const isSelectedWrong = isSelected && !answerState.isCorrect

              let style =
                'border-line-strong bg-surface-sunken cursor-pointer [@media(hover:hover)]:hover:border-accent/40 [@media(hover:hover)]:hover:bg-surface-raised'

              if (answerState !== null) {
                if (isCorrectOpt) {
                  style = 'border-accent bg-accent/[0.10] cursor-default shadow-sm'
                } else if (isSelectedWrong) {
                  // 答錯用粘土／琥珀邊，加上文字「未揀中」，不單靠顏色，亦不用玫紅。
                  style = 'border-gold bg-gold/[0.08] cursor-default shadow-sm'
                } else {
                  style = 'border-line bg-surface-sunken cursor-default'
                }
              }

              const flash =
                flashIdx === idx
                  ? answerState !== null && !answerState.isCorrect
                    ? ' answer-feedback answer-feedback-miss'
                    : ' answer-feedback'
                  : ''

              return (
                <button
                  key={idx}
                  type="button"
                  data-practice-option=""
                  aria-pressed={isSelected}
                  aria-disabled={answerState !== null}
                  onClick={() => selectOption(opt.zh, idx)}
                  className={`practice-option ml-press relative w-full min-h-14 sm:min-h-12 text-left flex items-start gap-3 border rounded-xl px-4 py-4 sm:py-3 transition-[colors,transform,opacity,box-shadow] duration-100 ${style}${flash}`}
                >
 <span className="shrink-0 w-7 h-7 rounded-lg bg-surface-sunken flex items-center justify-center text-sm font-medium text-ink-muted mt-0.5">
                    {optionLetters[idx]}
                  </span>
 <span className="leading-relaxed text-sm sm:text-base text-ink-soft">
 <MathText>{tr(opt.zh, opt.en)}</MathText>
 </span>
                  {answerState !== null && isCorrectOpt && (
                    <span className="ml-auto inline-flex items-center gap-1 shrink-0 text-xs font-medium text-ink">
 <CheckCircle size={18} aria-hidden className="text-accent" />
                      {tr('答案', 'Answer')}
                    </span>
                  )}
                  {isSelectedWrong && (
                    <span className="ml-auto inline-flex items-center gap-1 shrink-0 text-xs font-medium text-ink">
 <Lightbulb size={18} aria-hidden className="text-gold" />
                      {tr('未揀中', 'Not chosen')}
                    </span>
 )}
 </button>
 )
 })}
 </div>

          {/* 快捷鍵提示。一個冇人知嘅快捷鍵等於冇 —— 所以一定要寫出嚟。
              `hidden sm:block`：觸控裝置冇實體鍵盤，講咗只係阻頭阻勢。
              ⚠️ 用 `text-ink-muted`（淺色 5.93 / 暗色 5.25）而【唔用】`ink-faint`：
              globals.css:62 明文寫住 ink-faint 係 2.43，未達 AA，只限停用控件同裝飾。
              ⚠️ 亦【唔加】`aria-hidden`。第一版加咗，錯 —— 咁樣做嘅話
              docs/a11y-runtime-sweep 個探針會跳過呢個元素（佢刻意唔掃裝飾元素），
              即係我自己整咗一段睇唔清嘅字，再親手令自己個閘睇唔到佢。
              而且讀屏用戶一樣用鍵盤，呢句對佢哋唔係多餘。 */}
          {/* focus-dim：快捷鍵提示係周邊 chrome；專注燈開時淡化，hover／focus-within 可還原。
              Wave 2 合併頂欄後 PracticeSession 內只剩 sticky＋右欄兩個 focus-dim，
              呢度補返第三個淡化區，令專注模式繼續收淡非題幹 UI。 */}
          <p className="focus-dim hidden sm:block mt-3 text-[11px] text-ink-muted">
            {answerState === null
              ? tr('快捷鍵：1–4 或 A–D 揀答案；方向鍵移動，空白鍵或 Enter 確認', 'Shortcuts: 1–4 or A–D to answer. Arrow keys move, Space or Enter confirms')
              : tr('快捷鍵：Enter 落下一題', 'Shortcut: Enter for the next question')}
            {' · '}
            {focusLight
              ? tr('Shift + F 熄專注燈', 'Shift + F to turn the focus light off')
              : tr('Shift + F 開專注燈', 'Shift + F for focus light')}
          </p>
 </div>

        {/* 讀屏：答題結果一句講完。區域常駐（內容由空變有），讀屏軟件才會讀出。 */}
        <p className="sr-only" aria-live="polite">
          {answerState === null
            ? ''
            : answerState.isCorrect
              ? tr('答啱。解析喺右邊；窄螢幕就喺下面。', 'Correct. The explanation is on the right; on a narrow screen it is below.')
              : tr('未揀中。正確答案同解析已經標示。可以記低原因，亦可以略過。', 'Not the one chosen. The answer and explanation are shown. You can note a reason, or skip.')}
        </p>

        {/* Feedback + Next */}
        {answerState !== null && (
          <div ref={feedbackRef} tabIndex={-1} className="animate-slide-up practice-feedback">
 <>
                {answerState.isCorrect ? (
                  /* Correct — calm acknowledgement, no fanfare. */
                  <div className="practice-explain rounded-2xl p-5 mb-4 border bg-accent/[0.10] border-accent/30 shadow-sm">
 <div className="flex items-center gap-2 mb-2">
 <CheckCircle size={18} aria-hidden className="text-accent" />
 <span className="text-accent font-medium">{t.practice.correct}</span>
 </div>
                    {/* #54 逐步拆解：先出首句（或真步驟第一步），逼多諗一步先揭全部。
                        學生可一次過選擇「以後直接睇晒」，之後唔會再問。 */}
                    <div className="flex items-start gap-1.5">
 <Brain size={14} aria-hidden className="text-gold shrink-0 mt-1" />
 <div className="min-w-0 flex-1">
 <StagedExplanation
                          text={tr(currentQ.explanation, currentQ.explanationEn)}
                          steps={locale === 'en' ? (currentQ.stepsEn ?? currentQ.steps) : currentQ.steps}
                        />
 <OptionNotes
                          notes={currentQ.optionNotes}
                          options={currentQ.shuffledOptions}
                          correctId={currentQ.correctIndex}
                          selectedZh={answerState.selectedZh}
                        />
                        {/* 答啱一樣要出來源披露 —— 兩條分支都要，否則答啱嘅學生
                            永遠見唔到，個披露就變成「淨係錯先話你知」。 */}
                        <QuestionProvenance questionId={currentQ.id} />
 </div>
 </div>
 </div>
                ) : (
                  /* Wrong → the solution shows straight away (2026-10-02, charter §7.2). */
                  <div className="practice-explain practice-miss rounded-2xl p-5 mb-4 border shadow-sm">
 <div className="flex items-center gap-2 mb-3">
 <Brain size={18} aria-hidden className="text-gold" />
 <span className="text-gold font-medium">{tr('未揀中', 'Not the one chosen')}</span>
 </div>
 <div className="border-t border-gold/15 pt-3">
 <StagedExplanation
                        text={tr(currentQ.explanation, currentQ.explanationEn)}
                        steps={locale === 'en' ? (currentQ.stepsEn ?? currentQ.steps) : currentQ.steps}
                        label={
                          <span className="text-gold text-xs font-medium mr-1">
                            💡 {tr('正解思路：', 'Reasoning: ')}
                          </span>
 }
 />
 <OptionNotes
                        notes={currentQ.optionNotes}
                        options={currentQ.shuffledOptions}
                        correctId={currentQ.correctIndex}
                        selectedZh={answerState.selectedZh}
                      />
 </div>

                    {/* 可選錯因 —— 唔鎖下一題；略過唔造假 cause。 */}
                    <div className="mt-4 border-t border-gold/15 pt-3">
 <p className="mb-2 text-xs font-medium text-ink-muted">
                        {tr('想記低原因？（可以唔揀）', 'Note a reason? (optional)')}
                      </p>
 <div className="flex flex-wrap gap-2">
                        {MC_CAUSES.map((c) => {
                          const on = pickedCause === c.key
                          return (
                            <button
                              key={c.key}
                              type="button"
                              aria-pressed={on}
                              onClick={() => {
                                setPickedCause(c.key)
                                assignWrongAnswerCause(currentQ.id, c.key)
                              }}
                              className={`inline-flex min-h-12 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors ${
 on
 ? 'border-gold bg-gold/15 text-ink'
 : 'border-line text-ink-muted hover:text-ink-soft'
 }`}
                            >
                              <CauseMark cause={c.key} size="sm" />
                              {tr(c.zh, c.en)}
                            </button>
 )
 })}
 <button
                          type="button"
                          onClick={() => setPickedCause(null)}
                          className="inline-flex min-h-12 items-center rounded-full border border-transparent px-3 text-xs text-ink-muted underline underline-offset-4 hover:text-ink-soft"
                        >
                          {tr('略過', 'Skip')}
                        </button>
 </div>
 </div>

 <QuestionProvenance questionId={currentQ.id} />
 </div>
                )}

                {/* Path B — 名師速解 / MC Hack。Wave 2：可選、預設收合，唔同正解搶位。 */}
                {currentQ.mcHack && (
                  <div className="rounded-2xl mb-4 border bg-violet/[0.08] border-violet/30">
 <button
                      type="button"
                      aria-expanded={hackOpen}
                      onClick={() => setHackOpen((v) => !v)}
 className="flex w-full min-h-12 items-center gap-2 px-5 py-3 text-left"
 >
 <Zap size={18} aria-hidden className="text-violet shrink-0" />
 <span className="text-violet font-medium flex-1">
                        {tr('可選捷徑（選擇題）', 'Optional shortcut (multiple-choice)')}
                      </span>
 <ChevronDown
                        size={16}
                        aria-hidden
                        className={`text-violet shrink-0 transition-transform ${hackOpen ? 'rotate-180' : ''}`}
                      />
 </button>
                    {hackOpen && (
                      <div className="px-5 pb-5">
 <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                          {tr(
                            '可選捷徑，只適用於選擇題，唔係課程教學，亦唔代替上面嘅正解。',
                            'Optional shortcut for multiple-choice only. It is not syllabus teaching, and it does not replace the reasoning above.',
                          )}
                        </p>
 <div className="text-sm text-ink-soft leading-relaxed border-t border-violet/15 pt-3">
 <MathText>{tr(currentQ.mcHack, currentQ.mcHackEn)}</MathText>
 </div>
 </div>
 )}
 </div>
                )}

                {/* #83 計數機貼士卡 — 解析底部折疊區（按 topic 命中；未驗證卡 production 隱藏） */}
                <CalcTipCard topicId={currentQ.topic} />

                {/* #106 收藏 —— 擺喺解析【之後】：先睇明先決定值唔值得收，
                    而唔係一見到題就收埋一堆自己都唔知點解要收嘅嘢。 */}
                <BookmarkButton
                  subjectId={subjectId}
                  questionId={currentQ.id}
                  topic={tr(currentQ.topicZh, currentQ.topicEn)}
                  className="mb-4"
                />

                {/* 「下一題想要」預設摺疊 —— 主 CTA 在欄底，唔同解析搶同一行。 */}
                {current + 1 < totalQ && (() => {
                  const tail = questions.slice(current + 1)
                  const wishes: { key: NextWish; zh: string; en: string }[] = [
                    { key: 'same', zh: '同類型再一題', en: 'Same type again' },
                    { key: 'harder', zh: '難啲', en: 'Harder' },
                    { key: 'easier', zh: '易啲', en: 'Easier' },
                    { key: 'switch', zh: '換課題', en: 'Change topic' },
                  ]
                  return (
                    <div className="mt-3">
 <button
                        type="button"
                        aria-expanded={wishOpen}
                        onClick={() => setWishOpen((v) => !v)}
                        className="mx-auto flex min-h-12 items-center gap-1 text-[11px] text-ink-muted hover:text-ink-soft"
                      >
                        {tr('調整下一題難度', 'Adjust next difficulty')}
                        <ChevronDown size={14} className={wishOpen ? 'rotate-180 transition-transform' : 'transition-transform'} aria-hidden />
 </button>
                      {wishOpen && (
                        <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap text-[11px]">
                          {wishes.map((w) => {
                            const on = nextWish === w.key
                            const possible = wishIndex(tail, currentQ, w.key) >= 0
 return (
 <button
                                key={w.key}
                                onClick={() => setNextWish(on ? null : w.key)}
                                disabled={!possible}
                                aria-pressed={on}
                                className={`inline-flex min-h-12 items-center px-3 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
 on
 ? 'border-accent text-ink bg-surface-sunken'
 : 'border-line text-ink-muted hover:text-ink-soft'
 }`}
                              >
                                {tr(w.zh, w.en)}
                              </button>
 )
 })}
 </div>
 )}
 </div>
 )
 })()}
 </>
 </div>
        )}

        {/* 未答題時右欄的說明（只在 lg 顯示），答題後由回饋取代，避免右欄一片空白。 */}
        {answerState === null && (
          <p className="focus-dim hidden lg:block rounded-2xl border border-dashed border-line p-6 text-sm leading-relaxed text-ink-muted">
            {tr('揀咗答案之後，對錯同解析會喺呢邊出現，唔使捲落去。',
                'After you choose an answer, whether it was right and the explanation appear here, without scrolling.')}
          </p>
 )}
 </div>
 </div>
        {answerState !== null && (
          <div className="practice-next-bar">
 <button
              type="button"
              onClick={retryCurrent}
              className="practice-retry-btn"
              title={tr(
                '只重設畫面，首次作答同分數唔會改',
                'Resets the view only — first answer and score stay',
              )}
              aria-label={tr(
                '再試一次（只重設畫面，首次作答同分數唔會改）',
                'Try again (resets the view only; first answer and score stay)',
              )}
            >
              {tr('再試一次', 'Try again')}
            </button>
 <button type="button" onClick={proceed} className="practice-next-btn">
              {totalQ === 1 ? (
                tr('做完喇', 'Done')
              ) : current + 1 >= totalQ ? t.practice.seeResult : (
 <>{t.practice.next} <ChevronRight size={18} aria-hidden /></>
 )}
 </button>
 </div>
 )}
 </div>

      {/* B2: 一鍵休息 —— 反思鎖期間一樣開得，死線會一齊順延 */}
      <RestMode open={restOpen} onClose={closeRest} />
 </div>
  )
}
