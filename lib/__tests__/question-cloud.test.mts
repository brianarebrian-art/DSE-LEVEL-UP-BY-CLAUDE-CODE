// ============================================================================
// question-cloud.test.mts —— 鎖住「瀏覽器直連 Supabase 攞題目」嘅四條不變式
// ----------------------------------------------------------------------------
// 2026-09-05 題庫上雲之後，有四樣嘢一旦被人「清理」就會壞，而且壞法都係
// 【靜靜哋壞】—— 唔會拋錯、測試唔講就冇人知：
//
//   ① 靜態 chunk 回落路徑被當成死碼刪走 → 離線做唔到題
//   ② 分頁攞題被簡化成一個 GET      → 最大嗰科靜靜哋少咗五百幾條
//   ③ questionCloud 加入寫入        → 繞過憲章 §12 嘅覆核管線
//   ④ sync script 加 pull 模式      → 正本方向倒轉，改題目冇 diff 冇 blame
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('① load.ts 保留靜態 chunk 回落 —— 冇網一樣做到題', () => {
  const src = read('data/questions/load.ts')
  assert.match(src, /loadFromCloud/, '雲端路徑唔見咗')
  // 回落路徑靠呢兩個註冊表。雲端行得通嗰陣佢哋一個 byte 都唔會攞，
  // 所以「冇用過」唔等於「可以刪」—— 佢哋係離線、未設 key、雲端故障
  // 同封鎖咗 IndexedDB 四種情況嘅唯一出路。
  assert.match(src, /const loader = loaders\[subjectId\]/, '靜態 loader 回落被拆走')
  assert.match(src, /const auto = autoLoaders\[subjectId\]/, 'auto loader 回落被拆走')
  assert.match(src, /import\('\.\/math'\)/, '動態 import 唔見咗 —— chunk 唔會再 build 出嚟')
})

test('② 攞題一定要分頁 —— 最大嗰科超出 PostgREST 單頁上限', async () => {
  const idx = await import('../../data/questions/index.ts') as {
    getSubjectQuestions: (id: string) => unknown[]
  }
  const biggest = Math.max(...['math', 'chinese', 'history', 'physics']
    .map((s) => idx.getSubjectQuestions(s).length))
  // Supabase db-max-rows 預設會截斷回應，而且【唔會報錯】。呢個斷言將
  // 「最大科題數」同「一定要分頁」綁埋：題庫再大，呢條測試都仍然成立。
  assert.ok(biggest > 1000, `最大科得 ${biggest} 條 —— 若真係跌穿 1000，先至可以考慮拆分頁`)
  const src = read('lib/questionCloud.ts')
  assert.match(src, /Range:\s*`\$\{from\}-/, '分頁 Range header 唔見咗')
  assert.match(src, /if \(rows\.length < PAGE\) return out/, '分頁終止條件唔見咗')
})

test('③ questionCloud 只讀 —— 一個寫入動詞都唔准有', () => {
  const src = read('lib/questionCloud.ts')
  for (const verb of ['POST', 'PATCH', 'PUT', 'DELETE']) {
    assert.ok(
      !new RegExp(`method:\\s*['"\`]${verb}`).test(src),
      `questionCloud.ts 出現 ${verb} —— 瀏覽器唔可以寫題庫（憲章 §12）`,
    )
  }
  // anon key 係 NEXT_PUBLIC_（設計上公開）；service key 一旦喺呢度出現就係
  // 洩漏到瀏覽器 bundle。
  assert.match(src, /NEXT_PUBLIC_SUPABASE_ANON_KEY/)
  assert.ok(!src.includes('SERVICE_ROLE'), 'service role key 唔可以出現喺瀏覽器模組')
  // server 呼叫者（RSC／API route）唔應該行網絡。
  assert.match(src, /typeof window !== 'undefined'/, 'cloudBankEnabled 冇擋住 server')
})

test('④ 同步方向單向 —— sync script 唔准寫返 data/questions/', () => {
  const src = read('scripts/qbank/sync-questions.mts')
  assert.ok(!/writeFileSync|appendFileSync|mkdirSync/.test(src),
    'sync-questions.mts 出現檔案寫入 —— 雲端唔可以倒流返正本')
  assert.match(src, /方向係【單向】/, '單向聲明唔見咗')
})
