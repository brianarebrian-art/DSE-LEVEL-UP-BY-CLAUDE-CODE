import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

// 對外披露嘅守門測試。
//
// 呢兩個功能（題目來源披露、本機數據面板）嘅全部價值都建立喺「講嘅嘢係真」。
// 一旦顯示嘅內容同實情脫節，傷害比冇做過更大 —— 所以每一句可以量化嘅聲稱
// 都喺呢度釘住。

const prov = await import('../../data/provenance.ts')
const { REVIEWED, REVIEW_BATCHES, REVIEWED_COUNT, getReviewRecord } = prov
const inspector = await import('../../components/StoredDataInspector.tsx')
const { CLOUD_KEYS } = inspector

test('provenance 生成檔冇過時 —— 重新生成必須一模一樣', async () => {
  // 靜態生成檔嘅代價就係會過時。CI 跑到呢條就會即刻發現。
  const gen = await import('../../scripts/gen-provenance.mjs')
  // 生成器係 .mjs，冇型別 —— 明確標註返，免得 tsc 當佢係 {}。
  const entries = gen.collect().entries as Record<string, { reviewer: string; reviewedAt: string }>
  const fresh = Object.keys(entries).sort()
  const current = Object.keys(REVIEWED).sort()
  assert.deepEqual(
    current, fresh,
    'data/provenance.ts 同 decisions.json 唔同步 —— 跑 `node scripts/gen-provenance.mjs`',
  )
  for (const id of fresh) {
    assert.equal(REVIEWED[id].reviewer, entries[id].reviewer, `${id} 審批人對唔上`)
    assert.equal(REVIEWED[id].reviewedAt, entries[id].reviewedAt, `${id} 審批日期對唔上`)
  }
})

test('每筆審批紀錄都有實名審批人同日期 —— 機器唔可以代簽', () => {
  for (const [id, rec] of Object.entries(REVIEWED)) {
    assert.ok(rec.reviewer.trim().length > 0, `${id}：審批人空白`)
    assert.match(rec.reviewedAt, /^\d{4}-\d{2}-\d{2}$/, `${id}：日期格式唔啱（${rec.reviewedAt}）`)
    assert.ok(rec.batch.trim().length > 0, `${id}：批次空白`)
  }
})

test('REVIEWED_COUNT 同實際筆數一致', () => {
  assert.equal(REVIEWED_COUNT, Object.keys(REVIEWED).length)
})

test('批次彙總嘅題數加起身等於總數（唔會虛報）', () => {
  const sum = REVIEW_BATCHES.reduce((s, b) => s + b.approved, 0)
  // 同一條題可以喺多過一個批次出現（例如翻譯回填重審），所以彙總 ≥ 唯一 id 數。
  assert.ok(sum >= REVIEWED_COUNT, `彙總 ${sum} 少過唯一題數 ${REVIEWED_COUNT}，代表有批次漏報`)
})

test('查唔存在嘅題目回 undefined —— 唔會拗直一個「已審核」', () => {
  assert.equal(getReviewRecord('this-question-does-not-exist'), undefined)
  assert.equal(getReviewRecord(''), undefined)
})

test('上雲清單同兩條同步通道完全對應', () => {
  // 面板向學生講「呢幾項會上傳」。若任何一條通道加咗 key 而面板冇跟，
  // 學生就會見到一個講漏嘢嘅承諾 —— 呢個係最唔可以出嘅錯。
  //
  // 實際踩過嘅坑：初版只對 lib/sync.ts，漏咗 lib/settingsSync.ts 條通道，
  // 真實上傳數目由 4 變 12。所以呢條測試同時掃兩個檔。
  const grab = (file: string) =>
    [...fs.readFileSync(file, 'utf8').matchAll(/\bdse_[a-z_]+\b/g)].map((m) => m[0])

  // 同步機制自身嘅簿記 key —— 唔係學生數據，唔算「上傳你嘅嘢」。
  const BOOKKEEPING = new Set(['dse_updated_at', 'dse_synced_at', 'dse_sync_owner'])
  // settingsSync 檔頭有一段「唔存在／改咗名」嘅反面例子註解，唔可以當真 key。
  const NOT_REAL = new Set(['dse_dark_mode', 'dse_dyslexic_font', 'dse_focus_mode', 'dse_focus_today'])

  const found = new Set(
    [...grab('lib/sync.ts'), ...grab('lib/settingsSync.ts')]
      .filter((k) => !BOOKKEEPING.has(k) && !NOT_REAL.has(k)),
  )
  // sessionResume / GlobalA11y 嘅 key 經 import 常數帶入，字面上唔會出現喺上面兩個檔。
  for (const k of ['dse_active_session', 'dse_font_size', 'dse_line_height', 'dse_letter_spacing']) found.add(k)

  assert.deepEqual(
    [...CLOUD_KEYS].sort(), [...found].sort(),
    'StoredDataInspector 嘅 CLOUD_KEYS 同實際上傳嘅 key 對唔上 —— 兩邊必須同步改',
  )
})

test('情緒記錄永不喺上雲清單', () => {
  // 憲章紅線：情緒／精神健康數據唔上雲。呢條測試令佢唔可以靜靜被加返入去。
  assert.ok(
    !(CLOUD_KEYS as readonly string[]).includes('dse_emotion_log'),
    'dse_emotion_log 出現喺上雲清單 —— 情緒數據唔可以離開本機',
  )
})
