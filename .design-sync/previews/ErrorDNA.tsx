import { ErrorDNA } from 'dse-level-up'

// 錯因 DNA —— 學生自診嘅三維錯因分佈（A 概念盲區／B 審題陷阱／C 運算粗心）。
// 純本地，讀 `dse_reverse_log`。**AI-free**：所謂「診斷」只係一條對住最高錯因
// 嘅固定規則，唔係模型推斷 —— 呢點唔可以喺文案度講成智能分析（§16.D）。
// 三色用青／金／玫，刻意避開鮮紅（§7 唔用打擊自信嘅顏色）。

const hour = 3_600_000

function entry(cause: 'A' | 'B' | 'C', topic: string, hoursAgo: number) {
  return {
    subjectId: 'economics',
    questionId: `econ_demo_${cause}_${hoursAgo}`,
    topic,
    topicId: 'demand-supply',
    cause,
    selected: '需求量上升',
    correct: '需求下降',
    ts: Date.now() - hoursAgo * hour,
    difficulty: 'medium' as const,
  }
}

function seed(rows: unknown[]) {
  try {
    localStorage.setItem('dse_reverse_log', JSON.stringify(rows))
  } catch {
    /* 封鎖咗 storage 就 render 空狀態 */
  }
}

export function ConceptHeavy() {
  // 最高錯因係 A（概念盲區）—— 學生要返去睇框架，唔係做多啲題。
  seed([
    entry('A', '共用品', 2),
    entry('A', '市場失效', 5),
    entry('A', '彈性', 26),
    entry('B', '價格上限', 30),
    entry('C', '彈性計算', 50),
  ])
  return (
    <div className="max-w-lg">
      <ErrorDNA />
    </div>
  )
}

export function CarelessHeavy() {
  // 最高錯因係 C（運算粗心）—— 呢個係完全唔同嘅建議方向。
  seed([
    entry('C', '彈性計算', 1),
    entry('C', '邊際成本', 4),
    entry('C', '稅項計算', 20),
    entry('C', '複利', 44),
    entry('B', '審題', 60),
  ])
  return (
    <div className="max-w-lg">
      <ErrorDNA />
    </div>
  )
}
