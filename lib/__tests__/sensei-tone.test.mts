// ============================================================================
// sensei-tone.test.mts —— 語氣層兩條界線
// ----------------------------------------------------------------------------
// ① 語氣 ≠ 假冒經歷。憲章 §16.B 核准嗰句寫明：考過 DSE 嘅係【團隊】，
//    唔係 Sensei。所以開場白唔可以用「我當年」「我試過」呢類第一人稱經歷 ——
//    否認自己係 AI 固然唔得，用細節暗示自己係人一樣唔得。
// ② 呈現選項用【做法】命名，唔用【病名】。平台唔可以判定學生屬邊一類。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

const tone = await import('../sensei/tone.ts').then((m: Record<string, unknown>) => (m.default ?? m) as {
  GREETINGS: readonly { zh: string; en: string }[]
  pickGreeting: (q: string) => { zh: string; en: string }
  orderSections: (p: Record<string, boolean>) => readonly string[]
  DEFAULT_PREFS: Record<string, boolean>
  TONE_PREFS_KEY: string
})

test('§16.B 延伸：開場白唔可以聲稱自己考過 DSE 或者有個人經歷', () => {
  // 「我當年」「我考嗰陣」「我試過」—— 呢類講法暗示 Sensei 係一個有經歷嘅人。
  const FIRST_PERSON_EXPERIENCE = /我當年|我考|我試過|我以前|我讀書嗰陣|我哋考|when I (?:sat|took)|I remember when/i
  for (const g of tone.GREETINGS) {
    assert.ok(!FIRST_PERSON_EXPERIENCE.test(g.zh), `開場白暗示個人經歷：「${g.zh}」`)
    assert.ok(!FIRST_PERSON_EXPERIENCE.test(g.en), `開場白暗示個人經歷：「${g.en}」`)
  }
})

test('開場白全部有中英兩版而且非空', () => {
  assert.ok(tone.GREETINGS.length > 0)
  for (const g of tone.GREETINGS) {
    assert.ok(g.zh.trim().length > 0 && g.en.trim().length > 0)
  }
})

test('同一句問題永遠揀同一句開場白（可重現，唔用隨機）', () => {
  const q = '點解共用品會有搭便車問題'
  assert.deepEqual(tone.pickGreeting(q), tone.pickGreeting(q))
})

test('先講點答：四段齊全，只係換次序，一段都唔會少', () => {
  const normal = tone.orderSections({ ...tone.DEFAULT_PREFS, conclusionFirst: false })
  const flipped = tone.orderSections({ ...tone.DEFAULT_PREFS, conclusionFirst: true })
  assert.deepEqual([...normal].sort(), [...flipped].sort(), '換次序唔可以整走任何一段')
  assert.notDeepEqual(normal, flipped)
  assert.equal(flipped[0], 'examTechnique')
})

test('呈現選項一律用做法命名 —— 介面唔准出現任何病名', () => {
  const ui = read('app/sensei/SenseiClient.tsx')
  // 註釋入面解釋「唔用病名」係好事，所以只掃註釋以外嘅字。
  const code = stripComments(ui)
  const DIAGNOSIS = /ADHD|專注力不足|抑鬱|焦慮症|自閉|讀寫障礙|強迫症|躁鬱|PTSD|dyslexia|autis|depress|anxiet/i
  assert.ok(!DIAGNOSIS.test(code), '介面出現病名 —— 呈現選項要用做法命名，平台唔可以判定學生屬邊一類')
})

test('偏好只存本機，唔可以入同步上載名單', () => {
  const sync = stripComments(read('lib/sync.ts'))
  assert.ok(!sync.includes(tone.TONE_PREFS_KEY), `${tone.TONE_PREFS_KEY} 唔可以出現喺 lib/sync.ts`)
  const toneSrc = stripComments(read('lib/sensei/tone.ts'))
  assert.ok(!/fetch\(|supabase|axios/i.test(toneSrc), '語氣層唔可以有任何網絡呼叫')
})

test('語氣層唔生成內容 —— 只揀開場白同排次序', () => {
  const src = stripComments(read('lib/sensei/tone.ts'))
  // 有 card 內容拼字串即係開始生成。
  assert.ok(!/`[^`]*\$\{[^}]*card\.[^}]*\}/.test(src), 'tone.ts 唔可以用 card 內容拼字串')
  assert.ok(!src.includes('concept:') || !/\$\{/.test(src.split('GREETINGS')[0]), '開場白必須係靜態字串')
})
