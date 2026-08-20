import { test } from 'node:test'
import assert from 'node:assert/strict'

// 史料判讀室的守門測試。
//
// 重點不在於渲染是否正確，而在於【來源紀律】能否被機器守住：任何一項事實、
// 詮釋或立場若失去具名引用，或可靠性等級被填錯，都會令學生把不可靠的內容抄
// 進評核答卷。此類缺陷靠人眼複查並不可靠，故以測試釘死。

const mod = await import('../../data/history-sources.ts')
const { sourceLabEntries, getSourceLabEntry, getSourceLabEntriesBySubject, RELIABILITY_LABEL } = mod

const RELIABILITIES = ['primary', 'secondary', 'tertiary'] as const
const SUBJECTS = ['history', 'chinese-history']

// 課程範圍。Yuna 2026-08-20 拍板：只做 DSE 課程之內。此清單同
// data/questions/history.ts 的 topic id 對齊。
const HISTORY_TOPICS = [
  'ww1', 'ww2', 'cold_war', 'dictatorship', 'intl_coop', 'china_mod', 'japan_mod', 'hk_seasia',
]

test('有條目，且 id 唯一', () => {
  assert.ok(sourceLabEntries.length > 0, '至少要有一條')
  const ids = sourceLabEntries.map((e) => e.id)
  assert.equal(new Set(ids).size, ids.length, `id 重複：${ids.join(', ')}`)
})

test('每項來源都有具名引用（中英俱備）', () => {
  for (const entry of sourceLabEntries) {
    const all = [
      ...entry.facts.map((f) => ({ where: 'fact', src: f.source })),
      ...entry.perspectives.map((p) => ({ where: `perspective「${p.nameZh}」`, src: p.source })),
      ...entry.positions.map((p) => ({ where: `position「${p.entityZh}」`, src: p.source })),
    ]
    assert.ok(all.length > 0, `${entry.id} 冇任何附來源的內容`)
    for (const { where, src } of all) {
      assert.ok(src.cite?.trim(), `${entry.id} / ${where}：cite 空白`)
      assert.ok(src.citeEn?.trim(), `${entry.id} / ${where}：citeEn 空白`)
      assert.ok(
        RELIABILITIES.includes(src.reliability),
        `${entry.id} / ${where}：可靠性等級非法（${src.reliability}）`,
      )
    }
  }
})

test('唔准出現似檔案編號的內容 —— 除非附可核查連結', () => {
  // 「砌一個似模似樣的檔案編號」是本功能最大的風險。凡引用中出現連續數字編號
  // 樣式（例如 "RG 59, Box 4212" 或 "Doc. 88214"），必須同時附上可核查連結，
  // 否則學生無從驗證。條約條款號（第二三一條）以中文數字書寫，不會誤中。
  const ARCHIVE_LIKE = /\b(?:box|doc|file|rg|folder|acc)\.?\s*\d{2,}/i
  for (const entry of sourceLabEntries) {
    const all = [
      ...entry.facts.map((f) => f.source),
      ...entry.perspectives.map((p) => p.source),
      ...entry.positions.map((p) => p.source),
    ]
    for (const src of all) {
      for (const text of [src.cite, src.citeEn]) {
        if (ARCHIVE_LIKE.test(text)) {
          assert.ok(
            src.url,
            `${entry.id}：引用「${text}」含檔案編號樣式但無可核查連結 —— 不得填造出處`,
          )
        }
      }
    }
  }
})

test('標記為待查的來源，介面文案須帶警示語，且不得聲稱為一手史料', () => {
  for (const entry of sourceLabEntries) {
    const pending = [
      ...entry.facts.map((f) => f.source),
      ...entry.perspectives.map((p) => p.source),
      ...entry.positions.map((p) => p.source),
    ].filter((s) => s.pending)
    for (const src of pending) {
      assert.notEqual(
        src.reliability,
        'primary',
        `${entry.id}：來源待查者不得同時標為一手史料（${src.cite}）`,
      )
    }
  }
})

