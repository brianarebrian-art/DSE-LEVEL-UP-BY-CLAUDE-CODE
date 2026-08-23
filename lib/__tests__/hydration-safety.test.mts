// ============================================================================
// hydration-safety.test.mts —— SSR / client 一致性（第 4 週端到端 QA）
// ----------------------------------------------------------------------------
// 2026-08-23 喺 /reading 撞到：一個會被伺服器渲染嘅 client component，
// 喺 useMemo 初始化器入面用 Math.random() 洗牌選項。結果伺服器洗一個次序、
// 瀏覽器洗另一個次序，React hydration 直接失敗：
//   "Hydration failed because the server rendered text didn't match the client"
// 後果係成棵樹喺客戶端重繪，用戶見到選項跳一跳，而 console 每次載入都報錯。
//
// tsc 唔會捉、eslint 唔會捉、build 會過、所有現有測試都綠。
// 所以要喺呢度落一條斷言。
//
// ⚠️ 限制：呢個檢查係【淺層】嘅 —— 佢只捉「Math.random()／Date.now() 直接寫喺
// useMemo／useState 初始化器入面」。如果不確定性藏喺一個被呼叫嘅函數入面
// （例如 PracticeSession 嘅 buildPool），呢度捉唔到。PracticeSession 本身安全，
// 因為佢經 next/dynamic ssr:false 純客戶端載入，根本冇伺服器渲染。
// 落閘當日實測：165 個 .tsx → 0 處。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) {
      if (e.name !== '__tests__') walk(rel, out)
      continue
    }
    if (e.name.endsWith('.tsx')) out.push(rel)
  }
  return out
}
const TSX = [...walk('app'), ...walk('components')]

test('client component 唔可以喺 useMemo／useState 初始化器用不確定值', () => {
  const bad: string[] = []
  for (const f of TSX) {
    const src = read(f)
    if (!/^'use client'/m.test(src)) continue
    for (const m of src.matchAll(/use(?:Memo|State)\s*(?:<[^>]*>)?\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\n\s*\}\s*[,)]/g)) {
      const found = m[0].match(/Math\.random\(\)|Date\.now\(\)/)
      if (found) bad.push(`${f} —— ${found[0]}`)
    }
  }
  assert.deepEqual(
    bad,
    [],
    `呢啲會令伺服器同瀏覽器渲染唔一致（hydration 失敗）：\n  ${bad.join('\n  ')}`,
  )
})

test('/reading 用決定性洗牌，唔用 Math.random', () => {
  const src = read('app/reading/ReadingClient.tsx')
  // 剝走註解：檔頭正正就係寫住「原本用 Math.random()…」嚟解釋點解改咗，
  // 唔剝走就會捉錯自己嗰段說明。
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1')
  assert.ok(!/Math\.random/.test(code), '/reading 又用返 Math.random 洗牌')
  assert.match(src, /function seededShuffle/, '應該用由題目 key 導出嘅決定性洗牌')
  // 唔可以用 [^)]* —— 內層 .map(…) 嘅收掣會提早截斷。改為逐行搵呼叫。
  const call = code.split('\n').find((l) => l.includes('seededShuffle('))
  assert.ok(call, '搵唔到 seededShuffle 嘅呼叫')
  assert.match(call, /,\s*key\s*\)/, '洗牌一定要帶 key，否則每題洗出同一個次序')
})

// 決定性洗牌唔可以「決定性到」永遠將正確答案放喺同一個位。
// 資料入面正確答案永遠係 options[0]，洗牌就係為咗打散佢。
test('決定性洗牌之後，正確答案唔會集中喺同一個位置', async () => {
  function hashSeed(key: string): number {
    let h = 0x811c9dc5
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i)
      h = Math.imul(h, 0x01000193)
    }
    return h >>> 0
  }
  function seededShuffle<T>(arr: T[], key: string): T[] {
    const a = [...arr]
    let s = hashSeed(key)
    const next = () => {
      s |= 0
      s = (s + 0x6d2b79f5) | 0
      let t = Math.imul(s ^ (s >>> 15), 1 | s)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const { readingPassages } = (await import('../../data/reading.ts')) as {
    readingPassages: { id: string; questions: { options: string[] }[] }[]
  }
  const pos = [0, 0, 0, 0]
  let total = 0
  for (const p of readingPassages) {
    p.questions.forEach((q, i) => {
      const sh = seededShuffle(
        q.options.map((text, idx) => ({ text, correct: idx === 0 })),
        `${p.id}-${i}`,
      )
      pos[sh.findIndex((o) => o.correct)]++
      total++
    })
  }
  assert.ok(total > 0, '搵唔到閱讀題')
  // 冇任何一個位置食晒超過七成 —— 唔係嘅話學生撳同一個位就中
  const worst = Math.max(...pos)
  assert.ok(
    worst / total <= 0.7,
    `正確答案過度集中：A/B/C/D = ${pos.join('/')}（共 ${total} 題）`,
  )
})

// 同一個 key 洗兩次一定要一模一樣 —— 呢個就係 hydration 一致性嘅根本保證
test('同一個 key 洗牌結果必須可重現', () => {
  const src = read('app/reading/ReadingClient.tsx')
  // seed 只可以由 key 嚟，唔可以夾雜任何運行時狀態
  const fn = src.match(/function hashSeed[\s\S]*?\n\}/)?.[0] ?? ''
  assert.ok(fn.length > 0, '搵唔到 hashSeed')
  for (const re of [/Math\.random/, /Date\./, /performance\./, /window\./]) {
    assert.ok(!re.test(fn), `hashSeed 混入咗運行時狀態 ${re}，洗牌就唔再可重現`)
  }
})
