import { StudyTimeInsight } from 'dse-level-up'

// 溫習時段洞察 —— 由 dse_progress 每筆紀錄嘅 timestamp 同 elapsed 推算，
// 「幾時溫、溫幾耐、邊個時段最有狀態」全部算得返出嚟，
// 所以**唔使加 user_sessions 表**（見 lib/studyTime.ts 檔頭）。

const day = 86_400_000
const hour = 3_600_000

function session(daysAgo: number, hourOfDay: number, correct: number) {
  const d = new Date(Date.now() - daysAgo * day)
  d.setHours(hourOfDay, 0, 0, 0)
  return {
    subjectId: 'economics',
    subjectName: '經濟',
    topicFilter: null,
    score: correct,
    total: 10,
    grade: '—',
    topicResults: [{ topic: '供求分析', correct, total: 10 }],
    elapsed: 10 * 95,
    timestamp: d.getTime(),
    difficultyResults: {
      easy: { correct: Math.min(3, correct), total: 3 },
      medium: { correct: Math.max(0, Math.min(5, correct - 3)), total: 5 },
      hard: { correct: Math.max(0, correct - 8), total: 2 },
    },
  }
}

function seed(rows: unknown[]) {
  try {
    localStorage.setItem('dse_progress', JSON.stringify(rows))
  } catch {
    /* 封鎖咗 storage 就 render 空狀態 */
  }
}

export function EveningStudent() {
  // 夜晚溫書為主 —— DSE 考生真實場景。
  seed([session(6, 22, 6), session(5, 21, 7), session(3, 23, 8), session(2, 22, 9), session(1, 21, 8)])
  return (
    <div className="max-w-lg">
      <StudyTimeInsight />
    </div>
  )
}
