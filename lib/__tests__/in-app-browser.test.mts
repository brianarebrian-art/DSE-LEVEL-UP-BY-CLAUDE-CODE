// ============================================================================
// in-app-browser.test.mts —— 登入頁必須提示內置瀏覽器改用系統瀏覽器
// （InAppBrowserNotice 元件已刪；改為 sign-in／sign-up 純文案）
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const signIn = readFileSync(join(ROOT, 'app/(auth)/sign-in/SignInPageClient.tsx'), 'utf8')
const signUp = readFileSync(join(ROOT, 'app/(auth)/sign-up/SignUpPageClient.tsx'), 'utf8')

test('登入／註冊頁提示 Instagram／Facebook／WeChat／LINE 改用系統瀏覽器', () => {
  for (const [name, src] of [['sign-in', signIn], ['sign-up', signUp]] as const) {
    assert.match(src, /Instagram/, name)
    assert.match(src, /WeChat|LINE/, name)
    assert.match(src, /Safari|Chrome|系統瀏覽器/, name)
  }
})

test('提示唔可以暗示「唔登入就用唔到」', () => {
  assert.match(signIn, /未登入|without signing in|practice/i)
  assert.doesNotMatch(signIn, /必須登入先可以用|must sign in to practise/i)
})

test('舊 InAppBrowserNotice 元件已拆除', () => {
  assert.throws(() => readFileSync(join(ROOT, 'components/InAppBrowserNotice.tsx'), 'utf8'))
})
