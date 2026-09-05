// ============================================================================
// discovery-local-only.test.mts —— 發現簿永不上雲 ＋ 三維唔准分叉
// ----------------------------------------------------------------------------
// 兩條不變式，兩條都係【靜靜哋壞】嗰種：
//
// ① `dse_discoveries` 唔可以入上雲白名單。
//    `Discovery.label` 可以係學生自己打嘅字（BUILD-SPEC §2.3 步驟 4），
//    有機會夾雜個人情緒內容。憲章 §16.E 執行第 1 點：上雲白名單新增任何一個
//    key 都要創辦人書面批准 —— 呢個 key 冇批准過，亦冇打算攞批准。
//    加咗上去唔會有任何錯誤訊息，所以要測試盯住。
//
// ② 三維維度唔可以同 ReverseCause 分叉。
//    BUILD-SPEC 寫 'concept'|'trap'|'careless'，repo 由 2026-07 起用
//    'A'|'B'|'C'。兩套並存嘅後果係錯因雷達、重溫排程、gentleSuggestions
//    同發現簿由第一日開始各講各嘅，而學生會喺兩個地方見到同一件事兩個名。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('① dse_discoveries 唔喺上雲白名單入面', () => {
  const sync = read('lib/sync.ts')
  assert.ok(
    !sync.includes('dse_discoveries'),
    'lib/sync.ts 出現咗 dse_discoveries —— 發現簿含學生自己打嘅字，'
    + '唔可以上雲（憲章 §16.E 執行第 1 點：新增 key 要創辦人書面批准）',
  )
  // 順手鎖住個 key 名 —— 改名而唔更新呢個測試，上面條斷言就會變成空頭支票。
  assert.match(read('lib/discovery/local-store.ts'), /DISCOVERIES_KEY = 'dse_discoveries'/)
})

test('② 發現簿嘅維度沿用 ReverseCause，冇另開一套', async () => {
  const types = read('lib/discovery/types.ts')
  assert.match(types, /import type \{ ReverseCause \} from '@\/lib\/reverseLog'/,
    'types.ts 冇 import ReverseCause —— 唔好另開一套維度')
  assert.match(types, /export type Dimension = ReverseCause/)
  // 三個 id 要對得返 reverseLog 嗰三個
  const { DIMENSIONS } = await import('../discovery/dimensions.ts')
  assert.deepEqual(DIMENSIONS.map((d) => d.id), ['A', 'B', 'C'])
})

test('③ 反思閘秒數單一來源 —— PracticeSession 唔准自己寫死一個數', () => {
  const dims = read('lib/discovery/dimensions.ts')
  assert.match(dims, /export const REFLECTION_SECONDS = 30/, '憲章 §7 現行條文係 30 秒')
  const ps = read('app/practice/PracticeSession.tsx')
  assert.match(ps, /const LOCKOUT_SECONDS = REFLECTION_SECONDS/,
    'PracticeSession 應該由 dimensions.ts import 秒數，唔好自己寫一個數字')
})

test('④ 反思閘喺【所有】答錯題都行，唔再限 hard（憲章 §7 2026-09-05 修訂）', () => {
  const ps = read('app/practice/PracticeSession.tsx')
  assert.ok(
    !/if \(currentQ\.difficulty === 'hard'\) \{\s*\n\s*const lq = pickLockoutQuestion/.test(ps),
    '反思閘又變返 hard-only —— 憲章 §7 已於 2026-09-05 改為所有答錯題',
  )
})

test('⑤ 冇任何學生可見文案寫死一個同 REFLECTION_SECONDS 唔一致嘅秒數', async () => {
  // 2026-09-05 實測：60→30 改咗代碼之後，全站仲有五處文案照寫「60 秒」——
  // 包括個鎖自己個標題「60 秒冷靜艙」、練習頁說明、layout 嘅 meta description
  // 同 llms.txt。學生見到個掣寫 60、實際 30；agent 讀 llms.txt 讀到 60。
  //
  // 秒數係一個【會改】嘅數字（今次已經改過一次），而佢散落喺五個檔嘅字串裏面。
  // 冇閘就一定會再分叉，所以呢度掃返學生可見嗰批。
  const { REFLECTION_SECONDS } = await import('../discovery/dimensions.ts')
  const files = [
    'app/practice/PracticeSession.tsx',
    'app/practice/page.tsx',
    'app/layout.tsx',
    'public/llms.txt',
  ]
  for (const f of files) {
    const src = read(f)
    for (const m of src.matchAll(/(\d+)\s*秒(冷靜艙|反思鎖)/g)) {
      assert.equal(Number(m[1]), REFLECTION_SECONDS, `${f} 寫死咗「${m[0]}」，但 REFLECTION_SECONDS = ${REFLECTION_SECONDS}`)
    }
    for (const m of src.matchAll(/(\d+)-second (reflection lock|calm capsule)/g)) {
      assert.equal(Number(m[1]), REFLECTION_SECONDS, `${f} 寫死咗「${m[0]}」，但 REFLECTION_SECONDS = ${REFLECTION_SECONDS}`)
    }
  }
})

test('⑥ 冇任何學生可見文案仲聲稱個鎖只喺「中高難度」先行', () => {
  for (const f of ['app/practice/page.tsx', 'app/layout.tsx', 'public/llms.txt']) {
    const src = read(f)
    assert.ok(!/答錯中高難度題/.test(src), `${f} 仲寫住「答錯中高難度題」—— 憲章 §7 已改為所有答錯題`)
    assert.ok(!/wrong answer on harder items|answer on harder items/.test(src),
      `${f} 仲寫住 "on harder items" —— 憲章 §7 已改為所有答錯題`)
  }
})
