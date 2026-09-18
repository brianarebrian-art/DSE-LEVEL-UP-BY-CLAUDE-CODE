import { TrailStrip } from 'dse-level-up'

// 儀表板「最近足跡」橫向列。完全冇練習紀錄時 return null ——
// 唔會對一個新來嘅學生擺一列空卡，嗰個只會令人覺得自己欠咗平台啲嘢。

const day = 86_400_000

function seed(n: number) {
  const rows = Array.from({ length: n }, (_, i) => ({
    subjectId: ['economics', 'math', 'chinese'][i % 3],
    subjectName: ['經濟', '數學', '中文'][i % 3],
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
    /* 封鎖咗 storage 就 render null */
  }
}

export function RecentSessions() {
  seed(5)
  return <TrailStrip />
}
