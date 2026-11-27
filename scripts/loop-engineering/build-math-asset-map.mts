/**
 * 由倉庫內的在練題生成必修數學資產地圖與 50 題試點。
 * 不連線資料庫，不改題庫，不更新 question_bank_versions。
 *
 *   npm run loop:math-map
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../data/questions/load.ts')

const { RUBRIC_VERSION } = await import('../../lib/loop-engineering/rubric.ts')
const { buildAssetMap } = await import('../../lib/loop-engineering/asset-map.ts') as {
  buildAssetMap: (items: Array<Record<string, unknown>>, version: string) => {
    rubricVersion: string
    generatedFor: string
    itemCount: number
    pilotCount: number
    scoringNoteZh: string
    summary: {
      itemCount: number
      byType: Record<string, number>
      byTopic: Array<{ topic: string; topicZh: string; labelCount: number; count: number }>
      completeness: Record<string, number>
      abc: { C: number; unscored: number }
      baselineProfiles: Record<string, number>
      defectReasons: Record<string, number>
      pilot: { count: number; A: number; B: number; C: number; proxyMeetsFormula: number }
    }
    rows: unknown[]
    pilot: unknown[]
  }
}

const { buildWeek12DryRun } = await import('../../lib/loop-engineering/dry-run.ts') as {
  buildWeek12DryRun: () => unknown
}
const { loadStoredPrompt } = await import('../../lib/loop-engineering/prompts.ts') as {
  loadStoredPrompt: (key: 'upgrade' | 'aiReview' | 'twoPersonReview') => string
}

for (const key of ['upgrade', 'aiReview', 'twoPersonReview'] as const) {
  if (loadStoredPrompt(key).trim().length < 80) throw new Error(`已存放提示太短：${key}`)
}

const items = await loadSubjectQuestions('math')
const map = buildAssetMap(items, RUBRIC_VERSION)
const dryRun = buildWeek12DryRun()

const pilotPath = 'data/loop-engineering/math-compulsory-pilot-scores.json'
const dryPath = 'data/loop-engineering/week12-dry-run.json'
const summaryPath = 'docs/loop-engineering/math-asset-map-summary.md'

for (const path of [pilotPath, dryPath, summaryPath]) mkdirSync(dirname(path), { recursive: true })

writeFileSync(
  pilotPath,
  JSON.stringify(
    {
      rubricVersion: map.rubricVersion,
      scorer: 'ruleset_proxy_v1',
      needsHumanConfirmation: true,
      verifiedDsePlus10: false,
      scoringNoteZh: map.scoringNoteZh,
      pilotCount: map.pilotCount,
      pilot: map.pilot,
    },
    null,
    2,
  ) + '\n',
)
writeFileSync(dryPath, JSON.stringify(dryRun, null, 2) + '\n')
writeFileSync(summaryPath, renderSummary(map.summary, map.itemCount, map.pilotCount))

console.log(`在練必修數學 ${map.itemCount} 題；試點 ${map.pilotCount} 題。`)
console.log(`C 級客觀缺陷 ${map.summary.abc.C}；未評 A/B ${map.summary.abc.unscored}。`)
console.log('逐題查閱請用 npm run loop:query。試點分數不是分級。')

function renderSummary(
  summary: {
    byType: Record<string, number>
    byTopic: Array<{ topic: string; topicZh: string; labelCount: number; count: number }>
    completeness: Record<string, number>
    abc: { C: number; unscored: number }
    baselineProfiles: Record<string, number>
    defectReasons: Record<string, number>
    pilot: { count: number; A: number; B: number; C: number; proxyMeetsFormula: number }
  },
  itemCount: number,
  pilotCount: number,
): string {
  const types = Object.entries(summary.byType)
    .map(([key, count]) => `| ${key} | ${count} |`)
    .join('\n')
  const topics = summary.byTopic
    .map((topic) => `| ${topic.topicZh} | \`${topic.topic}\` | ${topic.labelCount} | ${topic.count} |`)
    .join('\n')
  const defects = Object.entries(summary.defectReasons)
  const defectTable = defects.length
    ? defects.map(([key, count]) => `| \`${key}\` | ${count} |`).join('\n')
    : '| （沒有） | 0 |'
  return `# 必修數學在練題資產地圖摘要

由 \`npm run loop:math-map\` 從倉庫題庫生成。逐題查閱用 \`npm run loop:query\`，不要把題幹寫進倉庫。分級只有客觀缺陷 C 與尚未人手評分的 unscored。試點的 A／B 是規則代理，不是分級。這不是考評局統計，也不是已驗證的難度提升。

在練題 ${itemCount} 條。試點評分 ${pilotCount} 條，使用 \`ruleset_proxy_v1\`，須人工確認。

2026-11-27 預覽已從學生練習收起兩條已確認客觀 C 級題：\`math_fl_ns04\`、\`mb_n1_5_2\`（題幹重複）。兩條不在上表，題目仍在倉庫。其餘未評分題仍在練習。試點 A／B 不是上線分級。

## 題型

| 題型 | 題數 |
|---|---:|
${types}

## 完整度

| 項目 | 題數 |
|---|---:|
| 有題幹 | ${summary.completeness.stem} |
| 選擇題須有選項 | ${summary.completeness.optionsApplicable} |
| 選項齊備 | ${summary.completeness.optionsPresent} |
| 有答案 | ${summary.completeness.answer} |
| 有解析或評分準則 | ${summary.completeness.explanation} |
| 題幹提到圖但沒有圖檔 | ${summary.completeness.figureReferencedMissing} |
| 有圖檔 | ${summary.completeness.figurePresent} |

## 基準剖面（平台操作讀法）

| 剖面 | 題數 |
|---|---:|
${Object.entries(summary.baselineProfiles)
  .map(([key, count]) => `| \`${key}\` | ${count} |`)
  .join('\n')}

## A／B／C

全庫只把客觀缺陷標成 C，其餘是 \`unscored\`。試點的 A／B 來自規則代理，不是人手評分。

| 範圍 | 結果 |
|---|---|
| 全庫 C | ${summary.abc.C} |
| 全庫未評 A／B | ${summary.abc.unscored} |
| 試點 A | ${summary.pilot.A} |
| 試點 B | ${summary.pilot.B} |
| 試點 C | ${summary.pilot.C} |
| 試點代理分數達到公式 (1) | ${summary.pilot.proxyMeetsFormula}（仍屬未驗證） |

## 缺陷原因

| 原因 | 題數 |
|---|---:|
${defectTable}

## 課題

| 課題（該代號下最常見的名稱） | 代號 | 名稱數 | 題數 |
|---|---|---:|---:|
${topics}
`
}
