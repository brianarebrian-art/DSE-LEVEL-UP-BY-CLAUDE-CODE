/**
 * 披露文案定稿（2026-11-27，香港時間）。
 * 正本在本檔。文件與預覽元件只准引用這些常數，不要另寫一套句子。
 * 尚未掛上正式練習開始畫面或成績頁。學生作答不得用於校準或 AI。
 */

export const DISCLOSURE_STATUS = 'final' as const
export const DISCLOSURE_FINALIZED_ON = '2026-11-27'

export const PREDICTION_DISCLOSURE_ZH =
  '預測等級是 DSE Level Up 的非官方平台估算，並不是香港考試及評核局的評級，也不能代替文憑試成績。每次出示預測等級，必須在同一個畫面標明這是非官方平台估算。'

export const BANK_DISCLOSURE_ZH =
  '本題庫由 DSE Level Up 自編，不是香港考試及評核局的試題，未經考評局許可或認可，亦未經 HKDSE 學科教師審核。'

export const PREVIEW_ITEM_LABEL_ZH = '未經 HKDSE 學科教師審核'

export const DISCLOSURE_PREVIEW_FRAME_ZH =
  '內部預覽。正式環境不顯示此頁。練習頁與成績頁尚未掛接。上文案已於 2026-11-27 定稿，仍未接到學生畫面。'

export const LOOP5_BLOCKED_LABEL_ZH = '待批准'

export const STUDENT_ANSWER_USE = {
  calibration: false,
  ai: false,
  reasonZh: '第 3–4 星期定稿後仍不收集、不使用學生作答作難度校準或 AI。真實學生實測維持待批准。',
} as const

export const DISCLOSURE_COPY = {
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

/**
 * `/dev/loop-disclosure` 的正式環境閘。
 * `VERCEL_ENV=production` 必須 404。
 * 沒有 `VERCEL_ENV` 而 `NODE_ENV=production` 時同樣 404，避免本機 production 露出預覽。
 * `VERCEL_ENV=preview` 即使 `NODE_ENV=production` 也不 404。
 */
export function isLoopDisclosureRouteHidden(env?: {
  VERCEL_ENV?: string
  NODE_ENV?: string
}): boolean {
  const vercelEnv = env ? env.VERCEL_ENV : process.env.VERCEL_ENV
  const nodeEnv = env ? env.NODE_ENV : process.env.NODE_ENV
  return vercelEnv === 'production' || (vercelEnv == null && nodeEnv === 'production')
}
