'use client'

import Link from 'next/link'
import { getReviewRecord } from '@/data/provenance'
import { useLocale } from '@/lib/i18n'

// 題目來源披露 —— 答完之後喺解析區底部出現。
//
// ══ 要解決嘅懷疑 ══
// 學生對一個免費題庫嘅第一個問題係「啲題係咪求其作出嚟」。呢個懷疑好合理，
// 而且唔係靠一句「專家審核」答得到 —— 越係含糊嘅保證，越似冇嘢喺後面。
//
// ══ 點解兩種狀態都要出，唔可以只喺有紀錄嗰啲貼章 ══
// 5,201 條 live 題入面得 95 條（1.83%）有實名逐題審批紀錄。若只喺嗰 95 條貼
// 「已審核」而其餘沉默，等於暗示其餘嘅有嘢瞞住。所以兩邊都出，而冇實名紀錄
// 嗰邊【講佢實際過咗咩閘】而唔係講佢欠咩 —— 自動閘唔係冇嘢，只係唔係人審。
//
// 呢度顯示嘅每一個字都對得返 repo 入面嘅 decisions.json，任何人 clone 落嚟查得到。
export default function QuestionProvenance({ questionId }: { questionId: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const rec = getReviewRecord(questionId)

  return (
    <div className="mt-3 border-t border-gold/15 pt-3">
      <p className="text-[11px] text-ink-muted leading-relaxed">
        {rec ? (
          <>
            <span className="text-accent font-medium">
              ✓ {en ? 'Reviewed one-by-one' : '經逐題實名審批'}
            </span>
            {' — '}
            {en
              ? `approved by ${rec.reviewer} on ${rec.reviewedAt} (batch ${rec.batch}).`
              : `${rec.reviewer} 於 ${rec.reviewedAt} 批准（批次 ${rec.batch}）。`}
          </>
        ) : (
          <>
            <span className="text-ink-soft font-medium">
              {en ? 'Automated checks only' : '經自動檢查'}
            </span>
            {' — '}
            {en
              ? 'terminology and register, structure and difficulty mix, format and completeness. This question has no named line-by-line review record.'
              : '術語與書面語、結構與難度比例、格式與材料齊備。本題未有實名逐題審批紀錄。'}
          </>
        )}
        {' '}
        <Link href="/transparency#provenance" className="text-accent hover:underline">
          {en ? 'What this means' : '呢個代表咩'}
        </Link>
      </p>
    </div>
  )
}
