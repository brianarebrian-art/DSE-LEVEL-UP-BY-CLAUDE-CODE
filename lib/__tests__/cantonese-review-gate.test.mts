// ============================================================================
// cantonese-review-gate.test.mts —— 粵拼未經真人審過，唔准出街
// ----------------------------------------------------------------------------
// ══ 守緊乜 ══
// /cantonese 嘅對照入面，【粵拼】係事實資料，而且錯咗冇人會知：
//   · term-guard／i18n-guard／copy-guard 全部唔識粵拼，一條都捉唔到
//   · 唔會 build fail、唔會有紅字、唔會有人投訴
//   · 一個聲調數字寫錯，學生照住讀就係讀錯咗個音，而學語言嘅人一旦記錯個音，
//     改返好過學新嘅難 —— 而呢批學生正正就係呢版想幫嗰批
//
// 所以內容行同題庫一樣嘅規矩（憲章 §12）：`data/cantonese.ts` 嘅
// `REVIEW.reviewer` 留白 = 唔 render 啲句，頁面出「內容正由真人校對中」。
//
// ⚠️ ② 嗰半唔係防「有人打錯字」，係防【我自己】。今日已經有一次：
//    攞一個已簽名嘅批次去做煙霧測試，結果洗咗 brian 個簽名。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const { REVIEW, CANTONESE_TOPICS, PURPOSES, UNSURE, SCENE_IDS, topicById, unsureForScene } =
  await import('../../data/cantonese.ts')

/** 場景數同每個場景嘅句數。改呢兩個數之前要有人真係決定過。 */
const TOPIC_COUNT = 12
const PHRASES_PER_TOPIC = 6

test('① 簽名閘接住線 —— 列表同場景詳情兩版都由 REVIEW.reviewer 推導', () => {
  // ⚠️ 兩版都要驗。詳情頁做後門嘅話，一個未經覆核嘅粵拼喺
  //    /cantonese/greeting 出，同喺 /cantonese 出，對學生嚟講一模一樣。
  for (const page of ['app/cantonese/page.tsx', 'app/cantonese/[sceneId]/page.tsx']) {
    assert.match(
      read(page),
      /signed=\{REVIEW\.reviewer\.trim\(\)\.length > 0\}/,
      `${page} 冇由 REVIEW.reviewer 推導 signed —— 個閘斷咗線，內容會無條件出街`,
    )
  }
  assert.match(
    read('components/CantoneseTopicCard.tsx'),
    /signed \?/,
    'CantoneseTopicCard 冇用 signed 分支 —— 對照會照出',
  )
  assert.match(
    read('app/cantonese/[sceneId]/SceneView.tsx'),
    /signed \?/,
    'SceneView 冇用 signed 分支 —— 詳情頁會無條件出啲句',
  )
  assert.match(
    read('components/CantonesePhrase.tsx'),
    /\{p\.jyut\}/,
    'CantonesePhrase 冇 render p.jyut —— 呢條測試守緊嘅嘢已經唔存在，要重寫測試',
  )
})

test('② 簽名必須係真人 —— 機器唔准自己填', () => {
  const name = REVIEW.reviewer.trim().toLowerCase()
  if (!name) return // 未簽名 = 內容唔出街，合法狀態
  for (const forbidden of ['claude', 'ai', 'bot', 'machine', 'auto', 'system', '機器', 'agent']) {
    assert.notEqual(
      name,
      forbidden,
      `data/cantonese.ts 嘅 REVIEW.reviewer 填咗「${REVIEW.reviewer}」——` +
        `憲章 §12：機器永不自動入庫，簽名位只准真人填。`,
    )
  }
  assert.match(
    REVIEW.reviewedAt,
    /^\d{4}-\d{2}-\d{2}$/,
    '簽咗名就要有日期（YYYY-MM-DD）—— 冇日期嘅簽名日後冇人知幾時審過',
  )
})

test('③ 每個粵拼音節都有聲調數字 —— 冇聲調嘅粵拼教唔到發音', () => {
  // 唔係查啱唔啱（機器查唔到），係查有冇。一個冇聲調數字嘅音節，
  // 對學緊廣東話嘅人嚟講基本上冇用 —— 廣東話六個聲調全靠佢分。
  //
  // ⚠️ 啲句而家係【完整句】唔再係單詞，所以粵拼會跟廣東話帶標點
  //    （`zou2 san4, ngo5 hai6…`）。剝走標點先驗，否則「san4,」會誤報。
  //    只剝 , ? ! 三隻同斜線 —— 剝得多就等於個閘鬆咗。
  const bad: string[] = []
  for (const t of CANTONESE_TOPICS) {
    for (const p of t.phrases) {
      for (const raw of p.jyut.split(/\s+/)) {
        const syl = raw.replace(/^[,?!/]+|[,?!/]+$/g, '')
        if (!syl) continue
        if (!/^[a-z]+[1-6]$/.test(syl)) bad.push(`${t.id} / ${p.canto} → 「${raw}」`)
      }
    }
  }
  assert.deepEqual(bad, [], `呢啲粵拼音節唔符合「字母 + 1–6 聲調」格式：\n  ${bad.join('\n  ')}`)
})

