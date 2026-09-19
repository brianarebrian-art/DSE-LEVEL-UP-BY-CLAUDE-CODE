// ============================================================================
// bank-i18n-coverage.test.mts —— 題庫英文覆蓋率唔准倒退
// ----------------------------------------------------------------------------
// ══ 守緊乜 ══
// 英文版學生見到一條冇 `contentEn` 嘅題目，唔會見到錯誤 —— 佢會見到中文。
// 六個 render 點全部有 fallback（`tr = (zh, e?) => (en && e ? e : zh)`、
// `q.contentEn ?? q.content`、`en && q.contentEn ? … : q.content`），
// 所以呢個缺口【冇任何聲音】：唔會紅、唔會爆、冇人投訴，英文版靜靜哋變返中文。
// 正正就係要測試盯住嗰種。
//
// ── 同 bilingual-options.test.mts 唔重疊 ────────────────────────────────
// 嗰條守嘅係「有咗 contentEn 之後，optionsEn 唔准仲係中文」（英文題幹配中文
// 選項＝答唔到）。佢對【完全未譯】嘅題目冇意見，因為嗰啲題根本未入佢個範圍。
// 呢條守嘅係前一步：未譯嗰批唔准變多。
//
// 2026-09-18 實測確認兩者唔會互相蓋過：33 條冇 optionsEn 嘅 MC 題，
// 33 條同時冇 contentEn —— 即係完全係未譯批嘅子集，譯完就一齊清。
// 所以【冇】為 optionsEn 另開一條覆蓋測試：一條不變式一個閘。
//
// ══ 點解係「唔准倒退」而唔係「一定要 100%」══
// 27,321 條題目入面 614 條真係冇英文（8 個內容科）。要逐條由學科首席譯 ——
// 憲章 §5 有強制術語對照表（Public Good → 共用品，唔准「公共財」；
// Income Elasticity 絕對禁止），§12 亦寫明機器永不自動入庫。
// 個缺口只可以由人手收窄，所以唔可以一次過 assert 100%，否則呢條測試
// 由第一日就紅，然後就會有人將佢 skip 咗 —— 一條被 skip 嘅測試同冇寫過一樣。
//
// 鎖嘅係【缺口唔准變大】：譯完一條個數就跌，新加一條未譯題即刻紅。
//
// ⚠️ 譯完之後記得調低下面個數 —— 個閘只捉「變差」，唔捉「冇進步」。
//
// ══ 語文科分開計 ══
// 中文／中國文學／中國歷史／英文／英國文學用 `m(s) = [s, s]`，contentEn
// 同 content 一模一樣（實測 chinese 1,008 條、chinese-literature 1,035 條、
// chinese-history 1,023 條如此）。一條問「戚戚」點解嘅文言題，譯做英文就
// 唔再係嗰條題。呢啲科唔屬於「未譯」，撈埋計會令覆蓋率睇落差咗，而「改善」
// 佢嘅方法係去做一件唔應該做嘅事。
// 同一張豁免名單見 bilingual-options.test.mts 之 LANGUAGE_SUBJECTS。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getSubjectQuestions } = await import('../index.ts')
const { getActiveSubjects } = await import('../../subjects.ts')

/**
 * 每科【最多】准許幾多條冇 contentEn。數字 = 2026-09-18 實測值。
 *
 * 內容科：真缺口，要人手譯。
 * 語文科：刻意單語，但呢批係未跟返 `m(s) = [s, s]` 慣例嗰啲，同樣唔准再多。
 * 表入面冇提到嘅科目一律 0 —— 新科目由第一日就要雙語。
 */
const MAX_MISSING: Record<string, number> = {
  // 內容科（真缺口）
  bafs: 105,
  ict: 105,
  geography: 105,
  economics: 104,
  biology: 72,
  physics: 64,
  chemistry: 49,
  math: 10,
  // 語文科（刻意單語，未跟慣例嗰批）
  chinese: 88,
  english: 14,
}

test('題庫英文覆蓋率唔准倒退', () => {
  const over: string[] = []
  const summary: string[] = []
  for (const s of getActiveSubjects()) {
    const qs = getSubjectQuestions(s.id) as unknown as Record<string, unknown>[]
    const missing = qs.filter((q) => typeof q.contentEn !== 'string' || !q.contentEn.trim()).length
    const cap = MAX_MISSING[s.id] ?? 0
    if (missing) summary.push(`${s.id} ${missing}/${qs.length}`)
    if (missing > cap) over.push(`${s.id}：${missing} 條，上限 ${cap}`)
  }
  assert.deepEqual(
    over,
    [],
    `英文覆蓋率倒退咗：\n  ${over.join('\n  ')}\n\n` +
      `英文版學生會喺呢啲題見到中文 —— 每個 render 點都有 fallback，所以唔會有任何錯誤訊息。\n` +
      `新題請連 contentEn 一齊入庫；語文科刻意單語請用 m(s) = [s, s]。\n` +
      `如果係【譯多咗】而個數應該跌，請同步調低本檔嘅 MAX_MISSING。\n` +
      `現況：${summary.join(' · ')}`,
  )
})
