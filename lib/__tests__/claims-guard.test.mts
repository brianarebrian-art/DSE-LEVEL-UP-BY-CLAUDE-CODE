import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// claims-guard 嘅回歸測試。
//
// 一個永遠 pass 嘅閘等於冇。呢度用【真實出現過嘅句子】—— 全部抄自 2026-08-20
// 審過嗰六份營銷／策略文件 —— 逐條驗證閘捉唔捉到。日後有人放寬規則而唔為意
// 放寬過頭，呢度就會即刻 fail。

const GUARD = 'scripts/claims-guard.mjs'
/** 掃描範圍之內、可以安全借用嚟做測試載體嘅檔。 */
const CARRIER = 'app/about/page.tsx'

/** 把一句文案暫時寫入掃描範圍內嘅檔，跑閘，然後無論成敗都還原。 */
function runWith(sentence: string | null): number {
  const original = fs.readFileSync(CARRIER, 'utf8')
  try {
    if (sentence !== null) {
      // 放喺一句 JSX 文字節點入面，模擬真實文案（唔係註解 —— 註解會被剝走）。
      const marker = '</main>'
      const idx = original.lastIndexOf(marker)
      const injected = idx >= 0
        ? original.slice(0, idx) + `<p>${sentence}</p>` + original.slice(idx)
        : original + `\n// carrier-fallback\nexport const __probe = '${sentence}'\n`
      fs.writeFileSync(CARRIER, injected)
    }
    try {
      execFileSync('node', [GUARD], { stdio: 'pipe' })
      return 0
    } catch (e) {
      return (e as { status?: number }).status ?? 1
    }
  } finally {
    fs.writeFileSync(CARRIER, original)
  }
}

test('現狀乾淨 —— 冇任何兌現唔到嘅宣稱', () => {
  assert.equal(runWith(null), 0, 'live 文案出現咗違規宣稱，跑 `npm run qa:claims` 睇詳情')
})

// 逐句抄自實際文件，唔係我杜撰嘅測試字串。
const MUST_CATCH: [label: string, sentence: string][] = [
  ['絕對性排名', '全港第一嘅 DSE 溫習平台'],
  ['零風險支票', '零版權風險平行對齊改寫法'],
  ['醫療效能', '醫療級 60 秒逆向鎖死引擎'],
  // §16.D：3Hz 閘係建置期測試，唔係 runtime 防護。逐字抄自 2026-08-25 嘅 Threads 稿。
  ['runtime 防護暗示', '自動攔截超過 3Hz 嘅閃爍動畫，癲癇／光敏感學生可以安心溫書'],
  ['失實私隱宣稱', '零登入。連你個名都唔使畀。'],
  ['暗示官方背書', '考評局認可嘅練習題庫'],
  ['成績保證', '保證你升一個 Grade'],
  ['虛構社會證明', '已經有 50000 個學生用緊'],
  // 呢兩條抄自 components/EncouragementWall.tsx 2026-08-21 之前嘅真實文案。
  ['假見證落款', '錯題係寶藏 —— 匿名學長姐'],
  ['假見證第一人稱', '我當年都係 Band 3，而家讀緊 U。'],
]

for (const [label, sentence] of MUST_CATCH) {
  test(`必須捉到：${label}`, () => {
    assert.equal(runWith(sentence), 1, `閘放過咗「${sentence}」`)
  })
}

// 唔可以誤報 —— 一個成日嘈嘅閘好快會被繞過，到時就等於冇。
const MUST_PASS: [label: string, sentence: string][] = [
  ['量表 descriptor', '按三大範疇為自己的文章評分（1 = 最弱，7 = 最強）。'],
  ['如實免責聲明', '並非香港考試及評核局（HKEAA）官方試題。'],
  ['誠實私隱描述', '唔使登入都用得，登入淨係為咗跨機同步進度。'],
  ['機制描述而非承諾', '幫你搵出最常錯嘅位。'],
  // 改寫之後嘅版本必須放得過 —— 否則等於逼人再寫返假嘢。
  ['去咗假託嘅打氣說話', 'Mock 嘅分數唔係判詞。由 Mock 到正式考仲有好多時間。'],
]

for (const [label, sentence] of MUST_PASS) {
  test(`唔可以誤報：${label}`, () => {
    assert.equal(runWith(sentence), 0, `閘誤報咗「${sentence}」`)
  })
}
