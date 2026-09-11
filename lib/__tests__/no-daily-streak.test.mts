// ============================================================================
// no-daily-streak.test.mts —— 禁止「連續日數」同歸零設計
// ----------------------------------------------------------------------------
// 2026-09-11 目標書列為完成標準：「代碼庫維持無懲罰 Streak 機制」。
//
// ══ 要分辨兩種完全唔同嘅 streak ══
// ✅ 准許：一節之內嘅【連續答對】（combo）——「答啱咗 3 條」。
//    憲章 §8.1（2026-08-22 解禁）明文准許連擊。答錯只係由 3 變返 0，
//    而嗰 3 條本來就係今次先儲落嚟，冇任何已累積嘅嘢被抹走。
//
// ⛔ 禁止：跨日嘅【連續日數】—— 「你已經連續 7 日」。
//    問題唔喺個火焰符號，喺【中斷一日即歸零】：學生唞一日，畫面就把
//    過往累積一次抹掉，等同宣告「之前嘅努力白費」。
//    lib/progress.ts:189 已明文記錄呢個決定，並以 computeRecentActiveDays
//    （30 日窗口計數）取代 —— 唞一日只會令個數字少一，唔會清零。
//
// 呢批測試守住嗰條界線。冇佢嘅話，下一個做「留存」嘅人好自然會加返
// 一個連續打卡 —— 業界標準做法，而且喺呢個 codebase 入面睇落同 combo
// 好似係同一類嘢。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/** 剝走註釋 —— 講「我哋唔做連續打卡」嘅註釋唔可以當成違規。實際踩過。 */
const strip = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

function sources(): { path: string; code: string }[] {
  const out: { path: string; code: string }[] = []
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === '__tests__' || e.name === 'node_modules' || e.name.startsWith('.')) continue
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p)
      else if (/\.tsx?$/.test(e.name)) out.push({ path: p, code: strip(readFileSync(p, 'utf8')) })
    }
  }
  walk('app'); walk('components'); walk('lib')
  return out
}
const SRC = sources()

// ── ① 冇跨日連續計數 ──────────────────────────────────────────────────────
test('冇任何地方計「連續日數」', () => {
  // 分兩類掃，因為兩類嘅可靠程度差好遠：
  //
  // ① 識別符 —— 呢啲係【邏輯】。跨日 streak 一定要有個地方存住「連咗幾多日」，
  //    而嗰個變數幾乎一定係下列其中一個名。呢類命中係硬失敗。
  // ② 中文文案 —— 呢啲係【散文】，而散文可以否定自己。
  //    components/GoodTodayCard.tsx 就寫住「唔記連續日數，唔計次數」——
  //    佢係喺度講明【冇】呢個功能，唔可以當成違規。
  //    所以文案只喺【冇被否定】嘅情況下先算命中。
  //
  // ⚠️ ② 係啟發式，唔可靠；真正守得住嘅係 ①。若日後有人用另一個變數名
  //    砌跨日 streak，補返個名入去，唔好靠中文文案捉。
  const IDENTIFIERS = [/consecutiveDays/i, /streakDays/i, /dayStreak/i, /daily[_-]?streak/i]
  const PHRASES = [/連續\s*\d*\s*日/, /連續打卡/, /連續登入/]
  const NEGATION = /[唔不無冇沒]|\bno\b|\bnever\b/i

  const hits: string[] = []
  for (const { path, code } of SRC) {
    for (const re of IDENTIFIERS) {
      const m = re.exec(code)
      if (m) hits.push(`${path} → ${m[0]}（識別符）`)
    }
    for (const re of PHRASES) {
      for (const m of code.matchAll(new RegExp(re.source, re.flags + 'g'))) {
        const before = code.slice(Math.max(0, m.index! - 14), m.index!)
        if (!NEGATION.test(before)) hits.push(`${path} → ${m[0]}（文案，前文冇否定）`)
      }
    }
  }
  assert.deepEqual(hits, [], `揾到跨日連續計數：\n${hits.join('\n')}\n` +
    '中斷一日即歸零＝宣告「之前嘅努力白費」（lib/progress.ts:189）。' +
    '要習慣回饋請用 computeRecentActiveDays 嘅窗口計數。')
})

// ── ② 窗口計數仲喺度 ──────────────────────────────────────────────────────
//
// 唔可以淨係禁止連續計數 —— 連替代品都冇咗嘅話，下一個人只會再加返連續計數。
test('30 日窗口計數仍然存在，並且係唔會清零嗰種', async () => {
  const progress = readFileSync('lib/progress.ts', 'utf8')
  assert.match(progress, /computeRecentActiveDays/, '窗口計數唔見咗')
  assert.match(progress, /RECENT_WINDOW_DAYS/, '窗口長度應該係具名常數')

  const { computeStats, RECENT_WINDOW_DAYS } = await import('../progress.ts')
  assert.ok(RECENT_WINDOW_DAYS >= 7, `窗口 ${RECENT_WINDOW_DAYS} 日太短，接近連續計數`)

  // 中間隔一日，窗口計數唔可以歸零 —— 呢個就係同連續計數最大嘅分別。
  const day = 86_400_000
  const now = Date.now()
  const mk = (ts: number) => ({
    subjectId: 's', subjectName: 's', topicFilter: null, score: 5, total: 10,
    grade: '3', topicResults: [{ topic: 't', correct: 5, total: 10 }], elapsed: 60, timestamp: ts,
  })
  const stats = computeStats([mk(now - 3 * day), mk(now - day)] as never) // 中間斷咗一日
  assert.equal(stats.recentActiveDays, 2,
    '斷咗一日之後仍然應該係 2 —— 若變成 1 或 0，代表有人改成咗連續計數')
})

// ── ③ 一節之內嘅連擊維持准許 ──────────────────────────────────────────────
//
// 反向守護：呢條測試唔係要剷走所有 streak 字眼。憲章 §8.1 准許連擊，
// 若日後有人為咗「合規」而把 combo 一併剷走，呢條會紅。
test('一節之內嘅連擊（combo）仍然存在 —— §8.1 准許', () => {
  const ps = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  assert.match(strip(ps), /advanceStreak\(/,
    '一節之內嘅連擊被剷走咗。§8.1 明文准許連擊 —— 要剷需要另行簽名')
})

// ── ④ 兩個無壓鉤子仲喺度 ──────────────────────────────────────────────────
//
// 目標書：「全面依靠 /result 『聽日有嘢等你』卡片與 JustOneCard 微目標導流」。
// 佢哋係連續打卡嘅替代品 —— 替代品冇咗，壓力就會由後門返嚟。
test('JustOneCard 同「聽日有嘢等你」兩個鉤子都接咗線', () => {
  const just = readFileSync('components/JustOneCard.tsx', 'utf8')
  assert.match(just, /今日只做 1 題都得|Just one question/,
    'JustOneCard 嘅文案變咗 —— 門檻唔可以由「1 題」升做「1 節」')

  const dash = readFileSync('app/dashboard/DashboardPageClient.tsx', 'utf8')
  assert.match(strip(dash), /JustOneCard/, 'JustOneCard 冇接入 /dashboard')

  const result = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  assert.match(strip(result), /TomorrowStrip/, '「聽日有嘢等你」冇接入 /result')
  assert.match(strip(result), /upcomingReviews/, '/result 冇叫 upcomingReviews')
})
