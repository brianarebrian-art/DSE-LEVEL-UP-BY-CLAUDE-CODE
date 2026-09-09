import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { SESSION_SIZE } from '@/lib/entitlements'

// ============================================================================
// Admin 用戶概覽 —— 平台真實使用量指標
// ----------------------------------------------------------------------------
// ⚠️ 2026-09-07 重寫。上一版將「答題數／每日新增／每週活躍／留存」四項全部
// 列為【計唔到】，四項全部錯。原因：上一版只看 `user_progress` 的欄位
// （`last_active_at`、`total_questions_done`），從未打開 `progress_data` JSON。
//
// 真實情況：`progress_data->dse_progress` 是一個 `AttemptRecord[]`
// （見 lib/progress.ts），每一節練習一筆，欄位包括
// `timestamp`（epoch ms）、`total`、`score`、`elapsed`（秒）、`subjectId`、
// `topicResults[]`、`difficultyResults`。呢個陣列【一直有上雲】
// （`lib/sync.ts` 白名單第一項），所以以下全部計得到：
//
//     每日／每週活躍   ← timestamp 逐節
//     答題數           ← total 逐節相加
//     使用時長         ← elapsed 逐節相加
//     正確率、難度分層 ← score / difficultyResults
//     留存             ← 同一 user 是否在第二個日曆日再出現
//
// `total_questions_done` 欄位確實全部係 0（從未被寫入），但佢唔係唯一來源。
//
// ── 邊界（憲章 §16.E）────────────────────────────────────────────────────
// 本 route 只輸出【全站聚合】：人頭、節數、題數、時長、正確率。
//   · 唔返回任何 user_id，唔返回任何逐人一行的資料（約束 1）
//   · 唔做跨用戶比較、排名、百分位、班級平均（約束 3）
//   · 唔掂 `dse_topic_stats`（逐課題正確率，屬用戶本人專屬層）
//   · 唔掂 `dse_active_session`（答案原文）
// 聚合數字用途係量度平台自己，唔會、亦唔准提供畀任何第三方（約束 2）。
//
// ── 「即時睇住學生做緊邊條題」點解唔喺呢度（2026-09-07）────────────────
// 要做到逐個學生、逐條題、即時見到答啱定答錯，需要 `dse_active_session`
// （入面有 questionIds、answers[].selectedZh、answers[].isCorrect、current）。
// 三條條文各自獨立擋住：
//   · §16.E 約束 5 —— 答案原文禁止上雲，2026-09-04 修訂明文【不】涵蓋此項
//   · §16.E 約束 1 —— 任何情況下不得返回他人數據
//   · §8         —— 老師平台已否決，`question_events` 已於 0003 刪除；
//                    逐生逐題即時面板就係嗰塊板，只係換咗觀看者
// 所以本 route 的「即時」係【聚合人頭】：近 N 分鐘有幾多個帳號同步過。
// 呢個訊號係真嘅 —— 練習期間每答一題會經 SyncProvider（2.5 秒 debounce）
// 推一次，所以 `updated_at` 會喺一節之內持續跳動，唔係只喺交卷先動。
// 但佢係【聚合】：唔會、亦唔准展開成逐個人一行。
//
// 「邊條題目答錯」的可行版本係 `weakTopics` —— 全站逐課題錯誤量，
// 唔綁任何 user_id。呢個量度的對象係【題庫】，唔係學生，所以唔構成
// §16.E 約束 3 所禁的跨用戶比較（排行榜／班級平均／同儕對比／百分位）。
// ⚠️ 唔准將 weakTopics 加返 user_id 維度 —— 加咗就係約束 3 嗰四樣嘢。
//
// ── 覆蓋範圍的硬限制 ────────────────────────────────────────────────────
// 只覆蓋【已登入】用戶。全站唔需要登入都做得題，未登入者的練習只留在
// localStorage，永遠唔會出現喺呢度。所以以下所有數字都係【下限】，
// 唔係全站真實使用量。
// ============================================================================
export const dynamic = 'force-dynamic'

/** 一節練習。與 lib/progress.ts 的 AttemptRecord 對應（只取本 route 用到的欄位）。 */
interface Attempt {
  timestamp?: number
  total?: number
  score?: number
  elapsed?: number
  subjectId?: string
  topicResults?: { topic?: string; correct?: number; total?: number }[]
  difficultyResults?: Record<string, { correct?: number; total?: number }>
}

