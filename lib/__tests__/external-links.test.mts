import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// 第三方出口回歸測試。
//
// ══ 點解需要 ══
// 2026-08-20 嘅信譽審核只點名咗一條外部連結（IG 群組）。實際掃全站掃出【七】個出口：
// IG、YouTube iframe、YouTube 外開、ytimg 縮圖、GitHub、WhatsApp、史料引註。
// 一個人手審核走漏六個，唔係審核唔認真 —— 係「外部連結」呢樣嘢天生分散，每次有人
// 加一條新嘅都唔會有人為咗一條 <a> 而重新掃全站。
//
// 所以呢個閘唔係捉現有問題（現時全部已上閘），係守住一條而家乾淨嘅線：日後任何人
// 喺 app/ 或 components/ 加一條出站連結，如果冇經 ExternalLinkGate，呢度即刻紅。

const ROOTS = ['app', 'components']
const GATE = 'components/ExternalLinkGate.tsx'

/** 剝註解：檔頭寫住「唔好用 target=_blank」係好事，唔可以當違規。次序同其他 guard 一致。 */
const stripComments = (s: string) =>
  s
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.tsx')) out.push(p)
  }
  return out
}

const files = ROOTS.flatMap((d) => walk(d)).filter((f) => f !== GATE)

test('冇任何 <a> 直接用 target="_blank" 離站', () => {
  const offenders = files.filter((f) => stripComments(fs.readFileSync(f, 'utf8')).includes('target="_blank"'))
  assert.deepEqual(
    offenders,
    [],
    `以下檔案有未上閘嘅出站連結：\n  ${offenders.join('\n  ')}\n` +
      '改用 <ExternalLinkGate href=… platform=… platformEn=…>。學生係 12–18 歲，' +
      '離站之前一定要知道自己去緊邊、以及過咗界之後我哋管唔到。',
  )
})

/**
 * 唔屬於「用戶點擊離站」嘅外部 URL 白名單。每個必須有理由 —— 一張冇理由嘅白名單
 * 好快會變成「加落去就算」，到時個閘等於冇。
 */
const ALLOW: { file: string; why: string }[] = [
  {
    file: 'app/relax/components/SoloPlayer.tsx',
    why: 'youtube-nocookie iframe src：唔係 <a>，而且只喺用戶按下播放之後先載入。外開連結本身已上閘。',
  },
]

test('每個含外部 URL 嘅檔，唔係已引入閘門，就係喺白名單', () => {
  const EXTERNAL = /https?:\/\/(?!dse-level-up-by-claude-code)[a-z0-9.-]+/gi
  const bad: string[] = []
  for (const f of files) {
    const src = stripComments(fs.readFileSync(f, 'utf8'))
    const hits = src.match(EXTERNAL)?.filter((u) => !/w3\.org|schema\.org|localhost/i.test(u)) ?? []
    if (hits.length === 0) continue
    if (src.includes('ExternalLinkGate')) continue
    if (ALLOW.some((a) => a.file === f)) continue
    bad.push(`${f} → ${[...new Set(hits)].join(', ')}`)
  }
  assert.deepEqual(bad, [], `以下檔案有外部 URL 但冇上閘，亦唔喺白名單：\n  ${bad.join('\n  ')}`)
})

test('閘門本身唔可以被改成靜靜哋直接跳走', () => {
  const gate = fs.readFileSync(GATE, 'utf8')
  // host 一定要由 href 即時解析。寫死平台名同 href 可以唔一致（有人改咗 href
  // 但忘記改名），真實 host 唔會講大話。
  assert.match(gate, /new URL\(href/, '閘門必須由 href 解析真實 host，唔可以淨係顯示人手填嘅平台名')
  assert.match(gate, /aria-modal="true"/, '對話框必須有 aria-modal')
  assert.match(gate, /Escape/, '對話框必須撳得 Esc 走')
})

test('白名單每一項都真實存在（唔可以留下已刪檔嘅殭屍豁免）', () => {
  for (const a of ALLOW) {
    assert.ok(fs.existsSync(a.file), `白名單指向唔存在嘅檔：${a.file}`)
    assert.ok(a.why.length > 20, `白名單 ${a.file} 欠實質理由`)
  }
})
