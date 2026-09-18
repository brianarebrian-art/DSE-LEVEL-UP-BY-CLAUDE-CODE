import { LongQuestionCard } from 'dse-level-up'

// 長題／作文卡。**HONESTY RULE 同文字題一樣：平台一分都唔出。**
// 交卷之後出參考答案 ＋ 評分準則（可摺疊），學生自己三級自評
// （全明／部分明白／未明）。原始碼註釋明寫 Never auto-graded。
// 憲章 §16.A 已復現 20 次嘅提案就係想喺呢度加自動批改 —— 唔可以加。

const q = {
  id: 'ec_long_demo',
  type: 'long' as const,
  subject: 'economics',
  topic: 'market-failure',
  topicZh: '市場失效',
  topicEn: 'Market failure',
  framework: 'welfare-analysis',
  frameworkZh: '福利分析',
  frameworkEn: 'Welfare analysis',
  frameworkEmoji: '⚖️',
  difficulty: 'hard' as const,
  year: 2026,
  content:
    '政府考慮向排放二氧化硫的工廠徵收從量稅。試以外部成本的概念，解釋該稅項如何改變該行業的產量，並指出在何種情況下徵稅未必能提升社會福利。',
  referenceAnswer:
    '徵稅使私人邊際成本上移至接近社會邊際成本，產量由原先的市場均衡下降至較接近社會最適水平，無謂損失因而減少。但若稅率與外部成本不相稱，或監管與徵收成本高於所減少的外部成本，則社會福利未必上升。',
  markingScheme:
    '外部成本概念（2 分）／產量調整方向及機制（3 分）／福利未必上升的條件，須具體（3 分）。只寫結論而無推導不給機制分。',
  explanation: '本題考核的是推導過程與條件判斷，而非「徵稅可矯正外部性」這一結論本身。',
  marks: 8,
}

export function Unanswered() {
  return (
    <div className="max-w-lg">
      <LongQuestionCard q={q} />
    </div>
  )
}
