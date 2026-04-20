// ============================================================
// DIET ENGINE — Core Logic
// Flow: markers → conditions → template → foods → prompt → plan
// ============================================================

import { DIET_TEMPLATES, getTemplate } from '../data/dietTemplates';
import { supabase } from './supabaseClient';


// ============================================================
// SECTION 1: MARKER → CONDITIONS
// Maps raw lab markers to medical conditions with confidence
// ============================================================

// Master marker map — mirrors the DB marker_condition_map table
// Used for offline / frontend-side resolution
const MARKER_CONDITION_MAP = [
  // Hemoglobin / Iron
  { marker: 'hemoglobin',      status: 'LOW',        condition: 'Anemia',                   confidence: 90, diagnostic: true  },
  { marker: 'ferritin',        status: 'LOW',        condition: 'Anemia',                   confidence: 85, diagnostic: true  },
  { marker: 'ferritin',        status: 'LOW',        condition: 'Hair_Loss',                confidence: 80, diagnostic: false },
  { marker: 'serum_iron',      status: 'LOW',        condition: 'Anemia',                   confidence: 85, diagnostic: true  },
  { marker: 'mcv',             status: 'LOW',        condition: 'Anemia',                   confidence: 70, diagnostic: false },
  { marker: 'mcv',             status: 'HIGH',       condition: 'Vitamin_B12_Deficiency',   confidence: 75, diagnostic: false },

  // Vitamin B12
  { marker: 'vitamin_b12',     status: 'LOW',        condition: 'Vitamin_B12_Deficiency',   confidence: 95, diagnostic: true  },
  { marker: 'vitamin_b12',     status: 'LOW',        condition: 'Anemia',                   confidence: 60, diagnostic: false },
  { marker: 'vitamin_b12',     status: 'LOW',        condition: 'Depression',               confidence: 55, diagnostic: false },
  { marker: 'vitamin_b12',     status: 'LOW',        condition: 'Hair_Loss',                confidence: 60, diagnostic: false },
  { marker: 'homocysteine',    status: 'HIGH',       condition: 'Vitamin_B12_Deficiency',   confidence: 75, diagnostic: false },

  // Vitamin D
  { marker: 'vitamin_d',       status: 'LOW',        condition: 'Vitamin_D_Deficiency',     confidence: 95, diagnostic: true  },
  { marker: 'vitamin_d',       status: 'LOW',        condition: 'PCOS',                     confidence: 60, diagnostic: false },
  { marker: 'vitamin_d',       status: 'LOW',        condition: 'Depression',               confidence: 65, diagnostic: false },
  { marker: 'vitamin_d',       status: 'LOW',        condition: 'Hair_Loss',                confidence: 60, diagnostic: false },
  { marker: 'pth',             status: 'HIGH',       condition: 'Vitamin_D_Deficiency',     confidence: 70, diagnostic: false },

  // Thyroid
  { marker: 'tsh',             status: 'HIGH',       condition: 'Thyroid_Hypo',             confidence: 90, diagnostic: true  },
  { marker: 'tsh',             status: 'LOW',        condition: 'Thyroid_Hyper',            confidence: 90, diagnostic: true  },
  { marker: 't3',              status: 'LOW',        condition: 'Thyroid_Hypo',             confidence: 85, diagnostic: false },
  { marker: 't3',              status: 'HIGH',       condition: 'Thyroid_Hyper',            confidence: 85, diagnostic: false },
  { marker: 't4',              status: 'LOW',        condition: 'Thyroid_Hypo',             confidence: 85, diagnostic: false },
  { marker: 't4',              status: 'HIGH',       condition: 'Thyroid_Hyper',            confidence: 85, diagnostic: false },
  { marker: 'tsh',             status: 'HIGH',       condition: 'Hair_Loss',                confidence: 60, diagnostic: false },
  { marker: 'tsh',             status: 'HIGH',       condition: 'Depression',               confidence: 55, diagnostic: false },
  { marker: 'tsh',             status: 'HIGH',       condition: 'Irregular_Periods',        confidence: 60, diagnostic: false },
  { marker: 'anti_tpo',        status: 'HIGH',       condition: 'Autoimmune_Disorders',     confidence: 80, diagnostic: false },

  // Glucose / Insulin
  { marker: 'fasting_glucose', status: 'HIGH',       condition: 'Diabetes_Type2',           confidence: 90, diagnostic: true  },
  { marker: 'fasting_glucose', status: 'BORDERLINE', condition: 'PreDiabetes',              confidence: 85, diagnostic: true  },
  { marker: 'hba1c',           status: 'HIGH',       condition: 'Diabetes_Type2',           confidence: 95, diagnostic: true  },
  { marker: 'hba1c',           status: 'BORDERLINE', condition: 'PreDiabetes',              confidence: 90, diagnostic: true  },
  { marker: 'insulin',         status: 'HIGH',       condition: 'Diabetes_Type2',           confidence: 70, diagnostic: false },
  { marker: 'insulin',         status: 'HIGH',       condition: 'PCOS',                     confidence: 75, diagnostic: false },
  { marker: 'insulin',         status: 'HIGH',       condition: 'Obesity',                  confidence: 65, diagnostic: false },
  { marker: 'insulin',         status: 'HIGH',       condition: 'PreDiabetes',              confidence: 70, diagnostic: false },

  // PCOS markers
  { marker: 'testosterone',    status: 'HIGH',       condition: 'PCOS',                     confidence: 85, diagnostic: false },
  { marker: 'lh',              status: 'HIGH',       condition: 'PCOS',                     confidence: 80, diagnostic: false },
  { marker: 'amh',             status: 'HIGH',       condition: 'PCOS',                     confidence: 75, diagnostic: false },
  { marker: 'fsh',             status: 'LOW',        condition: 'PCOS',                     confidence: 70, diagnostic: false },
  { marker: 'fsh',             status: 'HIGH',       condition: 'Menopause',                confidence: 85, diagnostic: false },
  { marker: 'prolactin',       status: 'HIGH',       condition: 'Irregular_Periods',        confidence: 80, diagnostic: true  },
  { marker: 'estradiol',       status: 'LOW',        condition: 'Menopause',                confidence: 85, diagnostic: false },
  { marker: 'estradiol',       status: 'HIGH',       condition: 'Endometriosis',            confidence: 60, diagnostic: false },
  { marker: 'estradiol',       status: 'HIGH',       condition: 'Fibroids',                 confidence: 55, diagnostic: false },
  { marker: 'progesterone',    status: 'LOW',        condition: 'Irregular_Periods',        confidence: 75, diagnostic: false },
  { marker: 'progesterone',    status: 'LOW',        condition: 'Infertility',              confidence: 70, diagnostic: false },

  // Lipids
  { marker: 'ldl',             status: 'HIGH',       condition: 'Cholesterol_High',         confidence: 90, diagnostic: true  },
  { marker: 'hdl',             status: 'LOW',        condition: 'Cholesterol_High',         confidence: 80, diagnostic: false },
  { marker: 'triglycerides',   status: 'HIGH',       condition: 'Cholesterol_High',         confidence: 85, diagnostic: true  },
  { marker: 'triglycerides',   status: 'HIGH',       condition: 'Fatty_Liver',              confidence: 70, diagnostic: false },

  // Liver
  { marker: 'alt',             status: 'HIGH',       condition: 'Fatty_Liver',              confidence: 90, diagnostic: true  },
  { marker: 'ast',             status: 'HIGH',       condition: 'Fatty_Liver',              confidence: 85, diagnostic: false },
  { marker: 'ggt',             status: 'HIGH',       condition: 'Fatty_Liver',              confidence: 80, diagnostic: false },

  // Inflammation
  { marker: 'crp',             status: 'HIGH',       condition: 'Autoimmune_Disorders',     confidence: 70, diagnostic: false },
  { marker: 'crp',             status: 'HIGH',       condition: 'Endometriosis',            confidence: 65, diagnostic: false },
  { marker: 'crp',             status: 'HIGH',       condition: 'PCOS',                     confidence: 55, diagnostic: false },
  { marker: 'ana',             status: 'HIGH',       condition: 'Autoimmune_Disorders',     confidence: 85, diagnostic: true  },
  { marker: 'ca125',           status: 'HIGH',       condition: 'Endometriosis',            confidence: 70, diagnostic: false },

  // Stress / Mood
  { marker: 'cortisol',        status: 'HIGH',       condition: 'Anxiety',                  confidence: 75, diagnostic: false },
  { marker: 'cortisol',        status: 'HIGH',       condition: 'Depression',               confidence: 65, diagnostic: false },

  // Folate / Zinc / Magnesium
  { marker: 'folate',          status: 'LOW',        condition: 'Infertility',              confidence: 75, diagnostic: false },
  { marker: 'folate',          status: 'LOW',        condition: 'Anemia',                   confidence: 65, diagnostic: false },
  { marker: 'zinc',            status: 'LOW',        condition: 'Hair_Loss',                confidence: 75, diagnostic: false },
  { marker: 'zinc',            status: 'LOW',        condition: 'Skin_Issues_Acne',         confidence: 65, diagnostic: false },
  { marker: 'magnesium',       status: 'LOW',        condition: 'Anxiety',                  confidence: 65, diagnostic: false },
  { marker: 'magnesium',       status: 'LOW',        condition: 'Sleep_Disorders',          confidence: 65, diagnostic: false },

  // Potassium / Sodium
  { marker: 'potassium',       status: 'LOW',        condition: 'Hypertension',             confidence: 60, diagnostic: false },
  { marker: 'sodium',          status: 'HIGH',       condition: 'Hypertension',             confidence: 65, diagnostic: false },
];

