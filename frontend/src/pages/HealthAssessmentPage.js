import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';
import './HomePage.css';
import './HealthAssessmentPage.css';

const TOTAL_STEPS = 4;

/* ─── Classification Logic ────────────────────────────── */
function classifyResult({ symptoms, lifestyle }) {
  if (
    symptoms.irregularPeriods === 'yes' ||
    (symptoms.hairFall === 'yes' && lifestyle.stress === 'high')
  ) {
    return {
      title: 'Hormonal Imbalance Risk',
      message: 'Your responses suggest signs of potential hormonal imbalance.',
      explanation:
        'Irregular periods and hair fall paired with high stress are key indicators of hormonal disruption. A personalised nutrition and lifestyle plan can help restore balance and reduce symptoms over time.',
    };
  }

  if (lifestyle.sleep === '<5' && lifestyle.exercise === 'never') {
    return {
      title: 'Lifestyle-Related Health Issue',
      message: 'Your lifestyle patterns may be impacting your overall health.',
      explanation:
        'Insufficient sleep combined with a sedentary routine can lead to hormonal, metabolic, and energy imbalances. Small, targeted changes to your daily habits can make a significant and lasting difference.',
    };
  }

  if (symptoms.weightGain === 'yes' && symptoms.fatigue === 'yes') {
    return {
      title: 'Possible Metabolic or Thyroid Concern',
      message: 'Your symptoms indicate a possible metabolic or thyroid issue.',
      explanation:
        'Unexplained weight gain alongside persistent fatigue are common signs of thyroid or metabolic imbalances. Early nutritional intervention, guided by a specialist, can prevent further complications.',
    };
  }

  return {
    title: 'General Wellness Improvement Recommended',
    message: "You're on a good path — let's optimise your wellbeing further.",
    explanation:
      'No major risk factors were detected. A personalised wellness plan can still help you feel your very best — boosting energy, mood, hormonal balance, and long-term health resilience.',
  };
}

