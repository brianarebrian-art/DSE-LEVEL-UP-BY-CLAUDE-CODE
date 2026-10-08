// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : pe
//   count    : 1  (easy 0 / medium 1 / hard 0)
//   types    : mc 1 / text 0 / long 0
//   updated  : 2026-10-08
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const peAutoQuestions: Question[] = [
  {
    "id": "rcl_pe_inj_79",
    "type": "mc",
    "subject": "pe",
    "topic": "injuries",
    "topicZh": "運動創傷",
    "topicEn": "Sports Injuries",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "籃球員跳起落地時踩到對手的腳，踝關節向內翻，外側即時腫脹疼痛，但仍可勉強行走。最可能受傷的是甚麼組織？即時應如何處理？",
    "explanation": "踝關節向內翻時，外側的韌帶被過度拉扯甚至撕裂，屬扭傷。仍可勉強行走、外側腫痛，符合韌帶扭傷的情況。即時處理應停止運動，並以休息、冰敷、加壓和抬高患處減少腫脹和內出血，嚴重時要求醫。拉傷是肌肉或肌腱受傷，與關節內翻的受傷機制不同；而且受傷初期熱敷和按摩會加劇腫脹。懷疑骨折時不可自行扳動，應固定患處並求醫。繼續比賽會令受傷的韌帶進一步受損。",
    "options": [
      "肌肉拉傷；應立即熱敷並用力按摩患處，以促進血液循環和消腫。",
      "韌帶扭傷；應停止運動，並以休息、冰敷、加壓及抬高處理。",
      "骨折；應立即把踝關節扳回原位，然後繼續比賽。",
      "韌帶扭傷；應繼續比賽，讓關節在活動中自行復原。"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A basketball player lands on an opponent’s foot and rolls the ankle inwards. The outer side swells and hurts at once, but the player can still just about walk. Which tissue is most likely injured, and what is the immediate treatment?",
    "optionsEn": [
      "A muscle strain; apply heat at once and massage firmly to boost circulation and reduce swelling.",
      "A ligament sprain; stop playing and use rest, ice, compression and elevation.",
      "A fracture; force the ankle back into place at once and carry on playing.",
      "A ligament sprain; keep playing so the joint can heal through movement."
    ],
    "explanationEn": "When the ankle rolls inwards, the ligaments on the outer side are overstretched or torn, which is a sprain. Swelling and pain on the outer side while the player can still just walk fit a ligament sprain. Immediate treatment is to stop playing and use rest, ice, compression and elevation to limit swelling and bleeding, seeking medical help if it is severe. A strain is an injury to a muscle or tendon, a different mechanism from rolling a joint, and heat and massage in the early stage make swelling worse. A suspected fracture must never be forced back; it should be immobilised and seen by a doctor. Playing on damages the injured ligament further."
  }
]
