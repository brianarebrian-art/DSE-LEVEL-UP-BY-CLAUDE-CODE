'use client'

/**
 * 本地渲染 IdP（Supabase Auth）回傳嘅 SVG QR。
 * 唔呼叫第三方圖片／QR API；secret 唔會送到外部服務。
 */
export default function MfaQrPanel({
  qrSvg,
  issuer,
  account,
}: {
  qrSvg: string
  issuer: string
  account: string
}) {
  // qr_code 可能已係完整 SVG，或需 data URI 包裝
  const isSvgMarkup = qrSvg.trim().startsWith('<')
  const src = isSvgMarkup
    ? `data:image/svg+xml;utf-8,${encodeURIComponent(qrSvg)}`
    : qrSvg.startsWith('data:')
      ? qrSvg
      : `data:image/svg+xml;utf-8,${encodeURIComponent(qrSvg)}`

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-cyan-500/20 bg-[#07111f] p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={200} height={200} className="h-[200px] w-[200px] bg-white p-2" />
      <p className="text-center text-xs text-slate-400">
        {issuer}
        <br />
        {account}
      </p>
    </div>
  )
}