/* ─── Step 1: Basic Info ──────────────────────────────── */
function Step1({ answers, onChange }) {
  return (
    <div className="ha-step">
      <div className="ha-step__header">
        <div className="ha-step__num">1</div>
        <div>
          <h3 className="ha-step__title">Basic Information</h3>
          <p className="ha-step__desc">Tell us a little about yourself.</p>
        </div>
      </div>

      <div className="form-group">
        <label>Your Age</label>
        <input
          type="number"
          placeholder="e.g. 28"
          min="10"
          max="100"
          value={answers.age}
          onChange={e => onChange('age', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Occupation</label>
        <input
          type="text"
          placeholder="e.g. Software Engineer, Teacher, Homemaker…"
          value={answers.occupation}
          onChange={e => onChange('occupation', e.target.value)}
        />
      </div>
    </div>
  );
}

/* ─── Step 2: Symptoms ────────────────────────────────── */
const SYMPTOMS = [
  { key: 'hairFall',         label: 'Hair Fall',         desc: 'Noticeable thinning or excessive hair loss' },
  { key: 'irregularPeriods', label: 'Irregular Periods',  desc: 'Cycles that are unpredictable or vary significantly' },
  { key: 'weightGain',       label: 'Weight Gain',        desc: 'Unexplained or stubborn weight gain' },
  { key: 'fatigue',          label: 'Fatigue',            desc: 'Persistent tiredness or low energy levels' },
];

function Step2({ answers, onChange }) {
  return (
    <div className="ha-step">
      <div className="ha-step__header">
        <div className="ha-step__num">2</div>
        <div>
          <h3 className="ha-step__title">Current Symptoms</h3>
          <p className="ha-step__desc">Are you experiencing any of the following?</p>
        </div>
      </div>

      {SYMPTOMS.map(({ key, label, desc }) => (
        <div key={key} className="ha-toggle-row">
          <div className="ha-toggle-row__info">
            <span className="ha-toggle-row__label">{label}</span>
            <span className="ha-toggle-row__desc">{desc}</span>
          </div>
          <div className="ha-yn">
            <button
              type="button"
              className={`ha-yn__btn${answers[key] === 'yes' ? ' ha-yn__btn--yes' : ''}`}
              onClick={() => onChange(key, 'yes')}
            >
              Yes
            </button>
            <button
              type="button"
              className={`ha-yn__btn${answers[key] === 'no' ? ' ha-yn__btn--no' : ''}`}
              onClick={() => onChange(key, 'no')}
            >
              No
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Step 3: Lifestyle ───────────────────────────────── */
const SLEEP_OPTIONS    = [{ v: '<5', l: 'Less than 5 hrs' }, { v: '5-7', l: '5 – 7 hours' }, { v: '7+', l: '7+ hours' }];
const STRESS_OPTIONS   = [{ v: 'low', l: 'Low' }, { v: 'medium', l: 'Medium' }, { v: 'high', l: 'High' }];
const EXERCISE_OPTIONS = [{ v: 'never', l: 'Never' }, { v: 'sometimes', l: 'Sometimes' }, { v: 'regular', l: 'Regular' }];

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="ha-options">
        {options.map(({ v, l }) => (
          <button
            key={v}
            type="button"
            className={`ha-option${value === v ? ' ha-option--active' : ''}`}
            onClick={() => onChange(v)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ answers, onChange }) {
  return (
    <div className="ha-step">
      <div className="ha-step__header">
        <div className="ha-step__num">3</div>
        <div>
          <h3 className="ha-step__title">Your Lifestyle</h3>
          <p className="ha-step__desc">How does your daily routine look?</p>
        </div>
      </div>

      <OptionGroup
        label="Average sleep per night"
        options={SLEEP_OPTIONS}
        value={answers.sleep}
        onChange={v => onChange('sleep', v)}
      />
      <OptionGroup
        label="Stress level"
        options={STRESS_OPTIONS}
        value={answers.stress}
        onChange={v => onChange('stress', v)}
      />
      <OptionGroup
        label="Exercise frequency"
        options={EXERCISE_OPTIONS}
        value={answers.exercise}
        onChange={v => onChange('exercise', v)}
      />
    </div>
  );
}

/* ─── Step 4: Goals ───────────────────────────────────── */
const GOALS = [
  { key: 'hair',     label: 'Hair Health' },
  { key: 'weight',   label: 'Weight' },
  { key: 'hormones', label: 'Hormones' },
  { key: 'wellness', label: 'General Wellness' },
];

function Step4({ goals, onToggle }) {
  return (
    <div className="ha-step">
      <div className="ha-step__header">
        <div className="ha-step__num">4</div>
        <div>
          <h3 className="ha-step__title">Your Goals</h3>
          <p className="ha-step__desc">What would you most like to improve? Select all that apply.</p>
        </div>
      </div>

      <div className="ha-goals">
        {GOALS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`ha-goal-card${goals.includes(key) ? ' ha-goal-card--active' : ''}`}
            onClick={() => onToggle(key)}
          >
            <span className="ha-goal-card__check">{goals.includes(key) ? '✓' : ''}</span>
            <span className="ha-goal-card__label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Result Screen ───────────────────────────────────── */
function ResultScreen({ result }) {
  return (
    <section className="ha-page page-section-top">
      <div className="section-inner ha-result-wrap">
        <div className="ha-result">
          <div className="ha-result__icon">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <p className="ha-result__eyebrow">Your Health Insight</p>
          <h2 className="ha-result__title">{result.title}</h2>
          <p className="ha-result__message">{result.message}</p>
          <div className="ha-result__explanation">
            <p>{result.explanation}</p>
          </div>
          <div className="ha-result__actions">
            <Link to="/contact" className="btn btn--primary">
              Book Consultation <ArrowRight size={16} />
            </Link>
          </div>
          <p className="ha-result__trust">
            Trusted by 100+ women &bull; Personalised for your body &bull; Expert-led care
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function HealthAssessmentPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    basic:     { age: '', occupation: '' },
    symptoms:  { hairFall: '', irregularPeriods: '', weightGain: '', fatigue: '' },
    lifestyle: { sleep: '', stress: '', exercise: '' },
    goals:     [],
  });
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const updateBasic     = (f, v) => setAnswers(a => ({ ...a, basic:     { ...a.basic,     [f]: v } }));
  const updateSymptom   = (f, v) => setAnswers(a => ({ ...a, symptoms:  { ...a.symptoms,  [f]: v } }));
  const updateLifestyle = (f, v) => setAnswers(a => ({ ...a, lifestyle: { ...a.lifestyle, [f]: v } }));
  const toggleGoal = goal =>
    setAnswers(a => ({
      ...a,
      goals: a.goals.includes(goal)
        ? a.goals.filter(g => g !== goal)
        : [...a.goals, goal],
    }));

  const canProceed = () => {
    if (step === 1) return answers.basic.age.trim() && answers.basic.occupation.trim();
    if (step === 2) return Object.values(answers.symptoms).every(v => v !== '');
    if (step === 3) return answers.lifestyle.sleep && answers.lifestyle.stress && answers.lifestyle.exercise;
    if (step === 4) return answers.goals.length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setSaving(true);
    const classification = classifyResult(answers);

    // Store in Supabase — non-blocking, best-effort
    supabase
      .from('health_assessments')
      .insert([{
        age:          parseInt(answers.basic.age, 10),
        occupation:   answers.basic.occupation,
        symptoms:     answers.symptoms,
        lifestyle:    answers.lifestyle,
        goals:        answers.goals,
        result_title: classification.title,
      }])
      .then(({ error }) => {
        if (error) console.warn('Assessment save skipped:', error.message);
      });

    setResult(classification);
    setSaving(false);
    window.scrollTo(0, 0);
  };

  if (result) return <ResultScreen result={result} />;

  return (
    <section className="ha-page page-section-top">
      <div className="section-inner ha-form-wrap">

        {/* Page header */}
        <div className="ha-header">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Free Health Assessment</p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Discover Your<br /><em>Personalised Health Insight</em>
          </h2>
          <p className="ha-header__sub">
            Answer 4 quick sections — takes less than 2 minutes. No account needed.
          </p>
        </div>

        {/* Progress bar */}
        <div className="ha-progress">
          <div className="ha-progress__bar">
            <div
              className="ha-progress__fill"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <p className="ha-progress__label">Step {step} of {TOTAL_STEPS}</p>
        </div>

        {/* Form card */}
        <div className="ha-card">
          {step === 1 && <Step1 answers={answers.basic}     onChange={updateBasic} />}
          {step === 2 && <Step2 answers={answers.symptoms}  onChange={updateSymptom} />}
          {step === 3 && <Step3 answers={answers.lifestyle} onChange={updateLifestyle} />}
          {step === 4 && <Step4 goals={answers.goals}       onToggle={toggleGoal} />}

          {/* Navigation */}
          <div className="ha-nav">
            {step > 1 && (
              <button
                type="button"
                className="btn btn--ghost ha-nav__back"
                onClick={() => setStep(s => s - 1)}
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn btn--primary ha-nav__next"
                disabled={!canProceed()}
                onClick={() => setStep(s => s + 1)}
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn--primary ha-nav__next"
                disabled={!canProceed() || saving}
                onClick={handleSubmit}
              >
                {saving ? 'Processing…' : 'Get My Health Insight'}
              </button>
            )}
          </div>
        </div>

        <p className="ha-footer-trust">
          Takes less than 2 minutes &bull; No personal data required &bull; Instant results
        </p>
      </div>
      <Footer />
    </section>
  );
}
