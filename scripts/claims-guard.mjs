#!/usr/bin/env node
// claims-guard —— 攔截會反噬嘅對外宣稱。
//
// ══ 點解需要 ══
// 2026-08-20 掃過一次 live 文案，結果係乾淨嘅：「零版權風險」「醫療級」
// 「全港第一」「零登入」全部零出現。但同一日審過嘅六份營銷／策略文件，
// 每一句都齊備 —— 只係未有人照住做。
//
// 呢類宣稱嘅風險特性同 bug 唔同：一個 bug 出街係「做得差」，一句兌現唔到嘅
// 宣稱出街係「呃人」。前者修得返，後者修唔返。而且佢哋通常唔會經技術審查
// 入嚟 —— 而係喺趕住出文案嗰陣，由一份睇落好有說服力嘅文件抄落去。
//
// 所以呢個閘唔係捉現有問題（現時 0 個），係守住一條而家仲乾淨嘅線。
//
// ══ 範圍 ══
// 只掃【對外文案】：app/ + components/ + lib/dictionary.ts + data/heroContent.ts
// + data/quotes.ts。刻意【唔】掃 data/questions/ —— 題目內容本身合法地含有
// 「保證高回報」（BAFS 干擾項）、「《史記》首創紀傳體」（中文科史實）呢類字眼，
// 掃咗就會變成一個成日誤報、然後被繞過嘅閘。
//
// 註解一律剝走：檔頭寫「本平台唔會作醫療級宣稱」係好事，唔可以當違規。

import fs from 'node:fs'
import path from 'node:path'

/**
 * 剝註解。次序同 contrast-guard 一致：先行註解、後區塊註解。
 * 反轉會令行註解入面嘅 `/*`（例如寫住 `app/relax/**`）被當成區塊註解開頭，
 * 一路食到下一個結束符，連中間真正嘅文案都食走。
 */
const stripComments = (s) =>
  s
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')

