'use client'

import { useLocale } from '@/lib/i18n'

// 公開求助熱線卡（light-first 版）——影子溫書室【永遠置頂】，唔靠任何自動偵測觸發。
// 號碼為公開官方熱線：香港撒瑪利亞會 2896 0000（24 小時）、生命熱線 2382 0000。
// （深色霓虹版見 app/relax/components/EmergencyBanner.tsx，同一組已核實號碼。）
export default function HotlineCard({ emphasis = false }: { emphasis?: boolean }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div
      className={`rounded-xl border p-4 ${
        emphasis ? 'border-rose/30 bg-rose/[0.06]' : 'border-gold/25 bg-gold/[0.06]'
      }`}
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        {en ? "Feeling overwhelmed? You're not alone. " : '覺得頂唔順？你唔係一個人。'}
        {en ? 'The Samaritans (24 hr): ' : '撒瑪利亞會 24 小時熱線：'}
        <a href="tel:28960000" className="min-h-11 inline-flex items-center px-1 font-medium text-accent-strong underline underline-offset-2">
          2896 0000
        </a>
        {' · '}
        {en ? 'Suicide Prevention Services: ' : '生命熱線：'}
        <a href="tel:23820000" className="min-h-11 inline-flex items-center px-1 font-medium text-accent-strong underline underline-offset-2">
          2382 0000
        </a>
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'This platform is not a professional medical service; the information above is for reference only. In an emergency, call 999 or go to the nearest A&E.'
          : '本平台非專業醫療機構，以上資訊僅供參考。如情況緊急，請立即致電 999 或前往就近急症室。'}
      </p>
    </div>
  )
}
