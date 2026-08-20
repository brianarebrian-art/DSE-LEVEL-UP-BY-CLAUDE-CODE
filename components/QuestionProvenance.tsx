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
//
// ══ 2026-08-21 加報錯 ══
// 「你可以查我哋」講完之後，跟住一定要有「你可以話我哋知我哋錯咗」，否則個披露
// 就只係單向嘅。舊嘅報錯入口喺已刪除嘅影子溫書室裏面，隨個牆一齊冇咗。
//
// 刻意用 mailto 而唔係 /api/question/report：後者要新表、要 migration、要創辦人批，
// 而「有個掣但寫入唔到」比冇掣更差 —— /relax/group 個 email 表單就係寫入一張從未
// 存在嘅表，由第一日起每個學生撳完都見到「未能記錄」。mailto 唔靚，但真係到得到
// 人手上，$0，而且今日就行得通。
/** 報錯信 —— 主旨帶題號，等我哋喺題庫搵得返係邊條。跟用戶語言。 */
function reportMailto(questionId: string, en: boolean): string {
  const subject = en
    ? `[DSE Level Up] Question issue: ${questionId}`
    : `[DSE Level Up] 題目問題：${questionId}`
  const body = (
    en
      ? [
          `Question ID: ${questionId}`,
          '',
          'What kind of issue? (delete the ones that do not apply)',
          '  answer / wording / formatting / difficulty / copyright / other',
          '',
          'What did you notice?',
          '',
        ]
      : [
          `題號：${questionId}`,
          '',
          '係邊一類問題？（刪走唔啱嗰啲）',
          '  答案有疑問 ／ 題目寫得唔清楚 ／ 排版 ／ 難度標錯 ／ 版權 ／ 其他',
          '',
          '你發現咗咩？', // i18n-exempt: 同一個三元式上面有英文版 'What did you notice?'
          '',
        ]
  ).join('\n')
  return `mailto:dselevelup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

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
        <span className="mx-1.5 text-ink-faint" aria-hidden>
          ·
        </span>
        <a href={reportMailto(questionId, en)} className="text-accent hover:underline">
          {en ? 'Something wrong with this question?' : '呢條題有問題？話我哋知'}
        </a>
      </p>
    </div>
  )
}
