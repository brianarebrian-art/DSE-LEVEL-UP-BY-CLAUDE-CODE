// Agentic Harness v5 · Phase 3 — Evaluator（守門引擎，純函式、$0）
//
// 職責：對「單一題目草稿」做硬驗證，裁決 PASS / REVISE / BLOCK。
//   - PASS   ：可進入【人工評審隊列】（寫 drafts/），唔代表自動發布。
//   - REVISE ：可修（退回 Generator 重寫）。
//   - BLOCK  ：觸紅線，絕不可發布。
//
// ⚠️ 維護同步（#8，誠實 flag）：下面嘅術語／語域／科目常數紅線，係【鏡射】
//    scripts/qbank/term-guard.mjs（CI 全庫掃描）嘅同一套規則，只係改成「逐題」版
//    俾 agent 側用。兩處必須同步——term-guard.mjs 係 source of truth；改咗嗰邊，
//    呢度要跟。理想日後抽成共用 JSON 規則檔，但而家係兩份，屬已知維護面。
//
// 情緒紅線（§4）：裁決字眼永不面向學生。REVISE/BLOCK 只係內部狀態。

import type { MCQuestion } from '@/data/questions/types'

export type MCDraft = Pick<
  MCQuestion,
  'subject' | 'topic' | 'difficulty' | 'content' | 'options' | 'correctIndex' | 'explanation'
> &
  Partial<MCQuestion>

export type Verdict = 'PASS' | 'REVISE' | 'BLOCK'
export type Severity = 'critical' | 'major' | 'minor'

export interface Check {
  name: string
  passed: boolean
  severity: Severity
  message: string
}

export interface EvaluationResult {
  verdict: Verdict
  score: number // 0–100（通過檢查比例）
  checks: Check[]
  feedback: string // 俾 Generator 嘅重寫指引（唔面向學生）
}

// ── 紅線（鏡射 term-guard.mjs）───────────────────────────────────────────────
const BANNED_GLOBAL: { re: RegExp; fix: string }[] = [
  { re: /公共財/, fix: 'Public Good 一律「共用品」（禁「公共財」）' },
  { re: /企業家才能/, fix: 'Entrepreneurship 一律「企業家職能」（禁「企業家才能」）' },
  { re: /期會成本/, fix: '手民之誤，應為「機會成本」' },
]
const BANNED_ECON: { re: RegExp; fix: string }[] = [
  { re: /收入(需求)?彈性|income[ -]?elasticity/i, fix: '收入彈性不在 DSE 經濟課綱，刪' },
  { re: /交叉彈性|cross[ -]?(price )?elasticity/i, fix: '交叉彈性不在 DSE 經濟課綱，刪' },
  { re: /點彈性|point elasticity/i, fix: '點彈性不在 DSE 經濟課綱，刪' },
]
// 非語文科（chinese*/english* 除外）嘅學術內容須標準書面語
const COLLOQUIAL =
  /[嘅噉冇嘢咗唔喺睇啲乜諗畀嗰嘥攞]|咁樣|點樣|而家|依家|好似|邊個|秒殺/
const BANNED_PHYSICS = /9\.8\d*\s*(m\s*\/?\s*s|N\s*\/?\s*kg|ms⁻²|米每秒)/i // DSE g = 10
const BANNED_CHEMISTRY = /22\.4\s*(dm|L\b|升|立方分米)/i // DSE RTP 摩爾體積 24 dm³/mol
// 版權：疑似直錄官方卷嘅訊號（保守；真正把關係人手審 + Archetype Masking）
const COPYRIGHT_SIGNAL = /HKEAA|考評局|歷屆試題|past\s*paper|marking\s*scheme/i
// 解析引內容不引字母：避免「選項 A 正確」呢類（洗牌後字母無意義）
const CITES_LETTER = /(選項|option)\s*[A-Da-d]\b|\b[A-D]\s*(項|係啱|正確|is correct)/

