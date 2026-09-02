import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { sendEmptyPush, vapidFromEnv } from '@/lib/push/vapid'
import { safeLog } from '@/lib/safeLog'

// 考試日推送 —— 由 Vercel Cron 叫（vercel.json）。
//
// ══ 呢條路線做嘅嘢少得驚人 ══
// 佢send一個【冇內容】嘅推送俾每一個訂閱，就係咁。
// 冇判斷邊個今日考試，冇挑人，冇內容 —— 因為佢冇呢啲資料，
// 亦刻意唔會有（見 supabase/migrations/0012_push_subscriptions.sql）。
//
// 「今日關唔關我事」同「出乜文字」兩件事都喺學生部機上面由
// service worker 決定（public/sw.js）。唔關事就靜靜哋唔出通知，
// 伺服器永遠唔知發生過乜。
//
// ══ 做唔到嘅嘢，唔好扮做到 ══
// 報告 §6.3 寫住「天氣突變即時推送」。呢個喺 Vercel Hobby 上面
// 做唔到 —— cron 每個一日淨係行得一次。所以我哋只做兩個定時
// 時段（22:00 準備、06:30 出門），而 UI 亦只可以咁講。
// 一個寫得出但兌現唔到嘅承諾，喺考試朝早會令學生等一個唔會嚟嘅通知。

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
/** 一次過最多send幾多個。夠用之餘，唔會撞正 serverless 執行時間上限。 */
const BATCH = 500
/** 連續失敗夠呢個數就清走 —— 唔清就會日日打去一個死咗嘅端點。 */
const MAX_FAILS = 5

export async function GET(req: Request) {
  // Vercel Cron 會帶 `Authorization: Bearer $CRON_SECRET`。
  // 冇設 CRON_SECRET 就【唔准行】—— 一條任何人 curl 得到嘅推送路線，
  // 等於一個免費嘅滋擾工具。
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'cron-not-configured' }, { status: 503 })
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const vapid = vapidFromEnv()
  if (!vapid) return NextResponse.json({ error: 'push-not-configured' }, { status: 503 })

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, fail_count')
    .limit(BATCH)
  if (error) {
    safeLog('error', 'cron/exam-day-nudge:select', error)
    return NextResponse.json({ error: 'select-failed' }, { status: 500 })
  }

  const rows = (data ?? []) as { endpoint: string; fail_count: number }[]
  const dead: string[] = []
  let sent = 0
  let failed = 0

  // 逐個send。一個失敗唔可以拖冧其餘 —— 呢個係一次過嘅每日 job，
  // 中途掉錯就等於嗰日淨低嗰批人冇通知。
  const results = await Promise.allSettled(
    rows.map((r) => sendEmptyPush(r.endpoint, vapid.keys, vapid.subject)),
  )

  for (let i = 0; i < rows.length; i++) {
    const res = results[i]
    if (res.status === 'fulfilled' && res.value.ok) { sent++; continue }
    if (res.status === 'fulfilled' && res.value.gone) { dead.push(rows[i].endpoint); continue }
    failed++
    if (rows[i].fail_count + 1 >= MAX_FAILS) dead.push(rows[i].endpoint)
  }

  try {
    if (dead.length) {
      await supabase.from('push_subscriptions').delete().in('endpoint', dead)
    }
    if (sent) {
      const ok = rows
        .filter((r, i) => results[i].status === 'fulfilled' && (results[i] as PromiseFulfilledResult<{ ok: boolean }>).value.ok)
        .map((r) => r.endpoint)
      await supabase
        .from('push_subscriptions')
        .update({ last_ok_at: new Date().toISOString(), fail_count: 0 })
        .in('endpoint', ok)
    }
  } catch (e) {
    // 記數失敗唔應該令成個 job 報錯 —— 推送本身已經send咗。
    safeLog('warn', 'cron/exam-day-nudge:bookkeeping', e)
  }

  // 只回數字，唔回端點 —— 端點係裝置識別碼，唔應該出現喺任何回應度。
  return NextResponse.json({ total: rows.length, sent, failed, removed: dead.length })
}
