'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import {
  getSubjectMastery, levelLabel, MIN_SECONDS_PER_QUESTION, type SubjectMastery,
} from '@/lib/mastery'
import { shareAtOrAbove, subjectDistribution, DISTRIBUTION_YEAR } from '@/lib/levelDistribution'
import { driftYears } from '@/lib/levelDrift'

// 等級估算（v4）。呢個組件嘅責任唔止係出個數，而係令學生知道呢個數靠得住
// 幾多 —— 所以三種不確定性各自有自己嘅一句，唔混埋一齊講。
//
// ⛔ 永遠唔會出單一等級。
// ⛔ 未夠證據時【唔出等級】，改為講「仲要做幾多題」。
// ⛔ 唔講「你會攞 X 級」，只講「而家嘅表現落喺邊個範圍」。

export default function MasteryEstimate({ subjectId, className = '' }: { subjectId: string; className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [m, setM] = useState<SubjectMastery | null>(null)

  useEffect(() => { setM(getSubjectMastery(subjectId)) }, [subjectId])
  if (m === null) return null
  if (m.sessions === 0 && m.legacy === 0) return null

  const dist = subjectDistribution(subjectId)
  const years = driftYears(subjectId)
  const lowShare = m.low !== null ? shareAtOrAbove(subjectId, m.low) : null
  const highShare = m.high !== null ? shareAtOrAbove(subjectId, m.high) : null
  const band = m.low !== null && m.high !== null
    ? (en ? `Level ${levelLabel(m.low)}–${levelLabel(m.high)}` : `${levelLabel(m.low)} 至 ${levelLabel(m.high)} 級`)
    : null

  return (
    <div className={`rounded-2xl border border-line bg-surface-raised p-5 ${className}`}>
      <h2 className="font-medium text-ink mb-1">
        📐 {en ? 'Where your practice sits' : '你嘅練習表現落喺邊'}
      </h2>

      {band ? (
        <>
          <p className="text-2xl font-medium text-ink mt-2">{band}</p>
          <p className="text-sm text-ink-muted mt-1">
            {en
              ? `From ${m.sessions} valid session${m.sessions === 1 ? '' : 's'} in this subject. The boundaries below are the HKEAA's published figures, not ours.`
              : `按本科 ${m.sessions} 節有效練習。下面幾條界線係考評局公布嘅實數，唔係我哋定嘅。`}
          </p>

          {/* 有出處嘅參考。講嘅係【同科人群】——⛔ 永遠唔跨科比較。 */}
          {dist && lowShare !== null && (
            <p className="text-sm text-ink-muted mt-3 leading-relaxed">
              {en
                ? `In ${DISTRIBUTION_YEAR}, ${lowShare}% of day-school candidates in this subject were awarded Level ${levelLabel(m.low!)} or above${highShare !== null ? `, and ${highShare}% Level ${levelLabel(m.high!)} or above` : ''}.`
                : `${DISTRIBUTION_YEAR} 年本科日校考生入面，${lowShare}% 攞到 ${levelLabel(m.low!)} 級或以上${highShare !== null ? `，${highShare}% 攞到 ${levelLabel(m.high!)} 級或以上` : ''}。`}
            </p>
          )}

          {/* ── 三種不確定性，分開講 ────────────────────────────────── */}
          <div className="mt-4 pt-4 border-t border-line space-y-2">
            <p className="text-xs text-ink-muted leading-relaxed">
              <span className="text-ink">{en ? '① Sampling: ' : '① 抽樣誤差：'}</span>
              {en
                ? `you have answered a finite number of questions, so your position moves about ${m.samplingSpread} percentage points either way. More questions narrows this — nothing else does.`
                : `你做過嘅題數有限，所以你嘅位置本身有大約 ${m.samplingSpread} 個百分點嘅上落。只有做多啲題會收窄佢，其他嘢都唔會。`}
            </p>
            {m.driftSd !== null && years.length > 0 && (
              <p className="text-xs text-ink-muted leading-relaxed">
                <span className="text-ink">{en ? '② The line itself moves: ' : '② 條界線自己都會郁：'}</span>
                {en
                  ? `across ${years[0]}–${years[years.length - 1]} this boundary shifted by about ${m.driftSd} percentage points from year to year. DSE is standards-referenced — the cut is set each year after marking, so there is no fixed line to hit.`
                  : `${years[0]} 至 ${years[years.length - 1]} 年之間，呢條界線每年郁大約 ${m.driftSd} 個百分點。DSE 用水平參照，條線每年評卷之後先訂 —— 根本冇一條固定嘅線畀你對。`}
              </p>
            )}
            <p className="text-xs text-ink-muted leading-relaxed">
              <span className="text-rose">{en ? '③ Untested assumption: ' : '③ 未驗證嘅假設：'}</span>
              {en
                ? 'we assume that doing well on our questions means the same thing as doing well on the real paper. We have never checked this, because no student here has both a score with us and a real DSE result. Until that data exists, treat this as a rough bearing, not a prediction.'
                : '我哋假設「喺我哋啲題做得好」等於「喺真卷做得好」。呢一步從來冇驗證過 —— 因為本平台冇一個學生同時有我哋量到嘅表現同真實 DSE 成績。呢批數據未有之前，當呢個係一個方向，唔係一個預測。'}
            </p>
          </div>
        </>
      ) : (
        <div className="mt-2">
          <p className="text-sm text-ink">
            {m.reason === 'too_few'
              ? (en
                  ? `Not enough yet — ${m.questionsShort} more questions in this subject before an estimate means anything.`
                  : `仲未夠 —— 本科再做 ${m.questionsShort} 題，估算先開始有意義。`)
              : m.reason === 'too_uncertain'
                ? (en
                    ? (m.questionsShort > 0
                        ? `Not saying yet. At this point the range would span three levels, which tells you nothing. About ${m.questionsShort} more questions in this subject would narrow it enough to be worth showing.`
                        : 'Not saying yet — the range would still span three levels, which tells you nothing.')
                    : (m.questionsShort > 0
                        ? `而家唔講住。以目前嘅題數，個範圍會跨三個等級 —— 咁樣講咗等於冇講。本科再做大約 ${m.questionsShort} 題，就收窄到講得出嘢。`
                        : '而家唔講住 —— 個範圍仲會跨三個等級，講咗等於冇講。'))
                : m.reason === 'no_distribution'
                  ? (en
                      ? 'This subject is reported as attained / not attained only, so there is no level to estimate.'
                      : '本科只設達標／未達標，冇等級可以估。')
                  : (en
                      ? 'No estimate yet: your score is still close to what four-option guessing would give, so we cannot tell the two apart. Start from the basic tier — the signal appears as soon as it rises clear of chance.'
                      : '估算暫時出唔到：而家嘅正確率仲貼近四選一亂猜嘅水平，我哋分辨唔到兩者。由基礎題入手，一升過亂猜嗰條線，估算就會出返嚟。')}
          </p>
          <p className="text-xs text-ink-muted mt-3 leading-relaxed">
            {en
              ? 'We would rather show nothing than show a range so wide it means nothing.'
              : '寧可乜都唔顯示，都好過畀一個闊到冇意義嘅範圍你。'}
          </p>
        </div>
      )}

      {(m.discarded > 0 || m.legacy > 0) && (
        <p className="text-xs text-ink-muted mt-3">
          {m.discarded > 0 && (en
            ? `${m.discarded} session${m.discarded === 1 ? '' : 's'} left out: under ${MIN_SECONDS_PER_QUESTION} seconds per question on average. `
            : `有 ${m.discarded} 節冇計入：平均每題不足 ${MIN_SECONDS_PER_QUESTION} 秒。`)}
          {m.legacy > 0 && (en
            ? `${m.legacy} earlier session${m.legacy === 1 ? '' : 's'} pre-date tier-by-tier recording.`
            : `有 ${m.legacy} 節喺平台開始逐層記錄之前完成，冇計入。`)}
        </p>
      )}

      <p className="text-xs text-ink-muted mt-4 leading-relaxed">
        {en
          ? 'The HKEAA has never published a cut-off score for any subject — DSE is standards-referenced. Nothing here is an official boundary, and this is not an HKEAA grade.'
          : '考評局從來冇公布過任何一科嘅分數線 —— DSE 用水平參照。呢度冇一條線係官方分數線，呢個亦唔係考評局嘅評級。'}
      </p>
    </div>
  )
}
