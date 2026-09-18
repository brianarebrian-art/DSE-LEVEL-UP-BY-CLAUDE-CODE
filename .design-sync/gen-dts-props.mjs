// 由 src 抽組件 props，生成 config 嘅 `dtsPropsFor`。
//
// 點解要自己抽：converter 嘅 props 係由【已 build 嘅 .d.ts tree】嚟
// （lib/dts.mjs 嘅 projectFor 讀 package.json 嘅 types／typings，搵唔到就當冇）。
// 呢個 repo 係 Next.js app，冇 `tsc --declaration` 出過 .d.ts，
// 所以 78 個組件嘅 props 全部塌成 `[key: string]: unknown` ——
// 而 `<Name>Props` 正正就係 design agent 唯一睇到嘅 API 契約。
//
// 做法：ts-morph 開 repo 個 tsconfig，搵每個組件嘅 default export function，
// 讀佢第一個參數嘅型別，逐個 property 出一行 `name?: Type`。
//
// 用法（改完組件 props 之後重跑）：
//   node .design-sync/gen-dts-props.mjs
//
// 產出：.design-sync/dts-props.json —— 貼入 config.json 嘅 dtsPropsFor。
// 唯讀 repo，只寫嗰一個檔。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const ROOT = new URL('..', import.meta.url).pathname
const require = createRequire(join(ROOT, '.ds-sync/package.json'))
const { Project, ts } = require('ts-morph')

const srcMap = JSON.parse(readFileSync(join(ROOT, '.design-sync/component-src-map.json'), 'utf8'))

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    strict: false,
    baseUrl: ROOT,
    paths: { '@/*': ['./*'] },
  },
})
for (const rel of new Set(Object.values(srcMap))) project.addSourceFileAtPath(join(ROOT, rel))
project.addSourceFileAtPath(join(ROOT, '.ds-sync/node_modules/@types/react/index.d.ts'))

/** React 自己嗰啲（children 除外）唔係呢個組件嘅 API，出咗只會嘈。 */
const NOISE = /^(key|ref|dangerouslySetInnerHTML|suppressHydrationWarning)$/

function declFor(file, name) {
  const sf = project.getSourceFile(join(ROOT, srcMap[name]))
  if (!sf) return null
  // default export function（74/78 係呢種）
  for (const fn of sf.getFunctions()) {
    if (fn.isDefaultExport()) return fn
    if (fn.getName() === name && fn.isExported()) return fn
  }
  for (const v of sf.getVariableDeclarations()) if (v.getName() === name && v.isExported()) return v
  return null
}

const out = {}
let done = 0
let empty = 0
const misses = []

for (const name of Object.keys(srcMap)) {
  const decl = declFor(srcMap[name], name)
  const params = decl?.getParameters?.() ?? []
  if (!params.length) {
    // 零 prop 組件係真實情況（好多卡片自己讀 localStorage），出一個空 body。
    out[name] = ''
    empty++
    continue
  }
  let type
  try {
    type = params[0].getType()
  } catch {
    misses.push(name)
    continue
  }
  const lines = []
  for (const prop of type.getProperties()) {
    const pname = prop.getName()
    if (NOISE.test(pname)) continue
    let ptype = 'unknown'
    try {
      ptype = prop
        .getTypeAtLocation(params[0])
        .getText(params[0], ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType)
    } catch {
      /* 解唔到就留 unknown —— 好過出一個錯嘅型別 */
    }
    // import("...").Foo → Foo：完整路徑喺 .d.ts 入面 resolve 唔到，而且嘈。
    ptype = ptype.replace(/import\("[^"]*"\)\./g, '').replace(/\s+/g, ' ').trim()

    // 具名型別（Difficulty、TextQuestion…）喺 emit 出嚟嘅 .d.ts 度冇定義，
    // 原樣寫落去會 [DTS_PARSE] 紅。先試展開做字面 union；
    // 展唔開（object 型別）就誠實降級做 unknown，但留返個名喺註釋，
    // 唔好扮自己知 —— design agent 睇到 `unknown` 會去睇 .prompt.md 嘅例子。
    let note = ''
    if (/^[A-Z][A-Za-z0-9]*(\[\])?$/.test(ptype)) {
      const t = prop.getTypeAtLocation(params[0])
      const union = t.isUnion() ? t.getUnionTypes() : null
      const literal = union?.every((u) => u.isLiteral() || u.isUndefined() || u.isNull())
      if (literal) {
        ptype = union
          .filter((u) => !u.isUndefined())
          .map((u) => u.getText())
          .join(' | ')
      } else {
        note = ` // ${ptype}`
        ptype = 'unknown'
      }
    }
    if (ptype.length > 200) { note ||= ' // 型別太長，見 .prompt.md'; ptype = 'unknown' }
    const optional = prop.isOptional?.() ?? /\| undefined$/.test(ptype)
    lines.push(`  ${pname}${optional ? '?' : ''}: ${ptype};${note}`)
  }
  out[name] = lines.join('\n')
  if (lines.length) done++
  else empty++
}

writeFileSync(join(ROOT, '.design-sync/dts-props.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`有 props: ${done} | 零 prop: ${empty} | 抽唔到: ${misses.length}${misses.length ? ' → ' + misses.join(', ') : ''}`)
