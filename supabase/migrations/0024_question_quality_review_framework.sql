-- 0024: DSE Level Up 題目質素評分及課綱對照框架
-- 目的：把 AI 初審、科目人工覆核、實測校準分開記錄，不能以自動檢查冒充教師審定。

CREATE TABLE IF NOT EXISTS dse_curriculum_frameworks (
  subject_slug TEXT PRIMARY KEY,
  subject_name_zh TEXT NOT NULL,
  hkeaa_subject_info_url TEXT NOT NULL,
  assessment_framework_url TEXT,
  curriculum_guide_url TEXT,
  framework_year INTEGER NOT NULL DEFAULT 2027,
  source_checked_at TIMESTAMPTZ,
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'partially_verified', 'verified', 'needs_update')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE dse_curriculum_frameworks IS '各科 HKEAA 課程及評估指引／評核大綱對照框架；資料未核實前不得宣稱已接軌。';

CREATE TABLE IF NOT EXISTS dse_quality_prompt_versions (
  prompt_key TEXT NOT NULL,
  version TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  rubric_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (prompt_key, version)
);

COMMENT ON TABLE dse_quality_prompt_versions IS '供 AI、教師及義工使用的逐題審核 Prompt；每次規則修改須新增版本。';

CREATE TABLE IF NOT EXISTS dse_question_quality_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  rubric_version TEXT NOT NULL DEFAULT 'v1.0',
  subject_slug TEXT NOT NULL,
  paper TEXT,
  topic_code TEXT,
  topic_label TEXT,
  question_type TEXT NOT NULL,
  difficulty_label TEXT,
  marks NUMERIC,
  suggested_time_seconds INTEGER,
  curriculum_code TEXT,
  assessment_objective TEXT,
  cognitive_level TEXT,
  command_word_fit TEXT CHECK (command_word_fit IN ('pass', 'borderline', 'fail', 'not_applicable')),
  question_type_fit TEXT CHECK (question_type_fit IN ('pass', 'borderline', 'fail', 'not_applicable')),
  syllabus_alignment TEXT CHECK (syllabus_alignment IN ('pass', 'borderline', 'fail', 'unverified')),
  factual_accuracy TEXT CHECK (factual_accuracy IN ('pass', 'borderline', 'fail', 'unverified')),
  answer_key_accuracy TEXT CHECK (answer_key_accuracy IN ('pass', 'borderline', 'fail', 'unverified')),
  marking_scheme_quality TEXT CHECK (marking_scheme_quality IN ('pass', 'borderline', 'fail', 'not_applicable', 'unverified')),
  language_format_quality TEXT CHECK (language_format_quality IN ('pass', 'borderline', 'fail', 'unverified')),
  difficulty_alignment TEXT CHECK (difficulty_alignment IN ('pass', 'borderline', 'fail', 'unverified')),
  copyright_risk TEXT CHECK (copyright_risk IN ('clear', 'needs_review', 'high_risk', 'unverified')),
  empirical_calibration TEXT CHECK (empirical_calibration IN ('in_range', 'out_of_range', 'insufficient_sample', 'not_started')),
  score_syllabus NUMERIC CHECK (score_syllabus IS NULL OR score_syllabus BETWEEN 0 AND 5),
  score_assessment NUMERIC CHECK (score_assessment IS NULL OR score_assessment BETWEEN 0 AND 5),
  score_answer NUMERIC CHECK (score_answer IS NULL OR score_answer BETWEEN 0 AND 5),
  score_language NUMERIC CHECK (score_language IS NULL OR score_language BETWEEN 0 AND 5),
  score_difficulty NUMERIC CHECK (score_difficulty IS NULL OR score_difficulty BETWEEN 0 AND 5),
  score_evidence NUMERIC CHECK (score_evidence IS NULL OR score_evidence BETWEEN 0 AND 5),
  total_score NUMERIC GENERATED ALWAYS AS (
    COALESCE(score_syllabus, 0) + COALESCE(score_assessment, 0) + COALESCE(score_answer, 0) +
    COALESCE(score_language, 0) + COALESCE(score_difficulty, 0) + COALESCE(score_evidence, 0)
  ) STORED,
  review_stage TEXT NOT NULL DEFAULT 'queued'
    CHECK (review_stage IN ('queued', 'ai_precheck', 'human_review', 'second_review', 'pilot_calibration', 'approved', 'revision_required', 'withdrawn')),
  decision TEXT NOT NULL DEFAULT 'pending'
    CHECK (decision IN ('pending', 'approve', 'approve_with_revision', 'reject', 'withdraw')),
  ai_findings JSONB NOT NULL DEFAULT '{}'::jsonb,
  human_findings JSONB NOT NULL DEFAULT '{}'::jsonb,
  calibration_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  evidence_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviewer_role TEXT CHECK (reviewer_role IN ('ai', 'subject_editor', 'teacher', 'volunteer', 'second_reviewer', 'admin')),
  reviewer_name TEXT,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_id, rubric_version)
);