// Minimum confidence threshold to include a condition
const CONFIDENCE_THRESHOLD = 55;

/**
 * FUNCTION 1: getConditionsFromMarkers
 * Input:  markers object — { vitamin_b12: "LOW", tsh: "HIGH", hemoglobin: "LOW" }
 *         (comes from Gemini lab analysis or manual entry)
 * Output: sorted array of detected conditions with scores
 *
 * Example output:
 * [
 *   { condition: "Anemia",                 confidence: 90, diagnostic: true,  markerCount: 2 },
 *   { condition: "Vitamin_B12_Deficiency", confidence: 95, diagnostic: true,  markerCount: 1 },
 *   { condition: "Hair_Loss",              confidence: 80, diagnostic: false, markerCount: 2 },
 * ]
 */
export function getConditionsFromMarkers(markers) {
  if (!markers || Object.keys(markers).length === 0) return [];

  // Normalise keys to lowercase, trim whitespace
  const normalisedMarkers = {};
  Object.entries(markers).forEach(([key, val]) => {
    normalisedMarkers[key.toLowerCase().trim()] = val?.toString().toUpperCase().trim();
  });

  // Group matches by condition
  const conditionMap = {};

  MARKER_CONDITION_MAP.forEach(({ marker, status, condition, confidence, diagnostic }) => {
    const patientStatus = normalisedMarkers[marker.toLowerCase()];
    if (!patientStatus) return;

    // Normalise status comparison
    const normalised = patientStatus.includes('LOW')        ? 'LOW'
                     : patientStatus.includes('HIGH')       ? 'HIGH'
                     : patientStatus.includes('BORDER')     ? 'BORDERLINE'
                     : patientStatus.includes('OPTIMAL')    ? 'OPTIMAL'
                     : patientStatus;

    if (normalised !== status) return;
    if (confidence < CONFIDENCE_THRESHOLD) return;

    if (!conditionMap[condition]) {
      conditionMap[condition] = { condition, confidence: 0, diagnostic: false, markerCount: 0, matchedMarkers: [] };
    }

    // Take highest confidence across all matching markers
    conditionMap[condition].confidence    = Math.max(conditionMap[condition].confidence, confidence);
    conditionMap[condition].diagnostic    = conditionMap[condition].diagnostic || diagnostic;
    conditionMap[condition].markerCount  += 1;
    conditionMap[condition].matchedMarkers.push(`${marker}:${patientStatus}`);
  });

  return Object.values(conditionMap)
    .sort((a, b) => b.confidence - a.confidence || b.markerCount - a.markerCount);
}


