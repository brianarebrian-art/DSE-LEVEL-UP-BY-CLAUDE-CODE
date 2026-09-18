import { ErrorRadar } from 'dse-level-up'

// 錯題 DNA 雷達 —— 純 SVG 三軸（A 概念盲區／B 審題陷阱／C 運算粗心），
// 數據係最近 30 日嘅錯因日誌。三軸沿用全站現有分類，冇另起爐灶，
// 否則同已記錄嘅數據會脫節。

const day = 86_400_000

function entry(cause: 'A' | 'B' | 'C', daysAgo: number) {
  return {
    subjectId: 'economics',
    questionId: `econ_radar_${cause}_${daysAgo}`,
    topic: '供求分析',
    topicId: 'demand-supply',
    cause,
    selected: '需求量上升',
    correct: '需求下降',
    ts: Date.now() - daysAgo * day,
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

export function Balanced() {
  seed([entry('A', 1), entry('A', 4), entry('B', 6), entry('B', 9), entry('C', 12), entry('C', 20)])
  return (
    <div className="max-w-sm">
      <ErrorRadar />
    </div>
  )
}

export function ConceptDominant() {
  seed([entry('A', 1), entry('A', 2), entry('A', 5), entry('A', 11), entry('B', 15), entry('C', 26)])
  return (
    <div className="max-w-sm">
      <ErrorRadar />
    </div>
  )
}
