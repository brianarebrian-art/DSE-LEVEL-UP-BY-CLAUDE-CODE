// ============================================================================
// cantonese-content.test.mts —— /cantonese 內容不變式
// ----------------------------------------------------------------------------
// ⚠️ 本檔原名 cantonese-review-gate.test.mts，守嘅係「真人簽咗名先出得街」。
//    2026-09-19 Yuna 裁決改為由 Claude Code 校對、內容即時出街，所以嗰個閘
//    已經唔存在 —— 留一個叫 review-gate 但已經冇 gate 嘅檔，下一個 session
//    會花時間去搵一個唔存在嘅機制。所以連檔名一齊改。
//
// ══ 換咗乜 ══
// 舊閘問嘅係「有冇人簽過名」。新檢查問嘅係【跑得到嘅問題】：
//
//   · 每個粵拼音節係咪結構上合法（對返粵拼封閉集合）
//   · 每個場景嘅句數、欄位、溝通目的分佈
//   · 詞語表齊唔齊
//   · 有冇夾雜咗唔應該出現嘅字元
//
// ⚠️ 憲章 §16.D：呢啲全部係 build-time 檢查，而且【唔係】讀音正確性保證。
//    `caap3 sou1` 同 `caap3 sou2` 兩個都過得到 —— 邊個先啱，機器答唔到。
//    所以頁面文案寫「結構合法」唔寫「已驗證」，呢條分別要守住。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const { CANTONESE_TOPICS, PURPOSES, SCENE_IDS, topicById, jyutpingProblems, PROVENANCE } =
  await import('../../data/cantonese.ts')

const TOPIC_COUNT = 16
const PHRASES_PER_TOPIC = 6
const MIN_WORDS_PER_TOPIC = 6

test('① 每個粵拼音節都係結構上合法嘅粵拼', () => {
  // 呢條【唔係】讀音正確性檢查 —— 見檔頭。佢捉嘅係唔存在嘅音節：
  // `soung1`（冇 -oung 韻母）、`sou9`（冇第 9 聲）、`bm4`（鼻音唔帶聲母）。
  // 句同詞語表兩邊一齊掃，入口係 data/cantonese.ts 嘅 jyutpingProblems()，
  // 咁「邊啲字串算粵拼」就只定義一次。
  const probs = jyutpingProblems()
  assert.deepEqual(probs, [], `粵拼結構問題：\n  ${probs.join('\n  ')}`)
})

test('② 驗證器本身捉得到嘢 —— 唔係一個永遠綠嘅檢查', async () => {
  // ⚠️ 一個「自己掃自己、永遠綠」嘅檢查冇價值。呢條反過嚟餵一批
  //    【一定要 fail】嘅音節入去，證明 ① 唔係空轉。
  //    `bm4` 呢個 case 唔係想像出嚟：第一版實作真係放行咗佢
  //    （拆成聲母 b ＋ 韻母 m，兩橛各自都喺表入面），係呢條捉返。
  const { checkSyllable } = await import('../jyutping.ts')
  const mustFail = ['sou9', 'srou1', 'soung1', 'zz1', 'g1', 'bm4', 'sou', 'SOU1', 'oung1']
  const leaked = mustFail.filter((s) => checkSyllable(s) === null)
  assert.deepEqual(leaked, [], `呢啲唔合法音節走漏咗：${leaked.join('、')}`)

  const mustPass = ['sou1', 'm4', 'ng5', 'gwong2', 'kwaan3', 'jyut6', 'zoeng1', 'deoi3', 'seoi2']
  const misfired = mustPass.filter((s) => checkSyllable(s) !== null)
  assert.deepEqual(misfired, [], `呢啲合法音節被誤報：${misfired.join('、')}`)
})

test('③ 十六個場景、每個六句、四欄冇空白、id 唔重複', () => {
  const bad: string[] = []
  const seen = new Set<string>()
  for (const t of CANTONESE_TOPICS) {
    if (seen.has(t.id)) bad.push(`${t.id}：id 重複`)
    seen.add(t.id)
    if (t.phrases.length !== PHRASES_PER_TOPIC) {
      bad.push(`${t.id}：${t.phrases.length} 句，應該係 ${PHRASES_PER_TOPIC} 句`)
    }
    const inTopic = new Set<string>()
    for (const p of t.phrases) {
      if (inTopic.has(p.canto)) bad.push(`${t.id} / ${p.canto}：同一個場景入面重複`)
      inTopic.add(p.canto)
      for (const [k, v] of [['canto', p.canto], ['jyut', p.jyut], ['putong', p.putong], ['en', p.en]]) {
        if (!String(v).trim()) bad.push(`${t.id} / ${p.canto}：${k} 空白`)
      }
    }
  }
  assert.equal(CANTONESE_TOPICS.length, TOPIC_COUNT, `應該有 ${TOPIC_COUNT} 個場景`)
  assert.deepEqual(bad, [], `內容結構有問題：\n  ${bad.join('\n  ')}`)
  const total = CANTONESE_TOPICS.reduce((n, t) => n + t.phrases.length, 0)
  assert.equal(total, TOPIC_COUNT * PHRASES_PER_TOPIC, `總句數應該係 ${TOPIC_COUNT * PHRASES_PER_TOPIC}`)
})

