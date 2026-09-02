-- 0012 —— 考試日推送訂閱表。
--
-- ⚠️ 未套用。由創辦人喺 Supabase SQL Editor 自己行（生產資料庫）。
--
-- ══════════════════════════════════════════════════════════════════
-- 呢張表【冇】乜嘢，同佢有乜嘢一樣重要
-- ══════════════════════════════════════════════════════════════════
--
-- 冇 user_id。冇考試日期。冇試場。冇科目。冇座標。
--
-- 憲章 §16.E 已就「user_id ＋ 課題 ＋ 正確率」落閘，而個原則唔止
-- 於嗰三個欄位 —— 佢講嘅係「一個新嘅個人資料類別上雲，要創辦人
-- 書面批准」。「呢位學生 2027-04-22 早上八點半喺 XX 中學考試」
-- 係一個比正確率敏感得多嘅類別：佢講得出一個未成年人喺某年某月
-- 某日某時會實際出現喺邊。
--
-- 所以推送設計成【伺服器唔需要知】就做得到：
--   · 伺服器每朝 send一個【冇內容】嘅推送，叫部機醒返（lib/push/vapid.ts）
--   · 「今日係咪你考試？」呢個判斷喺【學生部機上面】做，由 service
--     worker 讀部機自己嘅 IndexedDB（public/sw.js）
--   · 唔關事就靜靜哋唔出通知，伺服器永遠唔知發生過乜
--
-- 換句話講：想由呢張表反推「邊個幾時喺邊考試」，答案係反推唔到，
-- 因為資料根本冇離開過部機。
--
-- 唯一存低嘅係推送端點本身 —— 佢係一個假名裝置識別碼，冇佢就
-- send唔到推送。呢個係功能嘅下限，唔係方便。

create table if not exists public.push_subscriptions (
  -- 推送端點 URL。瀏覽器發嘅，每部機／每個瀏覽器一條，本身就唯一。
  endpoint      text primary key,

  -- 呢兩條係 Web Push 加密用嘅公開參數。我哋send【冇 payload】嘅推送，
  -- 所以而家其實用唔著 —— 存低係為咗第日真係要send內容嗰陣唔使叫
  -- 全部學生重新訂閱一次。
  -- ⚠️ 如果第日真係用返佢哋send payload，嗰個改動本身要重新過一次
  -- 私隱審視：有 payload 就有機會把考試資料放咗入去。
  p256dh        text not null,
  auth          text not null,

  -- 冇「幾點收」呢一欄。原本諗住有，但諗真啲就發現連佢都唔使上雲：
  -- cron 每日兩個時段（22:00 準備、06:30 出門）都係send俾全部訂閱，
  -- 「今次呢個時段我想唔想收」由 service worker 讀部機自己嘅設定決定。
  -- 一個唔使離開部機嘅偏好，就唔應該離開部機。

  created_at    timestamptz not null default now(),
  -- 最後一次send成功。連續失敗夠多次就清走（見 fail_count）。
  last_ok_at    timestamptz,
  fail_count    smallint not null default 0
);

-- RLS：呢張表【淨係】經 service-role key 喺伺服器讀寫
-- （utils/supabase/server.ts）。開住 RLS 而唔寫任何 policy，
-- 即係任何 anon／authenticated 嘅 client 一行都讀唔到 ——
-- 就算 anon key 洩漏咗，都攞唔到成張訂閱名單。
alter table public.push_subscriptions enable row level security;

comment on table public.push_subscriptions is
  '考試日推送訂閱。刻意冇 user_id／考試日期／試場 —— 「今日係咪你考試」喺學生部機上面判斷，見 public/sw.js。';
