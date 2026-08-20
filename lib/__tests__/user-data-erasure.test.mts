import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// 刪除權（PDPO 查閱／改正／刪除）嘅回歸測試。
//
// ══ 點解需要 ══
// 「你可以刪除自己嘅資料」係一句我哋要守得住嘅承諾。但守唔守得住，取決於一件
// 唔會喺同一個 PR 出現嘅事：有人加咗一張帶 user_id 嘅新表。刪除路由喺另一個檔，
// 冇人會為咗一張新表而去 review 佢。
//
// 2026-08-20 實測：路由當時只刪 user_progress + profiles，而 user_settings 有 114
// 行、wall_posts 有 1 行帶住 user_id 冇刪。呢個測試就係要令同一件事唔可以再發生。

// ⚠️ 讀原始碼而唔係 import —— 原因見 privacy-page.test.mts 同一段註解
// （npm test 釘死 tsx@4.19.2，做唔到 .ts 具名 ESM import）。
const REGISTRY = 'lib/privacy/userData.ts'
const MIG_DIR = 'supabase/migrations'

const registrySrc = () => fs.readFileSync(REGISTRY, 'utf8')

const USER_SCOPED_TABLES: string[] = (() => {
  const m = /export const USER_SCOPED_TABLES\s*=\s*\[([\s\S]*?)\] as const/.exec(registrySrc())
  assert.ok(m, '搵唔到 USER_SCOPED_TABLES')
  return [...m![1].matchAll(/'([^']+)'/g)].map((x) => x[1])
})()

const NOT_USER_SCOPED: { table: string; why: string }[] = (() => {
  const m = /export const NOT_USER_SCOPED\s*=\s*\[([\s\S]*?)\] as const/.exec(registrySrc())
  assert.ok(m, '搵唔到 NOT_USER_SCOPED')
  return [...m![1].matchAll(/table:\s*'([^']+)'[\s\S]*?why:\s*([\s\S]*?),\n\s*\}/g)].map((x) => ({
    table: x[1],
    why: x[2],
  }))
})()

/** 由 migrations 推算「而家仲存在、而且帶 user_id」嘅表。 */
function tablesFromMigrations(): Set<string> {
  const files = fs.readdirSync(MIG_DIR).filter((f) => f.endsWith('.sql')).sort()
  const live = new Set<string>()
  for (const f of files) {
    const sql = fs.readFileSync(path.join(MIG_DIR, f), 'utf8')

    // CREATE TABLE [IF NOT EXISTS] [public.]name ( … )  —— 只收帶 user_id 欄嗰啲。
    const createRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_][a-z0-9_]*)\s*\(([\s\S]*?)\n\s*\);/gi
    let m: RegExpExecArray | null
    while ((m = createRe.exec(sql))) {
      const [, name, body] = m
      if (/\buser_id\b/.test(body)) live.add(name)
    }

    // DROP TABLE [IF EXISTS] [public.]name;
    const dropRe = /drop\s+table\s+(?:if\s+exists\s+)?(?:public\.)?([a-z_][a-z0-9_]*)/gi
    while ((m = dropRe.exec(sql))) live.delete(m[1])
  }
  return live
}

test('每張 migration 建過、帶 user_id、又未 drop 嘅表，都喺刪除清單入面', () => {
  const fromMigrations = [...tablesFromMigrations()].sort()
  const covered = new Set<string>([...USER_SCOPED_TABLES, ...NOT_USER_SCOPED.map((n) => n.table)])
  const missing = fromMigrations.filter((t) => !covered.has(t))
  assert.deepEqual(
    missing,
    [],
    `以下表帶 user_id 但唔喺 lib/privacy/userData.ts：\n  ${missing.join('\n  ')}\n` +
      '加落 USER_SCOPED_TABLES（刪帳號要清走），或者加落 NOT_USER_SCOPED 並寫明理由。' +
      '唔處理嘅話，/privacy 講「你可以刪除自己嘅資料」就係假嘅。',
  )
})

test('兩張早於 migrations 就存在嘅表必須列明', () => {
  // user_progress 同 profiles 唔係由呢個資料夾任何一個 migration 建 —— 佢哋喺
  // Supabase 直接開，所以上面嗰條掃唔到。呢度硬性要求佢哋喺清單，避免將來有人
  // 「因為測試冇紅」而以為佢哋唔存在。
  for (const t of ['user_progress', 'profiles']) {
    assert.ok(
      USER_SCOPED_TABLES.includes(t),
      `${t} 帶 user_id 但唔喺 USER_SCOPED_TABLES —— 刪帳號會漏低佢`,
    )
  }
})

test('刪除路由真係由登記表驅動，唔係硬編表名', () => {
  const src = fs.readFileSync('app/api/account/delete/route.ts', 'utf8')
  assert.match(src, /USER_SCOPED_TABLES/, '刪除路由必須引用登記表')
  // 硬編 .from('某表') 會令登記表形同虛設。
  const hardcoded = [...src.matchAll(/\.from\(\s*'([a-z_]+)'/g)].map((m) => m[1])
  assert.deepEqual(hardcoded, [], `刪除路由仲有硬編表名：${hardcoded.join(', ')}`)
})

test('刪唔到嘢就唔可以回 ok', () => {
  const src = fs.readFileSync('app/api/account/delete/route.ts', 'utf8')
  assert.match(src, /failed\.length\s*>\s*0/, '必須偵測部分失敗')
  assert.match(src, /status:\s*500/, '部分失敗必須回非 200 —— 唔可以扮成功')
})

test('每個豁免都有實質理由', () => {
  for (const n of NOT_USER_SCOPED) {
    assert.ok(n.why.length > 25, `豁免 ${n.table} 欠實質理由`)
  }
})
