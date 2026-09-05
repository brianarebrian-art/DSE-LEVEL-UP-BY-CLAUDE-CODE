#!/usr/bin/env -S npx tsx
// ============================================================================
// sync-questions.mts —— 將 data/questions/*.ts 鏡像上 Supabase
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/sync-questions.mts            # dry-run，列出會改乜
//   npx tsx scripts/qbank/sync-questions.mts --push     # 真正寫入
//   npx tsx scripts/qbank/sync-questions.mts --check    # 只核對，有落差即 exit 1
//   npx tsx scripts/qbank/sync-questions.mts --push --subject chemistry
//
// ⚠️ 方向係【單向】：repo → 雲。反方向永不存在，亦唔准加。
//
// 點解：`data/questions/*.ts` 係唯一正本 —— 每一條題目點樣入庫，喺 git 入面
// 有 commit、有 diff、有 blame、有 decisions.json 實名簽署（憲章 §12）。
// Supabase 嗰邊只係一個【出貨用嘅衍生鏡像】，隨時可以由正本重建。
// 一旦容許反向（雲 → repo），改一行題目就會變成一個冇 diff、冇 blame、
// 冇人簽名嘅動作，而學生睇到嘅嘢已經變咗。所以呢個腳本冇 pull 模式，
// 亦唔應該有。要改題目，改 .ts 檔然後 commit，再跑一次呢個腳本。
//
// service key 只從 .env.local／環境變數讀，永不打印、永不寫檔（同
// pull-decisions.mjs 一致）。
// ============================================================================
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// 動態 import —— 同 builders/_archetype.mts 一樣嘅理由：index.ts 靠 `export *`
// 轉出，tsx 之下靜態 import 會拋 "does not provide an export named"。
const idx = await import(join(ROOT, 'data/questions/index.ts')) as {
  getSubjectQuestions: (id: string) => Record<string, unknown>[]
}

const SUBJECTS = [
  'math', 'm1', 'm2', 'physics', 'chemistry', 'biology', 'english', 'chinese', 'bafs', 'ict',
  'economics', 'csd', 'chinese-history', 'history', 'geography', 'chinese-literature',
  'english-literature', 'ethics-religious', 'ths', 'health-management', 'design-tech',
  'visual-arts', 'music', 'pe', 'technology-living',
]

const args = process.argv.slice(2)
const PUSH = args.includes('--push')
const CHECK = args.includes('--check')
const only = (() => { const i = args.indexOf('--subject'); return i >= 0 ? args[i + 1] : null })()
const targets = only ? SUBJECTS.filter((s) => s === only) : SUBJECTS
if (only && !targets.length) { console.error(`✗ unknown subject: ${only}`); process.exit(2) }

// ── env ─────────────────────────────────────────────────────────────────────
function envFromDotLocal(): Record<string, string> {
  const p = join(ROOT, '.env.local')
  const out: Record<string, string> = {}
  if (!existsSync(p)) return out
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}
const dot = envFromDotLocal()
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || dot.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || dot.SUPABASE_SERVICE_ROLE_KEY
if (!URL_ || !KEY) {
  console.error('✗ Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local)')
  process.exit(1)
}
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

// ── 版本號 ──────────────────────────────────────────────────────────────────
// 對【題目內容】取雜湊，而唔係對檔案 —— 註釋改動、檔案重排唔應該令全校學生
// 重新下載成科題目。題目按 id 排序之後先序列化，令雜湊唔受 loader 合併次序影響。
const versionOf = (qs: Record<string, unknown>[]): string =>
  createHash('sha256')
    .update(JSON.stringify([...qs].sort((a, b) => String(a.id).localeCompare(String(b.id)))))
    .digest('hex').slice(0, 16)

async function rest(path: string, init?: RequestInit) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { ...H, ...(init?.headers ?? {}) } })
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${(await r.text()).slice(0, 300)}`)
  return r
}

// 雲端現況：只攞版本表，唔使拉 26,000 行落嚟先知道使唔使更新。
const cloudVersions = new Map<string, { version: string; count: number }>()
{
  const r = await rest('question_bank_versions?select=subject,version,count')
  for (const row of await r.json() as { subject: string; version: string; count: number }[]) {
    cloudVersions.set(row.subject, { version: row.version, count: row.count })
  }
}

let drift = 0
const plan: { subject: string; qs: Record<string, unknown>[]; version: string; was: string }[] = []

console.log('科目                本地   雲端  狀態')
console.log('─'.repeat(52))
for (const s of targets) {
  const qs = idx.getSubjectQuestions(s)
  const version = versionOf(qs)
  const cloud = cloudVersions.get(s)
  const same = cloud?.version === version && cloud?.count === qs.length
  if (!same) { drift++; plan.push({ subject: s, qs, version, was: cloud?.version ?? '（未上雲）' }) }
  console.log(
    `${s.padEnd(19)} ${String(qs.length).padStart(4)}  ${String(cloud?.count ?? 0).padStart(5)}  `
    + (same ? '✓ 一致' : cloud ? `⚠ 有落差 ${cloud.version} → ${version}` : '＋ 未上雲'),
  )
}
console.log('─'.repeat(52))

if (CHECK) {
  if (drift) {
    console.error(`\n✗ ${drift} 科同雲端唔一致。跑 \`npx tsx scripts/qbank/sync-questions.mts --push\` 同步。`)
    process.exit(1)
  }
  console.log('\n✓ 25 科全部同雲端一致。')
  process.exit(0)
}

if (!drift) { console.log('\n✓ 冇嘢要同步。'); process.exit(0) }

if (!PUSH) {
  console.log(`\n${drift} 科要同步。加 --push 真正寫入。`)
  process.exit(0)
}

// ── 寫入 ────────────────────────────────────────────────────────────────────
// 逐科：先 upsert 所有題，再刪走【本科而唔再存在】嘅舊 id，最後更新版本號。
// 次序刻意係「先寫後刪最後標版本」—— 中途死咗，版本號仍然係舊嗰個，
// 下次跑會由頭嚟過；反過來先標版本就會留低一個「聲稱已同步但其實未」嘅狀態。
const CHUNK = 500
for (const { subject, qs, version } of plan) {
  const rows = qs.map((q) => ({
    id: q.id, subject, topic: q.topic, type: q.type ?? 'mc', difficulty: q.difficulty, data: q,
  }))
  for (let i = 0; i < rows.length; i += CHUNK) {
    await rest('questions?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows.slice(i, i + CHUNK)),
    })
    process.stdout.write(`\r  ${subject}: ${Math.min(i + CHUNK, rows.length)}/${rows.length}   `)
  }
  const live = new Set(rows.map((r) => r.id))
  const cur = await (await rest(`questions?subject=eq.${encodeURIComponent(subject)}&select=id`)).json() as { id: string }[]
  const stale = cur.map((r) => r.id).filter((id) => !live.has(id))
  if (stale.length) {
    for (let i = 0; i < stale.length; i += CHUNK) {
      const list = stale.slice(i, i + CHUNK).map((id) => `"${id}"`).join(',')
      await rest(`questions?id=in.(${encodeURIComponent(list)})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
    }
  }
  await rest('question_bank_versions?on_conflict=subject', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify([{ subject, version, count: rows.length, synced_at: new Date().toISOString() }]),
  })
  console.log(`\r  ✓ ${subject}: ${rows.length} 條${stale.length ? `（刪走 ${stale.length} 條舊題）` : ''}            `)
}
console.log(`\n✓ ${plan.length} 科已同步上 Supabase。`)
