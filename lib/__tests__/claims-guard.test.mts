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

/**
 * 把一句文案寫入一個【repo 以外】嘅臨時檔，交畀 claims-guard 一齊掃。
 *
 * 2026-08-27 之前呢度係暫時改寫 app/about/page.tsx 再喺 finally 還原。兩個問題：
 *   ① `node --test` 逐個測試檔並行跑。載體檔「污糟」嗰陣（每次跑閘約
 *      100–300ms × 15 句 ≈ 幾秒）任何一個掃 app/ 嘅測試檔讀到注入內容就會紅 ——
 *      而下一次跑又綠，表現成間歇性 fail。實測：載體檔污糟期間跑本檔，
 *      「現狀乾淨」同 5 條「唔可以誤報」全部紅。
 *   ② 跑到一半撳 Ctrl-C，finally 唔會執行，一個已追蹤嘅原始碼檔就會留喺改壞咗
 *      嘅狀態 —— 呢個比一次 fail 嚴重得多。
 * 而家一個 repo 檔都唔會郁。
 */
function runWith(sentence: string | null): number {
  const args = [GUARD]
  let dir: string | null = null
  if (sentence !== null) {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'claims-probe-'))
    const probe = path.join(dir, 'probe.tsx')
    // 一句 JSX 文字節點，模擬真實文案（唔係註解 —— 註解會被剝走）。
    fs.writeFileSync(probe, `export default function Probe() {\n  return <p>${sentence}</p>\n}\n`)
    args.push(probe)
  }
  try {
    execFileSync('node', args, { stdio: 'pipe' })
    return 0
  } catch (e) {
    return (e as { status?: number }).status ?? 1
  } finally {
    if (dir) fs.rmSync(dir, { recursive: true, force: true })
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
  // 否定豁免（2026-09-03）唔可以開得太闊：一句轉折之後嘅真承諾仍然要捉到。
  ['否定之後又轉頭承諾', '冇人保證你升，但我哋保證你升。'],
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
  // 2026-09-03：考試日管家嘅免責聲明本來被 guarantee 規則攔住。
  // 方向係反轉嘅 —— 「保證」最正當嘅用法就係話明我哋唔保證。
  // 攔住免責聲明會迫人寫得含糊啲去避開個閘，即係為咗過閘而削弱
  // 一份本來想加強嘅法律保障。
  ['免責聲明（否定嘅「保證」）', '我哋唔會亦冇能力保證你準時到場。'],
  ['否定嘅「零風險」', '改寫降低風險，但本平台並非零風險。'],
]

for (const [label, sentence] of MUST_PASS) {
  test(`唔可以誤報：${label}`, () => {
    assert.equal(runWith(sentence), 0, `閘誤報咗「${sentence}」`)
  })
}
