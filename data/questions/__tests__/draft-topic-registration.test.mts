// ============================================================================
// draft-topic-registration.test.mts —— 草稿嘅 topicId 必須已登記
// ----------------------------------------------------------------------------
// 點解要有呢個閘：
// promote-drafts.mjs 會把草稿嘅 `topicId` 直接寫入題庫，但【唔會驗】呢個 id
// 喺唔喺該科嘅 curated topics 清單入面。一旦唔喺，條題目就變成「孤兒課題」——
// 題喺庫入面存在，但學生用課題入口（/practice?subject=X&topic=Y、科目頁嘅
// 課題 chips、/notes）永遠篩唔到。呢件事已經真實發生過：現存題庫仍有 58 條
// 孤兒題（見 node scripts/qbank/topic-coverage.mjs）。
//
// 呢個閘擺喺【草稿】層而唔係 promote 層，係因為咁樣問題會喺真人審批之前就浮面 ——
// 審批完先發現要改 id，等於要重新審一次。
//
// 修法：唔係喺呢度加豁免，而係去該科嘅 *Topics 登記個 id。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

const { getSubjectTopics } = await import('../index.ts')

const DRAFTS = 'scripts/qbank/drafts'

// 草稿檔名 → 科目 id。冇喺呢度登記嘅草稿檔會被跳過並喺下面單獨報告，
// 以免新增草稿時靜靜地繞過本閘。
const SUBJECT_OF: Record<string, string> = {
  // 已入庫嘅早期書寫題批次 —— 一併納入，令現存登記狀態亦有迴歸保護。
  'chinese-fanwen-long-batch1.json': 'chinese',
  'chinese-p2-writing-batch1.json': 'chinese',
  'english-written-batch1.json': 'english',
  'math-long-batch-1.json': 'math',
  'history-p2-essays.json': 'history',
  'history-floor.json': 'history',
  'chinese-history-floor.json': 'chinese-history',
  'chinese-literature-floor.json': 'chinese-literature',
  'chinese-p2-writing-batch2.json': 'chinese',
  'chinese-p2-writing-batch3.json': 'chinese',
  'chinese-p1-fillin.json': 'chinese',
  'math-p1-long.json': 'math',
  // 2026-08-29 中文寫作四組（階段目標一）。b4 用嘅 material_essay 係新課題，
  // 已同步喺 chinese.ts 以 count: 0 登記 —— 跟返上面四個書寫課題嘅做法，
  // 未有 MC 之前唔會出現喺課題 chips，但 promote 之後唔會變孤兒。
  'chinese-writing-b1.json': 'chinese',
  'chinese-writing-b2.json': 'chinese',
  'chinese-writing-b3.json': 'chinese',
  'chinese-writing-b4.json': 'chinese',
}

// ── 草稿正本 vs 派生檔 ──────────────────────────────────────────────────────
// 呢個目錄同時放【草稿正本】同【由草稿正本衍生出嚟嘅檔】。派生檔全部帶固定後綴：
//   .decisions.json  審批決定（review-drafts / sample-review / promote-drafts）
//   .rejected.json   機器閘剔走嘅題（auto-promote.mts:140）
//   .sample.json     抽樣覆核抽中嗰批（sample-review.mjs:65）
//   .review.html     人手覆核頁（唔係 .json，本來就唔會入選）
//
// 2026-08-27：本閘原本淨係排除 .decisions.json，於是一個 .sample.json 出現
// 就會被當成「一份未登記所屬科目嘅新草稿」而令下面條 test 紅。
// 因為派生檔係跑工具嗰陣先出現、跑完可能又刪走，個 fail 表現成【間歇性】——
// 跑一次紅、再跑一次綠，同測試碼本身完全無關。實測重現：drafts 目錄放一個
// math-p1-long.sample.json 入去，`npm test` 即刻由 601 pass 變成 600 pass / 1 fail。
//
// 呢種紅最貴嘅唔係嗰一次 fail，係佢會訓練人「再跑一次睇下」—— 而呢個套件正正
// 係題庫改動嘅閘門（loader-parity、topic 註冊、seen-window）。養成重跑習慣之後，
// 一次真正嘅回歸就會被當成 flake 忽略。
//
// 修法係【補全派生後綴清單】，唔係收窄掃描範圍 —— 掃描係本閘嘅牙齒：
// 一份真‧新草稿跌入呢個目錄，仍然必須令本閘紅（見下面「唔准靜靜繞過本閘」）。
// .rejected.json 一直都喺呢個清單之外，之前冇爆純粹係好彩 —— 現有 rejected 檔
// 啱好全部冇 long/text ＋ topicId 嘅組合；一個長題批次嘅 rejected 檔會一模一樣咁爆。
const DERIVED_SUFFIXES = ['.decisions.json', '.rejected.json', '.sample.json']

/** 只有草稿正本受本閘管；派生檔唔係草稿。 */
const isSourceDraft = (name: string) =>
  name.endsWith('.json') && !DERIVED_SUFFIXES.some((sfx) => name.endsWith(sfx))

