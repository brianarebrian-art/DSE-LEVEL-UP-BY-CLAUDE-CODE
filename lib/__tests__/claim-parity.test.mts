// ============================================================================
// claim-parity.test.mts —— 所有對外題數聲稱必須同真題庫一致
// ----------------------------------------------------------------------------
// ⚠️ 2026-09-19 由 `llms-txt-parity.test.mts` 改名擴闊。點解要擴：
//
// 舊版守得好，但【只守一個檔】。2026-09-05 喺 llms.txt 捉到少報 5.1 倍之後
// 加咗呢個閘，而同一個數字、同一個漂移機制，喺 `app/layout.tsx` 嘅
// WebApplication JSON-LD description 入面【繼續漂咗兩個星期】——
// 寫住 26,204，實際 27,321，差 1,117，冇任何嘢紅過。
//
// 更諷刺嘅係嗰段 JSON-LD 上面三行就寫住「誠實紅線：description 只寫查證得到
// 嘅事實（題數實測 26,204、25 科）」—— 一句自稱已核實嘅聲稱，本身過咗期。
// 呢個同 §16.D 嗰句「自動攔截 3Hz 閃爍」係同一個病。
//
// 教訓唔係「layout.tsx 都要加測試」，係【閘要寫畀嗰一類 bug，唔係寫畀
// 搵到 bug 嗰個檔】。所以下面最後一條測試唔再點名任何檔案：佢自己去搵
// 全部對外聲稱位（llms.txt ＋ 任何帶 metadata／JSON-LD 嘅 .tsx），
// 抽出所有「N 條題目」式數字，逐個對返真題庫。
// 下次有人喺第三個檔寫同一個數，都一樣走唔甩。
// ============================================================================
// 2026-09-05 實測：llms.txt 寫住「5,167 multiple-choice questions
// (verified 2026-07-29)」，實際係 26,204 條 —— 少報 21,037 條，約 5.1 倍。
// 逐科數字（math 928 / physics 540 / economics 312…）亦全部過時。
//
// 點解呢個檔特別緊要：llms.txt 就係【AI agent 攞嚟描述呢個網站】嗰份文件。
// 一個學生問 agent「邊度有免費 DSE 練習題」，agent 讀完呢個檔之後
// 覆返嘅數字就係呢啲。少報五倍，等於自己同自己講細話。
//
// 而且佢自稱 "verified 2026-07-29" —— 一個【有日期嘅聲稱】過咗期，
// 比冇日期更差：讀嘅人會以為有人核對過。呢個同憲章 §16.D 嗰句
// 「自動攔截 3Hz 閃爍」係同一個病，只不過對象係 agent 唔係學生。
//
// 漂移嘅原因係結構性：題庫每星期加題，llms.txt 係人手維護嘅純文字。
// 冇閘就一定會再漂移，所以呢度每次 npm test 都拎真數字對一次。
// 改咗題庫 → 跑 npm run gen:summary → 順手更新 llms.txt。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const txt = readFileSync(join(ROOT, 'public/llms.txt'), 'utf8')
const { SUBJECT_SUMMARY, TOTAL_QUESTIONS } = await import('../../data/questions/summary.generated.ts')
const { subjects } = await import('../../data/subjects.ts')
const active = subjects.filter((s) => s.isActive !== false)
const FIX = '—— 跑 `npm run gen:summary` 攞真數字，然後更新 public/llms.txt'

const num = (s: string) => Number(s.replace(/,/g, ''))

test('llms.txt 嘅總題數同真題庫一致', () => {
  const m = txt.match(/([\d,]+) questions across 25 HKDSE subjects/)
  assert.ok(m, `llms.txt 搵唔到總題數句子 ${FIX}`)
  assert.equal(num(m[1]), TOTAL_QUESTIONS, `llms.txt 總題數對唔上 ${FIX}`)
})

test('llms.txt 嘅 MC／書寫題拆分同真題庫一致', () => {
  const mc = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].mc, 0)
  const written = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].written, 0)
  const m = txt.match(/([\d,]+) multiple-choice and ([\d,]+)\s*\n?\s*written/)
  assert.ok(m, `llms.txt 搵唔到 MC／書寫題拆分 ${FIX}`)
  assert.equal(num(m[1]), mc, `MC 數對唔上 ${FIX}`)
  assert.equal(num(m[2]), written, `書寫題數對唔上 ${FIX}`)
})

test('llms.txt 逐科題數同真題庫一致', () => {
  for (const s of active) {
    // 逐科寫成 `math 1539`，用詞界防止 m1 撞 m1x 之類
    const m = txt.match(new RegExp(`\\b${s.id.replace(/-/g, '\\-')} (\\d+)\\b`))
    assert.ok(m, `llms.txt 冇列 ${s.id} 嘅題數 ${FIX}`)
    assert.equal(
      Number(m[1]), SUBJECT_SUMMARY[s.id].total,
      `${s.id} 喺 llms.txt 寫 ${m[1]}，實際 ${SUBJECT_SUMMARY[s.id].total} ${FIX}`,
    )
  }
})

