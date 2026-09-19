// ============================================================================
// cantonese-review-gate.test.mts —— 粵拼未經真人審過，唔准出街
// ----------------------------------------------------------------------------
// ══ 守緊乜 ══
// /cantonese 嘅四欄對照入面，【粵拼】係事實資料，而且錯咗冇人會知：
//   · term-guard／i18n-guard／copy-guard 全部唔識粵拼，一條都捉唔到
//   · 唔會 build fail、唔會有紅字、唔會有人投訴
//   · 一個聲調數字寫錯，學生照住讀就係讀錯咗個音，而學語言嘅人一旦記錯個音，
//     改返好過學新嘅難 —— 而呢批學生正正就係呢版想幫嗰批
//
// 所以內容行同題庫一樣嘅規矩（憲章 §12）：`data/cantonese.ts` 嘅
// `REVIEW.reviewer` 留白 = 唔 render，頁面出「仲未上線」。
//
// 呢條測試守兩件事：
//   ① 個閘接線冇斷 —— page.tsx 真係由 REVIEW.reviewer 推導 `signed`，
//      而卡片真係靠 `signed` 決定出唔出對照
//   ② 簽名唔可以由機器填 —— reviewer 有值嗰陣，必須係一個真人名，
//      唔可以係 'claude' / 'ai' / 'bot' 之類
//
// ⚠️ ② 呢半唔係防「有人打錯字」，係防【我自己】。今日已經有一次：
//    攞一個已簽名嘅批次去做煙霧測試，結果洗咗 brian 個簽名。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const { REVIEW, CAMPUS_TOPICS } = await import('../../data/cantonese.ts')

test('① 簽名閘接住線 —— 頁面由 REVIEW.reviewer 推導，卡片靠佢決定出唔出', () => {
  const page = read('app/cantonese/page.tsx')
  assert.match(
    page,
    /signed=\{REVIEW\.reviewer\.trim\(\)\.length > 0\}/,
    'page.tsx 冇由 REVIEW.reviewer 推導 signed —— 個閘斷咗線，內容會無條件出街',
  )
  const card = read('components/CantoneseDseCard.tsx')
  assert.match(card, /signed \?/, 'CantoneseDseCard 冇用 signed 分支 —— 對照會照出')
  assert.match(
    card,
    /\{p\.jyut\}/,
    'CantoneseDseCard 冇 render p.jyut —— 呢條測試守緊嘅嘢已經唔存在，要重寫測試',
  )
})

test('② 簽名必須係真人 —— 機器唔准自己填', () => {
  const name = REVIEW.reviewer.trim().toLowerCase()
  if (!name) return // 未簽名 = 內容唔出街，合法狀態
  for (const forbidden of ['claude', 'ai', 'bot', 'machine', 'auto', 'system', '機器', 'agent']) {
    assert.notEqual(
      name,
      forbidden,
      `data/cantonese.ts 嘅 REVIEW.reviewer 填咗「${REVIEW.reviewer}」——` +
        `憲章 §12：機器永不自動入庫，簽名位只准真人填。`,
    )
  }
  assert.match(
    REVIEW.reviewedAt,
    /^\d{4}-\d{2}-\d{2}$/,
    '簽咗名就要有日期（YYYY-MM-DD）—— 冇日期嘅簽名日後冇人知幾時審過',
  )
})

test('③ 每條粵拼都有聲調數字 —— 冇聲調嘅粵拼教唔到發音', () => {
  // 唔係查啱唔啱（機器查唔到），係查有冇。一個冇聲調數字嘅音節，
  // 對學緊廣東話嘅人嚟講基本上冇用 —— 廣東話六個聲調全靠佢分。
  const bad: string[] = []
  for (const t of CAMPUS_TOPICS) {
    for (const p of t.phrases) {
      for (const syl of p.jyut.split(/\s+/)) {
        if (!/^[a-z]+[1-6]$/.test(syl)) bad.push(`${t.id} / ${p.canto} → 「${syl}」`)
      }
    }
  }
  assert.deepEqual(bad, [], `呢啲粵拼音節唔符合「字母 + 1–6 聲調」格式：\n  ${bad.join('\n  ')}`)
})

test('④ 有綁課題嘅主題，課題必須真係存在', async () => {
  // 日常生活主題（買嘢／買衫／食嘢／交通住行）冇 topicId —— 中文科十九個課題
  // 冇一個載得起佢哋，夾硬綁一個會令數據講大話。所以呢度只驗【有綁嗰批】。
  const { getSubjectTopics } = await import('../../data/questions/index.ts')
  const live = new Set((getSubjectTopics('chinese') as { id: string }[]).map((t) => t.id))
  const dead = CAMPUS_TOPICS.filter((t) => t.topicId && !live.has(t.topicId)).map(
    (t) => `${t.id} → ${t.topicId}`,
  )
  assert.deepEqual(dead, [], `呢啲卡指住唔存在嘅課題，「做呢個課題」會係死掣：\n  ${dead.join('\n  ')}`)
})

test('⑤ 校園主題一定要綁課題 —— 唔准靜靜哋變成冇入口', () => {
  // ④ 放寬咗之後留低一個窿：校園主題（1–8）本來每個都撳得入練習，
  // 而家只要有人刪走個 topicId，④ 就會照樣綠。呢條補返。
  const CAMPUS = ['classroom', 'recess', 'homework', 'teachers', 'peers', 'school-life', 'help', 'spoken-written']
  const missing = CAMPUS.filter((id) => !CAMPUS_TOPICS.find((t) => t.id === id)?.topicId)
  assert.deepEqual(
    missing,
    [],
    `呢啲校園主題冇咗 topicId，練習掣會靜靜哋消失：${missing.join(', ')}`,
  )
})
