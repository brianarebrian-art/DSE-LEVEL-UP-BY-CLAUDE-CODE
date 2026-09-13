'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sprout, CalendarHeart } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { loadAttempts } from '@/lib/progress'
import { getSubject } from '@/data/subjects'
import { isRestDayToday } from '@/lib/restDay'

// C6「只做 1 題」入口（Emma/UDL + Sarah）。
//
// 服務對象：低動機、抑鬱、或者見到「20 題」就即刻閂 app 嘅學生。
// 設計取態 —— 呢張卡唯一嘅工作係【拆低門檻】，所以：
//   ✗ 冇連續日數、冇進度條、冇「你上次做到 X%」（會變成另一種壓力）
//   ✗ 冇 streak／解鎖／獎勵（憲章 §2 禁 gamification）
//   ✗ 唔顯示佢有幾耐冇做過 —— 隔咗好耐先返嚟嗰個，正正最唔想被提醒
//   ✓ 一撳直接入題，唔使揀科（沿用佢最近做過嗰科，冇記錄就用預設）
//
// 科目取自真實作答記錄（localStorage），零虛構數據。
//
// ══ 休息日護盾（2026-09-13）══
// 學生喺 /account 揀咗嘅休息日當日，呢張卡轉成放鬆文案，唔再推題。
//   ✓ 底下仍然有一條「今日想做少少都得」嘅細連結 —— 唔係鎖（Emma/UDL
//     2026-07-16 就「今晚唔溫得」嘅裁決：❌ 真・鎖，✅ 增加摩擦）
//   ✗ 唔會記低佢有冇喺休息日做題、唔會下次提返佢 —— 一記低就係 streak 掉轉
//   ✗ 唔會出「你今日應該休息」嘅命令式語氣 —— 呢日係佢自己揀嘅，唔使平台教
//
// 休息日狀態讀 localStorage，所以同 subjectId 一樣要等 mount 先讀（hydration）。

const FALLBACK_SUBJECT = 'math'

export default function JustOneCard({
  className = '',
  stack = false,
}: {
  className?: string
  /** 窄容器（如 dashboard 空狀態嘅 max-w-md）用 —— 橫排會迫到文字欄剩返一條。 */
  stack?: boolean
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  // 開頭一律用 fallback，等 client mount 後先讀 localStorage —— 避免 hydration 落差
  const [subjectId, setSubjectId] = useState(FALLBACK_SUBJECT)
  const [resting, setResting] = useState(false)

  useEffect(() => {
    const attempts = loadAttempts()
    const last = attempts[attempts.length - 1]
    if (last?.subjectId) setSubjectId(last.subjectId)
  }, [])

  // /account 個 picker 改完會派 dse-rest-day —— 同一版開住兩個 tab 嗰陣
  // 唔使 reload 就跟到。
  useEffect(() => {
    const read = () => setResting(isRestDayToday())
    read()
    window.addEventListener('dse-rest-day', read)
    return () => window.removeEventListener('dse-rest-day', read)
  }, [])

  const meta = getSubject(subjectId)
  const subjectName = meta ? (en ? (meta.nameEn ?? meta.name) : meta.name) : null

  if (resting) {
    return (
      <div
        className={`bg-surface-raised border border-line rounded-2xl p-6 flex flex-col gap-4 ${
          stack ? '' : 'sm:flex-row sm:items-center'
        } ${className}`}
      >
        <div className="flex items-start gap-3 flex-1">
          <CalendarHeart size={20} className="text-accent shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-ink font-medium mb-1">
              {en ? 'Today is one of your rest days.' : '今日係你自己揀咗嘅休息日。'}
            </p>
            <p className="text-sm text-ink-muted leading-relaxed">
              {en
                ? 'Nothing is waiting for you here. Rest is part of the plan, not a gap in it.'
                : '呢度冇嘢等緊你。休息本身就係計劃嘅一部分，唔係一個缺口。'}
            </p>
            {/* 唔係鎖 —— 想做嘅話一條細連結就入到，撳落去乜都唔會記低。 */}
            <Link
              href={`/practice?subject=${encodeURIComponent(subjectId)}&size=1`}
              className="inline-block mt-2 text-xs text-ink-muted underline underline-offset-2 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {en ? 'I still feel like doing one' : '今日想做少少都得'}
            </Link>
          </div>
        </div>
        <Link
          href="/relax"
          className="shrink-0 min-h-11 inline-flex items-center justify-center border border-line-strong text-ink-soft font-medium px-5 py-3 rounded-xl hover:bg-surface-sunken transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {en ? 'Breathing Space' : '去呼吸空間'}
        </Link>
      </div>
    )
  }

  return (
    <div
      className={`bg-surface-raised border border-line rounded-2xl p-6 flex flex-col gap-4 ${
        stack ? '' : 'sm:flex-row sm:items-center'
      } ${className}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <Sprout size={20} className="text-accent shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-ink font-medium mb-1">
            {en ? 'Only got it in you for one? That works.' : '今日只做 1 題都得。'}
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            {en
              ? 'No timer pressure, no score, no streak. Just one question — then stop whenever you want.'
              : '冇計分、冇壓力。做 1 題就得，之後想幾時收工都得。'}
          </p>
        </div>
      </div>
      <Link
        href={`/practice?subject=${encodeURIComponent(subjectId)}&size=1`}
        className="shrink-0 min-h-11 inline-flex items-center justify-center bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-5 py-3 rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {subjectName
          ? en
            ? `Do one ${subjectName} question`
            : `做 1 題${subjectName}`
          : en
            ? 'Do one question'
            : '做 1 題'}
      </Link>
    </div>
  )
}
