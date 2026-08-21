// ============================================================================
// floor-chinese-history.mts —— 中國歷史科「補底」容易題草稿
// ----------------------------------------------------------------------------
// 點解要有呢批：中國歷史 127 條 MC 入面，**容易題 0 條**。
// 練習引擎一節 20 題按 3:5:2 抽（6 易 / 10 中 / 4 難），呢科實際派得出 0 易。
// 即係任何一個學生開始練中史，第一題已經係中等難度。
// 對邊緣分數考生而言，呢個係最容易令人放棄嘅設計。
//
// Yuna 2026-08-21 拍板：**唔准改標籤湊數**。把中等題改標籤做「容易」數字會好睇，
// 但嗰個係向學生講一個假難度，學生開頭就撞板，正正係我哋最想避免嘅事。
// 所以補底只能出新題。
//
// ── 「容易」點界定 ────────────────────────────────────────────────────────
// 容易 ≠ 純背誦。呢批每一條都係：
//   • 只考【一個】概念，唔需要跨事件推論
//   • 直接應用，唔設陷阱（干擾項明顯屬別的時代／別的制度）
//   • 但仍然要求理解該制度／事件【做咗咩】，而唔係淨係認得個名
// 例如唔問「軍機處喺邊個朝代設立」（純記年代），
// 而問「軍機處嘅設立令皇權出現咩變化」（要理解佢嘅作用）。
//
// ── 課程範圍 ──────────────────────────────────────────────────────────────
// 八個已登記課題各補 4–5 條，全部落喺中國歷史科課程之內。
// 真實卷面（HKEAA 2026 大綱）：卷一歷代發展 70%、卷二歷史專題 30%，**全卷無 MC**
// —— 故此批屬「知識檢查」而非卷面題型，作用是打好基礎再上卷一資料題。
//
// 本檔只【產生草稿】。入庫要行 review-drafts → 真人逐題批 → promote-drafts。
// ============================================================================
import { writeFileSync } from 'node:fs'

type P = [zh: string, en: string]
interface Q {
  t: keyof typeof T
  q: P
  o: P[] // 四個選項，第一個係正解（下面會記低 correctIndex 0；選項運行時洗牌）
  e: P
}

const T = {
  preqin: ['preqin_polity', '先秦政治', 'Pre-Qin Polity'],
  qinhan: ['qinhan_tang', '秦漢至隋唐制度', 'Qin–Tang Institutions'],
  songqing: ['song_qing', '宋元明清', 'Song to Qing'],
  lateqing: ['late_qing', '晚清變局', 'The Late Qing Crisis'],
  revolution: ['revolution', '辛亥革命', 'The 1911 Revolution'],
  republic: ['republic', '民國發展', 'The Republican Era'],
  prc: ['prc', '中共建國至改革', 'The PRC: Founding to Reform'],
  hktw: ['hk_taiwan', '香港與兩岸', 'Hong Kong and Cross-Strait Relations'],
} as const

