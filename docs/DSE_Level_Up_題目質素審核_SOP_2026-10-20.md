# DSE Level Up 題目質素審核 SOP

## 1. 審核目標

「與 HKEAA 接軌」在本平台只代表每題都有可追溯的課綱、評核形式、答案、難度及覆核證據。它不代表平台題目是 HKEAA 原題，也不代表平台分數可換算官方等級。

HKEAA 的公開說明顯示，DSE 試卷會經歷擬題、審題、審核及校對，並由試卷明細表檢視涵蓋範圍與認知要求。DSE Level Up 的輕量版本因此採用：AI 初審 → 科目編輯／教師覆核 → 高風險題第二覆核 → 學生實測校準 → 版本化修訂。

## 2. 已建立的資料結構

- `dse_curriculum_frameworks`：每科一行，保存科目名稱、官方科目資訊入口、評核大綱／課程指引 URL、文件年份、核實狀態及備註。
- `dse_quality_prompt_versions`：保存 Prompt 版本、評分規準、硬性閘門及啟用狀態。
- `dse_question_quality_reviews`：逐題評分表。六項各 0–5 分，最高 30 分；另存課綱映射、評核目標、認知層級、題型／指令詞、答案、評分準則、語言、難度、版權、實測及覆核者。
- 現有 `review_decisions` 保留作原有批次 A/R/P 審批傳送層；新評分表不取代原有促發布流程。

## 3. 評分表硬性閘門

任何一項不通過，不能標記 `approved`：找不到現行課綱具體對應；題型／分值／指令詞不屬該卷；答案鍵或計算未核實；長答沒有逐分評分點；內容已過時或超出範圍；疑似複製 HKEAA；由 AI 或未具資格者代替教師簽批；實測難度明顯偏離而題目未修訂。

總分 24/30 只是必要條件，不是充分條件。必須同時有合資格覆核者姓名、日期及來源位置。長答、資料回應、計算題、雙語題或任何 blocker 須第二覆核。

## 4. 操作流程

1. 先從 HKEAA 科目資訊頁找到現行評核大綱、課程及評估指引、樣本試題、考生表現示例及其他官方資源。課程／評核文件需記錄年份及直接 URL。
2. 為題目填入科目、卷別、課題編號、考核目標、認知層級、題型、分值、建議時間及官方證據位置。
3. AI 只做初審，將不確定項填 `unverified`，並列明需要教師確認的問題。
4. 科目教師逐題核答案。非選擇題必須補足滿分答案、逐分評分點、可接受答案、常見錯誤及跟進學習點。
5. 以 0–5 分評六項：課綱、評核接軌、答案及評分準則、語言格式、難度、證據可審計性。
6. 高風險題進第二覆核。覆核者不可只按第一位的結論簽名，必須獨立讀題及留痕。
7. 每科每月抽 5–10% 題作實測；記錄得分率、用時中位數、放棄率及錯誤類型。樣本不足即標示，不虛構結果。
8. 偏離預期的題目進 `revision_required`，修訂後新增版本或保留修訂紀錄；不要只調高／調低難度標籤。
9. 每次課綱或評核大綱更新，先標記受影響科目 `needs_update`，停止以舊版本宣稱接軌，完成重新映射後才恢復。

## 5. HKEAA 官方來源

- HKEAA 科目資訊：按科目查找現行評核大綱、課程及評估指引、樣本試題及考生表現示例。
- HKEAA《DSE 試卷是怎樣煉成的？》：說明審題委員會、試卷審核員、校對員、試卷明細表及多重核對流程。
- HKEAA 質素保證框架／相關小冊子：作為質素保證、保密、分工及證據留痕的上位原則。
- 教育局課程文件：提供課程及評估指引，需按科目及適用年份核實。

## 6. 目前狀態

已在 Supabase `DSE-LEVEL-UP` 建立框架及評分表，並將 live `questions` 題庫加入逐題待審隊列。這批初始化資料只是隊列與機器欄位快照，未代表任何題目已通過教師審定。下一輪工作應按科目分批補入官方文件直接 URL，再由 AI 初審及教師逐題覆核。

## References

[1]: https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/ "HKEAA 科目資訊"
[2]: https://blog.hkeaa.edu.hk/blog_details.php?id=388203 "DSE試卷是怎樣煉成的？"
[3]: https://www.hkeaa.edu.hk/tc/resources/leaflets/leaflets.html "HKEAA 資料單張及小冊子"
[4]: https://www.edb.gov.hk/tc/curriculum-development/kla/pshe/curriculum-documents.html "教育局課程文件"
[5]: https://www.hkeaa.edu.hk/DocLibrary/Media/Leaflets/Introduction_of_HKDSE_2026-05.pdf "香港中學文憑考試簡介小冊子 2026"
[6]: https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/math/2027hkdse-e-math.pdf "2027 HKDSE Mathematics Assessment Framework"
[7]: https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/bio/2027hkdse-e-bio.pdf "2027 HKDSE Biology Assessment Framework"
[8]: https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/eng_lang/2027hkdse-e-elang.pdf "2027 HKDSE English Language Assessment Framework"
