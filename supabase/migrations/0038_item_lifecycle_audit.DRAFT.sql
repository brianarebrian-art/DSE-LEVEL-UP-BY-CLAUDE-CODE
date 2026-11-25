-- DRAFT — DO NOT APPLY TO PRODUCTION without founder approval (plan gate #3).
-- Item lifecycle audit + optional calibration events (charter 2B C3).

-- Enum-like check via text + constraint (Postgres enum harder to evolve).
CREATE TABLE IF NOT EXISTS public.item_status_audit (
  id bigserial PRIMARY KEY,
  item_id text NOT NULL,
  old_status text NOT NULL,
  new_status text NOT NULL,
  actor text NOT NULL,
  evidence_id text,
  version integer NOT NULL DEFAULT 1,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_item_status_old CHECK (old_status IN (
    'DRAFT','PARAM_CHECKED','AI_BLIND_REVIEWED','ADVERSARIAL_PASSED',
    'HUMAN_SPOT_CHECKED','APPROVED','RELEASED','REJECTED','RETIRED',
    'LEGACY_UNCALIBRATED','CALIBRATION_INSUFFICIENT'
  )),
  CONSTRAINT ck_item_status_new CHECK (new_status IN (
    'DRAFT','PARAM_CHECKED','AI_BLIND_REVIEWED','ADVERSARIAL_PASSED',
    'HUMAN_SPOT_CHECKED','APPROVED','RELEASED','REJECTED','RETIRED',
    'LEGACY_UNCALIBRATED','CALIBRATION_INSUFFICIENT'
  ))
);

ALTER TABLE public.item_status_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.item_status_audit FROM anon, authenticated;
-- service_role only writes

CREATE TABLE IF NOT EXISTS public.calibration_events (
  id bigserial PRIMARY KEY,
  item_id text NOT NULL,
  session_anon_id text NOT NULL,
  subject text NOT NULL,
  topic text,
  is_correct boolean NOT NULL,
  latency_ms integer,
  difficulty_tag text,
  client_day date NOT NULL,
  practice_mode text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.calibration_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.calibration_events FROM anon, authenticated;
-- Inserts only via server API after consent calibration.v1

COMMENT ON TABLE public.item_status_audit IS 'DRAFT migration — apply only after charter 2B signed + backup drill';
COMMENT ON TABLE public.calibration_events IS 'Anonymous calibration events — no user_id/IP/PII';
