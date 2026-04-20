-- ============================================================
-- DIET ENGINE — Complete Database Schema
-- Platform: AI-Powered Women's Health Diet System
-- Database: PostgreSQL (Supabase)
-- ============================================================

-- ============================================================
-- SECTION 1: EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search on food names


-- ============================================================
-- SECTION 2: DROP TABLES (safe re-run)
-- ============================================================

DROP TABLE IF EXISTS diet_plans          CASCADE;
DROP TABLE IF EXISTS marker_condition_map CASCADE;
DROP TABLE IF EXISTS condition_rules     CASCADE;
DROP TABLE IF EXISTS diet_templates      CASCADE;
DROP TABLE IF EXISTS foods               CASCADE;
DROP TABLE IF EXISTS lab_reports         CASCADE;
DROP TABLE IF EXISTS patients            CASCADE;


-- ============================================================
-- SECTION 3: CREATE TABLES
-- ============================================================

-- ─────────────────────────────────────────
-- 3.1 PATIENTS
-- ─────────────────────────────────────────
CREATE TABLE patients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  age          INTEGER     CHECK (age BETWEEN 10 AND 120),
  weight       DECIMAL(5,2),
  height       DECIMAL(5,2),
  bmi          DECIMAL(4,2) GENERATED ALWAYS AS (
                 CASE WHEN height IS NOT NULL AND height > 0
                   THEN ROUND(CAST(weight / ((height / 100.0) * (height / 100.0)) AS DECIMAL), 2)
                   ELSE NULL END
               ) STORED,
  diet_type    TEXT        NOT NULL DEFAULT 'vegetarian'
                             CHECK (diet_type IN ('vegetarian','non_vegetarian','vegan','eggetarian')),
  allergies    TEXT[]      DEFAULT '{}',
  conditions   TEXT[]      DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3.2 LAB REPORTS
