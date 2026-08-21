// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【呢啲題冇經真人逐題審批。】機器只驗得到客觀嘢：格式、選項、術語紅線、
// LaTeX、對現有題庫嘅重複度、topic id 是否已註冊。答案學術上啱唔啱唔喺閘嘅
// 能力範圍之內 —— 故此出題端必須 correct-by-construction 或引可查證原文。
// 前端 QuestionProvenance 會照實向學生顯示「經自動檢查 …未有實名逐題審批紀錄」。
//   subject  : geography
//   count    : 22  (easy 22 / medium 0 / hard 0)
//   types    : mc 22 / text 0 / long 0
//   updated  : 2026-08-21
// Do NOT hand-edit —— 改咗會被下次 auto-promote 覆寫。
import type { Question } from './types'

export const geographyAutoQuestions: Question[] = [
  {
    "id": "geo_floor_01",
    "type": "mc",
    "subject": "geography",
    "topic": "plate_hazards",
    "topicZh": "板塊與災害",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "地球最外層由若干塊板塊組成。板塊之間的相對運動，大致可分為哪三類？",
    "explanation": "三類邊界各有其地貌與災害：分離型板塊互相拉開，形成中洋脊與裂谷；聚合型互相擠壓，形成海溝、褶皺山脈與火山；平移（轉形）型互相錯動，多發生淺源地震。留意「侵蝕、搬運、沉積」是【河流及海岸作用】的三分法，屬另一課題，兩者常被混淆 —— 前者由板塊內部熱力驅動，後者由地表的水流與波浪造成。",
    "options": [
      "分離、聚合、平移（轉形）",
      "上升、下降、旋轉",
      "侵蝕、搬運、沉積",
      "增溫、降溫、恆溫"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The outermost layer of the Earth is made up of a number of plates. Into which three kinds is their relative movement broadly divided?",
    "optionsEn": [
      "divergent, convergent and transform",
      "rising, sinking and rotating",
      "erosion, transport and deposition",
      "warming, cooling and remaining constant"
    ],
    "explanationEn": "Each kind of boundary has its own landforms and hazards. At divergent boundaries the plates pull apart, producing mid-ocean ridges and rift valleys; at convergent boundaries they press together, producing trenches, fold mountains and volcanoes; at transform boundaries they slide past one another, giving mostly shallow-focus earthquakes. Note that erosion, transport and deposition are the threefold division of **river and coastal processes**, a different topic altogether — the first set is driven by heat within the Earth, the second by surface water and waves.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_02",
    "type": "mc",
    "subject": "geography",
    "topic": "plate_hazards",
    "topicZh": "板塊與災害",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "地震發生時，能量最初釋放的地點（位於地底）稱為甚麼？",
    "explanation": "震源在地底，是岩層破裂並釋放能量的實際位置；震央則在地面，是正對震源的一點，通常亦是震動最劇烈之處。兩者是同一次地震的兩個位置，一深一淺，切不可對調。震源的深淺影響災害程度：淺源地震能量傳到地面時損耗較少，破壞往往較深源地震嚴重。斷層線與板塊邊界則是【線】或【帶】，並非某一次地震的單一發生點。",
    "options": [
      "板塊邊界",
      "震源",
      "震央",
      "斷層線"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "What is the point underground at which the energy of an earthquake is first released called?",
    "optionsEn": [
      "the plate boundary",
      "the focus, or hypocentre",
      "the epicentre",
      "the fault line"
    ],
    "explanationEn": "The focus lies underground and is the actual place where rock ruptures and releases energy; the epicentre lies on the surface, directly above the focus, and is usually where shaking is strongest. They are two locations belonging to the same earthquake, one deep and one at the surface, and must not be swapped. Depth matters for the damage done: energy from a shallow focus loses less on its way to the surface, so shallow earthquakes are often more destructive than deep ones. A fault line and a plate boundary, by contrast, are a line or a belt rather than the single point at which one earthquake occurs.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_03",
    "type": "mc",
    "subject": "geography",
    "topic": "plate_hazards",
    "topicZh": "板塊與災害",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "火山噴發時可能造成的直接危害之一是甚麼？",
    "explanation": "火山碎屑流的溫度可達數百度，速度可超過每小時一百公里，沿山坡而下，是火山災害中致命性最高的一種，遠比熔岩流危險 —— 熔岩流速度慢，人可避開，碎屑流則不能。其餘三項全部是真實的地理現象，但分別屬於海岸作用、農業土壤問題及地形降水，與火山活動無關。跨課題張冠李戴，是本科常見的失分位。",
    "options": [
      "土壤鹽化 —— 鹽分在土壤表層積聚",
      "雨影效應 —— 山的背風坡降水顯著偏少",
      "火山碎屑流 —— 高溫氣體與碎屑高速沿坡而下",
      "沿岸漂移 —— 沉積物沿海岸線被帶動移動"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "What is one of the direct hazards that a volcanic eruption may produce?",
    "optionsEn": [
      "soil salinisation — salts accumulating at the soil surface",
      "the rain-shadow effect — markedly less rainfall on a mountain’s leeward side",
      "a pyroclastic flow — hot gas and debris rushing down the slope at speed",
      "longshore drift — sediment being carried along the coastline"
    ],
    "explanationEn": "A pyroclastic flow can reach several hundred degrees and travel at over a hundred kilometres an hour down the flank of the volcano, and it is the deadliest of volcanic hazards — far more so than a lava flow, which moves slowly enough to be walked away from. The other three are all genuine geographical phenomena but belong to coastal processes, to agricultural soil problems and to relief rainfall respectively, and have nothing to do with volcanic activity. Attributing one topic’s term to another is a common way to lose marks in this subject.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_04",
    "type": "mc",
    "subject": "geography",
    "topic": "rivers_coasts",
    "topicZh": "河流與海岸",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在等高線地圖上，某一處的等高線特別密集。這代表該處有甚麼特徵？",
    "explanation": "等高線連接高度相同的各點，相鄰兩條之間的高差固定。若兩線在圖上距離很近，即代表在很短的水平距離內已上升或下降了同樣的高度，故坡度必然陡峭；反之等高線疏落即代表坡度平緩。留意密集與否只反映【坡度】，與海拔高低無關 —— 高原上可以有平緩處，低地亦可以有陡崖。答資料題時先看等高線間距，再讀數值，兩步不可合併。",
    "options": [
      "海拔特別低",
      "地勢平坦，屬平原",
      "該處必定有河流流過",
      "坡度陡峭"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "On a contour map the contour lines at one place are unusually close together. What does this indicate about that place?",
    "optionsEn": [
      "the elevation is particularly low",
      "the ground is flat, forming a plain",
      "a river must be flowing through it",
      "the slope is steep"
    ],
    "explanationEn": "Contour lines join points of equal height, and the difference in height between adjacent lines is fixed. If two lines are close together on the map, the same rise or fall has been achieved over a very short horizontal distance, so the slope must be steep; widely spaced contours mean a gentle slope. Note that spacing reflects **gradient** alone and says nothing about elevation — a plateau can have gentle ground and a lowland can have a steep cliff. In a data-response question, read the spacing first and the values second, and do not run the two steps together.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_05",
    "type": "mc",
    "subject": "geography",
    "topic": "rivers_coasts",
    "topicZh": "河流與海岸",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在等高線地圖上判斷河流的流向，應根據甚麼？",
    "explanation": "水受重力驅動，必定由高處流向低處，故只要讀出河道兩端所經等高線的數值，流向即可確定。留意地圖的方位與流向無必然關係 —— 河流可以向任何方向流，「北方一定較高」並非事實。至於等高線的疏密只表示坡度，陡坡處水流較急、緩坡處較慢，但並不決定流向。此外等高線橫越河谷時會形成向上游凸出的「V」字，這是另一個可用的判讀線索。",
    "options": [
      "由等高線數值較高的一方，流向數值較低的一方",
      "由等高線數值較低的一方，流向數值較高的一方",
      "一律由圖的北方流向圖的南方",
      "由等高線密集之處，流向等高線疏落之處"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "On what basis is the direction of a river’s flow determined from a contour map?",
    "optionsEn": [
      "from where the contour values are higher towards where they are lower",
      "from where the contour values are lower towards where they are higher",
      "always from the north of the map towards the south",
      "from where the contours are close together towards where they are wide apart"
    ],
    "explanationEn": "Water is driven by gravity and must run from higher ground to lower, so reading the contour values at the two ends of the channel settles the direction. Note that the orientation of the map has no necessary bearing on it — a river may run in any direction, and it is simply not the case that north is always higher. Contour spacing indicates gradient, so the flow is faster on a steep slope and slower on a gentle one, but spacing does not determine direction. Where contours cross a valley they also form a “V” pointing upstream, which is a further clue worth using.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_06",
    "type": "mc",
    "subject": "geography",
    "topic": "rivers_coasts",
    "topicZh": "河流與海岸",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "河流的「集水區」(drainage basin) 是指甚麼？",
    "explanation": "集水區由分水嶺（通常是山脊線）劃界：嶺的這一邊落下的雨水匯入這條河，另一邊則匯入鄰近的河。理解這個範圍，才能理解為何上游的土地利用會影響下游 —— 上游森林被砍伐，同一場雨在集水區內的入滲減少、徑流加快，下游的氾濫風險便隨之上升。故河流管理必須以整個集水區為單位，而非只處理出事的一段河道。",
    "options": [
      "河流兩岸堤壩之間所圍起的範圍",
      "一條河流及其支流所收集地表徑流的整片區域",
      "河流之中水深最大的一段河道",
      "河口一帶由沉積物堆積而成的三角洲"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "What is the drainage basin of a river?",
    "optionsEn": [
      "the area enclosed between the embankments on the two banks",
      "the whole area from which a river and its tributaries collect surface run-off",
      "the stretch of channel where the river is deepest",
      "the delta of sediment built up at the river mouth"
    ],
    "explanationEn": "A drainage basin is bounded by the watershed, usually a ridge line: rain falling on one side of the ridge feeds this river, rain on the other side feeds the next. Grasping this area is what explains why land use upstream affects places downstream — clear the upstream forest and the same rainfall infiltrates less and runs off faster within the basin, so flood risk downstream rises. River management therefore has to take the whole basin as its unit rather than treating only the reach where trouble appeared.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_07",
    "type": "mc",
    "subject": "geography",
    "topic": "rivers_coasts",
    "topicZh": "河流與海岸",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "海浪長期侵蝕海岸的崖腳，最先形成的地貌通常是甚麼？",
    "explanation": "海岸侵蝕地貌有一條清晰的發展次序：崖腳的裂隙先被擴大成海蝕洞；洞若貫穿岬角兩側則成海蝕拱門；拱頂坍塌後留下孤立的柱體，即海蝕柱；柱再被侵蝕矮化便成海蝕殘餘。故海蝕柱是這條序列的後段而非開端。至於沙嘴與沙洲屬【沉積】地貌，由沿岸漂移搬運沉積物堆積而成，與侵蝕作用方向相反，不應混入同一序列。",
    "options": [
      "沙嘴",
      "沙洲",
      "海蝕洞",
      "海蝕柱"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "What landform usually appears first where waves erode the foot of a coastal cliff over a long period?",
    "optionsEn": [
      "a spit",
      "a sandbar",
      "a sea cave",
      "a sea stack"
    ],
    "explanationEn": "Coastal erosional landforms follow a clear sequence: a crack at the foot of the cliff is widened into a sea cave; if the cave cuts right through a headland it becomes an arch; when the roof of the arch collapses an isolated pillar, the stack, is left; and further erosion reduces the stack to a stump. The stack therefore belongs late in the sequence, not at its start. A spit and a sandbar, meanwhile, are **depositional** landforms built by longshore drift, working in the opposite direction, and do not belong in the same sequence.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_08",
    "type": "mc",
    "subject": "geography",
    "topic": "weather_climate",
    "topicZh": "天氣與氣候",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一般的氣候圖（climate graph）以柱狀圖與折線圖並列。兩者分別表示甚麼？",
    "explanation": "這是國際通用的畫法：降水量以柱狀表示（讀左軸或右軸的毫米刻度），氣溫以折線表示（讀另一軸的攝氏刻度）。讀圖時應先確認每一條軸屬於哪一項數據，再讀數 —— 兩軸的刻度不同，把柱與線對調就會得出完全相反的結論，例如把雨季誤讀為最熱的月份。此外要留意南半球的氣候圖，其最熱月份出現在年中的相反位置。",
    "options": [
      "柱狀表示每月平均氣溫，折線表示每月降水量",
      "兩者都表示氣溫，分別代表兩個不同年份",
      "柱狀表示日照時數，折線表示平均風速",
      "柱狀表示每月降水量，折線表示每月平均氣溫"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A climate graph normally combines bars with a line. What does each of them show?",
    "optionsEn": [
      "the bars show mean monthly temperature and the line shows monthly rainfall",
      "both show temperature, for two different years",
      "the bars show hours of sunshine and the line shows mean wind speed",
      "the bars show monthly rainfall and the line shows mean monthly temperature"
    ],
    "explanationEn": "This is the internationally standard convention: rainfall is drawn as bars, read against the millimetre scale on one axis, and temperature as a line, read against the Celsius scale on the other. Establish which axis belongs to which variable before taking any reading — the two scales differ, and swapping bars for line yields exactly the wrong conclusion, such as reading the wet season as the hottest months. Note also that on a Southern Hemisphere climate graph the warmest months fall at the opposite end of the year.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_09",
    "type": "mc",
    "subject": "geography",
    "topic": "weather_climate",
    "topicZh": "天氣與氣候",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "香港夏季多吹偏南風，冬季多吹偏北風。這種盛行風向隨季節而轉變的現象，稱為甚麼？",
    "explanation": "季風的成因在於海陸比熱差異：夏季大陸增溫快、氣壓較低，風由海洋吹向陸地，帶來水汽與雨；冬季大陸降溫快、氣壓較高，風由陸地吹向海洋，天氣乾冷。留意海陸風的成因原理相近但【周期為一日】而非一年，範圍亦只及沿岸；焚風是氣流越山後下沉增溫變乾的現象；信風則是低緯度常年穩定吹向赤道的風。四者的分別在於時間尺度與成因，宜一併記牢。",
    "options": [
      "季風",
      "海陸風",
      "焚風",
      "信風"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Hong Kong’s prevailing winds are largely southerly in summer and northerly in winter. What is this seasonal reversal of wind direction called?",
    "optionsEn": [
      "the monsoon",
      "land and sea breezes",
      "the föhn wind",
      "the trade winds"
    ],
    "explanationEn": "The monsoon arises from the difference in heat capacity between land and sea: in summer the continent warms quickly, pressure over it falls, and wind blows from ocean to land bringing moisture and rain; in winter the continent cools quickly, pressure rises, and wind blows from land to ocean, dry and cold. Note that land and sea breezes work on a similar principle but on a **daily** rather than annual cycle and only near the coast; the föhn is air warming and drying as it descends the lee of a mountain; and the trade winds blow steadily towards the equator in low latitudes all year. The four differ in time scale and in cause, and are best learned together.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_10",
    "type": "mc",
    "subject": "geography",
    "topic": "urban",
    "topicZh": "城市發展",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "人口金字塔（population pyramid）的橫軸與縱軸，分別表示甚麼？",
    "explanation": "人口金字塔以縱軸由下而上排列年齡組別（通常每五歲一組），橫軸向左右兩側伸展，分別表示男性與女性的人數或百分比。讀圖時看形狀：底部寬闊而向上急速收窄，代表出生率與死亡率均高，屬發展中國家的典型；底部收窄而中上部飽滿，代表出生率下降、人口老化，屬已發展地區的典型。先確認軸的意義，再看形狀，最後才作推論。",
    "options": [
      "兩軸都表示年齡，只是左右分開男女",
      "橫軸表示人數或所佔百分比，縱軸表示年齡組別",
      "橫軸表示年份，縱軸表示人口總數",
      "橫軸表示地區，縱軸表示人口密度"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "What do the horizontal and vertical axes of a population pyramid represent?",
    "optionsEn": [
      "both axes show age, with male and female merely placed left and right",
      "the horizontal axis shows numbers or percentages, the vertical axis shows age groups",
      "the horizontal axis shows years, the vertical axis shows total population",
      "the horizontal axis shows districts, the vertical axis shows population density"
    ],
    "explanationEn": "A population pyramid stacks age groups up the vertical axis, usually in five-year bands, while the horizontal axis extends to left and right to show the number or percentage of males and of females. Read the shape: a wide base narrowing sharply upwards indicates high birth and death rates, typical of a developing country; a narrowed base with a full middle and upper section indicates falling births and an ageing population, typical of a developed one. Establish what the axes mean, then read the shape, and only then draw an inference.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_11",
    "type": "mc",
    "subject": "geography",
    "topic": "urban",
    "topicZh": "城市發展",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "「人口密度」的計算方法是甚麼？",
    "explanation": "人口密度以「每平方公里若干人」表示，量度的是人口在空間上的疏密。其餘三項全部是真實的人口指標，但量度的並非同一回事：出生減死亡是自然增長，遷入減遷出是淨遷移，人口除以住宅單位則接近居住密度。留意人口密度會被平均值掩蓋內部差異 —— 一個包含大片郊野的地區，其平均密度可以很低，但市區部分卻極為擠迫，故分析時應留意統計單位的大小。",
    "options": [
      "該地區的人口總數除以住宅單位數目",
      "該地區的遷入人數減去遷出人數",
      "該地區的人口總數除以其土地面積",
      "該地區的出生人數減去死亡人數"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "How is population density calculated?",
    "optionsEn": [
      "the total population divided by the number of dwelling units",
      "the number of in-migrants minus the number of out-migrants",
      "the total population of an area divided by its land area",
      "the number of births in the area minus the number of deaths"
    ],
    "explanationEn": "Population density is expressed as so many persons per square kilometre and measures how thinly or thickly people are spread over space. The other three are all genuine population measures but of different things: births minus deaths is natural increase, in-migrants minus out-migrants is net migration, and population divided by dwellings is closer to occupancy. Note that a density figure is an average and can hide internal variation — an area containing large tracts of countryside may show a low average while its built-up part is extremely crowded, so the size of the statistical unit is worth checking.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_12",
    "type": "mc",
    "subject": "geography",
    "topic": "urban",
    "topicZh": "城市發展",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "大量鄉村人口遷往城市，對【鄉村地區】可能造成甚麼影響？",
    "explanation": "遷移的多為適齡工作的青壯年，故鄉村留下的以老幼為主：耕作勞動力減少，部分農地拋荒，學校與診所因使用者不足而縮減甚至關閉，形成惡性循環。留意其餘三項所描述的，正是【城市】一端所面對的問題（密度上升、土地不足、服務需求急增）—— 遷移是一個過程的兩端，答題時必須看清問的是遷出地還是遷入地。",
    "options": [
      "人口密度顯著上升，居住環境變得擠迫",
      "農地不足，須大規模開發新的耕地",
      "公共服務因需求增加而大幅擴充",
      "青壯年人口流失，勞動力不足並加劇人口老化"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "When large numbers move from the countryside to the city, what may follow for the **rural** area?",
    "optionsEn": [
      "a marked rise in population density and more crowded living conditions",
      "a shortage of farmland, forcing large-scale opening of new fields",
      "a large expansion of public services to meet increased demand",
      "a loss of young adults, leaving a shortage of labour and an ageing population"
    ],
    "explanationEn": "Those who move are mostly working-age adults, so the countryside is left with the old and the young: labour for farming falls, some fields go out of use, and schools and clinics contract or close for want of users, which feeds the cycle further. Note that the other three describe what happens at the **urban** end — rising density, shortage of land, sharply increased demand for services. Migration has two ends, and an answer must be clear about whether the question asks about the place people leave or the place they arrive.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_13",
    "type": "mc",
    "subject": "geography",
    "topic": "industry",
    "topicZh": "工業與區位",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "經濟活動一般分為第一、第二、第三產業。「採礦」屬於哪一類？",
    "explanation": "第一產業直接由自然環境取得資源，包括農業、漁業、林業及採礦；第二產業把原料加工製造，包括製造業與建造業；第三產業提供服務，包括零售、運輸、金融與教育。留意採礦雖然使用大量機械、規模龐大，仍屬第一產業 —— 分類的依據是「與自然資源的關係」，而非機械化程度或企業規模。把採礦誤歸第二產業，正是由此而來。",
    "options": [
      "第一產業",
      "第二產業",
      "第三產業",
      "第四產業"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Economic activities are commonly grouped into primary, secondary and tertiary sectors. To which does mining belong?",
    "optionsEn": [
      "the primary sector",
      "the secondary sector",
      "the tertiary sector",
      "the quaternary sector"
    ],
    "explanationEn": "The primary sector takes resources directly from the natural environment and covers farming, fishing, forestry and mining; the secondary sector processes raw materials and covers manufacturing and construction; the tertiary sector provides services, from retail and transport to finance and education. Note that mining stays primary however heavily mechanised or large in scale it is — the criterion is the relation to natural resources, not the degree of mechanisation or the size of the firm. Placing mining in the secondary sector usually comes from applying the wrong criterion.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_14",
    "type": "mc",
    "subject": "geography",
    "topic": "industry",
    "topicZh": "工業與區位",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個地區的第三產業就業比例持續上升，通常反映甚麼？",
    "explanation": "一個經濟體在發展過程中，就業重心往往由第一產業移向第二產業，再移向第三產業。香港的轉變是典型例子：製造業大量北移之後，本地就業以金融、貿易、物流及旅遊等服務業為主。留意就業比例上升不等於其他行業「衰落」—— 有時是製造工序遷往外地而總部與研發留下，故分析時應同時看就業比例與生產總值的變化，並問清楚是絕對數字還是相對比例。",
    "options": [
      "該地區的人口自然增長正在加快",
      "經濟結構轉向以服務業為主",
      "該地區的農業產量正在大幅上升",
      "該地區的製造業技術水平正在下降"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "What does a sustained rise in the share of employment in the tertiary sector usually reflect?",
    "optionsEn": [
      "an acceleration in the area’s natural population increase",
      "a shift in the structure of the economy towards services",
      "a sharp rise in the area’s agricultural output",
      "a decline in the technological level of local manufacturing"
    ],
    "explanationEn": "As an economy develops, the centre of gravity of employment tends to move from the primary sector to the secondary and then to the tertiary. Hong Kong is a textbook case: after manufacturing moved north in large volume, local employment came to rest on finance, trade, logistics and tourism. Note that a rising share does not by itself mean other sectors have collapsed — sometimes production has moved abroad while headquarters and research remain. Look at the share of employment alongside output value, and be clear whether the figure quoted is absolute or relative.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_15",
    "type": "mc",
    "subject": "geography",
    "topic": "industry",
    "topicZh": "工業與區位",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在全球生產鏈之中，「外判」(outsourcing) 的意思是甚麼？",
    "explanation": "外判的核心在於「交由別人做」：企業保留設計、品牌與銷售，把成本較高或非核心的工序交予其他公司，往往設於工資較低的地區。這解釋了為何一件商品可以在多個國家之間輾轉完成，亦帶出相關的爭議 —— 承接工序的一方議價能力較弱，工資與勞工條件容易被壓低。留意外判與出口、遷冊、融資是四回事，答全球化題時不宜混用。",
    "options": [
      "企業把總部由一個地方遷往另一個地方",
      "企業向外地的銀行借入資金以擴充業務",
      "企業把部分生產或服務工序交由其他公司承擔",
      "企業把製成品直接售予外地的消費者"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "What does outsourcing mean in a global production chain?",
    "optionsEn": [
      "a firm moves its headquarters from one place to another",
      "a firm borrows funds from banks abroad in order to expand",
      "a firm hands part of its production or service work to another company",
      "a firm sells its finished goods directly to consumers abroad"
    ],
    "explanationEn": "The heart of outsourcing is that the work is given to someone else: the firm keeps design, brand and sales, and passes the costlier or non-core stages to other companies, often in places where wages are lower. This explains how a single product can be completed across several countries, and it raises the associated dispute — the firms taking on those stages have weaker bargaining power, so wages and working conditions are readily pushed down. Outsourcing, exporting, relocating a headquarters and raising finance abroad are four different things, and should not be used interchangeably in an answer on globalisation.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_16",
    "type": "mc",
    "subject": "geography",
    "topic": "food",
    "topicZh": "糧食問題",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "農業按投入的密集程度可分為集約農業與粗放農業。「粗放農業」的特徵是甚麼？",
    "explanation": "集約與粗放的分別在於【每單位土地的投入量】，而非產品種類或現代化程度。粗放農業（如草原放牧、大規模穀物種植）單位面積投入少、產量亦低，但因土地遼闊，總產量可以很高；集約農業（如亞洲水稻、荷蘭溫室園藝）則相反。留意「粗放」不等於「落後」—— 北美的大規模機械化穀物農場高度現代化，同樣屬粗放經營。",
    "options": [
      "單位面積投入大量勞力與肥料，土地面積較小",
      "所有生產過程都在溫室等受控環境中進行",
      "只種植供出口的經濟作物，不種糧食作物",
      "單位面積所投入的勞力或資本較少，經營的土地面積較大"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Farming is divided by intensity of input into intensive and extensive. What characterises extensive farming?",
    "optionsEn": [
      "much labour and fertiliser is put into each unit of area, on a smaller holding",
      "all production is carried out in greenhouses or other controlled environments",
      "only cash crops for export are grown, and no food crops",
      "less labour or capital is put into each unit of area, and the holding worked is larger"
    ],
    "explanationEn": "The distinction is one of input per unit of land, not of what is produced or how modern the operation is. Extensive farming — rangeland grazing, large-scale grain growing — puts in little per unit of area and yields little per unit, yet total output can be very large because the area is vast; intensive farming, such as Asian wet rice or Dutch glasshouse horticulture, is the reverse. Note that extensive does not mean backward: the highly mechanised grain farms of North America are thoroughly modern and extensive at the same time.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_17",
    "type": "mc",
    "subject": "geography",
    "topic": "food",
    "topicZh": "糧食問題",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "「糧食自給率」指的是甚麼？",
    "explanation": "自給率是一個【比例】而非產量：分子為本地生產，分母為本地消耗。香港的糧食自給率極低，絕大部分依賴進口，故其糧食安全的關鍵不在於增產，而在於進口來源是否多元、供應鏈是否穩定 —— 若過度依賴單一來源地，一旦該地歉收或運輸中斷，影響即時而全面。分清「產量」與「自給率」，才能正確判斷一個地區真正的風險所在。",
    "options": [
      "一個地區所消耗的糧食之中，由本地生產所佔的比例",
      "一個地區在一年之內的糧食總產量",
      "一個地區每人每日平均攝取的熱量",
      "一個地區的糧食出口所得的總值"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "What does the food self-sufficiency ratio measure?",
    "optionsEn": [
      "the share of the food consumed in an area that is produced locally",
      "the total quantity of food an area produces in a year",
      "the average daily energy intake per person in an area",
      "the total value of an area’s food exports"
    ],
    "explanationEn": "Self-sufficiency is a ratio and not a quantity: local production over local consumption. Hong Kong’s ratio is very low and the overwhelming bulk of its food is imported, so the key to its food security lies not in growing more but in whether import sources are diversified and the supply chain is stable — over-reliance on a single source means an immediate and comprehensive effect if that source has a poor harvest or transport is interrupted. Keeping output and self-sufficiency apart is what allows the real risk facing an area to be identified.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_18",
    "type": "mc",
    "subject": "geography",
    "topic": "food",
    "topicZh": "糧食問題",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "傳統農業中的「休耕」或「輪耕」做法，主要目的是甚麼？",
    "explanation": "連續耕作會不斷消耗土壤中的養分；讓土地休息一段時間，植被得以重生、有機質得以累積、養分得以補充，土壤結構亦可恢復。故此做法在人口壓力不大時可以持續。但當人口增加、休耕期被迫縮短，土壤未及恢復又再耕種，肥力便逐年下降，最終導致土壤退化 —— 這正是熱帶地區刀耕火種由可持續轉為不可持續的關鍵所在。",
    "options": [
      "方便在田間使用大型農業機械",
      "讓土壤有時間恢復肥力",
      "縮短農作物運往市場的距離",
      "增加農民出售農產品的現金收入"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "What is the main purpose of fallowing or shifting cultivation in traditional farming?",
    "optionsEn": [
      "to make it easier to use large machinery in the fields",
      "to give the soil time to recover its fertility",
      "to shorten the distance crops must travel to market",
      "to increase the cash income farmers earn from sales"
    ],
    "explanationEn": "Continuous cropping steadily draws nutrients out of the soil; letting the land rest allows vegetation to return, organic matter to build up and nutrients to be replenished, and lets the soil structure recover. The practice is therefore sustainable where population pressure is light. But as numbers grow and the fallow period is shortened, land is cropped again before it has recovered, fertility falls year by year, and the soil degrades — which is precisely how slash-and-burn in the tropics passes from sustainable to unsustainable.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_19",
    "type": "mc",
    "subject": "geography",
    "topic": "rainforest",
    "topicZh": "熱帶雨林",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "大片熱帶雨林被砍伐之後，當地的降雨量往往隨之減少。原因是甚麼？",
    "explanation": "雨林的雨有相當部分來自自身：樹木由根部吸水，再經葉片蒸騰把水汽送回大氣，水汽上升凝結後又化為雨落下 —— 這是一個局部的水循環。砍伐令這個循環的其中一環斷開，水汽供應減少，降雨隨之下降，餘下的林木因而更易受乾旱影響，形成惡性循環。理解這一點，才明白毀林的影響為何不止於「樹少了」。",
    "options": [
      "土壤變得過於乾燥，把落下的雨水全部吸走",
      "盛行風的方向因而改變，把雨帶推往別的地區",
      "樹木的蒸騰作用停止，進入大氣的水汽大幅減少",
      "太陽輻射被地面全部反射回太空，空氣不再受熱"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "After large areas of tropical rainforest are cleared, local rainfall often falls. Why?",
    "optionsEn": [
      "the soil becomes so dry that it absorbs all the rain that falls",
      "the prevailing wind changes direction and pushes the rain belt elsewhere",
      "transpiration by the trees ceases, so much less water vapour enters the atmosphere",
      "all solar radiation is reflected back to space and the air is no longer heated"
    ],
    "explanationEn": "A substantial part of the rainforest’s rain comes from the forest itself: the trees draw water up through their roots and transpire it back into the atmosphere through their leaves, where it rises, condenses and falls again as rain — a local water cycle. Clearing breaks one link in that cycle, the supply of vapour drops and rainfall falls with it, leaving the remaining forest more exposed to drought and feeding the cycle further. This is why the effect of deforestation goes well beyond there being fewer trees.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_20",
    "type": "mc",
    "subject": "geography",
    "topic": "rainforest",
    "topicZh": "熱帶雨林",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "「生物多樣性」(biodiversity) 的意思是甚麼？",
    "explanation": "生物多樣性包含三個層次：物種的多樣（有多少種）、基因的多樣（同一物種之內的變異）、生態系統的多樣（有多少種棲息環境）。留意它量度的是【種類的豐富程度】而非個體數量 —— 一片人工林可以有極多樹木個體，但物種單一，多樣性極低。這個分別解釋了為何以人工林取代原始雨林，即使樹木數目不減，生態損失仍然巨大。",
    "options": [
      "一個地區之內所有生物個體的總數量",
      "一個地區之內體型最大的生物的體積",
      "一個地區之內動物與植物的重量比例",
      "一個地區之內物種、基因及生態系統的豐富程度"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "What does biodiversity mean?",
    "optionsEn": [
      "the total number of individual organisms within an area",
      "the size of the largest organism within an area",
      "the ratio by weight of animals to plants within an area",
      "the richness of species, genes and ecosystems within an area"
    ],
    "explanationEn": "Biodiversity has three levels: diversity of species, meaning how many kinds there are; diversity of genes, meaning variation within a species; and diversity of ecosystems, meaning how many kinds of habitat exist. Note that it measures richness of kinds rather than number of individuals — a plantation may hold an enormous number of trees while being of a single species and so very low in diversity. That distinction explains why replacing primary rainforest with plantation entails a heavy ecological loss even when the number of trees does not fall.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_21",
    "type": "mc",
    "subject": "geography",
    "topic": "climate_change",
    "topicZh": "氣候變化",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "「溫室效應」的基本原理是甚麼？",
    "explanation": "關鍵在於「進得來、出不去」：太陽輻射以短波為主，可穿過大氣到達地面；地面受熱後以長波輻射向外散熱，而二氧化碳、甲烷、水汽等溫室氣體正好能吸收長波，把熱量截留在大氣層內。留意溫室效應【本身是自然現象】，若完全沒有，地表平均氣溫將遠低於現時而不利生命；問題在於人類活動大量增加溫室氣體，令截留的熱量超出自然水平，即「增強的溫室效應」。",
    "options": [
      "大氣中某些氣體讓太陽短波輻射通過，卻吸收地面放出的長波輻射",
      "大氣中的雲層把太陽輻射直接反射回地面",
      "大氣層的厚度增加，使地面空氣受壓而升溫",
      "地球與太陽之間的距離正在逐年縮短"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "What is the basic mechanism of the greenhouse effect?",
    "optionsEn": [
      "certain gases let the sun’s short-wave radiation through but absorb the long-wave radiation the ground gives off",
      "clouds in the atmosphere reflect solar radiation straight back to the ground",
      "the atmosphere thickens, compressing the air at the surface and warming it",
      "the distance between the Earth and the sun is shortening year by year"
    ],
    "explanationEn": "The point is that heat gets in but cannot easily get out. Solar radiation is mostly short-wave and passes through the atmosphere to the ground; the warmed ground radiates heat outward at long wavelengths, and greenhouse gases such as carbon dioxide, methane and water vapour absorb precisely those long wavelengths, trapping the heat within the atmosphere. Note that the greenhouse effect is itself a natural phenomenon — without it the mean surface temperature would be far lower and far less hospitable to life. The problem is that human activity has greatly increased these gases, so that more heat is trapped than naturally would be: the enhanced greenhouse effect.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "geo_floor_22",
    "type": "mc",
    "subject": "geography",
    "topic": "climate_change",
    "topicZh": "氣候變化",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "「化石燃料」包括以下哪一組？",
    "explanation": "化石燃料由遠古生物遺骸經長時間高溫高壓形成，儲量有限且再生極慢，燃燒時釋出長期封存的碳，是人為二氧化碳排放的主要來源。留意兩項常見混淆：木柴與稻稈屬生物質燃料，碳循環周期以年計而非以百萬年計，故性質與化石燃料不同；核燃料燃燒時不排放二氧化碳，但涉及放射性廢料與安全問題，是另一組議題。分清燃料類別，才能正確討論減排的取捨。",
    "options": [
      "鈾與釷等核燃料",
      "煤、石油與天然氣",
      "太陽能、風能與水能",
      "木柴、稻稈與竹"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Which of the following groups are fossil fuels?",
    "optionsEn": [
      "nuclear fuels such as uranium and thorium",
      "coal, oil and natural gas",
      "solar, wind and hydro power",
      "firewood, rice straw and bamboo"
    ],
    "explanationEn": "Fossil fuels formed from the remains of ancient organisms under long periods of heat and pressure; reserves are finite and replenish only over geological time, and burning them releases carbon that had been locked away, which makes them the principal source of human carbon dioxide emissions. Note two common confusions. Firewood and straw are biomass fuels, whose carbon cycles over years rather than millions of years, so they are a different case. Nuclear fuels release no carbon dioxide in use but raise questions of radioactive waste and safety, which form a separate set of issues. Sorting the categories is what makes a discussion of emission trade-offs accurate.",
    "frameworkEn": "Auto-gated"
  }
]
