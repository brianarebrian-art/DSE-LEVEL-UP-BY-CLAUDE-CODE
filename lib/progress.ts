// Client-side learning-progress store (localStorage).
// Designed so a server-backed implementation (once the user logs in + we add a DB)
// can replace the storage layer without changing the public API.

import { notifyProgressChanged } from '@/lib/sync'

export interface AttemptRecord {
  subjectId: string
  subjectName: string
  topicFilter: string | null
  score: number
  total: number
  grade: string
  topicResults: { topic: string; correct: number; total: number }[]
  elapsed: number
  timestamp: number // epoch ms
  /**
   * 逐難度層作答統計。掌握度階梯（lib/mastery.ts）要嘅係【跨節累計】嘅逐層
   * 數字 —— 單一節出唔到等級（Level 3 已經要 t1≥10 且 t2≥15，即超過 20 題）。
   * 練習頁本來就已經算好呢個物件寫入 `dse_result`，此處只係順手一併存落長期
   * 紀錄。optional：2026-08-23 之前嘅記錄冇呢欄，估算會自動跳過嗰啲節。
   */
  difficultyResults?: Record<'easy' | 'medium' | 'hard', { correct: number; total: number }>
}

const KEY = 'dse_progress'

function isBrowser() {
  return typeof window !== 'undefined'
}

/**
 * 一筆記錄夠唔夠完整可以攞去用。
 *
 * 2026-08-21：驗證儀表板嗰陣寫錯咗一筆測試資料（少咗 `topicResults`），
 * 成個 /dashboard 即刻 crash —— `a.topicResults is not iterable`。
 * 舊寫法係 `parsed as AttemptRecord[]`：只驗咗外層係咪陣列，
 * 每一筆入面有咩就當佢啱，一筆壞就冧成版。
 *
 * localStorage 唔係我哋控制得到嘅地方：寫到一半冇電、配額爆滿被截斷、
 * 擴充功能、學生自己開 devtools 貼嘢，都會整壞。一個學生嘅練習紀錄
 * 唔應該因為其中一筆爛咗就成個進度頁見唔到。
 *
 * 故此改為逐筆驗，爛嗰筆丟走，其餘照用。
 */
function isUsableAttempt(a: unknown): a is AttemptRecord {
  if (typeof a !== 'object' || a === null) return false
  const r = a as Record<string, unknown>
  return (
    typeof r.subjectId === 'string' &&
    typeof r.score === 'number' &&
    typeof r.total === 'number' &&
    typeof r.timestamp === 'number' &&
    Array.isArray(r.topicResults)
  )
}

export function loadAttempts(): AttemptRecord[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // 靜靜哋隔走爛記錄：學生見到嘅只係少咗嗰一次紀錄，
    // 而唔係成個進度頁冧咗。
    return parsed.filter(isUsableAttempt)
  } catch {
    return []
  }
}

export function recordAttempt(a: AttemptRecord): void {
  if (!isBrowser()) return
  const all = loadAttempts()
  all.push(a)
  // Keep the store bounded (most recent 500 attempts).
  const trimmed = all.slice(-500)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  notifyProgressChanged() // queue a debounced cloud sync (if signed in)
}

export function clearProgress(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEY)
}

// ── Derived statistics ──────────────────────────────────────────────

export interface SubjectStat {
  subjectId: string
  subjectName: string
  attempts: number
  questions: number
  correct: number
  accuracy: number // 0–1
  bestGrade: string
}

export interface TopicStat {
  topic: string
  correct: number
  total: number
  accuracy: number
}

export interface ProgressStats {
  totalAttempts: number
  totalQuestions: number
  totalCorrect: number
  overallAccuracy: number // 0–1
  recentActiveDays: number // distinct practice days inside the trailing window
  activeDays: number
  subjects: SubjectStat[]
  weakTopics: TopicStat[]
  recent: AttemptRecord[]
}

const GRADE_RANK = ['U', '1', '2', '3', '4', '5', '5*', '5**']

// 公社科用「達標／不達標」，同 1–5** 唔喺同一把尺上，故【唔可以】直接比較。
// 兩者混入同一組 attempts 時，只喺同制式之間比；跨制式一律保留原有嗰個，
// 避免「達標」被當成低過「1」（indexOf 回 -1）而靜靜雞蓋走學生嘅最佳成績。
const CSD_GRADES = ['達標', '不達標']

/**
 * 兩個等級之間保留「較好」嗰個。`a` = 累積落嚟嘅最佳值，`b` = 今次新成績。
 *
 * 跨制式（一邊 1–5**、一邊達標制）時一律 **保留 `a`** —— 同一科唔會有兩種制式，
 * 所以跨制式比較本身就代表數據唔乾淨；呢個情況下保住已累積嘅值，好過用一個
 * 唔可比嘅新值去蓋。export 出嚟純為咗測試呢條邊界。
 */
