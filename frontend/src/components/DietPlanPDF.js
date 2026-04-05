import {
  Document, Page, Text, View, StyleSheet
} from '@react-pdf/renderer';

/* ─── Colours ────────────────────────────────────────── */
const C = {
  primary:    '#7c3f7b',
  primaryLight:'#f3e8f3',
  accent:     '#c084bb',
  dark:       '#1e1e2e',
  mid:        '#555570',
  light:      '#888899',
  border:     '#e8dff0',
  white:      '#ffffff',
  bg:         '#fdf8fd',
  mealColors: ['#7c3f7b','#a855a8','#6d4c9e','#3b82b0','#0ea5a0','#16a34a','#b45309'],
};

/* ─── Styles ─────────────────────────────────────────── */
const S = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.dark,
  },

  /* Header */
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandLogo: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    color: C.white,
  },
  brandTagline: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerBadgeText: {
    fontSize: 8,
    color: C.white,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
  },

  /* Patient strip */
  patientStrip: {
    backgroundColor: C.white,
    marginHorizontal: 40,
    marginTop: -16,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  patientField: {
    width: '33%',
    marginBottom: 10,
  },
  patientLabel: {
    fontSize: 7.5,
    color: C.light,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  patientValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.dark,
  },

  /* Section */
  sectionWrap: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionDot: {
    width: 4,
    height: 18,
    backgroundColor: C.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    letterSpacing: 0.3,
  },

  /* Meal grid */
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mealCard: {
    width: '50%',
    paddingRight: 8,
    marginBottom: 10,
  },
  mealCardInner: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  mealHeader: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 0.3,
  },
  mealTime: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.8)',
  },
  mealBody: {
    backgroundColor: C.white,
    padding: 10,
  },
  mealRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  mealRowLabel: {
    fontSize: 7.5,
    color: C.light,
    width: 55,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  mealRowValue: {
    fontSize: 9,
    color: C.dark,
    flex: 1,
    lineHeight: 1.4,
  },
  mealRowValueBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.dark,
    flex: 1,
  },
  mealEmpty: {
    fontSize: 8.5,
    color: C.light,
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: C.white,
  },

  /* Two column */
  twoCol: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    marginRight: 8,
  },
  colLast: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.primaryLight,
  },
  infoCardText: {
    fontSize: 9,
    color: C.mid,
    lineHeight: 1.6,
  },

  /* Doctor notes */
  notesBox: {
    backgroundColor: C.primaryLight,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    padding: 14,
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  notesText: {
    fontSize: 9.5,
    color: C.mid,
    lineHeight: 1.7,
  },

  /* Calorie summary */
  calBanner: {
    backgroundColor: C.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
  },
  calValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  calUnit: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.75)',
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.primary,
    paddingHorizontal: 40,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    fontFamily: 'Helvetica-Bold',
  },
  footerNote: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
});

/* ─── Helpers ────────────────────────────────────────── */
const MEAL_SLOTS = [
  { key: 'earlyMorning', label: 'Early Morning',     time: '6:00 – 7:00 AM'   },
  { key: 'breakfast',    label: 'Breakfast',          time: '8:00 – 9:00 AM'   },
  { key: 'midMorning',   label: 'Mid Morning Snack',  time: '10:30 – 11:00 AM' },
  { key: 'lunch',        label: 'Lunch',              time: '1:00 – 2:00 PM'   },
  { key: 'eveningSnack', label: 'Evening Snack',      time: '4:30 – 5:00 PM'   },
  { key: 'dinner',       label: 'Dinner',             time: '7:30 – 8:00 PM'   },
  { key: 'bedtime',      label: 'Bedtime',            time: '9:30 – 10:00 PM'  },
];

