// ─────────────────────────────────────────────────────────────────────────────
// 逆向錯因真相引擎 — 學生揀完三維錯因（概念盲區／審題陷阱／運算粗心）之後，
// 由歷史記錄推斷「呢個錯誤真正嘅成因」，再畀一句可執行嘅補救建議。
//
// 純函數為主：`inferTruth` / `cumulativeReviewNote` / `calculateFingerprint`
// 完全唔掂 localStorage，所以喺 Node（`window` undefined）都測得到。只有
// `diagnoseAfterLogging` 呢個瀏覽器 helper 會讀 storage。
//
// ⚠️ 唔會喺呢度重新定義任何 storage 函數 —— 寫入一律經 lib/reverseLog.ts，
//    否則兩個 writer 會用相反排序寫同一個 key。
//
// 三個「真相」嘅觸發訊號係對住真題庫核實過，唔係憑 spec 假設：
//   真相 5（指定範文）：中文科 topic id 係 `fanwen_content` / `fanwen_diction` /
//     `fanwen_lines`，唔係篇名。所以要 match `fanwen_` 前綴 —— 用篇名（「岳陽樓記」
//     等）去 match topic 標籤，喺真題庫上 155 條中文題一條都唔會中。
//   真相 6（計數機程序）：數學 14 個 topic 標籤冇一個含「程序」或 program，
//     全 bank 亦零個「計數機」字眼。真正訊號係 data/calcTips.ts 有冇對應嘅卡；
//     再收窄到 verified:true，令真相同貼士卡同一刻上線（見下面註釋）。
//   真相 8（Integrated Skills）：英文 topic id `integrated` / 標籤
//     `Integrated Skills` —— 呢個係唯一一個 spec 直接啱嘅。
// ─────────────────────────────────────────────────────────────────────────────

import { getCalcTip } from '@/data/calcTips'
import { getReverseLog, type ReverseLogEntry } from './reverseLog'

/** [書面語／廣東話情感層, English] —— 同 lib/lockoutQuestions.ts 嘅 LPair 同一慣例。 */
export type TPair = [zh: string, en: string]

/**
 * 穩定字串鍵。UI 一律用 `key` 分流，唔好用 `id`：
 * 原 spec 將「審題陷阱」同「運算粗心」兩條唔同訊息同時編成 id 4，
 * 淨靠數字分唔開。`id` 保留只為對得返 spec 編號。
 */
export type TruthKey =
  | 'basic-concept' // 1
  | 'advanced-concept' // 2
  | 'repeat-slip' // 3
  | 'question-trap' // 4
  | 'careless' // 4（spec 重覆用咗 4）
  | 'set-text' // 5
  | 'calculator-program' // 6
  | 'repeat-question' // 7
  | 'integrated-skills' // 8
  | 'cumulative-review' // 9

export interface Truth {
  id: number
  key: TruthKey
  message: TPair
  /** 只有真相 7 有 —— 解釋點解值得再停一停，唔係改鎖死時間。 */
  lockReason?: TPair
}

// ⚠️ 刻意冇 `lockDuration`。60 秒鎖死時長由 PracticeSession 嘅 LOCKOUT_SECONDS
// 單一持有，而且只喺 hard 題觸發。畀引擎另開一個時長來源＝兩個真相源，
// 而且改動鎖死教學法屬創辦人決策，唔應該喺呢度靜靜雞加。

export const REPEAT_QUESTION_WINDOW_DAYS = 30
export const REPEAT_SLIP_WINDOW_DAYS = 7

const DAY_MS = 24 * 60 * 60 * 1000

// ── 科目特殊情境 ────────────────────────────────────────────────────────────

/** 中文科指定範文（十二篇）。舊記錄冇 topicId，退回標籤比對。 */
function isSetTextEntry(e: ReverseLogEntry): boolean {
  if (e.subjectId !== 'chinese') return false
  if (e.topicId) return e.topicId.startsWith('fanwen_')
  return e.topic.includes('指定範文')
}

/**
 * 計數機程序題。收窄到 `verified: true` 嘅貼士卡：未經真人真機驗證嘅卡喺
 * production 唔會 render（見 components/CalcTipCard.tsx），如果真相照出，
 * 學生就會見到一句叫佢「對住程式清單逐行核」、但根本冇清單可對嘅提示。
 * 今日 5 張卡全部 verified:false，所以呢條真相現時靜止；#83 有人簽名驗證
 * 嗰一刻，真相同貼士卡會同步上線，唔使再改呢度。
 */
function hasVerifiedCalcTip(e: ReverseLogEntry): boolean {
  if (!e.topicId) return false
  const tip = getCalcTip(e.topicId)
  return tip !== null && tip.verified
}

/** 英文科 Integrated Skills。 */
function isIntegratedSkills(e: ReverseLogEntry): boolean {
  if (e.subjectId !== 'english') return false
  return e.topicId === 'integrated' || e.topic === 'Integrated Skills'
}

