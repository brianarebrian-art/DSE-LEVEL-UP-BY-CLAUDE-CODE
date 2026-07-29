# 英文科 Grammar 逐題覆核表

**用途**：Supabase `dse_topic_stats` 實測 English / Grammar = **16 次作答、11 次答錯、68.8%**。
依 2026-07-29 決定，先人手覆核題目本身有無答案鍵錯、選項重複或題幹歧義，確認題目無誤後才改解析。

**數據性質說明**：上述 16／11 為**全時累計數**（`dse_topic_stats` 無 per-attempt 時間戳），非單日數。
題庫 Grammar 共 15 題，即幾乎每題都被作答過一次。樣本薄，錯誤率屬指向性訊號而非結論。

**批核方式**：喺每題「判定」欄填 ✅ 無問題 ／ ✏️ 要改解析 ／ ❌ 答案鍵錯（後者即觸發該科 DEFCON 1）。

> 抽取由機器完成，最終正確性判斷屬真人。下方「優先覆核」為協助排序的意見，非裁決；
> 簽名欄一律留空。

---

## ⚠️ 優先覆核（2 題）

其餘 13 題的答案鍵，經逐題檢視未見問題（主謂一致、倒裝虛擬、冠詞、關係代詞、
not only 倒裝、fewer/less、平行結構、垂懸修飾語、比較級、gerund/infinitive、
反意疑問句、the number of + 單數 —— 皆為 DSE 常規考點，正確選項唯一且干擾項各有明確錯誤）。
**即是說：68.8% 這個數字大概率不是「答案鍵普遍出錯」造成的。** 但以下兩題值得先看。

### 🔴 `en_gr_2` — 疑似兩個選項都對

```
Each student must bring his or her own laptop.   ← 現時標為唯一正確
Each student must bring their own laptop.        ← 現時標為錯
```

單數 they／their 已獲 Merriam-Webster、Cambridge、AP 及 Chicago 認可為標準英語。
考生選 "their" 而被判錯，等於因為用了正確的現代英語而失分。
本題現有解析亦自行寫住 "traditionally a singular pronoun"，即已承認這是取態問題而非語法錯誤。

三個考量疊埋：① 一題兩個正確選項屬命題缺陷；② 強制 "his or her" 同時是性別語言問題，
與大愛 UDL 取態不一致；③ 這正是那種「認真讀完仍然揀錯」的題目。
**建議選項**：改為考別的單數一致點，或將 "their" 一併視為正確並重寫干擾項。

### 🟠 `en_gr_12` — 英式英語下第二個選項站得住

```
I suggest that he take a break.                      ← 現時標為唯一正確
I suggest he takes a break to relax himself.         ← 現時標為錯
```

"suggest + that + 原形"（虛擬式）是美式慣例；**英式英語用直陳式 "he takes" 同樣標準**，
而 DSE 跟英式慣例。本題目前靠加上 "to relax himself"（累贅、不自然）來製造分別，
即分辨點其實落在措辭而非文法 —— 對認真的考生而言屬不必要的陷阱。
**建議選項**：干擾項改為明確錯誤的結構（如 "I suggest him to take a break" 已在選項中），
或把題幹限定為指定語域。

---

## 1. `en_gr_1`  ·  難度 easy

**題幹**：Choose the correct sentence:

- [x] (0) Neither of the answers is correct.
- [ ] (1) Neither of the answers are correct.
- [ ] (2) Neither of the answers were correct.
- [ ] (3) Neither of the answer is correct.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："Neither" is singular, so it takes a singular verb: "is". The plural "are/were" mismatches the subject, and "the answer" should be plural "answers" after "of the".

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 2. `en_gr_2`  ·  難度 medium

**題幹**：Choose the correct sentence:

- [x] (0) Each student must bring his or her own laptop.
- [ ] (1) Each student must bring their own laptop.
- [ ] (2) Each students must bring his own laptop.
- [ ] (3) Each student must brings his own laptop.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："Each" is singular, requiring a singular noun ("student"), a base verb after "must" ("bring"), and traditionally a singular pronoun ("his or her"). The other options break subject–verb or noun agreement.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 3. `en_gr_3`  ·  難度 medium

**題幹**：Identify the sentence with correct subject–verb agreement:

- [x] (0) The team of researchers has published its findings.
- [ ] (1) The team of researchers have published its findings.
- [ ] (2) The team of researchers has published their findings.
- [ ] (3) The team of researchers having published its findings.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：Treated as a single unit, "the team" takes a singular verb "has" and singular pronoun "its". Mixing "has" with "their" or "have" with "its" creates inconsistency.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 4. `en_gr_4`  ·  難度 hard

**題幹**：Choose the grammatically correct sentence:

- [x] (0) Had I known earlier, I would have helped you.
- [ ] (1) Had I knew earlier, I would have helped you.
- [ ] (2) If I would have known earlier, I would have helped you.
- [ ] (3) Had I known earlier, I will have helped you.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：In third conditional inversion, "Had" is followed by the past participle "known" and the main clause uses "would have helped". "Knew", "would have known" in the if-clause, and "will" are all incorrect.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 5. `en_gr_5`  ·  難度 medium

**題幹**：Which sentence uses the article correctly?