test('④ 每個場景都有詞語表同學習提示', () => {
  // 一個淨係有六句嘅場景，教到「呢個情況講呢句」，教唔到「換個情況點砌」。
  // 詞語表同學習提示先係「深入了解」比列表卡多咗嘅嘢 —— 冇咗佢哋，
  // 個 CTA 就變咗講大話。
  const bad: string[] = []
  for (const t of CANTONESE_TOPICS) {
    if (t.words.length < MIN_WORDS_PER_TOPIC) {
      bad.push(`${t.id}：詞語表得 ${t.words.length} 個，最少要 ${MIN_WORDS_PER_TOPIC} 個`)
    }
    for (const w of t.words) {
      for (const [k, v] of [['zh', w.zh], ['jyut', w.jyut], ['putong', w.putong], ['en', w.en]]) {
        if (!String(v).trim()) bad.push(`${t.id} / 詞語「${w.zh}」：${k} 空白`)
      }
    }
    if (!t.learnZh.length || !t.learnEn.length) bad.push(`${t.id}：冇學習提示`)
    if (t.learnZh.length !== t.learnEn.length) {
      bad.push(`${t.id}：學習提示中英數目唔同（${t.learnZh.length} / ${t.learnEn.length}）`)
    }
  }
  assert.deepEqual(bad, [], `詞語表／學習提示有問題：\n  ${bad.join('\n  ')}`)
})

test('⑤ 每個場景嘅溝通目的要夠散 —— 六句唔可以全部係發問', () => {
  // 一個淨係教「點問價」、教唔到「點禮貌拒絕」嘅場景，學生走得入去走唔返出嚟。
  // 門檻係 4／6 而唔係 6／6：夾硬要每個場景湊齊七個目的，就會寫出啲冇人
  // 真係會講嘅句嚟填格，而呢個閘本身就係為咗避免嗰種嘢。
  const MIN_DISTINCT = 4
  const thin = CANTONESE_TOPICS.map((t) => ({
    id: t.id,
    n: new Set(t.phrases.map((p) => p.purpose)).size,
  })).filter((x) => x.n < MIN_DISTINCT)
  assert.deepEqual(thin, [], `呢啲場景嘅溝通目的太單一（少過 ${MIN_DISTINCT} 種）：\n  ${thin.map((x) => `${x.id}：${x.n} 種`).join('\n  ')}`)

  const used = new Set(CANTONESE_TOPICS.flatMap((t) => t.phrases.map((p) => p.purpose)))
  const missing = PURPOSES.filter((p) => !used.has(p))
  assert.deepEqual(missing, [], `呢啲溝通目的成個課程都冇教過：${missing.join('、')}`)
})

test('⑥ 內容檔冇夾雜西里爾／阿拉伯／韓文／日文假名', () => {
  // ⚠️ 呢條唔係防外人，係防【我自己】。2026-09-19 一日之內同一個手誤出現三次：
  //    一句註釋寫咗西里爾文「введ」、一個例字寫成「차 — 茶」同「ست — 是」、
  //    一個詞語表寫咗「найдено — 找錢」。
  //
  //    三次全部係人手肉眼捉返，而三次都係【肉眼差少少就會走甩】——
  //    「найдено — 找錢」睇落就似一個註解。一個學生見到嘅會係一格亂碼。
  //    捉到三次就唔再係大意，係一個模式，所以寫成閘。
  //
  //    廣東話、普通話、英文、粵拼、標點全部唔需要呢幾套字，所以掃得好穩陣。
  const STRAY = /[Ѐ-ӿ؀-ۿ가-힯぀-ヿ]/
  const bad: string[] = []
  for (const f of ['data/cantonese.ts', 'data/cantoneseLearn.ts', 'lib/jyutping.ts']) {
    read(f).split('\n').forEach((ln, i) => {
      if (STRAY.test(ln)) bad.push(`${f}:${i + 1}  ${ln.trim().slice(0, 60)}`)
    })
  }
  assert.deepEqual(bad, [], `夾雜咗唔應該出現嘅字元：\n  ${bad.join('\n  ')}`)
})

