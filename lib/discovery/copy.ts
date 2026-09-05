'use client'

// 發現引擎文案字典（BUILD-SPEC §5）
//
// 範圍：**發現引擎自己嘅文案**。規格 §5 寫「所有文案集中喺呢度，唔准喺
// component 入面寫死中文字」—— 全站搬過嚟係一個獨立嘅大工程（實測全站
// 184 個檔有中文字串），唔屬 W1。W1 先立好呢個檔同個閘，新寫嘅文案由第一日
// 就喺呢度，唔使日後再搬一次。
//
// 對照表由 BUILD-SPEC §5.2 而嚟，同憲章 §7「大愛設計紅線」同源：
//   答錯       → 唔講「答錯咗」，講「你發現咗一個新盲點」
//   長題唔齊   → 唔講「你漏咗 3 個得分點」，講「你發現咗 2 個可以補嘅位」
//   一節結束   → 唔講「你答啱 6/10」，講「今日你發現咗 3 樣嘢」
//   冇做題     → 乜都唔顯示
import type { Dimension } from './types'
import { DIMENSION_BY_ID } from './dimensions'

// ⚠️ 只放【而家真係用緊】嘅字串。
// 規格 W2（反思閘畫面）同 W3（具名步驟）嘅文案唔喺呢度 —— 嗰兩個畫面未起，
// 預先擺定文案就係養一批冇人 render 嘅字，同 integration-guard 守嘅
// 「孤兒模組」係同一個問題，只係粒度細啲。起到嗰陣先加。
export const DISCOVERY_COPY = {
  /** 發現卡（/result 一節結尾） */
  cardTitle: (n: number) => ({
    zh: `今日你發現咗 ${n} 樣嘢`,
    en: `You found ${n} thing${n === 1 ? '' : 's'} today`,
  }),
  cardAttempted: (n: number) => ({ zh: `你今日做咗 ${n} 題。`, en: `You worked through ${n} questions.` }),
  cardEmpty: {
    zh: '今日冇記低新發現 —— 順手做完幾題，本身已經係一件事。',
    en: 'Nothing new logged today — working through the questions is already something.',
  },
  cardSave: { zh: '儲落發現簿', en: 'Save to my notebook' },
  cardShare: { zh: '分享張卡', en: 'Share this card' },
} as const

/** 某個維度嘅可讀短名（發現簿標籤用）。 */
export function dimensionShort(d: Dimension, en: boolean): string {
  const def = DIMENSION_BY_ID[d]
  return en ? def.shortEn : def.short
}

/**
 * 具名階段嘅系統建議。
 *
 * BUILD-SPEC §2.3 步驟 4 話建議由 `skills_tested` 嚟 —— 呢個欄位【唔存在】
 * （全 repo 零命中，2026-09-05 實測）。Brian 2026-09-05 裁決 W4 降級，
 * 唔為咗呢個功能擴 schema，所以建議改由【課題名 ＋ 維度】砌。
 *
 * 呢個唔係將就：一個學生自己睇返「二次方程 · 審題陷阱」，其實已經夠佢想返
 * 起嗰條題。真正嘅個人化喺第三個選項「自己寫」度發生。
 */
export function nameSuggestions(topicLabel: string, d: Dimension, en: boolean): string[] {
  const short = dimensionShort(d, en)
  return en
    ? [`${topicLabel} — ${short.toLowerCase()}`, `I need to redo ${topicLabel}`]
    : [`${topicLabel} · ${short}`, `${topicLabel} 我要重做一次`]
}
