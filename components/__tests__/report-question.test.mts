// ============================================================================
// report-question.test.mts —— 題目勘誤入口
// ----------------------------------------------------------------------------
// 兩件事要守：
//   1. 報告一定要帶得走【題號】。冇題號嘅報告等於冇報 —— 五千幾條題，
//      「有條中史題答案唔啱」我哋搵唔返係邊條。
//   2. 個元件要真係接咗入頁面。憲章 §4：新模組未接入 live app 就未完成；
//      呢個閘捉「寫咗但冇人用」嗰種假完成。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const SRC = new URL('../ReportQuestionButton.tsx', import.meta.url).pathname

test('報告內容一定帶題號同問題類別', async () => {
  const { composeReport, CATEGORIES } = await import('../ReportQuestionButton.tsx')
  for (const en of [false, true]) {
    for (const c of CATEGORIES) {
      const body = composeReport('chist_floor_07', c.key, '第二個選項都啱', en)
      assert.ok(body.includes('chist_floor_07'), `${c.key}/${en ? 'en' : 'zh'} 冇題號`)
      assert.ok(body.includes(en ? c.en : c.zh), `${c.key}/${en ? 'en' : 'zh'} 冇問題類別`)
      assert.ok(body.includes('第二個選項都啱'), `${c.key}/${en ? 'en' : 'zh'} 冇學生填嘅內容`)
    }
  }
})

test('冇填描述都照樣寄得出，唔會靜靜哋變空白', async () => {
  const { composeReport } = await import('../ReportQuestionButton.tsx')
  const zh = composeReport('math_x_1', 'answer', '   ', false)
  const en = composeReport('math_x_1', 'answer', '', true)
  assert.ok(zh.includes('math_x_1') && zh.includes('（未填）'))
  assert.ok(en.includes('math_x_1') && en.includes('(not filled in)'))
})

test('mailto 唔可以係唯一出路 —— 要有唔靠郵件程式嘅退路', () => {
  const src = readFileSync(SRC, 'utf8')
  // 報告全文要攤開喺一個 readOnly 輸入框，學生自己揀字都複製到；
  // 淨係得一個「複製」掣唔算 —— 剪貼板 API 喺非安全來源會靜默失敗。
  assert.ok(/id="report-preview"/.test(src), '冇攤開報告全文嘅預覽框')
  assert.ok(/readOnly/.test(src), '預覽框應為 readOnly')
  assert.ok(/navigator\.clipboard/.test(src), '冇提供複製')
  assert.ok(/aria-live/.test(src), '複製結果冇 aria-live 通知')
})

test('個元件真係接咗入練習頁同收藏頁（唔係孤兒模組）', () => {
  for (const f of ['../QuestionProvenance.tsx', '../../app/bookmarks/BookmarksView.tsx']) {
    const src = readFileSync(new URL(f, import.meta.url).pathname, 'utf8')
    assert.ok(/import ReportQuestionButton/.test(src), `${f} 冇 import`)
    assert.ok(/<ReportQuestionButton/.test(src), `${f} 有 import 但冇用`)
  }
})