function subjectOverride(entry: ReverseLogEntry): Truth | null {
  if (isSetTextEntry(entry)) {
    return {
      id: 5,
      key: 'set-text',
      message: [
        '指定範文嘅錯誤，好多時源於背誦式溫習。試下畫概念網，理解篇章之間嘅呼應，而唔係死背逐句。',
        'Errors on the set texts usually come from rote revision. Try mapping the concepts and how the pieces echo one another, rather than memorising line by line.',
      ],
    }
  }

  if (hasVerifiedCalcTip(entry)) {
    return {
      id: 6,
      key: 'calculator-program',
      message: [
        '計數機程序題出錯，通常係輸入次序或者變數設定有問題。對住下面嘅程式清單逐行核一次，唔好憑記憶打。',
        'Calculator-program errors usually trace back to input order or variable setup. Check line by line against the program listing below rather than typing from memory.',
      ],
    }
  }

  if (isIntegratedSkills(entry)) {
    return {
      id: 8,
      key: 'integrated-skills',
      message: [
        'Integrated Skills 考嘅係時間管理同格式準確度。操練時嚴格計時，熟記各文體格式，唔好留到臨場先執漏。',
        'Integrated Skills tests time management and format accuracy. Practise strictly timed and know each text type’s format cold, so nothing has to be fixed on the day.',
      ],
    }
  }

  return null
}

// ── 核心推斷 ────────────────────────────────────────────────────────────────

/**
 * 推斷單一次錯誤背後嘅真相。
 *
 * @param entry     今次嘅錯誤記錄
 * @param priorLogs 【唔包含 entry 本身】嘅歷史記錄。呢個界線好重要：v3 版本
 *                  將當前記錄計埋落去再用 `>= 2`，令「第二次錯」實際上要第三次
 *                  先觸發。呢度改為數「之前有幾多次」再用 `>= 1`，語意冇得誤讀。
 * @param now       時間基準（測試可注入）
 */
export function inferTruth(
  entry: ReverseLogEntry,
  priorLogs: readonly ReverseLogEntry[] = [],
  now: number = Date.now(),
): Truth {
  // 優先級 1：科目特殊情境（可覆蓋 cause 默認）
  const override = subjectOverride(entry)
  if (override) return override

  // 優先級 2：同一條題目 30 日內再錯
  const repeatSince = now - REPEAT_QUESTION_WINDOW_DAYS * DAY_MS
  const sameQuestionBefore = priorLogs.filter(
    (r) => r.questionId === entry.questionId && r.ts >= repeatSince,
  )
  if (sameQuestionBefore.length >= 1) {
    return {
      id: 7,
      key: 'repeat-question',
      message: [
        '同一條題目 30 日內第二次錯 —— 值得再花 60 秒沉澱：上次同今次嘅錯，有冇共通點？',
        'Second time wrong on this same question within 30 days — worth another 60 seconds: is there something the two attempts have in common?',
      ],
      lockReason: [
        '同一題 30 日內第二次錯誤，建議診斷概念扎根程度',
        'Same question missed twice within 30 days — worth checking how deeply the concept is rooted',
      ],
    }
  }

  // 優先級 3：按三維錯因分流
  if (entry.cause === 'B') {
    return {
      id: 4,
      key: 'question-trap',
      message: [
        '你發現咗一個審題陷阱💡 再睇清楚題目要求，留意指令字同限定詞，唔好畀慣性思維帶偏。',
        'You just found a question-reading trap 💡 Re-read what is actually being asked — watch the command words and qualifiers, and don’t let habit steer you.',
      ],
    }
  }

  if (entry.cause === 'A') {
    // 未知難度（舊記錄）歸去進階分支：寧願講「需要時間消化」，
    // 都好過對住一條可能係 hard 嘅題講「呢個係基礎盲點」。
    if (entry.difficulty === 'easy' || entry.difficulty === 'medium') {
      return {
        id: 1,
        key: 'basic-concept',
        message: [
          '呢個係基礎概念嘅盲點，唔係粗心。返去溫返相關概念，再做一兩條同類題印證，確保係真識而唔係撞啱。',
          'This is a gap in a core concept, not carelessness. Go back over the concept, then redo one or two similar questions to confirm you actually know it rather than guessed right.',
        ],
      }
    }
    return {
      id: 2,
      key: 'advanced-concept',
      message: [
        '進階概念需要時間消化。呢類題嘅重點係理解推導過程，唔係死背步驟 —— 試下自己由頭推一次。',
        'Advanced concepts need time to settle. What matters here is understanding the derivation, not memorising the steps — try working it through from scratch yourself.',
      ],
    }
  }

  // cause === 'C'
  const slipSince = now - REPEAT_SLIP_WINDOW_DAYS * DAY_MS
  const sameTopicSlipBefore = priorLogs.filter(
    (r) => r.cause === 'C' && sameTopic(r, entry) && r.ts >= slipSince,
  )
  if (sameTopicSlipBefore.length >= 1) {
    return {
      id: 3,
      key: 'repeat-slip',
      message: [
        '你喺呢個課題第二次運算失手 —— 即係有個固定模式等緊你發現。慢做一題，逐步驗算，睇下係邊一步成日甩。',
        'That’s the second computational slip on this topic within a week — there’s a pattern waiting to be found. Do one question slowly, checking each step, and pin down exactly where it goes wrong.',
      ],
    }
  }

  return {
    id: 4,
    key: 'careless',
    message: [
      '運算上嘅甩漏 —— 寫低每一步，減少心算，做完快速覆核一次。好多分係咁樣執返嚟。',
      'A slip in the working — write every step down, cut back on mental arithmetic, and do one quick check at the end. A lot of marks come back this way.',
    ],
  }
}

