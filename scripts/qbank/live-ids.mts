// ============================================================================
// live-ids.mts —— 印出【現時真係載入得到】嘅題目 id（JSON array）
// ----------------------------------------------------------------------------
// 點解要有呢個：`data/provenance.ts` 係學生見到嘅實名審批紀錄，
// /transparency 同 /trust 兩版都會用 `REVIEWED_COUNT` 講一句
// 「N 條題目有實名審批紀錄 —— 佔現時 X 條【上線】題目嘅 pct%」。
//
// 但 `gen-provenance.mjs` 一直只數 decisions.json 入面 approved 嘅 id，
// 【冇問過嗰條題係咪真係上咗線】。批咗但未 promote 嘅題目一樣會計入去 ——
// 2026-09-12 就撞正：一次過批咗 1,878 條草稿，如果照跑生成器，
// REVIEWED_COUNT 會由 604 跳到 2,482，而其中 1,878 條學生一條都做唔到。
// 個百分比會由 2.31% 變 9.47%，即係對外講大咗四倍（憲章 §8 禁虛構統計）。
//
// 點解唔用 regex 掃 data/questions/*.ts 嘅 `id: '...'`：實測全 repo 只搵到
// 388 個字面 id，而 live 題有 26,204 條 —— 絕大部分經 `makeQ` / `_builder.ts`
// / `_parametric.ts` 程式生成，字面上根本唔存在。要知邊條上咗線，
// 只有一個辦法：真係載入佢。
//
// 用法：npx tsx scripts/qbank/live-ids.mts   （由 gen-provenance.mjs 呼叫）
// ============================================================================

// ⚠️ 用 dynamic import 而唔係具名 import：tsx 之下 `.ts` 模組（CJS interop）
// 唔可以由 `.mts` 具名 import 出 runtime 值，會 SyntaxError。全 repo 同一寫法。
const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions, loadWrittenQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<{ id: string }>>
  loadWrittenQuestions: (id: string) => Promise<Array<{ id: string }>>
}>('../../data/questions/load.ts')
const { getActiveSubjects } = await mod<{
  getActiveSubjects: () => Array<{ id: string }>
}>('../../data/subjects.ts')

const ids = new Set<string>()
for (const s of getActiveSubjects()) {
  for (const q of await loadSubjectQuestions(s.id)) ids.add(q.id)
  // 寫作題（long／text）唔係每科都有 —— 冇就跳過，唔好令成個列舉死。
  try { for (const q of await loadWrittenQuestions(s.id)) ids.add(q.id) } catch { /* 呢科冇寫作題 */ }
}

process.stdout.write(JSON.stringify([...ids]))
