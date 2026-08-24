// ============================================================================
// week2-concept-suggestions.test.mts —— 知識概念網 + 溫柔每日建議
// ----------------------------------------------------------------------------
// 呢兩個模組最易壞嘅唔係「行唔行到」，而係「靜靜雞變返做遊戲化」：
// 概念網變收集圖鑑（加完成度、加稀有度），建議變每日任務（加連續日數、加紅點）。
// 呢啲改動全部唔會令任何現有測試變紅，所以要喺呢度落斷言。
//
// 另外守住一條零虛構紅線：概念網嘅十二個節點必須每一個都真係有題目對得返，
// 否則個網會長期有死節點，學生點做都著唔到。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8')

const NET_UI = read('components/ConceptNet.tsx')
const NET_PAGE = read('app/concept-net/ConceptNetView.tsx')
const SUGG_UI = read('components/GentleSuggestions.tsx')
const SCHEDULER = read('components/ReviewScheduler.tsx')

// 瀏覽器環境 stub。兩個模組都用 `typeof window === 'undefined'` 做 SSR 守衛
// （同全 repo 一致），所以測試要連 window 一齊補，唔可以淨係補 localStorage ——
// 否則所有寫入都會靜靜雞 early-return，測試會綠得好假。
function withStorage(store: Record<string, string>, fn: () => void) {
  const g = globalThis as unknown as { localStorage?: unknown; window?: unknown }
  const prevLs = g.localStorage
  const prevWin = g.window
  g.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
  }
  g.window = g.window ?? {}
  try { fn() } finally { g.localStorage = prevLs; g.window = prevWin }
}

const { CONCEPT_TEXTS, textsInQuestion, pairKey, computeConceptNet, recordConceptHits } =
  await import('../conceptNet.ts')
const { getSubjectQuestions } = await import('../../data/questions/index.ts')

// ── 概念網：節點必須對得返真題 ─────────────────────────────────────────────
test('十二篇 —— 數目同 id 唯一', () => {
  assert.equal(CONCEPT_TEXTS.length, 12, '考評局指定文言範文係十二篇')
  assert.equal(new Set(CONCEPT_TEXTS.map((t) => t.id)).size, 12)
})

test('每一篇都至少有一條真題對得返 —— 唔可以有永遠著唔到嘅死節點', () => {
  const bank = getSubjectQuestions('chinese') as unknown as Record<string, unknown>[]
  const covered = new Set<string>()
  for (const q of bank) {
    for (const id of textsInQuestion(q.content as string, q.topicZh as string)) covered.add(id)
  }
  const dead = CONCEPT_TEXTS.filter((t) => !covered.has(t.id)).map((t) => t.zh)
  assert.deepEqual(dead, [], `呢幾篇喺中文題庫搵唔到任何題目：${dead.join('、')}`)
})

test('篇名辨認唔可以認錯 —— 唔相干嘅題目一篇都唔應該命中', () => {
  assert.deepEqual(textsInQuestion('下列哪一項是「莘莘學子」的正確讀音？'), [])
  assert.deepEqual(textsInQuestion(''), [])
  assert.deepEqual(textsInQuestion(null, undefined), [])
})

test('pairKey 唔分次序 —— a-b 同 b-a 係同一條邊', () => {
  assert.equal(pairKey('yuwo', 'lunyu'), pairKey('lunyu', 'yuwo'))
})

test('真實跨篇題先建立跨篇連接，而且唔受文體分組限制', () => {
  const store: Record<string, string> = {}
  withStorage(store, () => {
    // 「魚我所欲也」（masters）+「廉頗藺相如列傳」（prose）—— 分屬兩組
    recordConceptHits([{ texts: ['yuwo', 'lianpo'], correct: true }])
    const net = computeConceptNet()
    const cross = net.edges.filter((e) => e.crossText)
    assert.equal(cross.length, 1, '一條跨篇題答啱應該建立一條跨篇連接')
    assert.deepEqual([cross[0].a, cross[0].b].sort(), ['lianpo', 'yuwo'])
  })
})

