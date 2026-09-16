// ============================================================================
// pwa-icons.test.mts —— manifest 講嘅圖示要真係存在，而且真係嗰個尺寸
// ----------------------------------------------------------------------------
// 2026-09-16：manifest 原本淨係列住 owl.svg ＋ favicon.ico。收唔到 SVG 嘅
// Android 瀏覽器會攞 32px 嘅 favicon 放大，主畫面個圖示糊晒。加咗 192／512／
// maskable 三張 PNG ＋ app/apple-icon.png（iOS）。
//
// 呢條測試守嘅唔係「有幾多張圖」，係【manifest 同磁碟唔可以講兩個故事】——
// 一個指去唔存在嘅檔案嘅 manifest，喺瀏覽器度係靜靜哋失敗：冇 error、
// 冇 console、個站照行，只係學生加到主畫面嗰個圖示變咗一嚿糊嘢，冇人會知。
// 尺寸都要對：`sizes: '512x512'` 但實際 192px 一樣係靜靜哋變糊。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

/** `/x.png` 可以由 public/x.png 或者 app/x.png（Next 檔案慣例）提供。 */
function resolveServed(src: string): string | null {
  for (const base of ['public', 'app']) {
    const p = join(ROOT, base, src.replace(/^\//, ''))
    if (existsSync(p)) return p
  }
  return null
}

/** PNG 頭 8 bytes 之後係 IHDR：長度(4) + 'IHDR'(4) + 闊(4) + 高(4)。 */
function pngSize(file: string): { w: number; h: number } {
  const b = readFileSync(file)
  assert.equal(b.subarray(1, 4).toString('ascii'), 'PNG', `${file} 唔係 PNG`)
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
}

const mod = await import(join(ROOT, 'app', 'manifest.ts'))
const manifest = (mod.default ?? mod)()
const icons: { src: string; sizes?: string; type?: string; purpose?: string }[] = manifest.icons ?? []

test('① manifest 列嘅每個圖示都要真係存在', () => {
  const missing = icons.map((i) => i.src).filter((src) => !resolveServed(src))
  assert.deepEqual(missing, [], `manifest 指去唔存在嘅檔案：${missing.join(', ')}`)
})

test('② PNG 嘅實際尺寸要同 sizes 講嘅一樣', () => {
  const wrong: string[] = []
  for (const i of icons) {
    if (i.type !== 'image/png' || !i.sizes || !/^\d+x\d+$/.test(i.sizes)) continue
    const file = resolveServed(i.src)!
    const { w, h } = pngSize(file)
    const [dw, dh] = i.sizes.split('x').map(Number)
    if (w !== dw || h !== dh) wrong.push(`${i.src} 實際 ${w}x${h}，manifest 寫 ${i.sizes}`)
  }
  assert.deepEqual(wrong, [], wrong.join(' · '))
})

test('③ Android 要 192 同 512，仲要有一張 maskable', () => {
  const png = icons.filter((i) => i.type === 'image/png')
  assert.ok(png.some((i) => i.sizes === '192x192'), 'manifest 冇 192x192 PNG —— 部分 Android 瀏覽器會攞 favicon 放大')
  assert.ok(png.some((i) => i.sizes === '512x512' && i.purpose !== 'maskable'), 'manifest 冇 512x512 嘅一般 PNG')
  assert.ok(png.some((i) => i.purpose === 'maskable'), 'manifest 冇 maskable —— Android 切圓形嗰陣會切到隻貓頭鷹')
})

test('④ iOS 要 apple-touch-icon（Next 檔案慣例）', () => {
  const p = join(ROOT, 'app', 'apple-icon.png')
  assert.ok(existsSync(p), 'app/apple-icon.png 唔見咗 —— iOS 唔讀 manifest 圖示，加到主畫面會攞網頁截圖')
  const { w, h } = pngSize(p)
  assert.ok(w >= 180 && h >= 180, `apple-icon 只有 ${w}x${h}，iOS 用 180x180`)
})