test('④ 有綁課題嘅主題，課題必須真係存在', async () => {
  // 日常生活場景冇 topicId —— 中文科十九個課題冇一個載得起佢哋，夾硬綁一個
  // 會令數據講大話。所以呢度只驗【有綁嗰批】。現版 0/12，即係空轉；留住佢
  // 係因為日後加返綁得到嘅主題，個檢查即刻生效。
  const { getSubjectTopics } = await import('../../data/questions/index.ts')
  const live = new Set((getSubjectTopics('chinese') as { id: string }[]).map((t) => t.id))
  const dead = CANTONESE_TOPICS.filter((t) => t.topicId && !live.has(t.topicId)).map(
    (t) => `${t.id} → ${t.topicId}`,
  )
  assert.deepEqual(dead, [], `呢啲卡指住唔存在嘅課題，「做呢個課題」會係死掣：\n  ${dead.join('\n  ')}`)
})

test('⑤ 十二個場景、每個六句、四欄冇空白、id 唔重複', () => {
  // ④ 淨係驗「有綁課題嗰批」，而現版 0/12 全部冇綁 —— 即係話 ④ 而家係空轉。
  // 呢條補返真係量度緊嘢嘅不變式，否則個檔可以爛成點都冇人知。
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
      if (inTopic.has(p.canto)) bad.push(`${t.id} / ${p.canto}：同一個主題入面重複`)
      inTopic.add(p.canto)
      for (const [k, v] of [
        ['canto', p.canto],
        ['jyut', p.jyut],
        ['putong', p.putong],
        ['en', p.en],
      ]) {
        if (!String(v).trim()) bad.push(`${t.id} / ${p.canto}：${k} 空白`)
      }
    }
  }
  assert.equal(
    CANTONESE_TOPICS.length,
    TOPIC_COUNT,
    `應該有 ${TOPIC_COUNT} 個場景，而家有 ${CANTONESE_TOPICS.length} 個`,
  )
  assert.deepEqual(bad, [], `內容結構有問題：\n  ${bad.join('\n  ')}`)
  const total = CANTONESE_TOPICS.reduce((n, t) => n + t.phrases.length, 0)
  assert.equal(total, TOPIC_COUNT * PHRASES_PER_TOPIC, `總句數應該係 ${TOPIC_COUNT * PHRASES_PER_TOPIC}`)
})

test('⑥ 揀唔定嘅粵拼要列喺 UNSURE，唔可以靜靜哋當冇事', () => {
  // 寫嗰陣揀唔定嘅音，如果淨係擺喺腦入面，覆核人就冇得由最高風險嗰批入手。
  // 呢條唔查對錯（機器查唔到），只查「有冇列出嚟」——一個空嘅 UNSURE 代表
  // 寫嘅人聲稱成份粵拼零疑問，而呢個聲稱本身就應該有人質疑。
  assert.ok(
    Array.isArray(UNSURE) && UNSURE.length > 0,
    'UNSURE 係空 —— 即係聲稱成份粵拼零疑問。真係咁嘅話，請喺本測試寫低點解。',
  )
  const bad: string[] = []
  for (const u of UNSURE) {
    if (!u.term?.trim()) bad.push(`有一條冇 term`)
    if (!u.note?.trim()) bad.push(`${u.term}：冇 note，覆核人唔知要對乜`)
    if (!Array.isArray(u.scenes) || u.scenes.length === 0) {
      bad.push(`${u.term}：冇 scenes，喺任何場景頁都唔會出現`)
    }
  }
  assert.deepEqual(bad, [], `UNSURE 有問題：\n  ${bad.join('\n  ')}`)
})

test('⑩ UNSURE 每條都要綁到真場景 —— 打錯 id 會靜靜哋消失', () => {
  // `scenes` 唔係標籤，係接線：場景詳情頁靠佢揀該場景相關嗰批。
  // 打錯一個字，嗰條就【邊度都唔會出現】，而個場景會話「冇列出任何未定嘅
  // 粵拼」—— 嗰句係假嘅，同時唔會有任何嘢紅。
  const live = new Set(SCENE_IDS)
  const dead = UNSURE.flatMap((u) =>
    u.scenes.filter((s: string) => !live.has(s)).map((s: string) => `${u.term} → ${s}`),
  )
  assert.deepEqual(dead, [], `UNSURE 指住唔存在嘅場景 id：\n  ${dead.join('\n  ')}`)

  // 反向：每條都要至少喺一個場景頁出得到。
  const orphan = UNSURE.filter((u) => !u.scenes.some((s: string) => unsureForScene(s).includes(u)))
  assert.deepEqual(orphan.map((u) => u.term), [], 'UNSURE 有條目揀唔返出嚟')
})

