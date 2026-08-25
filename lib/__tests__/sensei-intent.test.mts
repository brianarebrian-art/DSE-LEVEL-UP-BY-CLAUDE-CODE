// ============================================================================
// sensei-intent.test.mts —— 純規則檢索
// ----------------------------------------------------------------------------
// 最重要嗰條唔係「搵唔搵到」，係【搵唔到嗰陣點做】：
// 零模型版嘅全部價值就係「唔會亂噏」，所以 miss 一定要係 miss，
// 唔可以退而求其次交一張唔相干嘅卡上去扮有答案。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
// 同 sensei-identity.test.mts 一樣：tsx 對 .ts 嘅 CJS interop，要用 dynamic import。
const { rankCards } = await import('../sensei/intent.ts').then((m: Record<string, unknown>) => (m.default ?? m) as {
  rankCards: (q: string, cards: readonly KnowledgeCard[], limit?: number) => { card: KnowledgeCard; score: number; hits: string[] }[]
})
import type { KnowledgeCard } from '../../data/sensei/types.ts'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

const card = (id: string, topic: string, keywords: string[]): KnowledgeCard => ({
  id, subject: 'economics', topic, difficulty: 'basic', source: 'syllabus',
  concept: '概念文字', example: '例子文字', examTechnique: '技巧文字', commonTrap: '陷阱文字',
  keywords, reviewer: 'brian', reviewedAt: '2026-08-25',
})

const bank = [
  card('a-public-good', '共用品', ['共用品', '搭便車', '非排他性']),
  card('b-demand', '需求曲線', ['需求曲線', '移動', '平移']),
]

test('命中關鍵詞就搵到，並且報得出命中咗邊個詞', () => {
  const [top] = rankCards('點解共用品會有搭便車問題', bank)
  assert.equal(top.card.id, 'a-public-good')
  assert.ok(top.hits.includes('共用品'))
  assert.ok(top.hits.includes('搭便車'))
})

test('課題名比一般關鍵詞重 —— 直接問課題名要排第一', () => {
  const ranked = rankCards('需求曲線', bank)
  assert.equal(ranked[0].card.id, 'b-demand')
})

test('搵唔到就係搵唔到 —— 唔准退而求其次交無關卡片', () => {
  assert.deepEqual(rankCards('點樣煮飯', bank), [])
  assert.deepEqual(rankCards('', bank), [])
  assert.deepEqual(rankCards('   ', bank), [])
})

test('標點同大小寫唔影響命中', () => {
  assert.equal(rankCards('共用品，係咩？', bank).length, 1)
  assert.equal(rankCards('共用品係咩', bank).length, 1)
})

test('同分排序穩定 —— 同一句問兩次結果一樣', () => {
  const a = rankCards('共用品 需求曲線', bank).map((m) => m.card.id)
  const b = rankCards('共用品 需求曲線', bank).map((m) => m.card.id)
  assert.deepEqual(a, b)
})

test('檢索層冇任何生成邏輯（唔可以有 template 拼句）', () => {
  const src = readFileSync(join(ROOT, 'lib/sensei/intent.ts'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
  // 檢索層只准揀卡，唔准砌字。有 template literal 拼內容就係開始生成。
  assert.ok(!/`[^`]*\$\{[^}]*card\.[^}]*\}/.test(src), 'intent.ts 唔可以用 card 內容拼字串')
})
