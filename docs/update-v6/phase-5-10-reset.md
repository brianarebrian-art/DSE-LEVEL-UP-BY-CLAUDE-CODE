# v6 Phase 5–10 重做聲明（2026-11-04）

- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **觸發：** 創辦人要求「重新做 Phase 5–10」；此前已確認 **Phase 5 未完整就進入咗 Phase 6–10**。  
- **效力：** 本檔起，先前 Phase 6–10 嘅「Phase X 完成，等待批准」**唔再代表正式閘門通過**。該等文件保留作審計／草稿，狀態改為 **SUPERSEDED**。

---

## 1. 問題

總 prompt 要求：

1. **Phase 5：** 按 Milestone A→G 推進，**每個 milestone 完成後暫停**等批准。  
2. **Phase 6–10：** 只喺 Phase 5 實作完成（或你書面收窄 scope）之後先做測試→修正→驗收→發布→發布後驗證。

實際發生：只落地 **Milestone A**，隨隊列批准就寫咗 Phase 6–10 文件。雖然內容已誠實標 Blocked／N/A，但「完成 Phase 6–10」嘅說法易誤導。

---

## 2. 重做規則（而家起）

| Phase | 重做方式 |
|---|---|
| **5** | **恢復正確閘門。** 現行位置＝ **Milestone A 技術完成（PR #177，CI 綠）**，下一步只接受「批准 Milestone B」（或你書面「只交付 A、砍 B–G」）。**未**批准前唔開工 B–G，亦**唔**重跑 Phase 6–10 當正式完成。 |
| **6** | Phase 5 完整（或書面收窄）之後，**重新**跑測試並出新報告（可新檔或新版號）。舊 `phase-6-test-report.md` = SUPERSEDED。 |
| **7** | 對新 Phase 6 結果重新出修正報告。舊檔 SUPERSEDED。 |
| **8** | 對新範圍重新隔離驗收。舊檔 SUPERSEDED。 |
| **9** | 有可發布範圍後先出發布計劃；**禁止**未完成 Phase 5 就當可 100% 發布。舊檔 SUPERSEDED（兩軌思路可參考，唔當已批准 deploy）。 |
| **10** | 實際 deploy 後先填 Actual。舊工作簿 SUPERSEDED。 |

---

## 3. Milestone A（保留，唔推倒重來）

| 項 | 狀態 |
|---|---|
| 分支 | `cursor/v6-phase-5a-security-97aa` |
| PR | https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE/pull/177 |
| CI | lint-and-test **SUCCESS**（重做聲明當日） |
| 範圍 | server-only、secret:scan、audit CI、verified admin／reviewer、登出 wipe 接線、route-class 限流、runbook |
| 硬閘 | 仍無 production migration／key rotation／遠端 RLS |

**唔**為「重做」而刪 A 或重寫無關 code。A 算 Phase 5 第一個 milestone 已交付；重做嘅係**閘門同後續 Phase**，唔係無故拆 A。

---

## 4. 作廢嘅「完成」宣稱（文件）

| 檔 | 新狀態 |
|---|---|
| `phase-6-test-report.md` | SUPERSEDED |
| `phase-7-remediation-report.md` | SUPERSEDED |
| `phase-8-acceptance-checklist.md` | SUPERSEDED |
| `phase-9-release-plan.md` | SUPERSEDED |
| `phase-10-post-release-verification.md` | SUPERSEDED |

PR #178–#182：保留討論／diff，但**唔再當 Phase 6–10 正式收口**。合併策略由你決定（可一併作文件考古，或等 Phase 5 完成後用新 PR 取代）。

---

## 5. 現行唯一正式閘口

```text
Phase 5 · Milestone A 完成，等待批准 Milestone B
（或：書面收窄「只交付 A」）
```

批准後先會：

1. 開 Milestone B 實作（法律／私隱／共融基線；仍唔 apply 未批 migration）；**或**  
2. 若你收窄只交 A：先合併 #177，再**只**對 A 範圍重做精簡版 Phase 6–10。

---

## 6. 需要你回覆（擇一）

1. **批准 Milestone B** —— 繼續 Phase 5 實作  
2. **v6 本輪只交付 Milestone A** —— 合併 A 後，只對 A 重做 Phase 6–10  
3. **批准合併 Milestone A**（code 入 main）—— 可與 1 或 2 同時  

**未收到上述一句之前：唔開工 B–G，唔重開正式 Phase 6–10。**
