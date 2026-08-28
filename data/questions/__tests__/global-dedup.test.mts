// ============================================================================
// global-dedup.test.mts —— 全域撞題閘（棘輪）
// ----------------------------------------------------------------------------
// 點解要有呢個閘，同點解佢喺【測試】而唔係喺 validate-banks.mjs：
//
// validate-banks.mjs 檔頭聲稱做「GLOBAL dedup across ALL banks」，但佢
// 第 35 行有一張寫死嘅 7 個 parametric bank 清單。實測 2026-08-28：
// 佢掃 1,762 條，全站實有 6,210 條 —— 五個補底批次由頭到尾冇被掃過，
// 而每次補底入庫都報過「validate-banks 通過」。嗰個綠係假嘅。
//
// 假綠比冇閘更差：冇閘嘅時候人會自己檢查，假綠會令人停止檢查。
//
// 擺喺測試而唔係手動腳本，係因為 validate-banks 要人記得去跑，而
// `npm test` 每次改題庫都一定會行。閘要有用，就要冇得唔跑。
//
// 判定規則（憲章 §6：擴大檢查前已量度影響）：
//   重複 = 題幹相同【且】干擾項集合相同
// 只比題幹會誤報 —— 實測全站「題幹相同」有 3 組，其中 2 組係通用指示語
// （「Choose the correct sentence:」「下列哪一組詞語沒有錯別字？」），
// 選項完全不同，屬正常題型。加上干擾項比對之後 3 組 → 1 組，兩個誤報清零。
//
// 修法：唔係喺 baseline 加一行，而係去改嗰條撞咗嘅題。ceiling 只准落唔准升。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { getSubjectQuestions } = await import('../index.ts')
const subjectsMod: Record<string, unknown> = await import('../../subjects.ts')
const subjects = Object.values(subjectsMod).find(
  (v): v is { id: string }[] => Array.isArray(v) && typeof (v[0] as { id?: string })?.id === 'string',
)!

const BASELINE = JSON.parse(readFileSync('scripts/qbank/bank-dedup-baseline.json', 'utf8')) as {
  _meta: { ceiling: number }
  pairs: [string, string][]
}

type Q = { id: string; content?: string; options?: string[]; correctIndex?: number }
const all: (Q & { _sub: string })[] = []
for (const s of subjects) for (const q of (getSubjectQuestions(s.id) ?? []) as Q[]) all.push({ ...q, _sub: s.id })

const norm = (s: unknown) => String(s ?? '').replace(/[\s，。？！、（）「」,.?!()"'\\$]/g, '')

/** 題幹 ＋ 干擾項集合。題幹太短（通用指示語單獨出現）唔納入比對。 */
function dupKey(q: Q): string | null {
  if (!Array.isArray(q.options) || typeof q.correctIndex !== 'number') return null
  const stem = norm(q.content)
  if (stem.length < 12) return null
  const distractors = q.options.filter((_, i) => i !== q.correctIndex).map(norm).sort().join('||')
  return `${stem}##${distractors}`
}

const groups = new Map<string, string[]>()
for (const q of all) {
  const k = dupKey(q)
  if (!k) continue
  const arr = groups.get(k) ?? []
  arr.push(`${q._sub}/${q.id}`)
  groups.set(k, arr)
}
const dupGroups = [...groups.values()].filter((v) => v.length > 1).map((v) => v.slice().sort())
const baselineKeys = new Set(BASELINE.pairs.map((p) => p.slice().sort().join(' ≡ ')))

test('全域掃描真係覆蓋全站，唔係得七個 parametric bank', () => {
  // 呢條係防止「假綠」重演：如果有人日後又把掃描範圍收窄，呢度即刻紅。
  assert.ok(all.length > 5000, `只掃到 ${all.length} 條，全站應有 6,000 條以上 —— 掃描範圍縮窄咗`)
  assert.ok(subjects.length >= 20, `只見到 ${subjects.length} 個科目`)
})

test('冇重複 id（全站唯一）', () => {
  const seen = new Map<string, string>()
  const clashes: string[] = []
  for (const q of all) {
    const prev = seen.get(q.id)
    if (prev) clashes.push(`${q.id}：${prev} 同 ${q._sub}`)
    else seen.set(q.id, q._sub)
  }
  assert.deepEqual(clashes, [], `重複 id：\n${clashes.join('\n')}`)
})

test('撞題數目唔超過基線棘輪上限', () => {
  assert.ok(
    dupGroups.length <= BASELINE._meta.ceiling,
    `撞題 ${dupGroups.length} 組，超過上限 ${BASELINE._meta.ceiling}：\n` +
      dupGroups.map((g) => '  ' + g.join(' ≡ ')).join('\n') +
      '\n→ 去改嗰條撞咗嘅題，唔好喺 baseline 加一行。',
  )
})

test('每一組撞題都必須喺基線名單之內（換一組新嘅一樣要紅）', () => {
  // 淨係數個數會走漏「修好一組、又撞多一組」——總數不變但問題換咗個位。
  const unknown = dupGroups.map((g) => g.join(' ≡ ')).filter((k) => !baselineKeys.has(k))
  assert.deepEqual(unknown, [], `新出現嘅撞題（未喺基線登記）：\n${unknown.join('\n')}`)
})

test('棘輪只准落唔准升', () => {
  assert.ok(
    BASELINE._meta.ceiling <= 1,
    `基線上限係 ${BASELINE._meta.ceiling}，但 2026-08-28 實測只有 1 組。` +
      '上限只可以喺修好舊題之後調低，唔可以為咗容納新撞題而調高。',
  )
  assert.equal(BASELINE.pairs.length, BASELINE._meta.ceiling, '基線名單長度必須等於上限')
})