test('答錯【唔會】點亮任何節點 —— 個網代表已經揸得穩嘅嘢', () => {
  const store: Record<string, string> = {}
  withStorage(store, () => {
    recordConceptHits([{ texts: ['yuwo'], correct: false }])
    assert.equal(computeConceptNet().exploredCount, 0)
  })
})

test('同組兩篇都探索過先有可比較連接；一篇都唔夠', () => {
  const store: Record<string, string> = {}
  withStorage(store, () => {
    recordConceptHits([{ texts: ['yuwo'], correct: true }])
    assert.equal(computeConceptNet().connectionCount, 0, '得一篇唔應該有連接')
    recordConceptHits([{ texts: ['quanxue'], correct: true }])
    const net = computeConceptNet()
    assert.equal(net.exploredCount, 2)
    assert.equal(net.connectionCount, 1, '同組兩篇都著咗，應該有一條可比較連接')
    assert.equal(net.edges[0].crossText, false)
  })
})

// ── 概念網：唔可以變返做收集圖鑑（規格書 §4.4）─────────────────────────────
test('概念網 UI 冇完成度百分比、冇「X / 12」', () => {
  const code = NET_UI.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
  for (const re of [/完成度/, /\bcompletion\b/i, /\/\s*12\b/, /100%/]) {
    assert.ok(!re.test(code), `概念網出現咗 ${re} —— 規格書 §4.4 明訂冇完成度`)
  }
  assert.match(NET_UI, /已建立 \$\{state\.connectionCount\} 個連接/)
})

test('節點大小固定 —— 冇稀有度差異', () => {
  assert.match(NET_UI, /const NODE_R = \d+/)
  // r={NODE_R} 必須係常數，唔可以跟 hits 計
  assert.ok(!/r=\{[^}]*hits/.test(NET_UI), '節點半徑跟表現變 = 稀有度')
})

test('未探索節點寫「等待發現」，唔寫「未完成」', () => {
  assert.match(NET_UI, /等待發現/)
  assert.match(NET_UI, /waiting to be discovered/)
  // 剝走註解：註解可以解釋「唔寫未完成」，生效代碼一個字都唔准有
  const code = NET_UI.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
  assert.ok(!/未完成/.test(code))
})

test('概念網唔可以引入圖表庫', () => {
  const imports = NET_UI.split('\n').filter((l) => /^\s*import\b/.test(l)).join('\n').toLowerCase()
  for (const lib of ['chart.js', 'recharts', 'd3', 'vis-network', 'cytoscape']) {
    assert.ok(!imports.includes(lib), `引入咗 ${lib}`)
  }
})

test('文體分組要如實講明唔係考評局分類', () => {
  assert.match(NET_UI, /唔係考評局嘅官方分類/)
  assert.match(NET_UI, /not an HKEAA classification/)
})

test('概念網頁面唔可以出現評分 —— 撳節點出嘅係題目同解析', () => {
  const code = NET_PAGE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
  for (const re of [/\bscore\b/i, /\bgrade\b/i, /得分/, /評分/]) {
    assert.ok(!re.test(code), `概念網頁面出現咗 ${re}`)
  }
})

// ── 溫柔每日建議（規格書 §4.5）─────────────────────────────────────────────
const { buildSuggestions, todaySuggestions, dismissSuggestion, MAX_PER_DAY } =
  await import('../gentleSuggestions.ts')

test('每日最多 3 條', () => {
  assert.equal(MAX_PER_DAY, 3)
  withStorage({}, () => {
    assert.ok(todaySuggestions().length <= 3)
  })
})

