import { NextResponse } from 'next/server'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { POLICY_VERSION } from '@/lib/privacy/consent'

// 私隱政策同意 —— 讀 ＋ 寫。
//
// GET  → { consented: boolean, version: string | null }
//        只讀 append-only history。舊版紀錄保留原版本與時間，不會被改寫。
//
// POST → append 一個版本限定嘅同意事件。冇 body：由 server 決定（POLICY_VERSION），
//        唔接受 client 話畀我聽佢同意咗邊版 —— 否則改個 request 就可以
//        扮成同意咗一個佢冇睇過嘅版本。
//        重覆提交同一版本係 no-op；絕不 upsert 覆蓋舊 consent version/time。
//
// ⚠️ 冇 DELETE。撤回同意唔係刪走呢一行 —— 刪走等於「佢從來冇被問過」，
//    而事實係佢被問過而且拒絕過。撤回改為由 /account 走既有嘅完整抹除流程
//    （lib/privacy/userData.ts），嗰度會連同進度一齊清，語意先至誠實。
//
// ⚠️ 用 getSyncUserId()（唔係 session.user.id）—— 同 /api/progress 同一個 key，
//    Better Auth flip 之後都對得返同一個人。用錯 key = 同意紀錄同進度紀錄
//    掛喺兩個唔同 id 上面，而且【冇聲】。

export const dynamic = 'force-dynamic'

const TABLE = 'privacy_consent_history'

export async function GET() {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .select('policy_version')
      .eq('user_id', userId)
      .eq('policy_version', POLICY_VERSION)
      .maybeSingle()
    if (error) throw error

    const version = (data as { policy_version?: string } | null)?.policy_version ?? null
    return NextResponse.json({ consented: version === POLICY_VERSION, version })
  } catch (e) {
    // 查唔到就當【未同意】—— 唔可以 fail-open。fail-open 嘅話，資料庫一撻著
    // 就變成全部人靜靜哋當簽咗。寧可多問一次，唔可以當人同意過。
    safeLog('error', 'api/privacy/consent GET', e)
    return NextResponse.json({ consented: false, version: null, degraded: true })
  }
}

export async function POST() {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const supabase = getServiceSupabase()
    const now = new Date().toISOString()
    const { error } = await supabase.from(TABLE).upsert(
      {
        user_id: userId,
        policy_version: POLICY_VERSION,
        scope_version: POLICY_VERSION,
        decision: 'granted',
        consented_at: now,
        source: 'new_acceptance',
      },
      { onConflict: 'user_id,policy_version', ignoreDuplicates: true },
    )
    if (error) throw error
    return NextResponse.json({ ok: true, version: POLICY_VERSION })
  } catch (e) {
    safeLog('error', 'api/privacy/consent POST', e)
    // 寫唔入就【唔可以扮成功】。前端見到唔 ok 就唔會開同步，下次再問過。
    // 一個寫唔入嘅同意等於冇同意 —— 呢點同 /account 抹除嗰邊嘅做法一致。
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
