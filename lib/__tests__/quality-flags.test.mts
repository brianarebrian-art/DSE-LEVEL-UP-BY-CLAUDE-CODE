// ============================================================================
// quality-flags.test.mts —— 品質徽章第三個狀態「待核」
// ----------------------------------------------------------------------------
// 「待核」嘅價值完全建基於一件事：每一個待核都有【具體、可以核實】嘅原因。
// 一旦佢可以由其他路徑出現（手寫、預設、「未審」），佢就變返一個假透明標籤 ——
// 同 §16.D「將 build-time 測試講成 runtime 防護」係同一個病：讀嘅人以為有，實際冇。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')
// dynamic import：tsx 之下 .ts 模組經 CJS interop，靜態具名 import 會 SyntaxError
const { FLAGGED } = (await import('../../data/qualityFlags.ts')) as {
  FLAGGED: Record<string, string[]>
}

test('① 生成檔冇過時 —— 重新生成必須一模一樣', async () => {
  // 生成器只喺直接執行先寫檔（同 gen-provenance.mjs 一樣）；import 唔會寫，
  // 所以呢條測試唔會「跑第一次紅、第二次綠」。
  const gen = (await import('../../scripts/qbank/gen-quality-flags.mts')) as {
    collectFlags: () => Promise<Record<string, string[]>>
  }
  const fresh = await gen.collectFlags()
  assert.deepEqual(
    FLAGGED,
    fresh,
    'data/qualityFlags.ts 過時 —— 跑 `npx tsx scripts/qbank/gen-quality-flags.mts` 再 commit',
  )
})

test('② 每條待核都有原因，而且原因只可以係已知嗰兩種', () => {
  // 「英文欄混中文」2026-09-15 抽樣後剷走：好多係刻意中英對照（化學「硫酸 / sulfuric acid」、
  // 科技與生活「"9 折" and "10% off"」），regex 分唔到刻意同漏譯。要加返，先要真人分完。
  const ok = new Set(['posref', 'posref-en'])
  for (const [id, f] of Object.entries(FLAGGED)) {
    assert.ok(f.length > 0, `${id} 冇原因`)
    for (const x of f) assert.ok(ok.has(x), `${id} 有未知原因「${x}」`)
  }
})

test('③ posref 待核一定要喺祖父清單入面 —— 唔可以自己作', () => {
  const base = JSON.parse(read('scripts', 'qbank', 'posref-bank-baseline.json')) as {
    grandfathered: Record<string, string[]>
  }
  const listed = new Set(Object.values(base.grandfathered).flat().map((e) => e.split(' ')[0]))
  for (const [id, f] of Object.entries(FLAGGED)) {
    if (f.includes('posref') || f.includes('posref-en')) {
      assert.ok(listed.has(id), `${id} 標咗 posref，但唔喺 posref-bank-baseline.json`)
    }
  }
})

test('④「待核」只可以由 FLAGGED 觸發，而且按介面語言分開', () => {
  const src = read('components', 'QuestionProvenance.tsx')
  assert.match(src, /const ZH_FLAGS: QualityFlag\[\] = \['posref'\]/, '中文介面嘅待核原因被改咗')
  assert.match(src, /const EN_FLAGS: QualityFlag\[\] = \['posref-en'\]/, '英文介面嘅待核原因被改咗')
  assert.match(src, /const pending = \(FLAGGED\[questionId\] \?\? \[\]\)\.filter/, 'pending 唔係由 FLAGGED 計')
  // 「待核」字眼只可以出現喺 pending 分支
  const code = src.replace(/^\s*\/\/.*$/gm, '')
  const i = code.indexOf("'待核'")
  assert.ok(i > 0, '待核文字唔見咗')
  assert.ok(code.lastIndexOf('pending.length ? (', i) > 0, '「待核」唔喺 pending 分支入面')
  assert.equal(code.split("'待核'").length - 1, 1, '「待核」出現多過一次 —— 有另一條路徑可以貼呢個標籤')
})

test('⑤ /transparency 嘅待核數字由 FLAGGED 計，唔寫死', () => {
  const src = read('app', 'transparency', 'TransparencyClient.tsx')
  assert.match(src, /const PENDING_ZH = Object\.values\(FLAGGED\)/, '中文待核數寫死咗')
  assert.match(src, /const PENDING_EN = Object\.values\(FLAGGED\)/, '英文待核數寫死咗')
})

test('⑥ 生成器嘅 pattern 同 check-posref.mjs 一致', () => {
  // 兩邊各寫一份 regex，改咗一邊冇改另一邊，待核就會同閘嘅判斷分叉。
  const gate = read('scripts', 'qbank', 'check-posref.mjs')
  const gen = read('scripts', 'qbank', 'gen-quality-flags.mts')
  const zh = gate.match(/const ZH = (\/.+\/)\n/)?.[1]
  const en = gate.match(/const EN = (\/.+\/)\n/)?.[1]
  assert.ok(zh && en, '讀唔到 check-posref.mjs 嘅 pattern')
  assert.ok(gen.includes(`const POS_ZH = ${zh}`), '中文 pattern 同 check-posref.mjs 唔一致')
  assert.ok(gen.includes(`const POS_EN = ${en}`), '英文 pattern 同 check-posref.mjs 唔一致')
})

test('⑦ 生成器要對住現行文字重新驗，唔可以照抄基線', () => {
  // 基線係 2026-09-05 嘅候選清單。已修好嘅題照抄落嚟，就會掛住一個假待核。
  const gen = read('scripts', 'qbank', 'gen-quality-flags.mts')
  assert.match(gen, /if \(!POS_ZH\.test\(text\) && !POS_EN\.test\(text\)\) continue/, '冇重新驗現行文字')
})
