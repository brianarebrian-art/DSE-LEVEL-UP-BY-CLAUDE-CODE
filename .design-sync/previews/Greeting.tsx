import { Greeting } from 'dse-level-up'

// 頂部欄問候語。⚠️ 刻意 mount 之後先算時段 —— server 同學生嘅時區唔一定一樣，
// 喺 SSR 就計會 render 出一個同學生眼前唔同嘅「早晨」，然後 hydration 跳一跳。

export function Default() {
  return <Greeting />
}
