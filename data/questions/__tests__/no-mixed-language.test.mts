// ============================================================================
// no-mixed-language.test.mts —— 題庫唔准有中英夾雜嘅殘句
// ----------------------------------------------------------------------------
// 憲章 §5：解析層必須 100% 標準書面語或英文。
//
// 2026-08-21 掃描全部 data/questions/*.ts，揪到 7 條中文字串入面夾住咗英文詞，
// 明顯係機器翻譯遺留，學生睇得到：
//   · 「漢代掌管音樂、采集民歌的official機構」（→ 官方機構）
//   · 「廉頗雖老仍思report國的典故」（→ 思報國，呢個直接改咗典故嘅意思）
//   · 「音韻low回」（→ 低回）、「斷開each音」、「按弦producing吟揉滑音」
//   · 「與企業直接互動的factors」、「寫意率性concise」
// 全部已修正。呢個測試防止同類情況再入庫。
//
// 只捉【中文字緊接拉丁字母】嘅情況。相反方向（英文詞後接中文標點或漢字）
// 屬正常寫法，例如「Legato 音與音連貫圓滑」，故不納入。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = new URL('..', import.meta.url).pathname

/** 中文字之後直接接三個或以上拉丁字母 —— 幾乎一定係翻譯殘留。 */
const MIXED = /[一-鿿][A-Za-z]{3,}/g

/** 白名單：技術上必須夾住拉丁字母嘅寫法（暫時冇，保留擴充位）。 */
const ALLOW: RegExp[] = []

test('題庫字串唔可以中英夾雜（中文字直接接英文詞）', () => {
  const bad: string[] = []
  for (const f of readdirSync(DIR).filter((n) => n.endsWith('.ts'))) {
    const src = readFileSync(join(DIR, f), 'utf8')
    src.split('\n').forEach((line, i) => {
      for (const m of line.match(MIXED) ?? []) {
        if (ALLOW.some((re) => re.test(m))) continue
        bad.push(`${f}:${i + 1}  「${m}」　…${line.trim().slice(0, 90)}…`)
      }
    })
  }
  assert.equal(bad.length, 0, `發現 ${bad.length} 處中英夾雜：\n${bad.join('\n')}`)
})
