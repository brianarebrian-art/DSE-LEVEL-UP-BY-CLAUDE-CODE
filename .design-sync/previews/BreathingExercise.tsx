import { BreathingExercise } from 'dse-level-up'

// 4-7-8 呼吸法（Sarah/駐校社工 — 情緒急救）。吸氣 4 秒 → 屏息 7 秒 → 呼氣 8 秒。 純 CSS transition 驅動（無新依賴）；溫和色系，配合平台 gentle 品牌。 

export function Default() {
  return (
    <div className="max-w-lg">
      <BreathingExercise />
    </div>
  )
}