function scan(text: string, subject: string): Check[] {
  const out: Check[] = []
  const isLang = /^(chinese|english)/i.test(subject)

  for (const b of BANNED_GLOBAL) {
    if (b.re.test(text)) out.push({ name: 'term:global', passed: false, severity: 'critical', message: b.fix })
  }
  if (/^econ/i.test(subject)) {
    for (const b of BANNED_ECON) {
      if (b.re.test(text)) out.push({ name: 'term:econ-syllabus', passed: false, severity: 'critical', message: b.fix })
    }
  }
  if (!isLang && COLLOQUIAL.test(text)) {
    out.push({ name: 'register:colloquial', passed: false, severity: 'major', message: '學術內容須標準書面語，發現港式口語標記' })
  }
  if (/^phys/i.test(subject) && BANNED_PHYSICS.test(text)) {
    out.push({ name: 'const:physics-g', passed: false, severity: 'major', message: 'DSE 慣例 g = 10 m/s²；9.8/9.81 掛單位出現即違規' })
  }
  if (/^chem/i.test(subject) && BANNED_CHEMISTRY.test(text)) {
    out.push({ name: 'const:chem-molar', passed: false, severity: 'major', message: 'DSE RTP 摩爾體積 24 dm³/mol；22.4 係 STP 值' })
  }
  if (COPYRIGHT_SIGNAL.test(text)) {
    out.push({ name: 'copyright:signal', passed: false, severity: 'critical', message: '疑似直錄官方卷訊號；必須原創平行改寫（Archetype Masking）' })
  }
  return out
}

export function evaluateQuestion(d: MCDraft): EvaluationResult {
  const checks: Check[] = []
  const body = `${d.content ?? ''}\n${d.explanation ?? ''}\n${(d.options ?? []).join('\n')}`

  // 1) 紅線掃描（content + explanation + options）
  checks.push(...scan(body, d.subject))

  // 2) 格式：correctIndex 合法
  const nOpt = Array.isArray(d.options) ? d.options.length : 0
  checks.push({
    name: 'format:correctIndex',
    passed: nOpt >= 2 && Number.isInteger(d.correctIndex) && d.correctIndex >= 0 && d.correctIndex < nOpt,
    severity: 'critical',
    message: `correctIndex 必須 0..${Math.max(0, nOpt - 1)} 的整數（現為 ${String(d.correctIndex)}，選項 ${nOpt} 個）`,
  })

  // 3) 格式：MC 建議 4 個選項
  checks.push({
    name: 'format:options',
    passed: nOpt === 4,
    severity: 'minor',
    message: nOpt === 4 ? 'OK' : `DSE MC 慣例 4 個選項（現為 ${nOpt}）`,
  })

  // 4) 解析不引字母（洗牌後字母無意義）
  checks.push({
    name: 'explanation:no-letter',
    passed: !CITES_LETTER.test(d.explanation ?? ''),
    severity: 'major',
    message: '解析不可引選項字母（A/B/C/D）；改為引「內容」',
  })

  // 5) 解析深度（過短即退回）
  const expOk = (d.explanation ?? '').trim().length >= 40
  checks.push({
    name: 'explanation:depth',
    passed: expOk,
    severity: 'major',
    message: expOk ? 'OK' : '解析過於簡略（<40 字），須具體步驟／理據',
  })

  // 6) 雙語齊備（平台雙語；缺英文＝可修，非致命）
  const bilingual = !!d.contentEn && Array.isArray(d.optionsEn) && d.optionsEn.length === nOpt && !!d.explanationEn
  checks.push({
    name: 'i18n:bilingual',
    passed: bilingual,
    severity: 'minor',
    message: bilingual ? 'OK' : '建議補齊 contentEn/optionsEn/explanationEn（雙語對照）',
  })

  // ── 裁決 ──
  const failed = checks.filter((c) => !c.passed)
  const hasCritical = failed.some((c) => c.severity === 'critical')
  const hasMajor = failed.some((c) => c.severity === 'major')
  const verdict: Verdict = hasCritical ? 'BLOCK' : hasMajor ? 'REVISE' : 'PASS'
  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100)

  return { verdict, score, checks, feedback: buildFeedback(failed) }
}

function buildFeedback(failed: Check[]): string {
  if (failed.length === 0) return 'All checks passed. 可入 drafts 等人工評審（非自動發布）。'
  return failed.map((f) => `[${f.severity.toUpperCase()}] ${f.name}: ${f.message}`).join('\n')
}