// 每條規則：why 解釋點解危險，fix 提供可以照用嘅替代講法。
// 一個只會嗌「唔准」而唔講點寫先啱嘅閘，只會令人繞過佢。
const RULES = [
  {
    id: 'superlative',
    // 「最強」必須綁住產品名詞先算宣稱 —— 淨係 `最強` 會誤中量表descriptor
    // （HKEAA 7 分制自評：「1 = 最弱，7 = 最強」），而一個誤報嘅閘好快會被繞過。
    re: /全港第一|全港最|香港首個|全港唯一|市場上唯一|最(?:好|強)(?:嘅)?(?:平台|題庫|工具|網站|app)|No\.?\s?1\b/g,
    why: '絕對性排名宣稱 —— 無法驗證，一被質疑就要攞證據，攞唔出就係呃人。',
    fix: '改為可驗證嘅功能描述：「內建錯因自診嘅 DSE 練習平台」。',
  },
  {
    id: 'guarantee',
    re: /保證(?:升|你|考|成績|入|合格|攞)|包升|必勝|一定入到|穩袋|包你/g,
    why: '成績保證 —— 考試結果唔喺平台控制範圍，兌現唔到。',
    fix: '改為描述機制：「幫你搵出最常錯嘅位」。',
  },
  {
    id: 'medical',
    re: /醫療級|臨床(?:驗證|實證)|療效|治療(?:焦慮|抑鬱|你)/g,
    why: '醫療效能宣稱 —— 平台唔係醫療器械、無臨床驗證；香港《不良廣告（醫藥）條例》有風險。',
    fix: '改為描述設計取態：「按 UDL 原則設計，情緒安全網常駐」。',
  },
  {
    // 憲章 §16.D（2026-08-25）—— build-time 測試唔可以講成 runtime 防護。
    // 判例：3Hz 光敏閘係 lib/__tests__/sen-accessibility.test.mts 一個【建置期】
    // 測試，掃 globals.css 然後 fail build；學生瀏覽期間【冇任何 runtime 攔截】。
    // 一個光敏感學生睇到「自動攔截，可以安心溫書」，可能因此唔開自己部機嘅
    // 光敏防護 —— 呢個係會改變學生安全行為嘅假聲稱，比一般誇大嚴重。
    // 落閘當日影響（憲章 §6）：app/ + components/ 命中 0 處，零遷移成本。
    id: 'runtime-protection',
    re: /自動攔截|自動偵測並(?:阻止|攔截|保護)|即時保護|安心(?:溫書|使用|練習)|實時防護|全程保護/g,
    why: '暗示平台提供 runtime 防護 —— 我哋嘅閘係建置期測試，唔會喺學生部機上運行。學生可能因此關掉自己嘅防護。',
    fix: '改為描述事實：「我哋自己嘅動畫全部低於 3Hz，而且有測試鎖住，唔會有一日改壞咗都冇人知」。',
  },
  {
    id: 'zero-risk',
    re: /零版權風險|絕對安全|完全無風險|零風險|告不入/g,
    why: '「零風險」係一張兌現唔到嘅支票。改寫降低風險，唔等於零。',
    fix: '改為事實陳述：「所有題目獨立改寫，並非 HKEAA 官方試題」。',
  },
  {
    id: 'official-endorsement',
    re: /考評局(?:認可|認證|授權|合作|推薦)|HKEAA\s?(?:approved|endorsed|certified)|官方認可/gi,
    why: '暗示官方背書 —— 憲章 §4 明文禁止，亦係最直接嘅法律風險。',
    fix: '每頁 footer 已有「Not affiliated with HKEAA」，唔好喺其他地方講反話。',
  },
  {
    id: 'zero-login',
    re: /零登入|唔使畀個名|連個名都唔使/g,
    why: '平台有 Google OAuth、profiles 表有實際記錄。呢句係假嘅。',
    fix: '講真話一樣夠力：「唔使登入都用得，登入淨係為咗跨機同步進度」。',
  },
  {
    id: 'fabricated-testimonial',
    // 假見證有兩種形態，兩種都要捉：
    //   ① 落款 —— 我哋寫嘅說話簽住一個唔存在嘅人（「—— 匿名學長姐」）
    //   ② 第一人稱經歷 —— 「我當年都係 Band 3，而家讀緊 U」
    // 2026-08-21 喺 components/EncouragementWall.tsx 捉到兩種齊備（8 條說話、
    // 標題「過來人打氣牆」、每條落款「匿名學長姐」，全部由我哋自己寫）。
    // 學生喺最脆弱嗰刻信咗一個唔存在嘅人 —— 呢個係最難解釋嗰種失實。
    re: /——\s*(匿名)?(學長|學姐|師兄|師姐|同學|考生|用戶)|—\s*an?\s+anonymous\s+(senior|student|user)|我(當年|以前|嗰年)都?係\s*[Bb]and\s*\d|我\s*[Mm]ock\s*考|我最後都?(夠分|入到|考到)/g,
    why: '假用戶見證 —— 我哋自己寫嘅說話唔可以簽住一個唔存在嘅人，亦唔可以扮成某個具體學生嘅親身經歷。憲章 §8 明文禁止。',
    fix: '照講係邊個講：「想同你講幾句」。內容改成唔假託任何人嘅講法，例如「Mock 嘅分數唔係判詞」。真實見證要經同意並標明收集日期。',
  },
  {
    id: 'fabricated-social-proof',
    // 「X 個學生用緊」「X% 用戶」呢類數字社會證明。真實數字要即時由數據算，
    // 唔可以硬編喺文案 —— 硬編嗰刻起就開始過時。
    re: /\d[\d,]*\s*(?:個|位|名)?\s*(?:學生|用戶|考生|同學)\s*(?:用緊|正在|已經|選擇|推薦)|\d+\s*%\s*(?:用戶|學生|考生)/g,
    why: '硬編嘅用戶數／比例 —— 由寫落去嗰刻就開始過時，而且無法即時核實。',
    fix: '要顯示就即時由真實數據算（例：/transparency 嘅審批比例由題庫算出）。',
  },
]

const TARGET_FILES = ['lib/dictionary.ts', 'data/heroContent.ts', 'data/quotes.ts']
const TARGET_DIRS = ['app', 'components']

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(tsx?|mdx?)$/.test(e.name)) out.push(p)
  }
  return out
}

const files = [...TARGET_DIRS.flatMap((d) => walk(d)), ...TARGET_FILES.filter((f) => fs.existsSync(f))]

const findings = []
for (const file of files) {
  const src = stripComments(fs.readFileSync(file, 'utf8'))
  for (const rule of RULES) {
    rule.re.lastIndex = 0
    let m
    while ((m = rule.re.exec(src))) {
      findings.push({
        file,
        line: src.slice(0, m.index).split('\n').length,
        hit: m[0],
        rule,
      })
    }
  }
}

const BAR = '─'.repeat(70)
console.log(`\n${BAR}\n  claims-guard —— 對外宣稱檢查（掃 ${files.length} 個文案檔）\n${BAR}`)

if (findings.length === 0) {
  console.log('  ✅ CLAIMS GUARD PASSED —— 冇發現兌現唔到嘅對外宣稱。\n' + BAR)
  process.exit(0)
}

console.log(`\n❌ 發現 ${findings.length} 處：\n`)
const byRule = new Map()
for (const f of findings) {
  if (!byRule.has(f.rule.id)) byRule.set(f.rule.id, { rule: f.rule, hits: [] })
  byRule.get(f.rule.id).hits.push(f)
}
for (const { rule, hits } of byRule.values()) {
  console.log(`── [${rule.id}]`)
  console.log(`   ⚠️  ${rule.why}`)
  console.log(`   ✅ ${rule.fix}`)
  for (const h of hits) console.log(`      ${h.file}:${h.line} → 「${h.hit}」`)
  console.log('')
}
console.log(`${BAR}`)
process.exit(1)
