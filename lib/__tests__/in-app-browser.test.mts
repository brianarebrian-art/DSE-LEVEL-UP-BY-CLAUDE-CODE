// ============================================================================
// in-app-browser.test.mts —— App 內置瀏覽器判斷
// ----------------------------------------------------------------------------
// 誤判成本【唔對稱】，所以正反兩面都要測：
//   漏判 → 學生喺 IG 入面撳登入，見到 Google 一版錯誤頁，唔知要換瀏覽器，走咗
//   誤判 → 學生喺正常 Safari 度見到「你登入唔到」，一樣走 —— 而佢本來冇事
// 所以規則只列【確定封 Google OAuth 嘅 embedded webview】，唔用「係咪 webview」
// 呢類寬鬆判斷。下面啲 UA 全部係真實字串。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(join(ROOT, 'components/InAppBrowserNotice.tsx'), 'utf8')

// 由組件抽返條 regex —— 抄一份落測試就會分叉，改咗組件而測試照綠。
const m = src.match(/const IN_APP = (\/.+\/i)\n/)
assert.ok(m, '搵唔到 IN_APP regex —— 改咗名就要同步改呢條測試')
const IN_APP = eval(m[1]) as RegExp

const BLOCKED: [string, string][] = [
  ['Instagram', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 335.0.0.32.92'],
  ['Facebook iOS', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 [FBAN/FBIOS;FBAV/468.0.0.47.107]'],
  ['Facebook Android', 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/468.0.0.32.107;]'],
  ['Threads', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Threads 335.0.0.32.92'],
  ['WeChat', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 MicroMessenger/8.0.49(0x18003128) NetType/WIFI'],
  ['LINE', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Line/14.6.0'],
]

const OK: [string, string][] = [
  ['iOS Safari', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'],
  ['Android Chrome', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'],
  ['Desktop Chrome', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'],
  ['iOS Chrome', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1'],
  ['iOS Firefox', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 FxiOS/126.0 Mobile/15E148 Safari/605.1.15'],
  ['Edge', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0'],
]

test('封 Google OAuth 嘅 App 內置瀏覽器要捉到', () => {
  for (const [name, ua] of BLOCKED) assert.ok(IN_APP.test(ua), `${name} 應該捉到`)
})

test('正常瀏覽器唔可以誤判 —— 誤判等於趕走一個本來登入得到嘅學生', () => {
  for (const [name, ua] of OK) assert.ok(!IN_APP.test(ua), `${name} 唔應該捉到（誤判）`)
})

test('提示唔可以講到「唔登入就用唔到」—— 唔登入係做得題嘅', () => {
  assert.ok(/唔登入都做得題|practice works without an account/.test(src),
    '提示要講明唔登入一樣做得題，否則會嚇走一個本來可以繼續用嘅學生')
})