// ============================================================
// SECTION 2: CONDITIONS → TEMPLATES
// ============================================================

/**
 * FUNCTION 2: getTemplatesForConditions
 * Input:  array of condition objects from getConditionsFromMarkers()
 *         + optional patient-declared condition (from patient profile)
 * Output: { primaryTemplate, allTemplates, mergedFoodRules }
 *
 * Priority order:
 *   1. Patient's declared primary condition (from patient record)
 *   2. Diagnostic markers (is_diagnostic = true)
 *   3. Highest confidence conditions
 */
export function getTemplatesForConditions(detectedConditions, patientCondition = null) {
  const templateResults = [];

  // Always include patient's declared condition first
  if (patientCondition) {
    const declared = getTemplate(patientCondition);
    if (declared) {
      templateResults.push({
        template: declared,
        confidence: 100,
        source: 'declared',
      });
    }
  }

  // Add templates for all detected conditions
  detectedConditions.forEach(({ condition, confidence, diagnostic }) => {
    // Skip if already added via declared condition
    if (patientCondition && condition.toLowerCase() === patientCondition.toLowerCase()) return;

    const tmpl = getTemplate(condition);
    if (tmpl) {
      templateResults.push({
        template: tmpl,
        confidence,
        source: diagnostic ? 'diagnostic' : 'marker',
      });
    }
  });

  // Deduplicate by template id
  const seen = new Set();
  const uniqueTemplates = templateResults.filter(({ template }) => {
    if (seen.has(template.id)) return false;
    seen.add(template.id);
    return true;
  });

  const primaryTemplate = uniqueTemplates[0]?.template || getTemplate('Other_Diseases');

  // Merge food rules across all detected templates
  const allFocusTypes = new Set();
  const allAvoidTypes = new Set();

  uniqueTemplates.forEach(({ template }) => {
    template.food_rules.recommended_types.forEach(t => allFocusTypes.add(t));
    template.food_rules.avoid_types.forEach(t => allAvoidTypes.add(t));
  });

  // avoid_types take priority — remove from focus if conflicting
  allAvoidTypes.forEach(t => allFocusTypes.delete(t));

  return {
    primaryTemplate,
    allTemplates: uniqueTemplates,
    mergedFoodRules: {
      focusTypes: [...allFocusTypes],
      avoidTypes: [...allAvoidTypes],
    },
  };
}