-- ─────────────────────────────────────────
-- markers JSONB format:
-- { "hemoglobin": "LOW", "tsh": "HIGH", "vitamin_b12": "LOW", "vitamin_d": "LOW" }
-- Allowed status values: "HIGH" | "LOW" | "BORDERLINE" | "OPTIMAL"
CREATE TABLE lab_reports (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID        NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  markers      JSONB       NOT NULL DEFAULT '{}',
  report_date  DATE        DEFAULT CURRENT_DATE,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3.3 FOODS
-- ─────────────────────────────────────────
CREATE TABLE foods (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT    NOT NULL UNIQUE,
  is_veg         BOOLEAN NOT NULL DEFAULT TRUE,
  nutrients      TEXT[]  DEFAULT '{}',
  types          TEXT[]  DEFAULT '{}',   -- e.g. high_protein, iron_rich, low_gi
  beneficial_for TEXT[]  DEFAULT '{}',   -- condition names this food helps
  avoid_for      TEXT[]  DEFAULT '{}',   -- condition names to avoid this food
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3.4 DIET TEMPLATES
-- ─────────────────────────────────────────
-- template_data JSONB structure (matches frontend dietTemplates.js schema):
-- {
--   "goals": [],
--   "nutrition_strategy": { "diet_type": "", "fasting_protocol": "", "focus_types": [] },
--   "food_rules":          { "recommended_types": [], "avoid_types": [] },
--   "meal_structure":      { "pattern": "", "meals": [{ "slot": "", "types": [] }] },
--   "rules":               {},
--   "ai_notes":            ""
-- }
CREATE TABLE diet_templates (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT    NOT NULL,
  condition     TEXT    NOT NULL UNIQUE,
  tags          TEXT[]  DEFAULT '{}',
  template_data JSONB   NOT NULL DEFAULT '{}',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3.5 CONDITION RULES  (decision engine core)
-- ─────────────────────────────────────────
-- markers: which lab markers are associated with this condition
-- focus_types / avoid_types: food type directives
-- priority: higher = evaluated first when multiple conditions conflict
CREATE TABLE condition_rules (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  condition    TEXT    NOT NULL UNIQUE,
  markers      TEXT[]  DEFAULT '{}',
  focus_types  TEXT[]  DEFAULT '{}',
  avoid_types  TEXT[]  DEFAULT '{}',
  priority     INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 10),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3.6 MARKER ↔ CONDITION MAP  (decision engine routing table)
-- ─────────────────────────────────────────
-- Maps a specific marker+status combination to a condition with confidence score
-- is_diagnostic = true means this marker alone confirms the condition
CREATE TABLE marker_condition_map (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  marker_name    TEXT    NOT NULL,
  marker_status  TEXT    NOT NULL CHECK (marker_status IN ('HIGH','LOW','BORDERLINE','OPTIMAL')),
  condition      TEXT    NOT NULL,
  confidence     INTEGER DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
  is_diagnostic  BOOLEAN DEFAULT FALSE,
  UNIQUE (marker_name, marker_status, condition)
);


-- ─────────────────────────────────────────
-- 3.7 DIET PLANS  (generated & stored plans)
-- ─────────────────────────────────────────
CREATE TABLE diet_plans (
  id                   UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id           UUID    NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  lab_report_id        UUID    REFERENCES lab_reports(id) ON DELETE SET NULL,
  template_id          UUID    REFERENCES diet_templates(id) ON DELETE SET NULL,
  conditions_addressed TEXT[]  DEFAULT '{}',
  plan_data            JSONB   NOT NULL DEFAULT '{}',
  status               TEXT    DEFAULT 'draft'
                                CHECK (status IN ('draft','active','sent','archived')),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- SECTION 4: INDEXES
-- ============================================================

CREATE INDEX idx_lab_reports_patient      ON lab_reports (patient_id);
CREATE INDEX idx_lab_reports_markers      ON lab_reports USING GIN (markers);
CREATE INDEX idx_foods_types              ON foods       USING GIN (types);
CREATE INDEX idx_foods_beneficial         ON foods       USING GIN (beneficial_for);
CREATE INDEX idx_foods_avoid              ON foods       USING GIN (avoid_for);
CREATE INDEX idx_foods_name_trgm          ON foods       USING GIN (name gin_trgm_ops);
CREATE INDEX idx_diet_templates_condition ON diet_templates (condition);
CREATE INDEX idx_condition_rules_cond     ON condition_rules (condition);
CREATE INDEX idx_mcm_marker               ON marker_condition_map (marker_name, marker_status);
CREATE INDEX idx_diet_plans_patient       ON diet_plans (patient_id);
CREATE INDEX idx_patients_conditions      ON patients USING GIN (conditions);
CREATE INDEX idx_patients_allergies       ON patients USING GIN (allergies);


-- ============================================================
-- SECTION 5: HELPER FUNCTIONS
-- ============================================================

-- Automatically update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_diet_plans_updated_at
  BEFORE UPDATE ON diet_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────
-- Decision Engine: Detect conditions from lab markers
-- Input:  lab_report_id (UUID)
-- Output: table of detected conditions with confidence
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION detect_conditions_from_lab(p_lab_report_id UUID)
RETURNS TABLE (
  condition   TEXT,
  confidence  INTEGER,
  is_diagnostic BOOLEAN,
  marker_count  BIGINT
) LANGUAGE sql STABLE AS $$
  SELECT
    mcm.condition,
    MAX(mcm.confidence)    AS confidence,
    BOOL_OR(mcm.is_diagnostic) AS is_diagnostic,
    COUNT(*)               AS marker_count
  FROM lab_reports lr
  CROSS JOIN LATERAL jsonb_each_text(lr.markers) AS m(marker_name, marker_status)
  JOIN marker_condition_map mcm
    ON mcm.marker_name   = m.marker_name
   AND mcm.marker_status = m.marker_status
  WHERE lr.id = p_lab_report_id
  GROUP BY mcm.condition
  ORDER BY confidence DESC, marker_count DESC;
$$;


-- ─────────────────────────────────────────
-- Decision Engine: Get recommended foods for a patient
-- Filters by: detected conditions, diet_type, allergies
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_recommended_foods(
  p_patient_id  UUID,
  p_conditions  TEXT[],
  p_limit       INTEGER DEFAULT 50
)
RETURNS TABLE (
  id             UUID,
  name           TEXT,
  is_veg         BOOLEAN,
  types          TEXT[],
  nutrients      TEXT[],
  beneficial_for TEXT[]
) LANGUAGE sql STABLE AS $$
  SELECT
    f.id, f.name, f.is_veg, f.types, f.nutrients, f.beneficial_for
  FROM foods f
  JOIN patients p ON p.id = p_patient_id
  WHERE
    -- Matches at least one recommended condition
    (f.beneficial_for && p_conditions OR p_conditions = '{}')
    -- Exclude foods the patient should avoid based on conditions
    AND NOT (f.avoid_for && p_conditions)
    -- Respect diet type
    AND (p.diet_type IN ('vegan','vegetarian') AND f.is_veg = TRUE
         OR p.diet_type IN ('non_vegetarian','eggetarian'))
    -- Exclude allergenic foods (simple name match)
    AND NOT EXISTS (
      SELECT 1 FROM unnest(p.allergies) a
      WHERE LOWER(f.name) LIKE '%' || LOWER(a) || '%'
    )
  ORDER BY
    array_length(array(
      SELECT x FROM unnest(f.beneficial_for) x
      WHERE x = ANY(p_conditions)
    ), 1) DESC NULLS LAST
  LIMIT p_limit;
$$;


-- ─────────────────────────────────────────
-- Decision Engine: Get foods by type tags
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_foods_by_types(
  p_include_types TEXT[],
  p_exclude_types TEXT[],
  p_is_veg        BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  id        UUID,
  name      TEXT,
  is_veg    BOOLEAN,
  types     TEXT[],
  nutrients TEXT[]
) LANGUAGE sql STABLE AS $$
  SELECT f.id, f.name, f.is_veg, f.types, f.nutrients
  FROM foods f
  WHERE
    (p_include_types IS NULL OR f.types && p_include_types)
    AND (p_exclude_types IS NULL OR NOT (f.types && p_exclude_types))
    AND (p_is_veg IS NULL OR f.is_veg = p_is_veg)
  ORDER BY f.name;
$$;


-- ============================================================
-- SECTION 6: INSERT — FOODS (60 entries, Indian context)
-- ============================================================

INSERT INTO foods (name, is_veg, nutrients, types, beneficial_for, avoid_for) VALUES

-- ── GRAINS & MILLETS ──────────────────────────────────────────

('Ragi (Finger Millet)',   TRUE,
 ARRAY['calcium','iron','fibre','protein','magnesium','phosphorus'],
 ARRAY['calcium_rich','iron_rich','fiber_rich','low_gi','anti_inflammatory','complex_carbs'],
 ARRAY['PCOS','Anemia','Diabetes_Type2','PreDiabetes','Menopause','Osteoporosis','Obesity','Hair_Loss'],
 ARRAY[]::TEXT[]),

('Jowar (Sorghum)',        TRUE,
 ARRAY['iron','fibre','protein','magnesium','antioxidants','phosphorus'],
 ARRAY['fiber_rich','iron_rich','low_gi','gluten_free','high_protein','complex_carbs'],
 ARRAY['PCOS','Diabetes_Type2','Obesity','Anemia','Cholesterol_High'],
 ARRAY[]::TEXT[]),

('Bajra (Pearl Millet)',   TRUE,
 ARRAY['iron','magnesium','zinc','protein','fibre','phosphorus'],
 ARRAY['iron_rich','magnesium_rich','zinc_rich','fiber_rich','low_gi','complex_carbs'],
 ARRAY['PCOS','Anemia','Thyroid_Hypo','Diabetes_Type2','Irregular_Periods'],
 ARRAY['Thyroid_Hypo']),   -- goitrogenic in excess

('Brown Rice',             TRUE,
 ARRAY['fibre','magnesium','selenium','b_vitamins','manganese'],
 ARRAY['fiber_rich','low_gi','selenium_rich','complex_carbs','gut_friendly'],
 ARRAY['Diabetes_Type2','PCOS','Obesity','Constipation'],
 ARRAY[]::TEXT[]),

('Oats',                   TRUE,
 ARRAY['beta_glucan','fibre','protein','iron','magnesium','zinc','b_vitamins'],
 ARRAY['fiber_rich','low_gi','iron_rich','gut_friendly','cholesterol_lowering','soluble_fiber','tryptophan_rich'],
 ARRAY['Cholesterol_High','Diabetes_Type2','PCOS','IBS','Constipation','Obesity','Depression','Anxiety'],
 ARRAY[]::TEXT[]),

('Quinoa',                 TRUE,
 ARRAY['complete_protein','iron','magnesium','zinc','fibre','folate'],
 ARRAY['high_protein','iron_rich','magnesium_rich','low_gi','folate_rich','fiber_rich','complex_carbs'],
 ARRAY['PCOS','Anemia','Infertility','Diabetes_Type2','PreDiabetes','Obesity'],
 ARRAY[]::TEXT[]),

('Barley (Jau)',           TRUE,
 ARRAY['beta_glucan','fibre','iron','selenium','magnesium','b_vitamins'],
 ARRAY['fiber_rich','low_gi','iron_rich','cholesterol_lowering','blood_sugar_stabilising','gut_friendly'],
 ARRAY['Cholesterol_High','Diabetes_Type2','Fatty_Liver','Constipation','PCOS'],
 ARRAY[]::TEXT[]),

('Whole Wheat Roti',       TRUE,
 ARRAY['fibre','protein','iron','b_vitamins','selenium','manganese'],
 ARRAY['fiber_rich','complex_carbs','iron_rich','gut_friendly'],
 ARRAY['Diabetes_Type2','Constipation','Obesity','Anemia'],
 ARRAY['Autoimmune_Disorders']),  -- gluten (Hashimoto's / AIP)

-- ── LEGUMES & PULSES ─────────────────────────────────────────

('Moong Dal (Split Green Gram)', TRUE,
 ARRAY['protein','folate','iron','magnesium','zinc','fibre'],
 ARRAY['high_protein','folate_rich','iron_rich','gut_friendly','light_meal','low_gi'],
 ARRAY['Gastritis','IBS','Acidity','Postpartum','Infertility','Anemia','Prenatal_Care'],
 ARRAY[]::TEXT[]),

('Masoor Dal (Red Lentils)', TRUE,
 ARRAY['protein','iron','folate','fibre','potassium','zinc'],
 ARRAY['high_protein','iron_rich','folate_rich','fiber_rich','low_gi','potassium_rich'],
 ARRAY['Anemia','Infertility','PCOS','Diabetes_Type2','Prenatal_Care','Hair_Loss'],
 ARRAY[]::TEXT[]),

('Chana Dal (Split Chickpeas)', TRUE,
 ARRAY['protein','fibre','iron','folate','zinc','manganese'],
 ARRAY['high_protein','fiber_rich','iron_rich','low_gi','folate_rich','plant_sterol'],
 ARRAY['Diabetes_Type2','Cholesterol_High','PCOS','Obesity','Constipation'],
 ARRAY['IBS']),

('Rajma (Kidney Beans)',   TRUE,
 ARRAY['protein','iron','folate','potassium','fibre','magnesium'],
 ARRAY['high_protein','iron_rich','folate_rich','fiber_rich','potassium_rich','low_gi'],
 ARRAY['Anemia','Hypertension','Diabetes_Type2','Cholesterol_High','Infertility'],
 ARRAY['IBS','Gastritis']),

('Kabuli Chana (Chickpeas)', TRUE,
 ARRAY['protein','fibre','iron','folate','zinc','manganese','phosphorus'],
 ARRAY['high_protein','fiber_rich','iron_rich','low_gi','folate_rich','plant_sterol'],
 ARRAY['Diabetes_Type2','Cholesterol_High','PCOS','Obesity','Constipation','Anemia'],
 ARRAY['IBS']),

('Soy Chunks (Nutrela)',   TRUE,
 ARRAY['complete_protein','isoflavones','calcium','iron','fibre','omega_3'],
 ARRAY['high_protein','calcium_rich','iron_rich','phytoestrogen','omega3_rich'],
 ARRAY['Menopause','Cholesterol_High','Infertility','Osteoporosis','Endometriosis'],
 ARRAY['Thyroid_Hypo']),   -- near medication time

('Tofu',                   TRUE,
 ARRAY['complete_protein','calcium','iron','isoflavones','selenium'],
 ARRAY['high_protein','calcium_rich','iron_rich','phytoestrogen','selenium_rich','anti_inflammatory'],
 ARRAY['Menopause','Endometriosis','PCOS','Cholesterol_High','Infertility'],
 ARRAY['Thyroid_Hypo']),

-- ── DAIRY & FERMENTED ────────────────────────────────────────

('Paneer',                 TRUE,
 ARRAY['protein','calcium','phosphorus','vitamin_b12','zinc','healthy_fat'],
 ARRAY['high_protein','calcium_rich','b12_rich','zinc_rich','calorie_dense'],
 ARRAY['Vitamin_B12_Deficiency','Menopause','Postpartum','Hair_Loss','Prenatal_Care'],
 ARRAY['Obesity','Cholesterol_High']),

('Curd (Dahi)',            TRUE,
 ARRAY['protein','calcium','probiotics','vitamin_b12','phosphorus','riboflavin'],
 ARRAY['probiotic','calcium_rich','b12_rich','gut_friendly','high_protein','calming'],
 ARRAY['IBS','Gastritis','Vitamin_B12_Deficiency','PCOS','Depression','Anxiety','Autoimmune_Disorders'],
 ARRAY['Skin_Issues_Acne']),  -- excess dairy

('Buttermilk (Chaas)',     TRUE,
 ARRAY['probiotics','calcium','potassium','vitamin_b12','low_fat'],
 ARRAY['probiotic','gut_friendly','calming','light_meal','potassium_rich','low_calorie'],
 ARRAY['Gastritis','Acidity','IBS','Hypertension','Postpartum','Constipation'],
 ARRAY[]::TEXT[]),

('Makhana (Fox Nuts)',     TRUE,
 ARRAY['calcium','magnesium','iron','protein','fibre','phosphorus','antioxidants'],
 ARRAY['calcium_rich','magnesium_rich','iron_rich','low_gi','anti_inflammatory','light_meal','low_calorie'],
 ARRAY['PCOS','Obesity','Diabetes_Type2','Hypertension','Menopause','Anxiety'],
 ARRAY[]::TEXT[]),

-- ── LEAFY GREENS & VEGETABLES ────────────────────────────────

('Spinach (Palak)',        TRUE,
 ARRAY['iron','folate','vitamin_c','vitamin_k','magnesium','calcium','vitamin_a'],
 ARRAY['iron_rich','folate_rich','magnesium_rich','anti_inflammatory','vitamin_c_rich','calcium_rich'],
 ARRAY['Anemia','Infertility','Prenatal_Care','Hair_Loss','PCOS','Depression'],
 ARRAY['Thyroid_Hypo']),  -- raw in excess (oxalates + goitrogenic)

('Fenugreek Leaves (Methi)', TRUE,
 ARRAY['iron','calcium','folate','fibre','protein','vitamin_c','vitamin_k'],
 ARRAY['iron_rich','folate_rich','fiber_rich','galactagogue','blood_sugar_stabilising','anti_inflammatory'],
 ARRAY['Diabetes_Type2','Anemia','PCOS','Postpartum','Irregular_Periods','Cholesterol_High','PreDiabetes'],
 ARRAY['Prenatal_Care']),  -- uterotonic in large amounts

('Moringa Leaves (Sahjan)', TRUE,
 ARRAY['iron','calcium','vitamin_c','folate','protein','vitamin_a','zinc','magnesium'],
 ARRAY['iron_rich','calcium_rich','folate_rich','vitamin_c_rich','anti_inflammatory','detox','high_protein'],
 ARRAY['Anemia','Prenatal_Care','Postpartum','Hair_Loss','Vitamin_D_Deficiency','Infertility'],
 ARRAY[]::TEXT[]),

('Broccoli',               TRUE,
 ARRAY['vitamin_c','vitamin_k','fibre','folate','calcium','sulforaphane','dim'],
 ARRAY['anti_inflammatory','vitamin_c_rich','folate_rich','fiber_rich','cruciferous','dim_source'],
 ARRAY['Endometriosis','Fibroids','Autoimmune_Disorders','Thyroid_Hyper','PCOS','Cholesterol_High'],
 ARRAY['Thyroid_Hypo','IBS']),

('Cauliflower',            TRUE,
 ARRAY['vitamin_c','fibre','folate','vitamin_k','sulforaphane','choline'],
 ARRAY['fiber_rich','vitamin_c_rich','cruciferous','dim_source','detox','choline_rich','low_calorie'],
 ARRAY['Endometriosis','Fibroids','Thyroid_Hyper','Fatty_Liver','Obesity'],
 ARRAY['Thyroid_Hypo','IBS','Gastritis']),

('Cabbage',                TRUE,
 ARRAY['vitamin_c','vitamin_k','fibre','folate','glutamine','sulforaphane'],
 ARRAY['cruciferous','dim_source','anti_inflammatory','gut_healing','vitamin_c_rich','fiber_rich'],
 ARRAY['Gastritis','Fibroids','Endometriosis','Autoimmune_Disorders','Thyroid_Hyper'],
 ARRAY['Thyroid_Hypo','IBS']),  -- goitrogenic raw

('Bitter Gourd (Karela)',  TRUE,
 ARRAY['vitamin_c','iron','folate','fibre','charantin','zinc'],
 ARRAY['blood_sugar_stabilising','iron_rich','vitamin_c_rich','liver_supportive','detox','anti_inflammatory'],
 ARRAY['Diabetes_Type2','Fatty_Liver','Cholesterol_High','PCOS','PreDiabetes'],
 ARRAY['Prenatal_Care']),  -- hypoglycaemic effect in pregnancy

('Bottle Gourd (Lauki)',   TRUE,
 ARRAY['water','fibre','vitamin_c','calcium','iron','potassium'],
 ARRAY['light_meal','fiber_rich','gut_soothing','galactagogue','low_calorie','hydrating'],
 ARRAY['Gastritis','Acidity','Postpartum','Obesity','IBS','Hypertension'],
 ARRAY[]::TEXT[]),

('Sweet Potato',           TRUE,
 ARRAY['beta_carotene','vitamin_c','potassium','fibre','vitamin_b6','manganese'],
 ARRAY['low_gi','vitamin_a_rich','potassium_rich','anti_inflammatory','fiber_rich','antioxidant_rich'],
 ARRAY['Hypertension','Skin_Issues_Acne','Vitamin_D_Deficiency','Diabetes_Type2','Constipation','Obesity'],
 ARRAY[]::TEXT[]),

('Beetroot',               TRUE,
 ARRAY['folate','iron','potassium','nitrates','vitamin_c','manganese','fibre'],
 ARRAY['iron_rich','folate_rich','potassium_rich','nitric_oxide_boosting','anti_inflammatory','antioxidant_rich'],
 ARRAY['Anemia','Hypertension','Prenatal_Care','Fatty_Liver','Endometriosis','Hair_Loss'],
 ARRAY[]::TEXT[]),

('Carrot',                 TRUE,
 ARRAY['beta_carotene','vitamin_k','potassium','fibre','vitamin_c','antioxidants'],
 ARRAY['vitamin_a_rich','antioxidant_rich','fiber_rich','low_gi','anti_inflammatory'],
 ARRAY['Skin_Issues_Acne','Prenatal_Care','Constipation','Obesity','Depression'],
 ARRAY[]::TEXT[]),

('Cucumber',               TRUE,
 ARRAY['water','potassium','vitamin_k','vitamin_c','silica','antioxidants'],
 ARRAY['hydrating','alkaline','low_calorie','gut_soothing','anti_inflammatory'],
 ARRAY['Acidity','Hypertension','Obesity','Skin_Issues_Acne','Gastritis'],
 ARRAY[]::TEXT[]),

('Tomato',                 TRUE,
 ARRAY['vitamin_c','lycopene','potassium','folate','vitamin_k','antioxidants'],
 ARRAY['antioxidant_rich','vitamin_c_rich','potassium_rich','anti_inflammatory'],
 ARRAY['Cholesterol_High','Skin_Issues_Acne','Prenatal_Care','Heart_Health'],
 ARRAY['Acidity','Gastritis','IBS','Autoimmune_Disorders']),

-- ── FRUITS ───────────────────────────────────────────────────

('Amla (Indian Gooseberry)', TRUE,
 ARRAY['vitamin_c','antioxidants','iron','tannins','fibre','chromium'],
 ARRAY['vitamin_c_rich','antioxidant_rich','iron_absorption_booster','detox','anti_inflammatory','blood_sugar_stabilising'],
 ARRAY['Anemia','Hair_Loss','Immunity','Diabetes_Type2','Fatty_Liver','Prenatal_Care','Skin_Issues_Acne'],
 ARRAY['Acidity']),  -- excess

('Banana',                 TRUE,
 ARRAY['potassium','magnesium','vitamin_b6','fibre','tryptophan','vitamin_c'],
 ARRAY['potassium_rich','magnesium_rich','tryptophan_rich','calming','natural_laxative','energy'],
 ARRAY['Hypertension','Anxiety','Depression','Constipation','Postpartum','Sleep_Disorders','IBS'],
 ARRAY['Diabetes_Type2']),  -- medium-high GI when ripe

('Papaya (Ripe)',           TRUE,
 ARRAY['vitamin_c','vitamin_a','folate','fibre','papain','potassium'],
 ARRAY['vitamin_c_rich','vitamin_a_rich','natural_laxative','gut_friendly','fiber_rich','anti_inflammatory'],
 ARRAY['Constipation','Gastritis','Immunity','Skin_Issues_Acne','Prenatal_Care','Postpartum'],
 ARRAY['Prenatal_Care']),   -- unripe only; ripe is safe in moderate amounts

('Guava',                  TRUE,
 ARRAY['vitamin_c','fibre','folate','potassium','lycopene','antioxidants'],
 ARRAY['vitamin_c_rich','fiber_rich','antioxidant_rich','low_gi','folate_rich'],
 ARRAY['Anemia','Diabetes_Type2','Immunity','Constipation','Prenatal_Care'],
 ARRAY[]::TEXT[]),

('Pomegranate',            TRUE,
 ARRAY['vitamin_c','potassium','fibre','punicalagins','folate','iron'],
 ARRAY['antioxidant_rich','iron_rich','vitamin_c_rich','anti_inflammatory','fiber_rich'],
 ARRAY['Anemia','Endometriosis','Skin_Issues_Acne','PCOS','Cholesterol_High','Infertility'],
 ARRAY[]::TEXT[]),

('Coconut Water',          TRUE,
 ARRAY['potassium','magnesium','calcium','sodium','electrolytes','cytokinins'],
 ARRAY['potassium_rich','magnesium_rich','hydrating','calming','electrolyte_rich','gut_soothing'],
 ARRAY['Hypertension','Acidity','Gastritis','Postpartum','Prenatal_Care','IBS'],
 ARRAY['Diabetes_Type2']),  -- limit quantity (natural sugars)

-- ── SEEDS & NUTS ─────────────────────────────────────────────

('Flaxseeds (Alsi)',        TRUE,
 ARRAY['omega_3_ala','lignans','fibre','protein','magnesium','selenium'],
 ARRAY['omega3_rich','fiber_rich','phytoestrogen','anti_inflammatory','selenium_rich','natural_laxative','hormone_balancing'],
 ARRAY['PCOS','Endometriosis','Fibroids','Cholesterol_High','Constipation','Menopause','Irregular_Periods','Thyroid_Hypo'],
 ARRAY[]::TEXT[]),

('Chia Seeds',             TRUE,
 ARRAY['omega_3','fibre','calcium','protein','iron','magnesium','zinc'],
 ARRAY['omega3_rich','fiber_rich','calcium_rich','iron_rich','high_protein','magnesium_rich'],
 ARRAY['Diabetes_Type2','PCOS','Constipation','Menopause','Prenatal_Care','Cholesterol_High'],
 ARRAY['IBS']),  -- adjust quantity

('Pumpkin Seeds',          TRUE,
 ARRAY['zinc','magnesium','iron','protein','omega_3','selenium','vitamin_k','tryptophan'],
 ARRAY['zinc_rich','magnesium_rich','iron_rich','high_protein','omega3_rich','tryptophan_rich','selenium_rich'],
 ARRAY['PCOS','Sleep_Disorders','Anxiety','Hair_Loss','Infertility','Depression','Thyroid_Hypo'],
 ARRAY[]::TEXT[]),

('Sesame Seeds (Til)',     TRUE,
 ARRAY['calcium','iron','zinc','magnesium','selenium','protein','lignans'],
 ARRAY['calcium_rich','iron_rich','zinc_rich','selenium_rich','phytoestrogen','high_protein','hormone_balancing'],
 ARRAY['PCOS','Menopause','Anemia','Irregular_Periods','Thyroid_Hypo','Infertility','Hair_Loss'],
 ARRAY[]::TEXT[]),

('Sunflower Seeds',        TRUE,
 ARRAY['vitamin_e','selenium','magnesium','zinc','protein','b_vitamins','healthy_fat'],
 ARRAY['selenium_rich','vitamin_e_rich','magnesium_rich','zinc_rich','high_protein','anti_inflammatory'],
 ARRAY['Thyroid_Hypo','Skin_Issues_Acne','Hair_Loss','PCOS','Autoimmune_Disorders'],
 ARRAY[]::TEXT[]),

('Walnuts',                TRUE,
 ARRAY['omega_3_ala','antioxidants','magnesium','zinc','protein','vitamin_e','selenium'],
 ARRAY['omega3_rich','antioxidant_rich','magnesium_rich','zinc_rich','anti_inflammatory','brain_food','tryptophan_rich'],
 ARRAY['Cholesterol_High','Depression','PCOS','Anxiety','Endometriosis','Infertility','Sleep_Disorders'],
 ARRAY[]::TEXT[]),

('Almonds',                TRUE,
 ARRAY['vitamin_e','magnesium','calcium','protein','fibre','healthy_fat','biotin'],
 ARRAY['vitamin_e_rich','calcium_rich','magnesium_rich','high_protein','biotin_rich','anti_inflammatory'],
 ARRAY['Diabetes_Type2','PCOS','Hair_Loss','Skin_Issues_Acne','Menopause','Cholesterol_High'],
 ARRAY[]::TEXT[]),

('Brazil Nuts',            TRUE,
 ARRAY['selenium','protein','magnesium','zinc','vitamin_e','healthy_fat'],
 ARRAY['selenium_rich','high_protein','magnesium_rich','zinc_rich','vitamin_e_rich'],
 ARRAY['Thyroid_Hypo','Thyroid_Hyper','Infertility','Hair_Loss','Autoimmune_Disorders','Depression'],
 ARRAY[]::TEXT[]),

-- ── SPICES, HERBS & SUPERFOODS ───────────────────────────────

('Turmeric (Haldi)',       TRUE,
 ARRAY['curcumin','iron','manganese','antioxidants','anti_inflammatory_compounds'],
 ARRAY['anti_inflammatory','antioxidant_rich','liver_supportive','detox','calming','gut_healing'],
 ARRAY['Endometriosis','Fatty_Liver','Depression','Autoimmune_Disorders','PCOS','Fibroids','Arthritis'],
 ARRAY[]::TEXT[]),

('Ginger (Adrak)',         TRUE,
 ARRAY['gingerols','shogaols','vitamin_c','magnesium','potassium','antioxidants'],
 ARRAY['anti_inflammatory','gut_soothing','nausea_friendly','calming','detox'],
 ARRAY['Gastritis','IBS','Prenatal_Care','Endometriosis','Acidity','Depression','Anxiety'],
 ARRAY[]::TEXT[]),

('Garlic (Lehsun)',        TRUE,
 ARRAY['allicin','selenium','manganese','vitamin_b6','vitamin_c','antioxidants'],
 ARRAY['anti_inflammatory','liver_supportive','nitric_oxide_boosting','immune_boosting','selenium_rich'],
 ARRAY['Hypertension','Cholesterol_High','Fatty_Liver','Immunity','PCOS','Autoimmune_Disorders'],
 ARRAY['IBS']),  -- high-FODMAP

('Cinnamon (Dalchini)',    TRUE,
 ARRAY['cinnamaldehyde','chromium','manganese','calcium','fibre','antioxidants'],
 ARRAY['blood_sugar_stabilising','anti_inflammatory','antioxidant_rich','gut_friendly','calming'],
 ARRAY['Diabetes_Type2','PCOS','Cholesterol_High','PreDiabetes','Obesity'],
 ARRAY['Fatty_Liver']),  -- cassia cinnamon in excess

('Fenugreek Seeds (Methi Dana)', TRUE,
 ARRAY['iron','calcium','fibre','protein','galactomannan','diosgenin'],
 ARRAY['iron_rich','fiber_rich','blood_sugar_stabilising','galactagogue','phytoestrogen','gut_friendly'],
 ARRAY['Diabetes_Type2','PCOS','Postpartum','Anemia','Cholesterol_High','Irregular_Periods','PreDiabetes'],
 ARRAY['Prenatal_Care']),  -- uterotonic in large amounts

('Isabgol (Psyllium Husk)', TRUE,
 ARRAY['soluble_fibre','insoluble_fibre','mucilage'],
 ARRAY['natural_laxative','fiber_rich','gut_friendly','cholesterol_lowering','soluble_fiber','blood_sugar_stabilising'],
 ARRAY['Constipation','IBS','Cholesterol_High','Diabetes_Type2','Obesity'],
 ARRAY[]::TEXT[]),

('Dark Chocolate (70%+)',  TRUE,
 ARRAY['magnesium','iron','zinc','antioxidants','tryptophan','copper','fibre'],
 ARRAY['magnesium_rich','antioxidant_rich','tryptophan_rich','iron_rich','calming','gut_brain_support'],
 ARRAY['Depression','Anxiety','Sleep_Disorders','PCOS','Hypertension','Menopause'],
 ARRAY['Acidity','Gastritis']),

('Ghee (Clarified Butter)', TRUE,
 ARRAY['vitamins_a_d_e_k','butyrate','mcts','healthy_fat','cla'],
 ARRAY['healthy_fat','fat_soluble_vitamin_carrier','gut_healing','calorie_dense'],
 ARRAY['Thyroid_Hypo','Autoimmune_Disorders','Postpartum','Vitamin_D_Deficiency','IBS'],
 ARRAY['Cholesterol_High','Obesity']),

('Green Tea',              TRUE,
 ARRAY['egcg','l_theanine','catechins','antioxidants','vitamin_c'],
 ARRAY['anti_inflammatory','antioxidant_rich','calming','blood_sugar_stabilising','detox','adaptogen'],
 ARRAY['PCOS','Obesity','Diabetes_Type2','Skin_Issues_Acne','Depression','Anxiety','Cholesterol_High'],
 ARRAY['Anemia','Gastritis']),  -- tannins block iron; avoid near meals

('Sabudana (Tapioca)',     TRUE,
 ARRAY['starch','calcium','potassium','energy'],
 ARRAY['calorie_dense','energy_rich','gut_soothing'],
 ARRAY['Postpartum','Prenatal_Care','Underweight'],
 ARRAY['Diabetes_Type2','Obesity']),

-- ── NON-VEGETARIAN ────────────────────────────────────────────

('Eggs',                   FALSE,
 ARRAY['complete_protein','vitamin_b12','vitamin_d','selenium','biotin','choline','zinc','iron'],
 ARRAY['high_protein','b12_rich','vitamin_d_rich','selenium_rich','biotin_rich','choline_rich'],
 ARRAY['Vitamin_B12_Deficiency','Vitamin_D_Deficiency','Hair_Loss','Infertility','Prenatal_Care','Thyroid_Hypo','Depression'],
 ARRAY[]::TEXT[]),

('Chicken Breast',         FALSE,
 ARRAY['complete_protein','vitamin_b12','selenium','zinc','niacin','phosphorus'],
 ARRAY['high_protein','b12_rich','selenium_rich','zinc_rich','low_fat'],
 ARRAY['Hair_Loss','Vitamin_B12_Deficiency','Anemia','Obesity','Postpartum'],
 ARRAY[]::TEXT[]),

('Salmon',                 FALSE,
 ARRAY['omega_3_epa_dha','vitamin_d','vitamin_b12','selenium','protein','astaxanthin'],
 ARRAY['omega3_rich','vitamin_d_rich','b12_rich','selenium_rich','high_protein','anti_inflammatory'],
 ARRAY['Depression','Anxiety','PCOS','Thyroid_Hypo','Cholesterol_High','Prenatal_Care','Hair_Loss','Endometriosis'],
 ARRAY[]::TEXT[]),

('Sardines',               FALSE,
 ARRAY['omega_3','calcium','vitamin_d','vitamin_b12','selenium','protein','phosphorus'],
 ARRAY['omega3_rich','calcium_rich','vitamin_d_rich','b12_rich','selenium_rich','high_protein'],
 ARRAY['Depression','Menopause','Thyroid_Hypo','Vitamin_B12_Deficiency','Vitamin_D_Deficiency'],
 ARRAY[]::TEXT[]),

('Mackerel (Bangda)',      FALSE,
 ARRAY['omega_3','vitamin_d','vitamin_b12','selenium','protein','zinc'],
 ARRAY['omega3_rich','vitamin_d_rich','b12_rich','selenium_rich','high_protein','zinc_rich'],
 ARRAY['Depression','Thyroid_Hypo','Vitamin_B12_Deficiency','Vitamin_D_Deficiency','PCOS','Cholesterol_High'],
 ARRAY[]::TEXT[]),

('Rohu Fish',              FALSE,
 ARRAY['protein','omega_3','vitamin_d','vitamin_b12','selenium','zinc','calcium'],
 ARRAY['high_protein','omega3_rich','vitamin_d_rich','b12_rich','selenium_rich','calcium_rich'],
 ARRAY['Vitamin_B12_Deficiency','Vitamin_D_Deficiency','Prenatal_Care','Hair_Loss','Anemia'],
 ARRAY[]::TEXT[]),

('Chicken Liver',          FALSE,
 ARRAY['vitamin_b12','heme_iron','folate','vitamin_a','zinc','selenium','protein'],
 ARRAY['b12_rich','iron_rich','folate_rich','zinc_rich','selenium_rich','high_protein'],
 ARRAY['Anemia','Vitamin_B12_Deficiency','Hair_Loss','Infertility','Prenatal_Care'],
 ARRAY['Prenatal_Care']),  -- very high Vit A: limit to once/week in pregnancy

('Mutton Lean',            FALSE,
 ARRAY['protein','heme_iron','zinc','vitamin_b12','selenium','phosphorus'],
 ARRAY['high_protein','iron_rich','b12_rich','zinc_rich','selenium_rich'],
 ARRAY['Anemia','Vitamin_B12_Deficiency','Hair_Loss'],
 ARRAY['Cholesterol_High','Endometriosis','Fibroids','Gout']);


-- ============================================================
-- SECTION 7: INSERT — CONDITION RULES (30 conditions)
-- ============================================================

INSERT INTO condition_rules (condition, markers, focus_types, avoid_types, priority) VALUES

('PCOS',                 ARRAY['insulin','testosterone','lh','fsh','vitamin_d','amh'],
 ARRAY['low_gi','high_protein','fiber_rich','anti_inflammatory','omega3_rich','zinc_rich','magnesium_rich','phytoestrogen'],
 ARRAY['high_gi','refined_carbs','high_sugar','processed_food','excess_dairy','trans_fat'],
 5),

('Thyroid_Hypo',         ARRAY['tsh','t3','t4','selenium','ferritin'],
 ARRAY['selenium_rich','iodine_rich','iron_rich','zinc_rich','high_protein','fiber_rich','gut_friendly'],
 ARRAY['raw_goitrogenic','excess_soy','gluten_heavy','high_sugar','refined_carbs','alcohol'],
 5),

('Thyroid_Hyper',        ARRAY['tsh','t3','t4'],
 ARRAY['calorie_dense','calcium_rich','antioxidant_rich','magnesium_rich','high_protein','goitrogenic_cooked'],
 ARRAY['iodine_rich','high_caffeine','high_stimulant','alcohol','high_sugar','spicy'],
 5),

('Diabetes_Type2',       ARRAY['fasting_glucose','hba1c','insulin','c_peptide'],
 ARRAY['low_gi','fiber_rich','high_protein','complex_carbs','magnesium_rich','chromium_rich','anti_inflammatory'],
 ARRAY['high_gi','high_sugar','refined_carbs','sugary_beverages','processed_food','fried','trans_fat'],
 5),

('PreDiabetes',          ARRAY['fasting_glucose','hba1c','insulin'],
 ARRAY['low_gi','fiber_rich','high_protein','complex_carbs','magnesium_rich','antioxidant_rich'],
 ARRAY['high_gi','high_sugar','sugary_beverages','refined_carbs','trans_fat','processed_food'],
 4),

('Hypertension',         ARRAY['potassium','sodium','crp'],
 ARRAY['low_sodium','potassium_rich','magnesium_rich','calcium_rich','fiber_rich','omega3_rich','nitric_oxide_boosting'],
 ARRAY['high_sodium','pickled','processed_food','high_saturated_fat','alcohol','excess_caffeine'],
 4),

('Obesity',              ARRAY['bmi','insulin','triglycerides','fasting_glucose'],
 ARRAY['high_protein','fiber_rich','low_calorie','low_gi','complex_carbs','gut_friendly'],
 ARRAY['high_calorie','high_sugar','liquid_calories','refined_carbs','fried','processed_food','trans_fat'],
 4),

('Anemia',               ARRAY['hemoglobin','ferritin','rbc','mcv','serum_iron','tibc'],
 ARRAY['iron_rich','vitamin_c_rich','folate_rich','b12_rich','high_protein','copper_rich','gut_friendly'],
 ARRAY['tannin_with_meals','calcium_with_iron_meals','unfermented_phytate_rich','alcohol','processed_food'],
 5),

('Vitamin_D_Deficiency', ARRAY['vitamin_d','calcium','pth'],
 ARRAY['vitamin_d_rich','calcium_rich','magnesium_rich','healthy_fat','vitamin_k2_rich','zinc_rich'],
 ARRAY['very_low_fat','excess_phosphate','alcohol','high_sugar','processed_food'],
 3),

('Vitamin_B12_Deficiency', ARRAY['vitamin_b12','mcv','homocysteine'],
 ARRAY['b12_rich','folate_rich','iron_rich','high_protein','probiotic','gut_friendly'],
 ARRAY['alcohol','long_term_antacids','refined_carbs','processed_food'],
 4),

('Cholesterol_High',     ARRAY['ldl','hdl','triglycerides','total_cholesterol'],
 ARRAY['fiber_rich','omega3_rich','plant_sterol','antioxidant_rich','unsaturated_fat','gut_friendly'],
 ARRAY['high_saturated_fat','trans_fat','high_cholesterol_food','high_sugar','refined_carbs','fried','alcohol'],
 4),

('Fatty_Liver',          ARRAY['alt','ast','ggt','triglycerides'],
 ARRAY['low_fructose','choline_rich','antioxidant_rich','fiber_rich','omega3_rich','liver_supportive'],
 ARRAY['alcohol','high_fructose','high_saturated_fat','trans_fat','refined_carbs','high_sugar','fruit_juices'],
 5),

('Gastritis',            ARRAY['h_pylori','crp'],
 ARRAY['gut_friendly','gut_soothing','probiotic','low_acid','anti_inflammatory','zinc_rich','light_meal'],
 ARRAY['spicy','acidic','high_caffeine','alcohol','fried','high_fat','carbonated'],
 4),

('IBS',                  ARRAY['crp','calprotectin'],
 ARRAY['low_fodmap','probiotic','soluble_fiber','gut_friendly','gut_soothing','anti_inflammatory'],
 ARRAY['high_fodmap','lactose_rich','carbonated','high_caffeine','alcohol','artificial_sweetener','fried'],
 4),

('Acidity',              ARRAY[]::TEXT[],
 ARRAY['alkaline','low_acid','fiber_rich','gut_soothing','calcium_rich','non_spicy'],
 ARRAY['acidic','spicy','high_caffeine','carbonated','chocolate','high_fat','fried'],
 3),

('Constipation',         ARRAY[]::TEXT[],
 ARRAY['fiber_rich','natural_laxative','hydrating','probiotic','gut_friendly','magnesium_rich','whole_grain'],
 ARRAY['low_fiber','refined_carbs','dehydrating','processed_food','excess_dairy','fried'],
 3),

('Infertility',          ARRAY['fsh','lh','amh','estradiol','progesterone','folate','vitamin_d'],
 ARRAY['folate_rich','antioxidant_rich','omega3_rich','zinc_rich','iron_rich','selenium_rich','high_protein'],
 ARRAY['trans_fat','high_sugar','alcohol','excess_caffeine','refined_carbs','excess_soy','processed_food'],
 5),

('Irregular_Periods',    ARRAY['fsh','lh','estradiol','progesterone','prolactin','tsh'],
 ARRAY['iron_rich','magnesium_rich','b_vitamin_rich','zinc_rich','omega3_rich','phytoestrogen','anti_inflammatory'],
 ARRAY['high_sugar','excess_caffeine','alcohol','refined_carbs','trans_fat','very_low_calorie'],
 4),

('Endometriosis',        ARRAY['estradiol','crp','ca125'],
 ARRAY['anti_inflammatory','omega3_rich','fiber_rich','antioxidant_rich','magnesium_rich','cruciferous','iron_rich','dim_source'],
 ARRAY['red_meat','processed_meat','trans_fat','high_sugar','excess_alcohol','excess_dairy','high_arachidonic_acid'],
 5),

('Fibroids',             ARRAY['estradiol','hemoglobin'],
 ARRAY['iron_rich','fiber_rich','cruciferous','dim_source','anti_inflammatory','omega3_rich','liver_supportive','vitamin_c_rich'],
 ARRAY['excess_alcohol','excess_red_meat','refined_carbs','high_sugar','hormone_dairy','processed_food'],
 4),

('Menopause',            ARRAY['fsh','lh','estradiol','vitamin_d','calcium'],
 ARRAY['calcium_rich','phytoestrogen','omega3_rich','magnesium_rich','antioxidant_rich','high_protein','fiber_rich','vitamin_k2_rich'],
 ARRAY['spicy','high_caffeine','alcohol','high_sodium','high_sugar','high_saturated_fat'],
 4),

('Autoimmune_Disorders', ARRAY['crp','esr','ana','anti_tpo','anti_tg'],
 ARRAY['anti_inflammatory','omega3_rich','gut_healing','probiotic','antioxidant_rich','zinc_rich','selenium_rich','vitamin_d_rich'],
 ARRAY['gluten_heavy','processed_food','high_sugar','alcohol','nightshades_aip','emulsifiers','refined_carbs'],
 5),

('Skin_Issues_Acne',     ARRAY['testosterone','insulin','igf1'],
 ARRAY['low_gi','zinc_rich','omega3_rich','antioxidant_rich','vitamin_a_rich','probiotic','anti_inflammatory','vitamin_c_rich'],
 ARRAY['high_gi','high_sugar','dairy_excess','whey_protein','fried','processed_food','excess_iodine'],
 3),

('Hair_Loss',            ARRAY['ferritin','vitamin_d','tsh','vitamin_b12','zinc','hemoglobin'],
 ARRAY['high_protein','iron_rich','biotin_rich','zinc_rich','omega3_rich','vitamin_d_rich','b12_rich','selenium_rich'],
 ARRAY['very_low_calorie','high_sugar','refined_carbs','crash_diet','excess_vitamin_a_supplement'],
 4),

('Depression',           ARRAY['vitamin_d','vitamin_b12','folate','tsh','cortisol'],
 ARRAY['omega3_rich','tryptophan_rich','b_vitamin_rich','magnesium_rich','probiotic','antioxidant_rich','zinc_rich'],
 ARRAY['high_sugar','alcohol','ultra_processed','high_caffeine','refined_carbs'],
 4),

('Anxiety',              ARRAY['cortisol','tsh','vitamin_b12','magnesium'],
 ARRAY['magnesium_rich','calming','complex_carbs','omega3_rich','probiotic','tryptophan_rich','b_vitamin_rich','adaptogen'],
 ARRAY['high_caffeine','alcohol','high_sugar','refined_carbs','high_sodium','stimulant'],
 3),

('Sleep_Disorders',      ARRAY['cortisol','melatonin','vitamin_d','magnesium'],
 ARRAY['tryptophan_rich','magnesium_rich','calming','sleep_promoting','complex_carbs','anti_inflammatory'],
 ARRAY['high_caffeine','alcohol','heavy_meal_at_night','high_sugar','spicy','stimulant'],
 3),

('Postpartum',           ARRAY['hemoglobin','vitamin_b12','vitamin_d','tsh'],
 ARRAY['iron_rich','calcium_rich','omega3_rich','galactagogue','calorie_dense','b12_rich','high_protein','anti_inflammatory'],
 ARRAY['alcohol','high_caffeine','crash_diet','raw_foods','high_sugar','refined_carbs'],
 5),

('Prenatal_Care',        ARRAY['folate','hemoglobin','vitamin_d','vitamin_b12','tsh'],
 ARRAY['folate_rich','iron_rich','calcium_rich','dha_rich','high_protein','iodine_rich','nausea_friendly','fiber_rich'],
 ARRAY['raw_or_undercooked','high_mercury_fish','alcohol','unpasteurized','excess_vitamin_a_supplement','high_caffeine'],
 5),

('Other_Diseases',       ARRAY[]::TEXT[],
 ARRAY['balanced','high_protein','fiber_rich','antioxidant_rich','anti_inflammatory','gut_friendly','complex_carbs'],
 ARRAY['processed_food','high_sugar','fried','refined_carbs','high_saturated_fat','alcohol'],
 1);


-- ============================================================
-- SECTION 8: INSERT — MARKER ↔ CONDITION MAP (decision engine routing)
-- ============================================================

INSERT INTO marker_condition_map (marker_name, marker_status, condition, confidence, is_diagnostic) VALUES

-- Hemoglobin / Iron
('hemoglobin',     'LOW',        'Anemia',                    90, TRUE),
('ferritin',       'LOW',        'Anemia',                    85, TRUE),
('ferritin',       'LOW',        'Hair_Loss',                 80, FALSE),
('serum_iron',     'LOW',        'Anemia',                    85, TRUE),
('mcv',            'LOW',        'Anemia',                    70, FALSE),
('mcv',            'HIGH',       'Vitamin_B12_Deficiency',    75, FALSE),

-- Vitamin B12
('vitamin_b12',    'LOW',        'Vitamin_B12_Deficiency',    95, TRUE),
('vitamin_b12',    'LOW',        'Anemia',                    60, FALSE),
('vitamin_b12',    'LOW',        'Depression',                55, FALSE),
('vitamin_b12',    'LOW',        'Hair_Loss',                 60, FALSE),
('homocysteine',   'HIGH',       'Vitamin_B12_Deficiency',    75, FALSE),

-- Vitamin D
('vitamin_d',      'LOW',        'Vitamin_D_Deficiency',      95, TRUE),
('vitamin_d',      'LOW',        'PCOS',                      60, FALSE),
('vitamin_d',      'LOW',        'Depression',                65, FALSE),
('vitamin_d',      'LOW',        'Hair_Loss',                 60, FALSE),
('vitamin_d',      'LOW',        'Autoimmune_Disorders',      55, FALSE),
('pth',            'HIGH',       'Vitamin_D_Deficiency',      70, FALSE),

-- Thyroid
('tsh',            'HIGH',       'Thyroid_Hypo',              90, TRUE),
('tsh',            'LOW',        'Thyroid_Hyper',             90, TRUE),
('t3',             'LOW',        'Thyroid_Hypo',              85, FALSE),
('t3',             'HIGH',       'Thyroid_Hyper',             85, FALSE),
('t4',             'LOW',        'Thyroid_Hypo',              85, FALSE),
('t4',             'HIGH',       'Thyroid_Hyper',             85, FALSE),
('tsh',            'HIGH',       'Hair_Loss',                 60, FALSE),
('tsh',            'HIGH',       'Depression',                55, FALSE),
('tsh',            'HIGH',       'Irregular_Periods',         60, FALSE),
('anti_tpo',       'HIGH',       'Autoimmune_Disorders',      80, FALSE),
('anti_tpo',       'HIGH',       'Thyroid_Hypo',              75, FALSE),

-- Glucose / Insulin / HbA1c
('fasting_glucose','HIGH',       'Diabetes_Type2',            90, TRUE),
('fasting_glucose','BORDERLINE', 'PreDiabetes',               85, TRUE),
('hba1c',          'HIGH',       'Diabetes_Type2',            95, TRUE),
('hba1c',          'BORDERLINE', 'PreDiabetes',               90, TRUE),
('insulin',        'HIGH',       'Diabetes_Type2',            70, FALSE),
('insulin',        'HIGH',       'PCOS',                      75, FALSE),
('insulin',        'HIGH',       'Obesity',                   65, FALSE),
('insulin',        'HIGH',       'PreDiabetes',               70, FALSE),
('fasting_glucose','HIGH',       'Obesity',                   50, FALSE),

-- PCOS markers
('testosterone',   'HIGH',       'PCOS',                      85, FALSE),
('lh',             'HIGH',       'PCOS',                      80, FALSE),
('amh',            'HIGH',       'PCOS',                      75, FALSE),
('lh',             'LOW',        'Irregular_Periods',         70, FALSE),
('fsh',            'LOW',        'PCOS',                      70, FALSE),
('fsh',            'HIGH',       'Menopause',                 85, FALSE),
('prolactin',      'HIGH',       'Irregular_Periods',         80, TRUE),
('estradiol',      'LOW',        'Menopause',                 85, FALSE),
('estradiol',      'HIGH',       'Endometriosis',             60, FALSE),
('estradiol',      'HIGH',       'Fibroids',                  55, FALSE),
('progesterone',   'LOW',        'Irregular_Periods',         75, FALSE),
('progesterone',   'LOW',        'Infertility',               70, FALSE),

-- Lipids
('ldl',            'HIGH',       'Cholesterol_High',          90, TRUE),
('hdl',            'LOW',        'Cholesterol_High',          80, FALSE),
('triglycerides',  'HIGH',       'Cholesterol_High',          85, TRUE),
('triglycerides',  'HIGH',       'Fatty_Liver',               70, FALSE),
('total_cholesterol','HIGH',     'Cholesterol_High',          85, FALSE),

-- Liver
('alt',            'HIGH',       'Fatty_Liver',               90, TRUE),
('ast',            'HIGH',       'Fatty_Liver',               85, FALSE),
('ggt',            'HIGH',       'Fatty_Liver',               80, FALSE),
('alt',            'HIGH',       'Autoimmune_Disorders',      50, FALSE),

-- Inflammation markers
('crp',            'HIGH',       'Autoimmune_Disorders',      70, FALSE),
('crp',            'HIGH',       'Endometriosis',             65, FALSE),
('crp',            'HIGH',       'PCOS',                      55, FALSE),
('esr',            'HIGH',       'Autoimmune_Disorders',      65, FALSE),
('ana',            'HIGH',       'Autoimmune_Disorders',      85, TRUE),
('ca125',          'HIGH',       'Endometriosis',             70, FALSE),

-- Stress / Mood
('cortisol',       'HIGH',       'Anxiety',                   75, FALSE),
('cortisol',       'HIGH',       'Depression',                65, FALSE),
('cortisol',       'HIGH',       'Obesity',                   55, FALSE),
('cortisol',       'HIGH',       'Irregular_Periods',         60, FALSE),

-- Folate
('folate',         'LOW',        'Infertility',               75, FALSE),
('folate',         'LOW',        'Anemia',                    65, FALSE),
('folate',         'LOW',        'Prenatal_Care',             80, FALSE),

-- Zinc
('zinc',           'LOW',        'Hair_Loss',                 75, FALSE),
('zinc',           'LOW',        'Infertility',               70, FALSE),
('zinc',           'LOW',        'Skin_Issues_Acne',          65, FALSE),
('zinc',           'LOW',        'PCOS',                      60, FALSE),

-- Potassium / Sodium
('potassium',      'LOW',        'Hypertension',              60, FALSE),
('sodium',         'HIGH',       'Hypertension',              65, FALSE),

-- Magnesium
('magnesium',      'LOW',        'Anxiety',                   65, FALSE),
('magnesium',      'LOW',        'Sleep_Disorders',           65, FALSE),
('magnesium',      'LOW',        'Depression',                60, FALSE),
('magnesium',      'LOW',        'PCOS',                      55, FALSE);


-- ============================================================
-- SECTION 9: INSERT — DIET TEMPLATES (5 full templates)
-- ============================================================

INSERT INTO diet_templates (name, condition, tags, template_data) VALUES

-- ── TEMPLATE 1: PCOS ─────────────────────────────────────────
(
  'PCOS Diet Template',
  'PCOS',
  ARRAY['hormonal','insulin_resistance','anti_inflammatory','low_gi','women_health'],
  '{
    "goals": [
      "reduce_insulin_resistance",
      "balance_androgens",
      "regulate_menstrual_cycle",
      "reduce_inflammation",
      "support_healthy_weight"
    ],
    "nutrition_strategy": {
      "diet_type": "low_gi_high_protein",
      "fasting_protocol": "12:12",
      "focus_types": ["low_gi","high_protein","anti_inflammatory","fiber_rich","omega3_rich"]
    },
    "food_rules": {
      "recommended_types": ["low_gi","high_protein","fiber_rich","anti_inflammatory","omega3_rich","zinc_rich","magnesium_rich","phytoestrogen"],
      "avoid_types": ["high_gi","refined_carbs","high_sugar","processed_food","excess_dairy","trans_fat"]
    },
    "meal_structure": {
      "pattern": "5_meals",
      "meals": [
        { "slot": "Early Morning", "types": ["detox","anti_inflammatory"] },
        { "slot": "Breakfast",     "types": ["low_gi","high_protein","fiber_rich"] },
        { "slot": "Mid Morning",   "types": ["anti_inflammatory","zinc_rich"] },
        { "slot": "Lunch",         "types": ["low_gi","high_protein","fiber_rich","balanced"] },
        { "slot": "Evening Snack", "types": ["anti_inflammatory","low_gi"] },
        { "slot": "Dinner",        "types": ["high_protein","low_gi","gut_friendly"] }
      ]
    },
    "rules": {
      "early_dinner": true,
      "no_skipping_meals": true,
      "avoid_late_night_eating": true,
      "spearmint_tea_recommended": true
    },
    "ai_notes": "Prioritise low-GI millets over rice and maida. Include spearmint tea as anti-androgen. Ensure protein at every meal. Use seed cycling: flax and pumpkin in follicular phase, sesame and sunflower in luteal phase. Indian context: replace rice with millets, include curd for gut health."
  }'::JSONB
),

-- ── TEMPLATE 2: ANEMIA ───────────────────────────────────────
(
  'Anemia Diet Template',
  'Anemia',
  ARRAY['iron_deficiency','haemoglobin','b12','folate','womens_health'],
  '{
    "goals": [
      "increase_haemoglobin_levels",
      "replenish_iron_stores_ferritin",
      "improve_energy_and_reduce_fatigue",
      "support_rbc_production",
      "enhance_iron_absorption"
    ],
    "nutrition_strategy": {
      "diet_type": "iron_rich_vitamin_c_paired",
      "fasting_protocol": "none",
      "focus_types": ["iron_rich","vitamin_c_rich","folate_rich","b12_rich","high_protein"]
    },
    "food_rules": {
      "recommended_types": ["iron_rich","vitamin_c_rich","folate_rich","b12_rich","high_protein","copper_rich","gut_friendly"],
      "avoid_types": ["tannin_with_meals","calcium_with_iron_meals","unfermented_phytate_rich","alcohol","processed_food"]
    },
    "meal_structure": {
      "pattern": "5_meals",
      "meals": [
        { "slot": "Early Morning", "types": ["iron_rich","vitamin_c_rich"] },
        { "slot": "Breakfast",     "types": ["iron_rich","b12_rich","high_protein"] },
        { "slot": "Mid Morning",   "types": ["vitamin_c_rich","antioxidant_rich"] },
        { "slot": "Lunch",         "types": ["iron_rich","folate_rich","balanced"] },
        { "slot": "Evening Snack", "types": ["iron_rich","vitamin_c_rich"] },
        { "slot": "Dinner",        "types": ["iron_rich","b12_rich","light_meal"] }
      ]
    },
    "rules": {
      "pair_iron_with_vitamin_c": true,
      "avoid_tea_coffee_with_meals": true,
      "soak_and_sprout_legumes": true,
      "no_calcium_supplements_at_meal_time": true
    },
    "ai_notes": "Always pair iron-rich foods with Vitamin C to maximise absorption. Indian context: dal with amla chutney, poha with lemon, palak with tomato. Ragi is excellent non-heme iron. B12 anemia: include eggs and dairy daily. Avoid tea/coffee within 1 hour of meals. Soak and sprout legumes to reduce phytates."
  }'::JSONB
),

-- ── TEMPLATE 3: DIABETES TYPE 2 ──────────────────────────────
(
  'Diabetes Type 2 Diet Template',
  'Diabetes_Type2',
  ARRAY['blood_sugar','hba1c','insulin_resistance','low_gi','metabolic'],
  '{
    "goals": [
      "control_fasting_and_postmeal_glucose",
      "reduce_hba1c",
      "improve_insulin_sensitivity",
      "prevent_diabetic_complications",
      "maintain_healthy_weight"
    ],
    "nutrition_strategy": {
      "diet_type": "low_gi_high_fiber",
      "fasting_protocol": "12:12",
      "focus_types": ["low_gi","fiber_rich","high_protein","complex_carbs","anti_inflammatory"]
    },
    "food_rules": {
      "recommended_types": ["low_gi","fiber_rich","high_protein","complex_carbs","magnesium_rich","chromium_rich","anti_inflammatory"],
      "avoid_types": ["high_gi","high_sugar","refined_carbs","sugary_beverages","processed_food","fried","trans_fat"]
    },
    "meal_structure": {
      "pattern": "6_meals",
      "meals": [
        { "slot": "Early Morning", "types": ["detox","blood_sugar_stabilising"] },
        { "slot": "Breakfast",     "types": ["low_gi","high_protein","fiber_rich"] },
        { "slot": "Mid Morning",   "types": ["low_gi","high_protein"] },
        { "slot": "Lunch",         "types": ["low_gi","fiber_rich","balanced"] },
        { "slot": "Evening Snack", "types": ["low_gi","high_protein"] },
        { "slot": "Dinner",        "types": ["low_gi","light_meal","high_protein"] }
      ]
    },
    "rules": {
      "no_skipping_meals": true,
      "evenly_spaced_meals": true,
      "early_dinner": true,
      "avoid_fruit_juices": true,
      "portion_control": true
    },
    "ai_notes": "Every meal must be low GI. Plate method: 50% non-starchy vegetables, 25% protein, 25% complex carbs. Replace rice with millets. Include methi (fenugreek) daily for hypoglycaemic effect. Include bitter gourd, amla, cinnamon. Meals evenly spaced every 2-3 hours. Never skip meals."
  }'::JSONB
),

-- ── TEMPLATE 4: HYPOTHYROIDISM ───────────────────────────────
(
  'Hypothyroidism Diet Template',
  'Thyroid_Hypo',
  ARRAY['tsh_high','selenium','iodine','metabolism','thyroid'],
  '{
    "goals": [
      "support_thyroid_hormone_production",
      "improve_metabolism_and_energy",
      "reduce_fatigue",
      "optimise_selenium_and_iodine",
      "prevent_weight_gain"
    ],
    "nutrition_strategy": {
      "diet_type": "selenium_iodine_balanced",
      "fasting_protocol": "none",
      "focus_types": ["selenium_rich","iodine_rich","iron_rich","zinc_rich","anti_inflammatory"]
    },
    "food_rules": {
      "recommended_types": ["selenium_rich","iodine_rich","iron_rich","zinc_rich","high_protein","fiber_rich","gut_friendly"],
      "avoid_types": ["raw_goitrogenic","excess_soy","gluten_heavy","high_sugar","refined_carbs","alcohol"]
    },
    "meal_structure": {
      "pattern": "5_meals",
      "meals": [
        { "slot": "Early Morning", "types": ["detox"] },
        { "slot": "Breakfast",     "types": ["selenium_rich","iodine_rich","high_protein"] },
        { "slot": "Mid Morning",   "types": ["zinc_rich","fiber_rich"] },
        { "slot": "Lunch",         "types": ["balanced","iron_rich","fiber_rich"] },
        { "slot": "Evening Snack", "types": ["gut_friendly","selenium_rich"] },
        { "slot": "Dinner",        "types": ["light_meal","high_protein","selenium_rich"] }
      ]
    },
    "rules": {
      "medication_on_empty_stomach": true,
      "breakfast_30min_after_medication": true,
      "avoid_soy_near_medication": true,
      "cook_cruciferous_vegetables": true,
      "early_dinner": true
    },
    "ai_notes": "Medication must be taken 30-45 min before breakfast on empty stomach. Cook cruciferous vegetables to reduce goitrogens. Prioritise selenium through Brazil nuts, eggs, fish. Indian context: ragi, moringa, sesame seeds are excellent. Schedule soy away from medication time."
  }'::JSONB
),

-- ── TEMPLATE 5: VITAMIN B12 DEFICIENCY ──────────────────────
(
  'Vitamin B12 Deficiency Diet Template',
  'Vitamin_B12_Deficiency',
  ARRAY['b12','neurological','megaloblastic_anaemia','gut_health','vegan_risk'],
  '{
    "goals": [
      "replenish_b12_levels",
      "reverse_neurological_symptoms",
      "prevent_megaloblastic_anaemia",
      "improve_energy_and_cognition",
      "support_nerve_myelin_repair"
    ],
    "nutrition_strategy": {
      "diet_type": "b12_focused_high_protein",
      "fasting_protocol": "none",
      "focus_types": ["b12_rich","folate_rich","high_protein","iron_rich","gut_friendly"]
    },
    "food_rules": {
      "recommended_types": ["b12_rich","folate_rich","iron_rich","high_protein","probiotic","gut_friendly"],
      "avoid_types": ["alcohol","long_term_antacids","refined_carbs","processed_food"]
    },
    "meal_structure": {
      "pattern": "4_meals",
      "meals": [
        { "slot": "Breakfast",   "types": ["b12_rich","high_protein","iron_rich"] },
        { "slot": "Mid Morning", "types": ["b12_rich","gut_friendly"] },
        { "slot": "Lunch",       "types": ["b12_rich","folate_rich","balanced"] },
        { "slot": "Dinner",      "types": ["b12_rich","high_protein","light_meal"] }
      ]
    },
    "rules": {
      "supplement_required_for_vegans": true,
      "include_fermented_foods_daily": true,
      "avoid_alcohol": true,
      "gut_health_priority": true
    },
    "ai_notes": "B12 found almost exclusively in animal products. For vegetarians: dairy and eggs daily. For vegans: supplementation is mandatory. Include fermented foods (idli, dosa, curd) to improve gut absorption. Indian context: curd, paneer, eggs are daily necessities. Include amla for absorption synergy."
  }'::JSONB
);


