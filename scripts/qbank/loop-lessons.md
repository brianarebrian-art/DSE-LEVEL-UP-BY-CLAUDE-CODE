# DSE LEVEL UP · Loop Memory（`/dse-build-auto`）

## 初始化規則
開任何新 Loop **之前** 先讀本檔；任何失敗 **之後** append 一條。
Seed 條目 = 由真實 repo 稽核 / 過往 session 累積嘅紅線，**唔係** 捏造嘅 loop 跑數。

## 每條格式
```
### [YYYY-MM-DD] · [Subject] · [Topic]
- Failure: 出咗咩事
- Error DNA: CMT/TMR/MEC/TER/FMT/SEN/CPY/AUD（可複合）
- Reason: 根因
- Solution: 具體預防措施
- Loops used: 次數（seed 條寫「— (seed)」）
```

---

## Seed 條目（真實紅線，開工前必讀）

### 2026-07-24 · Econ · Public Goods / 生產要素
- Failure: 用「公共財」/「企業」（entrepreneurship）
- Error DNA: TER
- Reason: 大學課本術語 vs DSE 課綱術語混淆
- Solution: 出經濟題前默念「共用品、企業家職能、免費物品、經濟物品」；跑 `term-guard.mjs`
- Loops used: — (seed)

### 2026-07-24 · All · 長答案批改
- Failure: spec 反覆要求 regex/keyword 自動幫開放式答案打分（§5 陷阱，已捉第 8 次）
- Error DNA: TER + 紅線
- Reason: 每份憲章都偷偷放返長答案自動批改，同自己 blocklist 相矛盾
- Solution: 機器只自動批 MC；marking_scheme 只作人眼參考；長答案要創辦人 opt-in 且永不機器評分
- Loops used: — (seed)

### 2026-07-24 · All · localStorage keys
- Failure: spec 虛構 `dse_error_dna` / `dse_level_config` / `dse_session_state` 等 6 個唔存在嘅 key
- Error DNA: FMT
- Reason: 憑印象寫 key 名，冇對 repo
- Solution: 用真 key（`dse_progress`/`dse_topic_stats`/`dse_reverse_log`/`dse_active_session`/`dse_emotion_log`/`dse_relax_sensory_pref`…）；error DNA、level 係 runtime 派生非儲存
- Loops used: — (seed)

### 2026-07-24 · All · 危機熱線
- Failure: spec 寫 Samaritan「2389 2222」，同 App 實際「2896 0000」唔一致（安全關鍵）
- Error DNA: TER + 紅線
- Reason: 記錯 / 唔同機構撈亂
- Solution: 一律用 App 真實號碼：撒瑪利亞會 2896 0000、生命熱線 2382 0000、緊急 999
- Loops used: — (seed)

### 2026-07-24 · Math · 格式
- Failure: `correctIndex` 用字母（"B"）而非數字（1）
- Error DNA: FMT
- Reason: 忘記數字索引紅線
- Solution: 出 JSON 後搜任何字母答案，轉 0–3；解析引選項【內容】非字母
- Loops used: — (seed)

---

## 效能追蹤
```
- 本週平均每次成功 loop 數: ___
- 最常被 BLOCK 嘅準則: ___
- 本週產出題數: ___
- 人手介入率: ___%
```
