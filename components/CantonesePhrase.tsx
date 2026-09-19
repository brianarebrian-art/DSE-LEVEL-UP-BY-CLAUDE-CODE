'use client'

import { useT } from '@/lib/i18n'
import type { Phrase } from '@/data/cantonese'

// 一句四欄對照（廣東話／粵拼／普通話／English）＋ 溝通目的。
//
// ⚠️ 呢個組件【刻意抽出嚟】：列表卡同場景詳情頁都要出同一組句，兩邊各寫
//    一份 markup 遲早會分叉，而分叉嗰日冇人會知 —— 例如有一邊改咗粵拼嘅
//    字級或者間距，另一邊冇跟，兩版嘅同一句就變咗兩個樣。
//
// 兩邊唯一嘅分別係 `showNote`：
//   · 列表卡 false —— 十二張卡 × 每句一段文化提示，一屏根本睇唔晒
//   · 詳情頁  true  —— 「深入了解」要真係多啲嘢，否則個掣係講大話
//
// ⚠️ 本組件【唔做】簽名判斷。佢淨係「有人叫我出，我就出」——
//    閘喺呼叫方（CantoneseTopicCard／SceneView），由 REVIEW.reviewer 推導。
//    將閘放喺呢度嘅話，兩個呼叫方都會以為對方做咗。

export default function CantonesePhrase({
  p,
  en,
  showNote,
}: {
  p: Phrase
  en: boolean
  /** 出唔出文化提示。列表卡 false、場景詳情頁 true。 */
  showNote: boolean
}) {
  const t = useT()
  const note = en ? p.noteEn : p.noteZh

  return (
    <>
      <p className="mb-1 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-muted">
        {t.cantonese.purposes[p.purpose]}
      </p>
      {/* 粵拼【另起一行】，唔同廣東話並排。短詞（「打包」）並排睇落冇事，
          而家啲句長到十幾個音節，並排就會喺窄機斷行斷到粵拼插入咗廣東話
          中間，逐個音節對唔返邊個字。 */}
      <p className="text-base font-medium leading-relaxed text-ink">{p.canto}</p>
      <p className="mt-0.5 font-mono text-xs leading-relaxed tracking-tight text-accent">
        {p.jyut}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.putong}</p>
      <p className="text-sm leading-relaxed text-ink-muted">{p.en}</p>
      {/* 註解用 text-ink-muted 而唔係最淡嗰階 —— 最淡嗰階喺兩個主題嘅對比係
          2.36–2.91，遠低過 AA 4.5。呢啲係學生真係要讀嘅文化提示，唔係裝飾字。
          token-contrast 測試 ⑤ 捉返過一次。 */}
      {showNote && note && (
        <p className="mt-1.5 border-l-2 border-line pl-2.5 text-xs leading-relaxed text-ink-muted">
          {note}
        </p>
      )}
    </>
  )
}
