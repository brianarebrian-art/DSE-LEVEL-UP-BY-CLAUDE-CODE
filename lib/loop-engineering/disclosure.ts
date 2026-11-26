/**
 * 披露文案草稿。第 1–2 星期只存放，不接入正式站結果頁或練習頁。
 * 學生作答不得用於校準或 AI。
 */

export const PREDICTION_DISCLOSURE_ZH =
  '預測等級只是 DSE Level Up 的非官方參考估算，並不是香港考試及評核局的評級，也不能代替文憑試成績。每次出示預測等級時，這句說明必須出現在同一個結果畫面。'

export const BANK_DISCLOSURE_ZH =
  '本題庫由 DSE Level Up 自行編寫，不是香港考試及評核局的官方試題，未經考評局許可或認可，亦未經 HKDSE 學科教師審核。'

export const PREVIEW_ITEM_LABEL_ZH = '未經 HKDSE 學科教師審核'

export const LOOP5_BLOCKED_LABEL_ZH = '待批准'

export const STUDENT_ANSWER_USE = {
  calibration: false,
  ai: false,
  reasonZh: '第 1–2 星期不收集、不使用學生作答作難度校準或 AI。真實學生實測維持待批准。',
} as const

export const DISCLOSURE_DRAFTS = {
  predictionOnResultScreen: {
    id: 'prediction-same-screen',
    wiredToProductionUi: false,
    textZh: PREDICTION_DISCLOSURE_ZH,
  },
  bankOrigin: {
    id: 'self-authored-bank',
    wiredToProductionUi: false,
    textZh: BANK_DISCLOSURE_ZH,
  },
} as const
