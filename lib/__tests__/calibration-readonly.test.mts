// ============================================================================
// calibration-readonly.test.mts —— 難度校準管線嘅唯讀性
// ----------------------------------------------------------------------------
// 2026-09-10 簽署「逐課題 × 難度級校準」之後，多咗兩個會讀 Supabase、
// 會讀成個題庫、而且會輸出「建議點改標籤」嘅腳本。
//
// 一個【識得計出正確答案】嘅腳本，同一個【會自己落手改】嘅腳本，
// 中間只差幾行。呢批測試就係守住嗰幾行 —— 憲章 §12：機器負責量度，唔負責入庫。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const CALIB = readFileSync('scripts/qbank/calibrate-topic-difficulty.mts', 'utf8')
const BUDGET = readFileSync('scripts/qbank/accuracy-budget.mts', 'utf8')

/** 剝走註釋 —— 註釋入面寫住「唔會寫入題庫」唔應該當成證據。實際踩過（streak 掃描）。 */
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── ① 唔准寫題庫 ──────────────────────────────────────────────────────────
test('校準腳本唔可以寫入 data/questions', () => {
  for (const [name, src] of [['calibrate', CALIB], ['budget', BUDGET]] as const) {
    const code = strip(src)
    // ⚠️ 唔可以用 /writeFileSync\(([^,]+),/ —— `join(ROOT, 'x')` 自己有逗號，
    //    個 regex 會喺 `join(ROOT` 度斷，然後永遠比對唔中。實際踩過。
    //    要攞第一個參數就一定要數返括號。
    const firstArg = (from: number) => {
      let depth = 0
      for (let i = from; i < code.length; i++) {
        const ch = code[i]
        if (ch === '(') depth++
        else if (ch === ')') { if (depth === 0) return code.slice(from, i); depth-- }
        else if (ch === ',' && depth === 0) return code.slice(from, i)
      }
      return code.slice(from)
    }
    const writes: string[] = []
    for (const m of code.matchAll(/writeFileSync\(/g)) writes.push(firstArg(m.index! + m[0].length).trim())
    assert.ok(writes.length > 0, `${name} 揾唔到任何 writeFileSync —— 個閘可能已經失效`)
    for (const target of writes) {
      // 唯一准許嘅兩個寫入目的地：轉譯用嘅臨時目錄、同 drafts 提案檔。
      const ok = /\bTMP\b/.test(target) || /drafts/.test(target)
      assert.ok(ok, `${name} 寫入咗一個唔認得嘅目的地：${target}`)
      assert.ok(!/data\/questions/.test(target), `${name} 唔可以寫 data/questions`)
    }
  }
})

test('校準腳本唔可以 PATCH／POST／DELETE Supabase', () => {
  for (const [name, src] of [['calibrate', CALIB], ['budget', BUDGET]] as const) {
    const code = strip(src)
    assert.ok(!/method:\s*['"](POST|PATCH|PUT|DELETE)/i.test(code), `${name} 出現咗寫入型 HTTP method`)
  }
})

// ── ② 提案檔唔可以自己簽名 ────────────────────────────────────────────────
//
// 憲章 §16.C：「冇人跑就填」呢個動作本身就係違規，不論數字最終啱唔啱。
// 一個自己填 reviewer 嘅提案檔，落到 fact-check 協議 Step A 會直接扮成已審批。
test('提案檔嘅 reviewer 留白、status 係 pending', () => {
  const code = strip(CALIB)
  assert.match(code, /reviewer:\s*['"]{2}/, 'reviewer 必須留白 —— 憲章 §16.C')
  assert.match(code, /status:\s*['"]pending['"]/, 'status 必須係 pending —— 憲章 §12')
  assert.ok(!/status:\s*['"]approved['"]/.test(code), '腳本唔可以自己寫 approved')
})

// ── ③ 分界線必須由目標倒推，唔可以係硬編嘅靚數 ────────────────────────────
//
// 65% 目標一改，分界線要跟住改。寫死 0.75 / 0.525 嘅話，改完目標之後
// 校準結果會靜靜哋繼續用舊分界 —— 而冇人會察覺，因為個報告照樣印得靚。
test('分界線由 TIER_TARGET 推出，唔係硬編', () => {
  const code = strip(CALIB)
  assert.match(code, /CUT_EASY_MEDIUM\s*=\s*\(TIER_TARGET\.easy\s*\+\s*TIER_TARGET\.medium\)\s*\/\s*2/)
  assert.match(code, /CUT_MEDIUM_HARD\s*=\s*\(TIER_TARGET\.medium\s*\+\s*TIER_TARGET\.hard\)\s*\/\s*2/)
  // 三層目標喺 3:5:2 之下要真係加得返出 65% 左右，否則分界線本身就係錯嘅。
  const m = code.match(/TIER_TARGET\s*=\s*\{\s*easy:\s*([\d.]+),\s*medium:\s*([\d.]+),\s*hard:\s*([\d.]+)/)
  assert.ok(m, '揾唔到 TIER_TARGET')
  const blend = 0.3 * Number(m![1]) + 0.5 * Number(m![2]) + 0.2 * Number(m![3])
  assert.ok(Math.abs(blend - 0.65) < 0.02, `三層目標 3:5:2 加權 = ${blend.toFixed(3)}，偏離 65% 太遠`)
})

// ── ④ 難度加權引擎維持關住 ────────────────────────────────────────────────
//
// 2026-09-10 簽署：「接受『65% 靠出新題而非靠加大抽題傾斜』呢個路徑」。
// 即係話 EMPIRICAL_K 維持 0 —— 校準做完之後最順手嘅下一步，
// 正正就係順手揭埋個掣，而嗰個掣一揭就變成咗另一條【冇簽過】嘅路。
test('校準唔可以順手揭開抽題傾斜', async () => {
  const { EMPIRICAL_K } = await import('../empiricalWeighting.ts')
  assert.equal(EMPIRICAL_K, 0, '簽署嘅路徑係出新題，唔係加大傾斜 —— 要揭要重新簽')
})
