-- DRAFT. 未獲創辦人「批准發布」之前，不要對生產資料庫執行本檔。
-- 應用程式目前讀 lib/knowledge/graph.ts 與 lib/fsrs/scheduler.ts，不依賴這幾張表。
-- 學生列的政策使用 (SELECT auth.uid())，避免逐行呼叫 auth.uid()。

CREATE TABLE IF NOT EXISTS public.knowledge_nodes (
  id text PRIMARY KEY,
  subject text NOT NULL,
  topic text NOT NULL,
  edb_code text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.knowledge_edges (
  from_id text NOT NULL REFERENCES public.knowledge_nodes (id) ON DELETE CASCADE,
  to_id text NOT NULL REFERENCES public.knowledge_nodes (id) ON DELETE CASCADE,
  relation text NOT NULL CHECK (relation IN ('prerequisite', 'related')),
  PRIMARY KEY (from_id, to_id, relation)
);

CREATE TABLE IF NOT EXISTS public.fsrs_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  node_id text NOT NULL REFERENCES public.knowledge_nodes (id),
  stability double precision NOT NULL,
  difficulty double precision NOT NULL,
  retrievability double precision NOT NULL,
  w0 double precision NOT NULL,
  w1 double precision NOT NULL,
  w2 double precision NOT NULL,
  w3 double precision NOT NULL,
  w4 double precision NOT NULL,
  w5 double precision NOT NULL,
  w6 double precision NOT NULL,
  w7 double precision NOT NULL,
  w8 double precision NOT NULL,
  w9 double precision NOT NULL,
  w10 double precision NOT NULL,
  w11 double precision NOT NULL,
  w12 double precision NOT NULL,
  w13 double precision NOT NULL,
  w14 double precision NOT NULL,
  w15 double precision NOT NULL,
  w16 double precision NOT NULL,
  w17 double precision NOT NULL,
  w18 double precision NOT NULL,
  review_count integer NOT NULL DEFAULT 0,
  due_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, node_id)
);

CREATE TABLE IF NOT EXISTS public.fsrs_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  node_id text NOT NULL REFERENCES public.knowledge_nodes (id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 4),
  retrievability double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS fsrs_cards_due_idx ON public.fsrs_cards (user_id, due_at);
CREATE INDEX IF NOT EXISTS fsrs_reviews_user_idx ON public.fsrs_reviews (user_id, created_at);

ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsrs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsrs_reviews ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.knowledge_nodes FROM anon, authenticated;
REVOKE ALL ON TABLE public.knowledge_edges FROM anon, authenticated;
REVOKE ALL ON TABLE public.fsrs_cards FROM anon, authenticated;
REVOKE ALL ON TABLE public.fsrs_reviews FROM anon, authenticated;

GRANT SELECT ON TABLE public.knowledge_nodes TO authenticated;
GRANT SELECT ON TABLE public.knowledge_edges TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fsrs_cards TO authenticated;
GRANT SELECT, INSERT ON TABLE public.fsrs_reviews TO authenticated;

DROP POLICY IF EXISTS knowledge_nodes_read ON public.knowledge_nodes;
CREATE POLICY knowledge_nodes_read ON public.knowledge_nodes
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS knowledge_edges_read ON public.knowledge_edges;
CREATE POLICY knowledge_edges_read ON public.knowledge_edges
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS fsrs_cards_select_own ON public.fsrs_cards;
CREATE POLICY fsrs_cards_select_own ON public.fsrs_cards
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS fsrs_cards_insert_own ON public.fsrs_cards;
CREATE POLICY fsrs_cards_insert_own ON public.fsrs_cards
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS fsrs_cards_update_own ON public.fsrs_cards;
CREATE POLICY fsrs_cards_update_own ON public.fsrs_cards
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS fsrs_cards_delete_own ON public.fsrs_cards;
CREATE POLICY fsrs_cards_delete_own ON public.fsrs_cards
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS fsrs_reviews_select_own ON public.fsrs_reviews;
CREATE POLICY fsrs_reviews_select_own ON public.fsrs_reviews
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS fsrs_reviews_insert_own ON public.fsrs_reviews;
CREATE POLICY fsrs_reviews_insert_own ON public.fsrs_reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
