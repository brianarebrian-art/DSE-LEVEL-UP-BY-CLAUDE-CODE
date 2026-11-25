-- DRAFT — DO NOT APPLY TO PRODUCTION without founder approval.
-- Per-item P-value accuracy metrics (HKEAA vs DSE Level Up).
-- Numbers only: no HKEAA stem text (charter D4).

CREATE TABLE IF NOT EXISTS public.item_pvalue_metrics (
  item_id text PRIMARY KEY,
  subject text NOT NULL,
  topic text,
  -- Official HKEAA item P (0..1); null if not publicly available
  hkeaa_ref_p double precision
    CHECK (hkeaa_ref_p IS NULL OR (hkeaa_ref_p >= 0 AND hkeaa_ref_p <= 1)),
  hkeaa_ref_source text
    CHECK (hkeaa_ref_source IS NULL OR char_length(hkeaa_ref_source) <= 200),
  -- Estimated HKEAA P when official unavailable; must be labelled 推定 in reports
  hkeaa_est_p double precision
    CHECK (hkeaa_est_p IS NULL OR (hkeaa_est_p >= 0 AND hkeaa_est_p <= 1)),
  hkeaa_est_note text
    CHECK (hkeaa_est_note IS NULL OR char_length(hkeaa_est_note) <= 500),
  -- Platform empirical P
  dlu_p double precision
    CHECK (dlu_p IS NULL OR (dlu_p >= 0 AND dlu_p <= 1)),
  sample_size integer NOT NULL DEFAULT 0
    CHECK (sample_size >= 0),
  -- Derived (prefer hkeaa_ref_p over hkeaa_est_p in app logic)
  delta_p double precision,
  ratio_p double precision
    CHECK (ratio_p IS NULL OR ratio_p >= 0),
  hkeaa_p_kind text NOT NULL DEFAULT 'none'
    CHECK (hkeaa_p_kind IN ('ref', 'est', 'none')),
  same_topic_type boolean NOT NULL DEFAULT false,
  anomaly_flag boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  notes text
);

CREATE INDEX IF NOT EXISTS item_pvalue_metrics_subject_idx
  ON public.item_pvalue_metrics (subject);
CREATE INDEX IF NOT EXISTS item_pvalue_metrics_anomaly_idx
  ON public.item_pvalue_metrics (anomaly_flag)
  WHERE anomaly_flag = true;
CREATE INDEX IF NOT EXISTS item_pvalue_metrics_sample_idx
  ON public.item_pvalue_metrics (sample_size);

COMMENT ON TABLE public.item_pvalue_metrics IS
  'DRAFT: P_HKEAA / P_DLU / delta_p / ratio_p per item. Observational only; cohort != territory-wide DSE. Apply only after approval + backup.';
COMMENT ON COLUMN public.item_pvalue_metrics.hkeaa_est_p IS
  '推定 P — reports must label as estimated; never present as official HKEAA.';
COMMENT ON COLUMN public.item_pvalue_metrics.delta_p IS
  'P_DLU - P_HKEAA in proportion units (percentage points when ×100).';
COMMENT ON COLUMN public.item_pvalue_metrics.ratio_p IS
  'P_DLU / P_HKEAA; business intent ~0.9 for +10% relative difficulty.';

ALTER TABLE public.item_pvalue_metrics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.item_pvalue_metrics FROM anon, authenticated;
-- service_role / server jobs only; no student read of calibration keys via this table until product decides
