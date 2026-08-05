'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { loadAttempts, type AttemptRecord } from '@/lib/progress'
import {
  studyTotals,
  dailyBars,
  timeSlots,
  bestSlot,
  formatDuration,
  MIN_QUESTIONS_PER_SLOT,
  type SlotKey,
} from '@/lib/studyTime'

// 溫習時長分析 —— 100% 由 `dse_progress` 現有欄位（elapsed / timestamp / score / total）
// 即時計算。零新表、零新 API route、零新依賴、純 SVG（憲章禁 Chart.js / D3 / Recharts）。
//
// 大愛紅線：呢張卡淨係【描述】唔【評分】。冇「建議時數」、冇進度條催促、
// 冇同其他考生比較、冇「你今日仲差 X 分鐘」。時段分析要夠樣本先出，
// 唔夠就老實講「再做多幾份就見到」，唔會用三題去砌一個結論。

const DAYS = 14
const WINDOW = 30

const SLOT_LABEL: Record<SlotKey, { zh: string; en: string; hint: string; hintEn: string }> = {
  dawn: { zh: '深夜', en: 'Late night', hint: '00:00–04:59', hintEn: '00:00–04:59' },
  morning: { zh: '早上', en: 'Morning', hint: '05:00–11:59', hintEn: '05:00–11:59' },
  afternoon: { zh: '下午', en: 'Afternoon', hint: '12:00–17:59', hintEn: '12:00–17:59' },
  evening: { zh: '夜晚', en: 'Evening', hint: '18:00–23:59', hintEn: '18:00–23:59' },
}