test('冇任何數據嗰陣仍然有一條鼓勵語 —— 唔會出一版空白', () => {
  withStorage({}, () => {
    const all = buildSuggestions()
    assert.ok(all.length >= 1)
    assert.equal(all[all.length - 1].kind, 'encourage', '鼓勵語排最後，唔可以蓋過有數據嘅建議')
  })
})

test('撳走一條之後，今日唔會再出', () => {
  const store: Record<string, string> = {}
  withStorage(store, () => {
    const before = todaySuggestions()
    assert.ok(before.length > 0)
    dismissSuggestion(before[0].id)
    const after = todaySuggestions()
    assert.ok(!after.some((s) => s.id === before[0].id), '撳走咗嘅建議仲喺度')
  })
})

test('撳走只影響今日 —— id 帶日期，聽日重新計算', () => {
  withStorage({}, () => {
    for (const s of buildSuggestions()) {
      assert.match(s.id, /:\d{4}-\d{2}-\d{2}$/, `建議 id 冇帶日期：${s.id}`)
    }
  })
})

test('建議文案零 FOMO —— 冇連續日數、冇錯過、冇感嘆號', () => {
  withStorage({}, () => {
    for (const s of buildSuggestions()) {
      for (const text of [s.zh, s.en]) {
        for (const re of [/連續\s*\d/, /streak/i, /錯過/, /don’t miss/i, /!/, /！/]) {
          assert.ok(!re.test(text), `建議文案出現咗 ${re}：${text}`)
        }
      }
    }
  })
})

test('鼓勵語唔可以同其他人比較 —— 冇數據支撐嘅比較就係虛構', () => {
  withStorage({}, () => {
    const e = buildSuggestions().find((s) => s.kind === 'encourage')!
    for (const re of [/同齡/, /其他人/, /贏咗/, /peers?/i, /than others/i, /%/]) {
      assert.ok(!re.test(e.zh + e.en), `鼓勵語出現咗比較：${re}`)
    }
  })
})

test('建議卡冇紅點、冇未讀數、冇強制通知', () => {
  for (const re of [/bg-rose/, /badge/i, /notification/i, /animate-ping/]) {
    assert.ok(!re.test(SUGG_UI), `建議卡出現咗 ${re}`)
  }
  // 一條建議都冇就成張卡唔顯示，唔會出空殼提人「今日冇嘢做」
  assert.match(SUGG_UI, /items\.length === 0\) return null/)
})

