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

// ══ 2026-09-09：30 秒反思鎖已剷除（兩個月實驗，憲章 §7.2）══
//
// 呢三條測試原本守住個鎖（秒數單一來源、所有答錯題都行、文案唔准分叉）。
// 鎖剷咗，佢哋唔係刪走 —— 係【反轉】去守實驗條件本身。一條刪走咗嘅測試
// 等於一條冇人守嘅界線；而呢個實驗嘅價值完全取決於兩個月入面
// ①個鎖真係冇返嚟 ②入料嗰一步真係仲喺度。

test('③ 個鎖唔可以靜靜哋返嚟 —— PracticeSession 一個倒數都唔准有', () => {
  const ps = read('app/practice/PracticeSession.tsx')
  const code = ps.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
  for (const gone of ['LOCKOUT_SECONDS', 'lockDeadlineRef', 'setLockSecs', 'pickLockoutQuestion',
                      'startServerLockout', 'verifyServerUnlock', 'playLockChime']) {
    assert.ok(
      !code.includes(gone),
      `PracticeSession 又出現咗 ${gone} —— 反思鎖喺 2026-09-09 剷咗做兩個月實驗。` +
        `要復活請走憲章程序（§7.2），唔好靜靜哋接返 —— 接返咗，兩個月後條 curve 就冇意義。`,
    )
  }
})

test('④ 錯因自診【一定要】留低 —— 佢係錯題 DNA 嘅唯一入料口', () => {
  const ps = read('app/practice/PracticeSession.tsx')
  // 剷鎖嗰陣好易順手將成個 chooseCause 一齊剷。剷咗就冇咗：
  // 錯題 DNA 雷達、遺忘曲線重溫、溫書地圖報告，同埋憲章 §16.E
  //（2026-09-08 雙簽）跨機同步嗰個 dse_reverse_log。
  assert.match(ps, /logReverseError\(logEntry\)/,
    'chooseCause 冇再寫入錯題日誌 —— ErrorRadar／ReviewScheduler／溫書地圖會一齊變白')
  assert.match(ps, /addDiscovery\(\{/,
    'chooseCause 冇再記發現 —— /result 嘅「今日你發現咗 N 樣嘢」會永遠係 0')
  assert.match(ps, /const chooseCause = useCallback\(/, 'chooseCause 本身唔見咗')
})

test('⑤ 冇任何學生或者 agent 見到嘅文案仲講住個鎖', () => {
  // 2026-09-05 嗰次由 60 改 30，全站有五處文案冇跟住改。今次係整個剷除，
  // 同一個風險更大：對外仲寫住「答錯會鎖 30 秒」而實際上冇，就係假聲稱。
  const files = [
    'app/layout.tsx',
    'app/practice/page.tsx',
    'app/subjects/[subject]/SubjectDetailView.tsx',
    'public/llms.txt',
  ]
  const hits: string[] = []
  for (const f of files) {
    let src: string
    try { src = read(f) } catch { continue }
    // 只掃學生／agent 讀到嘅字串，唔掃解釋改動嘅註釋。
    const copy = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    if (/秒反思鎖|reflection lock|秒冷靜艙/i.test(copy)) hits.push(f)
  }
  assert.deepEqual(hits, [], `呢啲檔仲對外聲稱有反思鎖，但鎖已經剷咗：\n  ${hits.join('\n  ')}`)
})


test('⑥ 冇任何學生可見文案仲聲稱個鎖只喺「中高難度」先行', () => {
  for (const f of ['app/practice/page.tsx', 'app/layout.tsx', 'public/llms.txt']) {
    const src = read(f)
    assert.ok(!/答錯中高難度題/.test(src), `${f} 仲寫住「答錯中高難度題」—— 憲章 §7 已改為所有答錯題`)
    assert.ok(!/wrong answer on harder items|answer on harder items/.test(src),
      `${f} 仲寫住 "on harder items" —— 憲章 §7 已改為所有答錯題`)
  }
})
