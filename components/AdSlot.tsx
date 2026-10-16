'use client'

import { useLocale } from '@/lib/i18n'

/**
 * Reserved ad/sponsor space. The fixed min-height keeps the page stable when
 * AdSense is enabled later (CLS-safe), while remaining visually quiet today.
 */
export default function AdSlot({ label = 'sponsor' }: { label?: string }) {
  const { locale } = useLocale()
  return (
    <aside
      aria-label={locale === 'en' ? 'Advertisement placeholder' : '廣告預留位置'}
      data-ad-slot={label}
      className="my-8 flex min-h-[96px] items-center justify-center rounded-2xl border border-dashed border-line bg-surface-sunken/40 px-4 text-center text-xs text-ink-muted"
    >
      <span>
        {locale === 'en' ? 'A quiet space for student-friendly sponsors' : '學生友善贊助／廣告預留位置'}
        <span className="mt-1 block opacity-70">{locale === 'en' ? 'No content is covered · no layout shift' : '不遮擋內容 · 不造成版面位移'}</span>
      </span>
    </aside>
  )
}
