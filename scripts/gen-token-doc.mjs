// 由 app/globals.css 生成 docs/tokens.md —— 設計 token 嘅【唯一來源】仍然係 CSS 本身。
//
// 點解要生成而唔係人手維護一份 token 檔：
//   一份人手抄嘅 tokens.css／tokens.md 係第二個來源。改一邊漏另一邊，
//   兩份就會漂移 —— 憲章 §8.1 記低過呢個模式（「自己同自己打架」）。
//   2026-09-18 實測過一次後果：照規格描述手寫嘅 token 檔入面，
//   `--owl-*`、`[data-export]`、`.badge-pass`、`--focus-outer-opacity`
//   全部喺 repo 零命中，而 `--color-border:#E8E2D9` 更加係 globals.css
//   明文換走咗嘅值。生成就冇呢種嘢。
//
// 點解要出【resolved】而唔係淨係列宣告：
//   `--color-accent-strong` 喺 @theme 宣告咗 #00726C，但 :root（line 353）
//   之後重新指去 var(--color-ml-sage)。後者夠遲，贏 —— #00726C 喺預設
//   狀態一個像素都畫唔到，而 121 處 accent-strong 全部出 sage。
//   一份淨係列宣告嘅表會照抄 #00726C，然後所有人繼續信錯。
//
// 用法：
//   node scripts/gen-token-doc.mjs           重新生成 docs/tokens.md
//   node scripts/gen-token-doc.mjs --check   唔寫檔，對唔上就 exit 1（qa 用）
//
// 點解要有 --check：一個生成檔 commit 咗入 repo 之後，globals.css 一改
// 佢就會靜靜哋變舊 —— 咁同人手抄嗰份嘅分別就淨返「幾時開始錯」。
// 有咗個閘，改完 token 唔重跑就過唔到 qa。
//
// 唯讀 app/globals.css，只寫 docs/tokens.md。零依賴。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = 'app/globals.css'
const OUT = 'docs/tokens.md'

const raw = readFileSync(join(ROOT, SRC), 'utf8')

/**
 * 將註釋內容換成同長度嘅空白，令 offset ／行號完全對得返。
 * 必要：globals.css 嘅註釋入面有 `{`、`}`、`;`（例如 `bg-accent/[0.10]`、
 * 「A B 只食後代，掛喺 :root 自己嗰個要 AB 先食到」），唔遮住就會拆爛個 stack。
 */
function maskComments(s) {
  let out = ''
  for (let i = 0; i < s.length; ) {
    if (s[i] === '/' && s[i + 1] === '*') {
      const end = s.indexOf('*/', i + 2)
      const stop = end === -1 ? s.length : end + 2
      for (let j = i; j < stop; j++) out += s[j] === '\n' ? '\n' : ' '
      i = stop
    } else {
      out += s[i++]
    }
  }
  return out
}

const masked = maskComments(raw)
const rawLines = raw.split('\n')

// offset → 行號（1-based）
const lineStarts = [0]
for (let i = 0; i < masked.length; i++) if (masked[i] === '\n') lineStarts.push(i + 1)
const lineAt = (off) => {
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (lineStarts[mid] <= off) lo = mid
    else hi = mid - 1
  }
  return lo + 1
}

/** 同一行嘅尾隨註釋（設計理由、對比度數字多數寫喺呢度，值得帶入文檔）。 */
function trailingComment(line) {
  const m = rawLines[line - 1]?.match(/\/\*+\s*(.*?)\s*(?:\*\/)?\s*$/)
  const t = m?.[1]?.trim()
  return t && t !== '' ? t : ''
}

// ── 掃描：selector stack ＋ 所有 custom property 宣告 ──────────────────────
/** @type {{name:string,value:string,line:number,scope:string,media:string,comment:string}[]} */
const decls = []
const scopes = [] // 出現過嘅 scope，file order，用嚟證明冇漏 block
const stack = []
let buf = ''

