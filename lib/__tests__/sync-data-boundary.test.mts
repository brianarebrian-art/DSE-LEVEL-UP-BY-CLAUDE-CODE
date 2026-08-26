// 上雲資料邊界鎖（2026-08-26，日次 3 P0 修正）
//
// 呢個檔存在嘅原因：學生揀嗰個選項嘅【文字內容】（`selectedZh`）曾經連同
// user_id 一齊 upsert 入 Supabase，而【冇任何測試】攔到。三份安全文件都明文
// 禁「作答內容」「答案原文」「人工閱讀個人作答」，但紅線只寫喺文件度，
// 冇一條測試守住。所以呢度用【白名單】而唔係黑名單：
//
//   黑名單（禁 selectedZh）→ 下次有人加一個新欄位叫 `chosenText`，一樣走漏。
//   白名單（只准呢幾個鍵）→ 任何新欄位都要有人主動改測試，先上到雲。
//
// 呢個分別就係「攔症狀」同「攔成因」嘅分別。

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

/** 剝註釋 —— 唔剝嘅話會掃到本檔同 sync.ts 入面解釋規則嗰啲字。 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
}

const SYNC = stripComments(read('lib/sync.ts'))

/** `snapshotLocal()` 函式體 —— 上傳 payload 嘅唯一來源。 */
function snapshotBody(): string {
  const i = SYNC.indexOf('export function snapshotLocal')
  assert.ok(i >= 0, '搵唔到 snapshotLocal —— 上傳 payload 嘅來源改咗名？')
  const open = SYNC.indexOf('{', i)
  let depth = 0
  let j = open
  while (j < SYNC.length) {
    if (SYNC[j] === '{') depth++
    else if (SYNC[j] === '}') { depth--; if (depth === 0) break }
    j++
  }
  return SYNC.slice(open, j + 1)
}

// ── 白名單：只有呢啲鍵准上雲 ────────────────────────────────────────────────
// 要加新鍵？請先答：呢個鍵入面有冇學生寫嘅字、答過嘅嘢、情緒、或者可以推斷
// 個人強弱嘅嘢？有嘅話唔准加，去諗一個唔使上雲嘅做法。
const ALLOWED_UPLOAD_KEYS = [
  'dse_progress', // 每節練習嘅分數／總數／時戳
  'dse_free_attempts_total', // 單一累計數字
]

const FORBIDDEN_UPLOAD_KEYS = [
  'dse_active_session', // answers[].selectedZh = 答案原文
  'dse_topic_stats', // 個人逐課題正確率（L2 平台可讀）
  'dse_emotion_log', // 情緒
  'dse_capsule', // 學生寫畀自己嘅信
  'dse_reverse_log', // 錯因自診
  'dse_writing_draft', // 作文原文
  'dse_logic_log', // 心情備註
  'dse_own_cheers', 'dse_sensei_prefs', // 學生自己寫嘅鼓勵語
]

test('上傳 payload 只可以含白名單入面嘅鍵', () => {
  const body = snapshotBody()
  const keys = [...body.matchAll(/\bdse_[a-z_]+\b/g)].map((m) => m[0])
  const unexpected = [...new Set(keys)].filter((k) => !ALLOWED_UPLOAD_KEYS.includes(k))
  assert.deepEqual(
    unexpected,
    [],
    `snapshotLocal() 出現咗白名單以外嘅鍵：${unexpected.join(', ')}。` +
      '如果係刻意加，請先確認入面冇學生作答內容／情緒／個人強弱資料，再更新本測試嘅白名單。',
  )
})

test('答案原文永遠唔可以出現喺上傳 payload', () => {
  const body = snapshotBody()
  assert.ok(
    !/selectedZh/.test(body),
    'snapshotLocal() 掂到 selectedZh —— 呢個係學生揀嗰個選項嘅文字，唔可以離開部機',
  )
  assert.ok(
    !/ACTIVE_SESSION_KEY/.test(body),
    'snapshotLocal() 掂到 ACTIVE_SESSION_KEY —— 未完成嗰節帶住答案原文',
  )
})

test('明文禁止名單入面嘅鍵，一個都唔准喺上傳 payload 出現', () => {
  const body = snapshotBody()
  const leaked = FORBIDDEN_UPLOAD_KEYS.filter((k) => body.includes(k))
  assert.deepEqual(leaked, [], `呢啲鍵唔可以上雲：${leaked.join(', ')}`)
})

// ── applyLocal 陷阱鎖 ───────────────────────────────────────────────────────
// snapshotLocal 唔再帶 dse_topic_stats 之後，applyLocal 如果照舊寫
// `s.dse_topic_stats ?? {}`，就會將本機累積咗嘅課題統計【洗成空白】——
// 修私隱反而整走學生嘅嘢。
test('applyLocal 唔可以用 ?? {} 洗走本機課題統計', () => {
  const i = SYNC.indexOf('export function applyLocal')
  assert.ok(i >= 0, '搵唔到 applyLocal')
  const body = SYNC.slice(i, i + 1400)
  assert.ok(
    !/dse_topic_stats\s*\?\?\s*\{\}/.test(body),
    'applyLocal 用緊 `s.dse_topic_stats ?? {}` —— 雲端冇呢個欄位嘅時候會洗走本機資料',
  )
  assert.match(
    body,
    /if\s*\(\s*s\.dse_topic_stats\s*\)/,
    'applyLocal 應該「有值先覆蓋」，冇值就唔郁本機',
  )
})

test('未完成嗰節嘅本機資料唔可以被冇該欄位嘅雲端列洗走', () => {
  const i = SYNC.indexOf('export function applyLocal')
  const body = SYNC.slice(i, i + 1400)
  // undefined → 唔郁；null → 清走（另一部機做完咗）；有值 → 覆蓋
  assert.match(body, /s\.dse_active_session\s*===\s*null/, 'null 要當「已完成／已放棄」處理')
  assert.match(body, /if\s*\(\s*s\.dse_active_session\s*\)/, '有值先覆蓋')
})

// ── 保障續做功能唔會被靜靜整壞 ─────────────────────────────────────────────
test('計分仍然靠 isCorrect —— 證明點解唔可以淨係剝欄位', () => {
  const ps = stripComments(read('app/practice/PracticeSession.tsx'))
  assert.match(
    ps,
    /filter\(\s*\(a\)\s*=>\s*a\?\.isCorrect\s*\)\.length/,
    '計分邏輯改咗；如果唔再靠 isCorrect，請重新評估上雲欄位嘅取捨',
  )
})
