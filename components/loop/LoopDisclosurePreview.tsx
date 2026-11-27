import {
  BANK_DISCLOSURE_ZH,
  DISCLOSURE_PREVIEW_FRAME_ZH,
  PREDICTION_DISCLOSURE_ZH,
  PREVIEW_ITEM_LABEL_ZH,
} from '@/lib/loop-engineering/disclosure'

/** 披露文案的可復用預覽。練習頁與成績頁在 P0 合併前不要掛上。文案只讀 disclosure.ts。 */
export function LoopDisclosurePreview() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-sm text-ink-muted">{DISCLOSURE_PREVIEW_FRAME_ZH}</p>
      <section className="mt-6 rounded-2xl border border-line bg-surface-raised p-5">
        <h1 className="text-lg font-medium text-ink">預測等級 {/* i18n-exempt: zh-Hant preview */}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">{PREDICTION_DISCLOSURE_ZH}</p>
      </section>
      <section className="mt-4 rounded-2xl border border-line bg-surface-raised p-5">
        <h2 className="text-lg font-medium text-ink">題庫來源 {/* i18n-exempt: zh-Hant preview */}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">{BANK_DISCLOSURE_ZH}</p>
        <p className="mt-3 text-sm font-medium text-ink">{PREVIEW_ITEM_LABEL_ZH}</p>
      </section>
    </main>
  )
}
