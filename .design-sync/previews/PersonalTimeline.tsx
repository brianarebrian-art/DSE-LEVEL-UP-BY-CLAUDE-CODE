import { PersonalTimeline } from 'dse-level-up'

// 個人進度時間軸。數據全部由真實作答聚合 —— 冇練習紀錄就唔會畫一條假嘅線。

const day = 86_400_000

function seed(n: number) {
  const rows = Array.from({ length: n }, (_, i) => ({
    subjectId: 'economics',
    subjectName: '經濟',
    topicFilter: null,
    score: 6 + (i % 4),
    total: 10,
    grade: '—',
    topicResults: [{ topic: '供求分析', correct: 7, total: 10 }],
    elapsed: 10 * 95,
    timestamp: Date.now() - (n - i) * day,
    difficultyResults: {
      easy: { correct: 3, total: 3 },
      medium: { correct: 3, total: 5 },
      hard: { correct: 1, total: 2 },
    },
  }))
  try {
    localStorage.setItem('dse_progress', JSON.stringify(rows))
  } catch {
    /* 封鎖咗 storage 就 render 空狀態 */
  }
}

export function TwoWeeks() {
  seed(8)
  return (
    <div className="max-w-2xl">
      <PersonalTimeline />
    </div>
  )
}
