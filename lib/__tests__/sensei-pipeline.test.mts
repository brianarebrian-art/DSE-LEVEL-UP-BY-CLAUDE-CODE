// ============================================================================
// sensei-pipeline.test.mts —— 零模型 SENSEI 卡片管線
// ----------------------------------------------------------------------------
// 呢度鎖住三樣，全部都係「靠人記住就一定會走漏」嘅嘢：
//
//  ① 虛擬 persona 唔可以簽名。2026-08-25 嘅執行令將 `signed_by TEXT NOT NULL`
//     配「Carson 親手簽名負責」—— 一個必填簽名欄填住唔存在嘅人名，
//     比留白更差，因為佢製造咗一條睇落有審核嘅紀錄。所以要代碼攔，唔可以靠清單。
//  ② 卡片唔可以有分數欄位（憲章 §16.A）。用白名單，唔用黑名單 ——
//     黑名單擋得住 `score`，擋唔住 `marks`／`bandScore`／`markingCriteria`。
//  ③ 兩條管線（題庫／卡片）唔可以各自漂移：一邊收緊、另一邊冇跟，等於冇收緊過。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { checkReviewer, VIRTUAL_PERSONAS } from '../../scripts/qbank/_reviewer-gate.mjs'
import { gateCard, STRICT_KEYS } from '../../scripts/qbank/_card-gate.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

// 刻意寫死 —— 唔 import data/sensei/types.ts。
// 兩個原因：① tsx 將 .ts 當 CJS，named export 攞唔到（repo 現有測試對 data/*.ts
// 一律只用 `import type`）；② 寫死之後，下面「原始碼要對得上」嗰兩條斷言
// 就會喺有人靜靜改 types.ts 嗰陣紅 —— 比直接 import 更強。
const SENSEI_SUBJECTS = ['chinese', 'english', 'math', 'economics'] as const
const CARD_SECTIONS = ['concept', 'example', 'examTechnique', 'commonTrap'] as const
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
/** 剷走註釋 —— 唔剷嘅話，一句「唔可以自動入庫」嘅註釋就可以令斷言假通過。 */
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

const validCard = {
  id: 'econ-demo',
  subject: 'economics',
  topic: '共用品',
  difficulty: 'basic',
  source: 'syllabus',
  concept: '共用品指同時具備非排他性與非競爭性的物品，任何人使用都不會減少他人可用的數量。',
  example: '路燈是典型例子：一個人在燈下閱讀，不會令另一個人得到的光線減少。',
  examTechnique: '作答時必須同時指出兩項特性，只寫其中一項通常只能取得一半分數。',
  commonTrap: '考生常把共用品與政府提供的物品混為一談，但提供者是誰並非判斷準則。',
  keywords: ['共用品', '非排他性'],
}

// ── ① 簽名閘 ────────────────────────────────────────────────────────────────

test('簽名閘：留白 = 停機', () => {
  assert.equal(checkReviewer('').ok, false)
  assert.equal(checkReviewer('   ').ok, false)
  assert.equal(checkReviewer(null).ok, false)
})

test('簽名閘：虛擬 persona 冒簽會被攔（連帶職銜／中文括號都攔到）', () => {
  for (const name of ['Carson', 'carson', 'Amity 簽名', 'Carson（經濟首席）', 'Victor', 'ARTHUR', 'Kelly QA']) {
    assert.equal(checkReviewer(name).ok, false, `"${name}" 應該被攔`)
  }
})

test('簽名閘：真人放行 —— Brian／Yuna 刻意唔喺 persona 名單', () => {
  assert.equal(VIRTUAL_PERSONAS.has('brian'), false, 'Brian 係真人創辦人，唔可以加入 persona 名單')
  assert.equal(VIRTUAL_PERSONAS.has('yuna'), false, 'Yuna 係真人創辦人，唔可以加入 persona 名單')
  for (const name of ['brian', 'Yuna', '望咩望,未見過海綿寶寶咩?']) {
    assert.equal(checkReviewer(name).ok, true, `"${name}" 應該放行`)
  }
})

test('簽名閘：現有題庫嘅 reviewer 全部仍然過到（加閘零回歸）', () => {
  // 憲章 §6：收緊閘之前要量影響。落閘當日全部 decisions 檔只有呢兩個名。
  for (const name of ['brian', '望咩望,未見過海綿寶寶咩?']) {
    assert.equal(checkReviewer(name).ok, true)
  }
})

