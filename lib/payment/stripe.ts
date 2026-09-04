import Stripe from 'stripe'

// SERVER-ONLY Stripe client。
//
// ⚠️ 唔好由 client component import。STRIPE_SECRET_KEY 一到瀏覽器，
// 任何人都可以攞你個帳戶開單、退款、睇晒所有交易。
//
// 同 utils/supabase/server.ts 一樣：singleton，request time 讀 env，
// 唔喺 build time 讀（否則 key 會入咗 bundle）。

let client: Stripe | null = null

export function getStripe(): Stripe {
  if (client) return client
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY 未設定 —— Stripe 未接好')
  client = new Stripe(key)
  return client
}

/** 未設定 key 就當 Stripe 未接好。頁面照顯示，但唔會扮撳得。 */
export function isStripeReady(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
