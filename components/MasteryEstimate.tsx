'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { getSubjectMastery, levelLabel, MIN_SECONDS_PER_QUESTION, type SubjectMastery } from '@/lib/mastery'
import { shareAtOrAbove, subjectDistribution, DISTRIBUTION_YEAR } from '@/lib/levelDistribution'

// 掌握度階梯估算（等級預測 v3 §4.5 輸出格式）。
//
// 三條誠實紅線，全部寫死喺文案入面，唔准之後靜靜拆走：
//   ① 永遠出【區間】，唔出單一數字。
//   ② 明寫「考評局從來冇公布過分數線」—— data/cutoffs.ts 嗰組 92/83/70…
//      係平台自訂嘅，唔係官方。
//   ③ 明寫呢個係按平台練習題推算，唔可以同考評局評級直接比較。
//
// 而且：估算未夠資料時【唔顯示等級】，改為講「仲差幾多題」。憲章 §7 唔准
// 出現打擊自信嘅元素，所以亦唔會有「Level 0」呢種嘢。

export default function MasteryEstimate({ subjectId, className = '' }: { subjectId: string; className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [m, setM] = useState<SubjectMastery | null>(null)

  useEffect(() => { setM(getSubjectMastery(subjectId)) }, [subjectId])
  if (m === null) return null
  if (m.sessions === 0 && m.legacy === 0) return null

  const dist = subjectDistribution(subjectId)
  const lowShare = m.low !== null ? shareAtOrAbove(subjectId, m.low) : null
  const highShare = m.high !== null ? shareAtOrAbove(subjectId, m.high) : null

  const band = m.low !== null && m.high !== null
    ? (en ? `Level ${levelLabel(m.low)}–${levelLabel(m.high)}` : `${levelLabel(m.low)} 至 ${levelLabel(m.high)} 級`)
    : null

  return (
    <div className={`rounded-2xl border border-line bg-surface-raised p-5 ${className}`}>
      <h2 className="font-medium text-ink mb-1">
        📐 {en ? 'Where you sit so far' : '累積掌握度估算'}
      </h2>

      {band ? (
        <>
          <p className="text-2xl font-medium text-ink mt-2">{band}</p>
          <p className="text-sm text-ink-muted mt-1">
            {en
              ? `Based on ${m.sessions} valid session${m.sessions === 1 ? '' : 's'} in this subject, judged tier by tier rather than on a single percentage.`
              : `按本科 ${m.sessions} 節有效練習，逐個難度層睇，唔係睇一個百分比。`}
          </p>

          {/* 有出處嘅參考線（規格書 §4.5）。講嘅係【同科人群】——「經濟科考生
              入面嘅前 17.3%」。⛔ 永遠唔跨科比較：M2 有 34.4% 達 5 級、體育
              3.6%，但兩科報考人群結構完全唔同，講「邊科易攞 5 級」會令學生
              轉錯科，係實質傷害。 */}
          {dist && lowShare !== null && (
            <p className="text-sm text-ink-muted mt-3 leading-relaxed">
              {en
                ? `For reference: in ${DISTRIBUTION_YEAR}, ${lowShare}% of day-school candidates in this subject were awarded Level ${levelLabel(m.low!)} or above${highShare !== null && m.high !== m.low ? `, and ${highShare}% Level ${levelLabel(m.high!)} or above` : ''}.`
                : `參考：${DISTRIBUTION_YEAR} 年本科日校考生入面，${lowShare}% 攞到 ${levelLabel(m.low!)} 級或以上${highShare !== null && m.high !== m.low ? `，${highShare}% 攞到 ${levelLabel(m.high!)} 級或以上` : ''}。`}
              {dist.smallSample && (
                en
                  ? ` Only ${dist.sat} candidates sat this subject, so those shares move by whole percentage points on one or two people — read them loosely.`
                  : `該科全港只有 ${dist.sat} 人應考，一兩個考生就能移動幾個百分點，呢兩個數要鬆手睇。`
              )}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-muted mt-2">
          {m.reason === 'too_few'
            ? (en
                ? `${m.questionsShort} more questions in this subject and an estimate becomes meaningful. Below that, a short set swings too much to say anything.`
                : `本科再做 ${m.questionsShort} 題，估算先開始有意義。題數太少，上落太大，講咩都唔準。`)
            : m.reason === 'tier_gap'
              ? (en
                  ? 'Not enough across the harder tiers yet — the estimate needs medium and hard questions, not just easy ones.'
                  : '較深嘅層數仲未夠 —— 估算要有中等同挑戰題，唔可以淨係做基礎題。')
              /* below_floor：答對率仲貼近四選一嘅亂猜水平。呢句唔可以寫成
                 「你亂按」或者「你唔夠班」—— 憲章 §7。講嘅係【訊號未夠清】，
                 唔係【你唔得】，而且緊接住畀返一條落腳嘅路。 */
              : (en
                  ? 'No estimate yet: the score is still close to what four-option guessing would give, so there is no clear signal to read. Start from the basic tier — the signal appears as soon as it rises above chance.'
                  : '估算暫時出唔到：而家嘅答對率仲貼近四選一亂猜嘅水平，訊號未夠清。由基礎題入手，一升過亂猜嘅線，估算就會出返嚟。')}
        </p>
      )}

      {m.discarded > 0 && (
        <p className="text-xs text-ink-muted mt-3">
          {en
            ? `${m.discarded} session${m.discarded === 1 ? '' : 's'} left out: under ${MIN_SECONDS_PER_QUESTION} seconds per question on average, which cannot be read as an attempt.`
            : `有 ${m.discarded} 節冇計入：平均每題不足 ${MIN_SECONDS_PER_QUESTION} 秒，快到讀唔到題目，當唔到係一次作答。`}
        </p>
      )}
      {m.legacy > 0 && (
        <p className="text-xs text-ink-muted mt-1">
          {en
            ? `${m.legacy} earlier session${m.legacy === 1 ? '' : 's'} pre-date tier-by-tier recording and are not counted.`
            : `有 ${m.legacy} 節喺平台開始逐層記錄之前完成，冇計入。`}
        </p>
      )}

      <p className="text-xs text-ink-muted mt-4 leading-relaxed">
        {en
          ? 'This is a range, not a number, because short sets really do swing that much. The HKEAA has never published a cut-off score for any subject, so nothing here is an official boundary — it is an estimate from this platform’s own rewritten questions and cannot be compared directly with an HKEAA grade.'
          : '呢度出嘅係一個範圍而唔係一個數字，因為短卷嘅上落真係咁大。考評局從來冇公布過任何一科嘅分數線，所以呢度冇一條線係官方嘅 —— 呢個估算按本平台自己改寫嘅練習題推算，唔可以同考評局嘅評級直接比較。'}
      </p>
    </div>
  )
}
