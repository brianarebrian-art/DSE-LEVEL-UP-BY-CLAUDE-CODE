'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sprout } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { loadAttempts } from '@/lib/progress'
import { getSubject } from '@/data/subjects'

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

  useEffect(() => {
    const attempts = loadAttempts()
    const last = attempts[attempts.length - 1]
    if (last?.subjectId) setSubjectId(last.subjectId)
  }, [])

  const meta = getSubject(subjectId)
  const subjectName = meta ? (en ? (meta.nameEn ?? meta.name) : meta.name) : null

  return (
    <div
      className={`bg-white border border-black/[0.06] rounded-2xl p-6 flex flex-col gap-4 ${
        stack ? '' : 'sm:flex-row sm:items-center'
      } ${className}`}
    >
      <div className="flex items-start gap-3 flex-1">
        <Sprout size={20} className="text-[#008B84] shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-[#1A1A1A] font-medium mb-1">
            {en ? 'Only got it in you for one? That works.' : '今日只做 1 題都得。'}
          </p>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            {en
              ? 'No timer pressure, no score, no streak. Just one question — then stop whenever you want.'
              : '冇計分、冇壓力。做 1 題就得，之後想幾時收工都得。'}
          </p>
        </div>
      </div>
      <Link
        href={`/practice?subject=${encodeURIComponent(subjectId)}&size=1`}
        className="shrink-0 min-h-11 inline-flex items-center justify-center bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-5 py-3 rounded-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#008B84]"
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