// ============================================================
// SECTION 3: FOOD FILTER ENGINE  🔥 CORE BUSINESS LOGIC
// ============================================================

/**
 * FUNCTION 3: filterFoods
 * Input:
 *   foods       — array of food objects from DB / local store
 *   focusTypes  — food types to include (from merged template rules)
 *   avoidTypes  — food types to exclude (from merged template rules)
 *   patient     — { diet_type, allergies[], conditions[] }
 *
 * Output: { recommended: Food[], avoid: Food[], neutral: Food[] }
 *
 * Logic:
 *   INCLUDE if:  food.types overlaps with focusTypes
 *                AND food is not in avoid list for patient's conditions
 *                AND not allergic
 *                AND passes veg/non-veg check
 *
 *   EXCLUDE if:  food.types overlaps with avoidTypes
 *                OR food.avoid_for overlaps with patient conditions
 *                OR patient is allergic
 *                OR veg patient gets non-veg food
 */
export function filterFoods(foods, focusTypes, avoidTypes, patient) {
  if (!foods || foods.length === 0) return { recommended: [], avoid: [], neutral: [] };

  const patientConditions = patient.conditions || [];
  const patientAllergies  = (patient.allergies || []).map(a => a.toLowerCase().trim());
  const isVeg = ['vegetarian', 'vegan'].includes(patient.diet_type?.toLowerCase());
  const isEggetarian = patient.diet_type?.toLowerCase() === 'eggetarian';

  const recommended = [];
  const avoid       = [];
  const neutral     = [];

  foods.forEach(food => {
    const foodTypes     = food.types     || [];
    const beneficialFor = food.beneficial_for || [];
    const avoidFor      = food.avoid_for || [];
    const foodName      = food.name?.toLowerCase() || '';

    // ── EXCLUSION CHECKS ──────────────────────────────────────

    // 1. Veg/non-veg check
    if (isVeg && !food.is_veg) {
      avoid.push({ ...food, reason: 'non_vegetarian' });
      return;
    }

    // 2. Eggetarian — allow eggs, block all other non-veg
    if (isEggetarian && !food.is_veg) {
      const isEgg = foodName.includes('egg');
      if (!isEgg) {
        avoid.push({ ...food, reason: 'non_vegetarian' });
        return;
      }
    }

    // 3. Allergy check
    const isAllergic = patientAllergies.some(allergy =>
      foodName.includes(allergy) || allergy.includes(foodName.split(' ')[0])
    );
    if (isAllergic) {
      avoid.push({ ...food, reason: 'allergy' });
      return;
    }

    // 4. Food is specifically listed to avoid for patient's conditions
    const conditionAvoid = avoidFor.some(c => patientConditions.includes(c));
    if (conditionAvoid) {
      avoid.push({ ...food, reason: 'condition_specific_avoid' });
      return;
    }

    // 5. Food type matches global avoidTypes from template
    const typeAvoid = foodTypes.some(t => avoidTypes.includes(t));
    if (typeAvoid) {
      avoid.push({ ...food, reason: 'food_type_avoid' });
      return;
    }

    // ── INCLUSION CHECKS ─────────────────────────────────────

    // 6. Food type matches focusTypes
    const typeMatch = foodTypes.some(t => focusTypes.includes(t));

    // 7. Food is specifically beneficial for patient's conditions
    const conditionMatch = beneficialFor.some(c => patientConditions.includes(c));

    if (typeMatch || conditionMatch) {
      // Score: how many focus types match + condition match bonus
      const matchScore =
        foodTypes.filter(t => focusTypes.includes(t)).length +
        (conditionMatch ? 2 : 0);

      recommended.push({ ...food, matchScore });
      return;
    }

    // 8. Neither recommended nor avoided — neutral
    neutral.push(food);
  });

  // Sort recommended by relevance score
  recommended.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return { recommended, avoid, neutral };
}