export default function StudyTimeInsight() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [attempts, setAttempts] = useState<AttemptRecord[] | null>(null)

  useEffect(() => {
    setAttempts(loadAttempts()) // client-only（localStorage）
  }, [])

  if (!attempts) return null

  const t = studyTotals(attempts, WINDOW)
  if (t.papers === 0) return null // 未練習過就唔出空卡

  const bars = dailyBars(attempts, DAYS)
  const slots = timeSlots(attempts)
  const best = bestSlot(slots)
  const peak = Math.max(...bars.map((b) => b.seconds), 1)

  // 條形圖幾何（viewBox 座標，唔用固定 px，跟容器縮放）
  const W = 320
  const H = 64
  const gap = 3
  const bw = (W - gap * (bars.length - 1)) / bars.length

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={18} className="text-accent" />
        <h2 className="font-medium text-ink">
          {en ? 'Your study rhythm' : '你嘅溫習節奏'}
        </h2>
      </div>
      <p className="text-xs text-ink-muted mb-5">
        {en
          ? `Last ${WINDOW} days, from your own practice records. Nothing here is a target.`
          : `過去 ${WINDOW} 日，全部由你自己嘅練習紀錄計出。呢度冇任何一個數字係「目標」。`}
      </p>

      {/* 三個實數 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat
          label={en ? 'Time spent' : '累計時間'}
          value={formatDuration(t.seconds, en)}
        />
        <Stat
          label={en ? 'Per question' : '平均每題'}
          value={t.secondsPerQuestion === null ? '—' : formatDuration(t.secondsPerQuestion, en)}
        />
        <Stat
          label={en ? 'Days practised' : '有練習嘅日數'}
          value={en ? `${t.activeDays} / ${WINDOW}` : `${t.activeDays} / ${WINDOW}`}
        />
      </div>

      {/* 最近 14 日逐日時長 */}
      <h3 className="text-sm font-medium text-ink mb-2">
        {en ? `Last ${DAYS} days` : `最近 ${DAYS} 日`}
      </h3>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-16 mb-1"
        preserveAspectRatio="none"
        role="img"
        aria-label={
          en
            ? `Daily study time for the last ${DAYS} days. ${bars.filter((b) => b.seconds > 0).length} of ${DAYS} days had practice.`
            : `最近 ${DAYS} 日每日溫習時間，其中 ${bars.filter((b) => b.seconds > 0).length} 日有練習。`
        }
      >
        {bars.map((b, i) => {
          const h = b.seconds === 0 ? 2 : Math.max(3, (b.seconds / peak) * (H - 4))
          return (
            <rect
              key={b.key}
              x={i * (bw + gap)}
              y={H - h}
              width={bw}
              height={h}
              rx={1.5}
              // 休息日用極淡底色而唔係留白 —— 休息係節奏嘅一部分，唔應該視覺上被抹走。
              fill={b.seconds === 0 ? 'var(--color-surface-sunken)' : 'var(--color-accent)'}
              opacity={b.seconds === 0 ? 1 : 0.85}
            />
          )
        })}
      </svg>
      <p className="text-[11px] text-ink-muted mb-6">
        {en
          ? 'Flat days are rest days — they are part of the rhythm, not a gap.'
          : '平嗰啲日子係休息日 —— 佢哋係節奏嘅一部分，唔係缺口。'}
      </p>

      {/* 時段狀態 */}
      <h3 className="text-sm font-medium text-ink mb-2">
        {en ? 'When you tend to be sharpest' : '你通常喺邊個時段最清醒'}
      </h3>

      {best === null ? (
        <p className="text-xs text-ink-muted leading-relaxed">
          {en
            ? `Not enough to say yet — a slot needs at least ${MIN_QUESTIONS_PER_SLOT} questions, across at least two different times of day. Keep practising whenever suits you and this will fill in.`
            : `而家仲講唔準 —— 一個時段要至少 ${MIN_QUESTIONS_PER_SLOT} 題，而且要有兩個唔同時段先比較得到。你幾時方便就幾時做，呢度自然會填滿。`}
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-soft leading-relaxed mb-3">
            {en
              ? `Your accuracy runs highest in the ${SLOT_LABEL[best.key].en.toLowerCase()} (${SLOT_LABEL[best.key].hintEn}) — ${Math.round(best.accuracy! * 100)}% across ${best.questions} questions. Worth putting your harder topics there.`
              : `你喺${SLOT_LABEL[best.key].zh}（${SLOT_LABEL[best.key].hint}）嘅正確率最高 —— ${best.questions} 題入面 ${Math.round(best.accuracy! * 100)}%。難啲嘅課題可以排喺呢個時段。`}
          </p>
          <ul className="space-y-1.5">
            {slots.map((s) => {
              const enough = s.questions >= MIN_QUESTIONS_PER_SLOT && s.accuracy !== null
              const isBest = s.key === best.key
              return (
                <li key={s.key} className="flex items-center gap-2 text-xs">
                  <span className={`w-14 shrink-0 ${isBest ? 'text-accent font-medium' : 'text-ink-muted'}`}>
                    {en ? SLOT_LABEL[s.key].en : SLOT_LABEL[s.key].zh}
                  </span>
                  <span className="flex-1 h-2 rounded-full bg-surface-sunken overflow-hidden">
                    {enough && (
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${Math.round(s.accuracy! * 100)}%`,
                          background: isBest ? 'var(--color-accent)' : 'var(--color-ink-muted)',
                        }}
                      />
                    )}
                  </span>
                  <span className="w-24 shrink-0 text-right text-ink-muted tabular-nums">
                    {enough
                      ? `${Math.round(s.accuracy! * 100)}% · ${s.questions}${en ? 'q' : ' 題'}`
                      : en
                        ? `${s.questions}q so far`
                        : `暫 ${s.questions} 題`}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <p className="mt-5 text-[11px] text-ink-muted leading-relaxed">
        {en
          ? 'Computed on your device from records already saved locally. Nothing extra is sent anywhere.'
          : '喺你部機上面用已經存咗喺本機嘅紀錄即時計算，唔會額外傳去任何地方。'}
      </p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-sunken border border-line rounded-xl px-3 py-3">
      <div className="text-[11px] text-ink-muted mb-0.5">{label}</div>
      <div className="text-base font-medium text-ink tabular-nums">{value}</div>
    </div>
  )
}
