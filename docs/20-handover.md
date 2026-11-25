# docs/20-handover.md

## 下一步（人類）

1. 簽署 `docs/charter-amendments/2026-11-26-2B-DRAFT.md`  
2. 批 LLM 預算並注入 `FOUNDER_AI_*`  
3. 簽署 pilot spotCheckPack 50 題  
4. 批准後才可 `PRACTICE_SERVER_GRADE=1` 灰度  
5. 批准後才 apply `0038_*.DRAFT.sql`（先 backup drill）

## 工程下一步

1. LLM 改寫試點 500 題幹（正確-by-construction 數理）  
2. 獨立模型盲審補上 AI_BLIND_REVIEWED  
3. 均勻性檢定 1000 卷  
4. 縮窄 anon SELECT（另批）  
5. 滾動下一批高頻題

## 檔案地圖

- Ledgers: `data/questions/lifecycle/`  
- Pipeline: `scripts/qbank/pipeline/`  
- APIs: `app/api/practice/{session,grade}/`