- [x] (0) She is an honest and hard-working employee.
- [ ] (1) She is a honest and hard-working employee.
- [ ] (2) She is the honest and hard-working employee.
- [ ] (3) She is honest and a hard-working employee.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："Honest" begins with a silent "h", so the vowel sound requires "an". "A honest" ignores the sound; "the" wrongly specifies; and splitting the articles across the adjectives is ungrammatical.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 6. `en_gr_6`  ·  難度 medium

**題幹**：Choose the sentence with the correct relative pronoun:

- [x] (0) The book that I borrowed is overdue.
- [ ] (1) The book what I borrowed is overdue.
- [ ] (2) The book who I borrowed is overdue.
- [ ] (3) The book whose I borrowed is overdue.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：For a thing as the object of the clause, "that" (or "which") is correct. "What" cannot introduce a relative clause here, "who" is for people, and "whose" shows possession.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 7. `en_gr_7`  ·  難度 hard

**題幹**：Select the correctly constructed sentence:

- [x] (0) Not only did she finish the project, but she also won an award.
- [ ] (1) Not only she finished the project, but she also won an award.
- [ ] (2) Not only did she finished the project, but she also won an award.
- [ ] (3) Not only she did finish the project, but also won an award.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：After the negative opener "Not only", the subject and auxiliary invert: "did she finish" (base verb). "She finished" lacks inversion and "did she finished" doubles the past tense.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 8. `en_gr_8`  ·  難度 medium

**題幹**：Which sentence is correct?

- [x] (0) There are fewer cars on the road today.
- [ ] (1) There are less cars on the road today.
- [ ] (2) There is fewer cars on the road today.
- [ ] (3) There are lesser cars on the road today.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："Cars" are countable, so "fewer" is correct; "less" is for uncountable nouns. The verb must be plural "are", and "lesser" means "smaller in importance", not quantity.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 9. `en_gr_9`  ·  難度 medium

**題幹**：Choose the sentence with correct parallel structure:

- [x] (0) She likes reading, writing, and painting.
- [ ] (1) She likes reading, to write, and painting.
- [ ] (2) She likes to read, writing, and paint.
- [ ] (3) She likes reading, write, and to paint.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：Parallel structure requires the same grammatical form for items in a list — here three gerunds: "reading, writing, painting". Mixing gerunds with infinitives or base verbs breaks the parallelism.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 10. `en_gr_10`  ·  難度 hard

**題幹**：Identify the sentence without a dangling modifier:

- [x] (0) Walking to school, I saw a rainbow.
- [ ] (1) Walking to school, a rainbow appeared.
- [ ] (2) Walking to school, the rainbow was seen.
- [ ] (3) Walking to school, there was a rainbow.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：The modifier "Walking to school" must describe the subject that follows; only "I" can walk. In the others, a rainbow cannot walk to school, so the modifier dangles.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 11. `en_gr_11`  ·  難度 medium

**題幹**：Choose the correct comparative form:

- [x] (0) This problem is more difficult than the last one.
- [ ] (1) This problem is more difficulter than the last one.
- [ ] (2) This problem is difficulter than the last one.
- [ ] (3) This problem is most difficult than the last one.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：Multi-syllable adjectives form the comparative with "more" + base form: "more difficult". "Difficulter" is not a word, and "most" is superlative, not comparative.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 12. `en_gr_12`  ·  難度 medium

**題幹**：Which sentence uses the correct form after "suggest"?

- [x] (0) I suggest that he take a break.
- [ ] (1) I suggest him to take a break.
- [ ] (2) I suggest he takes a break to relax himself.
- [ ] (3) I suggest to take a break for him.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："Suggest" is followed by "that" + subjunctive base verb ("take"), not an object + infinitive. "Suggest him to" and "suggest to take ... for him" are non-standard constructions.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 13. `en_gr_13`  ·  難度 hard

**題幹**：Select the correct use of the gerund/infinitive:

- [x] (0) I look forward to meeting you.
- [ ] (1) I look forward to meet you.
- [ ] (2) I look forward meeting you.
- [ ] (3) I look forward for meeting you.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：In "look forward to", "to" is a preposition, so it is followed by a gerund "meeting". Using the bare infinitive "meet" or dropping/changing the preposition is incorrect.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 14. `en_gr_14`  ·  難度 medium

**題幹**：Choose the correct question tag:

- [x] (0) You have finished your homework, haven’t you?
- [ ] (1) You have finished your homework, don’t you?
- [ ] (2) You have finished your homework, haven’t they?
- [ ] (3) You have finished your homework, have you?

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**：A positive statement with auxiliary "have" takes a negative tag with the same auxiliary and matching subject pronoun: "haven’t you?". "Don’t", "they", and a positive tag all mismatch.

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |

## 15. `en_gr_15`  ·  難度 medium

**題幹**：Which sentence is grammatically correct?

- [x] (0) The number of applicants has increased.
- [ ] (1) The number of applicants have increased.
- [ ] (2) A number of applicants has increased.
- [ ] (3) The number of applicant have increased.

**correctIndex**：`0`（選項於執行時洗牌，故解析不得引用字母）

**解析**："The number of" is singular and takes "has" (whereas "a number of" is plural and takes "have"). The noun after "of" should also be plural "applicants".

| 判定 | 覆核人 | 日期 | 備註 |
|---|---|---|---|
|  |  |  |  |