test('每一條建議都有一鍵撳走', () => {
  assert.match(SUGG_UI, /dismiss\(s\.id\)/)
  assert.match(SUGG_UI, /aria-label=\{en \? 'Dismiss this suggestion for today'/)
})

// ── 重溫排程：唔可以再有第二份間隔表 ───────────────────────────────────────
test('ReviewScheduler 冇自己一份艾賓浩斯間隔 —— 兩份會漂走', () => {
  assert.ok(!/const INTERVALS/.test(SCHEDULER), 'ReviewScheduler 又自己定義咗 INTERVALS')
  assert.match(SCHEDULER, /from '@\/lib\/reviewSchedule'/)
})

test('間隔就係 1／3／7／14／30', async () => {
  const { INTERVALS } = await import('../reviewSchedule.ts')
  assert.deepEqual([...INTERVALS], [1, 3, 7, 14, 30])
})

// ── 迴歸鎖：清空之後真係要清得走 ───────────────────────────────────────────
//
// 原本 load() 用 `{ ...EMPTY }` 淺複製一個模組級常數，hits／cross 共用同一個物件，
// 寫入會改到常數本身 —— 清空之後舊數字仲會喺記憶體度復活。
// 呢條就係鎖住嗰個 bug。
test('清空概念網之後，即刻重新計算要係全白', async () => {
  const { resetConceptNet } = await import('../conceptNet.ts')
  const store: Record<string, string> = {}
  withStorage(store, () => {
    recordConceptHits([{ texts: ['yuwo', 'quanxue'], correct: true }])
    assert.equal(computeConceptNet().exploredCount, 2)
    resetConceptNet()
    assert.equal(computeConceptNet().exploredCount, 0, '清空咗但節點仲著住')
    assert.equal(computeConceptNet().connectionCount, 0)
  })
  // 另一個乾淨 store 亦唔可以見到上面嗰啲數
  withStorage({}, () => {
    assert.equal(computeConceptNet().exploredCount, 0, '狀態漏咗去另一個 storage')
  })
})

test('半殘 storage 唔可以畫出連去「等待發現」節點嘅線', () => {
  // 手改／舊版遺留：有 cross 對但冇對應 hits
  const store = { dse_concept_net: JSON.stringify({ v: 1, hits: {}, cross: { 'lianpo::yuwo': 1 } }) }
  withStorage(store, () => {
    const net = computeConceptNet()
    assert.equal(net.exploredCount, 0)
    assert.equal(net.connectionCount, 0, '兩端都未著，唔應該有線')
  })
})

test('建議卡唔可以同 DailySpectrum 撞名 —— 同一頁兩張同名卡係困惑源', () => {
  const spectrum = read('components/DailySpectrum.tsx')
  const title = (src: string) => src.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? ''
  const a = title(SUGG_UI)
  const b = title(spectrum)
  assert.ok(a.length > 0 && b.length > 0)
  assert.notEqual(a.replace(/\s/g, ''), b.replace(/\s/g, ''), '兩張卡標題一樣')
  assert.ok(!a.includes('今日學習光譜'), '建議卡唔應該再叫「今日學習光譜」')
})

test('撳走一條【唔會】補位 —— 補位等於「你唔做完唔准走」', () => {
  const store: Record<string, string> = {}
  withStorage(store, () => {
    const before = todaySuggestions()
    dismissSuggestion(before[0].id)
    const after = todaySuggestions()
    assert.equal(after.length, before.length - 1, '撳走之後補返一條上嚟')
  })
})

// ── 非華語考生：英文介面唔可以中英夾雜 ─────────────────────────────────────
test('英文建議文案唔可以夾中文 —— 非華語考生睇唔明', () => {
  const CJK = /[一-鿿]/
  const store: Record<string, string> = {
    dse_reverse_log: JSON.stringify([
      { subjectId: 'economics', questionId: 'q1', topic: '市場機制', topicEn: 'Market mechanism',
        topicId: 'market_mechanism', cause: 'B', selected: 'x', correct: 'y', ts: Date.now() - 86400000 },
    ]),
    dse_progress: JSON.stringify([
      { subjectId: 'math', subjectName: '數學（必修部分）', topicFilter: null, score: 9, total: 20,
        grade: '3', topicResults: [], elapsed: 700, timestamp: Date.now() - 21 * 86400000 },
    ]),
    dse_topic_stats: JSON.stringify({
      'economics::market_mechanism': { subjectId: 'economics', topic: 'market_mechanism',
        label: '市場機制', labelEn: 'Market mechanism', total: 12, wrong: 8 },
    }),
  }
  withStorage(store, () => {
    for (const s of buildSuggestions()) {
      assert.ok(!CJK.test(s.en), `英文文案夾咗中文（${s.kind}）：${s.en}`)
    }
  })
})

test('舊記錄冇 topicEn 一樣行得 —— 回落中文好過空白', () => {
  const store: Record<string, string> = {
    dse_reverse_log: JSON.stringify([
      { subjectId: 'economics', questionId: 'q1', topic: '市場機制',
        topicId: 'market_mechanism', cause: 'A', selected: 'x', correct: 'y', ts: Date.now() - 86400000 },
    ]),
  }
  withStorage(store, () => {
    const review = buildSuggestions().find((s) => s.kind === 'review')
    assert.ok(review, '搵唔到重溫建議')
    assert.match(review.en, /市場機制/, '冇 topicEn 應該回落中文，唔可以空白')
  })
})
