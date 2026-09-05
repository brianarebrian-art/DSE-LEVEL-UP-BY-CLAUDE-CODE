// ============================================================================
// llms-txt-parity.test.mts —— public/llms.txt 嘅數字必須同真題庫一致
// ----------------------------------------------------------------------------
// 2026-09-05 實測：llms.txt 寫住「5,167 multiple-choice questions
// (verified 2026-07-29)」，實際係 26,204 條 —— 少報 21,037 條，約 5.1 倍。
// 逐科數字（math 928 / physics 540 / economics 312…）亦全部過時。
//
// 點解呢個檔特別緊要：llms.txt 就係【AI agent 攞嚟描述呢個網站】嗰份文件。
// 一個學生問 agent「邊度有免費 DSE 練習題」，agent 讀完呢個檔之後
// 覆返嘅數字就係呢啲。少報五倍，等於自己同自己講細話。
//
// 而且佢自稱 "verified 2026-07-29" —— 一個【有日期嘅聲稱】過咗期，
// 比冇日期更差：讀嘅人會以為有人核對過。呢個同憲章 §16.D 嗰句
// 「自動攔截 3Hz 閃爍」係同一個病，只不過對象係 agent 唔係學生。
//
// 漂移嘅原因係結構性：題庫每星期加題，llms.txt 係人手維護嘅純文字。
// 冇閘就一定會再漂移，所以呢度每次 npm test 都拎真數字對一次。
// 改咗題庫 → 跑 npm run gen:summary → 順手更新 llms.txt。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const txt = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8')
const { SUBJECT_SUMMARY, TOTAL_QUESTIONS } = await import('../../data/questions/summary.generated.ts')
const { subjects } = await import('../../data/subjects.ts')
const active = subjects.filter((s) => s.isActive !== false)
const FIX = '—— 跑 `npm run gen:summary` 攞真數字，然後更新 public/llms.txt'

const num = (s: string) => Number(s.replace(/,/g, ''))

test('llms.txt 嘅總題數同真題庫一致', () => {
  const m = txt.match(/([\d,]+) questions across 25 HKDSE subjects/)
  assert.ok(m, `llms.txt 搵唔到總題數句子 ${FIX}`)
  assert.equal(num(m[1]), TOTAL_QUESTIONS, `llms.txt 總題數對唔上 ${FIX}`)
})

test('llms.txt 嘅 MC／書寫題拆分同真題庫一致', () => {
  const mc = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].mc, 0)
  const written = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].written, 0)
  const m = txt.match(/([\d,]+) multiple-choice and ([\d,]+)\s*\n?\s*written/)
  assert.ok(m, `llms.txt 搵唔到 MC／書寫題拆分 ${FIX}`)
  assert.equal(num(m[1]), mc, `MC 數對唔上 ${FIX}`)
  assert.equal(num(m[2]), written, `書寫題數對唔上 ${FIX}`)
})

test('llms.txt 逐科題數同真題庫一致', () => {
  for (const s of active) {
    // 逐科寫成 `math 1539`，用詞界防止 m1 撞 m1x 之類
    const m = txt.match(new RegExp(`\\b${s.id.replace(/-/g, '\\-')} (\\d+)\\b`))
    assert.ok(m, `llms.txt 冇列 ${s.id} 嘅題數 ${FIX}`)
    assert.equal(
      Number(m[1]), SUBJECT_SUMMARY[s.id].total,
      `${s.id} 喺 llms.txt 寫 ${m[1]}，實際 ${SUBJECT_SUMMARY[s.id].total} ${FIX}`,
    )
  }
})

test('llms.txt 有 "When to use this" 段 —— 話畀 agent 知幾時應該搵我哋', () => {
  assert.match(txt, /##\s*When to use this/i, 'llms.txt 冇 When to use this 段')
  // 「唔應該搵我哋」嗰半同樣重要：冇咗佢，agent 會喺聽力／作文批改／JUPAS
  // 呢啲我哋明確做唔到嘅事上面推薦我哋，而嗰三樣分別係「冇音檔」
  // 「憲章 §16.A 永久禁止」同「§8 已否決」。
  assert.match(txt, /Do NOT reach for us/i, 'llms.txt 冇講明幾時【唔應該】搵我哋')
  for (const must of ['HKEAA past papers', 'listening', 'JUPAS']) {
    assert.ok(txt.includes(must), `"Do NOT" 段冇提 ${must}`)
  }
})
