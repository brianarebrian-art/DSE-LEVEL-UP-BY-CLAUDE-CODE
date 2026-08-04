'use client'

import { useLocale } from '@/lib/i18n'

// 同源 iframe 殼：載入 public/supermarket/ 嗰個零依賴靜態超市。
// 保留喺 React 層嘅理由 —— app/relax/layout.tsx 會喺 iframe 外圍照樣渲染
// 緊急熱線橫幅同「一撳離開返 Dashboard」，兩樣都係 relax 區嘅硬要求。
export default function SupermarketFrame() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div>
      <iframe
        src="/supermarket/index.html"
        title={en ? 'Virtual Supermarket' : '虛擬超市'}
        // 同源但仍然收窄能力：唔畀彈窗、唔畀 top-level 導航、唔畀下載。
        sandbox="allow-scripts allow-same-origin allow-modals"
        className="w-full rounded-xl border border-white/10 bg-[#0d0d0f]"
        style={{ height: 'min(78dvh, 900px)' }}
      />
      <p className="mt-3 text-center text-xs leading-relaxed text-[#C2C2CC]">
        {en
          ? 'Everything in here is imaginary — the coins are not money, cannot be topped up, and buy nothing real.'
          : '入面全部都係虛擬嘅 —— 溫習幣唔係錢、唔可以充值、亦買唔到任何真實嘢。'}
      </p>
    </div>
  )
}