export interface UserStats {
  /** 有雲端進度列的帳號數（＝曾經登入並同步過的人）。 */
  accounts: number
  /** 其中曾經做過至少一節練習的人。 */
  everPractised: number
  /** 做過 ≥2 節。 */
  sessions2Plus: number
  /** 在第二個日曆日再回來過的人 —— 呢個先係留存。 */
  returnedAnotherDay: number
  practised7d: number
  practised30d: number
  sessions30d: number
  totalSessions: number
  totalQuestions: number
  totalCorrect: number
  accuracyPct: number | null
  totalHours: number
  medianSessionSeconds: number | null
  medianQuestionsPerSession: number | null
  /** 冇做夠一整節（見 FULL_SET_SIZES）。 */
  partialSessions: number
  /** 每日活躍（近 60 日，香港時間）。 */
  daily: { day: string; users: number; sessions: number; questions: number }[]
  bySubject: { subject: string; sessions: number; users: number; questions: number; accuracyPct: number | null }[]
  /** 逐難度層命中率。樣本細，見 difficultySample。 */
  byDifficulty: { tier: string; answered: number; correct: number; accuracyPct: number | null }[]
  difficultySample: number
  /** 即時：近 N 分鐘有同步過的帳號數（聚合，無身份）。 */
  live: { min2: number; min15: number; min60: number; newestSyncAgoSec: number | null }
  /** 今日／本週／本月（香港時間）。 */
  buckets: { key: 'today' | 'week' | 'month'; users: number; sessions: number; questions: number; correct: number; accuracyPct: number | null }[]
  /** 錯得最多的課題（全站聚合，無任何用戶身份）。 */
  weakTopics: { subject: string; topic: string; answered: number; wrong: number; wrongPct: number }[]
  /** 明顯壞資料，已從所有統計中剔除。 */
  discardedRecords: number
  notComputable: { metric: string; reason: string }[]
}

const HK = 'en-CA' // YYYY-MM-DD
const dayKey = (ms: number) =>
  new Date(ms).toLocaleDateString(HK, { timeZone: 'Asia/Hong_Kong' })

const median = (xs: number[]): number | null => {
  if (!xs.length) return null
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}

const pct = (n: number, d: number): number | null =>
  d > 0 ? Math.round((n / d) * 1000) / 10 : null