export function betterGrade(a: string, b: string): string {
  // 「未有任何成績」用空字串表示，唔可以用某一制式嘅最低級（例如 'U'）做種子值：
  // 'U' 屬 1–5** 制，落到下面嘅跨制式分支就會永遠贏過「達標」，令公社科嘅
  // bestGrade 一世卡死喺 'U'。呢個係 2026-08-04b 修補漏咗嘅一半。
  if (!a) return b
  if (!b) return a

  const aCsd = CSD_GRADES.includes(a)
  const bCsd = CSD_GRADES.includes(b)
  if (aCsd !== bCsd) return a
  if (aCsd && bCsd) return a === '達標' ? a : b
  return GRADE_RANK.indexOf(a) >= GRADE_RANK.indexOf(b) ? a : b
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

/** 近期活躍窗口（日）。 */
export const RECENT_WINDOW_DAYS = 30

/**
 * 最近 `RECENT_WINDOW_DAYS` 日之內，有練習的日數（去重）。
 *
 * 此函數取代了原本的「連續打卡」（consecutive-day streak）。連續計數的問題不在於
 * 使用了火焰符號，而在於【中斷一日即歸零】：學生休息一天，畫面就把過往的累積一次
 * 抹掉，等同宣告「之前的努力白費」。對焦慮傾向的學生而言，這是純粹的壓力來源；
 * 對 ADHD 學生而言，歸零之後重新開始的門檻反而更高。
 *
 * 改為窗口計數之後，休息一天只會令數字少一，不會清零，習慣回饋仍然保留。
 */
function computeRecentActiveDays(attempts: AttemptRecord[], windowDays = RECENT_WINDOW_DAYS): number {
  if (attempts.length === 0) return 0
  // 以本地日界切界：窗口起點為「今日零時」往前推 windowDays - 1 日，
  // 使「今日」本身計入窗口之內。
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (windowDays - 1))
  const from = start.getTime()
  const days = new Set<string>()
  for (const a of attempts) {
    if (typeof a?.timestamp !== 'number' || a.timestamp < from) continue
    days.add(dayKey(a.timestamp))
  }
  return days.size
}

export function computeStats(attempts: AttemptRecord[]): ProgressStats {
  const totalAttempts = attempts.length
  const totalQuestions = attempts.reduce((s, a) => s + a.total, 0)
  const totalCorrect = attempts.reduce((s, a) => s + a.score, 0)

  const subjMap = new Map<string, SubjectStat>()
  const topicMap = new Map<string, TopicStat>()

  for (const a of attempts) {
    let s = subjMap.get(a.subjectId)
    if (!s) {
      s = {
        subjectId: a.subjectId,
        subjectName: a.subjectName,
        attempts: 0,
        questions: 0,
        correct: 0,
        accuracy: 0,
        bestGrade: '', // 「未有成績」——唔可以用 'U'，見 betterGrade 註釋
      }
      subjMap.set(a.subjectId, s)
    }
    s.attempts++
    s.questions += a.total
    s.correct += a.score
    s.bestGrade = betterGrade(s.bestGrade, a.grade)

    for (const t of a.topicResults) {
      let tt = topicMap.get(t.topic)
      if (!tt) {
        tt = { topic: t.topic, correct: 0, total: 0, accuracy: 0 }
        topicMap.set(t.topic, tt)
      }
      tt.correct += t.correct
      tt.total += t.total
    }
  }

  const subjects = [...subjMap.values()].map((s) => ({
    ...s,
    accuracy: s.questions > 0 ? s.correct / s.questions : 0,
    // 每份 attempt 都帶 grade，所以正常情況下空字串唔會流出去；
    // 萬一數據殘缺就退回 'U'，維持 SubjectStat.bestGrade 一定係非空字串。
    bestGrade: s.bestGrade || 'U',
  }))
  subjects.sort((a, b) => b.questions - a.questions)

  const weakTopics = [...topicMap.values()]
    .map((t) => ({ ...t, accuracy: t.total > 0 ? t.correct / t.total : 0 }))
    .filter((t) => t.total >= 2 && t.accuracy < 0.8)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  const recent = [...attempts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)
  const activeDays = new Set(attempts.map((a) => dayKey(a.timestamp))).size

  return {
    totalAttempts,
    totalQuestions,
    totalCorrect,
    overallAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
    recentActiveDays: computeRecentActiveDays(attempts),
    activeDays,
    subjects,
    weakTopics,
    recent,
  }
}
