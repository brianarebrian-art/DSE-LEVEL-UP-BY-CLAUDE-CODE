import type { Metadata } from 'next'
import { getSyncUserId } from '@/lib/auth/server'
import { getStripe, isStripeReady } from '@/lib/payment/stripe'
import { grantFromSession } from '@/lib/payment/grant'
import { safeLog } from '@/lib/safeLog'
import ThankYouClient, { type ThankYouState } from './ThankYouClient'

// 付款完成頁 ＋ Webhook 失敗自動恢復（修補 1 方案 B / Phase 2.2）。
//
// ══ 點解要喺呢一版入賬 ══
// Stripe webhook 可能因為 Vercel 冷啟動、網絡、或者 Stripe 嗰邊排隊而遲到。
// 學生已經畀咗錢、已經返到呢一版，但 Supabase 仲未有紀錄 —— 佢會見到
// 「你係免費版」。原規格叫佢「5 分鐘內未解鎖請聯絡我哋」，即係叫一個
// 啱啱畀咗錢嘅中六生去等同埋去投訴。
//
// 所以呢一版【自己】向 Stripe 攞返個 session，確認畀咗錢就即刻入賬。
// 同 webhook 共用 grantFromSession()，靠 stripe_checkout_session_id
// 個 UNIQUE 做冪等 —— 兩邊撞埋一齊都唔會重複入賬。
//
// 即係話正常情況下 webhook 同呢一版邊個快邊個做，慢嗰個自動變 no-op。
// Webhook 完全冇到都唔影響學生 —— 佢返到呢一版就已經解鎖。
//
// ══ 暗部署 ══ noindex。開賣日先移除。

export const metadata: Metadata = {
  title: '多謝支持 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '你嘅 Plus 支持已完成處理。', // i18n-exempt
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = (await searchParams).session_id
  const sessionId = typeof raw === 'string' ? raw : null

  const state = await resolve(sessionId)
  return <ThankYouClient state={state} />
}

async function resolve(sessionId: string | null): Promise<ThankYouState> {
  if (!sessionId || !isStripeReady()) return 'unknown'

  const userId = await getSyncUserId()
  if (!userId) return 'unknown'

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    // 擁有權：session_id 出現喺 URL，即係複製得、分享得。
    // 唔屬於當前登入者就當唔認識 —— 唔可以話畀佢知呢張單存唔存在、
    // 幾多錢、邊個買。
    if (session.client_reference_id !== userId) return 'unknown'

    if (session.payment_status !== 'paid') return 'processing'

    const r = await grantFromSession(session)
    // 'granted' 同 'already' 對學生嚟講係同一件事：搞掂咗。
    // 分別只喺邊個先到（webhook 定呢一版），佢唔需要知。
    return r.status === 'granted' || r.status === 'already' ? 'done' : 'processing'
  } catch (e) {
    safeLog('error', 'thank-you', e)
    return 'processing'
  }
}
