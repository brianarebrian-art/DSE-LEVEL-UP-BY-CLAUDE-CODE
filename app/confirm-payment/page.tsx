import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ConfirmPaymentClient from './ConfirmPaymentClient'
import { PLUS_SKUS, parsePlusSku, formatHkd, isStripeConfigured, CONSENT_TEXT_VERSION } from '@/lib/payment/skus'

// 付款確認頁（修補 9）。
//
// ══ 點解要多一版 ══
// 手機屏幕誤觸「立即支持」，3 秒內就入咗 Stripe Checkout。呢一版令由價格頁
// 去到 Stripe 最少要撳兩次，而且中間有一版係【我哋控制】嘅 —— 字體、顏色、
// 鍵盤導航、SEN 友善全部做得到，Stripe Hosted Checkout 嗰版做唔到。
//
// ══ 同意聲明（修補 2）擺埋喺呢度 ══
// 原規格分開兩步：/support 彈 modal 收同意，再去 /confirm-payment。合併咗 ——
// SEN 要求「3 步內完成」，而且用戶應該喺【同一版】睇齊「買咩、幾錢、幾耐、
// 我聲明緊乜」先撳落去。分兩版只會令人喺第二版已經唔記得第一版簽過乜。
//
// ══ 暗部署 ══
// noindex。開賣日（9/19）先移除 —— 見執行指令 Hour 0。

export const metadata: Metadata = {
  title: '確認支持 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '確認你嘅 Plus 支持詳情 —— 項目、金額、期限，以及基層學生減免途徑。', // i18n-exempt
  robots: { index: false, follow: false }, // 暗部署期間唔畀搜尋引擎收錄
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const raw = (await searchParams).plan
  const sku = parsePlusSku(typeof raw === 'string' ? raw : undefined)

  // `?plan=` 由用戶控制。唔喺白名單就 404，唔會落到任何金額計算。
  if (!sku) notFound()

  const spec = PLUS_SKUS[sku]

  // 金額由 server 解析完先傳落 client（§5.1：前端只傳 plan_type，唔可以傳價格）。
  // client 收到嘅係已經定咗嘅顯示字串，改咗都冇用 —— 真正嘅金額喺
  // 建立 Checkout Session 嗰陣喺 server 再由 PLUS_SKUS 攞一次。
  return (
    <ConfirmPaymentClient
      sku={sku}
      amount={formatHkd(spec.amountCents)}
      labelZh={spec.labelZh}
      labelEn={spec.labelEn}
      periodZh={spec.periodZh}
      periodEn={spec.periodEn}
      consentTextVersion={CONSENT_TEXT_VERSION}
      stripeReady={isStripeConfigured()}
    />
  )
}
