'use client'

import { useEffect, useState } from 'react'
import { CalendarHeart } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { getRestDays, setRestDays, hkWeekday, WEEKDAY_LABELS, type Weekday } from '@/lib/restDay'

// 休息日護盾嘅設定介面（/account）。
//
// ══ 點解擺喺 /account 而唔係無障礙面板 ══
// 無障礙面板係「而家做緊題，即刻要調」嗰類控制（字級、動態、專注燈）。
// 「每星期邊日休息」係一個坐低諗完先揀嘅決定，唔屬於同一類。
//
// ══ 文案紅線（憲章 §7 ＋ §8）══
// ✗ 唔可以出「你已經連續 N 日冇休息」—— 嗰個係 streak 掉轉講一次
// ✗ 唔可以出「建議你揀 X 日」—— 平台冇資格判斷邊日啱邊個學生
// ✗ 揀咗之後唔可以出「已鎖定」呢類字眼 —— 佢由頭到尾都唔係一個鎖
// ✓ 只講一件事：嗰日 dashboard 會轉成放鬆文案，而你照樣入得去做題

const ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0] // 一 → 日（香港日曆習慣）

export default function RestDayPicker() {
  const { locale } = useLocale()
  const en = locale === 'en'
  // SSR 同第一格 client render 都當冇揀 —— 讀 localStorage 要等 mount，
  // 否則 hydration 會對唔上（同 JustOneCard 一樣嘅處理）。
  const [days, setDays] = useState<Weekday[]>([])
  const [today, setToday] = useState<Weekday | null>(null)

  useEffect(() => {
    setDays(getRestDays())
    setToday(hkWeekday())
  }, [])

  const toggle = (d: Weekday) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort()
    setDays(setRestDays(next))
  }

  return (
    <section className="bg-surface-raised border border-line rounded-2xl p-6">
      <h2 className="text-base font-bold text-ink mb-1 flex items-center gap-2">
        <CalendarHeart size={16} className="text-accent shrink-0" aria-hidden />
        {en ? 'Rest days' : '休息日'}
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed mb-4">
        {en
          ? 'Pick the days you plan to rest. On those days your dashboard stops suggesting questions. Nothing is locked — you can still practise whenever you want.'
          : '揀定你打算休息嘅日子。嗰幾日，dashboard 唔會再推題畀你。冇任何嘢會被鎖 —— 你想做題，照樣入得去。'}
      </p>

      <div role="group" aria-label={en ? 'Rest days of the week' : '每星期休息日'} className="flex flex-wrap gap-2">
        {ORDER.map((d) => {
          const on = days.includes(d)
          const lbl = WEEKDAY_LABELS[d]
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              aria-pressed={on}
              // aria-label 用長名：讀屏聽到「一」「二」係冇意思嘅
              aria-label={en ? lbl.enLong : lbl.zhLong}
              className={`min-h-11 min-w-11 px-3 rounded-xl border text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                on
                  ? 'bg-surface-sunken border-accent/50 text-accent'
                  : 'bg-surface border-line-strong text-ink-soft hover:bg-surface-sunken'
              }`}
            >
              {en ? lbl.enLong.slice(0, 3) : lbl.zh}
              {today === d && (
                <span className="block text-[10px] text-ink-muted font-normal">{en ? 'today' : '今日'}</span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-ink-muted mt-3 leading-relaxed">
        {/* 講明存喺邊 —— 同 /account 其餘部分（導出／導入、實際存咗乜、刪除）
            嘅取態一致：唔靠「我哋承諾」，直接講個機制。 */}
        {en
          ? 'Saved on this device only — never uploaded. A day runs 4am to 4am Hong Kong time, same as everything else here.'
          : '只存喺呢部機，唔會上傳。一日由香港時間凌晨 4 點計到下一個 4 點，同站內其他功能一致。'}
      </p>
    </section>
  )
}
