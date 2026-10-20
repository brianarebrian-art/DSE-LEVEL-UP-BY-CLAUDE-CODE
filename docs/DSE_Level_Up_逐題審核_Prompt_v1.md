# DSE Level Up 逐題質素審核 Prompt v1.0

**用途：** 供 AI 初審、科目教師／科目編輯及受訓義工使用。這份 Prompt 是「審核紀錄生成器」，不是教師資格替代品。AI 或義工不得把題目標記為「教師已審定」。

**官方基準：** 先以 HKEAA 科目資訊頁列出的現行《評核大綱》、教育局／課程發展議會《課程及評估指引》為準，再用 HKEAA 公開試卷、評卷參考、考生表現示例及考試報告作題型與作答要求的校準。HKEAA 公開說明指出，試卷製作包括擬題、審題、審核及校對，並以試卷明細表檢視涵蓋範圍及認知要求；平台應仿效其「分工、留痕、不可由單一檢查代替」的原則。

## 角色規則

- **AI 初審：** 只可作事實、計算、結構、格式、重複、課綱候選映射及風險標記。AI 不可宣稱「符合 HKEAA」或批准上線。
- **科目教師／科目編輯：** 核實課綱編號、考核目標、題型、答案、評分準則、難度及合理答案範圍。長答、資料題、計算題或有爭議題至少需要第二位覆核者。
- **義工：** 只可核對文字清晰度、格式、明顯重複、缺欄、版權疑點及是否需要升級；不得獨立裁決學術答案、課綱對應或評分點。

## 輸入

請提供：

1. 題目 ID、科目、卷別／題型、題幹、選項或資料、分值、建議時間。
2. 參考答案、解析、長答評分準則及可接受答案範圍。
3. 題目原創／改寫來源聲明；不可貼上或公開 HKEAA 原題全文。
4. 對應的 HKEAA／教育局官方文件 URL、文件版本／年份、章節或頁碼。
5. 如有，提供學生作答人數、得分率、中位用時、放棄率及錯誤類型。

## 必須遵守的硬性閘門

任何一項不通過，都不能標記為 `approved`：

- 找不到現行課程及評估指引或評核大綱的具體對應；
- 題型、分值、指令詞或作答形式明顯不屬該科現行公開評核；
- 正確答案、計算、事實或選項唯一性未核實；
- 長答／資料題沒有逐分評分點、合理答案範圍及常見失分原因；
- 涉及已刪除／過時／非評核範圍內容，或要求非 DSE 預期方法而題目沒有交代；
- 疑似逐字複製 HKEAA 試題、資料、圖表或評卷參考；
- AI、義工或單一未具資格覆核者試圖代替教師簽批；
- 實測資料顯示難度嚴重偏離標籤，而題目尚未修訂。

## 評分規準：六項各 0–5 分，總分 30 分

### A. 課綱對應（0–5）

5 = 能指向現行文件的具體單元／學習成果／課題編號，並有文件版本及頁碼；3 = 只有單元級候選對應，待教師核實；0 = 無法對應、已刪除或明顯超出範圍。

### B. 評核接軌（0–5）

5 = 題型、卷別、指令詞、分值、作答形式及認知要求與現行評核大綱一致；3 = 大致相符但有一項需要修訂；0 = 形式或要求不屬該卷。

### C. 答案及評分準則（0–5）

5 = 答案已核算／核證，選項唯一，長答有逐分評分點、可接受表述、常見錯誤及跟進學習點；3 = 答案大致正確但評分細節不完整；0 = 答案鍵錯、計算錯或不可公平評分。

### D. 語言與格式（0–5）

5 = 中英文版本意思等值，指令清晰，資料、單位、圖表、分題及答題空間足夠；3 = 有輕微語言／排版問題但不改變答案；0 = 歧義、兩個合理答案、語言不等值或格式影響作答。

### E. 難度與認知層級（0–5）

5 = 認知層級、推理步驟、資料處理量、陷阱密度及建議時間均有依據，並有實測校準；3 = 標籤合理但尚無足夠實測；0 = 標籤與實際要求明顯不符或以冷門知識製造假難度。

### F. 證據及可審計性（0–5）

5 = 有官方來源、版本、核對位置、審核角色、時間及修訂紀錄；3 = 有來源但缺頁碼／第二覆核；0 = 只有「AI 檢查過」或不可追溯聲稱。

## 難度記錄格式

不要只寫「易／中／難」。至少記錄：認知層級、推理鏈步驟數、資料／文本處理量、陷阱類型、預計秒數，以及實測得分率、用時中位數、放棄率。樣本不足時填 `insufficient_sample`，不可虛構數字。

## 輸出格式（只輸出 JSON，不要輸出未要求的總結）

```json
{
  "question_id": "",
  "rubric_version": "v1.0",
  "role": "ai|subject_editor|teacher|volunteer|second_reviewer",
  "source_evidence": [
    {"url": "", "document_version": "", "location": "", "claim_supported": ""}
  ],
  "mapping": {
    "subject": "",
    "paper": "",
    "curriculum_code": "",
    "assessment_objective": "",
    "cognitive_level": "remember|understand|apply|analyse|evaluate|create|not_applicable"
  },
  "scores": {
    "syllabus": null,
    "assessment": null,
    "answer": null,
    "language": null,
    "difficulty": null,
    "evidence": null,
    "total": null
  },
  "checks": {
    "syllabus_alignment": "pass|borderline|fail|unverified",
    "question_type_fit": "pass|borderline|fail|not_applicable",
    "command_word_fit": "pass|borderline|fail|not_applicable",
    "factual_accuracy": "pass|borderline|fail|unverified",
    "answer_key_accuracy": "pass|borderline|fail|unverified",
    "marking_scheme_quality": "pass|borderline|fail|not_applicable|unverified",
    "language_format_quality": "pass|borderline|fail|unverified",
    "difficulty_alignment": "pass|borderline|fail|unverified",
    "copyright_risk": "clear|needs_review|high_risk|unverified",
    "empirical_calibration": "in_range|out_of_range|insufficient_sample|not_started"
  },
  "findings": [
    {"severity": "blocker|major|minor|note", "location": "", "finding": "", "recommended_change": ""}
  ],
  "decision": "pending|approve_with_revision|approve|reject|withdraw",
  "review_stage": "ai_precheck|human_review|second_review|pilot_calibration",
  "reviewer_name": "",
  "reviewer_attestation": "我只確認自己實際核對的部分；未核對部分已標為 unverified。"
}
```

## 放行規則

只有在總分至少 24/30、所有硬性閘門通過、`syllabus_alignment`、`answer_key_accuracy`、`copyright_risk` 均通過，並有至少一名合資格科目覆核者留下姓名、日期及證據，才可進入 `approved`。長答、資料回應、計算題、雙語不等值或任何 blocker 必須第二覆核。學生實測是校準依據，不得反過來證明答案一定正確。

## 對外聲明

平台可以說「題目有逐題審核紀錄」或「部分題目已完成教師覆核」，但不可說「全部題目等同 HKEAA」、「平台分數等同官方等級」或「AI 檢查即代表教師審定」。DSE Level Up 題目必須保持獨立改寫；HKEAA 試題、評卷參考及版權資料只可作受控內部校準，不能複製公開。
