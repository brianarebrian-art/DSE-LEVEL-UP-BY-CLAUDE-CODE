import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getServiceSupabase } from '@/utils/supabase/server'
import { vapidFromEnv } from '@/lib/push/vapid'
import { generateMgmtToken, hashMgmtToken, verifyMgmtToken } from '@/lib/push/mgmtToken'
import { safeLog } from '@/lib/safeLog'

// 考試日推送訂閱／退訂。
//
// ══ 呢度【唔】收乜 ══
// 唔收 user id、唔收考試日期、唔收試場、唔收科目。
// 只收瀏覽器發嘅推送端點 ＋ 管理權杖（SEC-R1-001）。
// 詳細理由見 supabase/migrations/0012_push_subscriptions.sql 檔頭。
//
// SEC-R1-001 / FIX-DSE-APP-001: DELETE／rotate 必須出示 management token。
// Plaintext token 只喺 POST 成功時回一次；伺服器只存 SHA-256 hash。
// 表 schema 草稿：supabase/migrations/0026_push_mgmt_token.DRAFT.sql（未套用 production）。

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

  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.status === 413 ? 'body too large' : 'bad-json' }, { status: read.status })
  const body = (read.value ?? {}) as Record<string, unknown>

  const endpoint = body.endpoint
  const p256dh = str(body.p256dh, 256)
  const auth = str(body.auth, 256)
  // Rotation requires the current management token when a hash already exists.
  // First subscribe (no row / null hash during migration) may omit it.
  const priorToken = str(body.managementToken, 128)

  if (!validEndpoint(endpoint) || !p256dh || !auth) {
    return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()

    const { data: existing, error: lookupErr } = await supabase
      .from('push_subscriptions')
      .select('token_hash')
      .eq('endpoint', endpoint)
      .maybeSingle()
    if (lookupErr) throw lookupErr

    if (existing?.token_hash) {
      if (!priorToken || !verifyMgmtToken(priorToken, existing.token_hash)) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }
    }

    const managementToken = generateMgmtToken()
    const token_hash = hashMgmtToken(managementToken)
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        endpoint,
        p256dh,
        auth,
        fail_count: 0,
        token_hash,
        token_rotated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' },
    )
    if (error) throw error
    // Plaintext returned once — client must persist (IndexedDB). Never log it.
    return NextResponse.json({ ok: true, managementToken })
  } catch (e) {
    // safeLog：唔可以把端點原文寫落 log —— 佢係一個裝置識別碼。
    safeLog('error', 'push/subscribe', e)
    return NextResponse.json({ error: 'store-failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.status === 413 ? 'body too large' : 'bad-json' }, { status: read.status })
  const body = (read.value ?? {}) as Record<string, unknown>
  const endpoint = body.endpoint
  const managementToken = str(body.managementToken, 128)
  if (!validEndpoint(endpoint)) {
    return NextResponse.json({ error: 'bad-subscription' }, { status: 400 })
  }
  if (!managementToken) {
    return NextResponse.json({ error: 'token-required' }, { status: 401 })
  }
  try {
    const supabase = getServiceSupabase()
    const { data: row, error: lookupErr } = await supabase
      .from('push_subscriptions')
      .select('token_hash')
      .eq('endpoint', endpoint)
      .maybeSingle()
    if (lookupErr) throw lookupErr
    if (!row?.token_hash || !verifyMgmtToken(managementToken, row.token_hash)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    // 退訂唔可以失敗得靜 —— 一個關唔到嘅通知比冇通知煩好多。
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    safeLog('error', 'push/unsubscribe', e)
    return NextResponse.json({ error: 'delete-failed' }, { status: 500 })
  }
}
