import { MasteryEstimate } from 'dse-level-up'

// 等級估算 v4。⛔ 永遠唔會出單一等級、⛔ 證據唔夠就唔出等級（改為講「仲要做幾多題」）、
// ⛔ 唔講「你會攞 X 級」。呢三條唔係文案偏好，係憲章 §8 禁 JUPAS 預測器
// 同禁虛構統計嘅落地。
//
// 資料源係 localStorage 嘅 `dse_progress`（AttemptRecord[]）。要出到等級要夠
// MIN_QUESTIONS = 30 條【有 difficultyResults 嘅】題，而且每節要夠時間
// （MIN_SECONDS_PER_QUESTION = 3）—— 所以下面造咗四節 ×10 題。
// 少一個欄（例如 topicResults）都會令記錄被丟走，呢個係刻意嘅衛生閘。

const day = 86_400_000

function session(daysAgo: number, correct: number) {
  return {
    subjectId: 'economics',
    subjectName: '經濟',
    topicFilter: null,
    score: correct,
    total: 10,
    grade: '—',
    topicResults: [{ topic: '供求分析', correct, total: 10 }],
    elapsed: 10 * 95,
    timestamp: Date.now() - daysAgo * day,
    // 3:5:2 出卷比例（憲章 §12 DIFF_RATIO）
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
    /* 預覽環境封鎖咗 storage 就 render 返「未夠數據」嗰個狀態 */
  }
}

export function NotEnoughEvidence() {
  // 得一節 —— 遠低於 30 題，所以唔會出等級，只會講仲要做幾多題。
  seed([session(1, 7)])
  return (
    <div className="max-w-lg">
      <MasteryEstimate subjectId="economics" />
    </div>
  )
}

export function EnoughEvidence() {
  seed([session(8, 6), session(5, 7), session(3, 8), session(1, 9)])
  return (
    <div className="max-w-lg">
      <MasteryEstimate subjectId="economics" />
    </div>
  )
}