// ── ② 卡片閘 ────────────────────────────────────────────────────────────────

test('卡片閘：正常卡片過閘', () => {
  assert.deepEqual(gateCard(validCard, 'economics'), [])
})

test('卡片閘：任何分數欄位一律攔死（憲章 §16.A 結構性防線）', () => {
  for (const field of ['score', 'marks', 'grade', 'bandScore', 'markingCriteria', 'markingScheme', 'rubric']) {
    const errs = gateCard({ ...validCard, [field]: 'anything' }, 'economics')
    assert.ok(errs.some((e: string) => e.includes(field)), `分數類欄位 "${field}" 必須被攔`)
  }
})

test('卡片閘：白名單本身唔可以有分數欄位', () => {
  for (const k of STRICT_KEYS) {
    assert.ok(!/score|mark|grade|rubric|band/i.test(k), `白名單唔應該有 "${k}" —— 憲章 §16.A`)
  }
})

test('卡片閘：四段式缺一唔可', () => {
  for (const sec of CARD_SECTIONS) {
    const errs = gateCard({ ...validCard, [sec]: undefined }, 'economics')
    assert.ok(errs.length > 0, `缺【${sec}】應該被攔`)
  }
})

test('卡片閘：冇 keywords 就永遠檢索唔到，要攔', () => {
  assert.ok(gateCard({ ...validCard, keywords: [] }, 'economics').length > 0)
})

// ── ③ 防漂移 ────────────────────────────────────────────────────────────────

