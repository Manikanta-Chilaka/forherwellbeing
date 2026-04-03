-- ═══════════════════════════════════════════════════════════════
--  FORHERWELLBEING — Healthcare CRM
--  Supabase PostgreSQL Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════


-- ── Enable UUID extension ────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ══════════════════════════════════════════════════════════════
--  ENUM TYPES
-- ══════════════════════════════════════════════════════════════

CREATE TYPE consultation_status_enum AS ENUM (
  'Pending',
  'Scheduled',
  'Completed',
  'Cancelled'
);

CREATE TYPE diet_status_enum AS ENUM (
  'Pending',
  'Ready',
  'Sent'
);

CREATE TYPE patient_status_enum AS ENUM (
  'Active',
  'Pending',
  'Inactive'
);

CREATE TYPE payment_status_enum AS ENUM (
  'Paid',
  'Pending',
  'Overdue'
);

CREATE TYPE diet_type_enum AS ENUM (
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Eggetarian'
);


-- ══════════════════════════════════════════════════════════════
--  TABLE: patients
-- ══════════════════════════════════════════════════════════════

CREATE TABLE patients (

  -- ── Identity ──────────────────────────────────────────────
  id              UUID              DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- ── Basic Info ────────────────────────────────────────────
  name            TEXT              NOT NULL,
  phone           TEXT              NOT NULL,
  age             SMALLINT          CHECK (age > 0 AND age <= 120),
  height          TEXT,                                        -- e.g. "163 cm"
  weight          TEXT,                                        -- e.g. "72 kg"
  city            TEXT,
  gender          TEXT              DEFAULT 'Female',

  -- ── Medical ───────────────────────────────────────────────
  condition       TEXT              NOT NULL,                  -- primary diagnosis
  medications     TEXT,
  allergies       TEXT,
  menstrual       TEXT,                                        -- menstrual health description

  -- ── Lifestyle ─────────────────────────────────────────────
  sleep           TEXT,                                        -- e.g. "6–7 hrs"
  stress          TEXT,                                        -- Low / Moderate / High / Severe
  activity        TEXT,                                        -- Sedentary / Lightly Active …
  work_type       TEXT,

  -- ── Food Habits ───────────────────────────────────────────
  diet_type       diet_type_enum    DEFAULT 'Vegetarian',
  food_dislikes   TEXT,
  meal_timing     TEXT,
  budget          TEXT,

  -- ── Consultation ──────────────────────────────────────────
  assigned_doctor       TEXT,
  consultation_date     DATE,
  consultation_time     TIME,
  consultation_status   consultation_status_enum  DEFAULT 'Pending',
  consult_notes         TEXT,

  -- ── Diet Plan ─────────────────────────────────────────────
  diet_plan       JSONB,            -- full structured plan from CreateDietPlan page
  diet_status     diet_status_enum  DEFAULT 'Pending',

  -- ── Payment ───────────────────────────────────────────────
  payment_status  payment_status_enum  DEFAULT 'Pending',
  payment_mode    TEXT,
  amount_paid     TEXT,
  payment_date    DATE,

  -- ── Patient Status ────────────────────────────────────────
  patient_status  patient_status_enum  DEFAULT 'Pending',

  -- ── Timestamps ────────────────────────────────────────────
  created_at      TIMESTAMPTZ       DEFAULT NOW(),
  updated_at      TIMESTAMPTZ       DEFAULT NOW()

);


-- ══════════════════════════════════════════════════════════════
--  TABLE: consult_history
--  Stores every consultation entry per patient
-- ══════════════════════════════════════════════════════════════

CREATE TABLE consult_history (

  id              UUID              DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id      UUID              NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  consult_date    DATE              NOT NULL,
  consult_type    TEXT,             -- Initial / Follow-up / Diet Review / Review
  doctor          TEXT,
  status          TEXT,             -- Scheduled / Completed / Cancelled / Upcoming
  note            TEXT,

  created_at      TIMESTAMPTZ       DEFAULT NOW()

);


-- ══════════════════════════════════════════════════════════════
--  TABLE: diet_plans
--  Standalone diet plans created from the Create Diet Plan page
-- ══════════════════════════════════════════════════════════════

CREATE TABLE diet_plans (

  id              UUID              DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id      UUID              NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  title           TEXT,
  duration_days   SMALLINT,         -- 7 / 14 / 30 / 60 / 90
  start_date      DATE,
  diet_type       diet_type_enum,
  calorie_target  INTEGER,

  meals           JSONB,            -- array of meal slot objects
  foods_to_avoid  TEXT,
  recommended     TEXT,
  lifestyle       TEXT,
  water_intake    TEXT,
  exercise        TEXT,
  doctor_notes    TEXT,

  status          diet_status_enum  DEFAULT 'Pending',

  created_by      TEXT,             -- doctor name (replace with auth user ID later)
  created_at      TIMESTAMPTZ       DEFAULT NOW(),
  updated_at      TIMESTAMPTZ       DEFAULT NOW()

);


-- ══════════════════════════════════════════════════════════════
--  AUTO-UPDATE updated_at trigger
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_diet_plans_updated_at
  BEFORE UPDATE ON diet_plans
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();


-- ══════════════════════════════════════════════════════════════
--  INDEXES  (for common query patterns)
-- ══════════════════════════════════════════════════════════════

CREATE INDEX idx_patients_condition          ON patients(condition);
CREATE INDEX idx_patients_assigned_doctor    ON patients(assigned_doctor);
CREATE INDEX idx_patients_consultation_date  ON patients(consultation_date);
CREATE INDEX idx_patients_patient_status     ON patients(patient_status);
CREATE INDEX idx_patients_diet_status        ON patients(diet_status);
CREATE INDEX idx_consult_history_patient_id  ON consult_history(patient_id);
CREATE INDEX idx_diet_plans_patient_id       ON diet_plans(patient_id);


-- ══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Enable after Supabase Auth is connected
-- ══════════════════════════════════════════════════════════════

ALTER TABLE patients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE consult_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans     ENABLE ROW LEVEL SECURITY;

-- Temporary open policy (replace with role-based policies after auth setup)
CREATE POLICY "allow_all_authenticated" ON patients
  FOR ALL USING (true);

CREATE POLICY "allow_all_authenticated" ON consult_history
  FOR ALL USING (true);

CREATE POLICY "allow_all_authenticated" ON diet_plans
  FOR ALL USING (true);


-- ══════════════════════════════════════════════════════════════
--  SAMPLE: diet_plan JSONB structure (for reference)
-- ══════════════════════════════════════════════════════════════

-- {
--   "goal": "Balance hormones, reduce insulin resistance",
--   "meals": [
--     { "slot": "earlyMorning", "items": "Warm lemon water + 5 almonds", "quantity": "1 glass", "calories": 60,  "notes": "Avoid sugar" },
--     { "slot": "breakfast",    "items": "Oats with chia seeds + berries", "quantity": "1 bowl", "calories": 320, "notes": "Low GI" },
--     { "slot": "lunch",        "items": "Brown rice + dal + sabzi + curd", "quantity": "1 plate", "calories": 500, "notes": "" }
--   ],
--   "avoid":       ["Refined sugar", "Processed foods"],
--   "supplements": ["Inositol", "Vitamin D3"],
--   "notes":       "Follow up in 2 weeks"
-- }
