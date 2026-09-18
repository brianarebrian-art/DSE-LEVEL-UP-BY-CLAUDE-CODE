import { ProgressTrajectory } from 'dse-level-up'

// 精進軌跡。純 SVG，零圖表庫。數據 100% 由 localStorage 真實作答逐日聚合，
// **絕不虛構曲線**（§8 禁虛構統計）—— 少於 2 個活躍日就顯示溫和佔位，
// 唔會畫一條假嘅上升線去「鼓勵」學生。

const day = 86_400_000

function seed(days: number[]) {
  const rows = days.map((correct, i) => ({
    subjectId: 'economics',
    subjectName: '經濟',
    topicFilter: null,
    score: correct,
    total: 10,
    grade: '—',
    topicResults: [{ topic: '供求分析', correct, total: 10 }],
    elapsed: 10 * 95,
    timestamp: Date.now() - (days.length - i) * day,
    difficultyResults: {
      easy: { correct: Math.min(3, correct), total: 3 },
      medium: { correct: Math.max(0, Math.min(5, correct - 3)), total: 5 },
      hard: { correct: Math.max(0, correct - 8), total: 2 },
    },
  }))
  try {
    localStorage.setItem('dse_progress', JSON.stringify(rows))
  } catch {
    /* 封鎖咗 storage 就 render 佔位狀態 */
  }
}

export function TwoWeeks() {
  seed([5, 6, 6, 7, 6, 8, 7, 9, 8, 9])
  return (
    <div className="max-w-lg">
      <ProgressTrajectory />
    </div>
  )
}

export function NotEnoughDays() {
  // 得一個活躍日 —— 出溫和佔位，唔會畫一條兩點嘅「趨勢」。
  seed([7])
  return (
    <div className="max-w-lg">
      <ProgressTrajectory />
    </div>
  )
}
