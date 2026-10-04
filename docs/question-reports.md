# 題目問題報告：建立及處理

2026-10-04 起，學生在題目下按「呢條題有問題？話我哋知」→「送出」，報告會存入 Supabase 表 `question_reports`。
決定紀錄：`docs/audit-loop/FOUNDER-QUEUE.md` Q-A7-2（審計 #7，創辦人回覆「a」）。

只存四項：題號、問題類別、介面語言、收到時間。不存帳戶、IP、裝置，亦不存學生自己寫的描述（描述只經學生自己的電郵寄出）。

## 一、建立資料表（只做一次，在合併入 `main` 之前）

1. 登入 Supabase，打開專案 `DSE-LEVEL-UP`。
2. 左邊選 **SQL Editor** → **New query**。
3. 把 `supabase/migrations/0020_question_reports.sql` 的全部內容貼入，按 **Run**。
4. 見到 `Success. No rows returned` 即完成。

未建立資料表之前，「送出」會失敗，學生會看到「傳送唔到。請用下面嘅電郵寄出。」，報告不會無聲遺失。

## 二、每週查看

最多人報的題目（未處理）：

```sql
select question_id, count(*) as reports, array_agg(distinct category) as categories, max(created_at) as latest
from public.question_reports
where status = 'open'
group by question_id
order by reports desc, latest desc
limit 30;
```

本週新報告數：

```sql
select count(*) from public.question_reports where created_at > now() - interval '7 days';
```

## 三、處理完之後

已修正（把 `math_example_01` 換成實際題號）：

```sql
update public.question_reports set status = 'fixed' where question_id = 'math_example_01' and status = 'open';
```

查證後題目無誤：

```sql
update public.question_reports set status = 'rejected' where question_id = 'math_example_01' and status = 'open';
```

清理已處理超過 90 天的紀錄：

```sql
delete from public.question_reports where status <> 'open' and created_at < now() - interval '90 days';
```

題目要退回，照用 `scripts/qbank/withdraw.mts`（憲章 §12.1 約束 3）；退回會自動出現在 `/transparency` 的「最近退回紀錄」。
