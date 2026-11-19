// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "cells": {
    "subjectId": "biology",
    "topicId": "cells",
    "titleZh": "細胞",
    "titleEn": "Cells",
    "conceptZh": "細胞膜具選擇透性，調控物質進出。",
    "conceptEn": "The cell membrane is selectively permeable, regulating transport.",
    "mustKnowZh": [
      "細胞膜具選擇透性，調控物質進出。",
      "線粒體是「能量工廠」，進行有氧呼吸產生 ATP。",
      "細胞壁（及葉綠體、大液泡）為植物細胞特有。",
      "細胞核含染色體（DNA），控制細胞活動。"
    ],
    "mustKnowEn": [
      "The cell membrane is selectively permeable, regulating transport.",
      "Mitochondria are the “powerhouse”, producing ATP by aerobic respiration.",
      "Cell walls (plus chloroplasts and a large vacuole) are unique to plant cells.",
      "The nucleus contains the chromosomes (DNA) and controls cell activities."
    ],
    "examTipZh": "DSE 作答「細胞」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Cells”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "400 µm 乘了放大倍率而非除；20 µm 只抄了倍率；20,000 µm 完全沒有除以倍率。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "genetics": {
    "subjectId": "biology",
    "topicId": "genetics",
    "titleZh": "遺傳",
    "titleEn": "Genetics",
    "conceptZh": "基因是 DNA 上的片段，攜帶遺傳訊息。",
    "conceptEn": "A gene is a segment of DNA carrying hereditary information.",
    "mustKnowZh": [
      "基因是 DNA 上的片段，攜帶遺傳訊息。",
      "AA × aa：每個子代各得一個 A 與一個 a，全為 Aa。",
      "Aa × Aa → 1 AA : 2 Aa : 1 aa，表現型 3 顯性 : 1 隱性。",
      "Aa × aa → 1 Aa : 1 aa，即 1 顯性 : 1 隱性。"
    ],
    "mustKnowEn": [
      "A gene is a segment of DNA carrying hereditary information.",
      "AA × aa: each offspring gets one A and one a, so all are Aa.",
      "Aa × Aa → 1 AA : 2 Aa : 1 aa, i.",
      "Aa × aa → 1 Aa : 1 aa, i."
    ],
    "examTipZh": "DSE 作答「遺傳」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Genetics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated",
    "explainerSrc": "/explainers/bio-genetics.svg"
  },
  "human_body": {
    "subjectId": "biology",
    "topicId": "human_body",
    "titleZh": "人體系統",
    "titleEn": "Human Body Systems",
    "conceptZh": "紅血球的血紅蛋白與氧結合，運送氧氣。",
    "conceptEn": "Haemoglobin in red blood cells binds and transports oxygen.",
    "mustKnowZh": [
      "紅血球的血紅蛋白與氧結合，運送氧氣。",
      "肺泡壁薄、面積大、血供豐富，是氧與二氧化碳交換的場所。",
      "左心室壁最厚，把含氧血泵入主動脈送往全身。",
      "動脈送血離心、壁厚有彈性；靜脈送血回心、有瓣膜。"
    ],
    "mustKnowEn": [
      "Haemoglobin in red blood cells binds and transports oxygen.",
      "Alveoli are thin, numerous and well-supplied with blood — the site of O₂/CO₂ exchange.",
      "The thick-walled left ventricle pumps oxygenated blood into the aorta to the body.",
      "Arteries carry blood away from the heart with thick elastic walls; veins return blood and have valves."
    ],
    "examTipZh": "DSE 作答「人體系統」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Human Body Systems”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "coordination": {
    "subjectId": "biology",
    "topicId": "coordination",
    "titleZh": "神經與協調",
    "titleEn": "Nervous Coordination",
    "conceptZh": "神經元傳遞電訊號（神經衝動），是神經系統的功能單位。",
    "conceptEn": "Neurones transmit electrical impulses — the functional unit of the nervous system.",
    "mustKnowZh": [
      "神經元傳遞電訊號（神經衝動），是神經系統的功能單位。",
      "中樞神經系統 = 腦 + 脊髓；其餘神經屬周圍神經系統。",
      "感覺神經元把衝動由感受器傳入中樞，再經中間、運動神經元到效應器。",
      "反射動作快速、自動、不經大腦意識，具保護作用。"
    ],
    "mustKnowEn": [
      "Neurones transmit electrical impulses — the functional unit of the nervous system.",
      "The CNS is the brain and spinal cord; the rest are the peripheral nervous system.",
      "The sensory neurone carries the impulse from the receptor to the CNS, then relay and motor neurones reach the effector.",
      "Reflexes are fast, automatic and involuntary, providing protection."
    ],
    "examTipZh": "DSE 作答「神經與協調」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Nervous Coordination”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "enzymes": {
    "subjectId": "biology",
    "topicId": "enzymes",
    "titleZh": "酶",
    "titleEn": "Enzymes",
    "conceptZh": "酶是生物催化劑，本質為蛋白質。",
    "conceptEn": "Enzymes are biological catalysts and are proteins.",
    "mustKnowZh": [
      "酶是生物催化劑，本質為蛋白質。",
      "酶降低活化能、加快反應，自身不被消耗。",
      "酶的活性部位與特定受質形狀互補（鎖鑰／誘導契合），故具專一性。",
      "超過最適溫度，酶變性，活性部位形狀改變，無法與受質結合。"
    ],
    "mustKnowEn": [
      "Enzymes are biological catalysts and are proteins.",
      "Enzymes lower activation energy and speed reactions without being consumed.",
      "The active site is complementary in shape to a specific substrate (lock-and-key / induced fit), giving specificity.",
      "Above its optimum, the enzyme denatures; the active site changes shape and can no longer bind the substrate."
    ],
    "examTipZh": "DSE 作答「酶」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Enzymes”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "photosynthesis": {
    "subjectId": "biology",
    "topicId": "photosynthesis",
    "titleZh": "光合作用",
    "titleEn": "Photosynthesis",
    "conceptZh": "光合作用吸收二氧化碳、放出氧氣（與呼吸相反）。",
    "conceptEn": "Photosynthesis takes in CO₂ and releases O₂ (the reverse of respiration).",
    "mustKnowZh": [
      "光合作用吸收二氧化碳、放出氧氣（與呼吸相反）。",
      "葉綠素吸收光能，把它轉化為葡萄糖中的化學能。",
      "光合作用製造葡萄糖（再轉為澱粉儲存），並放出氧氣。",
      "葉綠素位於葉綠體，吸收紅光與藍光進行光合作用。"
    ],
    "mustKnowEn": [
      "Photosynthesis takes in CO₂ and releases O₂ (the reverse of respiration).",
      "Chlorophyll absorbs light energy and converts it into chemical energy in glucose.",
      "Photosynthesis makes glucose (stored as starch) and releases oxygen.",
      "Chlorophyll in chloroplasts absorbs red and blue light to drive photosynthesis."
    ],
    "examTipZh": "DSE 作答「光合作用」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Photosynthesis”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "ecology": {
    "subjectId": "biology",
    "topicId": "ecology",
    "titleZh": "生態",
    "titleEn": "Ecology",
    "conceptZh": "生產者（植物）藉光合作用固定太陽能，再沿食物鏈流動。",
    "conceptEn": "Producers fix solar energy by photosynthesis, then it flows along the food chain.",
    "mustKnowZh": [
      "生產者（植物）藉光合作用固定太陽能，再沿食物鏈流動。",
      "生產者（自養生物）能自製食物，是食物鏈的起點。",
      "分解者分解屍體與排泄物，把養分歸還環境供再利用。",
      "每級約只 10% 能量傳給下一級，其餘多以呼吸熱流失，故食物鏈通常短。"
    ],
    "mustKnowEn": [
      "Producers fix solar energy by photosynthesis, then it flows along the food chain.",
      "Producers (autotrophs) make their own food and start the food chain.",
      "Decomposers break down dead organisms and waste, returning nutrients to the environment.",
      "Only about 10% passes to the next level; the rest is lost (mainly as respiratory heat), so chains are short."
    ],
    "examTipZh": "DSE 作答「生態」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Ecology”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "digestion": {
    "subjectId": "biology",
    "topicId": "digestion",
    "titleZh": "營養與消化",
    "titleEn": "Nutrition & Digestion",
    "conceptZh": "小腸內壁有大量絨毛，面積大，是養分吸收的主要場所。",
    "conceptEn": "The small intestine’s many villi give a huge surface area for nutrient absorption.",
    "mustKnowZh": [
      "小腸內壁有大量絨毛，面積大，是養分吸收的主要場所。",
      "絨毛增大表面積、壁薄、富微血管與乳糜管，利於快速吸收。",
      "胃酸（鹽酸）殺死細菌，並為胃蛋白酶提供酸性最適 pH。",
      "膽汁不含酶，但把大脂肪滴乳化成小滴，增大表面積助脂肪酶作用。"
    ],
    "mustKnowEn": [
      "The small intestine’s many villi give a huge surface area for nutrient absorption.",
      "Villi increase surface area, are thin-walled and rich in capillaries/lacteals for rapid absorption.",
      "Stomach acid (HCl) kills bacteria and gives pepsin its acidic optimum pH.",
      "Bile is not an enzyme but emulsifies fat into small droplets, aiding lipase."
    ],
    "examTipZh": "DSE 作答「營養與消化」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Nutrition & Digestion”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "bio_genetics_logic": {
    "subjectId": "biology",
    "topicId": "bio_genetics_logic",
    "titleZh": "遺傳推理",
    "titleEn": "Genetics — reasoning",
    "conceptZh": "母親 Iᴬ Iᴮ × 父親 ii。",
    "conceptEn": "Mother Iᴬ Iᴮ × father ii.",
    "mustKnowZh": [
      "母親 Iᴬ Iᴮ × 父親 ii。",
      "兒子的 X 必來自母親。",
      "高莖×高莖卻分離出 1/4 矮莖（隱性），表示雙親都帶隱性等位卻不表現，即雜合 Tt × Tt → 3 顯 : 1 隱，正是孟德爾單因子分離比。",
      "患病子女的基因型必為 aa，兩個隱性等位基因分別來自父與母，故雙親各自至少帶有一個 a。"
    ],
    "mustKnowEn": [
      "Mother Iᴬ Iᴮ × father ii.",
      "A son’s X comes from the mother.",
      "Tall × tall yielding 1/4 dwarf (recessive) means both parents carry a hidden recessive allele, i.",
      "The affected child must be aa, receiving one recessive allele from each parent, so each parent carries at least one a."
    ],
    "examTipZh": "DSE 作答「遺傳推理」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Genetics — reasoning”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "bio_physio_chain": {
    "subjectId": "biology",
    "topicId": "bio_physio_chain",
    "titleZh": "生理機制・因果鏈",
    "titleEn": "Physiology — causal chains",
    "conceptZh": "水經滲透由「較高（較不負）」水勢流向「較低（較負）」水勢。",
    "conceptEn": "Osmosis moves water from higher (less negative) to lower (more negative) Ψ.",
    "mustKnowZh": [
      "水經滲透由「較高（較不負）」水勢流向「較低（較負）」水勢。",
      "超過最適溫度，熱能破壞維持酶三維結構的鍵，活性部位形狀改變（變性），與受質的契合喪失，速率急降。",
      "運動時肌肉呼吸作用加劇，產生大量二氧化碳並釋入血液。",
      "胰島素由胰島的 β 細胞分泌，作用是提高細胞膜對葡萄糖的通透性，令肝細胞與肌肉細胞加快吸收血中葡萄糖，並把它轉化為肝醣儲存，血糖因而回落 —— 這是一個典型的負回饋：血糖上升觸發胰島素，胰島素令血糖下降，血糖回落又令胰島素分泌減少。"
    ],
    "mustKnowEn": [
      "Osmosis moves water from higher (less negative) to lower (more negative) Ψ.",
      "Above the optimum, heat disrupts the bonds holding the enzyme’s 3-D shape; the active site changes shape (denaturation) and loses its fit for substrate, so the rate plunges.",
      "During exercise muscle respiration increases sharply, producing carbon dioxide that enters the blood.",
      "Insulin is secreted by the β cells of the pancreatic islets and increases the permeability of cell membranes to glucose, so liver and muscle cells take up blood glucose faster and…"
    ],
    "examTipZh": "DSE 作答「生理機制・因果鏈」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Physiology — causal chains”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "身體監測的是廢物累積，不是燃料短缺，因為二氧化碳的變化更快、更靈敏。體溫在運動時上升而非下降；肌肉肝醣在運動時被消耗，含量下降。",
    "commonTrapEn": "the body monitors waste accumulation rather than fuel shortage, because carbon dioxide changes faster and more sensitively. Body temperature rises during exercise, and muscle glycogen is consumed, not accumulated.",
    "source": "generated"
  },
  "bio_data_ecology": {
    "subjectId": "biology",
    "topicId": "bio_data_ecology",
    "titleZh": "數據與生態",
    "titleEn": "Data & ecology",
    "conceptZh": "由生產者到次級消費者要經「兩次」10% 傳遞：10 000 × 0.",
    "conceptEn": "From producer to secondary consumer is TWO 10% transfers: 10 000 × 0.",
    "mustKnowZh": [
      "由生產者到次級消費者要經「兩次」10% 傳遞：10 000 × 0.",
      "上升段表示光是限制因素；到平台期，再加光也不升，代表光已充足，瓶頸轉為另一因素（CO₂ 或溫度）。",
      "種群密度 = 個體數 ÷ 面積 = 60 ÷ 20 = 3 株／平方米。",
      "標記重捕法假設標記個體在種群中均勻混合，故第二次樣本中帶標記的比例等於種群中被標記的比例：$\\dfrac{R}{C} = \\dfrac{M}{N}$，即 $N = \\dfrac{M \\times C}{R} = \\dfrac{40 \\times 40}{8} = 200$ 條。"
    ],
    "mustKnowEn": [
      "From producer to secondary consumer is TWO 10% transfers: 10 000 × 0.",
      "The rising part shows light limiting; at the plateau, more light gives no increase, so light is now sufficient and the bottleneck shifts to another factor (CO₂ or temperature).",
      "Population density = number of individuals ÷ area = 60 ÷ 20 = 3 per m².",
      "Mark-and-recapture assumes marked individuals mix evenly, so the marked proportion in the second sample equals the marked proportion of the population: $\\frac{R}{C} = \\frac{M}{N}$…"
    ],
    "examTipZh": "DSE 作答「數據與生態」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Data & ecology”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "60 株／平方米直接抄了總數；0.333 株／平方米把分子分母倒轉；1200 株／平方米改成了相乘。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  }
}
