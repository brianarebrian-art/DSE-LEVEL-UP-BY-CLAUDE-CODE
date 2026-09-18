import { PracticeRankCard } from 'dse-level-up'

// 競技場卡（段位 ＋ EXP）。憲章 §8.1 解禁遊戲化，但六條約束仍然生效，
// 所以呢張卡**刻意唔做**：唔出排名、唔出他人成績、唔出在線人數、
// 唔出「距離 5** 仲差幾多」、唔出倒扣／掉段／連續中斷。
//
// 段位由 localStorage 嘅 dse_progress 衍生，所以下面造咗一個有紀錄嘅狀態。

const day = 86_400_000

function seed(n: number) {
  const rows = Array.from({ length: n }, (_, i) => ({
    subjectId: 'economics',
    subjectName: '經濟',
    topicFilter: null,
    score: 7 + (i % 3),
    total: 10,
    grade: '—',
    topicResults: [{ topic: '供求分析', correct: 7, total: 10 }],
    elapsed: 10 * 95,
    timestamp: Date.now() - (n - i) * day,
    difficultyResults: {
      easy: { correct: 3, total: 3 },
      medium: { correct: 4, total: 5 },
      hard: { correct: 1, total: 2 },
    },
  }))
  try {
    localStorage.setItem('dse_progress', JSON.stringify(rows))
  } catch {
    /* 封鎖咗 storage 就 render 新手狀態 */
  }
}

// ⚠️ 冇任何練習紀錄嗰陣 PracticeRankCard 會 `return null` —— 唔會擺一張空段位卡
// 喺新學生面前。所以呢度冇「新手」一格：一格空白證明唔到嘢，只會似壞咗。
// 兩格分別係段位階梯嘅頭尾，等人睇得出個 EXP 條點樣行。

export function EarlyRank() {
  seed(12)
  return (
    <div className="max-w-sm">
      <PracticeRankCard />
    </div>
  )
}

export function HigherRank() {
  seed(60)
  return (
    <div className="max-w-sm">
      <PracticeRankCard />
    </div>
  )
}
