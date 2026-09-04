import type Stripe from 'stripe'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { parsePlusSku, computeExpiry } from './skus'

// 入賬 —— webhook 同 /thank-you 輪詢補救【共用同一段】。
//
// ══ 點解一定要共用 ══
// 兩條路都會試寫同一筆交易，而且經常會撞埋一齊（webhook 遲咗少少，
// 學生已經返到 /thank-you）。如果兩邊各寫各嘅，最後就會有兩份唔同嘅
// 入賬邏輯 —— 到期日算法漂移、狀態值唔一致、其中一邊漏咗某個欄位。
// 一段就冇呢個問題。
//
// ══ 冪等 ══
// plus_entitlements.stripe_checkout_session_id 有 UNIQUE。
// 邊個先到都寫得成，第二個撞 23505 就當「已經有人做咗」，靜靜哋收工。
// 呢個係唯一嘅防重複入賬機制 —— 唔靠先 select 再 insert（有 race）。

const DUPLICATE = '23505' // Postgres unique_violation

export type GrantResult =
  | { status: 'granted'; expiresAt: string }
  | { status: 'already' }
  | { status: 'unpaid' }
  | { status: 'error' }

/**
 * 由一個【已經由 Stripe 攞返嚟】嘅 Checkout Session 入賬。
 *
 * ⚠️ 個 session 必須係 server 直接向 Stripe 攞（webhook 驗過簽名，
 * 或者 sessions.retrieve()）。唔可以信任何由 client 傳上嚟嘅 session 內容。
 */
export async function grantFromSession(session: Stripe.Checkout.Session): Promise<GrantResult> {
  if (session.payment_status !== 'paid') return { status: 'unpaid' }

  const userId = session.client_reference_id
  const sku = parsePlusSku(session.metadata?.sku ?? undefined)
  if (!userId || !sku) {
    safeLog('error', 'grant', new Error(`session ${session.id} 冇 client_reference_id 或 sku`))
    return { status: 'error' }
  }

  // 到期由 server 計（§5.5）。唔用 session 入面任何時間欄位 ——
  // 嗰啲係 Stripe 嘅時鐘，我哋要嘅係「由入賬嗰刻計起」。
  const now = new Date()
  const expiresAt = computeExpiry(sku, now)

  try {
    const { error } = await getServiceSupabase().from('plus_entitlements').insert({
      user_id: userId,
      sku,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      status: 'active',
      starts_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })

    if (error) {
      if (error.code === DUPLICATE) return { status: 'already' }
      throw error
    }
    return { status: 'granted', expiresAt: expiresAt.toISOString() }
  } catch (e) {
    safeLog('error', 'grant', e)
    return { status: 'error' }
  }
}

/**
 * 退款 → 即時降級（規格 §5.3）。
 *
 * 唔刪除紀錄 —— 憲章 §4.3 要求交易紀錄保留 7 年作稅務用途。
 * 改 status 就夠：getEntitlement() 只認 status='active'。
 */
export async function revokeByPaymentIntent(paymentIntentId: string): Promise<boolean> {
  try {
    const { error } = await getServiceSupabase()
      .from('plus_entitlements')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('stripe_payment_intent_id', paymentIntentId)
    if (error) throw error
    return true
  } catch (e) {
    safeLog('error', 'revoke', e)
    return false
  }
}
