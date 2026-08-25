// ============================================================================
// sensei-identity.test.mts —— 憲章 §16.B：AI 身份誠實義務
// ----------------------------------------------------------------------------
// §16.B 執行要求第 3 條明文：「呢個判定必須有測試鎖住，唔可以只靠 prompt」。
// 呢個檔就係嗰道鎖。
//
// 設計取態同 identity.ts 一致：寧可多答，唔可以漏答。
// 所以下面覆蓋咗好多種問法 —— 口語、書面語、英文、有問號、冇問號。
// 漏一個 = 學生喺最想知嗰一刻被扮傻。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
// tsx 將 .ts 當 CJS，static named import 攞唔到（repo 現有測試從來冇 import 過
// .ts 嘅 runtime 值）。用 dynamic import 取 default，先至測到真行為而唔係淨掃原始碼。
const identity = await import('../sensei/identity.ts').then((m: Record<string, unknown>) => (m.default ?? m) as {
  isIdentityQuestion: (s: string) => boolean
  IDENTITY_ANSWER: { zh: string; en: string }
  AI_BADGE: { zh: string; en: string }
})
const { isIdentityQuestion, IDENTITY_ANSWER, AI_BADGE } = identity

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('§16.B：各種問身份嘅講法都要答', () => {
  const asks = [
    '你係咪真人', '你係唔係真人？', '你是不是真人', '你是真人嗎',
    '你係咪AI', '你係唔係 AI 嚟㗎', '你是不是AI', '你係咪人工智能',
    '你係機械人？', '你是機器人嗎', 'sensei 你係人定機',
    'are you human?', 'Are you a real person', 'are you an AI',
    'are you a bot', 'is this a robot', 'what are you',
  ]
  for (const q of asks) assert.equal(isIdentityQuestion(q), true, `漏咗：「${q}」`)
})

test('§16.B：普通學科問題唔會誤觸發', () => {
  const normal = [
    '點解共用品會有搭便車問題', '需求曲線點樣移動', '二次方程點解',
    'how do I answer paper 2', '文言文特殊句式有邊幾種',
  ]
  for (const q of normal) assert.equal(isIdentityQuestion(q), false, `誤觸發：「${q}」`)
})

test('§16.B：空輸入唔會當成問身份', () => {
  for (const q of ['', '   ', '\n']) assert.equal(isIdentityQuestion(q), false)
})

test('§16.B：標準回答同憲章 §16.B 逐字一致', () => {
  // 兩邊分開維護一定會漂移。呢條斷言令改一邊就會紅。
  // 憲章嗰段係 markdown 引用，會換行兼帶 `> ` 前綴 —— 要正規化先比得到。
  const charter = read('docs/charter.md').replace(/\n>\s*/g, '').replace(/\s+/g, '')
  assert.ok(charter.includes(IDENTITY_ANSWER.zh.replace(/\s+/g, '')),
    '標準回答同 docs/charter.md §16.B 對唔上 —— 改咗一邊要兩邊一齊改')
})

test('§16.B：回答必須明確講自己唔係真人', () => {
  assert.match(IDENTITY_ANSWER.zh, /AI/)
  assert.match(IDENTITY_ANSWER.zh, /唔係真人/)
  assert.match(IDENTITY_ANSWER.en, /\bAI\b/)
  assert.match(IDENTITY_ANSWER.en, /not a real person/i)
})

test('§16.B 執行要求 1：AI 標示唔可以摺埋或者有條件顯示', () => {
  const src = read('app/sensei/SenseiClient.tsx')
  assert.ok(src.includes('AI_BADGE'), '頁面冇用 AI_BADGE')
  // 標示唔可以包喺任何條件渲染入面（`&&` / 三元 / useState 開關）。
  const badgeLine = src.split('\n').find((l) => l.includes('AI_BADGE.zh'))
  assert.ok(badgeLine, '搵唔到 AI 標示嗰行')
  assert.ok(!/\?\s*$|&&\s*\(?\s*$/.test(badgeLine!.trim()), 'AI 標示唔可以條件渲染')
  assert.match(AI_BADGE.zh, /AI/)
})

test('§16.B：身份問題喺任何檢索之前處理（唔可以被 miss 分支食咗）', () => {
  const src = read('app/sensei/SenseiClient.tsx')
  const idIdx = src.indexOf('isIdentityQuestion')
  const rankIdx = src.indexOf('rankCards(')
  assert.ok(idIdx > -1 && rankIdx > -1)
  assert.ok(idIdx < rankIdx, '身份判定必須喺檢索之前，否則問身份可能行咗 miss 分支')
})
