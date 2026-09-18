import { TextQuestionCard } from 'dse-level-up'

// 文字題（短答／填充）。**HONESTY RULE：平台一分都唔出。**
// 學生交卷之後見到參考答案，自己對照自評，結果經 onResult 交返上層記錄。
// 憲章 §16.A：機器只為 `mc` 出對錯，`text` 同 `long` 永不機器批改 ——
// 所以呢張卡入面冇「你啱咗／錯咗」，只有「參考答案」同學生自己撳嘅自評。

const q = {
  id: 'ec_text_demo',
  type: 'text' as const,
  subject: 'economics',
  topic: 'price-ceiling',
  topicZh: '價格上限',
  topicEn: 'Price ceiling',
  framework: 'market-intervention',
  frameworkZh: '市場干預',
  frameworkEn: 'Market intervention',
  frameworkEmoji: '⚖️',
  difficulty: 'medium' as const,
  year: 2026,
  content: '政府將某類住宅的租金上限設於市場均衡水平以下。試指出該市場最可能出現的一項後果，並說明其形成過程。',
  contentEn:
    'The government sets a rent ceiling below the equilibrium level. State one likely consequence in that market and explain how it arises.',
  referenceAnswer:
    '出現短缺。租金被壓低於均衡水平後，需求量上升而供給量下降，兩者之差即為短缺；供給在短期內缺乏彈性，故短缺會持續。',
  referenceAnswerEn:
    'A shortage arises. Below equilibrium, quantity demanded rises while quantity supplied falls; the gap is the shortage, and inelastic short-run supply keeps it persistent.',
  explanation: '本題考核的是干預後的調整過程，而非單純記憶「價格上限造成短缺」這一結論。',
  marks: 4,
}

export function Unanswered() {
  return (
    <div className="max-w-lg">
      <TextQuestionCard q={q} />
    </div>
  )
}

// 第二格刻意換另一條題，唔係同一條加個 callback —— 兩格一模一樣嘅話
// 個 render check 會報 variantsIdentical，而且對睇卡嘅人零資訊。
const mathQ = {
  ...q,
  id: 'ma_text_demo',
  subject: 'math',
  topicZh: '二次方程',
  topicEn: 'Quadratic equations',
  frameworkZh: '代數推理',
  frameworkEmoji: '📐',
  difficulty: 'hard' as const,
  content: '已知 $x^2 + kx + 9 = 0$ 有兩個相等的實根，求 $k$ 的所有可能值，並說明理由。',
  referenceAnswer: '判別式為零：$k^2 - 36 = 0$，故 $k = 6$ 或 $k = -6$。兩個值都要寫出，只寫一個屬不完整。',
  explanation: '本題考核判別式與根的數目的對應關係，並要求學生意識到平方根有正負兩解。',
  marks: 3,
}

export function WithMath() {
  // 題幹入面嘅 $…$ 由 MathText 渲染 —— 短答題一樣行得通。
  return (
    <div className="max-w-lg">
      <TextQuestionCard q={mathQ} onResult={() => {}} />
    </div>
  )
}
