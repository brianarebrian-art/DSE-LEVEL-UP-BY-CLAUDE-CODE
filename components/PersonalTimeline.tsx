'use client'

// 個人進度時間軸（第 3 週 · 引擎二之二）
//
// 規格書 §4.8。三條約束喺呢度執行：
//   1. 【唯一比較對象係你自己嘅上一段時間】—— 冇他人數據，亦冇得有（見 lib）
//   2. 【數字跌咗唔可以讀成失敗】—— 差額用中性符號同中性顏色，
//      冇「進步／退步」字眼、冇紅色、冇向下嘅箭嘴配警示色
//   3. 【兩段時間都空白就唔顯示】—— 一版 0 讀落係「你乜都冇做過」
//
// 「Mock 前倒數」（規格書 §4.8 第三行）刻意冇做：全站已經有 CountdownBanner
// 顯示緊距離 DSE 嘅日數，喺呢度再擺一個倒數 = 同一件事壓兩次。

import { useEffect, useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { compare, isBlank, type TimelineComparison } from '@/lib/personalTimeline'

function Delta({ now, before }: { now: number; before: number }) {
  const d = now - before
  // 中性呈現：只講「多咗／少咗幾多」，唔講好定唔好。
  // 顏色兩邊一致（都係 ink-muted）—— 用綠／紅分好壞就係喺度做判斷。
  const sign = d > 0 ? '+' : d < 0 ? '−' : '±'
  return (
    <span className="text-[11px] text-ink-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {sign}
      {Math.abs(d)}
    </span>
  )
}

function Row({
  label,
  now,
  before,
}: {
  label: string
  now: number
  before: number
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-line last:border-b-0">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className="text-sm text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {now}
        </span>
        <span className="text-[11px] text-ink-faint" style={{ fontVariantNumeric: 'tabular-nums' }}>
          ← {before}
        </span>
        <Delta now={now} before={before} />
      </span>
    </div>
  )
}

export default function PersonalTimeline() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [week, setWeek] = useState<TimelineComparison | null>(null)
  const [month, setMonth] = useState<TimelineComparison | null>(null)

  useEffect(() => {
    setWeek(compare('week'))
    setMonth(compare('month'))
  }, [])

  if (!week || !month) return null
  if (isBlank(week) && isBlank(month)) return null

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-2.5 mb-1">
        <CalendarRange size={18} aria-hidden className="text-accent shrink-0" />
        <h2 className="text-lg font-medium text-ink">{en ? 'Your own timeline' : '你自己嘅時間軸'}</h2>
      </div>
      <p className="text-xs text-ink-muted mb-5 leading-relaxed">
        {en
          ? 'Only ever compared with your own previous stretch. A smaller number is not a worse you — exam weeks, sick days and family matters all live in here too.'
          : '永遠只同你自己上一段時間比。數字細咗唔等於你差咗 —— 考試週、病咗、屋企有事，全部都住喺呢啲數入面。'}
      </p>

      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <h3 className="text-xs font-medium text-ink-soft mb-1">
            {en ? 'This week ← last week' : '今個星期 ← 上星期'}
          </h3>
          <Row label={en ? 'Questions' : '做咗嘅題數'} now={week.current.questions} before={week.previous.questions} />
          <Row label={en ? 'Reviews done' : '完成重溫'} now={week.current.reviews} before={week.previous.reviews} />
          <Row label={en ? 'Days practised' : '有練習嘅日數'} now={week.current.activeDays} before={week.previous.activeDays} />
        </div>
        <div>
          <h3 className="text-xs font-medium text-ink-soft mb-1">
            {en ? 'This month ← last month' : '今個月 ← 上個月'}
          </h3>
          <Row label={en ? 'Questions' : '做咗嘅題數'} now={month.current.questions} before={month.previous.questions} />
          <Row label={en ? 'Reviews done' : '完成重溫'} now={month.current.reviews} before={month.previous.reviews} />
          <Row label={en ? 'Days practised' : '有練習嘅日數'} now={month.current.activeDays} before={month.previous.activeDays} />
        </div>
      </div>
    </div>
  )
}
