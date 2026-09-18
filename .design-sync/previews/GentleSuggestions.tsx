import { GentleSuggestions } from 'dse-level-up'

// 今日幾句建議。⚠️ 係【建議】唔係任務：冇打勾、冇完成度、冇「今日仲有 N 樣未做」。
// 排程間隔同 ReviewScheduler 共用 lib/reviewSchedule，兩邊各寫一次遲早會漂走。

const day = 86_400_000

function seed() {
  try {
    localStorage.removeItem('dse_gentle_dismissed')
    localStorage.setItem(
      'dse_reverse_log',
      JSON.stringify(
        [
          ['A', '共用品', 1],
          ['C', '彈性計算', 3],
          ['B', '價格上限', 8],
        ].map(([cause, topic, d]) => ({
          subjectId: 'economics',
          questionId: `econ_gs_${d}`,
          topic,
          topicId: 'demand-supply',
          cause,
          selected: '需求量上升',
          correct: '需求下降',
          ts: Date.now() - Number(d) * day,
          difficulty: 'medium' as const,
        })),
      ),
    )
  } catch {
    /* 封鎖咗 storage 就 render 空狀態 */
  }
}

export function Default() {
  seed()
  return (
    <div className="max-w-lg">
      <GentleSuggestions />
    </div>
  )
}