COMMENT ON TABLE dse_question_quality_reviews IS 'DSE_Level_Up_題目質素評分表：逐題記錄課綱、題型、答案、語言、難度、證據及人工覆核狀態。';
COMMENT ON COLUMN dse_question_quality_reviews.total_score IS '六項各 0–5 分，總分最高 30；總分不代表已通過，仍須符合硬性閘門及人工覆核。';

CREATE INDEX IF NOT EXISTS idx_dse_quality_reviews_queue
  ON dse_question_quality_reviews (review_stage, subject_slug, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_dse_quality_reviews_question
  ON dse_question_quality_reviews (question_id, rubric_version);
CREATE INDEX IF NOT EXISTS idx_dse_quality_reviews_subject
  ON dse_question_quality_reviews (subject_slug, decision, total_score DESC);

ALTER TABLE dse_curriculum_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dse_quality_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dse_question_quality_reviews ENABLE ROW LEVEL SECURITY;

INSERT INTO dse_curriculum_frameworks (subject_slug, subject_name_zh, hkeaa_subject_info_url, framework_year, notes)
VALUES
 ('bafs', '企業、會計與財務概論', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('biology', '生物', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('chemistry', '化學', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('chinese', '中國語文', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('chinese-history', '中國歷史', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('chinese-literature', '中國文學', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('csd', '公民與社會發展', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('design-tech', '設計與應用科技', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('economics', '經濟', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('english', '英國語文', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('english-literature', '英語文學', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('ethics-religious', '倫理與宗教', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('geography', '地理', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('health-management', '健康管理與社會關懷', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('history', '歷史', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('ict', '資訊及通訊科技', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('m1', '數學延伸部分單元一', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('m2', '數學延伸部分單元二', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('math', '數學', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('music', '音樂', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('pe', '體育', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('physics', '物理', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('technology-living', '科技與生活', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('ths', '旅遊與款待', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。'),
 ('visual-arts', '視覺藝術', 'https://www.hkeaa.edu.hk/tc/hkdse/assessment/subject_information/', 2027, '待補入現行科目評核大綱及課程指引直接 PDF。')
ON CONFLICT (subject_slug) DO UPDATE SET subject_name_zh = EXCLUDED.subject_name_zh, updated_at = now();

INSERT INTO dse_quality_prompt_versions (prompt_key, version, prompt_text, rubric_json, active, created_by)
VALUES ('question_quality_review', 'v1.0', 'See repository file docs/DSE_Level_Up_逐題審核_Prompt_v1.md', '{"hard_gates":["syllabus_alignment","answer_key_accuracy","copyright_risk","human_review_required"],"score_max":30,"pass_threshold":24}', true, 'Manus AI')
ON CONFLICT (prompt_key, version) DO UPDATE SET prompt_text = EXCLUDED.prompt_text, rubric_json = EXCLUDED.rubric_json, active = EXCLUDED.active;

INSERT INTO dse_question_quality_reviews (question_id, subject_slug, topic_code, topic_label, question_type, difficulty_label, marks, review_stage, decision, ai_findings)
SELECT
  q.id,
  q.subject,
  NULLIF(q.data->>'topicId', ''),
  NULLIF(q.topic, ''),
  q.type,
  q.difficulty,
  NULLIF(q.data->>'marks', '')::numeric,
  'queued',
  'pending',
  jsonb_build_object(
    'source', 'initial_queue_seed',
    'existing_framework', q.data->>'framework',
    'has_explanation', (q.data ? 'explanation'),
    'has_reference_answer', (q.data ? 'referenceAnswer'),
    'has_marking_scheme', (q.data ? 'markingScheme'),
    'machine_checks_only', true,
    'human_review_required', true
  )
FROM questions q
ON CONFLICT (question_id, rubric_version) DO NOTHING;

GRANT SELECT ON dse_curriculum_frameworks TO anon, authenticated;
GRANT SELECT ON dse_quality_prompt_versions TO anon, authenticated;
-- 評分表刻意不授予 anon/authenticated；寫入由 server-only admin route/service role 處理。
