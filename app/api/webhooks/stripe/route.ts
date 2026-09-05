import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { safeLog } from '@/lib/safeLog'
import { getStripe, isStripeReady } from '@/lib/payment/stripe'
import { grantFromSession, revokeByPaymentIntent } from '@/lib/payment/grant'

// Stripe webhook（Phase 2.2）。
//
// ══ 只處理兩個事件 ══
// checkout.session.completed —— 入賬
// charge.refunded            —— 即時降級
//
// 原規格仲有 invoice.paid 同 invoice.payment_failed。冇咗 ——
// 2026-09-04 創辦人決定冇自動續費，所以根本冇 invoice、冇續期、
// 冇 past_due。憲章 §8.2。
//
// ══ 除咗簽名唔啱，一律回 200 ══
// Stripe 收到非 2xx 就會重試（最多 3 日）。如果我哋因為自己個 DB
// 一時出事而回 500，Stripe 會不停重試同一件事，而學生嗰邊乜都見唔到。
// 所以：處理失敗照回 200，靠 /thank-you 輪詢同人手補救接住
// —— 呢個係修補 1 成套方案嘅其中一層，唔係放棄。

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!isStripeReady() || !secret) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'no_signature' }, { status: 400 })

  // ⚠️ 一定要用原始 body 驗簽名。req.json() 會 parse 一次再 stringify
  // 返轉頭，個 byte sequence 就變咗，驗極都唔會過。
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret)
  } catch (e) {
    // 簽名唔啱 = 唔知邊個打嚟。呢個係唯一回非 200 嘅情況。
    safeLog('error', 'stripe-webhook-signature', e)
    return NextResponse.json({ error: 'bad_signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // 唔信 webhook payload 入面嘅 payment_status —— 重新問 Stripe 攞一次。
        // payload 係我哋驗過簽名嘅，但重攞一次順便攞埋最新狀態。
        const fresh = await getStripe().checkout.sessions.retrieve(session.id)
        const r = await grantFromSession(fresh)
        safeLog('info', 'stripe-webhook', new Error(`checkout.session.completed → ${r.status}`))
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
        if (pi) await revokeByPaymentIntent(pi)
        break
      }
      default:
        // 其他事件唔關事。照回 200，唔好叫 Stripe 重試。
        break
    }
  } catch (e) {
    // 處理失敗都回 200 —— 見檔頭。補救靠 /thank-you 輪詢。
    safeLog('error', 'stripe-webhook', e)
  }

  return NextResponse.json({ received: true })
}
