// ============================================================================
// _reviewer-gate.mjs —— 共用「真人簽名」閘
// ----------------------------------------------------------------------------
// 題庫同 SENSEI 卡片庫共用同一條紀律：冇真人名 = 冇得入庫。
// 抽出嚟共用，係為咗兩條管線唔會各自漂移 —— 一邊收緊、另一邊冇跟，
// 就等於冇收緊過。
//
// 兩層檢查：
//   ① 空白 → 停機（原本喺 promote-drafts.mjs，行為逐字不變）
//   ② 虛擬 persona 冒簽 → 停機（2026-08-25 新增）
//
// 點解要第 ②：2026-08-25 嘅執行令將 `signed_by TEXT NOT NULL` 配上
// 「Carson 親手簽名負責」「Amity 簽名」—— Carson／Amity 係 skill persona，
// 唔係人。一個【必填】簽名欄填住唔存在嘅人名，唔係「冇審核」，
// 係「製造咗一條睇落有審核嘅紀錄」，兩年後冇人分得出邊張卡真係有人睇過。
// 留白至少睇得出未批，所以呢個比留白更差 —— 一定要用代碼攔，唔可以靠清單。
//
// 落閘當日影響統計（憲章 §6）：掃過全部 23 個 *.decisions.json，
// 現有 reviewer 只有 `brian` 同 `望咩望,未見過海綿寶寶咩?` —— 零個 persona 名，
// 即係加呢道閘對現有資料【零影響】。
// ============================================================================

/**
 * 虛擬員工名單。全部係 skill persona，只出草稿同檢查清單，冇簽名權。
 *
 * ⚠️ `brian` 同 `yuna` 【刻意唔喺呢張名單】—— 佢哋係真人創辦人，係唯一
 * 有簽名權嘅兩位。呢個唔係遺漏，唔好「順手補返」。
 */
export const VIRTUAL_PERSONAS = new Set([
  'benjamin', 'max', 'alan', 'leo', 'alex', 'eric', 'diana', 'rachel',
  'amity', 'arthur', 'victor', 'carson', 'oscar', 'kelly', 'kate', 'mia',
  'emma', 'sarah', 'adam', 'bella', 'denise', 'edmund', 'plaaaaaa',
  'ethan', 'luna', 'david', 'helen', 'bonnie', 'chris', 'cyrus', 'amos',
  'gavin', 'owen', 'ghost', 'shadow', 'anchor', 'aaron',
])

/** 拆成字母 token —— 令「Carson（經濟首席）」「amity 簽名」都攔得住。 */
function tokens(name) {
  return name.toLowerCase().split(/[^a-z]+/).filter(Boolean)
}

/**
 * @returns {{ok: true} | {ok: false, reason: string}}
 */
export function checkReviewer(rawReviewer) {
  const reviewer = (rawReviewer || '').trim()
  if (!reviewer) {
    return { ok: false, reason: 'decisions file has no reviewer name in _meta.reviewer — a 人手核對 bank must record who approved it. Add your name in the review sheet and re-export.' }
  }
  const hit = tokens(reviewer).find((t) => VIRTUAL_PERSONAS.has(t))
  if (hit) {
    return {
      ok: false,
      reason: `reviewer "${reviewer}" 命中虛擬 persona「${hit}」—— persona 冇簽名權。\n`
        + `   簽名位只可以填真人（Brian／Yuna 或真人 handle）。\n`
        + `   一個填住唔存在嘅人名嘅簽名欄，比留白更差：佢製造咗一條睇落有審核嘅紀錄。`,
    }
  }
  return { ok: true }
}

/** 唔過就停機。兩條管線共用，訊息一致。 */
export function assertReviewer(rawReviewer) {
  const r = checkReviewer(rawReviewer)
  if (!r.ok) {
    console.error(`\n✗ ${r.reason}\n`)
    process.exit(1)
  }
  return rawReviewer.trim()
}
