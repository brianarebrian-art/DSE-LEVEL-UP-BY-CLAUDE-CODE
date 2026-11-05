# 架構

## 資料

```mermaid
flowchart LR
  subgraph repo [程式正本]
    Graph[lib/knowledge/graph.ts]
    Fsrs[lib/fsrs/scheduler.ts]
    Tutor[lib/tutor/socratic.ts]
  end
  subgraph draft [未套用]
    Sql[0035 DRAFT]
  end
  Page["/review/trace"] --> Graph
  Page --> Fsrs
  Page --> Tutor
  ApiSchedule["POST /api/review/schedule"] --> Fsrs
  ApiTutor["POST /api/tutor/socratic"] --> Tutor
  Sql -.-> Graph
```

學生看到的圖和排程以程式正本為準。草稿表要等批准才會成為雲端副本。

## 答錯微分

```mermaid
flowchart TD
  Wrong[選擇未對上] --> Dfs[先備深度 2]
  Dfs --> Algebra[代數]
  Dfs --> Calculus[微積分]
  Algebra --> Foundation[基礎]
  Calculus --> Compulsory[必修部分]
  Wrong --> Hint{第幾次}
  Hint -->|1| Simplify[簡化]
  Hint -->|2| Analogy[類比]
  Hint -->|3| Similar[相似題加另一例子的圖]
  Wrong --> Card[FSRS 評分 Again]
```

## 連線

```mermaid
flowchart LR
  Browser[瀏覽器] -->|HTTPS PostgREST| Api[Supabase API]
  Server[Vercel function] -->|HTTPS supabase-js| Api
  Script[db-slow-queries.mjs] -->|只允許 6543 pooler| Pooler[Transaction pooler]
  Script -->|5432| Refuse[拒絕]
```

## 重新驗證

`/review/trace` 跟全站一樣是動態頁（CSP nonce，不能 `revalidate`）。`POST /api/revalidate` 帶 `Authorization: Bearer <CRON_SECRET>`，路徑只可以是 `/review/trace`。題庫不走這條路。

## 介面參考

Mobbin 這次沒有可用結果，見 `docs/research/ui-references/README.md`。Canva Open Graph 在 `docs/research/canva/og-dse-level-up.png`。
