// 參數化題庫損耗監察（Victor Q1「無限變體生成器」嘅真正缺口）。
//
// 背景：`createBank().add()` 會丟棄「4 個選項唔全相異」嘅參數組合。丟棄本身
// 完全正確 —— 一條有兩個相同選項嘅 MC 係壞題，寧可唔出。問題喺於原本冇聲出：
// 出題者寫一個參數範圍，以為出到 40 條，實際入庫 28 條，差額冇任何提示。
//
// 首次量度（2026-08-13）：用本工廠嘅 6 科合共丟棄 182 個組合。
//
// 呢個測試唔係要把損耗降到 0（做唔到，亦唔應該 —— 某啲參數必然退化），而係：
//   ① 令損耗變成一個【睇得見、會變紅】嘅數，唔再係暗數；
//   ② 攔住「某一科嘅參數範圍寫壞咗，大部分組合都退化」呢種真實故障。
//
// 門檻取 40%：以現行最高單科損耗為基準留出空間，同時遠低於「參數範圍寫壞」
// 嘅典型表現（一寫壞通常過半甚至九成退化）。刻意唔逐科寫死期望值 —— 咁樣
// 每加一條題就要改測試，會令人養成改數字了事嘅習慣。

import { test } from 'node:test'
import assert from 'node:assert/strict'

// 必須先 import 各 bank：登記冊喺 bank 模組求值時填充。
for (const f of ['physics-bank', 'chemistry-bank', 'm1-bank', 'm2-bank', 'economics-bank', 'bafs-bank']) {
  await import(`../${f}.ts`)
}
const { getParametricDrops } = await import('../_parametric.ts')

type Drop = { subject: string; id: string; reason: string; options: string[] }
const drops = getParametricDrops() as readonly Drop[]

const MAX_DROP_RATIO = 0.4

test('丟棄嘅參數組合全部有登記（唔再係暗數）', () => {
  for (const d of drops) {
    assert.ok(d.subject, '每筆損耗必須記得低邊一科')
    assert.ok(d.id, '每筆損耗必須記得低題目 id，否則無從追查')
    assert.ok(
      d.reason === 'duplicate-options' || d.reason === 'not-4-options',
      `未知丟棄原因：${d.reason}`,
    )
  }
})

test('冇任何一科嘅參數範圍退化到大部分組合都出唔到題', async () => {
  const { getSubjectQuestions } = await import('../index.ts')
  const bySubject = new Map<string, number>()
  for (const d of drops) bySubject.set(d.subject, (bySubject.get(d.subject) ?? 0) + 1)

  const lines: string[] = []
  for (const [subject, lost] of [...bySubject].sort((a, b) => b[1] - a[1])) {
    const kept = (await getSubjectQuestions(subject)).length
    const ratio = lost / (lost + kept)
    lines.push(`  ${subject.padEnd(10)} 入庫 ${String(kept).padStart(4)}  丟棄 ${String(lost).padStart(3)}  損耗 ${(ratio * 100).toFixed(1)}%`)
    assert.ok(
      ratio <= MAX_DROP_RATIO,
      `${subject} 參數組合損耗 ${(ratio * 100).toFixed(1)}% 超過 ${MAX_DROP_RATIO * 100}% —— ` +
        `多數組合退化成重複選項，多數係參數範圍寫得太窄，請檢查該科 bank 嘅參數。`,
    )
  }
  console.log(`\n── 參數化損耗報告 ──\n${lines.join('\n')}\n  合計丟棄 ${drops.length} 個組合\n`)
})