const QS: Q[] = [
  // ── 先秦政治 ────────────────────────────────────────────────────────────
  {
    t: 'preqin',
    q: ['西周推行封建制度，把土地和人民分封予宗室、功臣。這種做法的主要目的是甚麼？',
      'Under the Western Zhou, land and people were granted to royal kinsmen and meritorious officials. What was the main purpose of this practice?'],
    o: [['使受封者在各地拱衛王室，鞏固周天子的統治', 'to have the enfeoffed lords guard the royal house in the regions and consolidate Zhou rule'],
      ['廢除世襲身分，改為按才能選任官員', 'to abolish hereditary status and appoint officials by ability'],
      ['把全國土地收歸中央直接管理', 'to bring all land under direct central administration'],
      ['以考試方式選拔地方管治人才', 'to select local administrators through examinations']],
    e: ['封建的本義是「封邦建國」：周天子把土地與人民授予宗室、功臣及舊貴族，讓他們在各地建立諸侯國，藉此屏藩王室。這是一種以血緣與分權維繫統治的辦法，與後世中央集權的郡縣制、以考試選才的科舉制，方向完全相反。',
      'Enfeoffment meant granting land and people to kinsmen, meritorious officials and old nobles so that they would establish states in the regions and shield the royal house. It maintained rule through kinship and devolved power — the opposite direction from the later centralised commandery system or selection by examination.'],
  },
  {
    t: 'preqin',
    q: ['宗法制度以「嫡長子繼承」為核心原則。這項原則主要解決了甚麼問題？',
      'The Zongfa (lineage) system centred on succession by the eldest son of the principal wife. Which problem did this principle mainly resolve?'],
    o: [['繼承次序的爭議，使權力與身分的傳遞有明確依據', 'disputes over the order of succession, giving the transmission of power and status a clear basis'],
      ['土地不足以分配予所有人口的問題', 'the shortage of land relative to population'],
      ['各諸侯國之間度量衡不統一的問題', 'the lack of uniform weights and measures between states'],
      ['官員貪污與行政效率低下的問題', 'official corruption and administrative inefficiency']],
    e: ['宗法制度確立大宗與小宗的尊卑秩序，規定由嫡長子繼承，其餘諸子分立為小宗。這樣一來，繼承次序有客觀依據，可以減少因爭位而起的內部衝突。它與封建制度互為表裏：封建解決土地與權力的分配，宗法解決繼承與身分名分。',
      'The Zongfa system fixed the hierarchy of senior and junior lines, with succession passing to the eldest son of the principal wife while other sons founded junior lines. Succession thus rested on an objective rule, reducing internal conflict over position. It worked alongside enfeoffment: enfeoffment distributed land and power, Zongfa settled succession and status.'],
  },
  {
    t: 'preqin',
    q: ['商鞅在秦國推行變法，其中「獎勵耕戰」的措施，直接鼓勵人民做甚麼？',
      'Among Shang Yang’s reforms in the state of Qin was a policy of rewarding farming and military service. What did it directly encourage the people to do?'],
    o: [['努力生產糧食及在戰場上立功，以換取爵位與賞賜', 'produce grain and win merit in battle in exchange for rank and reward'],
      ['遷居至城市經商，以增加國家稅收', 'move to cities and trade so as to increase state revenue'],
      ['研習儒家經典，以備日後出仕', 'study the Confucian classics in preparation for office'],
      ['開鑿運河及修築長城等大型工程', 'undertake major works such as canals and the Great Wall']],
    e: ['「耕」指農業生產，「戰」指軍功。商鞅把爵位與賞賜同這兩件事直接掛鈎：多產糧者可免徭役，斬敵首者可獲爵位。此舉把國家所需的糧食與兵源，轉化為個人可以爭取的實際利益，是秦國國力迅速上升的重要原因之一。',
      'Farming meant agricultural output; war meant battlefield merit. Shang Yang tied rank and reward directly to both: high producers were exempted from corvée, and those who took enemy heads gained rank. This converted the state’s need for grain and soldiers into concrete personal gain, and was one reason Qin’s strength rose so quickly.'],
  },
  {
    t: 'preqin',
    q: ['春秋時期出現「霸主」，這些霸主在名義上仍然尊奉周天子。這種情況反映了甚麼？',
      'During the Spring and Autumn period, hegemons arose who nominally still honoured the Zhou king. What does this indicate?'],
    o: [['周天子的實際權力已經衰落，但其名分仍有號召作用', 'the Zhou king’s actual power had declined, yet his nominal authority still carried weight'],
      ['周天子重新掌握了全國的軍事與財政大權', 'the Zhou king had regained full military and fiscal control of the realm'],
      ['各諸侯國已正式廢除周王室的名號', 'the states had formally abolished the Zhou royal title'],
      ['霸主已經統一全國，建立新的王朝', 'the hegemons had unified the realm and founded a new dynasty']],
    e: ['「尊王攘夷」正是這種局面的寫照：霸主憑實力號令諸侯，卻仍要打着周天子的旗號。這說明周王室的實權已經旁落，但其正當性尚未消失，仍可作為政治動員的名義。名分與實力分離，是理解春秋政局的關鍵。',
      '“Revere the king, expel the barbarians” captures the situation: hegemons commanded the states by strength yet still acted in the Zhou king’s name. Real power had passed from the royal house while its legitimacy had not yet disappeared, and could still serve as a banner for political mobilisation. This split between nominal status and actual power is the key to the period.'],
  },
  {
    t: 'preqin',
    q: ['戰國時期各國相繼變法，內容雖然不同，但普遍有一個共通方向。這個方向是甚麼？',
      'The Warring States all undertook reforms which, though differing in content, shared a common direction. What was it?'],
    o: [['加強君主與中央的權力，削弱世襲貴族', 'strengthening the ruler and the centre while weakening the hereditary nobility'],
      ['恢復西周的封建與宗法舊制', 'restoring the Western Zhou institutions of enfeoffment and lineage'],
      ['把政治權力交予各地商人團體', 'transferring political power to merchant groups in the regions'],
      ['放棄農業，全面發展手工業與貿易', 'abandoning agriculture in favour of handicrafts and trade']],
    e: ['無論是魏國的李悝、楚國的吳起，還是秦國的商鞅，變法的共同結果都是把權力由世襲貴族手上收歸君主。措施包括按功授爵而非按血統、以官僚取代封君治理地方、統一賦稅與法令。理解這條主線，就能明白何以戰國之後會走向中央集權的帝制。',
      'Whether Li Kui in Wei, Wu Qi in Chu or Shang Yang in Qin, the common result was to draw power from hereditary nobles to the ruler: rank by merit rather than birth, officials replacing enfeoffed lords in local government, and unified taxation and law. Grasping this thread explains why the Warring States gave way to a centralised imperial order.'],
  },

  // ── 秦漢至隋唐制度 ───────────────────────────────────────────────────────
  {
    t: 'qinhan',
    q: ['秦朝在全國推行郡縣制，取代封建。郡縣制與封建最根本的分別在於甚麼？',
      'The Qin extended the commandery-county system across the realm in place of enfeoffment. What was the most fundamental difference between the two?'],
    o: [['郡縣長官由中央任免，不得世襲', 'commandery and county officials were appointed and removed by the centre, and could not inherit their posts'],
      ['郡縣制之下不必向中央繳納賦稅', 'commanderies and counties paid no taxes to the centre'],
      ['郡縣長官須由當地百姓選舉產生', 'local officials were elected by the local population'],
      ['郡縣制只在邊疆地區實行', 'the system applied only in frontier regions']],
    e: ['封建之下，諸侯世代相傳，中央難以撤換；郡縣之下，守令由皇帝任免，任期屆滿即調動。這一點改變了權力的來源：官員的位置來自朝廷而非血統，因此必須向上負責。此後兩千年的中央集權，制度基礎就在於此。',
      'Under enfeoffment lords passed their domains to their heirs and the centre could hardly remove them; under the commandery system governors and magistrates were appointed and dismissed by the emperor and rotated at the end of their terms. This changed the source of power: an official held his post from the court rather than by birth, and therefore answered upward. Two millennia of centralised rule rest on this foundation.'],
  },
  {
    t: 'qinhan',
    q: ['漢武帝頒行「推恩令」，容許諸侯把封地分給各個兒子。這項措施實際上產生了甚麼效果？',
      'Emperor Wu of Han issued the “Decree of Grace”, allowing princes to divide their fiefs among all their sons. What effect did it actually produce?'],
    o: [['諸侯封地逐代分割而變小，勢力自然削弱', 'the fiefs were split in each generation and shrank, weakening the princes without confrontation'],
      ['諸侯的封地因合併而擴大', 'the fiefs were merged and became larger'],
      ['諸侯獲得自行任免中央官員的權力', 'princes gained the power to appoint and dismiss central officials'],
      ['朝廷取消了全部諸侯的爵位', 'the court abolished all princely titles outright']],
    e: ['表面上這是恩典：從前只有嫡長子承襲，如今諸子皆可分得土地。但封地總量不變，分得越多、每份越小，數代之後諸侯已無力對抗中央。此舉的高明之處，在於不必動武、不必背上苛待宗室之名，而收削藩之效。',
      'On its face this was a favour: where only the eldest son had inherited, now all sons received land. But the total area was fixed, so the more it was divided the smaller each portion became, and within a few generations no prince could challenge the centre. Its elegance lay in achieving the reduction of princely power without force and without the odium of harshness toward the imperial clan.'],
  },
  {
    t: 'qinhan',
    q: ['唐代三省之中，門下省的主要職能是甚麼？',
      'Among the Three Departments of the Tang, what was the principal function of the Chancellery (menxia)?'],
    o: [['審核詔令，認為不當者可以駁回', 'to review draft edicts and reject those it judged improper'],
      ['草擬詔令，決定政策內容', 'to draft edicts and set the content of policy'],
      ['執行詔令，統轄六部', 'to carry out edicts and oversee the Six Ministries'],
      ['負責考核官員及審理刑獄', 'to assess officials and try criminal cases']],
    e: ['三省分工是：中書省草擬、門下省審核、尚書省執行。門下省的封駁之權，使詔令在頒行之前多一道制衡；三個環節互相牽制，可以減少決策失誤，但同時亦令行政程序變長。理解這個分工，是掌握唐代中央制度的起點。',
      'The division was: the Secretariat drafted, the Chancellery reviewed, and the Department of State Affairs executed. The Chancellery’s power to return a draft placed a check before promulgation; the three stages restrained one another, reducing error but also lengthening the process. This division is the starting point for understanding Tang central government.'],
  },
  {
    t: 'qinhan',
    q: ['隋唐科舉制與漢代察舉制，在選拔官員的方式上最主要的分別是甚麼？',
      'What was the main difference between the Sui–Tang examination system and the Han recommendation system in selecting officials?'],
    o: [['科舉以考試成績取人，察舉靠地方長官推薦', 'the examinations selected by test performance, while recommendation relied on local officials putting names forward'],
      ['科舉只錄取宗室子弟，察舉面向全民', 'the examinations admitted only imperial kinsmen while recommendation was open to all'],
      ['科舉由地方自行決定，察舉由中央統一舉辦', 'the examinations were run locally while recommendation was organised centrally'],
      ['兩者的分別只在於名稱，程序完全相同', 'the two differed only in name, with identical procedures']],
    e: ['察舉以「孝廉」等名目由地方長官推薦，標準較主觀，日久易被門第與人際關係左右；科舉則設統一考試，以成績為據，寒門子弟因而多了一條上升途徑。這一改變擴闊了統治階層的來源，是理解唐宋社會流動的關鍵。',
      'Recommendation worked through categories such as “filial and incorrupt”, put forward by local officials on fairly subjective criteria, and over time came to be shaped by pedigree and connection. The examinations set a uniform test judged on performance, opening a route of advancement to men of modest background. This widened the pool from which the governing class was drawn and is central to understanding social mobility under the Tang and Song.'],
  },
  {
    t: 'qinhan',
    q: ['唐代中葉推行兩稅法，改以土地與資產多寡作為徵稅依據。這項改變回應了甚麼實際問題？',
      'In the mid-Tang the Two-Tax system began assessing tax on land and assets. Which practical problem did this change address?'],
    o: [['土地兼併令原有按人丁徵稅的辦法難以維持', 'land concentration had made the older head-based levy unworkable'],
      ['人口大幅增加，朝廷須增設新的稅目', 'the population had grown sharply, requiring new categories of tax'],
      ['對外貿易興盛，須改為徵收關稅', 'foreign trade had flourished, requiring a shift to customs duties'],
      ['朝廷決定全面免除農民的賦稅', 'the court had decided to exempt farmers from taxation entirely']],
    e: ['租庸調制建基於均田制，按人丁徵收。當土地兼併日益嚴重，農民失地而戶籍失實，按人丁徵稅便收不上來。兩稅法改按土地與資產徵收、一年分夏秋兩次繳納，等於承認了土地已經集中的現實。制度隨現實而改，是這一課的重點。',
      'The earlier system rested on the equal-field allotment and was levied per adult male. As land became concentrated, farmers lost their holdings and household registers ceased to reflect reality, so a head-based levy could no longer be collected. The Two-Tax system assessed land and assets instead, collected twice yearly — in effect an acknowledgement that concentration had already occurred. Institutions changing to fit reality is the point of this topic.'],
  },

  // ── 宋元明清 ────────────────────────────────────────────────────────────
  {
    t: 'songqing',
    q: ['宋太祖以「杯酒釋兵權」收回將領兵權，並確立重文輕武的方針。這項方針最主要想防止甚麼？',
      'Song Taizu recovered military power from his generals and established a policy of favouring civil over military office. What was this policy chiefly meant to prevent?'],
    o: [['武將擁兵自重，重演唐末五代的藩鎮割據', 'generals building up private forces and repeating the warlordism of the late Tang and Five Dynasties'],
      ['文官結黨營私，把持朝政', 'civil officials forming factions and monopolising the court'],
      ['外族入侵中原，佔領首都', 'foreign invasion of the central plain and seizure of the capital'],
      ['地方百姓拒絕繳納賦稅', 'local populations refusing to pay taxes']],
    e: ['唐末以來，藩鎮割據、軍人擁立，政權更迭頻繁。宋初的制度設計正是針對這一病根：收兵權於中央、以文臣統兵、將領常調不久任。此舉確實避免了內部軍人專權，但同時削弱了軍隊的戰力，形成宋代對外長期被動的局面 —— 制度往往在解決一個問題的同時製造另一個。',
      'From the late Tang onward, regional commanders held their own troops and soldiers made and unmade rulers, so regimes changed rapidly. Early Song institutions targeted exactly this: military authority was drawn to the centre, civil officials commanded troops, and generals were rotated so as not to hold a post long. Internal military domination was indeed avoided, but fighting strength suffered, leaving the Song persistently on the defensive — institutions often create one problem while solving another.'],
  },
  {
    t: 'songqing',
    q: ['王安石變法之中的「青苗法」，主要針對農民的哪一個困境？',
      'Among Wang Anshi’s reforms, the “green shoots” policy chiefly addressed which difficulty faced by farmers?'],
    o: [['青黃不接時被迫向富戶借高利貸', 'being forced to borrow from wealthy households at high interest between harvests'],
      ['耕地面積不足，無法種植足夠糧食', 'holdings too small to grow enough grain'],
      ['缺乏農具與耕牛，無法開墾荒地', 'lacking tools and draught animals to open new land'],
      ['稅率過高，收成大部分須上繳', 'tax rates so high that most of the harvest went to the state']],
    e: ['「青黃不接」指舊糧已盡、新苗未熟的那一段時間。農民在此時最缺現金，往往要向富戶借貸，利息極重，一旦還不起便要賣地。青苗法由官府在此時貸出錢穀，收取較低利息，用意是把這一段的高利貸需求接過來。理解政策所針對的具體困境，比記住政策名稱重要得多。',
      'The gap between the exhaustion of the old grain and the ripening of the new was when farmers were shortest of cash; they often borrowed from wealthy households at heavy interest, and a failure to repay could cost them their land. The policy had the government lend cash or grain at that point at lower interest, taking over that demand. Understanding the specific difficulty a policy targets matters far more than remembering its name.'],
  },
  {
    t: 'songqing',
    q: ['明太祖廢除丞相一職，把六部直接置於皇帝之下。這項改動對皇權有甚麼影響？',
      'The Ming founder abolished the office of chief councillor and placed the Six Ministries directly under the emperor. What was the effect on imperial power?'],
    o: [['皇權大為集中，但皇帝的日常政務負擔亦大增', 'imperial power became far more concentrated, while the emperor’s daily workload rose sharply'],
      ['皇權受到削弱，六部得以自行決策', 'imperial power was weakened and the Six Ministries decided matters themselves'],
      ['皇帝從此不再參與行政事務', 'the emperor ceased to take part in administration'],
      ['地方督撫取得任免中央官員之權', 'provincial governors gained the power to appoint central officials']],
    e: ['丞相原是皇帝與六部之間的中介，既分擔政務，亦在一定程度上制衡皇權。廢相之後，六部直達御前，權力盡歸皇帝，但所有奏章亦須皇帝親自處理。其後設立內閣以協助票擬，正是這個負擔的直接後果 —— 制度上被廢除的職能，實際上會以另一種形式回來。',
      'The chief councillor had stood between emperor and ministries, both sharing the burden and to some degree checking the throne. With the office gone, the ministries reported directly and all power rested with the emperor — but so did every memorial. The later creation of the Grand Secretariat to prepare draft rescripts was a direct consequence of that burden: a function abolished on paper tends to return in another form.'],
  },
  {
    t: 'songqing',
    q: ['清代設立軍機處，由皇帝親信大臣承旨辦事。軍機大臣的權力性質是甚麼？',
      'The Qing established the Grand Council, staffed by trusted ministers who acted on the emperor’s instructions. What was the nature of their power?'],
    o: [['只負責承旨擬辦，本身並無決策權', 'they merely drafted and executed on instruction, holding no decision-making power of their own'],
      ['可以否決皇帝的旨意', 'they could veto the emperor’s decisions'],
      ['握有獨立的兵權與財權', 'they held independent military and fiscal authority'],
      ['由科舉考試成績最優者自動出任', 'the posts went automatically to the top examination graduates']],
    e: ['軍機處的特點是「述而不作」：軍機大臣把皇帝的意旨草擬成文，迅速下達，本身不設官署、無屬員、亦無定制。正因為它沒有制度化的權力，皇帝反而可以完全掌握。這與唐代三省互相制衡的設計恰恰相反，是清代皇權高度集中的標誌。',
      'The Council’s character was to transmit rather than originate: its ministers turned the emperor’s intentions into text and sent them out quickly, with no yamen of their own, no subordinate staff and no fixed establishment. Precisely because its power was never institutionalised, the emperor retained full control. This is the opposite of the Tang design of three mutually checking departments, and marks the height of Qing autocratic concentration.'],
  },
  {
    t: 'songqing',
    q: ['明清科舉以八股文取士，考生須按固定格式作答。這種做法對讀書人的學習方向有甚麼影響？',
      'Ming and Qing examinations selected candidates through the “eight-legged essay”, answered in a fixed format. How did this shape what scholars studied?'],
    o: [['讀書人集中鑽研應試格式與指定經籍，學問範圍收窄', 'scholars concentrated on the required form and the prescribed classics, narrowing the range of learning'],
      ['讀書人普遍轉向研習自然科學與技術', 'scholars turned in large numbers to natural science and technology'],
      ['科舉錄取名額大增，讀書人數目下降', 'quotas rose sharply and the number of scholars fell'],
      ['考試內容每年更換，讀書人無從準備', 'the syllabus changed annually so that preparation was impossible']],
    e: ['格式一旦固定，備試的最有效方法就是熟習格式本身。考生把精力放在破題、承題、起講等程式，以及指定經籍的註疏之上，其他學問自然相對受冷落。這並非說當時無人研究實學，而是制度的誘因把大多數人引向同一條路 —— 考試怎樣考，人就怎樣學。',
      'Once the form was fixed, the most efficient preparation was to master the form itself. Candidates put their effort into the prescribed opening, elaboration and exposition, and into the standard commentaries on the set classics, leaving other learning comparatively neglected. This is not to say practical studies had no students, but that the incentives of the system drew most people down one path — people study the way the examination examines.'],
  },

  // ── 晚清變局 ────────────────────────────────────────────────────────────
  {
    t: 'lateqing',
    q: ['《南京條約》是中國近代第一條不平等條約。以下哪一項是該條約的內容？',
      'The Treaty of Nanjing was the first of China’s modern unequal treaties. Which of the following was among its terms?'],
    o: [['開放五口通商，並割讓香港島', 'the opening of five ports to trade and the cession of Hong Kong Island'],
      ['准許外國在中國內地開設工廠', 'permission for foreigners to open factories in the Chinese interior'],
      ['清廷須派遣留學生前往歐洲', 'a requirement that the Qing send students to study in Europe'],
      ['列強共同保證中國的領土完整', 'a joint guarantee by the powers of China’s territorial integrity']],
    e: ['條約主要內容包括：開放廣州、廈門、福州、寧波、上海五口通商，割讓香港島，賠款，以及協定關稅。當中「協定關稅」影響最深遠 —— 中國從此不能自主決定稅率。至於在內地設廠，是《馬關條約》之後的事，兩者相隔半個世紀，不可混淆。',
      'Its main terms opened Guangzhou, Xiamen, Fuzhou, Ningbo and Shanghai to trade, ceded Hong Kong Island, imposed an indemnity and fixed tariffs by agreement. The tariff clause had the deepest consequences: China could no longer set its own rates. The right to open factories in the interior came half a century later with the Treaty of Shimonoseki, and the two should not be confused.'],
  },
  {
    t: 'lateqing',
    q: ['洋務運動以「自強」、「求富」為口號。它所引進的主要是甚麼？',
      'The Self-Strengthening Movement took “self-strengthening” and “seeking wealth” as its slogans. What did it chiefly import?'],
    o: [['西方的軍事技術與機器工業', 'Western military technology and machine industry'],
      ['西方的議會制度與憲法', 'Western parliamentary institutions and constitutions'],
      ['西方的教育制度與科舉改革', 'Western education systems and reform of the civil examinations'],
      ['西方的宗教信仰與社會習俗', 'Western religion and social customs']],
    e: ['洋務派的基本主張是「中學為體、西學為用」：制度與價值仍守中國舊有，只在器物層面學習西方。因此所辦的是船政局、機器局、招商局一類事業。甲午戰敗令這條路線受到根本質疑 —— 若制度不變，單靠器物是否足以自強？其後的維新與革命，都是對這個問題的回答。',
      'The movement’s premise was “Chinese learning as the substance, Western learning for use”: institutions and values were to remain Chinese, with borrowing confined to the material level. Hence shipyards, arsenals and merchant steamship enterprises. Defeat in 1895 called the whole approach into question — could material borrowing alone bring strength if institutions stayed unchanged? The reform and revolutionary movements that followed were answers to that question.'],
  },
  {
    t: 'lateqing',
    q: ['戊戌變法在推行約一百日之後即告失敗。變法的主要主張是甚麼？',
      'The Hundred Days’ Reform failed after roughly a hundred days. What did the reformers mainly advocate?'],
    o: [['仿效外國推行君主立憲，並改革教育與行政', 'adopting a constitutional monarchy on foreign models, together with educational and administrative reform'],
      ['推翻清廷，建立共和政體', 'overthrowing the Qing and establishing a republic'],
      ['全面恢復明代的政治制度', 'a full restoration of Ming political institutions'],
      ['把全國土地平均分配予農民', 'redistributing all land equally among farmers']],
    e: ['維新派主張在保留皇室的前提下改革制度：設議院、改科舉、辦新式學堂、裁汰冗員。這與洋務運動只學器物不同，已觸及制度層面；但亦與革命派主張推翻帝制不同。分清「改良」與「革命」兩條路線，是理解晚清政治最重要的一組區分。',
      'The reformers sought institutional change while keeping the throne: a parliament, reform of the examinations, new-style schools and the removal of sinecures. This went beyond the Self-Strengthening Movement’s material borrowing to touch institutions, yet stopped short of the revolutionaries’ aim of ending the monarchy. Distinguishing reform from revolution is the single most important distinction in late Qing politics.'],
  },
  {
    t: 'lateqing',
    q: ['《馬關條約》簽訂之後，列強在中國掀起劃分勢力範圍的浪潮。這反映了甚麼？',
      'After the Treaty of Shimonoseki, the powers moved to carve out spheres of influence in China. What does this reflect?'],
    o: [['清廷的軍事與外交弱點已完全暴露，列強因而加緊侵奪', 'the full exposure of Qing military and diplomatic weakness, which emboldened the powers to press further'],
      ['列強決定共同協助中國推行現代化', 'a decision by the powers to help China modernise together'],
      ['清廷主動邀請列強分區管理中國', 'a Qing initiative inviting the powers to administer China by region'],
      ['中國的對外貿易額大幅下降', 'a sharp fall in China’s foreign trade']],
    e: ['甲午一役，清廷敗於此前被視為東亞小國的日本，其虛弱程度再無可掩飾。列強由此判斷清廷已無力抵抗，遂爭相租借港灣、修築鐵路、劃定勢力範圍。這一段是理解其後義和團與辛丑條約的直接背景：民間的排外情緒，正是在瓜分危機之下急速升溫。',
      'Defeat by a Japan long regarded as a small East Asian state left Qing weakness impossible to conceal. Concluding that the dynasty could no longer resist, the powers competed for leased harbours, railway concessions and demarcated spheres. This is the immediate background to the Boxer episode and the 1901 protocol: popular anti-foreign feeling rose sharply under the threat of partition.'],
  },

  // ── 辛亥革命 ────────────────────────────────────────────────────────────
  {
    t: 'revolution',
    q: ['孫中山提出的三民主義，包括民族、民權、民生三項。其中「民權主義」主要主張甚麼？',
      'Sun Yat-sen’s Three Principles comprised nationalism, democracy and people’s livelihood. What did the principle of democracy chiefly advocate?'],
    o: [['建立共和政體，主權屬於全體國民', 'establishing a republic in which sovereignty rests with the whole people'],
      ['以武力驅逐所有外國人離開中國', 'expelling all foreigners from China by force'],
      ['平均分配土地，消除貧富差距', 'redistributing land equally to remove the gap between rich and poor'],
      ['恢復漢族的傳統禮儀與服飾', 'restoring Han traditional rites and dress']],
    e: ['三項各有所指：民族主義針對滿清統治與列強壓迫，民權主義針對君主專制，民生主義針對土地與貧富問題。把三者分清是答題的基本功 —— 平均地權屬民生主義，不屬民權主義；而民權主義的核心，是把主權由君主移交國民。',
      'Each principle had its own target: nationalism addressed Manchu rule and foreign pressure; democracy addressed autocratic monarchy; livelihood addressed land and inequality. Keeping them apart is basic: equalising land rights belongs to livelihood, not democracy, whose core is the transfer of sovereignty from monarch to people.'],
  },
  {
    t: 'revolution',
    q: ['一九一一年武昌起義爆發之後，短時間內多個省份宣布獨立。這反映了當時的甚麼情況？',
      'After the Wuchang uprising of 1911, several provinces declared independence within a short time. What does this indicate?'],
    o: [['清廷對地方的控制力已經十分薄弱', 'Qing control over the provinces had already become very weak'],
      ['革命黨在各省均已掌握軍政大權', 'the revolutionaries already held military and civil power in every province'],
      ['列強公開出兵支持革命', 'the foreign powers had openly sent troops in support of the revolution'],
      ['清廷主動宣布放棄統治', 'the Qing court had voluntarily announced its abdication of rule']],
    e: ['武昌起義本身規模有限，但引發連鎖反應。各省宣布獨立者，既有革命黨人，亦有原有的立憲派與地方軍政人物 —— 他們未必認同革命的主張，只是判斷清廷已無力維持。這說明清朝的崩解，與其說是被推翻，不如說是無人再願意支撐。',
      'The Wuchang rising was limited in scale but set off a chain reaction. Those declaring independence included revolutionaries but also constitutionalists and existing provincial military and civil figures — men who need not have shared the revolutionary programme, but judged that the dynasty could no longer hold. The Qing collapse was less an overthrow than a withdrawal of support.'],
  },
  {
    t: 'revolution',
    q: ['中華民國成立之後，袁世凱取代孫中山出任臨時大總統。促成這一結果的主要條件是甚麼？',
      'After the Republic was founded, Yuan Shikai replaced Sun Yat-sen as provisional president. What was the main condition that produced this outcome?'],
    o: [['袁世凱掌握北洋軍，是當時實力最強的一方', 'Yuan commanded the Beiyang army and was the strongest force of the day'],
      ['袁世凱在同盟會之中資歷最深', 'Yuan was the most senior figure within the Revolutionary Alliance'],
      ['孫中山在選舉之中落敗', 'Sun was defeated in an election'],
      ['列強一致反對孫中山出任總統', 'the powers unanimously opposed Sun as president']],
    e: ['革命陣營當時缺乏足以統一全國的武力，而清廷則須靠袁世凱的北洋軍支撐。雙方各有所需：革命方要清帝退位，袁世凱要總統之位。這宗交易令共和迅速成立，卻亦把新政權的實權交到舊有軍事集團手上，為其後的政局動盪埋下伏線。',
      'The revolutionary camp lacked the force to unify the country, while the court depended on Yuan’s Beiyang army to survive. Each side needed something: the revolutionaries wanted abdication, Yuan wanted the presidency. The bargain brought the republic quickly into being, but placed real power in the hands of the existing military bloc — the seed of the instability that followed.'],
  },
  {
    t: 'revolution',
    q: ['辛亥革命結束了在中國實行兩千多年的哪一種政治制度？',
      'The 1911 Revolution ended which political institution, in place in China for over two thousand years?'],
    o: [['君主專制的帝制', 'the imperial system of autocratic monarchy'],
      ['科舉取士制度', 'selection of officials by examination'],
      ['郡縣地方行政制度', 'the commandery-and-county system of local administration'],
      ['宗法家族制度', 'the lineage system of family organisation']],
    e: ['自秦統一以來，帝制延續兩千餘年，辛亥革命使之終結，此後任何政權都難以公開回復帝制 —— 袁世凱稱帝迅速失敗，正說明這一點。至於科舉，早在一九○五年已停辦；郡縣式的地方行政則以另一種形式延續至今。分清哪一項被終結，是本題的關鍵。',
      'The imperial system had run for over two millennia since the Qin unification; the 1911 Revolution ended it, and thereafter no regime could openly restore it — Yuan Shikai’s swift failure as emperor demonstrates the point. The examinations had already been abolished in 1905, while commandery-style local administration continues in altered form to this day. Identifying which institution actually ended is the point of the question.'],
  },

  // ── 民國發展 ────────────────────────────────────────────────────────────
  {
    t: 'republic',
    q: ['新文化運動提倡「德先生」與「賽先生」。這兩個稱呼分別指甚麼？',
      'The New Culture Movement called for “Mr De” and “Mr Sai”. To what did these refer?'],
    o: [['民主與科學', 'democracy and science'],
      ['道德與宗教', 'morality and religion'],
      ['德國與塞爾維亞', 'Germany and Serbia'],
      ['法治與實業', 'the rule of law and industry']],
    e: ['「德先生」是 Democracy 的音譯，「賽先生」是 Science 的音譯。新文化運動的主張，是以民主與科學取代舊有的權威與迷信，並以白話文取代文言以擴大傳播。把兩者連同白話文運動一併理解，才看得出這場運動針對的是整個思想與表達的方式，而不只是某一項制度。',
      '“Mr De” transliterates Democracy and “Mr Sai” Science. The movement urged that democracy and science replace inherited authority and superstition, and that vernacular writing replace classical Chinese so that ideas could travel further. Read together with the vernacular movement, it becomes clear the target was the whole mode of thought and expression, not any single institution.'],
  },
  {
    t: 'republic',
    q: ['一九一九年五四運動爆發，直接的導火線是甚麼？',
      'What was the immediate trigger of the May Fourth Movement of 1919?'],
    o: [['巴黎和會決定把德國在山東的權益轉讓予日本', 'the Paris Peace Conference transferring German rights in Shandong to Japan'],
      ['日本發動九一八事變佔領東北', 'Japan’s seizure of the Northeast in the Mukden Incident'],
      ['袁世凱宣布恢復帝制', 'Yuan Shikai’s announcement restoring the monarchy'],
      ['清帝正式宣布退位', 'the formal abdication of the Qing emperor']],
    e: ['中國以戰勝國身分出席巴黎和會，原以為可以收回德國在山東的權益，結果和會決定轉予日本。消息傳回，北京學生上街，其後蔓延至全國各界。留意時序：九一八在一九三一年、袁世凱稱帝在一九一五至一六年、清帝退位在一九一二年，三者均在五四之前或之後，不可作導火線。',
      'China attended the Paris conference as a victor and expected the return of German rights in Shandong; the conference assigned them to Japan instead. The news brought students onto the streets in Beijing and then spread nationwide. Note the chronology: the Mukden Incident was 1931, Yuan’s monarchy 1915–16, and the abdication 1912 — none can serve as the trigger.'],
  },
  {
    t: 'republic',
    q: ['一九三六年西安事變的直接結果是甚麼？',
      'What was the immediate outcome of the Xi’an Incident of 1936?'],
    o: [['促成國共停止內戰、共同抗日', 'it brought the civil war to a halt and led the Nationalists and Communists to resist Japan jointly'],
      ['國民政府正式向日本宣戰', 'the Nationalist government formally declared war on Japan'],
      ['中共放棄根據地，接受國民政府改編', 'the Communists abandoned their base areas and accepted Nationalist reorganisation'],
      ['日本被迫撤出東北', 'Japan was forced to withdraw from the Northeast']],
    e: ['事變之後，內戰停止，第二次國共合作隨之形成。留意「直接結果」四字：正式對日宣戰是在一九四一年珍珠港事件之後，與西安事變相隔五年；日本撤出東北則要待一九四五年戰爭結束。答此類題目時，先確認題目問的是即時結果還是長遠影響。',
      'After the incident the civil war stopped and the second united front took shape. Note the words “immediate outcome”: the formal declaration of war came only after Pearl Harbor in 1941, five years later, and Japan left the Northeast only at the war’s end in 1945. With questions of this kind, first establish whether the immediate result or the longer consequence is being asked for.'],
  },
  {
    t: 'republic',
    q: ['南京國民政府時期，中國在對外關係上取得的一項具體進展是甚麼？',
      'What concrete gain did China achieve in its foreign relations during the Nanjing government period?'],
    o: [['逐步收回關稅自主權', 'the progressive recovery of tariff autonomy'],
      ['廢除了全部外國在華的租界', 'the abolition of all foreign concessions in China'],
      ['成為國際聯盟的常任理事國', 'a permanent seat on the Council of the League of Nations'],
      ['與日本簽訂互不侵犯條約', 'a non-aggression treaty with Japan']],
    e: ['關稅自主是自《南京條約》以來被剝奪的權利，南京政府透過逐一改訂條約，於一九三○年代初大致恢復，是「改訂新約運動」較明顯的成果。至於租界，要到一九四三年才在戰時陸續交還；其餘兩項則與史實不符。評價這一時期，宜同時看到其成果與其未竟之處。',
      'Tariff autonomy had been lost since the Treaty of Nanjing; by renegotiating treaties one by one the Nanjing government largely recovered it in the early 1930s, the clearest fruit of its treaty-revision campaign. The concessions were returned only during the war from 1943, while the other two options do not match the record. Assessing this period means seeing both what was achieved and what was left undone.'],
  },

  // ── 中共建國至改革 ───────────────────────────────────────────────────────
  {
    t: 'prc',
    q: ['第一個五年計劃（一九五三至一九五七年）的重點放在哪一方面？',
      'On what did the First Five-Year Plan (1953–1957) concentrate?'],
    o: [['優先發展重工業，建立工業基礎', 'giving priority to heavy industry so as to build an industrial base'],
      ['優先發展輕工業與消費品生產', 'giving priority to light industry and consumer goods'],
      ['開放沿海地區吸引外資', 'opening the coastal regions to attract foreign investment'],
      ['把土地分配予農民私人擁有', 'distributing land into private ownership by farmers']],
    e: ['一五計劃以蘇聯援助的成套設備為骨幹，集中資源興建鋼鐵、機械、能源等重工業項目。當時的判斷是：沒有重工業就沒有國防與工業化的基礎。至於吸引外資與開放沿海，是一九七八年之後的事，兩者相隔二十餘年，不可混淆。',
      'The plan was built around complete plants supplied with Soviet assistance, concentrating resources on steel, machinery and energy. The judgement of the time was that without heavy industry there could be no basis for defence or industrialisation. Attracting foreign investment and opening the coast belong to the period after 1978, more than two decades later.'],
  },
  {
    t: 'prc',
    q: ['一九七八年十一屆三中全會之後，中國在農村推行家庭聯產承包責任制。這項制度改變了甚麼？',
      'After the Third Plenum of 1978, China introduced the household responsibility system in the countryside. What did it change?'],
    o: [['把生產經營的決定權交回農戶，並容許保留超額收成', 'it returned decisions over production to individual households and let them keep output above quota'],
      ['把全部農地收歸國家直接經營', 'it brought all farmland under direct state operation'],
      ['取消農業稅，並向農戶發放補貼', 'it abolished agricultural tax and paid subsidies to households'],
      ['把農民全部遷入城市從事工業', 'it moved farmers into cities to work in industry']],
    e: ['人民公社時期，生產由集體統一安排，個人努力與所得之間關係薄弱。承包制把土地經營權下放到農戶，完成定額之後的收成歸自己，等於把努力與回報重新連上。理解這一點，就明白何以農業產出在短期內明顯上升 —— 改變的不是土地本身，而是誰承擔後果。',
      'Under the communes production was arranged collectively and the link between individual effort and reward was weak. The responsibility system devolved management of the land to households, which kept what they produced beyond the quota — reconnecting effort to return. That is why output rose noticeably within a short period: what changed was not the land but who bore the consequences.'],
  },
  {
    t: 'prc',
    q: ['一九八○年，中國設立第一批經濟特區。設立經濟特區的主要用意是甚麼？',
      'China established its first special economic zones in 1980. What was their main purpose?'],
    o: [['在局部地區試行對外開放與市場做法，再視成效推廣', 'to try out openness and market practices in limited areas, then extend them if they worked'],
      ['把重工業由內陸遷往沿海', 'to move heavy industry from the interior to the coast'],
      ['作為安置農村剩餘人口的居住區', 'to house surplus rural population'],
      ['專門用作軍事與國防工業基地', 'to serve as bases for military and defence industry']],
    e: ['特區的設計思路是「先試後推」：在可控的範圍內容許外資、優惠稅制與較靈活的用工制度，觀察成效與問題，再決定是否擴大。這種做法把改革的風險局限在局部，同時保留了退路。深圳、珠海、汕頭、廈門的位置亦有考慮 —— 均鄰近港澳台，便於引入資金與訂單。',
      'The design was to try first and extend later: within a controllable area, foreign investment, tax concessions and more flexible employment were permitted so that results and problems could be observed before any wider decision. This confined the risk of reform to a limited area while keeping a way back. The locations were chosen with care — Shenzhen, Zhuhai, Shantou and Xiamen all lie close to Hong Kong, Macao and Taiwan, easing the inflow of capital and orders.'],
  },
  {
    t: 'prc',
    q: ['「文化大革命」對中國的教育造成了甚麼直接影響？',
      'What was the direct effect of the Cultural Revolution on education in China?'],
    o: [['正常教學與招生長期中斷，造成人才培養的斷層', 'normal teaching and admissions were interrupted for years, creating a gap in the training of skilled people'],
      ['高等院校數目大幅增加', 'the number of higher institutions increased sharply'],
      ['義務教育年限由六年延長至九年', 'compulsory schooling was extended from six years to nine'],
      ['大量學生獲派往歐美留學', 'large numbers of students were sent to study in Europe and North America']],
    e: ['大專院校停止正常招生多年，中小學教學亦嚴重受擾。其後果不止於當時：一代人的專業訓練出現缺口，而這批人本應在其後數十年成為各行業的骨幹。評價這段歷史時，須把即時的衝擊與這種延後才顯現的長期代價分開來看。',
      'Higher institutions ceased normal admissions for years and schooling was badly disrupted. The consequence outlasted the period: a gap opened in one generation’s professional training, and that generation would otherwise have formed the backbone of many fields in the decades after. Assessing this era means separating the immediate damage from the delayed, long-term cost.'],
  },

  // ── 香港與兩岸 ──────────────────────────────────────────────────────────
  {
    t: 'hktw',
    q: ['一八九八年《展拓香港界址專條》與此前兩條條約在性質上有一項重要分別。這項分別是甚麼？',
      'The 1898 Convention for the Extension of Hong Kong Territory differed in one important respect from the two earlier treaties. What was it?'],
    o: [['新界屬租借而非割讓，並訂有九十九年期限', 'the New Territories were leased rather than ceded, for a fixed term of ninety-nine years'],
      ['新界由英國與清廷共同管治', 'the New Territories were to be jointly administered by Britain and the Qing'],
      ['新界的主權即時交還中國', 'sovereignty over the New Territories reverted to China immediately'],
      ['該條約並未涉及任何土地', 'the convention concerned no territory at all']],
    e: ['香港島（一八四二）與九龍（一八六○）屬割讓，理論上無期限；新界（一八九八）則為租借，訂明九十九年。正因為租期有明確終點，一九九七這個年份才成為其後談判的起點 —— 一項條約的性質，可以在近百年後決定政治日程。',
      'Hong Kong Island (1842) and Kowloon (1860) were ceded, in principle without limit; the New Territories (1898) were leased, with ninety-nine years stated. Precisely because the lease had a definite end, 1997 became the starting point of the later negotiations — the character of a treaty can set a political timetable almost a century afterwards.'],
  },
  {
    t: 'hktw',
    q: ['一九八四年《中英聯合聲明》主要處理了甚麼事項？',
      'What did the Sino-British Joint Declaration of 1984 principally settle?'],
    o: [['中國於一九九七年恢復對香港行使主權的安排', 'the arrangements for China to resume the exercise of sovereignty over Hong Kong in 1997'],
      ['香港與內地之間的關稅安排', 'customs arrangements between Hong Kong and the mainland'],
      ['新界租約再延長九十九年', 'a further ninety-nine-year extension of the New Territories lease'],
      ['英國把香港交予聯合國託管', 'the placing of Hong Kong under United Nations trusteeship']],
    e: ['聲明訂明中國於一九九七年七月一日恢復對香港行使主權，並設立特別行政區，實行「一國兩制」。其後《基本法》於一九九○年頒布，把這些原則具體化為憲制文件。把聲明與基本法的先後與分工分清楚，是這一課常見的失分位。',
      'The declaration provided that China would resume the exercise of sovereignty on 1 July 1997 and establish a special administrative region under “one country, two systems”. The Basic Law, promulgated in 1990, turned these principles into a constitutional instrument. Keeping the sequence and the respective roles of the two documents straight is where marks are commonly lost.'],
  },
  {
    t: 'hktw',
    q: ['二十世紀五十至七十年代，香港由轉口港轉型為工業城市。以下哪一項是這次轉型的重要條件？',
      'Between the 1950s and 1970s Hong Kong changed from an entrepôt into an industrial city. Which was an important condition for this?'],
    o: [['大量南來的資金、技術與勞動力', 'the large inflow of capital, skills and labour from the mainland'],
      ['英國政府提供的大額工業補貼', 'substantial industrial subsidies from the British government'],
      ['本地豐富的煤鐵等天然資源', 'abundant local natural resources such as coal and iron'],
      ['內地在此期間全面開放對外貿易', 'a full opening of mainland foreign trade during this period']],
    e: ['轉型的條件由兩方面構成：外部的推力（韓戰引致的禁運令轉口貿易受阻）與本地的要素（南來的資本、機器、企業經驗，加上大量新增而工資偏低的勞動力）。香港本身並無煤鐵，工業以輕工業為主；而內地全面開放對外貿易，要待一九七八年之後。',
      'Two things came together: an external push — the embargo arising from the Korean War blocked the entrepôt trade — and local factors: incoming capital, machinery and entrepreneurial experience, together with a large, newly arrived and low-wage workforce. Hong Kong had no coal or iron of its own, and its industry was accordingly light; the mainland’s full opening to foreign trade came only after 1978.'],
  },
  {
    t: 'hktw',
    q: ['一九四九年之後，海峽兩岸長期處於分治狀態。造成這一局面的直接原因是甚麼？',
      'After 1949 the two sides of the Taiwan Strait remained separately governed for decades. What was the direct cause?'],
    o: [['國共內戰結束後，國民政府遷往台灣', 'the Nationalist government moved to Taiwan at the end of the civil war'],
      ['台灣在戰後由日本繼續管治', 'Taiwan remained under Japanese administration after the war'],
      ['聯合國決議把台灣列為託管地', 'a United Nations resolution placed Taiwan under trusteeship'],
      ['兩岸在一九四九年簽訂分治協議', 'the two sides signed a partition agreement in 1949']],
    e: ['一九四五年台灣已由日本交還中國；一九四九年內戰結束，國民政府遷台，兩岸自此分治。答此類題目要留意「直接原因」與「背景」之別：日本殖民統治的五十年是背景，內戰的結局才是直接原因。至於託管與分治協議，均與史實不符。',
      'Taiwan had been returned by Japan in 1945; when the civil war ended in 1949 the Nationalist government relocated there, and the two sides have been separately governed since. Note the difference between the direct cause and the background: fifty years of Japanese colonial rule is background, while the outcome of the civil war is the direct cause. Trusteeship and a partition agreement do not match the record.'],
  },
]

