import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// ════════════════════════════════════════════════════════════════════════════
// 「今日開過 app」—— 每個用戶每日最多一行。
//
// 存在嘅唯一原因：量度【開咗 app 但一題都冇做】嗰批人。
// 佢哋喺 user_progress 入面冇任何一節，所以由練習紀錄推唔到 ——
// 呢個就係 2026-09-11 目標書所講嘅「未做題即流失」黑洞。
//
// ══ 本端點刻意收唔到任何客戶端資料 ══
// 冇 request body、冇 query、冇 header 會被讀取。
//   user_id → 由 server session 解出（getSyncUserId）
//   day     → 由 server 時鐘決定
// 即係話客戶端【冇任何一個欄位注入得到】。呢個唔係巧合，係設計：
// 一個收客戶端資料嘅採集端點，就要處理偽造、灌數、同注入；一個乜都唔收嘅，
// 唔使處理。
//
// ══ 唔記錄嘅嘢（逐項都係刻意）══
//   ✗ IP、user agent、裝置指紋 —— 唔需要，而且係識別資料
//   ✗ 頁面路徑、停留時間      —— 唔需要，而且會變成行為追蹤
//   ✗ 逐次到訪               —— 一日一行就夠答「嗰日有冇開過」
//   ✗ question_id 或任何答題資料 —— 憲章 §16.E 約束 7，question_events 維持刪除
//   ✗ 未登入訪客              —— 對 12–18 歲未成年人新增採集，要另行裁決
// ════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic'

const TABLE = 'user_sessions'

/** server 時鐘嘅 UTC 日界。同 scripts/analytics/retention.mts 嘅 dayKey 一致。 */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function POST() {
  const userId = await getSyncUserId()
  // 未登入＝唔記錄。回 204 而唔係 401 —— 呢個端點對客戶端嚟講係「盡力而為」，
  // 未登入唔係錯誤，而一個 401 會喺 console 嗌，令學生見到紅色。
  if (!userId) return new NextResponse(null, { status: 204 })

  try {
    const supabase = getServiceSupabase()
    // upsert：同一日重複呼叫唔會加行，亦唔會改 first_seen（ignoreDuplicates）。
    // 所以就算學生一日開十次 app，都只會有一行，而且時間係當日第一次。
    const { error } = await supabase
      .from(TABLE)
      .upsert({ user_id: userId, day: todayUtc() }, { onConflict: 'user_id,day', ignoreDuplicates: true })
    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    // 記錄失敗【唔可以】影響學生做題。呢個係分析用途，唔係功能。
    safeLog('error', 'api/sync/session POST', e)
    return new NextResponse(null, { status: 204 })
  }
}
