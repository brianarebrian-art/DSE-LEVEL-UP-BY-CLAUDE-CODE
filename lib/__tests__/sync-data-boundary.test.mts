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
  // 2026-09-07 加入。批准來源：憲章 §16.E 執行第 1 點 ——
  // 「已批准：dse_progress、dse_free_attempts_total、dse_topic_stats」，
  // Brian ＋ Yuna 2026-09-04 雙簽，全文見 docs/charter-amendment-2026-09-04.md。
  //
  // 過咗上面三條問題：入面【冇】學生寫嘅字、【冇】答案原文、【冇】情緒 ——
  // 每個課題只有 { total, wrong, label, subjectId, topic } 五個數字／標籤。
  // 「可以推斷個人強弱」呢點【係真】，而呢一點正正就係 §16.E 單獨開題、
  // 單獨裁決嘅嘢：准上雲，但七條約束同時生效（只限本人查閱、禁第三方、
  // 禁跨用戶比較、唔做付費牆…）。
  //
  // ⚠️ 呢個批准【只涵蓋呢一個 key】。§16.E 約束 6：新增任何一個 key
  // 仍須創辦人書面批准 —— 唔可以攞呢行做先例去加下一個。
  'dse_topic_stats',

  // ══ 2026-09-08 加入。兩個 key 都【含答案原文】。══
  //
  // 呢兩行推翻咗本檔頂嗰段嘅原意，所以要講清楚點解唔算走返轉頭：
  // 2026-08-26 嗰次修正嘅問題，係 `selectedZh` 【冇人為呢件事做過決定】
  // 就上咗雲 —— 係一個漏，唔係一個取捨。今次係有人開題、有理由、有簽名。
  //
  // 裁決：Yuna（COO）2026-09-08 單獨開題並選定「選項 C：整個上傳」。
  // 理由：手機做到一半，返到屋企用 iPad 接唔返，對焦慮症同 SEN 學生
  // 造成嘅打擊，大過答案原文留喺 server 嘅風險（憲章 §1.1）。
  // ⬜ 待 Brian 副署。全文：docs/charter-amendment-2026-09-08.md
  //
  // 同時生效：§16.E 約束 1／2／3 不變（只限本人查閱、禁第三方、禁跨用戶比較）。
  // 私隱頁已同步（app/privacy/PrivacyClient.tsx），StoredDataInspector
  // 亦已列出（有 trust-disclosure.test.mts 把關）。
  'dse_active_session', // answers[].selectedZh
  'dse_reverse_log', // selected / correct
]

// 呢張名單【冇縮水嘅意思】—— 下面每一個仍然係硬紅線。
// 情緒、時間囊、作文原文、心情備註：呢啲係學生寫畀自己嘅字，
// 唔係佢答題揀嘅選項。兩者性質唔同，唔可以攞 2026-09-08 個決定做先例。
const FORBIDDEN_UPLOAD_KEYS = [
  'dse_emotion_log', // 情緒
  'dse_capsule', // 學生寫畀自己嘅信
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

// 2026-09-08：呢條測試原本斷言「答案原文永遠唔可以上傳」。選項 C 之後
// 個方向反轉咗，所以佢改為鎖住【新界線】而唔係刪走 ——
// 一條刪走咗嘅測試，等於一條冇人守嘅界線。
//
// 新界線：學生【揀】嘅嘢（選項）可以上雲；學生【寫】嘅嘢永遠唔可以。
test('學生自己寫嘅字，一個字都唔可以出現喺上傳 payload', () => {
  const body = snapshotBody()
  // 呢四個 key 分別係：情緒記錄、寫畀自己嘅時間囊、作文草稿、心情備註。
  // 佢哋同「揀邊個選項」性質完全唔同 —— 2026-09-08 個決定唔涵蓋佢哋，
  // 亦唔可以攞嚟做先例。
  for (const k of ['dse_emotion_log', 'dse_capsule', 'dse_writing_draft', 'dse_logic_log']) {
    assert.ok(!body.includes(k), `snapshotLocal() 掂到 ${k} —— 學生寫畀自己嘅字，唔可以離開部機`)
  }
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