// 產出
// 正解位置輪流放 0→1→2→3。
// 唔係因為前端唔洗牌（PracticeSession 每次都會洗），而係為咗【人手覆核】——
// 一份條條正解都排第一嘅草稿，審批嘅人好易養成「睇第一個」嘅習慣，
// 等於冇審過干擾項。輪流放，逼人逐個選項讀。
const rotate = <T,>(arr: T[], k: number) => arr.slice(-k % arr.length || arr.length).concat(arr.slice(0, -k % arr.length || arr.length))

const rows = QS.map((q, i) => {
  const [tid, tzh, ten] = T[q.t]
  const k = i % 4
  const opts = rotate(q.o, k)
  return {
    id: `chist_floor_${String(i + 1).padStart(2, '0')}`,
    type: 'mc',
    subject: 'chinese-history',
    topic: tzh, topicId: tid, topicZh: tzh, topicEn: ten,
    difficulty: 'basic',
    question: q.q[0], questionEn: q.q[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: k,
    explanation: q.e[0], explanationEn: q.e[1],
  }
})

const OUT = 'scripts/qbank/drafts/chinese-history-floor.json'
writeFileSync(OUT, JSON.stringify(rows, null, 2) + '\n')
console.log(`✅ ${rows.length} 條容易題 → ${OUT}`)
const byT: Record<string, number> = {}
for (const q of QS) byT[T[q.t][1]] = (byT[T[q.t][1]] ?? 0) + 1
console.log('   課題分佈', JSON.stringify(byT))
