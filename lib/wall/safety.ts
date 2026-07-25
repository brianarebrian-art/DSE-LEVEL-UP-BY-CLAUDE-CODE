// ⚠️ 呢個【唔係】自殘偵測 / 危機介入系統，亦【唔係】審核閘。
//
// 對話紅線（見 memory sen-selfharm-detection-redline）：本平台【拒絕】做自動自殘 NLP
// 偵測 + 危機自動介入 + 存精神健康 PII。理由：靠關鍵字/model 判斷一個中學生係咪想
// 自殺，false-negative 係人命、false-positive + 自動收埋帖 = 喺佢最脆弱嗰刻拒絕佢。
//
// 呢個 function 只做【一件事】：當發帖者自己嘅文字撞到危機詞，就俾前端【即刻喺佢自己
// 畫面】彈返公開熱線卡（撒瑪利亞會 2896 0000 / 生命熱線 2382 0000）。
//   • 唔會 block / hide / reject 佢嘅帖（帖照樣入 pending queue 等真人審）
//   • 唔會貼 label、唔會當 crisis case、唔會存落 DB、唔會通知任何人
//   • 關鍵字匹配一定唔準（會漏、會誤中）——所以熱線卡本身亦【永遠置頂】喺個牆，
//     唔靠呢個 scan 觸發都見到。呢度只係「順手多提一次」。

const CRISIS_TERMS = [
  // 中文（廣東話 + 書面）
  '想死', '唔想活', '唔想生存', '想自殺', '自殺', '輕生', '不如死',
  '死咗算', '想消失', '結束生命', '結束自己', '無謂再撐', '撐唔落去',
  '傷害自己', '自殘', '割手',
  // English
  'kill myself', 'want to die', 'end my life', 'end it all',
  'suicide', 'suicidal', 'self harm', 'self-harm', 'cut myself',
  "don't want to live", 'no reason to live',
]

/**
 * 純粹決定「要唔要向發帖者本人顯示熱線卡」。true = 顯示。
 * 唔改變帖嘅去向（一律照樣 pending）。
 */
export function shouldSurfaceHotline(text: string): boolean {
  const s = String(text).toLowerCase()
  return CRISIS_TERMS.some((t) => s.includes(t))
}
