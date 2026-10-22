from pathlib import Path
import csv

root = Path(__file__).resolve().parents[1]
subjects = {
  'Maths': [('quadratic-equations','一元二次方程','DSE Maths quadratic equation'),('functions','函數','DSE Maths functions'),('coordinate-geometry','坐標幾何','DSE Maths coordinate geometry'),('trigonometry','三角學','DSE Maths trigonometry'),('permutation-combination','排列與組合','DSE Maths permutation combination'),('probability','概率','DSE Maths probability'),('statistics','統計','DSE Maths statistics'),('sequences','數列','DSE Maths sequences'),('exponential-logarithmic','指數與對數','DSE Maths logarithm'),('calculus','微積分','DSE Maths calculus')],
  'English': [('writing-format','英文寫作格式','DSE English writing format'),('argumentative-writing','議論文寫作','DSE English argumentative essay'),('letter-email','書信與電郵','DSE English letter format'),('article-writing','文章寫作','DSE English article writing'),('report-writing','報告寫作','DSE English report format'),('reading-comprehension','閱讀理解','DSE English reading comprehension'),('grammar-tenses','時態與文法','DSE English grammar tenses'),('vocabulary-building','詞彙建立','DSE English vocabulary'),('speaking-skills','口語技巧','DSE English speaking skills'),('integrated-skills','綜合能力','DSE English integrated skills')],
  'Chinese': [('paper-one-reading','卷一閱讀理解','DSE 中文 卷一 技巧'),('paper-two-writing','卷二寫作','DSE 中文 寫作 技巧'),('paper-three-listening','卷三聆聽','DSE 中文 卷三 技巧'),('paper-four-speaking','卷四說話','DSE 中文 卷四 技巧'),('classical-chinese','文言文','DSE 中文 文言文'),('modern-chinese','現代文閱讀','DSE 中文 閱讀理解'),('argumentation','議論文','DSE 中文 議論文'),('narrative-writing','記敘文','DSE 中文 記敘文'),('poetry-appreciation','詩歌賞析','DSE 中文 詩歌'),('common-mistakes','常見錯誤','DSE 中文 常見錯誤')],
  'Biology': [('cell-structure','細胞結構','DSE Biology notes cell'),('genetics','遺傳','DSE Biology genetics'),('homeostasis','恆常性','DSE Biology homeostasis'),('ecosystems','生態系統','DSE Biology ecosystems'),('human-reproduction','人體生殖','DSE Biology reproduction'),('enzymes','酶','DSE Biology enzymes'),('photosynthesis','光合作用','DSE Biology photosynthesis'),('respiration','呼吸作用','DSE Biology respiration'),('transport-in-plants','植物運輸','DSE Biology plant transport'),('data-analysis','數據分析','DSE Biology data analysis')],
  'Chemistry': [('mole-calculation','摩爾計算','HKDSE Chemistry mole calculation'),('chemical-bonding','化學鍵','DSE Chemistry chemical bonding'),('periodic-table','週期表','DSE Chemistry periodic table'),('acids-bases','酸與鹼','DSE Chemistry acids bases'),('redox','氧化還原','DSE Chemistry redox'),('organic-chemistry','有機化學','DSE Chemistry organic'),('rates-of-reaction','反應速率','DSE Chemistry rate'),('equilibrium','化學平衡','DSE Chemistry equilibrium'),('electrochemistry','電化學','DSE Chemistry electrochemistry'),('qualitative-analysis','定性分析','DSE Chemistry qualitative analysis')],
  'Physics': [('motion','運動學','DSE Physics motion'),('forces','力','DSE Physics forces'),('energy','能量','DSE Physics energy'),('electricity','電學','DSE Physics electricity'),('waves','波','DSE Physics waves'),('thermal-physics','熱學','DSE Physics thermal'),('radioactivity','放射性','DSE Physics radioactivity'),('momentum','動量','DSE Physics momentum'),('circular-motion','圓周運動','DSE Physics circular motion'),('astronomy','天文學','DSE Physics astronomy')],
  'Economics': [('demand-supply','需求與供應','DSE Economics demand supply'),('elasticity','彈性','DSE Economics elasticity'),('market-failure','市場失效','DSE Economics market failure'),('macroeconomics','宏觀經濟','DSE Economics macroeconomics'),('inflation','通脹','DSE Economics inflation'),('unemployment','失業','DSE Economics unemployment'),('monetary-policy','貨幣政策','DSE Economics monetary policy'),('fiscal-policy','財政政策','DSE Economics fiscal policy'),('exchange-rate','匯率','DSE Economics exchange rate'),('data-response','資料回應題','DSE Economics data response')],
  'BAFS': [('accounting-equation','會計等式','DSE BAFS accounting equation'),('financial-statements','財務報表','DSE BAFS financial statements'),('ratio-analysis','比率分析','DSE BAFS ratio analysis'),('marketing-mix','市場營銷組合','DSE BAFS marketing mix'),('human-resources','人力資源','DSE BAFS human resources'),('business-environment','營商環境','DSE BAFS business environment'),('investment','投資','DSE BAFS investment'),('cash-flow','現金流量','DSE BAFS cash flow'),('entrepreneurship','創業','DSE BAFS entrepreneurship'),('ethics','商業道德','DSE BAFS business ethics')],
}
rows=[]
# 20 P0: core landing/tools + first topic of each subject
p0=[('科目總覽','/subjects','DSE 各科筆記與練習','科目選擇、學習路線、練習入口','各科頁、AI 工具','選擇科目'),('Maths','/dse-maths','DSE Maths 筆記與題解','核心章節、公式、例題、錯誤','二次方程、練習、Past Paper','開始 Maths 練習'),('English','/dse-english','DSE English 筆記與寫作技巧','文體、閱讀、文法、練習','writing format、寫作','開始 English 練習'),('Chinese','/dse-chinese','DSE 中文筆記與答題技巧','卷一至卷四、閱讀、寫作','卷一、卷二','開始中文練習'),('Biology','/dse-biology','DSE Biology notes','概念圖、術語、數據題','細胞、遺傳','開始 Biology 練習'),('Chemistry','/dse-chemistry','DSE Chemistry notes','公式、計算、實驗','摩爾、酸鹼','開始 Chemistry 練習'),('Physics','/dse-physics','DSE Physics notes','公式、圖像、實驗題','運動、電學','開始 Physics 練習'),('Economics','/dse-economics','DSE Economics notes','圖表、政策、資料題','需求供應、通脹','開始 Economics 練習'),('BAFS','/dse-bafs','DSE BAFS notes','會計、管理、商業案例','會計等式、報表','開始 BAFS 練習'),('Maths','/dse-maths/quadratic-equations','DSE Maths quadratic equation','公式、判別式、分步例題、失分位','DSE Maths、練習','開始二次方程練習'),('English','/dse-english/writing-format','DSE English writing format','letter、article、report 結構與語氣','DSE English、寫作','開始英文寫作'),('AI','/ai/practice-generator','AI 生成 DSE 練習題','選科目、課題、難度、核對答案','科目頁、主題筆記','建立練習'),('AI','/ai/study-plan','AI DSE 個人化學習計劃','弱項、時間、短任務、覆盤','練習、科目頁','規劃下一步'),('AI','/ai/past-paper-explainer','AI Past Paper 題解','題目條件、解法、失分位、核對','Past Paper、概念頁','開始拆題'),('AI','/ai/essay-feedback','AI 英文作文回饋','內容、結構、語氣、文法檢查界線','writing format、練習','檢查文章'),('Past Paper','/past-papers','DSE Past Paper 題解總覽','年份、科目、題型、解題索引','科目、AI 題解','查看題解'),('Study','/dse-study-plan','DSE 5** 溫習方法','目標拆解、時間表、訂正、休息','AI plan、科目頁','建立溫習安排'),('Study','/dse-exam-tips','DSE 考試技巧','讀題、時間管理、檢查、常見失分','各科筆記、Past Paper','查看技巧'),('Study','/dse-revision-guide','DSE 溫習方法完整指南','目標拆解、錯題整理、間隔重溫、休息安排','學習計劃、科目頁','查看溫習指南'),('About','/methodology','DSE Level Up 內容方法','原創內容、題庫界線、更新方式','透明度、科目頁','了解內容來源')]
for group,path,intent,outline,links,cta in p0: rows.append(['P0',intent,f'{intent}｜DSE Level Up',path,group,outline,links,cta])
# P1: first 30 detailed subtopics
all_topics=[(g,slug,name,intent) for g,items in subjects.items() for slug,name,intent in items]
for g,slug,name,intent in all_topics[:30]:
  base=g.lower().replace(' ','-')
  path=f'/dse-{base}/{slug}'
  rows.append(['P1',intent,f'DSE {g} {name}：筆記、例題與常見錯誤｜DSE Level Up',path,'主題筆記',f'{name}核心概念、公式或流程、分步例題、常見錯誤、DSE 考試重點',f'/dse-{base}, /practice, /ai/practice-generator','開始相關練習'])
