import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/adminAllowlist'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// ============================================================================
// Admin 用戶概覽 —— 平台第一個真實使用量指標
// ----------------------------------------------------------------------------
// 2026-09-06 之前，全站【冇任何使用量 measurement】：Vercel Web Analytics 未開，
// runtime logs 受 Hobby plan retention 封頂。呢個 route 係第一次答到
// 「究竟有冇人用」。
//
// ⚠️ 主表【唔係 `profiles`】—— 呢點同原規格相反，實測數字如下：
//
//     profiles       6 個 user_id，最後一個 created_at 停喺 2026-07-13
//     user_progress  169 個 user_id，最後活躍 2026-09-06（即日）
//     user_settings  147 個 user_id
//     兩者交集       只有 6 個
//
// 即係話行 `profiles` 會報 6，而實際有 169 個帳號同步過進度 —— 差 28 倍。
// 原因：`profiles` 淨係喺某啲路徑寫入，而進度同步係獨立寫 `user_progress`。
//
// ── 呢度【唔計】三樣嘢，因為數據唔支持，唔係因為未做 ──────────────────────
//
// ① 每日新增：`user_progress` 冇 `created_at`，只有 `last_active_at`。
//    `profiles.created_at` 得 6 行，代表唔到 169 個用戶。
// ② 每週活躍（歷史）：一個 user 一行，只存【最後】活躍時間。一個七月同八月
//    都活躍過嘅人，只會出現喺八月。按週 group 出嚟嘅係「最後見到」分佈
//    （churn 曲線），唔係 weekly active users。兩者好易撈亂，所以呢度
//    照實叫佢做「最後活躍分佈」。
// ③ Cohort 留存：要「註冊日 × 活躍日」兩個時間，而第一個只覆蓋 6 個用戶。
//
// 原規格嗰三條 SQL 全部行 `question_events` —— 嗰張表已經喺
// `0003_drop_teacher_platform.sql` 刪咗（老師平台，憲章 §8 永久否決）。
//
// ── 私隱 ────────────────────────────────────────────────────────────────
// 原規格要求郵箱脫敏。實測 `profiles` 【根本冇 email 欄位】
//（只有 user_id / role / display_name / created_at）—— 冇嘢需要脫敏，
// 因為平台一開始就冇存學生郵箱。
//
// 本 route 亦【刻意唔返 `progress_data`】：嗰個 JSON 入面係
// `dse_topic_stats`（逐課題正確率）。憲章 §16.E 約束 1 明文「只限用戶本人
// 查閱」—— admin 唔係本人。所以呢度只數人頭同時間，唔掂內容。
// ============================================================================
export const dynamic = 'force-dynamic'

export interface UserStats {
  syncedUsers: number
  settingsUsers: number
  profileRows: number
  activeLast7d: number
  activeLast30d: number
  /** 最後活躍分佈（近 12 週）。唔係 weekly active —— 見檔頭②。 */
  lastSeenByWeek: { week: string; users: number }[]
  /** 數據唔支持嘅指標，逐項講明原因，唔留白畀人估。 */
  notComputable: { metric: string; reason: string }[]
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const supabase = getServiceSupabase()

    const [progress, settings, profiles] = await Promise.all([
      supabase.from('user_progress').select('user_id, last_active_at'),
      supabase.from('user_settings').select('user_id'),
      supabase.from('profiles').select('user_id'),
    ])
    for (const r of [progress, settings, profiles]) if (r.error) throw r.error

    const rows = (progress.data ?? []) as { user_id: string; last_active_at: string | null }[]
    const now = Date.now()
    const DAY = 86_400_000
    const seen = (d: number) =>
      rows.filter((r) => r.last_active_at && now - Date.parse(r.last_active_at) <= d * DAY).length

    // 週一為週首，同 SQL date_trunc('week') 一致。
    const weekKey = (ts: number) => {
      const d = new Date(ts)
      const dow = (d.getUTCDay() + 6) % 7
      const mon = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow))
      return mon.toISOString().slice(0, 10)
    }
    const buckets = new Map<string, Set<string>>()
    for (const r of rows) {
      if (!r.last_active_at) continue
      const t = Date.parse(r.last_active_at)
      if (now - t > 12 * 7 * DAY) continue
      const k = weekKey(t)
      if (!buckets.has(k)) buckets.set(k, new Set())
      buckets.get(k)!.add(r.user_id)
    }

    const body: UserStats = {
      syncedUsers: new Set(rows.map((r) => r.user_id)).size,
      settingsUsers: new Set((settings.data ?? []).map((r) => (r as { user_id: string }).user_id)).size,
      profileRows: (profiles.data ?? []).length,
      activeLast7d: seen(7),
      activeLast30d: seen(30),
      lastSeenByWeek: [...buckets.entries()]
        .map(([week, s]) => ({ week, users: s.size }))
        .sort((a, b) => a.week.localeCompare(b.week)),
      notComputable: [
        { metric: '每日新增', reason: 'user_progress 冇 created_at；profiles.created_at 只覆蓋 6 個用戶' },
        { metric: '每週活躍（歷史）', reason: '一個用戶一行，只存最後活躍時間 —— 得出嘅係最後見到分佈，唔係 WAU' },
        { metric: 'Cohort 留存', reason: '要註冊日 × 活躍日，而註冊日只覆蓋 6 個用戶' },
        { metric: '答題數', reason: 'user_progress.total_questions_done 全部 169 行都係 0，欄位從未被寫入' },
      ],
    }
    return NextResponse.json(body)
  } catch (e) {
    safeLog('error', 'admin users stats failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
