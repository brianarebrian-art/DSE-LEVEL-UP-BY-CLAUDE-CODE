// 史料判讀室 Source Lab —— DSE 歷史科卷一資料題訓練素材。
//
// ══ 為何存在 ══
// data/questions/history.ts 已登記框架 `evidence: 史料判讀 / Source Analysis`，
// 但多項選擇題只能考到判讀能力的表層：學生選出 A/B/C/D，並未練習「面對一份帶
// 有立場的史料，如何拆解」。DSE 歷史科卷一正是資料題，考核的正是事實、詮釋、
// 立場三者的分離。本檔補上該軸。
//
// ══ 來源紀律（最重要）══
// 每一項事實、詮釋、立場均須附可核查來源。本檔【嚴禁】生成看似合理的檔案編號。
// 一名學生若在卷一引用一個不存在的檔案編號，後果是直接失分，而錯在平台。
//
//   • 可核查的公開文本（條約條款、會議公報、已出版著作）→ 具名引用
//   • 查證不到具體編號 → `pending: true`，介面明示「來源待查」，不得填造
//   • 任何情況下不得為填滿格式而發明來源
//
// 因此各視角來源多標為 Secondary（史學著作綜述該立場），而非聲稱掌握了未經核
// 實的一手外交文件。此為刻意選擇：寧可標低可靠性等級，不可標錯。
//
// ══ 範圍 ══
// 僅限 DSE 歷史科與中國歷史科課程之內（Yuna 2026-08-20 拍板）。課程以外的條目
// （史前、古代、進行中衝突等）不予收錄：對考生零分數價值，且編輯負擔最重。
//
// ══ 入庫紀律 ══
// 本檔內容經真人逐條核來源後方可上線，與題庫同一原則：機器永不自動入庫。

/** 史料可靠性等級。卷一資料題要求學生自行判斷，故必須明示。 */
export type Reliability = 'primary' | 'secondary' | 'tertiary'

export interface SourceRef {
  /** 具名引用：條約條款／會議公報／著作 + 作者 + 年份。不是檔案編號。 */
  cite: string
  citeEn: string
  reliability: Reliability
  /** 可公開核查的連結。查證不到即留空 —— 不得填造。 */
  url?: string
  /** 真為「來源待查」：介面須明示，且該項不可作為答題依據。 */
  pending?: boolean
}

export interface HistoryFact {
  zh: string
  en: string
  source: SourceRef
}

/** 一個詮釋視角。各視角在介面上等寬並列，不設主次。 */
export interface Perspective {
  nameZh: string
  nameEn: string
  bodyZh: string
  bodyEn: string
  source: SourceRef
}

/** 一個實體的官方立場。與「詮釋」分開：立場是誰說了什麼，不是誰說得對。 */
export interface Position {
  entityZh: string
  entityEn: string
  stanceZh: string
  stanceEn: string
  source: SourceRef
}

export interface SourceLabEntry {
  id: string
  /** 對應 data/subjects.ts 的科目 id。 */
  subject: 'history' | 'chinese-history'
  /** 對應題庫 topic id，供「入去練返呢個課題」連結使用。 */
  topic: string
  titleZh: string
  titleEn: string
  dateZh: string
  dateEn: string
  placeZh: string
  placeEn: string
  facts: HistoryFact[]
  perspectives: Perspective[]
  positions: Position[]
  /** 本條史料在卷一最常見的失分陷阱。此欄是本功能與一般百科的分野。 */
  trapZh: string
  trapEn: string
}

// ── 條目 ────────────────────────────────────────────────────────────────────

