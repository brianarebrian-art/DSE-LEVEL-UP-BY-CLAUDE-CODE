import { GuardianCredits } from 'dse-level-up'

// 守護者名單。用真 token 上色（註釋明寫 Cyber 值 `#00F5D4` 同規格一致），
// 唔係喺組件度寫死 hex —— 呢個係全站色系唔斷裂嘅做法。

export function Default() {
  return (
    <div className="max-w-lg">
      <GuardianCredits />
    </div>
  )
}
