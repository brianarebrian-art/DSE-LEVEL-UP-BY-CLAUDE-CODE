// 分步提示（第 3 週 · 引擎五之三）
//
// 規格書 §4.7。四條紅線，全部係「唔做乜」多過「做乜」：
//   1. 【絕對禁止自動評分】—— 提示只講方向，唔會睇學生寫咗乜，
//      更加唔會判斷佢啱唔啱。憲章長答題自動批改永久禁令喺此照樣生效。
//   2. 【無消耗、無懲罰】—— 冇次數、冇代價、唔會記低「呢個學生用咗幾多次提示」。
//   3. 【可隨時跳過】—— 學生可以一步都唔睇就直接睇參考答案。
//   4. 【每步只俾方向】—— 唔可以喺提示入面透露答案。
//
// 提示內容係【通用思考鷹架】，唔係逐題寫嘅答案線索：
// 「題目要求你搵乜？」對任何一條題都成立，所以冇任何虛構風險，
// 亦唔會因為題庫加題而過時。
//
// 兩條階梯：計算型同論述型。同一套「代入數值／檢查單位」套落中國歷史論述題
// 係廢話，會令學生覺得呢個功能唔識佢科 —— 分兩條係誠實而唔係花巧。

export type HintLadder = 'quantitative' | 'discursive'

/** 卷面以計算為主嘅科目。其餘一律行論述階梯。 */
const QUANTITATIVE = new Set(['math', 'physics', 'chemistry'])

export function ladderFor(subjectId: string): HintLadder {
  return QUANTITATIVE.has(subjectId) ? 'quantitative' : 'discursive'
}

export interface HintStep {
  zh: string
  en: string
  /** 一句提問，逼學生自己答 —— 唔係一句答案。 */
  promptZh: string
  promptEn: string
}

const QUANT_STEPS: HintStep[] = [
  {
    zh: '辨認資料', en: 'Read what is given',
    promptZh: '題目要你求嘅係乜？已知嘅又有邊幾項？',
    promptEn: 'What is the question asking for, and what are you given?',
  },
  {
    zh: '選擇方法', en: 'Choose the method',
    promptZh: '呢類題目通常用邊條關係／公式？點解係嗰條？',
    promptEn: 'Which relationship or formula usually fits this type — and why that one?',
  },
  {
    zh: '代入數值', en: 'Substitute',
    promptZh: '將已知條件逐項寫出嚟，睇下仲差邊一項。',
    promptEn: 'Write the known values out one by one, and see what is still missing.',
  },
  {
    zh: '檢查單位', en: 'Check the units',
    promptZh: '答案應該係咩單位？同你計出嚟嗰個夾唔夾？',
    promptEn: 'What unit should the answer carry, and does yours match?',
  },
  {
    zh: '收束', en: 'Close it off',
    promptZh: '綜合以上，你嘅答案係？再讀一次題目，答啱咗佢問嗰樣未？',
    promptEn: 'Put it together — then reread the question: did you answer what it actually asked?',
  },
]

const DISCURSIVE_STEPS: HintStep[] = [
  {
    zh: '審題', en: 'Read the command',
    promptZh: '題目嘅指令字係「解釋」「比較」定「評價」？三者要寫嘅嘢唔同。',
    promptEn: 'Is the command word explain, compare, or evaluate? Each asks for something different.',
  },
  {
    zh: '立論', en: 'State your line',
    promptZh: '用一句講清楚你嘅總論點。講唔到一句，即係仲未諗清楚。',
    promptEn: 'State your overall line in one sentence. If you cannot, it is not clear yet.',
  },
  {
    zh: '舉證', en: 'Bring evidence',
    promptZh: '搵兩至三項具體依據（史實／文本／數據），每項扣返你嘅論點。',
    promptEn: 'Find two or three concrete pieces of evidence, each tied back to your line.',
  },
  {
    zh: '回應反面', en: 'Answer the other side',
    promptZh: '有冇相反嘅證據？唔處理佢，評價題就攞唔到上品分。',
    promptEn: 'Is there counter-evidence? Leaving it unaddressed caps an evaluation answer.',
  },
  {
    zh: '收束', en: 'Close it off',
    promptZh: '結尾扣返指令字。再讀一次題目，答啱咗佢問嗰樣未？',
    promptEn: 'Close by returning to the command word, then reread the question: did you answer it?',
  },
]

export function stepsFor(ladder: HintLadder): HintStep[] {
  return ladder === 'quantitative' ? QUANT_STEPS : DISCURSIVE_STEPS
}

export const STEP_COUNT = QUANT_STEPS.length
