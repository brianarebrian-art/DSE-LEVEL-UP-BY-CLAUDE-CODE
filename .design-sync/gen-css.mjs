// 由 Next.js build 輸出攞【編譯好嘅】Tailwind CSS，放去一個穩定路徑。
//
// 點解要有佢：`app/globals.css` 第一行係 `@import "tailwindcss"` —— 佢係【源檔】，
// 唔係編譯輸出。直接餵佢做 cfg.cssEntry 嘅話，`rounded-xl`／`bg-gold/10`／`text-ink`
// 呢啲 utility class 一條 CSS rule 都冇，預覽 render 出嚟係幾乎睇唔到嘅淺字
// （2026-09-18 實測：文字有、邊框底色全無）。
//
// Next 出嘅檔名帶 content hash（每次 build 都變），所以唔可以直接寫入 config ——
// 呢個腳本負責揀最大嗰個（主 stylesheet）再抄去一個固定位。
//
// 用法（每次 `npm run build` 之後）：
//   node .design-sync/gen-css.mjs
//
// 產出：.design-sync/.cache/compiled.css（gitignore 咗，屬 build 產物）
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const CSS_DIR = join(ROOT, '.next/static/css')
const OUT_DIR = join(ROOT, '.design-sync/.cache')
const OUT = join(OUT_DIR, 'compiled.css')

let files
try {
  files = readdirSync(CSS_DIR).filter((f) => f.endsWith('.css'))
} catch {
  console.error(`✗ 搵唔到 ${CSS_DIR} —— 先跑 \`npm run build\``)
  process.exit(1)
}
if (!files.length) {
  console.error('✗ .next/static/css 入面冇 .css —— build 失敗咗？')
  process.exit(1)
}

// ⚠️ 要【全部】chunk 合埋，唔可以淨係揀最大嗰個。
// 2026-09-18 實測：Tailwind 主 sheet 喺 88KB 嗰個，但 KaTeX（393 條 `.katex` 規則）
// 喺 28KB 嗰個。只抄大嗰個嘅話 `.katex-mathml` 嗰條隱藏規則唔見咗，
// 數式會 KaTeX 版同 MathML fallback 一齊顯示 —— 螢幕上見到公式重複咗兩次。
const parts = files
  .map((f) => ({ f, size: statSync(join(CSS_DIR, f)).size }))
  .sort((a, b) => b.size - a.size)

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(
  OUT,
  parts.map(({ f }) => `/* ${f} */\n${readFileSync(join(CSS_DIR, f), 'utf8')}`).join('\n'),
)
console.log(`compiled.css ← ${parts.length} 個 chunk 合併：`)
for (const { f, size } of parts) console.log(`  ${f} (${(size / 1024) | 0} KB)`)
