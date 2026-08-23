// ============================================================================
// no-markdown.test.mts —— 題庫唔准出現字面 markdown 粗體 `**…**`
// ----------------------------------------------------------------------------
// 題庫格式【從來冇聲明支援 markdown】。MathText 只處理 KaTeX `$…$`，其餘文字
// 一律 HTML-escape 之後照字面出，所以 `**偶數**` 喺學生畫面上就係一堆星號。
//
// 2026-08-22 實測 54 條 live 題目中招：
//   math 30／history 9／geography 5／technology-living 5／chemistry 3／
//   ethics-religious 2 —— 其中 24 條係機器閘批次自己帶入去嘅。
//   （出題端寫 markdown 純粹係手指習慣，寫嗰陣唔會自己察覺。）
//
// ⚠️ 【唔應該】反過來令 renderer 支援 markdown 粗體。本平台已有經深思嘅強調
//    機制 CommandWordText（HKEAA 指令字高亮），而它刻意設計成「學生自診
//    『審題陷阱』之後先亮」，為咗避免提示過度。題幹入面永久粗體嘅考點，正正
//    就係嗰條規則想避免嘅嘢。故此喺入庫前攔截（scripts/qbank/_gate.mjs），
//    唔喺 renderer 度遷就。
//
// ── 點解要行 runtime 掃描而唔係 grep 源碼 ────────────────────────────────
// `**` 喺 JavaScript 亦係次方運算符。ict.ts 有 `${2 ** n}`、math.ts 有
// `(y2 - y1) ** 2` —— 純文字掃源碼會把佢哋當成粗體而誤報。行 runtime 就冇
// 呢個問題：模板字串已經求值，剩低嘅先係學生真正見到嘅字。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getSubjectQuestions } = await import('../index.ts')
const { getActiveSubjects } = await import('../../subjects.ts')

/** 學生可見嘅所有欄位 —— 英文欄同樣要掃，英文介面嘅學生一樣睇得到。 */
const VISIBLE = [
  'content', 'contentEn',
  'explanation', 'explanationEn',
  'referenceAnswer', 'referenceAnswerEn',
  'markingScheme', 'markingSchemeEn',
] as const

const BOLD = /\*\*[^*\n]{1,80}\*\*/

test('題庫唔可以有字面 markdown 粗體（學生會見到星號本身）', () => {
  const bad: string[] = []
  for (const s of getActiveSubjects()) {
    for (const q of getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]) {
      const parts: string[] = []
      for (const k of VISIBLE) if (typeof q[k] === 'string') parts.push(q[k] as string)
      for (const k of ['options', 'optionsEn'] as const) {
        if (Array.isArray(q[k])) for (const o of q[k] as unknown[]) if (typeof o === 'string') parts.push(o)
      }
      const m = parts.join('\n').match(BOLD)
      if (m) bad.push(`${s.id}/${String(q.id)}　「${m[0].slice(0, 46)}」`)
    }
  }
  assert.deepEqual(
    bad,
    [],
    `${bad.length} 條題目帶字面 markdown 粗體 —— 剷走標記，或改用 CommandWordText 嘅指令字機制：\n  ` +
      bad.slice(0, 12).join('\n  '),
  )
})

test('入庫閘會攔截 markdown 粗體 —— 唔可以淨係靠測試事後補救', async () => {
  const { gateRow } = await import('../../../scripts/qbank/_gate.mjs')
  const base = {
    id: 'x1', type: 'mc', topic: 't', topicId: 't', difficulty: 'basic',
    question: '以下哪一項正確？', options: ['甲', '乙', '丙', '丁'], correctIndex: 0,
    explanation: '呢度係一段夠長嘅解析，用嚟令其他閘唔會誤報。',
  }
  assert.equal(gateRow(base, 'geography').length, 0, '乾淨嘅一行唔應該被攔')
  const withBold = { ...base, explanation: base.explanation + '（**測試粗體**）' }
  const errs = gateRow(withBold, 'geography') as string[]
  assert.ok(errs.some((x) => x.includes('markdown')), `閘應該攔截粗體，實際錯誤：${JSON.stringify(errs)}`)
})