/** 同一課題：優先用 topic id（穩定），舊記錄冇就退回標籤。 */
function sameTopic(a: ReverseLogEntry, b: ReverseLogEntry): boolean {
  if (a.topicId && b.topicId) return a.topicId === b.topicId
  return a.topic === b.topic
}

// ── 真相 9：累積重溫提示 ────────────────────────────────────────────────────

/**
 * 真相 9 唔係一條「同其他真相二選一」嘅分支 —— 原 spec 將佢排喺三個 cause 分支
 * 之後，但 cause 只有 A/B/C 三個值而三個分支都 return，所以嗰段永遠行唔到。
 * 呢度改為獨立輸出，同主真相一齊顯示（補充，唔係取代）。
 *
 * 數字係實數（去重後嘅課題數），零虛構統計。少過 2 個課題唔出 —— 學生啱啱先
 * 錯完唯一嗰題，再話佢知「你有 1 個課題等緊重溫」係廢話。
 */
export function cumulativeReviewNote(logs: readonly ReverseLogEntry[]): Truth | null {
  const topics = new Set<string>()
  for (const r of logs) {
    const t = r.topicId || r.topic
    if (t) topics.add(`${r.subjectId}::${t}`)
  }
  if (topics.size < 2) return null
  const n = topics.size
  return {
    id: 9,
    key: 'cumulative-review',
    message: [
      `你有 ${n} 個課題等緊重溫。逐個擊破，好過盲目刷題。`,
      `You have ${n} topics waiting for review. Clearing them one at a time beats grinding questions at random.`,
    ],
  }
}

// ── 錯題 DNA 指紋 ───────────────────────────────────────────────────────────

/**
 * 最近 N 次錯誤嘅「錯因—難度」序列，例如 `A-hard→C-easy→B-medium`。
 *
 * reverseLog 係 newest-first（`logReverseError` 用 unshift），所以 slice(0, limit)
 * 就係最近 N 條。舊記錄冇 difficulty，顯示為 `?` —— 呢個係真實嘅「未知」，
 * 唔會當作某個難度。
 */
export function calculateFingerprint(logs: readonly ReverseLogEntry[], limit = 20): string {
  return logs
    .slice(0, limit)
    .map((r) => `${r.cause}-${r.difficulty ?? '?'}`)
    .join('→')
}

// ── 主入口 ──────────────────────────────────────────────────────────────────

export interface DiagnoseResult {
  truth: Truth
  /** 補充提示，可以係 null（課題少過 2 個時） */
  cumulative: Truth | null
  fingerprint: string
}

/** 純函數版本：測試同 SSR 都行得。`priorLogs` 唔包含 `entry`。 */
export function diagnose(
  entry: ReverseLogEntry,
  priorLogs: readonly ReverseLogEntry[] = [],
  now: number = Date.now(),
): DiagnoseResult {
  const all = [entry, ...priorLogs] // 重建 newest-first 序列畀指紋同課題統計用
  return {
    truth: inferTruth(entry, priorLogs, now),
    cumulative: cumulativeReviewNote(all),
    fingerprint: calculateFingerprint(all),
  }
}

/**
 * 瀏覽器 helper：喺 `logReverseError(entry)` 之後【緊接住】叫。
 *
 * `logReverseError` 做嘅係 `list.unshift(entry)`，所以 index 0 一定係啱啱寫入
 * 嗰條，`slice(1)` 就係準確嘅「之前記錄」—— 唔使靠 id/ts 比對去撇走自己。
 * 如果 storage 寫唔入（無痕模式／爆 quota），getReverseLog() 回空陣列，
 * slice(1) 一樣係空，引擎會當作第一次錯，安全降級。
 */
export function diagnoseAfterLogging(
  entry: ReverseLogEntry,
  now: number = Date.now(),
): DiagnoseResult {
  return diagnose(entry, getReverseLog().slice(1), now)
}
