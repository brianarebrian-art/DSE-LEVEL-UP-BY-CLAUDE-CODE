import { NextResponse, type NextRequest } from 'next/server'
import { createHash } from 'node:crypto'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { getStripe, isStripeReady } from '@/lib/payment/stripe'
import { PLUS_SKUS, parsePlusSku, CONSENT_TEXT_VERSION } from '@/lib/payment/skus'

// 建立 Stripe Checkout Session（Phase 1.2）。
//
// 呢條路由做四件事，次序有意義：
//   ① 認人（冇登入唔可以買 —— 權限綁 user_id，冇 user_id 就冇嘢可以綁）
//   ② 對價（Stripe 個價 vs 我哋個價，唔啱就拒絕）
//   ③ 開 session
//   ④ 寫同意聲明（寫唔到就唔畀去付款）

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isStripeReady()) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  }

  // ① 認人。
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as { plan?: unknown; consent?: unknown }
  const sku = parsePlusSku(typeof body.plan === 'string' ? body.plan : undefined)
  if (!sku) return NextResponse.json({ error: 'unknown_plan' }, { status: 400 })

  // 同意聲明係硬性前置（修補 2）。冇剔就唔可以去到付款頁 ——
  // 呢個檢查喺 server 做，因為前端個 disabled 屬性改得。
  if (body.consent !== true) {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 })
  }

  const spec = PLUS_SKUS[sku]

  try {
    const stripe = getStripe()

    // ② 對價 —— 呢步唔可以省。
    //
    // skus.ts 入面個金額只係畀學生【睇】，真正扣幾多係 Stripe Price 話事。
    // 兩邊漂移（改咗一邊冇改另一邊）＝ 頁面寫住 HK$168、卡單出 HK$188，
    // 而學生要等到月結單先發現。所以寧可開唔到 session。
    const prices = await stripe.prices.list({ lookup_keys: [sku], active: true, limit: 1 })
    const price = prices.data[0]
    if (!price) {
      safeLog('error', 'checkout', new Error(`Stripe 搵唔到 lookup_key=${sku} 嘅 active price`))
      return NextResponse.json({ error: 'price_missing' }, { status: 500 })
    }
    if (price.unit_amount !== spec.amountCents || price.currency !== spec.currency) {
      safeLog(
        'error',
        'checkout',
        new Error(
          `價格唔對 ${sku}：Stripe ${price.unit_amount} ${price.currency} vs 本地 ${spec.amountCents} ${spec.currency}`,
        ),
      )
      return NextResponse.json({ error: 'price_mismatch' }, { status: 500 })
    }
    // 冇自動續費 —— 如果 Stripe 嗰邊唔知點解變咗 recurring，即刻停。
    if (price.recurring) {
      safeLog('error', 'checkout', new Error(`${sku} 喺 Stripe 變咗 recurring price —— 憲章 §8.2 冇自動續費`))
      return NextResponse.json({ error: 'unexpected_recurring' }, { status: 500 })
    }

    // ③ 開 session。
    const origin = req.nextUrl.origin
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // 一次性，唔係 subscription
      line_items: [{ price: price.id, quantity: 1 }],
      client_reference_id: userId, // 入賬靠呢個綁返個人
      metadata: { sku, consent_text_version: CONSENT_TEXT_VERSION },
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/confirm-payment?plan=${sku}`,
    })

    // ④ 寫同意聲明。
    //
    // 刻意喺開完 session 之後先寫：consent_logs 要 session id 做 unique 鍵。
    // 寫唔到就唔返 URL —— 一個冇同意紀錄嘅交易，正正就係修補 2 要防嘅嘢。
    // 個 session 冇人用就自己過期，唔會扣任何錢。
    const evidence = {
      user_id: userId,
      stripe_checkout_session_id: session.id,
      consent_type: 'self_declared_18_or_guardian' as const,
      consent_text_version: CONSENT_TEXT_VERSION,
      amount_cents: spec.amountCents,
      currency: spec.currency,
      sku,
    }
    const { error: consentError } = await getServiceSupabase()
      .from('consent_logs')
      .insert({
        ...evidence,
        // 事後靜靜哋改紀錄就對唔返呢個 hash。
        evidence_hash: createHash('sha256').update(JSON.stringify(evidence)).digest('hex'),
      })
    if (consentError) {
      safeLog('error', 'checkout-consent', consentError)
      return NextResponse.json({ error: 'consent_log_failed' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    safeLog('error', 'checkout', e)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 })
  }
}
