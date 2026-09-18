import { ReviewScheduler } from 'dse-level-up'

// 遺忘曲線重溫排程（1／3／7／14／30 日）。排程邏輯喺 lib/reviewSchedule，
// 同「溫柔每日建議」共用同一套間隔 —— 兩邊各寫一次遲早會漂走。
// 資料源係錯因日誌，所以下面造咗幾條唔同日子嘅錯題。

const day = 86_400_000

function entry(topic: string, daysAgo: number, cause: 'A' | 'B' | 'C') {
  return {
    subjectId: 'economics',
    questionId: `econ_rev_${daysAgo}`,
    topic,
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
    localStorage.removeItem('dse_review_done')
  } catch {
    /* 封鎖咗 storage 就 render 空狀態 */
  }
}

export function DueToday() {
  seed([entry('共用品', 1, 'A'), entry('價格上限', 3, 'B'), entry('彈性計算', 7, 'C')])
  return (
    <div className="max-w-lg">
      <ReviewScheduler />
    </div>
  )
}