const berlinBlockade: SourceLabEntry = {
  id: 'berlin-blockade',
  subject: 'history',
  topic: 'cold_war',
  titleZh: '柏林封鎖',
  titleEn: 'The Berlin Blockade',
  dateZh: '1948 年 6 月 24 日至 1949 年 5 月 12 日',
  dateEn: '24 June 1948 – 12 May 1949',
  placeZh: '德國柏林',
  placeEn: 'Berlin, Germany',
  facts: [
    {
      zh: '第二次世界大戰結束後，德國全境及柏林市分別由美國、英國、法國、蘇聯四國分區佔領；柏林全市位於蘇聯佔領區之內。',
      en: 'After the Second World War, Germany and the city of Berlin were each divided into four occupation zones administered by the United States, Britain, France and the Soviet Union. Berlin lay wholly inside the Soviet zone.',
      source: {
        cite: '波茨坦會議議定書（1945 年 8 月 2 日）',
        citeEn: 'Potsdam Protocol, 2 August 1945',
        reliability: 'primary',
      },
    },
    {
      zh: '1948 年 6 月，美、英、法三國佔領區推行貨幣改革，發行新德國馬克，數日後擴展至西柏林。蘇聯未參與該項改革。',
      en: 'In June 1948 the American, British and French zones introduced a currency reform issuing a new Deutsche Mark, extended days later to West Berlin. The Soviet Union did not take part in the reform.',
      source: {
        cite: '冷戰史標準敘述；日期見各主要戰後德國史著作',
        citeEn: 'Standard Cold War historiography; dates given in major post-war German histories',
        reliability: 'secondary',
      },
    },
    {
      zh: '1948 年 6 月 24 日，蘇聯切斷西柏林對外的陸路與水路通道。',
      en: 'On 24 June 1948 the Soviet Union cut the land and water routes linking West Berlin to the western zones.',
      source: {
        cite: '冷戰史標準敘述',
        citeEn: 'Standard Cold War historiography',
        reliability: 'secondary',
      },
    },
    {
      zh: '美、英隨即以空運方式向西柏林補給，美方行動代號為 Operation Vittles，英方為 Operation Plainfare。',
      en: 'The United States and Britain responded by supplying West Berlin by air, under the operational names Operation Vittles (US) and Operation Plainfare (UK).',
      source: {
        cite: '美國空軍及英國皇家空軍公開戰史',
        citeEn: 'Published official histories of the USAF and the RAF',
        reliability: 'secondary',
      },
    },
    {
      zh: '蘇聯於 1949 年 5 月 12 日解除封鎖；空運行動並未即時停止，而是持續至同年 9 月。',
      en: 'The Soviet Union lifted the blockade on 12 May 1949. The airlift did not stop immediately but continued until September of that year.',
      source: {
        cite: '冷戰史標準敘述',
        citeEn: 'Standard Cold War historiography',
        reliability: 'secondary',
      },
    },
    {
      zh: '空運期間運送的物資總量，各方統計介乎二百萬噸以上，具體數字視乎計算方式與統計截止日期而異。',
      en: 'Total tonnage delivered during the airlift is generally given as over two million tons; the precise figure varies with the method of counting and the cut-off date used.',
      source: {
        cite: '具體噸數須核對原始統計來源後方可引用',
        citeEn: 'Precise tonnage requires verification against the original statistical source before citation',
        reliability: 'secondary',
        pending: true,
      },
    },
  ],
  perspectives: [
    {
      nameZh: '蘇聯立場',
      nameEn: 'The Soviet position',
      bodyZh:
        '西方三國在未經四強協商的情況下單方面推行貨幣改革，並將新貨幣延伸至位處蘇佔區內的西柏林，已破壞四強共管德國的基礎。既然共管安排已被對方單方面終止，蘇聯對其佔領區內的交通線便無義務繼續開放。封鎖被表述為對違約行為的回應，而非主動的攻勢。',
      bodyEn:
        'By carrying out a currency reform without four-power agreement and extending the new currency into West Berlin — a city inside the Soviet zone — the western powers had destroyed the basis of joint administration. Once the other side had unilaterally ended that arrangement, the Soviet Union was under no continuing obligation to keep transit routes through its own zone open. The blockade was presented as a response to a breach, not as an offensive act.',
      source: {
        cite: '冷戰史著作對蘇方論據之綜述',
        citeEn: 'Scholarly summaries of the Soviet case in Cold War historiography',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '西方三國立場',
      nameEn: 'The western powers’ position',
      bodyZh:
        '西方佔領區的經濟已因舊貨幣崩潰而陷入停滯，貨幣改革是恢復經濟運作的必要措施，而蘇方在多次會議中拒絕就統一貨幣達成協議。四強協定賦予西方三國在柏林的駐留權利，切斷通往西柏林的補給線是以平民生活為手段施壓，屬於違反佔領協議的行為。',
      bodyEn:
        'The economy of the western zones had stalled under a collapsed currency, and reform was a necessary step to restore it, the Soviet side having refused agreement on a unified currency across repeated conferences. Four-power agreements established western rights of presence in Berlin; severing supply routes to West Berlin used the civilian population as leverage and breached those agreements.',
      source: {
        cite: '冷戰史著作對西方論據之綜述',
        citeEn: 'Scholarly summaries of the western case in Cold War historiography',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '修正主義史學視角',
      nameEn: 'Revisionist historiography',
      bodyZh:
        '此派史家主張，冷戰的形成不能僅歸因於蘇聯擴張，美國的經濟與戰略利益同樣構成推力。就柏林而言，西方三國推進西德國家建構的步伐，對蘇聯而言構成安全上的既成事實，封鎖須置於此互動脈絡中理解。',
      bodyEn:
        'Revisionist historians argue that the onset of the Cold War cannot be attributed to Soviet expansion alone, and that American economic and strategic interests were also a driving force. On Berlin, the pace at which the western powers advanced the construction of a West German state presented the Soviet Union with a security fait accompli; the blockade must be read within that interaction.',
      source: {
        cite: 'William Appleman Williams, The Tragedy of American Diplomacy (1959)',
        citeEn: 'William Appleman Williams, The Tragedy of American Diplomacy (1959)',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '後修正主義史學視角',
      nameEn: 'Post-revisionist historiography',
      bodyZh:
        '此派主張雙方均非單純的加害或受害一方，冷戰源於戰後權力真空中雙方對彼此意圖的誤讀與安全困境的累積。柏林封鎖被視為此一結構的產物，而非任何一方預設計劃的執行。',
      bodyEn:
        'Post-revisionists hold that neither side was simply aggressor or victim, and that the Cold War emerged from mutual misreading of intentions and an accumulating security dilemma in the post-war power vacuum. The Berlin Blockade is treated as a product of that structure rather than the execution of either side’s prior plan.',
      source: {
        cite: 'John Lewis Gaddis, The United States and the Origins of the Cold War, 1941–1947 (1972)',
        citeEn: 'John Lewis Gaddis, The United States and the Origins of the Cold War, 1941–1947 (1972)',
        reliability: 'secondary',
      },
    },
  ],
  positions: [
    {
      entityZh: '蘇聯',
      entityEn: 'Soviet Union',
      stanceZh: '封鎖屬對西方單方面破壞四強共管的回應，非攻擊行為。',
      stanceEn: 'The blockade was a response to the unilateral western breach of four-power administration, not an act of aggression.',
      source: { cite: '冷戰史著作綜述', citeEn: 'Cold War historiography', reliability: 'secondary' },
    },
    {
      entityZh: '美國',
      entityEn: 'United States',
      stanceZh: '西方三國在柏林的權利源自戰時協定，補給西柏林是履行佔領責任。',
      stanceEn: 'Western rights in Berlin derived from wartime agreements; supplying West Berlin discharged occupation responsibilities.',
      source: { cite: '冷戰史著作綜述', citeEn: 'Cold War historiography', reliability: 'secondary' },
    },
    {
      entityZh: '英國',
      entityEn: 'United Kingdom',
      stanceZh: '與美國立場一致，並以皇家空軍參與空運行動。',
      stanceEn: 'Aligned with the United States, and committed the RAF to the airlift.',
      source: { cite: '英國皇家空軍公開戰史', citeEn: 'Published official RAF history', reliability: 'secondary' },
    },
  ],
  trapZh:
    '卷一常見失分點：把「蘇聯先封鎖，所以蘇聯是挑起者」當成不證自明的結論。資料題要求的是先分辨哪些是事實（日期、行動），哪些是雙方各自的因果敘述，再判斷哪一方的敘述較能被資料支持。直接跳到結論而不處理對方論據，屬於典型的「過度推論」。',
  trapEn:
    'A common Paper 1 error is treating “the Soviets blockaded first, therefore the Soviets began it” as self-evident. Source questions require you first to separate fact (dates, actions) from each side’s causal narrative, then to judge which narrative the sources better support. Jumping to the conclusion without addressing the opposing case is a textbook over-inference.',
}

const versailles231: SourceLabEntry = {
  id: 'versailles-231',
  subject: 'history',
  topic: 'ww1',
  titleZh: '《凡爾賽和約》第二三一條',
  titleEn: 'Article 231 of the Treaty of Versailles',
  dateZh: '1919 年 6 月 28 日簽署',
  dateEn: 'Signed 28 June 1919',
  placeZh: '法國凡爾賽',
  placeEn: 'Versailles, France',
  facts: [
    {
      zh: '《凡爾賽和約》於 1919 年 6 月 28 日在凡爾賽宮簽署。',
      en: 'The Treaty of Versailles was signed at the Palace of Versailles on 28 June 1919.',
      source: {
        cite: '《凡爾賽和約》（1919）',
        citeEn: 'Treaty of Versailles (1919)',
        reliability: 'primary',
      },
    },
    {
      zh: '第二三一條列於和約第八部分（賠償）第一節之首，作為其後賠償條款的法理基礎。',
      en: 'Article 231 opens Part VIII (Reparation), Section I, and functions as the legal basis for the reparation clauses that follow.',
      source: {
        cite: '《凡爾賽和約》第八部分第一節第二三一條',
        citeEn: 'Treaty of Versailles, Part VIII, Section I, Article 231',
        reliability: 'primary',
      },
    },
    {
      zh: '條文內容要求德國及其盟國承認：協約國因德國及其盟國之侵略而被迫作戰，並因此蒙受一切損失與損害，該責任由德國及其盟國承擔。',
      en: 'The article requires Germany and her allies to accept responsibility for all loss and damage suffered by the Allied powers as a consequence of a war imposed upon them by the aggression of Germany and her allies.',
      source: {
        cite: '《凡爾賽和約》第二三一條',
        citeEn: 'Treaty of Versailles, Article 231',
        reliability: 'primary',
      },
    },
    {
      zh: '條文本身並未使用「罪責」一詞。「戰爭罪責條款」是後世對該條的通稱，並非條文原文用語。',
      en: 'The article itself does not use the word “guilt”. The label “war guilt clause” is a later popular name for it, not the treaty’s own wording.',
      source: {
        cite: '《凡爾賽和約》第二三一條原文；通稱之來源見一戰史學著作',
        citeEn: 'Text of Article 231; on the origin of the label see First World War historiography',
        reliability: 'primary',
      },
    },
  ],
  perspectives: [
    {
      nameZh: '德國視角',
      nameEn: 'The German view',
      bodyZh:
        '該條款在德國被廣泛稱為「戰爭罪責謊言」，被視為戰勝國強加的道德判決而非法律事實。由於條款同時是賠償責任的依據，它將財政負擔與民族屈辱綑綁在一起，成為威瑪共和時期各政治勢力共同攻擊的目標，並被用以質疑共和政府接受和約的正當性。',
      bodyEn:
        'In Germany the clause was widely called the “war guilt lie”, seen as a moral verdict imposed by the victors rather than a finding of law. Because it also grounded the reparation obligation, it tied financial burden to national humiliation, becoming a target attacked across the political spectrum in the Weimar period and used to question the legitimacy of a republican government that had accepted the treaty.',
      source: {
        cite: '威瑪共和政治史研究對該條款之討論',
        citeEn: 'Scholarship on the politics of the Weimar Republic',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '法國視角',
      nameEn: 'The French view',
      bodyZh:
        '戰爭主要在法國本土進行，工業區與農地遭受大規模破壞，重建費用龐大。確立責任歸屬是索取賠償的前提，而賠償不僅是財政問題，亦是防止德國迅速恢復國力、再次威脅法國安全的手段。就此立場而言，該條款屬於安全保障安排的一部分。',
      bodyEn:
        'The war was fought largely on French soil, with heavy destruction of industrial regions and farmland and vast reconstruction costs. Establishing responsibility was the precondition for claiming reparations, and reparations were not merely fiscal but a means of preventing Germany from swiftly rebuilding the strength to threaten France again. On this view the clause formed part of a security arrangement.',
      source: {
        cite: '巴黎和會研究對法方目標之討論',
        citeEn: 'Scholarship on French objectives at the Paris Peace Conference',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '同時代經濟學批評',
      nameEn: 'Contemporary economic criticism',
      bodyZh:
        '凱恩斯以英國財政部代表身分參與和會後辭職，並撰文主張賠償要求超出德國的實際支付能力，將壓抑歐洲整體的經濟復甦，最終招致政治反彈。此論點對其後英語世界對和約的評價影響深遠。',
      bodyEn:
        'Keynes resigned from the British Treasury delegation to the conference and argued in print that the reparation demands exceeded Germany’s actual capacity to pay, would suppress European recovery as a whole, and would ultimately provoke a political backlash. The argument shaped English-language assessments of the treaty for decades.',
      source: {
        cite: 'John Maynard Keynes, The Economic Consequences of the Peace (1919)',
        citeEn: 'John Maynard Keynes, The Economic Consequences of the Peace (1919)',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '戰爭責任的史學再議',
      nameEn: 'Historiographical reopening of war responsibility',
      bodyZh:
        '費舍爾依據德國檔案研究，主張德國在 1914 年確實抱有明確的擴張目標，並非僅被結盟體系拖入戰爭。此說重新開啟了戰爭責任的辯論，亦引發德國史學界的激烈反駁，論爭本身成為戰後史學的重要事件。',
      bodyEn:
        'Working from German archives, Fischer argued that Germany did hold definite expansionist aims in 1914 and was not merely dragged into war by the alliance system. The thesis reopened the debate on war responsibility and provoked fierce rebuttal within German historiography; the controversy itself became a significant episode in post-war scholarship.',
      source: {
        cite: 'Fritz Fischer, Griff nach der Weltmacht (1961)',
        citeEn: 'Fritz Fischer, Griff nach der Weltmacht (1961)',
        reliability: 'secondary',
      },
    },
  ],
  positions: [
    {
      entityZh: '德國（威瑪政府）',
      entityEn: 'Germany (Weimar government)',
      stanceZh: '接受和約以結束戰爭狀態，同時持續在外交上爭取修訂賠償條款。',
      stanceEn: 'Accepted the treaty to end the state of war while continuing to press diplomatically for revision of the reparation terms.',
      source: { cite: '威瑪外交史研究', citeEn: 'Scholarship on Weimar foreign policy', reliability: 'secondary' },
    },
    {
      entityZh: '法國',
      entityEn: 'France',
      stanceZh: '責任條款與賠償是重建及安全保障的必要條件。',
      stanceEn: 'The responsibility clause and reparations were necessary to reconstruction and to security.',
      source: { cite: '巴黎和會研究', citeEn: 'Scholarship on the Paris Peace Conference', reliability: 'secondary' },
    },
    {
      entityZh: '美國',
      entityEn: 'United States',
      stanceZh: '參議院最終未批准《凡爾賽和約》，美國其後與德國另訂和約。',
      stanceEn: 'The Senate ultimately did not ratify the Treaty of Versailles; the United States later concluded a separate peace with Germany.',
      source: { cite: '美國外交史標準敘述', citeEn: 'Standard accounts of US diplomatic history', reliability: 'secondary' },
    },
  ],
  trapZh:
    '卷一最常見的失分點：把「戰爭罪責條款」當成條文原文用語。條文要求承認的是「責任」（responsibility），而通稱中的「罪責」（guilt）是後世加上的。資料題若引用該條並問學生條文說了什麼，答「德國承認自己有罪」即屬誤讀原文。分辨「文件說了什麼」與「後人如何稱呼它」，正是本條的訓練價值。',
  trapEn:
    'The most common Paper 1 error here is treating “war guilt clause” as the treaty’s own language. What the article requires is acceptance of responsibility; “guilt” is a later label. If a source question quotes the article and asks what it states, answering “Germany admitted it was guilty” misreads the text. Separating what a document says from what later generations call it is precisely what this entry trains.',
}

const appeasementMunich: SourceLabEntry = {
  id: 'appeasement-munich',
  subject: 'history',
  topic: 'ww2',
  titleZh: '慕尼黑協定與綏靖政策的評價',
  titleEn: 'The Munich Agreement and the Debate on Appeasement',
  dateZh: '1938 年 9 月 29 至 30 日',
  dateEn: '29–30 September 1938',
  placeZh: '德國慕尼黑',
  placeEn: 'Munich, Germany',
  facts: [
    {
      zh: '慕尼黑協定由英國、法國、德國、意大利四國代表簽署。',
      en: 'The Munich Agreement was signed by representatives of Britain, France, Germany and Italy.',
      source: {
        cite: '《慕尼黑協定》（1938）',
        citeEn: 'Munich Agreement (1938)',
        reliability: 'primary',
      },
    },
    {
      zh: '捷克斯洛伐克並未獲邀參與談判，其領土處置由上述四國決定。',
      en: 'Czechoslovakia was not invited to the negotiations; the disposal of its territory was decided by the four powers named above.',
      source: {
        cite: '《慕尼黑協定》及一九三○年代歐洲外交史標準敘述',
        citeEn: 'Munich Agreement; standard accounts of 1930s European diplomacy',
        reliability: 'primary',
      },
    },
    {
      zh: '協定規定捷克斯洛伐克的蘇台德地區割讓予德國。',
      en: 'The agreement provided for the cession of the Sudetenland from Czechoslovakia to Germany.',
      source: {
        cite: '《慕尼黑協定》（1938）',
        citeEn: 'Munich Agreement (1938)',
        reliability: 'primary',
      },
    },
    {
      zh: '張伯倫返抵英國後公開表示，此協定帶來「我們時代的和平」。',
      en: 'On returning to Britain, Chamberlain stated publicly that the agreement brought “peace for our time”.',
      source: {
        cite: '張伯倫 1938 年 9 月 30 日公開談話',
        citeEn: 'Chamberlain’s public remarks, 30 September 1938',
        reliability: 'primary',
      },
    },
    {
      zh: '1939 年 3 月，德國佔領捷克斯洛伐克餘下領土，協定所訂的安排隨之瓦解。',
      en: 'In March 1939 Germany occupied the remainder of Czechoslovakia, and the arrangement established by the agreement collapsed.',
      source: {
        cite: '一九三○年代歐洲外交史標準敘述',
        citeEn: 'Standard accounts of 1930s European diplomacy',
        reliability: 'secondary',
      },
    },
  ],
  perspectives: [
    {
      nameZh: '正統觀點',
      nameEn: 'The orthodox view',
      bodyZh:
        '此派主張綏靖是領導層判斷上的失誤：面對可辨識的擴張意圖，英法選擇讓步而非及早制止，結果既未換來和平，亦削弱了自身的戰略地位。此觀點在戰爭爆發初期即已成形，並長期主導公眾認知。',
      bodyEn:
        'This view holds appeasement to have been a failure of leadership: faced with recognisable expansionist intent, Britain and France chose concession over early resistance, obtaining neither peace nor a stronger strategic position. It took shape early in the war and long dominated public understanding.',
      source: {
        cite: '“Cato”, Guilty Men (1940)',
        citeEn: '“Cato”, Guilty Men (1940)',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '修正主義觀點',
      nameEn: 'The revisionist view',
      bodyZh:
        '泰勒主張希特拉並非依照既定藍圖行事，而是不斷利用對手的退讓擴大所得的機會主義者；就英國當時的軍備狀況、帝國防務負擔與國內輿論而言，爭取時間是可理解的選擇。此說將焦點由個人道德轉向結構條件。',
      bodyEn:
        'Taylor argued that Hitler acted not from a fixed blueprint but as an opportunist who repeatedly enlarged his gains by exploiting the concessions of others, and that given British rearmament levels, imperial defence commitments and domestic opinion, buying time was an intelligible choice. The account shifts attention from personal morality to structural conditions.',
      source: {
        cite: 'A. J. P. Taylor, The Origins of the Second World War (1961)',
        citeEn: 'A. J. P. Taylor, The Origins of the Second World War (1961)',
        reliability: 'secondary',
      },
    },
    {
      nameZh: '後修正主義觀點',
      nameEn: 'The post-revisionist view',
      bodyZh:
        '帕克等史家承認結構性制約真實存在，但主張張伯倫並非別無選擇：當時確有其他可行方案，包括更積極的集體安全安排，而政策取向反映了首相個人的判斷與其對內閣的主導。此說在「無可奈何」與「失職」之間取一中間位置。',
      bodyEn:
        'Parker and others accept that structural constraints were real but argue that Chamberlain was not without alternatives: other courses, including a more active pursuit of collective security, were available, and the policy adopted reflected the Prime Minister’s own judgement and his dominance over the Cabinet. The account occupies a middle position between “no choice” and “dereliction”.',
      source: {
        cite: 'R. A. C. Parker, Chamberlain and Appeasement (1993)',
        citeEn: 'R. A. C. Parker, Chamberlain and Appeasement (1993)',
        reliability: 'secondary',
      },
    },
  ],
  positions: [
    {
      entityZh: '英國',
      entityEn: 'United Kingdom',
      stanceZh: '協定解決了蘇台德問題，避免了即時的全面戰爭。',
      stanceEn: 'The agreement settled the Sudeten question and averted an immediate general war.',
      source: { cite: '張伯倫 1938 年公開談話', citeEn: 'Chamberlain’s public remarks, 1938', reliability: 'primary' },
    },
    {
      entityZh: '捷克斯洛伐克',
      entityEn: 'Czechoslovakia',
      stanceZh: '領土處置在該國缺席的情況下作出，其立場未獲納入談判。',
      stanceEn: 'Its territory was disposed of in its absence; its position was not represented in the negotiations.',
      source: { cite: '《慕尼黑協定》締約方名單', citeEn: 'Signatory list of the Munich Agreement', reliability: 'primary' },
    },
    {
      entityZh: '德國',
      entityEn: 'Germany',
      stanceZh: '蘇台德地區的德語人口應歸入德國版圖。',
      stanceEn: 'The German-speaking population of the Sudetenland should be brought within Germany.',
      source: { cite: '一九三○年代德國外交聲明之史學綜述', citeEn: 'Scholarly summaries of German diplomatic statements in the 1930s', reliability: 'secondary' },
    },
  ],
  trapZh:
    '本條的訓練重點不在於「綏靖是對是錯」，而在於：史家之間的評價分歧本身就是考點。卷一若問「你在多大程度上同意綏靖是一項失誤」，只複述其中一派觀點而不處理對立詮釋，即使論據充分亦難取高分。答題須交代不同視角所依據的證據類型有何差異 —— 正統觀點多訴諸結果，修正主義多訴諸當時的條件與資訊。',
  trapEn:
    'The training point here is not whether appeasement was right or wrong, but that the disagreement among historians is itself examinable. If Paper 1 asks how far you agree that appeasement was a failure, restating one school without engaging the opposing interpretation will score poorly however well argued. A strong answer explains how the schools differ in the kind of evidence they rest on — the orthodox view appeals largely to outcomes, the revisionist to the conditions and information available at the time.',
}

export const sourceLabEntries: SourceLabEntry[] = [berlinBlockade, versailles231, appeasementMunich]

export const getSourceLabEntry = (id: string): SourceLabEntry | undefined =>
  sourceLabEntries.find((e) => e.id === id)

export const getSourceLabEntriesBySubject = (subject: string): SourceLabEntry[] =>
  sourceLabEntries.filter((e) => e.subject === subject)

/** 可靠性等級的顯示標籤。等級本身是考核內容，故必須在介面明示。 */
export const RELIABILITY_LABEL: Record<Reliability, { zh: string; en: string }> = {
  primary: { zh: '一手史料', en: 'Primary' },
  secondary: { zh: '二手史料', en: 'Secondary' },
  tertiary: { zh: '三手史料', en: 'Tertiary' },
}
