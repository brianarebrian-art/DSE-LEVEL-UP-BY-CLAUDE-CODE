// 學生介面語言按鈕及練習題正文切換。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
// package.json 沒有 "type": "module"，具名 import .ts 會被編成 CJS，.mts 只見到 default。
import * as localeNs from '../localePreference.ts'

const localeMod = (localeNs as unknown as { default?: typeof localeNs }).default ?? localeNs
const {
  immersiveLanguageOffset,
  interfaceLanguageAnnouncement,
  localeFromBrowserLanguage,
  parseStoredLocale,
  resolveLocale,
  showsStudentLanguageControl,
  practiceText,
  tr,
} = localeMod

const read = (rel: string) =>
  readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), 'utf8')

test('已儲存的 zh / en 先於瀏覽器；無效值不當成已選擇', () => {
  assert.equal(parseStoredLocale('en'), 'en')
  assert.equal(parseStoredLocale('zh'), 'zh')
  assert.equal(parseStoredLocale('EN'), null)
  assert.equal(parseStoredLocale('zh-HK'), null)
  assert.equal(parseStoredLocale(''), null)
  assert.equal(parseStoredLocale(null), null)
  assert.equal(resolveLocale('en', 'zh-HK'), 'en')
  assert.equal(resolveLocale('zh', 'en-GB'), 'zh')
  assert.equal(resolveLocale('nope', 'en-HK'), 'en')
  assert.equal(resolveLocale(null, 'fr-FR'), 'zh')
})

test('瀏覽器語言只看開頭是不是 en', () => {
  for (const lang of ['en', 'en-GB', 'en-HK', 'EN-us']) {
    assert.equal(localeFromBrowserLanguage(lang), 'en', lang)
  }
  for (const lang of ['zh-HK', 'zh-TW', 'yue', 'fr', '', undefined]) {
    assert.equal(localeFromBrowserLanguage(lang), 'zh', String(lang))
  }
})

test('考卷語言不跟介面：數學用原文，英文科用英文欄', () => {
  assert.equal(localeMod.paperText('math', '化簡', 'Simplify'), '化簡')
  assert.equal(localeMod.paperText('english', '中文題幹', 'Which register fits?'), 'Which register fits?')
  assert.equal(localeMod.paperText('english', '只有原文', ''), '只有原文')
  assert.equal(localeMod.paperText('chinese', '文言', 'classical'), '文言')
  assert.equal(localeMod.isEnglishPaperSubject('english-literature'), true)
  assert.equal(localeMod.isEnglishPaperSubject('math'), false)
})

test('練習題跟隨語言；譯文缺漏時回落原文，英文卷仍保留原題', () => {
  assert.equal(practiceText('math', '求解', 'Find the value', 'en'), 'Find the value')
  assert.equal(practiceText('math', '求解', 'Find the value', 'zh'), '求解')
  assert.equal(practiceText('math', '求解', '  ', 'en'), '求解')
  assert.equal(practiceText('english', '中文翻譯', 'Original English', 'zh'), 'Original English')
  assert.equal(practiceText('english', '中文翻譯', 'Original English', 'en'), 'Original English')
})

test('tr：英文缺漏回落到中文，兩邊皆空白才是空字串', () => {
  assert.equal(tr('中文', 'English', 'en'), 'English')
  assert.equal(tr('中文', 'English', 'zh'), '中文')
  assert.equal(tr('中文', '', 'en'), '中文')
  assert.equal(tr('中文', '   ', 'en'), '中文')
  assert.equal(tr('中文', null, 'en'), '中文')
  assert.equal(tr('', 'English', 'zh'), 'English')
  assert.equal(tr('  ', '', 'en'), '')
})

test('朗讀文案：英文與中文，呼叫前的空字串由元件負責', () => {
  assert.equal(interfaceLanguageAnnouncement('en'), 'Interface language: English')
  assert.equal(interfaceLanguageAnnouncement('zh'), '介面語言：中文')
})