test('⑦ 場景路由由 SCENE_IDS 推導，冇第二張手寫清單', () => {
  assert.deepEqual(
    SCENE_IDS,
    CANTONESE_TOPICS.map((t) => t.id),
    'SCENE_IDS 同 CANTONESE_TOPICS 唔同步 —— generateStaticParams 會出錯嘅頁',
  )
  for (const id of SCENE_IDS) {
    assert.ok(topicById(id), `topicById('${id}') 攞唔到場景 —— /cantonese/${id} 會 404`)
  }
  assert.equal(topicById('does-not-exist'), undefined, 'topicById 對唔存在嘅 id 要回 undefined')

  // ⚠️ Next.js 嘅靜態 segment 贏過同級動態 segment，所以一個 id 叫 `learn`
  //    嘅場景會【永遠入唔到】，而且唔會有任何錯誤 —— 撳落去去咗學習頁，
  //    冇人會知佢本來應該係一個場景。
  const RESERVED = ['learn']
  const clash = SCENE_IDS.filter((id) => RESERVED.includes(id))
  assert.deepEqual(clash, [], `場景 id 撞正保留路由，會永遠入唔到：${clash.join('、')}`)

  assert.match(
    read('components/CantoneseTopicCard.tsx'),
    /href=\{`\/cantonese\/\$\{topic\.id\}`\}/,
    'CantoneseTopicCard 冇連去 /cantonese/{id} —— 詳情頁入唔到',
  )
})

test('⑧ 每個溝通目的中英文都要有標籤', async () => {
  // `c.purposes[p.purpose]` 冇對應 key 就會 render 出 undefined ——
  // 唔會 crash、唔會紅，淨係喺卡上面出一個空位。
  const { dictionary } = await import('../dictionary.ts')
  const bad: string[] = []
  for (const locale of ['zh', 'en'] as const) {
    for (const p of PURPOSES) {
      const label = dictionary[locale].cantonese.purposes[p]
      if (!label || !String(label).trim()) bad.push(`${locale}.cantonese.purposes.${p}`)
    }
  }
  assert.deepEqual(bad, [], `呢啲溝通目的缺標籤：\n  ${bad.join('\n  ')}`)
})

test('⑨ 校對聲稱唔可以講得勁過實際做過嘅嘢', () => {
  // 憲章 §16.D：描述一個檢查嘅時候，唔可以講成一件佢做唔到嘅事。
  // 呢度守兩邊：PROVENANCE 自己要列明【查唔到乜】，而畀學生睇嘅文案
  // 唔可以出現「已驗證／已核實」嗰類字眼。
  assert.ok(
    PROVENANCE.machineChecks.length > 0 && PROVENANCE.notChecked.length > 0,
    'PROVENANCE 要同時列出查過乜同查唔到乜 —— 淨係列前者就係一張選擇性報告',
  )

  // ⚠️ 一定要先剝註釋。第一版冇剝，於是命中咗兩句【解釋緊點解唔可以咁寫】
  //    嘅註釋 —— 一個交代咗點解避開某個講法嘅註釋，反而過唔到守嗰個講法嘅閘。
  //    同日喺 token-contrast.test.mts ④⑤⑥ 撞過一模一樣嘅嘢，而 copy-guard.mjs
  //    檔頭更加早就記低過（「最諷刺嗰個命中係一句註釋」）。
  //    剝註釋唔會令個閘鬆：學生睇到嘅字永遠喺字串字面值入面，唔會喺註釋裏面。
  const stripComments = (src: string) =>
    src
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .replace(/^([ \t]*)\/\/[^\n]*$/gm, '$1')
      .replace(/([^:"'`\\])\/\/[^\n]*/g, '$1')

  const OVERCLAIM = /粵拼(已|經)(驗證|核實|校正)|讀音(已|經)(驗證|核實)|Jyutping (has been )?verified/
  const bad: string[] = []
  for (const f of ['lib/dictionary.ts', 'data/cantonese.ts']) {
    stripComments(read(f)).split('\n').forEach((ln, i) => {
      if (OVERCLAIM.test(ln)) bad.push(`${f}:${i + 1}  ${ln.trim().slice(0, 70)}`)
    })
  }
  assert.deepEqual(
    bad,
    [],
    `呢幾行聲稱粵拼「已驗證」，但機器只查到結構合法，查唔到讀音對錯：\n  ${bad.join('\n  ')}`,
  )
})