for (let i = 0; i < masked.length; i++) {
  const c = masked[i]
  if (c === '{') {
    const sel = buf.trim().replace(/\s+/g, ' ')
    stack.push({ sel, line: lineAt(i) })
    const path = stack.map((s) => s.sel)
    if (!scopes.some((s) => s.line === stack[stack.length - 1].line)) {
      scopes.push({ sel: path.join(' › '), line: stack[stack.length - 1].line })
    }
    buf = ''
  } else if (c === '}') {
    stack.pop()
    buf = ''
  } else if (c === ';') {
    const text = buf.trim()
    const m = text.match(/^(--[A-Za-z0-9_-]+)\s*:\s*([\s\S]+)$/)
    if (m && stack.length) {
      const line = lineAt(i)
      const path = stack.map((s) => s.sel)
      const media = path.filter((s) => s.startsWith('@media')).join(' and ')
      const scope = path.filter((s) => !s.startsWith('@media')).join(' ') || path.join(' ')
      decls.push({
        name: m[1],
        value: m[2].trim().replace(/\s+/g, ' '),
        line,
        scope,
        media,
        comment: trailingComment(line),
      })
    }
    buf = ''
  } else {
    buf += c
  }
}

// ── 層疊：邊個宣告真係贏 ──────────────────────────────────────────────────
//
// 只處理【預設態】同【data-theme='cyber'】兩個狀態，因為得呢兩個係全站性、
// 而且 Tailwind v4 嘅 @theme 本身就 emit 落 :root。
//   · 預設態  = @theme ＋ 裸 :root，無 @media，last-wins
//   · cyber   = 預設態，再由 :root[data-theme='cyber'] 覆蓋
//     （specificity 0,1,1 > 0,0,1，所以就算排前面都贏；本檔佢排 197，
//       裸 :root 排 353 —— 靠 specificity，唔係靠次序）
const isBaseScope = (d) => !d.media && (d.scope === '@theme' || d.scope === ':root')
const isCyberScope = (d) => !d.media && d.scope === ":root[data-theme='cyber']"

/** @type {Map<string, typeof decls>} 每個 token 喺 base scope 嘅全部宣告，file order */
const baseAll = new Map()
for (const d of decls.filter(isBaseScope)) {
  if (!baseAll.has(d.name)) baseAll.set(d.name, [])
  baseAll.get(d.name).push(d)
}
const base = new Map([...baseAll].map(([n, list]) => [n, list[list.length - 1]]))

const cyber = new Map(base)
for (const d of decls.filter(isCyberScope)) cyber.set(d.name, d)

/** 跟 var() 鏈直到出到一個字面值。循環就照直講，唔扮知。 */
function resolve(name, map, seen = new Set()) {
  if (seen.has(name)) return { value: '（循環引用）', via: [] }
  seen.add(name)
  const d = map.get(name)
  if (!d) return { value: '（未定義）', via: [] }
  const m = d.value.match(/^var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,([\s\S]+))?\)$/)
  if (!m) return { value: d.value, via: [] }
  const inner = resolve(m[1], map, seen)
  if (inner.value === '（未定義）' && m[2]) return { value: m[2].trim(), via: [m[1] + '（fallback）'] }
  return { value: inner.value, via: [m[1], ...inner.via] }
}

// ── 輸出 ────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/\|/g, '\\|')
const L = []

L.push(`<!-- generated from ${SRC} by scripts/gen-token-doc.mjs — do not edit -->`)
L.push('')
L.push('# 設計 token')
L.push('')
L.push(`**唯一來源係 \`${SRC}\`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。`)
L.push('改 token 改 CSS，然後重跑：')
L.push('')
L.push('```bash')
L.push('node scripts/gen-token-doc.mjs')
L.push('```')
L.push('')
L.push(
  `掃到 **${decls.length}** 個 custom property 宣告，分佈喺 **${scopes.length}** 個 block。`,
)
L.push('')