function MealCard({ slot, meal, colorIndex }) {
  const color = C.mealColors[colorIndex % C.mealColors.length];
  const isEmpty = !meal?.items;

  return (
    <View style={S.mealCard}>
      <View style={S.mealCardInner}>
        <View style={[S.mealHeader, { backgroundColor: color }]}>
          <Text style={S.mealName}>{slot.label}</Text>
          <Text style={S.mealTime}>{slot.time}</Text>
        </View>
        {isEmpty ? (
          <Text style={S.mealEmpty}>No items specified</Text>
        ) : (
          <View style={S.mealBody}>
            <View style={S.mealRow}>
              <Text style={S.mealRowLabel}>Food</Text>
              <Text style={S.mealRowValueBold}>{meal.items}</Text>
            </View>
            {meal.quantity ? (
              <View style={S.mealRow}>
                <Text style={S.mealRowLabel}>Quantity</Text>
                <Text style={S.mealRowValue}>{meal.quantity}</Text>
              </View>
            ) : null}
            {meal.calories ? (
              <View style={S.mealRow}>
                <Text style={S.mealRowLabel}>Calories</Text>
                <Text style={S.mealRowValue}>{meal.calories} kcal</Text>
              </View>
            ) : null}
            {meal.notes ? (
              <View style={S.mealRow}>
                <Text style={S.mealRowLabel}>Note</Text>
                <Text style={[S.mealRowValue, { color: C.mid }]}>{meal.notes}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

/* ─── PDF Document ───────────────────────────────────── */
export default function DietPlanPDF({ patient, plan, meals, restrictions, doctorNotes }) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const totalCalories = MEAL_SLOTS.reduce((sum, s) => {
    const cal = parseInt(meals?.[s.key]?.calories || '0', 10);
    return sum + (isNaN(cal) ? 0 : cal);
  }, 0);

  return (
    <Document title={`Diet Plan - ${patient?.name}`} author="ForHerWellbeing">
      <Page size="A4" style={S.page}>

        {/* ── Header ── */}
        <View style={S.header}>
          <View style={S.headerTop}>
            <View>
              <Text style={S.brandLogo}>FORHERWELLBEING</Text>
              <Text style={S.brandTagline}>Women's Health & Nutrition</Text>
            </View>
            <View style={S.headerBadge}>
              <Text style={S.headerBadgeText}>PERSONALISED DIET PLAN</Text>
            </View>
          </View>
          <Text style={S.headerTitle}>{plan?.title || 'Diet Plan'}</Text>
          <Text style={S.headerSub}>
            {plan?.duration ? `${plan.duration}-Day Plan` : ''}
            {plan?.startDate ? `  ·  Starting ${plan.startDate}` : ''}
            {plan?.dietType  ? `  ·  ${plan.dietType}` : ''}
          </Text>
        </View>

        {/* ── Patient Strip ── */}
        <View style={S.patientStrip}>
          {[
            { label: 'Patient Name', value: patient?.name     || '—' },
            { label: 'Age',          value: patient?.age ? `${patient.age} yrs` : '—' },
            { label: 'Condition',    value: patient?.condition || '—' },
            { label: 'Diet Type',    value: plan?.dietType    || '—' },
            { label: 'Duration',     value: plan?.duration ? `${plan.duration} Days` : '—' },
            { label: 'Prepared On',  value: today },
          ].map(({ label, value }) => (
            <View key={label} style={S.patientField}>
              <Text style={S.patientLabel}>{label}</Text>
              <Text style={S.patientValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* ── Calorie Banner ── */}
        {(totalCalories > 0 || plan?.calorieTarget) && (
          <View style={[S.sectionWrap, { marginTop: 16 }]}>
            <View style={S.calBanner}>
              <View>
                <Text style={S.calLabel}>DAILY CALORIE TARGET</Text>
                <Text style={S.calValue}>
                  {plan?.calorieTarget || totalCalories} <Text style={S.calUnit}>kcal / day</Text>
                </Text>
              </View>
              {totalCalories > 0 && (
                <View>
                  <Text style={S.calLabel}>ESTIMATED FROM PLAN</Text>
                  <Text style={[S.calValue, { fontSize: 13 }]}>{totalCalories} kcal</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── Meal Plan ── */}
        <View style={S.sectionWrap}>
          <View style={S.sectionHeader}>
            <View style={S.sectionDot} />
            <Text style={S.sectionTitle}>Daily Meal Plan</Text>
          </View>
          <View style={S.mealGrid}>
            {MEAL_SLOTS.map((slot, i) => (
              <MealCard key={slot.key} slot={slot} meal={meals?.[slot.key]} colorIndex={i} />
            ))}
          </View>
        </View>

        {/* ── Restrictions & Recommendations ── */}
        <View style={S.sectionWrap}>
          <View style={S.sectionHeader}>
            <View style={S.sectionDot} />
            <Text style={S.sectionTitle}>Restrictions & Recommendations</Text>
          </View>
          <View style={S.twoCol}>
            <View style={S.col}>
              {restrictions?.avoid && (
                <View style={S.infoCard}>
                  <Text style={S.infoCardTitle}>Foods to Avoid</Text>
                  <Text style={S.infoCardText}>{restrictions.avoid}</Text>
                </View>
              )}
              {restrictions?.water && (
                <View style={S.infoCard}>
                  <Text style={S.infoCardTitle}>Daily Water Intake</Text>
                  <Text style={S.infoCardText}>{restrictions.water}</Text>
                </View>
              )}
            </View>
            <View style={S.colLast}>
              {restrictions?.recommended && (
                <View style={S.infoCard}>
                  <Text style={S.infoCardTitle}>Recommended Foods</Text>
                  <Text style={S.infoCardText}>{restrictions.recommended}</Text>
                </View>
              )}
              {restrictions?.exercise && (
                <View style={S.infoCard}>
                  <Text style={S.infoCardTitle}>Exercise</Text>
                  <Text style={S.infoCardText}>{restrictions.exercise}</Text>
                </View>
              )}
            </View>
          </View>
          {restrictions?.lifestyle && (
            <View style={S.infoCard}>
              <Text style={S.infoCardTitle}>Lifestyle Instructions</Text>
              <Text style={S.infoCardText}>{restrictions.lifestyle}</Text>
            </View>
          )}
        </View>

        {/* ── Doctor Notes ── */}
        {doctorNotes && (
          <View style={S.sectionWrap}>
            <View style={S.sectionHeader}>
              <View style={S.sectionDot} />
              <Text style={S.sectionTitle}>Doctor's Notes</Text>
            </View>
            <View style={S.notesBox}>
              <Text style={S.notesTitle}>Special Clinical Instructions</Text>
              <Text style={S.notesText}>{doctorNotes}</Text>
            </View>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerBrand}>FORHERWELLBEING</Text>
          <Text style={S.footerNote}>
            This diet plan is prepared exclusively for {patient?.name || 'the patient'} · {today}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
