// ============================================================================
// bilingual-options.test.mts —— 雙語題的英文選項不得夾雜中文
// ----------------------------------------------------------------------------
// 一條題目只要帶 `contentEn`，英文介面的學生就會讀到它。若 `optionsEn` 仍然
// 是中文，該學生看見的是英文題幹配中文選項 —— 題目直接變成無法作答，並非只
// 是排版不美觀。
//
// 2026-08-22 實測 387 條 live 題目中招：
//   economics 141／bafs 100／chemistry 80／m1 33／m2 16／math 10／
//   physics 4／visual-arts 2／ict 1
//
// 三個成因，源碼上都看不出異樣：
//   一、選項寫成 `中文 / english` 單一字串，再交給 `[v, v]` 形式的輔助函數，
//       結果兩種介面都讀到混合文字（已改用 `_builder.ts` 的 `bi()` 拆分）。
//   二、把「40 元」交給只適用於純數值的 `n()`（已改用 `_parametric.ts` 的
//       `money()`／`qty()`／`hkBillion()`）。
//   三、原型只填了 `ans` 而漏了 `ansEn`（見 `_archetype.mts`）。
//
// 五科語言科目不在此列：中文科、中國歷史、中國文學、英文科、英國文學的選項
// 本身就是考核對象，中文選項是刻意的設計。
//
// ── 為何要行 runtime 掃描而非 grep 源碼 ──────────────────────────────────
// 選項大量由模板字串與參數表生成（`${num(ans)} 次`、`${curve}${qDir}`），
// 源碼上並無一句完整的選項文字。求值之後掃描，掃的才是學生真正看見的字。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getSubjectQuestions } = await import('../index.ts')
const { getActiveSubjects } = await import('../../subjects.ts')

const HAS_CJK = /[一-鿿]/
const LANGUAGE_SUBJECTS = new Set([
  'chinese', 'chinese-history', 'chinese-literature', 'english', 'english-literature',
])

test('非語言科目的雙語 MC，英文選項不得夾雜中文', () => {
  const bad: string[] = []
  for (const s of getActiveSubjects()) {
    if (LANGUAGE_SUBJECTS.has(s.id)) continue
    for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
      if (q.type !== 'mc' || typeof q.contentEn !== 'string' || !q.contentEn.trim()) continue
      const en = Array.isArray(q.optionsEn) ? q.optionsEn : q.options
      if (!Array.isArray(en)) continue
      const hit = (en as unknown[]).find((o) => typeof o === 'string' && HAS_CJK.test(o))
      if (hit !== undefined) bad.push(`${s.id}/${String(q.id)}　「${String(hit).slice(0, 40)}」`)
    }
  }
  assert.deepEqual(
    bad,
    [],
    `${bad.length} 條雙語題的英文選項仍是中文 —— 英文介面的學生無法作答：\n  ` +
      bad.slice(0, 12).join('\n  '),
  )
})

test('入庫閘會攔截中文英文選項 —— 不可以只靠測試事後補救', async () => {
  const { gateRow } = await import('../../../scripts/qbank/_gate.mjs')
  const base = {
    id: 'gate_probe_1',
    type: 'mc',
    topic: '需求與供給',
    difficulty: 'basic',
    question: '某商品價格上升，其需求量會怎樣變動？',
    questionEn: 'When the price of a good rises, what happens to the quantity demanded?',
    explanation: '需求定律指出價格與需求量成反向關係，故需求量下降。',
    correctIndex: 0,
  }
  const zhOptions = ['需求量下降', '需求量上升', '需求量不變', '無法判斷']
  const enOptions = ['Quantity demanded falls', 'Quantity demanded rises', 'Quantity demanded is unchanged', 'Cannot be determined']

  const blocked: string[] = gateRow({ ...base, options: zhOptions, optionsEn: zhOptions }, 'economics')
  assert.ok(
    blocked.some((m) => m.includes('optionsEn')),
    `閘應攔下中文 optionsEn，實際回報：${JSON.stringify(blocked)}`,
  )

  const passed: string[] = gateRow({ ...base, options: zhOptions, optionsEn: enOptions }, 'economics')
  assert.deepEqual(passed, [], `正確的雙語選項不應被攔：${JSON.stringify(passed)}`)

  // 語言科目豁免：中文選項是刻意的考核對象。
  const langOk: string[] = gateRow({ ...base, options: zhOptions, optionsEn: zhOptions }, 'chinese')
  assert.ok(
    !langOk.some((m) => m.includes('optionsEn')),
    `語言科目不應受此閘所限：${JSON.stringify(langOk)}`,
  )
})
