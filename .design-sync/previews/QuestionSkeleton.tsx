import { QuestionSkeleton } from 'dse-level-up'

// 題目載入骨架。動畫由 globals.css 控制，SEN／reduced-motion 之下整層關掉。

export function Default() {
  return (
    <div className="max-w-lg">
      <QuestionSkeleton />
    </div>
  )
}
