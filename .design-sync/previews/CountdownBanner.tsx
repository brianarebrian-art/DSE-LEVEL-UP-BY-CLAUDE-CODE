import { CountdownBanner } from 'dse-level-up'

// DSE 倒數條。⚠️ 呢個係「仲有幾多日」嘅事實陳述，唔係催促 ——
// §7 大愛紅線唔准用製造焦慮嘅語氣講時間。

export function Default() {
  return (
    <div className="max-w-2xl">
      <CountdownBanner />
    </div>
  )
}
