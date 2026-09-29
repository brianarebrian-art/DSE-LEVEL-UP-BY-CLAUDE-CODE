'use client'

import { useState } from 'react'
import TextQuestionCard from '@/components/TextQuestionCard'
import LongQuestionCard from '@/components/LongQuestionCard'
import OptionNotes from '@/components/OptionNotes'
import { displayOptions } from '@/lib/optionNotes'
import type { LongQuestion, OptionNote, TextQuestion } from '@/data/questions/types'

// 樣本題目 —— 【純預覽用，唔會、亦唔可以入題庫】。id 前綴 `_preview_` 就係
// 提醒：任何真正入庫嘅題目都必須行 drafts → 客觀閘 → 真人逐題批 → promote 管線。
const sampleText: TextQuestion = {
  id: '_preview_text',
  type: 'text',
  subject: 'math',
  topic: 'quadratic_equations',
  topicZh: '二次方程',
  topicEn: 'Quadratic Equations',
  framework: 'preview',
  frameworkZh: '樣本',
  frameworkEn: 'Sample',
  frameworkEmoji: '🧪',
  difficulty: 'easy',
  year: 0,
  content: '寫出二次方程 $ax^2+bx+c=0$（其中 $a \\neq 0$）的判別式。',
  contentEn: 'Write down the discriminant of the quadratic equation $ax^2+bx+c=0$ (where $a \\neq 0$).',
  referenceAnswer: '$b^2-4ac$',
  referenceAnswerEn: '$b^2-4ac$',
  explanation: '判別式決定實根數目：大於零有兩個相異實根，等於零有一個重根，小於零則無實根。',
  explanationEn:
    'The discriminant determines the number of real roots: positive gives two distinct real roots, zero gives a repeated root, negative gives none.',
  marks: 1,
}

const sampleLong: LongQuestion = {
  id: '_preview_long',
  type: 'long',
  subject: 'math',
  topic: 'quadratic_equations',
  topicZh: '二次方程',
  topicEn: 'Quadratic Equations',
  framework: 'preview',
  frameworkZh: '樣本',
  frameworkEn: 'Sample',
  frameworkEmoji: '🧪',
  difficulty: 'hard',
  year: 0,
  content:
    '已知二次方程 $x^2-5x+6=0$ 的兩根為 $\\alpha$ 與 $\\beta$。求 $\\alpha+\\beta$ 及 $\\alpha\\beta$ 的值，並說明兩者與方程係數的關係。',
  contentEn:
    'The roots of $x^2-5x+6=0$ are $\\alpha$ and $\\beta$. Find $\\alpha+\\beta$ and $\\alpha\\beta$, and explain how each relates to the coefficients.',
  referenceAnswer:
    '$\\alpha+\\beta=5$，$\\alpha\\beta=6$。由韋達定理，兩根之和等於 $-b/a$，兩根之積等於 $c/a$；本題 $a=1$、$b=-5$、$c=6$，故和為 $5$、積為 $6$。',
  referenceAnswerEn:
    '$\\alpha+\\beta=5$ and $\\alpha\\beta=6$. By Vieta’s formulas the sum of roots is $-b/a$ and the product is $c/a$; here $a=1$, $b=-5$, $c=6$.',
  markingScheme: 'M1 引用韋達定理；A1 求得和為 $5$；A1 求得積為 $6$；L1 說明與係數 $a$、$b$、$c$ 的對應關係。',
  markingSchemeEn:
    'M1 cite Vieta’s formulas; A1 sum $=5$; A1 product $=6$; L1 explain the link to coefficients $a$, $b$, $c$.',
  suggestedMinutes: 6,
  marks: 4,
}

// 選項解析樣本（2026-09-29）。數字取自回歸樣本 bafs_rep_0018（lib/__tests__/fixtures/），
// 解析以 optionId（儲存次序）掛在選項上。撳「重新洗牌」可見每條解析跟住自己的選項走。
const sampleOptions = ['\\$260', '\\$250', '\\$350', '\\$270']
const sampleNotes: OptionNote[] = [
  { optionId: 0, zh: '只計購貨，忽略了期初與期末存貨的變動。', en: 'Counts purchases only and ignores the change in inventory.' },
  { optionId: 1, zh: '正確：期初存貨 + 購貨 − 期末存貨 = 40 + 260 − 50。', en: 'Correct: opening inventory + purchases − closing inventory = 40 + 260 − 50.' },
  { optionId: 2, zh: '把期末存貨加上去，等於把未賣出的貨也算作成本。', en: 'Adds closing inventory, counting unsold goods as cost.' },
  { optionId: 3, zh: '把期初與期末存貨的加減調轉了。', en: 'Swaps opening and closing inventory.' },
]

export default function AnswerCardsPreview() {
  // First render uses a fixed order so the server and client HTML match; the button reshuffles.
  const [shown, setShown] = useState(() => displayOptions({ options: sampleOptions }, () => 0.5))
  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-medium mb-2">書寫題答題卡預覽{/* i18n-exempt: 開發專用頁，生產環境 404，不對外顯示 */}</h1>
        <p className="text-sm text-ink-muted mb-2 leading-relaxed">
          開發專用。樣本題目，不屬題庫。切換主題可同時檢查 Light／Cyber 兩套色。{/* i18n-exempt: 開發專用頁，生產環境 404 */}
        </p>
        <p className="text-sm text-ink-muted mb-10 leading-relaxed">
          兩張卡均【永不由機器批改】：提交後攤開參考答案（長題目另有評分準則），由學生自評。{/* i18n-exempt: 開發專用頁，生產環境 404 */}
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-medium text-ink-muted mb-3">TextQuestionCard{/* i18n-exempt: 組件名 */}</h2>
            <TextQuestionCard q={sampleText} />
          </section>

          <section>
            <h2 className="text-sm font-medium text-ink-muted mb-3">LongQuestionCard{/* i18n-exempt: 組件名 */}</h2>
            <LongQuestionCard q={sampleLong} />
          </section>

          <section>
            <h2 className="text-sm font-medium text-ink-muted mb-3">OptionNotes{/* i18n-exempt: 組件名 */}</h2>
            <button
              type="button"
              onClick={() => setShown(displayOptions({ options: sampleOptions }))}
              className="mb-3 min-h-11 rounded-lg border border-line px-3 text-sm text-ink-soft hover:border-accent/40"
            >
              重新洗牌{/* i18n-exempt: 開發專用頁，生產環境 404 */}
            </button>
            <div className="rounded-2xl border border-gold/30 bg-gold/[0.10] p-5">
              <OptionNotes notes={sampleNotes} options={shown} correctId={1} selectedZh={'\\$270'} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
