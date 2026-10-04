// Home and footer trust copy (UX loop 22, 2026-09-30; Yuna decision 6 and hardening prompt §31).
//
// 「2026 DSE 考生製作」said who made the site, not whether the questions can be trusted, and
// 「改寫版歷屆試題」／「拆穿歷屆試題嘅底層邏輯」implied the questions come from past papers.
// The replacement states what is true: topics have had a first-pass check against the 2027
// curriculum guides (docs/topic-syllabus-map-2027.md, AI first pass, not yet reviewed by a
// subject lead) and questions go live after automated checks without item-by-item review.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dict = readFileSync('lib/dictionary.ts', 'utf8')
const home = readFileSync('app/page.tsx', 'utf8')
const layout = readFileSync('app/layout.tsx', 'utf8')
const strip = (s: string) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')

test('the maker line is gone in both languages', () => {
  assert.doesNotMatch(strip(dict), /2026 DSE 考生製作|Made by a 2026 DSE candidate/)
})

test('the trust copy states curriculum and review status, and says first pass', () => {
  assert.match(dict, /trust1: '✓ 課題初步對照 2027 年課程指引',/)
  assert.match(dict, /trust1: '✓ Topics checked against the 2027 curriculum guides \(first pass\)',/)
  // 2026-10-02 founder decision (charter §12.1 constraint 1): the "not reviewed by hand"
  // half-sentence is gone; the copy still says the questions are machine-checked.
  assert.match(dict, /tagline2: '課題初步對照 2027 年文憑試課程指引；題目經自動檢查上線。',/)
  const hero = home.slice(home.indexOf('<li>{h.trust3}</li>'))
  assert.match(hero.slice(0, 900), /'題目經自動檢查上線。'/)
  assert.match(hero.slice(0, 700), /<Link href="\/transparency" className="inline-flex min-h-11 /, '44px target')
})

test('nothing presents the questions as past papers', () => {
  const visible = strip(dict) + strip(home)
  assert.doesNotMatch(visible, /改寫版歷屆試題|Rewritten past-paper|拆穿歷屆試題|logic of past papers/)
  assert.doesNotMatch(layout.match(/keywords: \[[^\]]*\]/)![0], /歷屆試題/)
  assert.match(dict, /tagline1: '原創 DSE 練習題，掌握核心邏輯。',/)
})

// Removing the disclosure must not turn into the opposite claim (charter §16.D, §8).
// The trust and methodology pages are scanned too (audit #7, 2026-10-04): both said
// 「出唔出街由人決定」 / "a person decides what goes live" for a month after charter §12.1 made
// the machine gate the default way questions go live.
const pages = ['app/trust/TrustClient.tsx', 'app/methodology/MethodologyClient.tsx', 'app/transparency/TransparencyClient.tsx', 'app/about/AboutClient.tsx']
  .map((f) => strip(readFileSync(f, 'utf8')))
  .join('\n')

test('no visible copy claims the questions were reviewed by a person', () => {
  const visible = strip(dict) + strip(home) + pages
  assert.doesNotMatch(visible, /已(經)?(由.{0,12})?(人手|真人|老師|教師|考生)(逐題|逐條)?覆核|逐題人手覆核過|reviewed by (a person|teachers|students|hand)/)
})

test('no visible copy says a person approves each question before it goes live', () => {
  assert.doesNotMatch(strip(dict) + strip(home) + pages, /出唔出街由人決定|上線由人決定|a person decides what goes live/)
  assert.match(pages, /經自動檢查之後上線；發現有錯，我哋會落架或者修正/)
  assert.match(pages, /go live after automated checks, and we withdraw or fix any that turn out to be wrong/)
})

// Audit #8 (2026-10-04, founders' reply 4a): /transparency says plainly that no registered
// teacher has reviewed the questions.
test('/transparency says the questions have not been reviewed by registered teachers', () => {
  const t = readFileSync('app/transparency/TransparencyClient.tsx', 'utf8')
  assert.match(t, /'每一條題目都由 DSE 舊生 \+ AI 協作編寫，上線前要通過自動檢查。題目未經註冊教師審定。'/)
  assert.match(t, /The questions have not been reviewed by registered teachers\./)
})
