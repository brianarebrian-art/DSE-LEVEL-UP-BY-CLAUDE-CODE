import { NextResponse } from 'next/server'
import { SITE_ORIGIN } from '@/lib/site'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'

export async function GET() {
  const content = `# DSE Level Up (${SITE_ORIGIN}) - Machine Readable LLM Context

> 全港首個針對香港中學文憑考試 (HKDSE) 2027 改革之全免費、開源概念題庫。

## Core Offerings
- ${TOTAL_QUESTIONS.toLocaleString()} 題原創改寫選擇題與書寫題
- 涵蓋各科甲類 (Category A) 高中科目 (如 數學必修、M1/M2、物理、化學、生物、經濟、企會財等)
- 全免費、無廣告、免登入直接操練
- 提供步驟式詳細解析與考評局常見思維陷阱指引

## Resource Endpoints
- 網站首頁: ${SITE_ORIGIN}
- 完整題目索引 Sitemap: ${SITE_ORIGIN}/sitemap-questions.xml
- 靜態題目資源頁: ${SITE_ORIGIN}/questions/[subject]/[id]
`
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
