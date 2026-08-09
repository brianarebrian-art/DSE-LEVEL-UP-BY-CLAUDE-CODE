'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'

// 逐步拆解（#54）。UDL 目的：唔好一答完就成段答案掟出嚟 —— 學生會養成「睇答案」
// 而唔係「諗答案」。畀個開頭，逼多諗一步，唔夠先揭全部。
//
// ── 為何唔做「第一步／第二步」自動切分 ────────────────────────────────────
// 原建議係「只看第一步 → 再看一步 → 全解」。實測現行題庫做唔到：math 914 條
// explanation 之中，含換行 0、含編號步驟 0。按句號斬開再標「第一步」，句子邊界
// 同解題步驟根本唔對應 —— 咁樣係整個假結構出嚟呃學生，比冇呢個功能更差。
//
// 所以分兩條路：
//   有 `steps`（新出題目可提供）→ 真・逐步，逐個揭，標題用「下一步」
//   冇 `steps`（現行全部題目）  → 只揭首句作提示，措辭係「先睇個開頭」，
//                                 全程唔會出現「第 N 步」呢類假承諾
//
// 另設一個永久開關：學生揀咗「唔使收埋，直接畀我睇晒」之後就記住，唔會每題再問。
// 呢個係無障礙考量 —— 對部分 SEN 學生，多一層互動本身就係障礙。

const KEY_ALWAYS_FULL = 'dse_explain_always_full'

// 提示句最短長度。短過呢個就當切錯，退回全文。
const MIN_HINT = 10

/**
 * 取首句作提示。切唔到、或者切出嚟太短，就退回全文（寧願唔分段，唔好切爛句子）。
 *
 * ⚠️ 中英標點要分開處理：中文句號後面【冇空格】，所以全形標點唔可以要求後隨
 * 空白（初版寫成 `[。！？.!?](?=\s|$)`，實測全部中文解析配對失敗，提示模式等於
 * 冇生效）。半形點號保留 lookahead 擋住 `2.5` 呢類小數。
 *
 * lookahead 擋唔到嘅係英文縮寫（`See Fig. 3 below.` 會切成 `See Fig.`）——
 * 要靠一張縮寫表先分得清，唔值得為此加一份維護負擔。改為用 MIN_HINT 兜底：
 * 切出嚟太短就當切錯，直接出全文。實測 `See Fig.`（8 字元）已被擋住。
 */
function firstSentence(text: string): string | null {
  const m = text.match(/^[\s\S]*?(?:[。！？]|[.!?](?=\s|$))/) // i18n-exempt: 句末標點字符集，非文案
  const head = m?.[0]?.trim()
  if (!head || head.length < MIN_HINT || head.length >= text.trim().length) return null
  return head
}

export default function StagedExplanation({
  text,
  steps,
  label,
}: {
  /** 完整解析（已按語言選好）。 */
  text: string
  /** 真步驟（已按語言選好）。冇就走提示模式。 */
  steps?: string[]
  /** 上方標籤，例如「正解思路：」。由呼叫方提供，保留原有語氣。 */
  label?: React.ReactNode
}) {
  const { locale } = useLocale()
  const en = locale === 'en'

  const hasSteps = !!steps && steps.length > 1
  const hint = hasSteps ? null : firstSentence(text)

  const [alwaysFull, setAlwaysFull] = useState(false)
  const [shown, setShown] = useState(1) // 已揭步數（steps 模式）
  const [full, setFull] = useState(false) // 已揭全部（提示模式）

  useEffect(() => {
    setAlwaysFull(localStorage.getItem(KEY_ALWAYS_FULL) === '1')
  }, [])

  // 換題時重置。
  useEffect(() => {
    setShown(1)
    setFull(false)
  }, [text])

  const optOut = () => {
    setAlwaysFull(true)
    try {
      localStorage.setItem(KEY_ALWAYS_FULL, '1')
    } catch {
      /* 私隱模式寫唔到就當今次生效 */
    }
  }

  // 冇分段可言（冇 steps 又搵唔到首句），或者學生已選擇一律睇全部 → 直接出全文。
  if (alwaysFull || (!hasSteps && !hint)) {
    return (
      <div className="text-sm leading-relaxed text-ink-soft">
        {label}
        <MathText>{text}</MathText>
      </div>
    )
  }

  if (hasSteps) {
    const done = shown >= steps.length
    return (
      <div className="text-sm leading-relaxed text-ink-soft">
        {label}
        <ol className="mt-1 space-y-2">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-xs font-medium text-gold">{i + 1}.</span>
              <MathText>{s}</MathText>
            </li>
          ))}
        </ol>
        {!done && (
          <button
            onClick={() => setShown((n) => n + 1)}
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 text-xs font-medium text-accent transition-colors hover:bg-accent/15"
          >
            {en ? `Next step (${shown}/${steps.length})` : `下一步（${shown}/${steps.length}）`}
            <ChevronDown size={13} aria-hidden />
          </button>
        )}
      </div>
    )
  }

  // 提示模式：先出首句，再由學生決定揭唔揭全部。
  return (
    <div className="text-sm leading-relaxed text-ink-soft">
      {label}
      <MathText>{full ? text : (hint as string)}</MathText>
      {!full && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFull(true)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 text-xs font-medium text-accent transition-colors hover:bg-accent/15"
          >
            {en ? 'Show the rest' : '睇埋成個解析'}
            <ChevronDown size={13} aria-hidden />
          </button>
          <button
            onClick={optOut}
            className="min-h-11 text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink-soft"
          >
            {en ? 'Always show me everything' : '以後唔好收埋，直接畀我睇晒'}
          </button>
        </div>
      )}
    </div>
  )
}
