// Plan A — MANUAL payment. There is no automated checkout: a user pays you via one
// of the methods below, WhatsApps you a screenshot + their sign-in email, and you
// unlock them by adding that email to PREMIUM_EMAILS (env) and redeploying.
export const PAYMENT = {
  // WhatsApp number, INTERNATIONAL format, digits only (no +, spaces or dashes).
  whatsappNumber: '85295769972',

  // Payee name shown on /upgrade so payers can confirm the recipient.
  payeeName: 'HO S** H*** B****',

  // 轉數快 FPS — shown as copyable text on /upgrade.
  fpsId: '130157779',

  // Alipay HK / WeChat Pay collection QR codes. Save the QR screenshots into
  // dse-level-up/public/ with these exact filenames (or edit the paths here).
  alipayHkQr: '/alipayhk-qr.png',
  wechatQr: '/wechatpay-qr.png',
}