test('⑪ 十二條場景路由由 SCENE_IDS 推導，冇第二張手寫清單', () => {
  assert.deepEqual(
    SCENE_IDS,
    CANTONESE_TOPICS.map((t) => t.id),
    'SCENE_IDS 同 CANTONESE_TOPICS 唔同步 —— generateStaticParams 會出錯嘅頁',
  )
  for (const id of SCENE_IDS) {
    assert.ok(topicById(id), `topicById('${id}') 攞唔到場景 —— /cantonese/${id} 會 404`)
  }
  assert.equal(topicById('does-not-exist'), undefined, 'topicById 對唔存在嘅 id 要回 undefined，畀 route 自己 404')

  // 列表卡連去詳情頁；冇呢條連結，十二條 route 就變孤兒（integration-guard
  // 只查有冇入口，查唔到入口指啱邊度）。
  assert.match(
    read('components/CantoneseTopicCard.tsx'),
    /href=\{`\/cantonese\/\$\{topic\.id\}`\}/,
    'CantoneseTopicCard 冇連去 /cantonese/{id} —— 十二條詳情頁入唔到',
  )
})

test('⑦ 每個場景嘅溝通目的要夠散 —— 六句唔可以全部係發問', () => {
  // 一個淨係教「點問價」、教唔到「點禮貌拒絕」嘅場景，學生走得入去走唔返出嚟。
  // 呢條係 `purpose` 欄位存在嘅主要理由：令「功能夠唔夠散」由一個主觀印象
  // 變成一個驗得到嘅數。
  //
  // 門檻係 4／6 而唔係 6／6：夾硬要每個場景都湊齊七個目的，就會寫出啲冇人
  // 真係會講嘅句嚟填格，而個閘本身就係為咗避免呢種嘢。
  const MIN_DISTINCT = 4
  const thin = CANTONESE_TOPICS.map((t) => ({
    id: t.id,
    n: new Set(t.phrases.map((p) => p.purpose)).size,
  })).filter((x) => x.n < MIN_DISTINCT)
  assert.deepEqual(
    thin,
    [],
    `呢啲場景嘅溝通目的太單一（少過 ${MIN_DISTINCT} 種）：\n  ${thin
      .map((x) => `${x.id}：${x.n} 種`)
      .join('\n  ')}`,
  )

  // 全課程要用齊七個目的。缺咗任何一個，代表成個課程都教唔到嗰種講法。
  const used = new Set(CANTONESE_TOPICS.flatMap((t) => t.phrases.map((p) => p.purpose)))
  const missing = PURPOSES.filter((p) => !used.has(p))
  assert.deepEqual(missing, [], `呢啲溝通目的成個課程都冇教過：${missing.join('、')}`)
})

test('⑧ 未簽名嘅分支唔准掂到句子內容 —— 列表同詳情兩版都零粵拼入 DOM', () => {
  // ① 驗咗「有 signed 分支」，但冇驗未簽名嗰半入面有乜。呢條切開兩半，
  // 逐個字查未簽名嗰半有冇掂到句子內容或者 <CantonesePhrase>。
  //
  // ⚠️ 呢個係【靜態掃原始碼】，唔係 runtime 防護（憲章 §16.D）。真正嘅
  //    地面真相係喺 localhost:3001 未簽名狀態下數 DOM 入面嘅粵拼 —— 呢條
  //    只係令「有人喺未簽名嗰半加返啲句」呢件事唔會靜靜哋發生。
  const FILES = ['components/CantoneseTopicCard.tsx', 'app/cantonese/[sceneId]/SceneView.tsx']
  for (const f of FILES) {
    const src = read(f)
    const split = src.indexOf(') : (')
    assert.ok(split > 0, `${f} 搵唔到 signed 三元嘅分界 —— 結構改咗，要重寫本測試`)
    const unsigned = src.slice(split)
    const leaks = ['p.jyut', 'p.canto', 'p.putong', 'CantonesePhrase'].filter((x) =>
      unsigned.includes(x),
    )
    assert.deepEqual(
      leaks,
      [],
      `${f} 未簽名分支掂到咗句子內容：${leaks.join('、')} —— 未經覆核嘅粵拼會入 DOM`,
    )
  }

  // CantonesePhrase 自己【唔做】簽名判斷 —— 閘喺兩個呼叫方。寫喺呢度嘅話，
  // 兩個呼叫方都會以為對方做咗，而組件多一個 prop 就多一個繞得過嘅入口。
  assert.ok(
    !read('components/CantonesePhrase.tsx').includes('signed'),
    'CantonesePhrase 唔應該自己判斷 signed —— 閘只可以喺呼叫方，否則責任兩邊都唔清',
  )
})

test('⑨ 每個溝通目的中英文都要有標籤', async () => {
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
