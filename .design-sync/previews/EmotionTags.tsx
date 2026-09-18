import { EmotionTags } from 'dse-level-up'

// 錯題情緒標籤（F01，Emma — 腦震盪 5 票冠軍）。答錯後三個情緒掣， 按選擇回應唔同語氣；記錄入 localStorage `dse_emotion_log`（本地，供將來 

export function Default() {
  return (
    <div className="max-w-lg">
      <EmotionTags />
    </div>
  )
}