// ============================================================
// SECTION 4: FOODS FROM SUPABASE
// ============================================================

/**
 * Fetch foods from Supabase foods table
 * Falls back to empty array on error — engine still works with local FOOD_DB
 */
export async function fetchFoodsFromDB() {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('id, name, is_veg, nutrients, types, beneficial_for, avoid_for');

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('dietEngine: Could not fetch foods from DB, using local fallback.', err.message);
    return [];
  }
}


// ============================================================
// SECTION 5: BUILD GEMINI PROMPT FROM ENGINE OUTPUT
// ============================================================

/**
 * FUNCTION 4: buildEnrichedPrompt
 * Takes engine output and builds a highly specific Gemini prompt
 * that is pre-filtered and template-guided — much better than raw prompt
 *
 * Input:
 *   patient         — full patient object
 *   detectedConditions — from getConditionsFromMarkers()
 *   primaryTemplate — from getTemplatesForConditions()
 *   recommendedFoods — from filterFoods()
 *   avoidFoods       — from filterFoods()
 *   labMarkers       — raw lab markers array (from Gemini lab analysis)
 *
 * Output: prompt string ready for Gemini generateAIDietPlan()
 */
export function buildEnrichedPrompt(
  patient,
  detectedConditions,
  primaryTemplate,
  recommendedFoods,
  avoidFoods,
  labMarkers = []
) {
  const conditionList = [
    ...(patient.condition ? [patient.condition] : []),
    ...detectedConditions.map(c => `${c.condition} (${c.confidence}% confidence)`),
  ].join(', ') || 'General wellness';

  const labSummary = labMarkers.length > 0
    ? labMarkers.map(m => `${m.marker}: ${m.value} (${m.status})`).join('\n')
    : 'No lab markers available.';

  // Top 20 recommended foods by relevance
  const recommendedList = recommendedFoods
    .slice(0, 20)
    .map(f => f.name)
    .join(', ');

  // All avoid foods
  const avoidList = avoidFoods
    .filter(f => f.reason !== 'non_vegetarian') // already handled by diet type
    .map(f => `${f.name} (${f.reason.replace(/_/g, ' ')})`)
    .join(', ') || 'None specific';

  const strategy   = primaryTemplate.nutrition_strategy;
  const mealPlan   = primaryTemplate.meal_structure;
  const foodRules  = primaryTemplate.food_rules;
  const rules      = primaryTemplate.rules || {};
  const aiNotes    = primaryTemplate.ai_notes || '';

  const mealSlots = mealPlan.meals
    .map(m => `  - ${m.slot}: focus on [${m.types.join(', ')}]`)
    .join('\n');

  const rulesList = Object.entries(rules)
    .filter(([, v]) => v === true)
    .map(([k]) => `  - ${k.replace(/_/g, ' ')}`)
    .join('\n') || '  - None specific';

  return `You are Dr. Raga Deepthi, a specialist in women's health and nutrition at ForHerWellbeing clinic.
Generate a PERSONALIZED 14-day Indian diet plan based on the clinical data below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATIENT PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:            ${patient.name || 'Patient'}
Age:             ${patient.age || 'Unknown'} years
Weight:          ${patient.weight || 'Unknown'} kg
Condition:       ${conditionList}
Diet Type:       ${patient.diet_type || patient.dietType || 'Not specified'}
Food Dislikes:   ${patient.food_dislikes || patient.foodDislikes || 'None'}
Allergies:       ${patient.allergies || 'None'}
Medications:     ${patient.medications || 'None'}
Menstrual:       ${patient.menstrual || 'Not specified'}
Stress:          ${patient.stress || 'Not specified'}
Sleep:           ${patient.sleep || 'Not specified'}
Activity:        ${patient.activity || 'Not specified'}
Budget:          ${patient.budget || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAB RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${labSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLINICAL DIET STRATEGY (from decision engine)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Diet Type:        ${strategy.diet_type}
Fasting Protocol: ${strategy.fasting_protocol}
Focus:            ${foodRules.recommended_types.join(', ')}
Avoid Types:      ${foodRules.avoid_types.join(', ')}

MEAL PATTERN: ${mealPlan.pattern}
${mealSlots}

DIETARY RULES:
${rulesList}

CLINICAL NOTES:
${aiNotes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRE-FILTERED FOOD LISTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED FOODS (use these — already filtered for conditions, diet type, allergies):
${recommendedList || 'Use general Indian whole foods'}

FOODS TO AVOID (already filtered — do NOT include these):
${avoidList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use ONLY the recommended foods list above
- Respect the meal slot types (early morning = detox/light, dinner = light, etc.)
- All foods must be Indian, practical, and affordable
- Include specific quantities (grams, cups, pieces)
- Return ONLY valid JSON — no markdown, no explanation

Return this exact JSON structure:
{
  "planTitle": "string",
  "calorieTarget": "number as string",
  "dietType": "string",
  "duration": "14",
  "detectedConditions": ["condition1", "condition2"],
  "meals": {
    "earlyMorning": { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "breakfast":    { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "midMorning":   { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "lunch":        { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "eveningSnack": { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "dinner":       { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" },
    "bedtime":      { "items": "string", "quantity": "string", "calories": "number as string", "notes": "string" }
  },
  "restrictions": {
    "avoid":       "string",
    "recommended": "string",
    "lifestyle":   "string",
    "water":       "string",
    "exercise":    "string"
  },
  "doctorNotes": "string"
}`;
}


