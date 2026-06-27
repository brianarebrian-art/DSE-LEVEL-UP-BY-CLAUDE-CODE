import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Geography "hell" set (genuine 5★★). Tests the full PROCESS CHAIN (not a label):
// subduction → hazards, meander erosion/deposition, rainforest nutrient cycle,
// relief rainfall, urban heat island. Distractors swap constructive/destructive
// margins, erosion/deposition sides, or the location of rainforest nutrients.
// All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('geography')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  process: { id: 'geo_process_chain', zh: '地理過程・因果鏈', en: 'Geographical process chains' },
  manage:  { id: 'geo_data_manage',   zh: '數據與環境管理',   en: 'Data & environmental management' },
} satisfies Record<string, TopicMeta>

const FW = {
  process:  { id: 'process',  zh: '地理過程', en: 'Geographical Processes', emoji: '🌍' },
  analysis: { id: 'analysis', zh: '成因分析', en: 'Causal Analysis', emoji: '🔗' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `geoh_${p}_${++uid}`

const process: Question[] = [
  q(id('pr'), T.process, FW.analysis, 'hard', 2024, 3,
    C('在「海洋板塊」與「大陸板塊」聚合（destructive / convergent）的邊界，最典型的地理現象組合是？',
      'At a destructive (convergent) boundary where an OCEANIC plate meets a CONTINENTAL plate, the most typical set of features is?'),
    [opt('較重的海洋板塊隱沒於大陸板塊之下，形成海溝、火山、地震與褶皺山脈',
        'the denser oceanic plate subducts beneath the continental plate, forming an ocean trench, volcanoes, earthquakes and fold mountains'),
      opt('兩板塊分離，岩漿上湧形成中洋脊與新海洋地殼',
        'the plates pull apart and rising magma forms a mid-ocean ridge and new oceanic crust'),
      opt('板塊互相水平錯動，只產生地震而無火山',
        'the plates slide horizontally past each other, giving earthquakes but no volcanoes'),
      opt('海洋板塊浮於大陸板塊之上，形成裂谷',
        'the oceanic plate rides over the continental plate, forming a rift valley')],
    C('海洋板塊密度較大，在聚合邊界隱沒（subduction）到大陸板塊之下：隱沒處成海溝，下沉板塊受熱熔融上湧成火山，板塊磨擦引發地震，受擠壓的陸緣則隆起成褶皺山脈（如安第斯山）。\n\n【陷阱】「分離成中洋脊」是建設性邊界；「只地震無火山」是轉形（保守）邊界；「海洋板塊浮上」違反密度大者隱沒的原理。',
      'The denser oceanic plate subducts beneath the continental plate at a convergent margin: the subduction line forms a trench, the sinking plate melts and feeds volcanoes, friction triggers earthquakes, and the compressed continental edge buckles into fold mountains (e.g. the Andes).\n\n【Trap】 “Mid-ocean ridge” is a constructive margin; “earthquakes but no volcanoes” is a transform margin; “oceanic plate rides over” violates the rule that the denser plate subducts.')),

  q(id('pr'), T.process, FW.process, 'hard', 2023, 3,
    C('河流的「曲流」(meander) 不斷側向移動。關於曲流兩岸的作用，正確的是？',
      'A river meander migrates sideways over time. Concerning the two banks of the meander, which is correct?'),
    [opt('水流在「凹岸（外側）」流速較快、侵蝕較強形成河崖；在「凸岸（內側）」流速較慢、堆積形成滑走坡',
        'on the OUTER (concave) bank flow is faster and erosion forms a river cliff, while on the INNER (convex) bank flow is slower and deposition forms a slip-off slope'),
      opt('外側堆積、內側侵蝕，與上述恰好相反',
        'the outer bank deposits and the inner bank erodes — the reverse of the above'),
      opt('兩岸均只有侵蝕，沒有任何堆積',
        'both banks only erode, with no deposition'),
      opt('兩岸均只有堆積，沒有任何侵蝕',
        'both banks only deposit, with no erosion')],
    C('曲流外側（凹岸）水深流急，侵蝕最強，形成陡峭河崖；內側（凸岸）水淺流緩，泥沙堆積形成平緩的滑走坡。久而久之外侵內積使曲流加大，最終可能截彎取直形成牛軛湖。\n\n【陷阱】「外積內蝕」把侵蝕／堆積對調；「只蝕」「只積」都忽略了曲流同時存在侵蝕與堆積的核心特徵。',
      'On a meander the outer (concave) bank is deep and fast, eroding most strongly to form a steep river cliff; the inner (convex) bank is shallow and slow, depositing sediment as a gentle slip-off slope. Outer erosion and inner deposition enlarge the meander, eventually forming an oxbow lake by cut-off.\n\n【Trap】 “Outer deposits, inner erodes” swaps erosion and deposition; “only erodes”/“only deposits” ignores that a meander shows both at once.')),

  q(id('pr'), T.process, FW.analysis, 'hard', 2024, 3,
    C('熱帶雨林被砍伐後，土壤往往「迅速」變得貧瘠。最根本的原因是？',
      'After a tropical rainforest is cleared, the soil often becomes infertile VERY quickly. The most fundamental reason is that?'),
    [opt('雨林的養分絕大部分儲存在繁茂的「生物體（植被）」中而非土壤；一旦砍伐，養分循環中斷，加上高溫多雨令表土養分迅速被淋溶流失',
        'most of the rainforest’s nutrients are stored in the lush biomass (vegetation), not the soil; once cleared, the nutrient cycle is broken and heavy rain rapidly leaches the thin topsoil'),
      opt('雨林的土壤本身極為肥沃，養分主要儲存在深層土壤中',
        'the rainforest soil is itself extremely fertile, with nutrients stored deep in the soil'),
      opt('砍伐後氣溫下降，令養分凍結無法被吸收',
        'clearing lowers the temperature, freezing nutrients so they cannot be absorbed'),
      opt('雨林地區從不下雨，土壤因乾旱而貧瘠',
        'rainforest areas never receive rain, so the soil is infertile from drought')],
    C('熱帶雨林的養分循環「快而封閉」：養分主要鎖在生物量中，落葉迅速分解後又即被根系吸收，土壤本身儲量很低。砍伐切斷了這個循環，失去植被遮蔽與輸入，加上高溫多雨的強烈淋溶，表土養分很快流失，故迅速貧瘠。\n\n【陷阱】「土壤本身極肥」與雨林貧瘠土壤的事實相反；「氣溫下降凍結」「從不下雨」皆與熱帶雨林高溫多雨的環境矛盾。',
      'The rainforest nutrient cycle is fast and closed: nutrients are locked in biomass; litter decomposes quickly and is immediately re-absorbed by roots, so the soil store is low. Clearing breaks this cycle and removes the canopy and inputs; with hot, wet conditions causing intense leaching, the thin topsoil loses nutrients fast.\n\n【Trap】 “Soil itself very fertile” contradicts the poor rainforest soils; “temperature drops, freezing” and “never rains” contradict the hot, wet rainforest climate.')),
]

const manage: Question[] = [
  q(id('ma'), T.manage, FW.analysis, 'hard', 2024, 3,
    C('當潮濕氣流被迫越過高山時，常在「迎風坡」形成大量降雨，「背風坡」則乾燥（雨影）。這種降雨屬於？其成因鏈是？',
      'When moist air is forced over a mountain, heavy rain often falls on the WINDWARD side while the LEEWARD side is dry (rain shadow). This rainfall is, and forms by, which process?'),
    [opt('地形（relief）雨：氣流被迫抬升 → 絕熱冷卻 → 水汽凝結成雲致雨；過山後下沉增溫變乾，形成雨影',
        'relief (orographic) rain: air is forced to rise → cools adiabatically → vapour condenses into cloud and rain; after the summit it descends, warms and dries, creating a rain shadow'),
      opt('對流雨：地面受熱使空氣上升而成',
        'convectional rain, formed by ground heating lifting the air'),
      opt('鋒面雨：冷暖氣團相遇而成，與地形無關',
        'frontal rain, formed when warm and cold air masses meet, unrelated to relief'),
      opt('迎風坡乾燥而背風坡多雨，與上述相反',
        'the windward side is dry and the leeward side wet — the reverse of the above')],
    C('地形雨的成因鏈：濕潤氣流遇山被迫抬升，隨高度上升絕熱冷卻，水汽達露點凝結成雲降雨於迎風坡；越過山頂後氣流下沉、絕熱增溫、相對濕度下降而變乾，故背風坡形成乾燥的雨影區。\n\n【陷阱】對流雨靠地面受熱、鋒面雨靠氣團相遇，皆非地形抬升所致；末項把迎風／背風的乾濕對調。',
      'The relief-rain chain: moist air meets the mountain and is forced to rise, cooling adiabatically with height until vapour reaches dew point and condenses into cloud and rain on the windward side; over the summit the air sinks, warms adiabatically and dries, creating a rain-shadow on the leeward side.\n\n【Trap】 Convectional rain comes from surface heating and frontal rain from air masses meeting — not orographic uplift; the last option swaps windward/leeward wet and dry.')),

  q(id('ma'), T.manage, FW.analysis, 'hard', 2023, 3,
    C('城市中心的氣溫往往明顯高於周邊郊區，形成「城市熱島」(urban heat island)。下列何者最能解釋這一現象的成因？',
      'City centres are often distinctly warmer than surrounding rural areas — the urban heat island. Which best explains its cause?'),
    [opt('混凝土與瀝青吸熱儲熱、缺乏植被與水體蒸發降溫、加上車輛冷氣等人為排熱，共同令市區氣溫偏高',
        'concrete and asphalt absorb and store heat, vegetation and water that cool by evaporation are scarce, and human heat from vehicles and air-conditioning adds warmth — together raising city temperatures'),
      opt('市區因樹木茂密、水體眾多而特別涼快',
        'cities are cooler because they have abundant trees and water bodies'),
      opt('市區位處較高海拔，故氣溫較高',
        'cities sit at higher altitude, so they are warmer'),
      opt('熱島現象與建築材料和人為活動完全無關',
        'the heat island has nothing to do with building materials or human activity')],
    C('城市熱島是多因疊加：深色硬地（混凝土、瀝青）吸熱儲熱強、夜間緩慢釋放；綠地水體少，蒸散冷卻不足；加上交通、工業、冷氣等大量人為廢熱，使市區明顯較郊區溫暖。\n\n【陷阱】「市區因綠多水多而涼快」與熱島相反；「海拔較高故較暖」既與市區地形不符、海拔升高一般氣溫反降；「與材料活動無關」否定了主因。',
      'The urban heat island is multi-causal: dark hard surfaces (concrete, asphalt) absorb and store heat and release it slowly at night; green space and water for evaporative cooling are scarce; and traffic, industry and air-conditioning add large amounts of waste heat — so the centre is markedly warmer than the countryside.\n\n【Trap】 “Cities cooler from greenery/water” is the opposite; “higher altitude” is wrong (and higher altitude generally lowers temperature); “nothing to do with materials/activity” denies the main causes.')),
]

export const geographyHellQuestions: Question[] = [...process, ...manage]

export const geographyHellTopics: Topic[] = topicList([
  { topic: T.process, fw: FW.process,  count: process.length },
  { topic: T.manage,  fw: FW.analysis, count: manage.length },
])
