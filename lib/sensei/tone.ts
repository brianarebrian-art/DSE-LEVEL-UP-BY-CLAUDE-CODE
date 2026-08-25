// ============================================================================
// lib/sensei/tone.ts —— SENSEI 語氣包裝層
// ----------------------------------------------------------------------------
// 兩條界線，兩條都容易踩過：
//
// ① 語氣 ≠ 假冒經歷。
//    「師兄師姐語氣」可以親切、可以口語，但【唔可以聲稱自己考過 DSE】。
//    憲章 §16.B 核准嗰句寫得好清楚：考過 DSE 嘅係【團隊】，唔係 Sensei。
//    所以下面啲開場白一律唔用「我當年」「我試過」呢類第一人稱經歷 ——
//    有測試鎖住。呢個係 §16.B 嘅延伸：唔淨止唔可以否認自己係 AI，
//    亦唔可以用細節去暗示自己係人。
//
// ② 呈現方式由【學生自選】，唔係平台按狀態去派。
//    原方案係一張「ADHD → 分段編號、抑鬱 → 溫暖語氣、焦慮 → 確定語言」嘅
//    對照表。咁樣做即係平台喺度判定學生屬邊一類，同 Ghost 自己嗰句
//    「SEN 功能必須用戶自主選擇，絕對唔准平台『診斷』用戶」直接相撞。
//    所以呢度嘅選項【一律用做法命名，唔用病名】：
//    「一次讀一段」而唔係「ADHD 模式」。
//    一個 ADHD 學生同一個焦慮學生可能揀同一組設定 ——
//    我哋唔需要知佢係邊種診斷都幫到佢，亦因此永遠唔會有一張診斷標籤表。
//
// ③ 呢層【唔生成任何內容】。佢只做兩件事：揀開場白（靜態字串）同排序段落。
//    卡片文字一隻字都唔會改。
// ============================================================================

export interface TonePrefs {
  /** 一次只顯示一段，撳「下一段」先繼續。 */
  oneAtATime: boolean
  /** 先出【考試技巧】同【常見陷阱】，再出【概念】同【例子】。 */
  conclusionFirst: boolean
  /** 卡片尾附四段式核對清單（由結構得出，唔係生成）。 */
  showChecklist: boolean
  /** 顯示開場白。關掉就淨係得卡片本身。 */
  greeting: boolean
}

export const DEFAULT_PREFS: TonePrefs = {
  oneAtATime: false,
  conclusionFirst: false,
  showChecklist: false,
  greeting: true,
}

/** localStorage key。⚠️ 唔可以加入 lib/sync.ts 嘅上載名單 —— 呢個係本機偏好。 */
export const TONE_PREFS_KEY = 'dse_sensei_prefs'

/**
 * 開場白：師兄師姐語氣，但唔會聲稱自己考過 DSE。
 * 全部靜態，冇一句係生成出嚟。
 */
export const GREETINGS = [
  { zh: '呢個位好多人卡住，我哋逐段睇。', en: 'A lot of people get stuck here. Let us go through it section by section.' },
  { zh: '唔使急，一次搞掂一個概念就夠。', en: 'No rush — one concept at a time is enough.' },
  { zh: '呢張卡係人手審過嘅，可以放心睇。', en: 'A person checked this card before it got here, so you can rely on it.' },
  { zh: '答唔出唔代表唔識，好多時只係差一步。', en: 'Not being able to answer does not mean you do not know it — often it is one step short.' },
] as const

/** 用問題本身揀開場白，令同一句問題每次結果一樣（可重現，好過隨機）。 */
export function pickGreeting(question: string) {
  let h = 0
  for (let i = 0; i < question.length; i++) h = (h * 31 + question.charCodeAt(i)) >>> 0
  return GREETINGS[h % GREETINGS.length]
}

export const SECTION_ORDER = ['concept', 'example', 'examTechnique', 'commonTrap'] as const
export type SectionKey = (typeof SECTION_ORDER)[number]

/** 先結論後原因：把可以即刻用嘅兩段搬到前面。段落內容一隻字都唔改。 */
export function orderSections(prefs: TonePrefs): readonly SectionKey[] {
  if (!prefs.conclusionFirst) return SECTION_ORDER
  return ['examTechnique', 'commonTrap', 'concept', 'example']
}

export function loadPrefs(): TonePrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = window.localStorage.getItem(TONE_PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<TonePrefs>
    return { ...DEFAULT_PREFS, ...parsed }
  } catch { return DEFAULT_PREFS }
}

export function savePrefs(prefs: TonePrefs): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(TONE_PREFS_KEY, JSON.stringify(prefs)) } catch { /* 私隱模式下寫唔到，唔應該爆 */ }
}