test('llms.txt 有 "When to use this" 段 —— 話畀 agent 知幾時應該搵我哋', () => {
  assert.match(txt, /##\s*When to use this/i, 'llms.txt 冇 When to use this 段')
  // 「唔應該搵我哋」嗰半同樣重要：冇咗佢，agent 會喺聽力／作文批改／JUPAS
  // 呢啲我哋明確做唔到嘅事上面推薦我哋，而嗰三樣分別係「冇音檔」
  // 「憲章 §16.A 永久禁止」同「§8 已否決」。
  assert.match(txt, /Do NOT reach for us/i, 'llms.txt 冇講明幾時【唔應該】搵我哋')
  for (const must of ['HKEAA past papers', 'listening', 'JUPAS']) {
    assert.ok(txt.includes(must), `"Do NOT" 段冇提 ${must}`)
  }
})

// ── 呢條先係重點：唔點名任何檔 ──────────────────────────────────────────
//
// 上面四條守住 llms.txt。呢條守住【呢一類聲稱】：自己行勻對外聲稱位，
// 抽出所有「N 條題目」式數字，逐個對返真題庫。
//
// 掃邊啲檔：public/llms.txt，加上 app/ 同 components/ 入面任何帶
// `export const metadata` 或 JSON-LD（`'@context'`／`'@type'`）嘅 .tsx ——
// 即係會俾搜尋引擎、AI agent 或者分享卡讀到嗰啲。人手列檔名嘅話，
// 呢條測試落一年就會同舊版一樣，守住咗三個檔而漏咗第四個。

// ⚠️ 註釋【一齊掃】，唔剝走。
// 呢點同 discovery-local-only 測試⑤相反（嗰度特登剝註釋，因為憲章 §7.2 要求
// 保留「個鎖存在過」嘅歷史記述）。呢度唔可以剝：原本個 bug 有一半就係喺註釋
// 入面 ——「誠實紅線：…（題數實測 26,204、25 科）」。一句自稱已核實嘅註釋
// 過咗期，殺傷力唔比 description 細，因為下一個讀嘅人會信佢而唔再去數。
// 代價係寫歷史註釋嗰陣唔可以重述舊數字，要改寫成唔帶數字嘅講法。
/** 一個數字要算「題數聲稱」，要貼住題目相關嘅字眼 —— 淨係四位數會撈到年份。 */
const CLAIM_PATTERNS = [
  /([\d][\d,]{3,})\s*(?:[A-Za-z-]+\s+){0,3}questions?\b/gi, // 26,204 independently rewritten questions
  /([\d][\d,]{3,})\s*條\s*(?:題|試題|題目)/g, //               27,321 條題目
  /題[數目][^\d\n]{0,8}([\d][\d,]{3,})/g, //                   題數實測 26,204
]

function claimFiles(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) claimFiles(rel, out)
    else if (e.name.endsWith('.tsx') && !rel.includes('__tests__')) {
      const src = readFileSync(join(ROOT, rel), 'utf8')
      if (/export const metadata|'@context'|'@type'/.test(src)) out.push(rel)
    }
  }
  return out
}

test('全部對外題數聲稱都同真題庫一致 —— 唔限於 llms.txt', () => {
  const mcTotal = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].mc, 0)
  const writtenTotal = active.reduce((n, s) => n + SUBJECT_SUMMARY[s.id].written, 0)
  // 准許嘅數字：全站總數、MC／書寫拆分，同逐科總數（llms.txt 逐科列）。
  const allowed = new Set<number>([
    TOTAL_QUESTIONS,
    mcTotal,
    writtenTotal,
    ...active.map((s) => SUBJECT_SUMMARY[s.id].total),
    ...active.map((s) => SUBJECT_SUMMARY[s.id].mc),
  ])

  const files = ['public/llms.txt', ...claimFiles('app'), ...claimFiles('components')]
  const bad: string[] = []
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8')
    for (const re of CLAIM_PATTERNS) {
      for (const m of src.matchAll(re)) {
        const n = num(m[1])
        if (!allowed.has(n)) {
          const line = src.slice(0, m.index).split('\n').length
          bad.push(`${f}:${line}　寫住 ${m[1]}　「${m[0].replace(/\s+/g, ' ').trim()}」`)
        }
      }
    }
  }

  assert.deepEqual(
    bad,
    [],
    `${bad.length} 處對外題數聲稱同真題庫對唔上（真數：全站 ${TOTAL_QUESTIONS}、` +
      `MC ${mcTotal}、書寫 ${writtenTotal}）：\n  ${bad.join('\n  ')}\n\n` +
      `呢啲數字會俾搜尋引擎同 AI agent 直接讀。唔好手寫 —— 由 ` +
      `data/questions/summary.generated.ts 嘅 TOTAL_QUESTIONS 衍生，` +
      `咁就唔會再漂。llms.txt 係純文字，跑 \`npm run gen:summary\` 之後人手更新。`,
  )
})