-- ============================================================
-- SECTION 10: VIEWS (convenience + decision engine)
-- ============================================================

-- ─────────────────────────────────────────
-- Active diet templates summary
-- ─────────────────────────────────────────
CREATE OR REPLACE VIEW v_active_templates AS
SELECT
  id,
  name,
  condition,
  tags,
  template_data -> 'nutrition_strategy' ->> 'diet_type'       AS diet_type,
  template_data -> 'nutrition_strategy' ->> 'fasting_protocol' AS fasting_protocol,
  template_data -> 'meal_structure' ->> 'pattern'             AS meal_pattern,
  is_active,
  created_at
FROM diet_templates
WHERE is_active = TRUE;


-- ─────────────────────────────────────────
-- Food search view (indexed for fast lookup)
-- ─────────────────────────────────────────
CREATE OR REPLACE VIEW v_food_lookup AS
SELECT
  id,
  name,
  is_veg,
  nutrients,
  types,
  beneficial_for,
  avoid_for,
  CASE WHEN 'high_protein'      = ANY(types) THEN TRUE ELSE FALSE END AS is_high_protein,
  CASE WHEN 'iron_rich'         = ANY(types) THEN TRUE ELSE FALSE END AS is_iron_rich,
  CASE WHEN 'b12_rich'          = ANY(types) THEN TRUE ELSE FALSE END AS is_b12_rich,
  CASE WHEN 'omega3_rich'       = ANY(types) THEN TRUE ELSE FALSE END AS is_omega3_rich,
  CASE WHEN 'low_gi'            = ANY(types) THEN TRUE ELSE FALSE END AS is_low_gi,
  CASE WHEN 'anti_inflammatory' = ANY(types) THEN TRUE ELSE FALSE END AS is_anti_inflammatory,
  CASE WHEN 'calcium_rich'      = ANY(types) THEN TRUE ELSE FALSE END AS is_calcium_rich,
  CASE WHEN 'probiotic'         = ANY(types) THEN TRUE ELSE FALSE END AS is_probiotic
