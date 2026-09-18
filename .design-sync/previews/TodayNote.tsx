import { TodayNote } from 'dse-level-up'

// 今日提示 —— 每日溫習信 ＋ 錯題溫和提醒合併版。
// 刻意【只設一個位】：兩個提示各佔一格會互相爭奪注意力，對 ADHD 學生尤其不利。
// 冇訊息時整塊消失，唔會寫「今日暫無提示」嗰類空殼。

const day = 86_400_000

function seed() {
  try {
    localStorage.removeItem('dse_nudged_at')
    localStorage.setItem(
      'dse_reverse_log',
      JSON.stringify(
        ['A', 'A', 'B'].map((cause, i) => ({
          subjectId: 'economics',
          questionId: `econ_note_${i}`,
          topic: '共用品',
          topicId: 'public-goods',
          cause,
          selected: '需求量上升',
          correct: '需求下降',
          ts: Date.now() - (i + 1) * day,
          difficulty: 'medium' as const,
        })),
      ),
    )
  } catch {
    /* 封鎖咗 storage 就 render null */
  }
}

export function Default() {
  seed()
  return (
    <div className="max-w-lg">
      <TodayNote />
    </div>
  )
}
