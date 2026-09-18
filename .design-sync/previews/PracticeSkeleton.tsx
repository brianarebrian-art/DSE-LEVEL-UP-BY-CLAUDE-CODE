import { PracticeSkeleton } from 'dse-level-up'

// 練習頁載入骨架 —— 佢嘅形狀要同真練習頁對得上，唔係一堆通用灰條，
// 否則載入完成嗰一下會跳位。

export function Default() {
  return (
    <div className="max-w-2xl">
      <PracticeSkeleton />
    </div>
  )
}
