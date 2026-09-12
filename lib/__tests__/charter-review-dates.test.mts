// ============================================================================
// charter-review-dates.test.mts —— 憲章覆檢日絆線
// ----------------------------------------------------------------------------
// 憲章定過幾個「到期要覆檢」嘅日子，但日子本身只以註釋同常數形式存在
// （lib/entitlements.ts:16、lib/empiricalWeighting.ts:30、docs/charter.md §7.1/§7.2）
// —— 冇任何嘢會喺日子到嗰陣講出嚟。
//
// 後果唔係「遲咗覆檢」，係【實驗變成永久】：
// §7.2 剷反思鎖係一個為期兩個月嘅實驗，明文寫住「性質：實驗，唔係永久裁決」。
// 覆檢日靜靜過咗，冇人做決定，個實驗就因為冇人記得而變成現狀 ——
// 而現狀係最難推翻嘅嘢，因為之後每個人見到嘅都係「一直都係咁」。
//
// 憲章自己記低過同一個病三次：
//   §16.E　「批准同落實係兩件事，兩件都要有人做」（批准咗三日代碼先跟上）
//   §17　　 撤銷修訂「⬜ 待副署」由 2026-09-05 掛到 2026-09-09，
//           四日之間條文係生效定未生效，冇人答得到
//   §7.2　「⚠️ 實驗期間唔准靜靜哋接返個鎖」——
//           顧慮嘅係暗中復原，但對稱嘅風險係暗中永久化，當時未處理
//
// ══ 本測試點樣運作 ══
// 日子未到：靜靜過，唔嘈。
// 日子到咗：紅，除非 docs/ 有對應嘅裁決紀錄檔。
//
// 即係話【唔可以靠刪測試過關，要靠做返件事】—— 同覆核簽名同一個道理。
// 寫份紀錄（保持現狀都係一個決定，寫低就得）測試即刻轉綠。
//
// ⚠️ 加呢條測試嗰日（2026-09-12）兩個日子都未到，所以對當時嘅 build 零影響
//    （憲章 §6：唔可以以 feature change 令現有數據集失效）。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

type Review = {
  /** 覆檢日（香港時間當日零時起計到期）。 */
  date: string
  /** 覆檢乜嘢，一句講完。 */
  what: string
  /** 條文出處，方便到期時揾返上文。 */
  where: string
  /** 到期時要答嘅問題 —— 唔係「做咗未」，係「憑咩決定」。 */
  question: string
}

const REVIEWS: Review[] = [
  {
    date: '2026-10-09',
    what: 'SESSION_SIZE 由 20 減到 10 之後，中途離開率有冇由 74% 跌向 30%',
    where: 'docs/charter.md §7.1 · lib/entitlements.ts:16',
    question:
      '對返數：74% 嘅節冇做夠 20 題、中位數 15 —— 改成 10 之後呢兩個數變咗幾多？' +
      '目標係壓到 30%。唔啱就要改返，唔可以當個假設已證實。',
  },
  {
    date: '2026-11-09',
    what: '§7.2 剷除 30 秒反思鎖嘅兩個月實驗期滿；同時重新考慮 EMPIRICAL_K',
    where: 'docs/charter.md §7.2 · lib/empiricalWeighting.ts:30',
    question:
      '交逐週正確率 curve，對照剷鎖前基準（88.3%、5,565 題、484 節、中位 15 題）。' +
      '三個選項：復活個鎖、永久刪除、改個形態 —— 揀邊個都要寫低憑咩。',
  },
]

/** 裁決紀錄檔。命名沿用 docs/charter-amendment-YYYY-MM-DD.md 嘅慣例。 */
const recordPath = (d: string) => `docs/charter-review-${d}.md`

test('憲章覆檢日到期時必須有裁決紀錄', () => {
  // 用香港時區嘅「今日」——服務對象喺香港，覆檢日亦按香港日曆定。
  const todayHK = new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 10)
  const overdue: string[] = []

  for (const r of REVIEWS) {
    if (todayHK < r.date) continue                      // 未到期
    if (existsSync(join(ROOT, recordPath(r.date)))) continue  // 已處理
    overdue.push(
      `\n  ⏰ ${r.date}（今日 ${todayHK}）：${r.what}\n` +
      `     出處：${r.where}\n` +
      `     要答：${r.question}\n` +
      `     做法：寫 ${recordPath(r.date)}，寫低決定同依據。\n` +
      `           保持現狀都係一個決定 —— 寫低就得，唔寫先係問題。`,
    )
  }

  assert.deepEqual(overdue, [],
    `以下憲章覆檢已到期而未有裁決紀錄：${overdue.join('')}\n\n` +
    `⚠️ 唔好刪走呢條測試過關。佢存在嘅唯一理由，就係防止一個「兩個月實驗」` +
    `因為冇人記得而變成永久現狀。`)
})

// 提早知會：到期前 21 日開始喺測試輸出提一句。
// 唔會令測試紅 —— 提早紅等於逼人提早做決定，而數據未夠。
test('覆檢日倒數（只提示，唔會紅）', () => {
  const todayHK = new Date(Date.now() + 8 * 3600_000)
  for (const r of REVIEWS) {
    const days = Math.ceil((new Date(r.date + 'T00:00:00Z').getTime() - todayHK.getTime()) / 86400_000)
    if (days > 0 && days <= 21) console.log(`  ⏳ 憲章覆檢 ${r.date} 仲有 ${days} 日：${r.what}`)
  }
  assert.ok(true)
})
