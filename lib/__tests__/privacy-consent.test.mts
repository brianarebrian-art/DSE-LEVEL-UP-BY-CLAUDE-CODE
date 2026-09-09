// 私隱同意閘 —— build-time 鎖。
//
// 呢個檔守兩件事，兩件都係「錯咗冇人會發現」嗰類：
//
//   ① 政策文案改咗，但 POLICY_VERSION 冇 bump
//      → 舊同意紀錄會靜靜哋扮成「佢同意過新版」。同意書就變成一句
//        「佢撳過個掣」，證明唔到佢究竟同意咗乜。
//
//   ② 同意閘變成一道牆
//      → 憲章 §3 全部功能免費無門檻；Phase 1 選項 B 明文寫住
//        「唔同意照樣用得晒成個網站」。呢點靠 SyncProvider 只 gate 同步，
//        唔 gate 任何路由或者功能。有人日後喺 middleware／layout 加一個
//        重新導向，呢條測試要嗌。
import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const { POLICY_VERSION, CONSENT_POINTS, DECLINE_NOTE } = await import('../privacy/consent.ts')

// ── ① 版本 parity ─────────────────────────────────────────────────────────
//
// 基準 hash 係「政策文案 ＋ 同意書摘要」嘅內容指紋。任何一邊改咗字，
// hash 就變，而呢條測試會 fail —— 除非同時 bump POLICY_VERSION 並更新基準。
//
// 更新做法（改完文案之後）：
//   1. 喺 lib/privacy/consent.ts bump POLICY_VERSION（例：2026-09-09.v1 → .v2）
//   2. 跑 npm test，由 fail 訊息抄返新 hash 入下面 EXPECTED
//   3. 兩步都做完先 commit —— 只做第 2 步就係喺閘度作弊
const EXPECTED = {
  version: '2026-09-09.v1',
  hash: 'b2e44e871df73cd2', // 2026-09-09 基準。改文案 → bump version ＋ 更新呢個。
}

function policyFingerprint(): string {
  const privacyCopy = read('app/privacy/PrivacyClient.tsx')
  const summary = JSON.stringify({ CONSENT_POINTS, DECLINE_NOTE })
  return createHash('sha256').update(privacyCopy).update(summary).digest('hex').slice(0, 16)
}

test('政策文案改咗就一定要 bump POLICY_VERSION', () => {
  const actual = policyFingerprint()
  if (!EXPECTED.hash) {
    // 首次建立基準：唔算 fail，但要留低指紋畀下次比對。
    assert.ok(actual.length === 16, '指紋計唔到')
    return
  }
  assert.equal(
    actual,
    EXPECTED.hash,
    `私隱政策文案／同意書摘要改咗，但基準指紋冇更新。\n` +
      `新指紋：${actual}\n` +
      `如果係刻意改文案：先 bump lib/privacy/consent.ts 嘅 POLICY_VERSION，` +
      `再將上面個 hash 填入本檔 EXPECTED。兩步都要做 —— ` +
      `只更新 hash 而唔 bump 版本，等於畀舊同意紀錄扮成同意咗新版。`,
  )
  assert.equal(
    POLICY_VERSION,
    EXPECTED.version,
    'POLICY_VERSION 同基準對唔上 —— bump 咗就要一齊更新本檔 EXPECTED.version',
  )
})

// ── ② 同意閘唔可以變成一道牆 ─────────────────────────────────────────────
test('唔同意唔可以擋住任何路由或者功能（Phase 1 選項 B）', () => {
  const gate = read('components/PrivacyConsentGate.tsx')
  for (const banned of ['router.push', 'router.replace', 'redirect(', 'window.location']) {
    assert.ok(
      !gate.includes(banned),
      `PrivacyConsentGate 用咗 ${banned} —— 同意閘唔可以趕人走。` +
        `憲章 §3：全部功能免費、無門檻；唔同意只係唔開同步。`,
    )
  }
  // 兩個掣都要存在，而且「而家唔好」唔可以係死路。
  assert.match(gate, /onClick=\{accept\}/, '搵唔到「同意」掣')
  assert.match(gate, /onClick=\{decline\}/, '搵唔到「而家唔好」掣')
  assert.match(gate, /setOpen\(false\)/, '「而家唔好」要關得到個 modal')
})

test('同步一定要 gate 喺同意之上，而且預設係唔同步', () => {
  const sp = read('components/SyncProvider.tsx')
  assert.match(
    sp,
    /useState\(false\)/,
    'consentOk 預設值唔係 false —— 查唔到同意就會 fail-open，全部人喺冇同意之下上雲',
  )
  assert.match(sp, /const maySync = authStatus === 'authenticated' && consentOk/, '搵唔到 maySync 閘')
  // 四個同步觸發點一個都唔可以漏。漏咗一個，嗰條路徑就會繞過同意。
  assert.ok(
    !/if \(authStatus === 'authenticated'\) (void pullMerge|schedulePush)/.test(sp),
    '仲有同步觸發點淨係查 authStatus，冇查同意 —— 嗰條路徑會繞過同意閘',
  )
})

test('同意紀錄唔可以由 client 話畀 server 聽係邊個版本', () => {
  const route = read('app/api/privacy/consent/route.ts')
  assert.ok(
    !/request\.json\(\)/.test(route),
    'POST 讀緊 request body —— 版本號一定要由 server 嘅 POLICY_VERSION 決定，' +
      '否則改個 request 就可以扮成同意咗一個佢冇睇過嘅版本',
  )
  assert.match(route, /policy_version: POLICY_VERSION/, '寫入嘅版本要嚟自 server 常數')
})