FROM foods;


-- ─────────────────────────────────────────
-- Condition summary with template linkage
-- ─────────────────────────────────────────
CREATE OR REPLACE VIEW v_condition_summary AS
SELECT
  cr.condition,
  cr.priority,
  cr.focus_types,
  cr.avoid_types,
  dt.id                                          AS template_id,
  dt.name                                        AS template_name,
  dt.template_data -> 'nutrition_strategy' ->> 'diet_type' AS diet_type,
  array_length(cr.markers, 1)                    AS marker_count
FROM condition_rules cr
LEFT JOIN diet_templates dt ON dt.condition = cr.condition AND dt.is_active = TRUE
ORDER BY cr.priority DESC, cr.condition;


-- ============================================================
-- SECTION 11: ROW LEVEL SECURITY (Supabase)
-- ============================================================

ALTER TABLE patients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods           ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE marker_condition_map ENABLE ROW LEVEL SECURITY;

-- Public read access for lookup tables (foods, templates, conditions)
CREATE POLICY "public_read_foods"
  ON foods FOR SELECT USING (TRUE);

CREATE POLICY "public_read_templates"
  ON diet_templates FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_condition_rules"
  ON condition_rules FOR SELECT USING (TRUE);

CREATE POLICY "public_read_marker_map"
  ON marker_condition_map FOR SELECT USING (TRUE);

-- Authenticated access only for patient data
CREATE POLICY "auth_read_patients"
  ON patients FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_patients"
  ON patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_patients"
  ON patients FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_lab_reports"
  ON lab_reports FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_lab_reports"
  ON lab_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_read_diet_plans"
  ON diet_plans FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_diet_plans"
  ON diet_plans FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update_diet_plans"
  ON diet_plans FOR UPDATE USING (auth.role() = 'authenticated');


-- ============================================================
-- END OF SCHEMA
-- ============================================================
-- Quick validation queries (run after migration):
--
-- SELECT COUNT(*) FROM foods;               -- expect 60
-- SELECT COUNT(*) FROM condition_rules;     -- expect 30
-- SELECT COUNT(*) FROM marker_condition_map; -- expect ~80
-- SELECT COUNT(*) FROM diet_templates;       -- expect 5
--
-- Test decision engine:
-- SELECT * FROM detect_conditions_from_lab('<lab_report_uuid>');
--
-- Test food recommendation:
-- SELECT * FROM get_recommended_foods('<patient_uuid>', ARRAY['PCOS','Anemia']);
-- ============================================================