test('每條都有事實層、詮釋層、卷一陷阱', () => {
  for (const entry of sourceLabEntries) {
    assert.ok(entry.facts.length >= 3, `${entry.id}：事實層少於 3 項`)
    // 詮釋層必須至少兩個視角 —— 只有一個視角就唔係「多方詮釋」，
    // 反而會令學生以為嗰個就係標準答案。
    assert.ok(entry.perspectives.length >= 2, `${entry.id}：詮釋視角少於 2 個`)
    assert.ok(entry.trapZh?.trim(), `${entry.id}：缺卷一陷阱（中）`)
    assert.ok(entry.trapEn?.trim(), `${entry.id}：缺卷一陷阱（英）`)
  }
})

test('中英雙語齊全', () => {
  for (const entry of sourceLabEntries) {
    for (const [zh, en, label] of [
      [entry.titleZh, entry.titleEn, 'title'],
      [entry.dateZh, entry.dateEn, 'date'],
      [entry.placeZh, entry.placeEn, 'place'],
    ] as const) {
      assert.ok(zh?.trim(), `${entry.id}：${label} 缺中文`)
      assert.ok(en?.trim(), `${entry.id}：${label} 缺英文`)
    }
    for (const f of entry.facts) {
      assert.ok(f.zh?.trim() && f.en?.trim(), `${entry.id}：事實缺雙語`)
    }
    for (const p of entry.perspectives) {
      assert.ok(p.nameZh?.trim() && p.nameEn?.trim(), `${entry.id}：視角名缺雙語`)
      assert.ok(p.bodyZh?.trim() && p.bodyEn?.trim(), `${entry.id}：視角內容缺雙語`)
    }
    for (const p of entry.positions) {
      assert.ok(p.entityZh?.trim() && p.entityEn?.trim(), `${entry.id}：實體名缺雙語`)
      assert.ok(p.stanceZh?.trim() && p.stanceEn?.trim(), `${entry.id}：立場缺雙語`)
    }
  }
})

test('範圍鎖死喺 DSE 課程之內', () => {
  for (const entry of sourceLabEntries) {
    assert.ok(SUBJECTS.includes(entry.subject), `${entry.id}：科目 ${entry.subject} 不在範圍`)
    if (entry.subject === 'history') {
      assert.ok(
        HISTORY_TOPICS.includes(entry.topic),
        `${entry.id}：課題 ${entry.topic} 唔喺 DSE 歷史科課程內 —— 見 IMPACT-source-lab-2026-08-20.md §2`,
      )
    }
  }
})

test('查詢函數行為正確', () => {
  const first = sourceLabEntries[0]
  assert.equal(getSourceLabEntry(first.id)?.id, first.id)
  assert.equal(getSourceLabEntry('does-not-exist'), undefined)

  const hist = getSourceLabEntriesBySubject('history')
  assert.ok(hist.every((e) => e.subject === 'history'))
  assert.equal(getSourceLabEntriesBySubject('math').length, 0)
})

test('可靠性標籤三級齊全', () => {
  for (const r of RELIABILITIES) {
    assert.ok(RELIABILITY_LABEL[r]?.zh, `${r} 缺中文標籤`)
    assert.ok(RELIABILITY_LABEL[r]?.en, `${r} 缺英文標籤`)
  }
})

test('學術層無粵語口語', () => {
  // 憲章 §5：UI 情感層可用廣東話，但史料內容屬學術層，必須 100% 標準書面語。
  const COLLOQUIAL = /[嘅嘢咗喺唔佢哋咁嗰乜嘥啲]/
  for (const entry of sourceLabEntries) {
    const academic = [
      ...entry.facts.flatMap((f) => [f.zh]),
      ...entry.perspectives.flatMap((p) => [p.nameZh, p.bodyZh]),
      ...entry.positions.flatMap((p) => [p.entityZh, p.stanceZh]),
      entry.titleZh,
    ]
    for (const text of academic) {
      const hit = COLLOQUIAL.exec(text)
      assert.equal(hit, null, `${entry.id}：學術層出現口語「${hit?.[0]}」 → ${text.slice(0, 40)}…`)
    }
  }
})