// 「做完一整節」有幾多題 —— 唔可以寫死一個數字。
//   20  2026-09-09 之前嘅 SESSION_SIZE（歷史紀錄大部分係呢個）
//   10  2026-09-09 起嘅 SESSION_SIZE
//    1  「只做 1 題」入口（components/JustOneCard.tsx）—— 佢做完一題就係完整
// `dse_progress` 冇存低「嗰陣打算出幾多題」，所以只能夠對返呢張已知清單。
// 寫死 `total < 20` 會令改版之後每一節都被當成「中途走咗」。
const FULL_SET_SIZES = new Set([1, SESSION_SIZE, 20])

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('user_progress')
      .select('user_id, progress_data, updated_at')
    if (error) throw error

    const rows = (data ?? []) as { user_id: string; progress_data: unknown; updated_at: string | null }[]
    const now = Date.now()
    const DAY = 86_400_000

    let discarded = 0
    let totalQ = 0
    let totalCorrect = 0
    let totalElapsed = 0
    const elapsedAll: number[] = []
    const qPerSession: number[] = []
    let partial = 0
    let sessions = 0
    let sessions30d = 0

    const practisers = new Set<string>()
    const active7d = new Set<string>()
    const active30d = new Set<string>()
    const sessionCount = new Map<string, number>()
    const daysSeen = new Map<string, Set<string>>()
    const daily = new Map<string, { users: Set<string>; sessions: number; questions: number }>()
    const bySubject = new Map<string, { sessions: number; users: Set<string>; q: number; c: number }>()
    const byTier = new Map<string, { answered: number; correct: number }>()
    let difficultySample = 0

    // 香港日界。HK 全年無夏令時間，所以字串比較即等同時區比較。
    const todayKey = dayKey(now)
    const midnight = new Date(`${todayKey}T00:00:00Z`)
    const dow = (midnight.getUTCDay() + 6) % 7 // 週一 = 0
    const weekStart = new Date(midnight.getTime() - dow * DAY).toISOString().slice(0, 10)
    const monthPrefix = todayKey.slice(0, 7)

    type Bucket = { users: Set<string>; sessions: number; questions: number; correct: number }
    const mk = (): Bucket => ({ users: new Set(), sessions: 0, questions: 0, correct: 0 })
    const bucket: Record<'today' | 'week' | 'month', Bucket> = {
      today: mk(),
      week: mk(),
      month: mk(),
    }
    const topics = new Map<string, { subject: string; topic: string; answered: number; wrong: number }>()

    for (const row of rows) {
      const pd = row.progress_data as Record<string, unknown> | null
      const list = pd && Array.isArray(pd.dse_progress) ? (pd.dse_progress as Attempt[]) : []
      for (const a of list) {
        const ts = typeof a?.timestamp === 'number' ? a.timestamp : null
        const total = typeof a?.total === 'number' ? a.total : null
        const score = typeof a?.score === 'number' ? a.score : null
        // 壞資料：分數大過題數（實測有一筆 score 10000 / total 100）。
        if (ts === null || total === null || score === null || score > total || total <= 0) {
          discarded++
          continue
        }
        sessions++
        totalQ += total
        totalCorrect += score
        qPerSession.push(total)
        if (!FULL_SET_SIZES.has(total)) partial++
        if (typeof a.elapsed === 'number' && a.elapsed > 0) {
          totalElapsed += a.elapsed
          elapsedAll.push(a.elapsed)
        }

        practisers.add(row.user_id)
        sessionCount.set(row.user_id, (sessionCount.get(row.user_id) ?? 0) + 1)
        const d = dayKey(ts)
        if (!daysSeen.has(row.user_id)) daysSeen.set(row.user_id, new Set())
        daysSeen.get(row.user_id)!.add(d)

        const age = now - ts
        if (age <= 7 * DAY) active7d.add(row.user_id)
        if (age <= 30 * DAY) {
          active30d.add(row.user_id)
          sessions30d++
        }
        if (age <= 60 * DAY) {
          if (!daily.has(d)) daily.set(d, { users: new Set(), sessions: 0, questions: 0 })
          const b = daily.get(d)!
          b.users.add(row.user_id)
          b.sessions++
          b.questions += total
        }

        // 今日／本週／本月（香港日界）
        const hit = (b: Bucket) => {
          b.users.add(row.user_id)
          b.sessions++
          b.questions += total
          b.correct += score
        }
        if (d === todayKey) hit(bucket.today)
        if (d >= weekStart) hit(bucket.week)
        if (d.startsWith(monthPrefix)) hit(bucket.month)

        // 逐課題錯誤量（全站聚合，唔記 user_id —— 見檔頭邊界說明）
        if (Array.isArray(a.topicResults)) {
          for (const tr of a.topicResults) {
            if (!tr || typeof tr.total !== 'number' || typeof tr.correct !== 'number') continue
            if (tr.total <= 0 || tr.correct > tr.total) continue
            const name = typeof tr.topic === 'string' ? tr.topic : 'unknown'
            const sid = typeof a.subjectId === 'string' ? a.subjectId : 'unknown'
            const k = `${sid}::${name}`
            if (!topics.has(k)) topics.set(k, { subject: sid, topic: name, answered: 0, wrong: 0 })
            const t = topics.get(k)!
            t.answered += tr.total
            t.wrong += tr.total - tr.correct
          }
        }

        const sub = typeof a.subjectId === 'string' ? a.subjectId : 'unknown'
        if (!bySubject.has(sub)) bySubject.set(sub, { sessions: 0, users: new Set(), q: 0, c: 0 })
        const sb = bySubject.get(sub)!
        sb.sessions++
        sb.users.add(row.user_id)
        sb.q += total
        sb.c += score

        if (a.difficultyResults && typeof a.difficultyResults === 'object') {
          difficultySample++
          for (const tier of ['easy', 'medium', 'hard'] as const) {
            const r = a.difficultyResults[tier]
            if (!r || typeof r.total !== 'number' || typeof r.correct !== 'number') continue
            if (!byTier.has(tier)) byTier.set(tier, { answered: 0, correct: 0 })
            const t = byTier.get(tier)!
            t.answered += r.total
            t.correct += r.correct
          }
        }
      }
    }

    const body: UserStats = {
      accounts: rows.length,
      everPractised: practisers.size,
      sessions2Plus: [...sessionCount.values()].filter((n) => n >= 2).length,
      returnedAnotherDay: [...daysSeen.values()].filter((s) => s.size >= 2).length,
      practised7d: active7d.size,
      practised30d: active30d.size,
      sessions30d,
      totalSessions: sessions,
      totalQuestions: totalQ,
      totalCorrect,
      accuracyPct: pct(totalCorrect, totalQ),
      totalHours: Math.round((totalElapsed / 3600) * 10) / 10,
      medianSessionSeconds: median(elapsedAll),
      medianQuestionsPerSession: median(qPerSession),
      partialSessions: partial,
      daily: [...daily.entries()]
        .map(([day, b]) => ({ day, users: b.users.size, sessions: b.sessions, questions: b.questions }))
        .sort((a, b) => a.day.localeCompare(b.day)),
      bySubject: [...bySubject.entries()]
        .map(([subject, s]) => ({
          subject,
          sessions: s.sessions,
          users: s.users.size,
          questions: s.q,
          accuracyPct: pct(s.c, s.q),
        }))
        .sort((a, b) => b.sessions - a.sessions),
      byDifficulty: (['easy', 'medium', 'hard'] as const).map((tier) => {
        const t = byTier.get(tier) ?? { answered: 0, correct: 0 }
        return { tier, answered: t.answered, correct: t.correct, accuracyPct: pct(t.correct, t.answered) }
      }),
      difficultySample,
      live: (() => {
        const ages = rows
          .map((r) => (r.updated_at ? now - Date.parse(r.updated_at) : NaN))
          .filter((n) => Number.isFinite(n) && n >= 0)
        const within = (ms: number) => ages.filter((a) => a <= ms).length
        return {
          min2: within(2 * 60_000),
          min15: within(15 * 60_000),
          min60: within(60 * 60_000),
          newestSyncAgoSec: ages.length ? Math.round(Math.min(...ages) / 1000) : null,
        }
      })(),
      buckets: (['today', 'week', 'month'] as const).map((key) => {
        const b = bucket[key]
        return {
          key,
          users: b.users.size,
          sessions: b.sessions,
          questions: b.questions,
          correct: b.correct,
          accuracyPct: pct(b.correct, b.questions),
        }
      }),
      weakTopics: [...topics.values()]
        .filter((t) => t.answered >= 20) // 樣本太細唔上榜，否則一條題就霸榜
        .map((t) => ({ ...t, wrongPct: Math.round((t.wrong / t.answered) * 1000) / 10 }))
        .sort((a, b) => b.wrong - a.wrong)
        .slice(0, 15),
      discardedRecords: discarded,
      notComputable: [
        {
          metric: '未登入用戶',
          reason: '全站唔使登入都做得題，未登入者的練習只留在 localStorage。以上所有數字都係下限。',
        },
        {
          metric: '註冊日期',
          reason: 'Auth.js 用 JWT strategy，唔寫用戶表。最早只知「第一次做練習」嗰日，唔知第一次登入嗰日。',
        },
        {
          metric: '停留總時長',
          reason: 'elapsed 只計練習節內時間。睇解析、行其他頁面、開咗個 tab 唔郁 —— 全部冇量度。',
        },
        {
          metric: '逐個學生做緊邊條題',
          reason:
            '要 dse_active_session（答案原文），憲章 §16.E 約束 5 禁止上雲、約束 1 禁止返回他人數據、§8 老師平台已否決。可行版本係下面嘅逐課題錯誤量（唔綁身份）。',
        },
        {
          metric: '流失原因',
          reason: `一節少於 ${SESSION_SIZE} 題只知「冇做完」，唔知係太難、悶、閃走、定係手機出事。要問人，唔係查表。`,
        },
      ],
    }
    return NextResponse.json(body)
  } catch (e) {
    safeLog('error', 'admin users stats failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
