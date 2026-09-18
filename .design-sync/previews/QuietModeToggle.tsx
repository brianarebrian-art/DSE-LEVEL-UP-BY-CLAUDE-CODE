import { QuietModeToggle } from 'dse-level-up'

// 安靜模式。開咗會收起段位／EXP 呢類遊戲化元素（§8.1 約束 4：SEN 之下要
// 整層【隱藏】，唔係調慢）。⚠️ `dse_quiet_mode` 刻意冇入 lib/sync.ts 上雲白名單
// （quiet-mode.test.mts 守住）—— 新增任何一個上雲 key 都要創辦人書面批准（§16.E）。

export function Default() {
  return <QuietModeToggle />
}