test('創辦人與管理頁不顯示學生語言按鈕；練習頁不加整頁上內距', () => {
  assert.equal(showsStudentLanguageControl('/'), true)
  assert.equal(showsStudentLanguageControl('/practice'), true)
  assert.equal(showsStudentLanguageControl('/relax/breathing'), true)
  assert.equal(showsStudentLanguageControl('/founder'), false)
  assert.equal(showsStudentLanguageControl('/founder/ops'), false)
  assert.equal(showsStudentLanguageControl('/admin'), false)
  assert.equal(showsStudentLanguageControl('/admin/quality'), false)
  assert.equal(showsStudentLanguageControl(null), false)
  assert.equal(immersiveLanguageOffset('/practice'), false)
  assert.equal(immersiveLanguageOffset('/relax'), true)
  assert.equal(immersiveLanguageOffset('/paper-warrior'), true)
  assert.equal(immersiveLanguageOffset('/answer-sheet'), true)
  assert.equal(immersiveLanguageOffset('/founder'), false)
  assert.equal(immersiveLanguageOffset('/'), false)
})

test('掛載時不寫入 localStorage；只有 setLocale / toggle 會寫', () => {
  const src = read('lib/i18n.tsx').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
  assert.match(src, /useState<Locale>\('zh'\)/)
  assert.match(src, /useState\(''\)/)
  const mount = src.match(/useEffect\(\(\) => \{([\s\S]*?)\}, \[\]\)/)
  assert.ok(mount, '找不到只跑一次的掛載 effect')
  assert.match(mount[1], /resolveLocale\(/)
  assert.match(mount[1], /navigator\.language/)
  assert.doesNotMatch(mount[1], /setItem/)
  assert.match(src, /function writeStored\(next: Locale\)/)
  assert.match(src, /localStorage\.setItem\(LOCALE_STORAGE_KEY, next\)/)
  assert.match(src, /if \(!userActed\.current\) return/)
  assert.match(src, /aria-live="polite"/)
  assert.doesNotMatch(src, /Interface language: English/)
})

test('語言按鈕寫出將要切換去的語言，而且是真正的 button', () => {
  const src = read('components/LanguageToggle.tsx')
  assert.match(src, /type="button"/)
  assert.match(src, /locale === 'zh' \? 'English' : '中文'/)
  assert.match(src, /min-h-11/)
  assert.match(src, /shrink-0/)
  assert.match(src, /compactLabel = locale === 'zh' \? 'EN' : '中文'/)
  assert.match(src, /語言 \/ Language：切換介面至 English（英文）/)
  assert.match(src, /Language \/ 語言: switch interface to 中文（Chinese）/)
})

test('右上角按鈕在選單之外，導覽列留出空位', () => {
  const shell = read('components/AppShell.tsx')
  const nav = read('components/Navbar.tsx')
  assert.match(shell, /fixed right-3 top-2\.5 z-\[110\]/)
  assert.match(shell, /showsStudentLanguageControl/)
  assert.match(nav, /languageGutter \? 'pr-28 sm:pr-40 xl:pr-64'/)
  assert.doesNotMatch(nav, /<LanguageToggle/)
  const menuAt = nav.indexOf('id="site-menu"')
  assert.ok(menuAt > 0)
  assert.equal(nav.slice(menuAt).includes('Language'), false)
})

test('練習頂欄在語言按鈕下方開始，避免蓋住題幹', () => {
  const session = read('app/practice/PracticeSession.tsx')
  const sticky = session.slice(session.indexOf('practice-sticky-head'), session.indexOf('practice-sticky-head') + 220)
  assert.match(sticky, /pt-14/)
  assert.match(session, /practiceText\(subjectId, currentQ\.content, currentQ\.contentEn, locale\)/)
  assert.match(session, /practiceText\(subjectId, opt\.zh, opt\.en, locale\)/)
  assert.match(session, /practiceText\(subjectId, currentQ\.explanation, currentQ\.explanationEn, locale\)/)
  assert.match(session, /locale === 'en' && currentQ\.stepsEn\?\.length/)
  assert.doesNotMatch(session, /paperText\(subjectId, currentQ\.content/)
  assert.doesNotMatch(session, /tr\(currentQ\.content/)
  assert.doesNotMatch(session, /tr\(opt\.zh, opt\.en\)/)
  const textCard = read('components/TextQuestionCard.tsx')
  const longCard = read('components/LongQuestionCard.tsx')
  assert.match(textCard, /practiceText\(q\.subject, q\.content, q\.contentEn, locale\)/)
  assert.match(longCard, /practiceText\(q\.subject, q\.content, q\.contentEn, locale\)/)
  const long = read('app/practice/LongPracticeSession.tsx')
  assert.match(long, /pt-14/)
  assert.match(read('components/founder/FounderShell.tsx'), /^(?![\s\S]*LanguageToggle)/)
})
