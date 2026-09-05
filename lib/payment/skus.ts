// Plus SKU 定價【唯一真源】。
//
// ══ 點解價格喺 code 而唔係 DB ══
// 規格 §5.1：「價格必須由 server-side PRICE_MAP 決定，前端只傳 plan_type」。
// 執行憑證原本想用 site_config 做「價格熱切換」—— 唔採用。價格放喺 DB 一行
// jsonb，等於將定價變成一個【資料】問題：任何攞到 service-role key 或者入到
// Supabase dashboard 嘅途徑都改到價。放喺呢度，改價要 commit、要 review、
// 有 git blame。見 supabase/migrations/0013_plus_payment.sql 同一段。
//
// ══ 冇自動續費 ══
// 2026-09-04 創辦人決定：全部 SKU 一次性收費。所以呢度冇 `recurring`、
// 冇 `interval`、冇 Stripe Price 嘅 subscription 設定。每個 SKU 就係
// 「畀一次錢，換一段有期限嘅存取權」。到期靜靜哋變返免費層。

/** 憲章 §3.2 約束 2：單筆交易 ≤ HK$198。 */
export const MAX_AMOUNT_CENTS = 19800

/**
 * 用戶睇到嗰段同意聲明嘅版本。文案一改就要 bump ——
 * `consent_logs.consent_text_version` 靠佢，先至講得出當時用戶同意咗嘅
 * 究竟係邊個版本嘅文字。
 */
export const CONSENT_TEXT_VERSION = '2026-09-04.1'

// ══ 同 Stripe 嘅對應 ══
// 每個 SKU 喺 Stripe 有一個同名 product id 同一個同名 price lookup_key。
// 即係 sku === product.id === price.lookup_key，唔使另外維護一張對照表。
//
// Sandbox（acct_1UBwkYHANzDoBuwt）已建，2026-09-04：
//   plus_monthly  HK$28   price_1UByPmHANzDoBuwtizROlBWq  one_time
//   plus_season   HK$168  price_1UByPdHANzDoBuwtU3G93gpm  one_time
//   plus_yearly   HK$198  price_1UByPwHANzDoBuwtRFpUVNOf  one_time
// 三個都係 recurring: null —— 冇自動續費（2026-09-04 創辦人決定）。
// Live 帳戶【未建】任何 product／price。
//
// ⚠️ 下面 amountCents 只係【顯示】用。真正扣幾多錢由 Stripe Price 話事。
// 兩邊漂移 = 畀學生睇 HK$168 但扣 HK$188 —— 佢唔會知，直到張卡單出咗。
// 所以建立 Checkout Session 嗰陣【必須】用 lookup_key 攞返 Stripe Price，
// 同呢度嘅 amountCents 對一次，唔啱就拒絕開 session（唔好靜靜哋用邊一邊）。

export type PlusSku = 'plus_monthly' | 'plus_season' | 'plus_yearly'

type SkuSpec = {
  amountCents: number
  currency: 'hkd'
  /** 到期日一律由呢度 server-side 計（§5.5）。前端永遠唔准用 new Date() 判斷到期。 */
  duration: { days: number } | { months: number }
  labelZh: string
  labelEn: string
  periodZh: string
  periodEn: string
}

export const PLUS_SKUS: Record<PlusSku, SkuSpec> = {
  plus_monthly: {
    amountCents: 2800,
    currency: 'hkd',
    duration: { days: 30 },
    labelZh: 'Plus 30 日通行證',
    labelEn: 'Plus 30-Day Pass',
    // 刻意唔叫「月費」。冇自動續費，叫「月費」會令人以為每月會自動扣。
    periodZh: '由今日起計 30 日 · 一次性付款，唔會自動續期',
    periodEn: '30 days from today · one-time payment, no auto-renewal',
  },
  plus_season: {
    amountCents: 16800,
    currency: 'hkd',
    duration: { months: 9 },
    labelZh: 'Plus 九個月通行證',
    labelEn: 'Plus 9-Month Pass',
    periodZh: '由今日起計 9 個月 · 一次性付款，唔會自動續期',
    periodEn: '9 months from today · one-time payment, no auto-renewal',
  },
  plus_yearly: {
    amountCents: 19800,
    currency: 'hkd',
    duration: { months: 12 },
    labelZh: 'Plus 十二個月通行證',
    labelEn: 'Plus 12-Month Pass',
    periodZh: '由今日起計 12 個月 · 一次性付款，唔會自動續期',
    periodEn: '12 months from today · one-time payment, no auto-renewal',
  },
}

// 憲章上限守閘。放喺 module 頂層 —— 一改超咗，import 呢個檔嘅頁面
// 即刻起唔到，唔會靜靜哋出街。
for (const [sku, spec] of Object.entries(PLUS_SKUS)) {
  if (spec.amountCents > MAX_AMOUNT_CENTS) {
    throw new Error(
      `${sku} 定價 ${spec.amountCents} 超過憲章 §3.2 上限 ${MAX_AMOUNT_CENTS}（HK$198）。` +
        '要加價必須先修訂憲章 §3.2 並經 Brian ＋ Yuna 雙簽。',
    )
  }
}

/** `?plan=` 來自 URL，即係用戶控制。淨係認白名單入面嘅值。 */
export function parsePlusSku(raw: string | undefined): PlusSku | null {
  return raw && raw in PLUS_SKUS ? (raw as PlusSku) : null
}

/** 到期日 —— server-side 計，唔信任何客戶端時間。 */
export function computeExpiry(sku: PlusSku, from: Date = new Date()): Date {
  const d = new Date(from)
  const { duration } = PLUS_SKUS[sku]
  if ('days' in duration) d.setDate(d.getDate() + duration.days)
  else d.setMonth(d.getMonth() + duration.months)
  return d
}

/** HK$168.00 —— 顯示用。金額本身以 cents 為準，唔好倒轉再由字串 parse 返。 */
export function formatHkd(amountCents: number): string {
  return `HK$${(amountCents / 100).toFixed(2).replace(/\.00$/, '')}`
}

/** Stripe 有冇接好。未接好嗰陣，確認頁照顯示，但唔會扮撳得。 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