// 1. 覆蓋陷阱 —— 最有用嗰節，擺最前
const shadowed = [...baseAll].filter(([, list]) => list.length > 1)
L.push('## ⚠️ 被覆蓋嘅宣告')
L.push('')
L.push('同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。')
L.push('照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。')
L.push('')
if (!shadowed.length) {
  L.push('（冇。每個 token 喺預設態只宣告一次。）')
} else {
  L.push('| token | 畫唔到嘅宣告 | 真正生效 | resolved |')
  L.push('|---|---|---|---|')
  for (const [name, list] of shadowed) {
    const dead = list
      .slice(0, -1)
      .map((d) => `\`${esc(d.value)}\` (L${d.line})`)
      .join('<br>')
    const win = list[list.length - 1]
    L.push(
      `| \`${name}\` | ${dead} | \`${esc(win.value)}\` (L${win.line}) | \`${esc(resolve(name, base).value)}\` |`,
    )
  }
}
L.push('')

// 2/3. 兩個狀態嘅 resolved 表
for (const [title, map, note] of [
  ['預設態（冇 `data-theme` 屬性）', base, '@theme ＋ 裸 `:root`，last-wins。'],
  [
    "`data-theme='cyber'`（暗色）",
    cyber,
    "預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。",
  ],
]) {
  L.push(`## Resolved — ${title}`)
  L.push('')
  L.push(note)
  L.push('')
  L.push('| token | resolved | 宣告 | 經過 | 備註 |')
  L.push('|---|---|---|---|---|')
  for (const name of [...map.keys()].sort()) {
    const d = map.get(name)
    const r = resolve(name, map)
    const via = r.via.length ? r.via.map((v) => `\`${v}\``).join(' → ') : '—'
    L.push(
      `| \`${name}\` | \`${esc(r.value)}\` | \`${esc(d.value)}\` (L${d.line}) | ${via} | ${esc(d.comment)} |`,
    )
  }
  L.push('')
}

// 4. 其餘 scope —— 唔可以靜靜哋 drop，漏一個就係啱啱捉到嗰類 bug
const others = decls.filter((d) => !isBaseScope(d) && !isCyberScope(d))
L.push('## 其他 scope')
L.push('')
L.push('唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。')
L.push('列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。')
L.push('')
if (!others.length) {
  L.push('（冇。）')
} else {
  L.push('| token | 值 | scope | media | 行 |')
  L.push('|---|---|---|---|---|')
  for (const d of others) {
    L.push(
      `| \`${d.name}\` | \`${esc(d.value)}\` | \`${esc(d.scope)}\` | ${d.media ? `\`${esc(d.media)}\`` : '—'} | L${d.line} |`,
    )
  }
}
L.push('')

// 5. block 清單 —— 證明個 parser 見到晒
L.push('## 掃過嘅 block')
L.push('')
L.push('| 行 | selector |')
L.push('|---|---|')
for (const s of scopes) L.push(`| L${s.line} | \`${esc(s.sel)}\` |`)
L.push('')

const doc = L.join('\n')
const stat =
  `${decls.length} 個宣告 / ${scopes.length} 個 block / ` +
  `預設態 ${base.size} 個 token / cyber ${cyber.size} 個 / 被覆蓋 ${shadowed.length} 個`

if (process.argv.includes('--check')) {
  const path = join(ROOT, OUT)
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null
  if (current !== doc) {
    console.error(
      `\n  ❌ TOKEN DOC 過期 —— ${OUT} 對唔返 ${SRC}。\n` +
        `     ${current === null ? '個檔唔存在。' : '內容有差異。'}\n` +
        `     重跑：node scripts/gen-token-doc.mjs\n`,
    )
    process.exit(1)
  }
  console.log(`✅ token doc 同 ${SRC} 一致（${stat}）`)
} else {
  mkdirSync(join(ROOT, dirname(OUT)), { recursive: true })
  writeFileSync(join(ROOT, OUT), doc)
  console.log(`${OUT}：${stat}`)
}
