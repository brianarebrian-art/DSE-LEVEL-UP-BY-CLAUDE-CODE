import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// ⚠️ 同 exam-day.test.mts 一樣要 default interop —— package.json 冇
// `"type": "module"`，tsx 會把 `.ts` 編成 CJS。
import * as ns from '../mascot.ts'
const M = (ns as unknown as { default?: typeof ns }).default ?? ns

const ROOT = new URL('../../', import.meta.url).pathname

// 呢批測試守嘅係創辦人 2026-09-03 定嘅兩條規則。
// 規則寫喺 CLAUDE.md 或者 commit message 入面係守唔住嘅 —— 下次有人加新頁，
// 冇人會去揾。所以規則本身要跑得到。

const walk = (dir: string, out: string[] = []): string[] => {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return out
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, e.name)
    if (e.isDirectory()) walk(rel, out)
    else if (/\.tsx$/.test(e.name)) out.push(rel)
  }
  return out
}
const ALL_TSX = [...walk('app'), ...walk('components')]
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')
// 剝註解 —— 檔頭寫「呢版唔擺吉祥物」係好事，唔可以當成擺咗。
const stripComments = (s: string) =>
  s.split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n')
   .replace(/\/\*[\s\S]*?\*\//g, '')
const usesMascot = (rel: string) =>
  (stripComments(read(rel)).match(/<Mascot\b/g) ?? []).length

test('規則①：每個檔案最多一個 <Mascot>', () => {
  for (const rel of ALL_TSX) {
    const n = usesMascot(rel)
    assert.ok(n <= 1, `${rel} 出現咗 ${n} 個 <Mascot> —— 每頁最多一隻`)
  }
})

test('規則②：做緊題目嘅頁面一隻都唔准擺', () => {
  // 由路由前綴推返實際檔案夾（/source-lab → app/source-lab/**）。
  for (const route of M.NO_MASCOT_ROUTES) {
    const dir = `app${route}`
    const files = ALL_TSX.filter((f) => f === `${dir}.tsx` || f.startsWith(`${dir}/`))
    assert.ok(files.length > 0, `${route} 揾唔到對應檔案 —— 路由改咗名？呢條測試就會靜靜雞唔再守任何嘢`)
    for (const f of files) {
      assert.equal(usesMascot(f), 0, `${f} 喺「做緊題目」範圍入面，唔准擺吉祥物`)
    }
  }
})

test('規則②：練習流程用到嘅題目卡組件本身亦唔准擺', () => {
  // 路由層封死唔夠 —— 題目卡係組件，可以畀任何一版 import。
  for (const f of ['components/BlindTestQuestion.tsx', 'components/LongQuestionCard.tsx',
                   'components/TextQuestionCard.tsx', 'components/StepHints.tsx']) {
    if (!fs.existsSync(path.join(ROOT, f))) continue
    assert.equal(usesMascot(f), 0, `${f} 係題目卡，唔准擺吉祥物`)
  }
})

test('登記處入面每隻姿勢都有對應檔案，尺寸亦要對得上', () => {
  for (const [pose, dim] of Object.entries(M.POSES) as [string, { w: number; h: number }][]) {
    const p = path.join(ROOT, 'public/owl', `${pose}.png`)
    assert.ok(fs.existsSync(p), `public/owl/${pose}.png 唔存在`)
    assert.ok(dim.w > 0 && dim.h > 0, `${pose} 尺寸唔合理`)
    // PNG IHDR：8 bytes 簽名 + 4 長度 + 4 型別，之後係 4 bytes 闊 + 4 bytes 高。
    const buf = fs.readFileSync(p)
    assert.equal(buf.readUInt32BE(16), dim.w, `${pose} 登記闊度同實際檔案唔同`)
    assert.equal(buf.readUInt32BE(20), dim.h, `${pose} 登記高度同實際檔案唔同`)
  }
})

test('每個 placement 嘅路由都唔喺「唔准擺」名單入面', () => {
  for (const route of Object.keys(M.PLACEMENTS)) {
    assert.equal(M.isNoMascotRoute(route), false, `${route} 同時出現喺 PLACEMENTS 同禁擺名單`)
  }
})

test('isNoMascotRoute 連子路由一齊計', () => {
  assert.equal(M.isNoMascotRoute('/source-lab'), true)
  assert.equal(M.isNoMascotRoute('/source-lab/abc'), true)
  assert.equal(M.isNoMascotRoute('/practice'), true)
  assert.equal(M.isNoMascotRoute('/dashboard'), false)
  // 前綴唔可以誤中：/practice-notes 唔係 /practice 嘅子路由。
  assert.equal(M.isNoMascotRoute('/practice-notes'), false)
})

test('商標姿勢唔可以靜靜雞返嚟（憲章 §4）', () => {
  // Nintendo Switch 同蘋果 logo 嗰兩隻，2026-09-03 決定唔收。
  // 呢條測試存在嘅唯一理由，就係令「補返個檔上去」呢個動作會即刻紅 ——
  // 一個只寫喺 README 嘅決定，下一手好容易當成漏咗。
  for (const banned of M.BANNED_POSES) {
    assert.ok(!(banned in M.POSES), `${banned} 含第三方註冊商標，唔可以入 POSES`)
    assert.ok(
      !fs.existsSync(path.join(ROOT, 'public/owl', `${banned}.png`)),
      `public/owl/${banned}.png 含第三方註冊商標 —— 要用先要重畫件裝置去 logo`,
    )
  }
})

test('吉祥物喺舒適模式之下要整隻收埋（憲章 §7）', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8')
  assert.match(
    css,
    /html\.no-motion\s+\.mascot\s*\{[^}]*display:\s*none/,
    'globals.css 冇喺 html.no-motion 之下收起 .mascot —— SEN 要「整層關掉」，唔係「調細」',
  )
  const cmp = read('components/Mascot.tsx')
  assert.match(cmp, /className=\{`mascot /, 'Mascot 冇掛 .mascot class，上面條 CSS 就搭唔到')
  assert.match(cmp, /aria-hidden/, 'Mascot 係裝飾，要 aria-hidden')
  assert.match(cmp, /alt=""/, 'Mascot 要空 alt，唔好讀出嚟')
})