const files = readdirSync(DRAFTS).filter(isSourceDraft)

for (const [file, subject] of Object.entries(SUBJECT_OF)) {
  test(`${file}：全部 topicId 都已喺 ${subject} 登記`, () => {
    assert.ok(files.includes(file), `草稿檔 ${file} 唔見咗 —— 改名或刪走咗就要一齊更新本測試`)
    const registered = new Set((getSubjectTopics(subject) as { id: string }[]).map((t) => t.id))
    assert.ok(registered.size > 0, `${subject} 冇登記任何課題`)
    const rows: { id: string; topicId?: string }[] = JSON.parse(readFileSync(`${DRAFTS}/${file}`, 'utf8'))
    const missing = [...new Set(rows.filter((r) => r.topicId && !registered.has(r.topicId)).map((r) => r.topicId!))]
    assert.deepEqual(
      missing, [],
      `未登記嘅 topicId（promote 之後會變孤兒課題，學生永遠篩唔到）：${missing.join('、')}\n` +
      `→ 去 data/questions/${subject === 'chinese-history' ? 'chinese-history' : subject}.ts 嘅 *Topics 登記，唔好喺呢度加豁免。`,
    )
  })
}

test('每個草稿檔都有登記所屬科目（唔准靜靜繞過本閘）', () => {
  // 只管本輪新增嘅書寫題草稿。舊 MC 草稿檔一直用中文標籤做 topic（見 _gate.mjs
  // 註釋），佢哋嘅孤兒問題係另一條軌，唔喺呢度處理 —— 硬加會即刻誤殺 21 條
  // 等緊人手審嘅草稿（憲章 §6：唔准以 feature change 令現有數據集失效）。
  const written = files.filter((f) => {
    try {
      const rows = JSON.parse(readFileSync(`${DRAFTS}/${f}`, 'utf8'))
      return Array.isArray(rows) && rows.some((r) => r?.type === 'long' || r?.type === 'text')
    } catch { return false }
  })
  const unmapped = written.filter((f) => !(f in SUBJECT_OF))
  assert.deepEqual(
    unmapped.filter((f) => {
      const rows = JSON.parse(readFileSync(`${DRAFTS}/${f}`, 'utf8'))
      return rows.some((r: { topicId?: string }) => r?.topicId) // 只有用 topicId 嘅先受本閘管
    }),
    [],
    '有書寫題草稿用咗 topicId 但未喺 SUBJECT_OF 登記所屬科目',
  )
})

// ── 防「間歇性紅」回歸 ──────────────────────────────────────────────────────

test('派生檔唔會被當成草稿正本', () => {
  for (const name of ['x.decisions.json', 'x.rejected.json', 'x.sample.json']) {
    assert.equal(isSourceDraft(name), false, `${name} 係派生檔，唔應該當成草稿正本`)
  }
  assert.equal(isSourceDraft('x.review.html'), false, '.html 唔係草稿')
  // 牙齒要留住：草稿正本必須照樣受閘管，唔可以為咗熄紅而一齊排除。
  assert.equal(isSourceDraft('math-p1-long.json'), true)
  assert.equal(isSourceDraft('chinese-ywsy.drafts.json'), true, '.drafts.json 係正本輸出，唔係派生檔')
})

test('工具寫嘅派生後綴全部已登記（新增一種就要喺呢度登記）', () => {
  // 呢條 test 令上面條清單【自己會過期】：邊個喺 scripts/qbank/ 加一種新嘅派生檔
  // （例如 .audit.json），呢度即刻紅，逼佢去 DERIVED_SUFFIXES 登記，
  // 而唔係等半年後有人喺 CI 見到一次搞唔清嘅間歇性 fail。
  const SCRIPTS = 'scripts/qbank'
  // 正本輸出名，唔係派生檔 —— arts-variant-factory --out <name>.drafts.json
  const SOURCE_OUTPUT_SUFFIXES = ['.drafts.json']
  const found = new Set<string>()
  for (const f of readdirSync(SCRIPTS).filter((n) => n.endsWith('.mjs') || n.endsWith('.mts'))) {
    const src = readFileSync(`${SCRIPTS}/${f}`, 'utf8')
    for (const m of src.matchAll(/\.[a-z][a-z0-9-]*\.json\b/g)) found.add(m[0])
  }
  const known = [...DERIVED_SUFFIXES, ...SOURCE_OUTPUT_SUFFIXES]
  const unregistered = [...found].filter((sfx) => !known.includes(sfx)).sort()
  assert.deepEqual(
    unregistered, [],
    `scripts/qbank/ 出現咗未登記嘅 *.json 派生後綴：${unregistered.join('、')}\n` +
    '→ 如果佢係由草稿衍生出嚟嘅檔，加入 DERIVED_SUFFIXES；如果佢本身係草稿正本，' +
    '加入 SOURCE_OUTPUT_SUFFIXES。唔登記嘅話，佢一出現就會令本檔嘅掃描閘間歇性紅。',
  )
})
