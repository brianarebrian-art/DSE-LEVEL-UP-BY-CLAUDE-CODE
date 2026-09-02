import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { vapidFromEnv } from '@/lib/push/vapid'
import { safeLog } from '@/lib/safeLog'

// 考試日推送訂閱／退訂。
//
// ══ 呢度【唔】收乜 ══
// 唔收 user id、唔收考試日期、唔收試場、唔收科目。
// 只收瀏覽器發嘅推送端點。連「幾點想收」都唔收 —— 見下面。
// 詳細理由見 supabase/migrations/0012_push_subscriptions.sql 檔頭。
//
// 冇登入都用得 —— 推送同帳戶完全無關（本站 100% 免費，登入淨係
// 為咗跨機同步進度）。

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 推送端點只可以係 https。收一條 http 或者其他 scheme 就係有人玩嘢。 */
function validEndpoint(u: unknown): u is string {
  if (typeof u !== 'string' || u.length > 1024) return false
  try {
    return new URL(u).protocol === 'https:'
  } catch {
    return false
  }
}

const str = (v: unknown, max: number) =>
  typeof v === 'string' && v.length > 0 && v.length <= max ? v : null

export async function POST(req: Request) {
  // 冇設 VAPID 金鑰 = 成個功能未開。回 503 而唔係 500 ——
  // 呢個係「而家冇呢個服務」，唔係「壞咗」。
  if (!vapidFromEnv()) {
    return NextResponse.json({ error: 'push-not-configured' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'bad-json' }, { status: 400 })
  }

  const endpoint = body.endpoint
  const p256dh = str(body.p256dh, 256)
  const auth = str(body.auth, 256)
  if (!validEndpoint(endpoint) || !p256dh || !auth) {
    return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        { endpoint, p256dh, auth, fail_count: 0 },
        { onConflict: 'endpoint' },
      )
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    // safeLog：唔可以把端點原文寫落 log —— 佢係一個裝置識別碼。
    safeLog('error', 'push/subscribe', e)
    return NextResponse.json({ error: 'store-failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'bad-json' }, { status: 400 })
  }
  const endpoint = body.endpoint
  if (!validEndpoint(endpoint)) {
    return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })
  }
  try {
    const supabase = getServiceSupabase()
    // 退訂唔可以失敗得靜 —— 一個關唔到嘅通知比冇通知煩好多。
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'push/unsubscribe', e)
    return NextResponse.json({ error: 'delete-failed' }, { status: 500 })
  }
}
