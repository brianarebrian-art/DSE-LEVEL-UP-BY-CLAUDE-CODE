import { writeFileSync } from 'node:fs'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

type Fmt = {
  subject: string
  hasMC: boolean
  mcWeightPct?: number
  formats: string[]
  papersZh: string
  papersEn: string
  verifiedOn: string
  frameworkYear: number
  difficultyGradient?: string
}
type Sub = { id: string; name: string }

const { DSE_PAPER_FORMATS } = await mod<{ DSE_PAPER_FORMATS: Fmt[] }>(
  '../../../data/dse-paper-formats.ts',
)
const { subjects } = await mod<{ subjects: Sub[] }>('../../../data/subjects.ts')

let md = `# docs/04-item-fingerprints.md — 25 科卷別題型指紋

> 生成：2026-11-26（Asia/Hong_Kong）
> 種子：\`data/dse-paper-formats.ts\`（結構事實）+ 上傳研究報告框架；**不含**官方題原文。
> 難度代理：見 \`docs/05-difficulty-model.md\`（非實測）。

`
const bySub = Object.fromEntries(DSE_PAPER_FORMATS.map((x) => [x.subject, x]))
for (const s of subjects) {
  const f = bySub[s.id]
  md += `## ${s.name} (\`${s.id}\`)\n\n`
  if (!f) {
    md += '- **WARNING:** 無 paper-format 紀錄\n\n'
    continue
  }
  md += `- **真實卷面有 MC:** ${f.hasMC ? 'yes' : 'no'}${
    f.mcWeightPct != null ? `（約佔全科 ${f.mcWeightPct}%）` : ''
  }\n`
  md += `- **題型 formats:** ${f.formats.join(', ')}\n`
  md += `- **papersZh:** ${f.papersZh}\n`
  md += `- **papersEn:** ${f.papersEn}\n`
  md += `- **frameworkYear / verifiedOn:** ${f.frameworkYear} / ${f.verifiedOn}\n`
  if (f.difficultyGradient) {
    md += `- **官方難度梯度（結構）:** ${f.difficultyGradient}\n`
  }
  md += `- **平台練習定位:** ${
    f.hasMC
      ? 'MC 對應真實卷面部分比重'
      : 'MC／概念題僅作知識檢查，**非**真實卷面主考形式'
  }\n`
  md +=
    '- **認知剖面（草稿代理，待校準）:** 記憶 10 / 理解 25 / 應用 30 / 分析 20 / 評價 10 / 創造 5\n'
  md +=
    '- **隨機化規則（預設）:** 題序洗牌；MC 選項洗牌；同 session 反重複；server seed\n'
  md +=
    '- **AI 限制:** 禁官方原文；數理 correct-by-construction 優先；高風險 100% 抽檢\n'
  md += '- **列印:** A4；封面+時限+非官方聲明；SEN 友善行距可選\n\n'
}

writeFileSync('docs/04-item-fingerprints.md', md)
console.log(
  JSON.stringify({ subjects: subjects.length, formats: DSE_PAPER_FORMATS.length }),
)
