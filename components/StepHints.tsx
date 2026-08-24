'use client'

// 分步提示（第 3 週 · 引擎五之三）
//
// 規格書 §4.7。呢個組件【冇】以下嘢，係刻意，唔係漏做：
//   • 冇 textarea、冇提交、冇比對 —— 佢由頭到尾唔會睇學生寫咗乜
//   • 冇次數、冇代價、冇「用咗提示」嘅記錄
//   • 冇「下一步」以外嘅任何催促
//   • 冇答案 —— 每一步只係一句提問
//
// 憲章長答題自動批改永久禁令：呢度連「學生寫嘅嘢」都收唔到，
// 所以結構上做唔到自動評分，唔係靠自律。

import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { ladderFor, stepsFor } from '@/lib/stepHints'

export default function StepHints({ subjectId }: { subjectId: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const steps = stepsFor(ladderFor(subjectId))
  /** 已解鎖幾多步。0 = 未開始 —— 學生要主動撳先有第一步。 */
  const [opened, setOpened] = useState(0)

  if (opened === 0) {
    return (
      <button
        onClick={() => setOpened(1)}
        className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-gold transition-colors"
      >
        <HelpCircle size={14} aria-hidden />
        {en ? 'Need a nudge? (no cost, skip anytime)' : '需要提示？（無消耗，隨時可以跳過）'}
      </button>
    )
  }

  return (
    <div className="border border-gold/25 bg-gold/[0.05] rounded-xl p-4">
      <p className="text-[11px] text-ink-muted mb-3 leading-relaxed">
        {en
          ? 'Each step is a question for you, not an answer. Nothing here is marked, and stopping costs nothing.'
          : '每一步都係一條問你嘅問題，唔係答案。呢度冇任何嘢會被批改，幾時停都冇代價。'}
      </p>

      <ol className="space-y-3">
        {steps.slice(0, opened).map((s, i) => (
          <li key={i} className="blindspot-in flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-md bg-gold/15 text-gold text-[11px] font-medium flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-ink">{en ? s.en : s.zh}</span>
              <span className="block text-xs text-ink-soft mt-0.5 leading-relaxed">
                {en ? s.promptEn : s.promptZh}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {opened < steps.length ? (
        <button
          onClick={() => setOpened((n) => n + 1)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
        >
          <ChevronDown size={14} aria-hidden />
          {en ? 'Next step' : '下一步'}
        </button>
      ) : (
        <p className="mt-4 text-[11px] text-ink-muted">
          {en
            ? 'That is the whole ladder. Your working is yours — compare it with the model answer below and judge it yourself.'
            : '成條階梯就係咁多。你寫嘅嘢係你嘅 —— 對住下面嘅參考答案，自己評估。'}
        </p>
      )}
    </div>
  )
}
