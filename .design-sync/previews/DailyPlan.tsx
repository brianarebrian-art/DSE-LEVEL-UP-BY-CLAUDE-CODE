import { DailyPlan } from 'dse-level-up'

// 今日計劃。⚠️ 唔係 to-do list：冇打勾、冇完成率、冇「今日仲有 N 樣未做」。
// 計劃做唔晒唔會有任何提示 —— §7 大愛紅線，平台唔可以製造欠債感。

export function Default() {
  return (
    <div className="max-w-lg">
      <DailyPlan />
    </div>
  )
}