test('兩條管線共用同一道簽名閘（唔可以各自實作）', () => {
  const promote = stripComments(read('scripts/qbank/promote-drafts.mjs'))
  const senseiPromote = stripComments(read('scripts/qbank/promote-sensei-cards.mjs'))
  for (const [label, src] of [['題庫', promote], ['卡片', senseiPromote]] as const) {
    assert.match(src, /_reviewer-gate\.mjs/, `${label}管線要 import 共用簽名閘`)
    assert.match(src, /assertReviewer\(/, `${label}管線要真係叫用 assertReviewer`)
  }
})

test('卡片 promote 係 default-deny —— 唔係 approved 一律唔要', () => {
  const src = stripComments(read('scripts/qbank/promote-sensei-cards.mjs'))
  assert.match(src, /!==\s*'approved'/, 'default-deny 判斷唔見咗')
  assert.match(src, /approved\.length/, '零批准要拒絕寫檔')
})

test('term-guard 有掃 data/sensei/ 而且會遞歸入 reviewed/', () => {
  const src = stripComments(read('scripts/qbank/term-guard.mjs'))
  assert.match(src, /data\/sensei\//, 'term-guard 冇掃卡片庫')
  assert.match(src, /walkSubject/, '冇遞歸 —— 已批准嘅卡會避開術語閘')
})

test('SENSEI_SUBJECTS 同 load.ts 嘅 loader 一一對應', () => {
  const src = read('data/sensei/load.ts')
  for (const s of SENSEI_SUBJECTS) {
    assert.match(src, new RegExp(`\\b${s}:\\s*async`), `load.ts 冇 ${s} 嘅 loader`)
    assert.ok(existsSync(join(ROOT, `data/sensei/${s}/index.ts`)), `data/sensei/${s}/index.ts 唔存在`)
  }
})

test('每科 index.ts 都係人手接線（唔准自動 glob 入庫）', () => {
  for (const s of SENSEI_SUBJECTS) {
    const src = read(`data/sensei/${s}/index.ts`)
    assert.ok(!/readdirSync|import\.meta\.glob|require\.context/.test(src),
      `${s}/index.ts 唔可以自動掃 reviewed/ —— 憲章 §12：機器永不自動入庫`)
  }
})

test('寫死嘅常數同 data/sensei/types.ts 對得上', () => {
  const src = read('data/sensei/types.ts')
  assert.match(src, new RegExp(`SENSEI_SUBJECTS = \\[${SENSEI_SUBJECTS.map((s) => `'${s}'`).join(', ')}\\]`))
  assert.match(src, new RegExp(`CARD_SECTIONS = \\[${CARD_SECTIONS.map((s) => `'${s}'`).join(', ')}\\]`))
})

test('KnowledgeCard 型別本身冇任何分數欄位', () => {
  const src = stripComments(read('data/sensei/types.ts'))
  const iface = src.slice(src.indexOf('interface KnowledgeCard'), src.indexOf('CardDraft'))
  assert.ok(!/\b(score|marks|grade|rubric|bandScore)\b/i.test(iface), 'KnowledgeCard 唔可以有分數欄位')
})

test('上線腳本唔可以繞過簽名閘', () => {
  const src = stripComments(read('scripts/qbank/sensei-golive.mjs'))
  assert.match(src, /_reviewer-gate\.mjs/, '上線腳本要 import 共用簽名閘')
  assert.match(src, /assertReviewer\(/, '上線腳本要真係叫用 assertReviewer')
  // 唔可以自己寫死一個預設名 —— 冇 --reviewer 就要停機，唔可以「幫手」填。
  // 呢兩條斷言嘅寫法係實試過先定落嚟：第一版只睇 `reviewer = "名"`，
  // 攔唔到 `assertReviewer(RAW || "yuna")` 呢種 fallback 寫法。
  assert.match(src, /assertReviewer\(\s*RAW\s*\)/, 'reviewer 只可以由 --reviewer 而嚟')
  assert.ok(!/assertReviewer\([^)]*(\|\||\?\?)/.test(src), 'assertReviewer 唔可以有 fallback 預設值')
  assert.ok(!/reviewer\s*=\s*['"`][A-Za-z\u4e00-\u9fff]/.test(src), '上線腳本唔可以內置預設 reviewer 名')
  assert.match(src, /RAW === null/, '冇 --reviewer 要停機')
})

test('上線腳本產生嘅 index.ts 依然係明文 import，唔係 glob', () => {
  const src = stripComments(read('scripts/qbank/sensei-golive.mjs'))
  // 腳本自己讀目錄係為咗搵草稿；但佢【寫出嚟】嗰個 index.ts 唔可以帶掃描邏輯。
  const written = src.slice(src.indexOf('export const ${subject}SenseiCards'))
  assert.ok(!/readdirSync|import\.meta\.glob|require\.context/.test(written),
    '產生出嚟嘅 index.ts 唔可以自動掃 reviewed/ —— 憲章 §12')
})

test('/admin 同 pull-decisions 用同一套 sensei 批次名前綴', () => {
  // 兩邊各自寫死一次前綴格式，一改一唔改就會靜靜寫錯目錄。
  const page = stripComments(read('app/admin/page.tsx'))
  const pull = stripComments(read('scripts/qbank/pull-decisions.mjs'))
  assert.match(page, /`sensei\/\$\{subject\}\/\$\{stem\}`/, '/admin 要用 sensei/<科>/<批次> 做批次名')
  assert.match(pull, /\^sensei\\\/\(\[a-z0-9-\]\+\)\\\/\(\.\+\)\$/, 'pull-decisions 要識返同一個前綴')
})

test('/admin 卡片渲染唔會出分數或正解', () => {
  const src = read('app/admin/ReviewPanel.tsx')
  const branch = src.slice(src.indexOf("row.type === 'card' ?"), src.indexOf("(row.type ?? 'mc') === 'mc' ?"))
  assert.ok(branch.length > 100, '搵唔到卡片渲染分支')
  // 只捉【真係渲染緊】正解／分數嘅嘢。呢度唔可以順手加「分數」兩個字落 regex ——
  // 分支本身有一句警告寫住「亦唔會出任何分數」，會令斷言反過嚟捉住自己。
  assert.ok(!/correctIndex|✓ 正解|row\.options|markingScheme/.test(branch),
    '卡片分支唔可以渲染正解或分數 —— 憲章 §16.A')
})

test('Vercel 打包有 include SENSEI 草稿（唔 include 線上會靜靜空白）', () => {
  // ⚠️ 呢度【刻意唔用 stripComments】。glob `sensei/*/drafts/*.json` 入面
  // 個 `/*` 同 `*/` 會被區塊註釋 regex 當成一對註釋符剷走，令斷言永遠 false。
  // 改為由 raw source 抽出 outputFileTracingIncludes 區塊再驗 —— 範圍夠窄，
  // 唔會被附近嘅註釋誤中。
  const raw = read('next.config.ts')
  const i = raw.indexOf('outputFileTracingIncludes')
  assert.ok(i > -1, 'next.config 冇 outputFileTracingIncludes')
  const block = raw.slice(i, raw.indexOf('},', i))
  assert.ok(block.includes('./data/sensei/*/drafts/*.json'), 'outputFileTracingIncludes 漏咗卡片草稿')
  assert.ok(block.includes('./scripts/qbank/drafts/*.json'), '唔可以順手剷走題目草稿嘅 include')
})
