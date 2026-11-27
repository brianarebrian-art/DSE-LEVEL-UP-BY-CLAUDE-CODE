import {
  BANK_DISCLOSURE_ZH,
  DISCLOSURE_PREVIEW_FRAME_ZH,
  PREDICTION_DISCLOSURE_ZH,
  PREVIEW_ITEM_LABEL_ZH,
} from '@/lib/loop-engineering/disclosure'
import { type Week58PreviewModel } from '@/lib/loop-engineering/week58-batch'

/** 第 5–8 星期草稿的內部預覽。練習頁與成績頁不要掛上。文案只讀 disclosure.ts。 */
export function LoopWeek58Preview({ model }: { model: Week58PreviewModel }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-ink-muted">{DISCLOSURE_PREVIEW_FRAME_ZH}</p>
      <h1 className="mt-4 text-lg font-medium text-ink">第 5–8 星期升級草稿 {/* i18n-exempt: zh-Hant preview */}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink">{model.noteZh}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">
        已確認範圍仍是 {model.authorizedRange.min} 至 {model.authorizedRange.max} 條。本頁 {model.counts.produced} 條是第一批。Loop 3 通過 {model.counts.passedLoop3} 條，回爐 {model.counts.rewound} 條。兩人覆核未開始。難度宣稱維持未驗證。 {/* i18n-exempt: zh-Hant preview */}
      </p>
      <section className="mt-6 rounded-2xl border border-line bg-surface-raised p-5">
        <h2 className="text-lg font-medium text-ink">預測等級 {/* i18n-exempt: zh-Hant preview */}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">本頁沒有出示任何預測等級。 {/* i18n-exempt: zh-Hant preview */}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink">{PREDICTION_DISCLOSURE_ZH}</p>
      </section>
      <section className="mt-4 rounded-2xl border border-line bg-surface-raised p-5">
        <h2 className="text-lg font-medium text-ink">題庫來源 {/* i18n-exempt: zh-Hant preview */}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink">{BANK_DISCLOSURE_ZH}</p>
        <p className="mt-3 text-sm font-medium text-ink">{PREVIEW_ITEM_LABEL_ZH}</p>
      </section>
      <section className="mt-6">
        <h2 className="text-lg font-medium text-ink">草稿 {/* i18n-exempt: zh-Hant preview */}</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {model.drafts.map((draft) => (
            <li key={draft.draftId} className="rounded-2xl border border-line bg-surface-raised p-5">
              <h3 className="text-sm font-medium text-ink">
                {draft.draftId} · {draft.topicZh} · {draft.status}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">{draft.disclosureZh}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{draft.content}</p>
              {draft.options ? (
                <ol className="mt-3 flex list-decimal flex-col gap-1 pl-5 text-sm text-ink">
                  {draft.options.map((option, index) => (
                    <li key={`${draft.draftId}-${index}`} className={index === draft.correctIndex ? 'font-medium' : undefined}>
                      {option}
                    </li>
                  ))}
                </ol>
              ) : null}
              {draft.referenceAnswer ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{draft.referenceAnswer}</p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{draft.explanation}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
