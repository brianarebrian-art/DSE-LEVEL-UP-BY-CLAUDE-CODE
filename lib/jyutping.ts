// 粵拼結構驗證 —— 逐個音節對返粵拼方案嘅封閉集合。
//
// ══ 呢個檢查證明到乜、證明唔到乜 ══
// 粵拼（Jyutping，香港語言學學會 1993）嘅聲母同韻母係【有限而且封閉】嘅：
// 19 個聲母、約 60 個韻母、6 個聲調。所以「呢串字母係咪一個合法粵拼音節」
// 係一條機器答得到嘅問題。
//
//   ✅ 證明到：`sou1` 係合法音節、`sou9` 唔合法（冇第 9 聲）、
//              `srou1` 唔合法（冇 sr- 聲母）、`soung1` 唔合法（冇 -oung 韻母）
//   ❌ 證明唔到：「插蘇」讀 caap3 sou1 定 caap3 sou2 —— 兩個都係合法音節，
//              邊個先係正確讀音，呢個檢查一個字都答唔到
//
// ⚠️ 憲章 §16.D：呢個係 build-time 測試，唔係 runtime 防護，亦【唔係】
//    一個讀音正確性保證。描述佢嘅時候唔可以講成「粵拼已驗證」——
//    只可以講「每個音節都係結構上合法嘅粵拼」。呢兩句唔同意思。
//
// 舊做法係留白 `REVIEW.reviewer` 等真人簽名。2026-09-19 Yuna 裁決改為由
// Claude Code 負責校對並即時出街 —— 所以「有冇人簽過名」呢個閘冇咗，
// 取而代之嘅係呢個【跑得到、重跑得到、會令 npm test 紅】嘅結構檢查。
// 一個講得出自己查咗乜嘅檢查，好過一個講唔出自己查咗乜嘅簽名。

/** 19 個聲母。空聲母（零聲母）用 '' 表示，唔喺呢張表。 */
export const INITIALS = [
  'b', 'p', 'm', 'f',
  'd', 't', 'n', 'l',
  'g', 'k', 'ng', 'h',
  'gw', 'kw', 'w',
  'z', 'c', 's', 'j',
] as const

/**
 * 韻母。包括兩個成音節鼻音（m、ng）—— 「唔」m4、「五」ng5 就係得一個鼻音
 * 冇元音，係粵語有而普通話冇嘅嘢。
 */
export const FINALS = [
  // aa 系
  'aa', 'aai', 'aau', 'aam', 'aan', 'aang', 'aap', 'aat', 'aak',
  // a 系（短 a，冇單獨嘅 'a'）
  'ai', 'au', 'am', 'an', 'ang', 'ap', 'at', 'ak',
  // e 系
  'e', 'ei', 'eu', 'em', 'en', 'eng', 'ep', 'et', 'ek',
  // i 系
  'i', 'iu', 'im', 'in', 'ing', 'ip', 'it', 'ik',
  // o 系
  'o', 'oi', 'ou', 'on', 'ong', 'ot', 'ok',
  // u 系
  'u', 'ui', 'un', 'ung', 'ut', 'uk',
  // oe / eo 系
  'oe', 'oeng', 'oet', 'oek', 'eoi', 'eon', 'eot',
  // yu 系
  'yu', 'yun', 'yut',
  // 成音節鼻音
  'm', 'ng',
] as const

const INITIAL_SET: readonly string[] = INITIALS
const FINAL_SET: readonly string[] = FINALS

/** 聲母由長到短排 —— 唔排嘅話 `gw` 會先被切成 `g`，剩低 `waa` 當韻母。 */
const SORTED_INITIALS = [...INITIALS].sort((a, b) => b.length - a.length)

export interface SyllableProblem {
  syllable: string
  reason: string
}

/**
 * 驗一個音節。回 `null` = 合法；否則回失敗原因。
 *
 * ⚠️ 成音節鼻音（m、ng）唔可以帶聲母 —— `bm4` 唔係粵語音節。
 *    下面拆聲母嗰步會令 `ng5` 被讀成「聲母 ng ＋ 空韻母」，所以要特別處理。
 */
export function checkSyllable(raw: string): SyllableProblem | null {
  const syl = raw.trim()
  if (!syl) return { syllable: raw, reason: '空白' }

  const m = /^([a-z]+)([1-6])$/.exec(syl)
  if (!m) {
    return /[1-6]$/.test(syl)
      ? { syllable: raw, reason: '聲調之前有唔係細階英文字母嘅字元' }
      : { syllable: raw, reason: '冇聲調數字（粵語六個聲調全靠佢分）' }
  }
  const [, letters] = m

  // 成音節鼻音：整個音節就係韻母本身
  if (letters === 'm' || letters === 'ng') return null

  for (const ini of SORTED_INITIALS) {
    if (!letters.startsWith(ini)) continue
    const fin = letters.slice(ini.length)
    // ⚠️ 成音節鼻音唔可以帶聲母。`bm4`＝聲母 b ＋ 韻母 m —— 兩橛各自都喺表
    //    入面，所以天真咁拆就會放行，但粵語根本冇呢個音節。
    //    檔頭早就寫咗呢一點，而第一版實作只處理咗「淨係 m4」嗰種，
    //    「聲母＋鼻音」走漏咗 —— 係反向自測捉返嘅，唔係諗返起。
    if (fin === 'm' || fin === 'ng') continue
    if (fin && FINAL_SET.includes(fin)) return null
  }
  // 零聲母
  if (FINAL_SET.includes(letters)) return null

  // 講清楚係聲母定韻母出事，唔好淨係話「唔合法」
  const ini = SORTED_INITIALS.find((i) => letters.startsWith(i))
  if (ini) {
    const fin = letters.slice(ini.length)
    return {
      syllable: raw,
      reason: fin
        ? `聲母「${ini}」之後嘅「${fin}」唔係粵拼韻母`
        : `「${ini}」淨係一個聲母，冇韻母`,
    }
  }
  return { syllable: raw, reason: `「${letters}」開頭唔係任何粵拼聲母，亦唔係韻母` }
}

/**
 * 驗一串粵拼（音節之間空格分開，可以帶標點）。
 *
 * ⚠️ 標點要剝走先驗：啲句而家係完整句，粵拼會跟返廣東話帶逗號同問號
 *    （`zou2 san4, ngo5 hai6…`），唔剝就會將「san4,」報成錯。
 *    只剝 , ? ! ／ 四款 —— 剝得多就等於個閘鬆咗。
 */
export function checkJyutping(line: string): SyllableProblem[] {
  const out: SyllableProblem[] = []
  for (const raw of line.split(/\s+/)) {
    const syl = raw.replace(/^[,?!/]+|[,?!/]+$/g, '')
    if (!syl) continue
    const bad = checkSyllable(syl)
    if (bad) out.push(bad)
  }
  return out
}

/** 六個聲調嘅名同例字 —— /cantonese/learn 嘅聲調表由呢度出，唔另寫一份。 */
export const TONES = [
  { n: 1, nameZh: '高平', nameEn: 'high level', example: '分', jyut: 'fan1' },
  { n: 2, nameZh: '高升', nameEn: 'high rising', example: '粉', jyut: 'fan2' },
  { n: 3, nameZh: '中平', nameEn: 'mid level', example: '訓', jyut: 'fan3' },
  { n: 4, nameZh: '低降', nameEn: 'low falling', example: '焚', jyut: 'fan4' },
  { n: 5, nameZh: '低升', nameEn: 'low rising', example: '奮', jyut: 'fan5' },
  { n: 6, nameZh: '低平', nameEn: 'low level', example: '份', jyut: 'fan6' },
] as const