// ============================================================
// SECTION 6: MASTER PIPELINE FUNCTION
// The single entry point — call this from CreateDietPlan.js
// ============================================================

/**
 * FUNCTION 5: runDietEngine  (MASTER PIPELINE)
 *
 * Full flow:  markers → conditions → template → foods → enriched prompt
 *
 * Input:
 *   patient    — full patient object from DB
 *   labMarkers — array from analyzeLabReports()
 *               [{ marker: "Hemoglobin", value: "10.2", status: "LOW", significance: "..." }]
 *
 * Output:
 *   {
 *     detectedConditions,   // what the engine found from markers
 *     primaryTemplate,      // the main diet template selected
 *     allTemplates,         // all templates matched
 *     mergedFoodRules,      // combined focus + avoid types
 *     recommendedFoods,     // foods to use
 *     avoidFoods,           // foods to exclude
 *     enrichedPrompt,       // ready to send to Gemini
 *     engineSummary         // human-readable summary for UI
 *   }
 */
export async function runDietEngine(patient, labMarkers = []) {

  // ── STEP 1: Convert lab markers array → simple { marker: STATUS } object ──
  const markerObject = {};
  labMarkers.forEach(({ marker, status }) => {
    if (marker && status) {
      markerObject[marker.toLowerCase().replace(/\s+/g, '_')] = status.toUpperCase();
    }
  });

  // ── STEP 2: Detect conditions from markers ────────────────────────────────
  const detectedConditions = getConditionsFromMarkers(markerObject);

  // ── STEP 3: Get templates and merge food rules ────────────────────────────
  const { primaryTemplate, allTemplates, mergedFoodRules } =
    getTemplatesForConditions(detectedConditions, patient.condition);

  const { focusTypes, avoidTypes } = mergedFoodRules;

  // ── STEP 4: Fetch foods from DB (with local fallback) ─────────────────────
  const allFoods = await fetchFoodsFromDB();

  // ── STEP 5: Filter foods through the engine ───────────────────────────────
  const patientForFilter = {
    ...patient,
    conditions: [
      ...(patient.condition ? [patient.condition] : []),
      ...detectedConditions.map(c => c.condition),
    ],
    allergies: Array.isArray(patient.allergies)
      ? patient.allergies
      : (patient.allergies || '').split(',').map(a => a.trim()).filter(Boolean),
  };

  const { recommended: recommendedFoods, avoid: avoidFoods, neutral: neutralFoods } =
    filterFoods(allFoods, focusTypes, avoidTypes, patientForFilter);

  // ── STEP 6: Build enriched Gemini prompt ─────────────────────────────────
  const enrichedPrompt = buildEnrichedPrompt(
    patient,
    detectedConditions,
    primaryTemplate,
    recommendedFoods,
    avoidFoods,
    labMarkers,
  );

  // ── STEP 7: Build human-readable summary for UI ───────────────────────────
  const engineSummary = {
    conditionsDetected: detectedConditions.length,
    primaryCondition:   primaryTemplate.condition,
    dietStrategy:       primaryTemplate.nutrition_strategy.diet_type,
    fastingProtocol:    primaryTemplate.nutrition_strategy.fasting_protocol,
    mealPattern:        primaryTemplate.meal_structure.pattern,
    foodsRecommended:   recommendedFoods.length,
    foodsAvoided:       avoidFoods.length,
    topConditions:      detectedConditions.slice(0, 3).map(c =>
                          `${c.condition} (${c.confidence}%)`),
  };

  return {
    detectedConditions,
    primaryTemplate,
    allTemplates,
    mergedFoodRules,
    recommendedFoods,
    avoidFoods,
    neutralFoods,
    enrichedPrompt,
    engineSummary,
  };
}