# P2: remaining 30 long-tail / paper intent
for g,slug,name,intent in all_topics[30:60]:
  base=g.lower().replace(' ','-')
  path=f'/dse-{base}/{slug}'
  rows.append(['P2',f'{intent} past paper 題解',f'DSE {g} {name} Past Paper 題解與失分位｜DSE Level Up',path,'長尾題解',f'題目重點、評分要求、分步解法、失分位、相似題與延伸概念',f'/dse-{base}, /past-papers, /ai/past-paper-explainer','查看相似題'])
assert [r[0] for r in rows].count('P0') == 20
assert [r[0] for r in rows].count('P1') == 30
assert [r[0] for r in rows].count('P2') == 30
headers=['優先級','目標搜尋意圖','建議頁面/title','URL','頁面類型','內容大綱','內部連結','CTA']
with (root/'docs/seo-content-map.csv').open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.writer(f); w.writerow(headers); w.writerows(rows)
with (root/'docs/SEO-CONTENT-MAP.md').open('w',encoding='utf-8') as f:
  f.write('# SEO 內容地圖\n\n> 每頁上線前仍須由內容負責人核對 syllabus、題目來源和更新日期。title 與 description 應以實際可見內容為準，不以關鍵字堆砌為目標。\n\n| ' + ' | '.join(headers) + ' |\n|---|'*len(headers) + '|\n')
  for r in rows:
    f.write('| ' + ' | '.join(x.replace('|','\\|') for x in r) + ' |\n')
  f.write('\n## 每頁內容規格\n\n每一頁都要有一個清楚的 H1、獨特 title、約 150–160 字符的自然 meta description、可見的核心內容、描述性內部連結、合適 CTA，以及與頁面可見內容一致的 BreadcrumbList。長度只是編輯參考，不是排名門檻；Google 官方沒有指定內容字數上下限。\n')
