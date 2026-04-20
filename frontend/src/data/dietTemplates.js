// ============================================================
// DIET TEMPLATES — Clinical Nutrition Templates for Women's Health
// Format: Structured templates with food TYPES (not actual foods)
// Context: Indian diet, medically reviewed, AI-generation ready
// ============================================================

export const DIET_TEMPLATES = [

  // ─────────────────────────────────────────
  // 1. PCOS
  // ─────────────────────────────────────────
  {
    id: "PCOS_v1",
    condition: "PCOS",

    goals: [
      "reduce_insulin_resistance",
      "balance_androgens",
      "regulate_menstrual_cycle",
      "reduce_inflammation",
      "support_healthy_weight"
    ],

    nutrition_strategy: {
      diet_type: "low_gi_high_protein",
      fasting_protocol: "12:12",
      focus_types: ["low_gi", "high_protein", "anti_inflammatory", "fiber_rich", "omega3_rich"]
    },

    food_rules: {
      recommended_types: ["low_gi", "high_protein", "fiber_rich", "anti_inflammatory", "omega3_rich", "zinc_rich", "magnesium_rich", "phytoestrogen"],
      avoid_types: ["high_gi", "refined_carbs", "high_sugar", "processed_food", "excess_dairy", "trans_fat"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "anti_inflammatory"] },
        { slot: "Breakfast",     types: ["low_gi", "high_protein", "fiber_rich"] },
        { slot: "Mid Morning",   types: ["anti_inflammatory", "zinc_rich"] },
        { slot: "Lunch",         types: ["low_gi", "high_protein", "fiber_rich", "balanced"] },
        { slot: "Evening Snack", types: ["anti_inflammatory", "low_gi"] },
        { slot: "Dinner",        types: ["high_protein", "low_gi", "gut_friendly"] }
      ]
    },

    rules: {
      early_dinner: true,
      no_skipping_meals: true,
      avoid_late_night_eating: true,
      spearmint_tea_recommended: true
    },

    ai_notes: "Prioritise low-GI millets (jowar, bajra, ragi) over rice and maida. Include spearmint tea as anti-androgen. Ensure protein at every meal for satiety. Use seed cycling: flax and pumpkin in follicular phase, sesame and sunflower in luteal phase. Indian context: replace rice with millets, include curd for gut health."
  },

  // ─────────────────────────────────────────
  // 2. THYROID — HYPOTHYROIDISM
  // ─────────────────────────────────────────
  {
    id: "Thyroid_Hypo_v1",
    condition: "Thyroid_Hypo",

    goals: [
      "support_thyroid_hormone_production",
      "improve_metabolism_and_energy",
      "reduce_fatigue",
      "optimise_selenium_and_iodine",
      "prevent_weight_gain"
    ],

    nutrition_strategy: {
      diet_type: "selenium_iodine_balanced",
      fasting_protocol: "none",
      focus_types: ["selenium_rich", "iodine_rich", "iron_rich", "zinc_rich", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["selenium_rich", "iodine_rich", "iron_rich", "zinc_rich", "high_protein", "fiber_rich", "gut_friendly"],
      avoid_types: ["raw_goitrogenic", "excess_soy", "gluten_heavy", "high_sugar", "refined_carbs", "alcohol"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox"] },
        { slot: "Breakfast",     types: ["selenium_rich", "iodine_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["zinc_rich", "fiber_rich"] },
        { slot: "Lunch",         types: ["balanced", "iron_rich", "fiber_rich"] },
        { slot: "Evening Snack", types: ["gut_friendly", "selenium_rich"] },
        { slot: "Dinner",        types: ["light_meal", "high_protein", "selenium_rich"] }
      ]
    },

    rules: {
      medication_on_empty_stomach: true,
      breakfast_30min_after_medication: true,
      avoid_soy_near_medication: true,
      cook_cruciferous_vegetables: true,
      early_dinner: true
    },

    ai_notes: "Thyroid medication must be taken 30-45 min before breakfast on empty stomach. Cook cruciferous vegetables to reduce goitrogens. Prioritise selenium through Brazil nuts, eggs, and fish. Iodine via iodised salt in moderation. Indian context: ragi, moringa, sesame seeds are excellent. Schedule soy away from medication time."
  },

  // ─────────────────────────────────────────
  // 3. THYROID — HYPERTHYROIDISM
  // ─────────────────────────────────────────
  {
    id: "Thyroid_Hyper_v1",
    condition: "Thyroid_Hyper",

    goals: [
      "suppress_overactive_thyroid_naturally",
      "prevent_muscle_and_weight_loss",
      "protect_bone_density",
      "reduce_oxidative_stress",
      "calm_nervous_system"
    ],

    nutrition_strategy: {
      diet_type: "calorie_dense_anti_inflammatory",
      fasting_protocol: "none",
      focus_types: ["calorie_dense", "calcium_rich", "antioxidant_rich", "calming", "goitrogenic_cooked"]
    },

    food_rules: {
      recommended_types: ["calorie_dense", "calcium_rich", "antioxidant_rich", "magnesium_rich", "high_protein", "goitrogenic_cooked", "vitamin_k2_rich"],
      avoid_types: ["iodine_rich", "high_caffeine", "high_stimulant", "alcohol", "high_sugar", "spicy"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["calming", "calorie_dense"] },
        { slot: "Breakfast",     types: ["calorie_dense", "calcium_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["calorie_dense", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["calorie_dense", "balanced", "calcium_rich"] },
        { slot: "Evening Snack", types: ["calorie_dense", "high_protein"] },
        { slot: "Dinner",        types: ["balanced", "high_protein", "calming"] }
      ]
    },

    rules: {
      high_calorie_needed: true,
      no_fasting: true,
      avoid_iodine_rich_foods: true,
      small_frequent_meals: true,
      avoid_stimulants: true
    },

    ai_notes: "Patient has elevated metabolic rate — calorie intake must be higher to prevent muscle wasting. Include cooked cruciferous vegetables for goitrogenic effect on overactive thyroid. Avoid seafood and excess iodised salt. Indian context: millets, paneer, coconut-based dishes. Keep all meals calming and stimulant-free."
  },

  // ─────────────────────────────────────────
  // 4. DIABETES TYPE 2
  // ─────────────────────────────────────────
  {
    id: "Diabetes_Type2_v1",
    condition: "Diabetes_Type2",

    goals: [
      "control_fasting_and_postmeal_glucose",
      "reduce_hba1c",
      "improve_insulin_sensitivity",
      "prevent_diabetic_complications",
      "maintain_healthy_weight"
    ],

    nutrition_strategy: {
      diet_type: "low_gi_high_fiber",
      fasting_protocol: "12:12",
      focus_types: ["low_gi", "fiber_rich", "high_protein", "complex_carbs", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["low_gi", "fiber_rich", "high_protein", "complex_carbs", "magnesium_rich", "chromium_rich", "anti_inflammatory"],
      avoid_types: ["high_gi", "high_sugar", "refined_carbs", "sugary_beverages", "processed_food", "fried", "trans_fat"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "blood_sugar_stabilising"] },
        { slot: "Breakfast",     types: ["low_gi", "high_protein", "fiber_rich"] },
        { slot: "Mid Morning",   types: ["low_gi", "high_protein"] },
        { slot: "Lunch",         types: ["low_gi", "fiber_rich", "balanced"] },
        { slot: "Evening Snack", types: ["low_gi", "high_protein"] },
        { slot: "Dinner",        types: ["low_gi", "light_meal", "high_protein"] }
      ]
    },

    rules: {
      no_skipping_meals: true,
      evenly_spaced_meals: true,
      early_dinner: true,
      avoid_fruit_juices: true,
      portion_control: true
    },

    ai_notes: "Every meal must be low GI. Use the plate method: 50% non-starchy vegetables, 25% protein, 25% complex carbs. Replace rice with millets (foxtail, barnyard). Include methi (fenugreek) regularly — proven hypoglycaemic effect. Include bitter gourd, amla, and cinnamon. Meals evenly spaced every 2-3 hours. Never skip meals."
  },

  // ─────────────────────────────────────────
  // 5. PRE-DIABETES
  // ─────────────────────────────────────────
  {
    id: "PreDiabetes_v1",
    condition: "PreDiabetes",

    goals: [
      "reverse_prediabetic_state",
      "improve_insulin_sensitivity",
      "achieve_5_to_7_percent_weight_loss",
      "stabilise_blood_sugar",
      "prevent_progression_to_type2"
    ],

    nutrition_strategy: {
      diet_type: "low_gi_moderate_carb",
      fasting_protocol: "14:10",
      focus_types: ["low_gi", "fiber_rich", "high_protein", "anti_inflammatory", "complex_carbs"]
    },

    food_rules: {
      recommended_types: ["low_gi", "fiber_rich", "high_protein", "complex_carbs", "magnesium_rich", "antioxidant_rich"],
      avoid_types: ["high_gi", "high_sugar", "sugary_beverages", "refined_carbs", "trans_fat", "processed_food"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "blood_sugar_stabilising"] },
        { slot: "Breakfast",     types: ["low_gi", "fiber_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["low_gi", "fiber_rich"] },
        { slot: "Lunch",         types: ["low_gi", "balanced", "fiber_rich"] },
        { slot: "Evening Snack", types: ["low_gi", "high_protein"] },
        { slot: "Dinner",        types: ["low_gi", "light_meal", "high_protein"] }
      ]
    },

    rules: {
      no_skipping_meals: true,
      early_dinner: true,
      avoid_late_night_eating: true,
      portion_control: true
    },

    ai_notes: "Pre-diabetes is reversible — use diet as primary intervention. Include soaked methi seeds water in morning. Replace all refined grains with millets. Use amla or vinegar in meals to lower glycaemic response. Indian context: dal, sabzi, and small millet roti with curd is ideal. Avoid packaged and processed snacks entirely."
  },

  // ─────────────────────────────────────────
  // 6. HYPERTENSION
  // ─────────────────────────────────────────
  {
    id: "Hypertension_v1",
    condition: "Hypertension",

    goals: [
      "lower_systolic_and_diastolic_bp",
      "reduce_sodium_intake",
      "increase_potassium_magnesium_calcium",
      "improve_cardiovascular_health",
      "manage_stress_eating"
    ],

    nutrition_strategy: {
      diet_type: "dash_diet",
      fasting_protocol: "12:12",
      focus_types: ["low_sodium", "potassium_rich", "magnesium_rich", "fiber_rich", "omega3_rich"]
    },

    food_rules: {
      recommended_types: ["low_sodium", "potassium_rich", "magnesium_rich", "calcium_rich", "fiber_rich", "omega3_rich", "nitric_oxide_boosting"],
      avoid_types: ["high_sodium", "pickled", "processed_food", "high_saturated_fat", "alcohol", "excess_caffeine"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "potassium_rich"] },
        { slot: "Breakfast",     types: ["potassium_rich", "fiber_rich", "calcium_rich"] },
        { slot: "Mid Morning",   types: ["potassium_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["low_sodium", "balanced", "fiber_rich"] },
        { slot: "Evening Snack", types: ["low_sodium", "magnesium_rich"] },
        { slot: "Dinner",        types: ["low_sodium", "light_meal", "omega3_rich"] }
      ]
    },

    rules: {
      sodium_limit_1500mg: true,
      no_added_table_salt: true,
      avoid_pickles_and_papads: true,
      early_dinner: true,
      avoid_alcohol: true
    },

    ai_notes: "Strictly limit sodium to under 1500mg/day. Indian diet is high in sodium — avoid pickles, papads, salted snacks. Include beetroot, banana, sweet potato for potassium. Use herbs and spices instead of salt for flavour. Include garlic regularly as a vasodilator. Coconut water as a snack is excellent. Avoid pressure-cooker overcooking that leaches minerals."
  },

  // ─────────────────────────────────────────
  // 7. OBESITY
  // ─────────────────────────────────────────
  {
    id: "Obesity_v1",
    condition: "Obesity",

    goals: [
      "achieve_sustainable_caloric_deficit",
      "preserve_lean_muscle_mass",
      "improve_metabolic_health",
      "reduce_visceral_fat",
      "build_long_term_healthy_habits"
    ],

    nutrition_strategy: {
      diet_type: "high_protein_low_calorie",
      fasting_protocol: "16:8",
      focus_types: ["high_protein", "fiber_rich", "low_calorie", "low_gi", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["high_protein", "fiber_rich", "low_calorie", "low_gi", "complex_carbs", "gut_friendly"],
      avoid_types: ["high_calorie", "high_sugar", "liquid_calories", "refined_carbs", "fried", "processed_food", "trans_fat"]
    },

    meal_structure: {
      pattern: "3_meals",
      meals: [
        { slot: "Breakfast",     types: ["high_protein", "fiber_rich", "low_calorie"] },
        { slot: "Lunch",         types: ["high_protein", "fiber_rich", "low_gi"] },
        { slot: "Dinner",        types: ["light_meal", "high_protein", "low_calorie"] }
      ]
    },

    rules: {
      no_lunch: false,
      early_dinner: true,
      avoid_liquid_calories: true,
      no_late_night_eating: true,
      portion_control: true
    },

    ai_notes: "Focus on volume eating — large portions of non-starchy vegetables, lean protein, small portions of complex carbs. Include protein at every meal (at least 20-30g). Indian context: dal and sabzi are excellent; limit ghee and rice portions. Include soup as a starter to reduce meal calorie density. Green tea before meals aids satiety."
  },

  // ─────────────────────────────────────────
  // 8. ANEMIA
  // ─────────────────────────────────────────
  {
    id: "Anemia_v1",
    condition: "Anemia",

    goals: [
      "increase_haemoglobin_levels",
      "replenish_iron_stores_ferritin",
      "improve_energy_and_reduce_fatigue",
      "support_rbc_production",
      "enhance_iron_absorption"
    ],

    nutrition_strategy: {
      diet_type: "iron_rich_vitamin_c_paired",
      fasting_protocol: "none",
      focus_types: ["iron_rich", "vitamin_c_rich", "folate_rich", "b12_rich", "high_protein"]
    },

    food_rules: {
      recommended_types: ["iron_rich", "vitamin_c_rich", "folate_rich", "b12_rich", "high_protein", "copper_rich", "gut_friendly"],
      avoid_types: ["tannin_with_meals", "calcium_with_iron_meals", "unfermented_phytate_rich", "alcohol", "processed_food"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["iron_rich", "vitamin_c_rich"] },
        { slot: "Breakfast",     types: ["iron_rich", "b12_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["vitamin_c_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["iron_rich", "folate_rich", "balanced"] },
        { slot: "Evening Snack", types: ["iron_rich", "vitamin_c_rich"] },
        { slot: "Dinner",        types: ["iron_rich", "b12_rich", "light_meal"] }
      ]
    },

    rules: {
      pair_iron_with_vitamin_c: true,
      avoid_tea_coffee_with_meals: true,
      soak_and_sprout_legumes: true,
      no_calcium_supplements_at_meal_time: true
    },

    ai_notes: "Always pair iron-rich foods with Vitamin C to maximise absorption. Indian context: dal with amla chutney, poha with lemon, palak with tomato. Ragi is excellent non-heme iron source. For B12 anemia include eggs and dairy; for vegans supplementation is mandatory. Avoid tea/coffee within 1 hour of meals. Soak and sprout legumes to reduce phytates."
  },

  // ─────────────────────────────────────────
  // 9. VITAMIN D DEFICIENCY
  // ─────────────────────────────────────────
  {
    id: "Vitamin_D_Deficiency_v1",
    condition: "Vitamin_D_Deficiency",

    goals: [
      "raise_serum_vitamin_d_to_optimal",
      "support_calcium_absorption_for_bones",
      "improve_immune_function_and_mood",
      "reduce_muscle_pain_and_weakness",
      "prevent_osteoporosis"
    ],

    nutrition_strategy: {
      diet_type: "fat_soluble_vitamin_optimised",
      fasting_protocol: "12:12",
      focus_types: ["vitamin_d_rich", "calcium_rich", "magnesium_rich", "healthy_fat", "vitamin_k2_rich"]
    },

    food_rules: {
      recommended_types: ["vitamin_d_rich", "calcium_rich", "magnesium_rich", "healthy_fat", "vitamin_k2_rich", "zinc_rich"],
      avoid_types: ["very_low_fat", "excess_phosphate", "alcohol", "high_sugar", "processed_food"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["vitamin_d_rich", "calcium_rich", "healthy_fat"] },
        { slot: "Mid Morning",   types: ["calcium_rich", "magnesium_rich"] },
        { slot: "Lunch",         types: ["vitamin_d_rich", "balanced", "healthy_fat"] },
        { slot: "Dinner",        types: ["vitamin_d_rich", "calcium_rich", "light_meal"] }
      ]
    },

    rules: {
      include_healthy_fat_with_meals: true,
      sunlight_exposure_recommended: true,
      supplement_required: true,
      avoid_very_low_fat_diet: true
    },

    ai_notes: "Dietary Vitamin D is limited — sunlight (15-20 min daily) and supplementation are primary. Include eggs, fatty fish (if non-veg), fortified milk, sunlight-exposed mushrooms. Indian context: fortified atta and milk available. Include ghee and nuts for fat-soluble absorption. Magnesium must be adequate (pumpkin seeds, spinach, dark chocolate) to activate Vitamin D."
  },

  // ─────────────────────────────────────────
  // 10. VITAMIN B12 DEFICIENCY
  // ─────────────────────────────────────────
  {
    id: "Vitamin_B12_Deficiency_v1",
    condition: "Vitamin_B12_Deficiency",

    goals: [
      "replenish_b12_levels",
      "reverse_neurological_symptoms",
      "prevent_megaloblastic_anaemia",
      "improve_energy_and_cognition",
      "support_nerve_myelin_repair"
    ],

    nutrition_strategy: {
      diet_type: "b12_focused_high_protein",
      fasting_protocol: "none",
      focus_types: ["b12_rich", "folate_rich", "high_protein", "iron_rich", "gut_friendly"]
    },

    food_rules: {
      recommended_types: ["b12_rich", "folate_rich", "iron_rich", "high_protein", "probiotic", "gut_friendly"],
      avoid_types: ["alcohol", "long_term_antacids", "refined_carbs", "processed_food"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["b12_rich", "high_protein", "iron_rich"] },
        { slot: "Mid Morning",   types: ["b12_rich", "gut_friendly"] },
        { slot: "Lunch",         types: ["b12_rich", "folate_rich", "balanced"] },
        { slot: "Dinner",        types: ["b12_rich", "high_protein", "light_meal"] }
      ]
    },

    rules: {
      supplement_required_for_vegans: true,
      include_fermented_foods_daily: true,
      avoid_alcohol: true,
      gut_health_priority: true
    },

    ai_notes: "B12 found almost exclusively in animal products. For vegetarians: emphasise dairy and eggs heavily; for vegans, supplementation is mandatory. Include fermented foods (idli, dosa, curd) to improve gut health and absorption. Indian context: curd, paneer, and eggs are daily necessities for this condition. Include amla for improved absorption synergy."
  },

  // ─────────────────────────────────────────
  // 11. HIGH CHOLESTEROL
  // ─────────────────────────────────────────
  {
    id: "Cholesterol_High_v1",
    condition: "Cholesterol_High",

    goals: [
      "reduce_ldl_cholesterol",
      "increase_hdl_cholesterol",
      "lower_triglycerides",
      "reduce_cardiovascular_risk",
      "support_liver_lipid_metabolism"
    ],

    nutrition_strategy: {
      diet_type: "mediterranean_low_saturated_fat",
      fasting_protocol: "14:10",
      focus_types: ["fiber_rich", "omega3_rich", "plant_sterol", "antioxidant_rich", "unsaturated_fat"]
    },

    food_rules: {
      recommended_types: ["fiber_rich", "omega3_rich", "plant_sterol", "antioxidant_rich", "unsaturated_fat", "gut_friendly"],
      avoid_types: ["high_saturated_fat", "trans_fat", "high_cholesterol_food", "high_sugar", "refined_carbs", "fried", "alcohol"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["fiber_rich", "omega3_rich", "antioxidant_rich"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "plant_sterol"] },
        { slot: "Lunch",         types: ["fiber_rich", "low_saturated_fat", "balanced"] },
        { slot: "Dinner",        types: ["light_meal", "fiber_rich", "omega3_rich"] }
      ]
    },

    rules: {
      avoid_vanaspati_completely: true,
      replace_ghee_with_plant_oils: true,
      include_garlic_daily: true,
      early_dinner: true
    },

    ai_notes: "Oats and oat bran are highly effective via beta-glucan. Include walnuts, flaxseeds, and fatty fish (or flax for vegetarians). Indian context: use mustard or sesame oil instead of excess ghee; include fenugreek daily. Garlic is cardioprotective. Reduce red meat and full-fat paneer. Barley, chickpeas, and lentils provide soluble fibre. Avoid vanaspati completely."
  },

  // ─────────────────────────────────────────
  // 12. FATTY LIVER (NAFLD)
  // ─────────────────────────────────────────
  {
    id: "Fatty_Liver_v1",
    condition: "Fatty_Liver",

    goals: [
      "reduce_hepatic_fat_accumulation",
      "improve_liver_enzymes_alt_ast",
      "reverse_insulin_resistance",
      "support_liver_detoxification",
      "achieve_gradual_weight_loss"
    ],

    nutrition_strategy: {
      diet_type: "low_fructose_low_fat",
      fasting_protocol: "16:8",
      focus_types: ["low_fructose", "choline_rich", "antioxidant_rich", "fiber_rich", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["choline_rich", "antioxidant_rich", "fiber_rich", "omega3_rich", "low_fructose", "liver_supportive"],
      avoid_types: ["alcohol", "high_fructose", "high_saturated_fat", "trans_fat", "refined_carbs", "high_sugar", "fruit_juices"]
    },

    meal_structure: {
      pattern: "3_meals",
      meals: [
        { slot: "Breakfast",     types: ["choline_rich", "fiber_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["low_fructose", "fiber_rich", "balanced"] },
        { slot: "Dinner",        types: ["light_meal", "choline_rich", "low_fat"] }
      ]
    },

    rules: {
      avoid_all_alcohol: true,
      avoid_fruit_juices: true,
      no_late_night_eating: true,
      early_dinner: true,
      coffee_without_sugar_beneficial: true
    },

    ai_notes: "Avoid all sugary drinks including fruit juices — fructose directly converts to liver fat. Coffee without sugar is clinically beneficial for NAFLD. Include turmeric and dandelion. Indian context: bitter gourd, moringa (drumstick), and bottle gourd are liver-supportive. Limit ghee, fried snacks, and sweets. Mediterranean-style diet is most evidence-based for NAFLD."
  },

  // ─────────────────────────────────────────
  // 13. GASTRITIS
  // ─────────────────────────────────────────
  {
    id: "Gastritis_v1",
    condition: "Gastritis",

    goals: [
      "reduce_gastric_inflammation",
      "promote_stomach_lining_healing",
      "manage_bloating_nausea_pain",
      "restore_gut_microbiome",
      "eliminate_h_pylori_dietary_risks"
    ],

    nutrition_strategy: {
      diet_type: "soft_bland_probiotic",
      fasting_protocol: "none",
      focus_types: ["gut_friendly", "gut_soothing", "probiotic", "low_acid", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["gut_friendly", "gut_soothing", "probiotic", "low_acid", "anti_inflammatory", "zinc_rich", "light_meal"],
      avoid_types: ["spicy", "acidic", "high_caffeine", "alcohol", "fried", "high_fat", "carbonated"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["gut_soothing"] },
        { slot: "Breakfast",     types: ["gut_friendly", "probiotic", "light_meal"] },
        { slot: "Mid Morning",   types: ["gut_soothing", "low_acid"] },
        { slot: "Lunch",         types: ["gut_friendly", "balanced", "low_acid"] },
        { slot: "Evening Snack", types: ["gut_soothing", "low_acid"] },
        { slot: "Dinner",        types: ["light_meal", "gut_friendly", "low_acid"] }
      ]
    },

    rules: {
      small_frequent_meals: true,
      no_large_meal_gaps: true,
      avoid_empty_stomach: true,
      no_spicy_food: true,
      no_skipping_meals: true
    },

    ai_notes: "Small and frequent meals every 2-3 hours are essential. Empty stomach worsens gastritis. Include curd, coconut water, and buttermilk. Indian context: prefer idli, soft khichdi, banana, and boiled vegetables. Avoid masala, pickles, and street food completely. Cabbage juice has clinical evidence for gastric ulcer healing."
  },

  // ─────────────────────────────────────────
  // 14. IBS (IRRITABLE BOWEL SYNDROME)
  // ─────────────────────────────────────────
  {
    id: "IBS_v1",
    condition: "IBS",

    goals: [
      "reduce_bloating_cramping_irregular_bowel",
      "identify_personal_trigger_foods",
      "restore_gut_microbiome",
      "reduce_visceral_hypersensitivity",
      "improve_quality_of_life"
    ],

    nutrition_strategy: {
      diet_type: "low_fodmap",
      fasting_protocol: "none",
      focus_types: ["low_fodmap", "soluble_fiber", "probiotic", "gut_soothing", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["low_fodmap", "probiotic", "soluble_fiber", "gut_friendly", "gut_soothing", "anti_inflammatory"],
      avoid_types: ["high_fodmap", "lactose_rich", "carbonated", "high_caffeine", "alcohol", "artificial_sweetener", "fried"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["gut_soothing"] },
        { slot: "Breakfast",     types: ["low_fodmap", "probiotic", "soluble_fiber"] },
        { slot: "Mid Morning",   types: ["low_fodmap", "gut_soothing"] },
        { slot: "Lunch",         types: ["low_fodmap", "balanced", "probiotic"] },
        { slot: "Evening Snack", types: ["low_fodmap", "soluble_fiber"] },
        { slot: "Dinner",        types: ["low_fodmap", "light_meal", "gut_friendly"] }
      ]
    },

    rules: {
      small_frequent_meals: true,
      avoid_onion_garlic: true,
      use_asafoetida_as_substitute: true,
      individualise_trigger_foods: true
    },

    ai_notes: "IBS is highly individual — adapt based on IBS-D vs IBS-C subtype. Low-FODMAP is a 3-phase protocol. Indian context: curd is generally tolerated; use hing (asafoetida) instead of onion and garlic. Isabgol (psyllium husk) is effective for both subtypes. Peppermint tea has antispasmodic properties. Warm meals over cold."
  },

  // ─────────────────────────────────────────
  // 15. ACIDITY / GERD
  // ─────────────────────────────────────────
  {
    id: "Acidity_v1",
    condition: "Acidity",

    goals: [
      "reduce_gastric_acid_and_reflux",
      "heal_esophageal_irritation",
      "manage_heartburn_and_bloating",
      "identify_personal_trigger_foods",
      "support_lower_esophageal_sphincter"
    ],

    nutrition_strategy: {
      diet_type: "alkaline_low_acid",
      fasting_protocol: "none",
      focus_types: ["alkaline", "low_acid", "fiber_rich", "gut_soothing", "light_meal"]
    },

    food_rules: {
      recommended_types: ["alkaline", "low_acid", "fiber_rich", "gut_soothing", "calcium_rich", "non_spicy"],
      avoid_types: ["acidic", "spicy", "high_caffeine", "carbonated", "chocolate", "high_fat", "fried", "peppermint_oil"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["alkaline"] },
        { slot: "Breakfast",     types: ["alkaline", "low_acid", "light_meal"] },
        { slot: "Mid Morning",   types: ["alkaline", "low_acid"] },
        { slot: "Lunch",         types: ["low_acid", "balanced", "fiber_rich"] },
        { slot: "Evening Snack", types: ["alkaline", "low_acid"] },
        { slot: "Dinner",        types: ["light_meal", "low_acid", "alkaline"] }
      ]
    },

    rules: {
      max_2hr_gap_between_meals: true,
      dinner_3hr_before_sleep: true,
      no_lying_down_after_eating: true,
      no_tea_on_empty_stomach: true,
      small_frequent_meals: true
    },

    ai_notes: "Never allow gap over 2-3 hours between meals. Dinner at least 3 hours before bedtime. Indian context: coconut water, banana, cold buttermilk are soothing. Jeera (cumin) water is helpful. Avoid tea on empty stomach — most common Indian trigger. Include oatmeal, cucumber, and watermelon. Elevate head of bed by 6-8 inches for night reflux."
  },

  // ─────────────────────────────────────────
  // 16. CONSTIPATION
  // ─────────────────────────────────────────
  {
    id: "Constipation_v1",
    condition: "Constipation",

    goals: [
      "achieve_regular_daily_bowel_movements",
      "increase_dietary_fiber_to_25_35g",
      "improve_hydration",
      "restore_gut_motility",
      "reduce_straining_and_complications"
    ],

    nutrition_strategy: {
      diet_type: "high_fiber_hydration_focused",
      fasting_protocol: "12:12",
      focus_types: ["fiber_rich", "natural_laxative", "hydrating", "probiotic", "magnesium_rich"]
    },

    food_rules: {
      recommended_types: ["fiber_rich", "natural_laxative", "hydrating", "probiotic", "gut_friendly", "magnesium_rich", "whole_grain"],
      avoid_types: ["low_fiber", "refined_carbs", "dehydrating", "processed_food", "excess_dairy", "fried"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["natural_laxative", "hydrating"] },
        { slot: "Breakfast",     types: ["fiber_rich", "probiotic", "hydrating"] },
        { slot: "Mid Morning",   types: ["fiber_rich", "hydrating"] },
        { slot: "Lunch",         types: ["fiber_rich", "balanced", "gut_friendly"] },
        { slot: "Evening Snack", types: ["fiber_rich", "natural_laxative"] },
        { slot: "Dinner",        types: ["fiber_rich", "light_meal", "gut_friendly"] }
      ]
    },

    rules: {
      minimum_2_5L_water_daily: true,
      warm_water_morning: true,
      increase_fiber_gradually: true,
      isabgol_at_bedtime: true
    },

    ai_notes: "Start mornings with warm water and soaked raisins or prunes. Include isabgol (psyllium husk) in warm water at bedtime. Indian context: papaya, ripe banana, guava with seeds, bottle gourd, and drumstick leaves are excellent. Curd and buttermilk add probiotics. Include plenty of dal and sabzi. Increase fibre gradually to avoid bloating. Ground flaxseed (1 tbsp/day) is highly effective."
  },

  // ─────────────────────────────────────────
  // 17. INFERTILITY
  // ─────────────────────────────────────────
  {
    id: "Infertility_v1",
    condition: "Infertility",

    goals: [
      "optimise_reproductive_hormone_balance",
      "improve_egg_quality",
      "reduce_oxidative_stress_on_gametes",
      "support_healthy_bmi_for_conception",
      "prepare_uterine_environment"
    ],

    nutrition_strategy: {
      diet_type: "fertility_mediterranean",
      fasting_protocol: "none",
      focus_types: ["folate_rich", "antioxidant_rich", "omega3_rich", "zinc_rich", "iron_rich"]
    },

    food_rules: {
      recommended_types: ["folate_rich", "antioxidant_rich", "omega3_rich", "zinc_rich", "iron_rich", "selenium_rich", "high_protein"],
      avoid_types: ["trans_fat", "high_sugar", "alcohol", "excess_caffeine", "refined_carbs", "excess_soy", "processed_food"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "antioxidant_rich"] },
        { slot: "Breakfast",     types: ["folate_rich", "antioxidant_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "zinc_rich"] },
        { slot: "Lunch",         types: ["balanced", "folate_rich", "omega3_rich"] },
        { slot: "Evening Snack", types: ["antioxidant_rich", "selenium_rich"] },
        { slot: "Dinner",        types: ["high_protein", "omega3_rich", "iron_rich"] }
      ]
    },

    rules: {
      start_folate_immediately: true,
      no_alcohol: true,
      avoid_trans_fats: true,
      no_crash_dieting: true,
      warm_foods_preferred: true
    },

    ai_notes: "Start folate (methylfolate preferred) immediately. Include rainbow coloured vegetables for diverse antioxidants. CoQ10 is critical for egg quality. Indian context: moringa (drumstick) leaves are folate-rich. Include sesame, pumpkin, and sunflower seeds. Warm foods over cold; avoid fasting. Mediterranean diet pattern has best evidence for fertility."
  },

  // ─────────────────────────────────────────
  // 18. IRREGULAR PERIODS
  // ─────────────────────────────────────────
  {
    id: "Irregular_Periods_v1",
    condition: "Irregular_Periods",

    goals: [
      "regulate_menstrual_cycle",
      "balance_estrogen_and_progesterone",
      "reduce_period_pain_and_pms",
      "support_hpa_axis",
      "address_nutrient_deficiencies"
    ],

    nutrition_strategy: {
      diet_type: "hormone_balancing",
      fasting_protocol: "12:12",
      focus_types: ["iron_rich", "magnesium_rich", "b_vitamin_rich", "zinc_rich", "phytoestrogen"]
    },

    food_rules: {
      recommended_types: ["iron_rich", "magnesium_rich", "b_vitamin_rich", "zinc_rich", "omega3_rich", "phytoestrogen", "anti_inflammatory"],
      avoid_types: ["high_sugar", "excess_caffeine", "alcohol", "refined_carbs", "trans_fat", "very_low_calorie"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "hormone_balancing"] },
        { slot: "Breakfast",     types: ["iron_rich", "b_vitamin_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["zinc_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["balanced", "iron_rich", "magnesium_rich"] },
        { slot: "Evening Snack", types: ["phytoestrogen", "magnesium_rich"] },
        { slot: "Dinner",        types: ["omega3_rich", "high_protein", "light_meal"] }
      ]
    },

    rules: {
      no_very_low_calorie_diet: true,
      seed_cycling_recommended: true,
      spearmint_tea_recommended: true,
      no_skipping_meals: true
    },

    ai_notes: "Seed cycling protocol: flax and pumpkin seeds in follicular phase, sesame and sunflower seeds in luteal phase. Include iron-rich foods with Vitamin C after periods for replenishment. Indian context: jaggery with sesame is traditional for menstrual support. Never recommend very low calorie — undereating disrupts the cycle. Spearmint tea reduces androgen-related irregularity."
  },

  // ─────────────────────────────────────────
  // 19. ENDOMETRIOSIS
  // ─────────────────────────────────────────
  {
    id: "Endometriosis_v1",
    condition: "Endometriosis",

    goals: [
      "reduce_pelvic_and_systemic_inflammation",
      "lower_prostaglandin_driven_pain",
      "modulate_estrogen_dominance",
      "support_immune_function",
      "improve_quality_of_life_during_menstruation"
    ],

    nutrition_strategy: {
      diet_type: "anti_inflammatory_mediterranean",
      fasting_protocol: "12:12",
      focus_types: ["anti_inflammatory", "omega3_rich", "cruciferous", "fiber_rich", "magnesium_rich"]
    },

    food_rules: {
      recommended_types: ["anti_inflammatory", "omega3_rich", "fiber_rich", "antioxidant_rich", "magnesium_rich", "cruciferous", "iron_rich", "dim_source"],
      avoid_types: ["red_meat", "processed_meat", "trans_fat", "high_sugar", "excess_alcohol", "excess_dairy", "high_arachidonic_acid"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["anti_inflammatory"] },
        { slot: "Breakfast",     types: ["anti_inflammatory", "omega3_rich", "antioxidant_rich"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "fiber_rich"] },
        { slot: "Lunch",         types: ["anti_inflammatory", "fiber_rich", "balanced"] },
        { slot: "Evening Snack", types: ["magnesium_rich", "antioxidant_rich"] },
        { slot: "Dinner",        types: ["anti_inflammatory", "omega3_rich", "light_meal"] }
      ]
    },

    rules: {
      avoid_red_meat: true,
      include_cruciferous_daily: true,
      warm_meals_during_period: true,
      turmeric_daily: true,
      early_dinner: true
    },

    ai_notes: "Cruciferous vegetables (broccoli, cauliflower, cabbage) contain DIM which metabolises excess estrogen. Indian context: include haldi (turmeric) daily, ginger for pain relief. Flaxseeds help with estrogen balance. Replace red meat with fish, tofu, or lentils. Period pain meals should be warm, anti-inflammatory, and magnesium-rich."
  },

  // ─────────────────────────────────────────
  // 20. FIBROIDS (UTERINE FIBROIDS)
  // ─────────────────────────────────────────
  {
    id: "Fibroids_v1",
    condition: "Fibroids",

    goals: [
      "reduce_estrogen_dominance",
      "support_liver_estrogen_detox",
      "reduce_inflammation",
      "manage_heavy_menstrual_bleeding_anaemia",
      "support_uterine_health"
    ],

    nutrition_strategy: {
      diet_type: "estrogen_detox_high_fiber",
      fasting_protocol: "12:12",
      focus_types: ["cruciferous", "fiber_rich", "iron_rich", "anti_inflammatory", "liver_supportive"]
    },

    food_rules: {
      recommended_types: ["iron_rich", "fiber_rich", "cruciferous", "dim_source", "anti_inflammatory", "omega3_rich", "liver_supportive", "vitamin_c_rich"],
      avoid_types: ["excess_alcohol", "excess_red_meat", "refined_carbs", "high_sugar", "hormone_dairy", "processed_food"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox", "liver_supportive"] },
        { slot: "Breakfast",     types: ["iron_rich", "fiber_rich", "antioxidant_rich"] },
        { slot: "Mid Morning",   types: ["vitamin_c_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["balanced", "fiber_rich", "cruciferous"] },
        { slot: "Evening Snack", types: ["fiber_rich", "anti_inflammatory"] },
        { slot: "Dinner",        types: ["iron_rich", "light_meal", "anti_inflammatory"] }
      ]
    },

    rules: {
      include_cruciferous_daily: true,
      avoid_alcohol: true,
      address_anaemia: true,
      ground_flaxseed_daily: true
    },

    ai_notes: "Fibroids are estrogen-sensitive — estrogen detox through diet is key. Include broccoli, cabbage, cauliflower for DIM. Indian context: methi and haldi are beneficial. Address anaemia from heavy periods with iron-rich foods. Include beetroot and dandelion leaf for liver support. Ground flaxseeds excellent (fibre + lignans for estrogen modulation)."
  },

  // ─────────────────────────────────────────
  // 21. MENOPAUSE
  // ─────────────────────────────────────────
  {
    id: "Menopause_v1",
    condition: "Menopause",

    goals: [
      "manage_hot_flashes_through_diet",
      "protect_bone_density",
      "support_cardiovascular_health",
      "stabilise_mood_and_reduce_anxiety",
      "manage_weight_redistribution"
    ],

    nutrition_strategy: {
      diet_type: "phytoestrogen_rich_bone_supportive",
      fasting_protocol: "12:12",
      focus_types: ["phytoestrogen", "calcium_rich", "omega3_rich", "antioxidant_rich", "magnesium_rich"]
    },

    food_rules: {
      recommended_types: ["calcium_rich", "phytoestrogen", "omega3_rich", "magnesium_rich", "antioxidant_rich", "high_protein", "fiber_rich", "vitamin_k2_rich"],
      avoid_types: ["spicy", "high_caffeine", "alcohol", "high_sodium", "high_sugar", "high_saturated_fat"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["phytoestrogen", "detox"] },
        { slot: "Breakfast",     types: ["calcium_rich", "phytoestrogen", "high_protein"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "calcium_rich"] },
        { slot: "Lunch",         types: ["balanced", "calcium_rich", "omega3_rich"] },
        { slot: "Evening Snack", types: ["phytoestrogen", "magnesium_rich"] },
        { slot: "Dinner",        types: ["light_meal", "high_protein", "calcium_rich"] }
      ]
    },

    rules: {
      avoid_spicy_foods: true,
      avoid_hot_beverages: true,
      early_dinner: true,
      no_eating_after_730pm: true,
      cooling_dinner_preferred: true
    },

    ai_notes: "Include flaxseeds (lignans) and soy (isoflavones) as phytoestrogens for hot flash management. Indian context: til (sesame) ladoo, tofu, and ragi for calcium. Black cohosh tea for hot flashes. Evening meal should be cooling and light. Calcium 1200mg/day post-menopause is critical. Avoid all stimulants especially in the evening."
  },

  // ─────────────────────────────────────────
  // 22. AUTOIMMUNE DISORDERS
  // ─────────────────────────────────────────
  {
    id: "Autoimmune_Disorders_v1",
    condition: "Autoimmune_Disorders",

    goals: [
      "modulate_overactive_immune_response",
      "reduce_systemic_inflammation",
      "heal_intestinal_permeability",
      "identify_and_eliminate_dietary_triggers",
      "support_gut_microbiome_diversity"
    ],

    nutrition_strategy: {
      diet_type: "aip_anti_inflammatory",
      fasting_protocol: "12:12",
      focus_types: ["anti_inflammatory", "omega3_rich", "gut_healing", "probiotic", "antioxidant_rich"]
    },

    food_rules: {
      recommended_types: ["anti_inflammatory", "omega3_rich", "gut_healing", "probiotic", "antioxidant_rich", "zinc_rich", "selenium_rich", "vitamin_d_rich"],
      avoid_types: ["gluten_heavy", "processed_food", "high_sugar", "alcohol", "nightshades_aip", "emulsifiers", "refined_carbs"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["anti_inflammatory", "gut_healing", "high_protein"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "probiotic"] },
        { slot: "Lunch",         types: ["anti_inflammatory", "balanced", "gut_friendly"] },
        { slot: "Dinner",        types: ["anti_inflammatory", "light_meal", "gut_healing"] }
      ]
    },

    rules: {
      aip_elimination_first: true,
      systematic_food_reintroduction: true,
      avoid_gluten: true,
      turmeric_and_ginger_daily: true
    },

    ai_notes: "AIP elimination protocol as baseline — condition-specific (Hashimoto's, Lupus, RA) will have additional triggers. Indian context: bone broth (non-veg) or split moong soup for gut healing. Haldi + black pepper is potent anti-inflammatory. Coconut oil is AIP-compliant. Fermented foods (homemade curd, kanji) support microbiome. Avoid maida entirely. Reintroduce foods systematically after elimination phase."
  },

  // ─────────────────────────────────────────
  // 23. SKIN ISSUES / ACNE
  // ─────────────────────────────────────────
  {
    id: "Skin_Issues_Acne_v1",
    condition: "Skin_Issues_Acne",

    goals: [
      "reduce_sebum_overproduction",
      "lower_igf1_and_insulin_spikes",
      "reduce_skin_inflammation",
      "support_skin_barrier_and_collagen",
      "balance_gut_skin_axis"
    ],

    nutrition_strategy: {
      diet_type: "low_gi_dairy_free",
      fasting_protocol: "14:10",
      focus_types: ["low_gi", "zinc_rich", "omega3_rich", "antioxidant_rich", "probiotic"]
    },

    food_rules: {
      recommended_types: ["low_gi", "zinc_rich", "omega3_rich", "antioxidant_rich", "vitamin_a_rich", "probiotic", "anti_inflammatory", "vitamin_c_rich"],
      avoid_types: ["high_gi", "high_sugar", "dairy_excess", "whey_protein", "fried", "processed_food", "excess_iodine"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["low_gi", "zinc_rich", "antioxidant_rich"] },
        { slot: "Mid Morning",   types: ["vitamin_c_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["low_gi", "balanced", "zinc_rich"] },
        { slot: "Dinner",        types: ["low_gi", "omega3_rich", "light_meal"] }
      ]
    },

    rules: {
      eliminate_dairy: true,
      avoid_whey_protein: true,
      green_tea_daily: true,
      early_dinner: true,
      gut_health_priority: true
    },

    ai_notes: "Dairy and high-GI foods are two biggest dietary acne triggers. Replace milk with plant-based alternatives. Include pumpkin seeds (zinc), sweet potato (beta-carotene), walnuts (omega-3). Indian context: nimbu pani in morning, amla daily. Green tea has anti-androgen properties. Gut health directly affects skin — prioritise curd and fermented foods. Avoid chai with sugar."
  },

  // ─────────────────────────────────────────
  // 24. HAIR LOSS
  // ─────────────────────────────────────────
  {
    id: "Hair_Loss_v1",
    condition: "Hair_Loss",

    goals: [
      "address_nutritional_deficiencies",
      "support_keratin_synthesis",
      "replenish_iron_and_ferritin",
      "reduce_dht_androgen_related_loss",
      "strengthen_hair_follicle_health"
    ],

    nutrition_strategy: {
      diet_type: "high_protein_iron_rich",
      fasting_protocol: "12:12",
      focus_types: ["high_protein", "iron_rich", "biotin_rich", "zinc_rich", "omega3_rich"]
    },

    food_rules: {
      recommended_types: ["high_protein", "iron_rich", "biotin_rich", "zinc_rich", "omega3_rich", "vitamin_d_rich", "b12_rich", "selenium_rich"],
      avoid_types: ["very_low_calorie", "high_sugar", "refined_carbs", "crash_diet", "excess_vitamin_a_supplement"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["high_protein", "iron_rich", "biotin_rich"] },
        { slot: "Mid Morning",   types: ["zinc_rich", "vitamin_c_rich"] },
        { slot: "Lunch",         types: ["high_protein", "iron_rich", "balanced"] },
        { slot: "Dinner",        types: ["high_protein", "zinc_rich", "light_meal"] }
      ]
    },

    rules: {
      no_crash_dieting: true,
      no_skipping_meals: true,
      pair_iron_with_vitamin_c: true,
      address_thyroid_if_needed: true
    },

    ai_notes: "Hair loss is often multifactorial — address iron, ferritin, Vitamin D, and thyroid simultaneously. Indian diet: include eggs (biotin), dals (protein + iron), moringa leaves (iron + protein), amla (Vitamin C). Sesame and pumpkin seeds are excellent zinc sources. Avoid skipping meals — caloric restriction directly worsens hair loss. Include cooling foods if stress-related."
  },

  // ─────────────────────────────────────────
  // 25. DEPRESSION
  // ─────────────────────────────────────────
  {
    id: "Depression_v1",
    condition: "Depression",

    goals: [
      "support_serotonin_and_dopamine_synthesis",
      "reduce_neuroinflammation",
      "correct_nutritional_deficiencies",
      "stabilise_blood_sugar_for_mood",
      "support_gut_brain_axis"
    ],

    nutrition_strategy: {
      diet_type: "mood_supportive_mediterranean",
      fasting_protocol: "none",
      focus_types: ["tryptophan_rich", "omega3_rich", "b_vitamin_rich", "magnesium_rich", "probiotic"]
    },

    food_rules: {
      recommended_types: ["omega3_rich", "tryptophan_rich", "b_vitamin_rich", "magnesium_rich", "probiotic", "antioxidant_rich", "zinc_rich"],
      avoid_types: ["high_sugar", "alcohol", "ultra_processed", "high_caffeine", "refined_carbs"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["gut_brain_support"] },
        { slot: "Breakfast",     types: ["tryptophan_rich", "b_vitamin_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["magnesium_rich", "antioxidant_rich"] },
        { slot: "Lunch",         types: ["omega3_rich", "balanced", "probiotic"] },
        { slot: "Evening Snack", types: ["tryptophan_rich", "magnesium_rich"] },
        { slot: "Dinner",        types: ["omega3_rich", "light_meal", "tryptophan_rich"] }
      ]
    },

    rules: {
      no_skipping_meals: true,
      regular_meal_timing: true,
      avoid_alcohol: true,
      include_dark_chocolate: true,
      warm_meals_preferred: true
    },

    ai_notes: "Include dark chocolate (70%+) — tryptophan, magnesium, and mood-boosting phenylethylamine. Indian context: warm haldi milk is calming and anti-inflammatory. Banana, dates, and sesame contain tryptophan. Regular meal timing is crucial — blood sugar crashes worsen mood. Fermented foods (curd, idli, kanji) feed the gut-brain axis. Include saffron (kesar) — clinical evidence for mild depression."
  },

  // ─────────────────────────────────────────
  // 26. ANXIETY
  // ─────────────────────────────────────────
  {
    id: "Anxiety_v1",
    condition: "Anxiety",

    goals: [
      "reduce_cortisol_and_stress_hormones",
      "support_gaba_synthesis",
      "stabilise_blood_sugar",
      "improve_nervous_system_resilience",
      "calm_gut_brain_axis"
    ],

    nutrition_strategy: {
      diet_type: "calming_low_stimulant",
      fasting_protocol: "none",
      focus_types: ["magnesium_rich", "calming", "complex_carbs", "omega3_rich", "probiotic"]
    },

    food_rules: {
      recommended_types: ["magnesium_rich", "calming", "complex_carbs", "omega3_rich", "probiotic", "tryptophan_rich", "b_vitamin_rich", "adaptogen"],
      avoid_types: ["high_caffeine", "alcohol", "high_sugar", "refined_carbs", "high_sodium", "stimulant"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["calming", "adaptogen"] },
        { slot: "Breakfast",     types: ["complex_carbs", "magnesium_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["calming", "magnesium_rich"] },
        { slot: "Lunch",         types: ["balanced", "b_vitamin_rich", "omega3_rich"] },
        { slot: "Evening Snack", types: ["calming", "tryptophan_rich"] },
        { slot: "Dinner",        types: ["light_meal", "magnesium_rich", "tryptophan_rich"] }
      ]
    },

    rules: {
      no_skipping_meals: true,
      no_caffeine_after_noon: true,
      chamomile_tea_recommended: true,
      ashwagandha_recommended: true,
      warm_dinner_preferred: true
    },

    ai_notes: "Anxiety worsened by blood sugar instability — never skip meals. Chamomile tea and ashwagandha are evidence-based for anxiety reduction. Indian context: warm milk with ashwagandha and nutmeg at bedtime. Avoid chai on empty stomach. Include oats (tryptophan + complex carbs), dark greens (magnesium), curd (probiotics). Meals should be warm, grounding, and regular."
  },

  // ─────────────────────────────────────────
  // 27. SLEEP DISORDERS / INSOMNIA
  // ─────────────────────────────────────────
  {
    id: "Sleep_Disorders_v1",
    condition: "Sleep_Disorders",

    goals: [
      "improve_sleep_onset_and_quality",
      "support_melatonin_and_serotonin_production",
      "reduce_cortisol_at_night",
      "align_meals_with_circadian_rhythm",
      "address_nutritional_deficiencies_affecting_sleep"
    ],

    nutrition_strategy: {
      diet_type: "circadian_aligned_calming",
      fasting_protocol: "14:10",
      focus_types: ["tryptophan_rich", "magnesium_rich", "calming", "complex_carbs", "anti_inflammatory"]
    },

    food_rules: {
      recommended_types: ["tryptophan_rich", "magnesium_rich", "calming", "sleep_promoting", "complex_carbs", "anti_inflammatory"],
      avoid_types: ["high_caffeine", "alcohol", "heavy_meal_at_night", "high_sugar", "spicy", "stimulant", "refined_carbs_at_night"]
    },

    meal_structure: {
      pattern: "4_meals",
      meals: [
        { slot: "Breakfast",     types: ["complex_carbs", "b12_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "magnesium_rich"] },
        { slot: "Lunch",         types: ["balanced", "tryptophan_rich", "complex_carbs"] },
        { slot: "Dinner",        types: ["light_meal", "tryptophan_rich", "magnesium_rich"] }
      ]
    },

    rules: {
      dinner_3hr_before_sleep: true,
      no_caffeine_after_2pm: true,
      early_dinner: true,
      bedtime_warm_drink_recommended: true,
      no_screens_one_hour_before_sleep: true
    },

    ai_notes: "Dinner must be light and completed 3 hours before sleep. Include tart cherry (natural melatonin source), warm milk with nutmeg, kiwi. Indian context: warm haldi milk (golden milk) at bedtime is traditional and effective. Banana + warm milk is excellent tryptophan + carb combination. No chai or coffee after 2pm. Magnesium-rich foods (pumpkin seeds, spinach) throughout the day."
  },

  // ─────────────────────────────────────────
  // 28. POSTPARTUM
  // ─────────────────────────────────────────
  {
    id: "Postpartum_v1",
    condition: "Postpartum",

    goals: [
      "support_physical_recovery_after_childbirth",
      "optimise_breast_milk_nutrition",
      "restore_iron_and_nutrient_stores",
      "support_postpartum_mood_reduce_ppd",
      "rebuild_energy_and_strength"
    ],

    nutrition_strategy: {
      diet_type: "recovery_galactagogue_rich",
      fasting_protocol: "none",
      focus_types: ["iron_rich", "galactagogue", "calorie_dense", "omega3_rich", "calcium_rich"]
    },

    food_rules: {
      recommended_types: ["iron_rich", "calcium_rich", "omega3_rich", "galactagogue", "calorie_dense", "b12_rich", "high_protein", "anti_inflammatory"],
      avoid_types: ["alcohol", "high_caffeine", "crash_diet", "raw_foods", "high_sugar", "refined_carbs"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["iron_rich", "galactagogue"] },
        { slot: "Breakfast",     types: ["iron_rich", "b12_rich", "galactagogue"] },
        { slot: "Mid Morning",   types: ["calorie_dense", "calcium_rich"] },
        { slot: "Lunch",         types: ["balanced", "iron_rich", "galactagogue"] },
        { slot: "Evening Snack", types: ["calorie_dense", "galactagogue"] },
        { slot: "Dinner",        types: ["omega3_rich", "high_protein", "calcium_rich"] }
      ]
    },

    rules: {
      no_calorie_restriction: true,
      no_fasting: true,
      warm_foods_preferred: true,
      extra_300_500_kcal_if_breastfeeding: true,
      avoid_alcohol_completely: true
    },

    ai_notes: "Postpartum is recovery phase — never restrict calories, especially if breastfeeding. Indian galactagogue foods: methi seeds/leaves, jeera water, ajwain, doodhi (bottle gourd), gondh ladoos. These are traditional and evidence-based. Include til ladoo, panjiri, and dry fruit ladoos. Iron from green leafy vegetables + amla juice. Warm foods preferred over cold. Omega-3 daily for PPD prevention."
  },

  // ─────────────────────────────────────────
  // 29. PRENATAL CARE
  // ─────────────────────────────────────────
  {
    id: "Prenatal_Care_v1",
    condition: "Prenatal_Care",

    goals: [
      "support_healthy_fetal_growth_each_trimester",
      "prevent_neural_tube_defects",
      "manage_nausea_heartburn_constipation",
      "maintain_healthy_gestational_weight",
      "prevent_gestational_diabetes_and_preeclampsia"
    ],

    nutrition_strategy: {
      diet_type: "pregnancy_nutrient_dense",
      fasting_protocol: "none",
      focus_types: ["folate_rich", "iron_rich", "calcium_rich", "dha_rich", "high_protein"]
    },

    food_rules: {
      recommended_types: ["folate_rich", "iron_rich", "calcium_rich", "dha_rich", "high_protein", "iodine_rich", "nausea_friendly", "fiber_rich"],
      avoid_types: ["raw_or_undercooked", "high_mercury_fish", "alcohol", "unpasteurized", "excess_vitamin_a_supplement", "high_caffeine"]
    },

    meal_structure: {
      pattern: "6_meals",
      meals: [
        { slot: "Early Morning", types: ["nausea_friendly", "folate_rich"] },
        { slot: "Breakfast",     types: ["folate_rich", "iron_rich", "high_protein"] },
        { slot: "Mid Morning",   types: ["calcium_rich", "nausea_friendly"] },
        { slot: "Lunch",         types: ["balanced", "iron_rich", "dha_rich"] },
        { slot: "Evening Snack", types: ["calcium_rich", "fiber_rich"] },
        { slot: "Dinner",        types: ["high_protein", "folate_rich", "light_meal"] }
      ]
    },

    rules: {
      no_fasting: true,
      no_alcohol: true,
      small_frequent_meals_for_nausea: true,
      folate_supplement_mandatory: true,
      avoid_raw_foods: true
    },

    ai_notes: "Trimester adjustments: T1 — folate priority, manage nausea (small frequent meals, ginger, dry crackers); T2 — increase iron, calcium, protein; T3 — DHA, choline for fetal brain. Indian context: moringa (drumstick) is folate and iron-rich. Coconut water for hydration. Ragi for calcium. Avoid unripe papaya and excess pineapple. Ginger for nausea is safe and effective."
  },

  // ─────────────────────────────────────────
  // 30. OTHER / GENERAL WOMEN'S HEALTH
  // ─────────────────────────────────────────
  {
    id: "Other_Diseases_v1",
    condition: "Other_Diseases",

    goals: [
      "provide_balanced_nutrient_dense_diet",
      "support_hormonal_and_metabolic_health",
      "reduce_chronic_disease_risk",
      "maintain_energy_immunity_and_wellbeing",
      "serve_as_base_for_uncategorised_conditions"
    ],

    nutrition_strategy: {
      diet_type: "balanced_whole_food",
      fasting_protocol: "12:12",
      focus_types: ["balanced", "fiber_rich", "high_protein", "anti_inflammatory", "antioxidant_rich"]
    },

    food_rules: {
      recommended_types: ["balanced", "high_protein", "fiber_rich", "antioxidant_rich", "anti_inflammatory", "gut_friendly", "complex_carbs"],
      avoid_types: ["processed_food", "high_sugar", "fried", "refined_carbs", "high_saturated_fat", "alcohol"]
    },

    meal_structure: {
      pattern: "5_meals",
      meals: [
        { slot: "Early Morning", types: ["detox"] },
        { slot: "Breakfast",     types: ["balanced", "high_protein", "fiber_rich"] },
        { slot: "Mid Morning",   types: ["antioxidant_rich", "light_meal"] },
        { slot: "Lunch",         types: ["balanced", "fiber_rich", "high_protein"] },
        { slot: "Evening Snack", types: ["light_meal", "antioxidant_rich"] },
        { slot: "Dinner",        types: ["balanced", "light_meal", "gut_friendly"] }
      ]
    },

    rules: {
      early_dinner: true,
      no_skipping_meals: true,
      avoid_late_night_eating: true,
      include_warming_spices: true
    },

    ai_notes: "Default template for uncategorised conditions. Generate a well-balanced Indian diet plan using local seasonal foods, dal-rice-sabzi as the base. Ensure micronutrient diversity through colour variety on the plate. Adjust based on patient-specific lab values and health goals. Include warming spices (turmeric, ginger, cumin) in most meals."
  }

];

// ─────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────

/**
 * Get a diet template by condition name (case-insensitive, space/underscore tolerant)
 */
export function getTemplate(condition) {
  if (!condition) return getTemplate("Other_Diseases");
  const normalised = condition.toLowerCase().replace(/\s+/g, "_");
  return (
    DIET_TEMPLATES.find(t => t.condition.toLowerCase() === normalised) ||
    DIET_TEMPLATES.find(t => t.id === "Other_Diseases_v1")
  );
}

/**
 * Get all available condition names
 */
export function getAllConditions() {
  return DIET_TEMPLATES.map(t => t.condition);
}

/**
 * Get a template by its id (e.g. "PCOS_v1")
 */
export function getTemplateById(id) {
  return DIET_TEMPLATES.find(t => t.id === id) || null;
}
