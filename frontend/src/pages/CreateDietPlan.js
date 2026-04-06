import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { usePatients } from '../context/PatientsContext';
import { getTemplate } from '../data/dietTemplates';
import { supabase } from '../lib/supabaseClient';
import { analyzeLabReports, generateAIDietPlan } from '../lib/geminiService';
import DietPlanPDF from '../components/DietPlanPDF';
import './CreateDietPlan.css';

/* ─── Icons (inline SVG) ─────────────────────────────── */
const Icon = ({ name }) => {
  const icons = {
    user:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    age:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    weight:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z"/><path d="M5 8h14l-1.5 10H6.5z"/></svg>,
    height:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v18M8 3l3 3M8 3L5 6M8 21l3-3M8 21L5 18M14 12h4M14 7h2M14 17h2"/></svg>,
    condition:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    goal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    gender:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8M9 18h6"/></svg>,
    upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    close:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    send:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    pdf:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    eye:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    save:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    food:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  };
  return <span className="cdp-icon">{icons[name] || null}</span>;
};

/* ─── Meal types ─────────────────────────────────────── */
const MEAL_SLOTS = [
  { key: 'earlyMorning', label: 'Early Morning',      emoji: '🌅', time: '6:00–7:00 AM' },
  { key: 'breakfast',    label: 'Breakfast',           emoji: '🍳', time: '8:00–9:00 AM' },
  { key: 'midMorning',   label: 'Mid Morning Snack',   emoji: '🍎', time: '10:30–11:00 AM' },
  { key: 'lunch',        label: 'Lunch',               emoji: '🍱', time: '1:00–2:00 PM' },
  { key: 'eveningSnack', label: 'Evening Snack',       emoji: '🥜', time: '4:30–5:00 PM' },
  { key: 'dinner',       label: 'Dinner',              emoji: '🍽️', time: '7:30–8:00 PM' },
  { key: 'bedtime',      label: 'Bedtime',             emoji: '🌙', time: '9:30–10:00 PM' },
];

const emptyMeal = () => ({ items: '', quantity: '', calories: '', notes: '' });
const initMeals = () => Object.fromEntries(MEAL_SLOTS.map(s => [s.key, emptyMeal()]));

/* ─── Send Modal ─────────────────────────────────────── */
function SendModal({ open, onClose, onSend, defaultEmail }) {
  const [email, setEmail]     = useState(defaultEmail || '');
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');

  if (!open) return null;

  async function handleSend() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSending(true);
    await onSend(email);
    setSending(false);
  }

  return createPortal(
    <div className="cdp-overlay" onClick={onClose}>
      <div className="cdp-send-modal" onClick={e => e.stopPropagation()}>
        <div className="cdp-send-header">
          <div className="cdp-send-title">
            <span className="cdp-send-icon-wrap"><Icon name="send" /></span>
            Send Diet Plan
          </div>
          <button className="cdp-send-close" onClick={onClose}><Icon name="close" /></button>
        </div>

        <p className="cdp-send-subtitle">
          The diet plan PDF will be emailed directly to the patient.
        </p>

        <div className="cdp-field" style={{ marginBottom: '1rem' }}>
          <label className="cdp-label">Patient Email Address</label>
          <input
            className="cdp-input"
            type="email"
            placeholder="patient@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
          />
          {error && <p style={{ color: '#e53e3e', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</p>}
        </div>

        <div className="cdp-send-actions">
          <button className="cdp-btn cdp-btn--ghost" onClick={onClose} disabled={sending}>Cancel</button>
          <button className="cdp-btn cdp-btn--primary" onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : <><Icon name="send" /> Send Now</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Lab Analysis Panel ─────────────────────────────── */
const STATUS_STYLES = {
  OPTIMAL:      { color: '#16a34a', bg: '#dcfce7' },
  LOW:          { color: '#2563eb', bg: '#dbeafe' },
  HIGH:         { color: '#ea580c', bg: '#ffedd5' },
  'LOW-NORMAL': { color: '#7c3aed', bg: '#f5f3ff' },
  'HIGH-NORMAL':{ color: '#d97706', bg: '#fef9c3' },
  BORDERLINE:   { color: '#d97706', bg: '#fef9c3' },
};

function LabAnalysisPanel({ reports, onMarkersAnalyzed, markers, analyzing }) {
  const imageReports = reports.filter(r =>
    r.url && (r.type?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(r.name))
  );
  const hasReports = reports.length > 0;

  return (
    <div className="cdp-lab-panel">
      <div className="cdp-lab-panel__header">
        <div className="cdp-lab-panel__title-row">
          <span className="cdp-lab-panel__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
          </span>
          <div>
            <h3 className="cdp-lab-panel__title">Lab Report Analysis</h3>
            <p className="cdp-lab-panel__sub">
              {hasReports
                ? `${reports.length} report(s) uploaded — AI will analyze and extract all lab markers`
                : 'No reports uploaded yet. Ask staff to upload reports first.'}
            </p>
          </div>
        </div>
        {hasReports && (
          <button
            className={`cdp-btn cdp-btn--ai ${analyzing ? 'cdp-btn--ai-loading' : ''}`}
            onClick={() => onMarkersAnalyzed(imageReports.length > 0 ? imageReports : reports)}
            disabled={analyzing}
          >
            {analyzing ? (
              <><span className="cdp-spinner" />  Analyzing Reports...</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                {markers.length > 0 ? 'Re-Analyze Reports' : 'Analyze Lab Reports'}
              </>
            )}
          </button>
        )}
      </div>

      {markers.length > 0 && (
        <div className="cdp-lab-table-wrap">
          <table className="cdp-lab-table">
            <thead>
              <tr>
                <th>Marker</th>
                <th>Value</th>
                <th>Status</th>
                <th>Clinical Significance</th>
              </tr>
            </thead>
            <tbody>
              {markers.map((m, i) => {
                const style = STATUS_STYLES[m.status] || { color: '#64748b', bg: '#f1f5f9' };
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fdf8fd' }}>
                    <td className="cdp-lab-marker">{m.marker}</td>
                    <td className="cdp-lab-value" style={{ color: style.color }}>{m.value}</td>
                    <td>
                      <span className="cdp-lab-status" style={{ color: style.color, backgroundColor: style.bg }}>
                        {m.status}
                      </span>
                    </td>
                    <td className="cdp-lab-significance">{m.significance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────── */
function Toast({ visible }) {
  return (
    <div className={`cdp-toast ${visible ? 'cdp-toast--show' : ''}`}>
      <span className="cdp-toast-check"><Icon name="check" /></span>
      Diet plan created successfully!
    </div>
  );
}

/* ─── Seed state from template ───────────────────────── */
function seedFromTemplate(patient) {
  const tmpl = getTemplate(patient?.condition);
  const mealKeys = ['earlyMorning', 'breakfast', 'midMorning', 'lunch', 'eveningSnack', 'dinner'];
  const meals = initMeals();
  tmpl.meals.forEach((m, i) => {
    if (mealKeys[i]) meals[mealKeys[i]] = { items: m.items, quantity: '', calories: '', notes: m.notes };
  });
  return {
    plan: {
      title: patient?.condition ? `${patient.condition} Diet Plan` : '',
      duration: '14',
      startDate: '',
      dietType: patient?.dietType || 'Non-Vegetarian',
      calorieTarget: '',
    },
    meals,
    restrictions: {
      avoid:       tmpl.avoid.join(', '),
      recommended: tmpl.supplements.join(', '),
      lifestyle:   '',
      water:       '2.5 litres / day',
      exercise:    '',
    },
    doctorNotes: tmpl.goal,
  };
}

/* ─── Main Page ──────────────────────────────────────── */
export default function CreateDietPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatients();
  const fileInputRef = useRef();
  const pdfInputRef  = useRef();
  const patient = patients.find(p => p.id === id) || patients[0];
  const seed = seedFromTemplate(patient);

  /* form state — pre-filled from condition template */
  const [plan, setPlan] = useState(seed.plan);
  const [meals, setMeals] = useState(seed.meals);
  const [restrictions, setRestrictions] = useState(seed.restrictions);
  const [doctorNotes, setDoctorNotes] = useState(seed.doctorNotes);
  const [files, setFiles]         = useState({ chart: null, pdf: null });
  const [dragOver, setDragOver]   = useState(null);
  const [sendOpen, setSendOpen]   = useState(false);
  const [toast, setToast]         = useState(false);
  const [labMarkers, setLabMarkers] = useState([]);
  const [analyzing, setAnalyzing]   = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiError, setAiError]       = useState('');

  /* helpers */
  const setPlanField = (k, v) => setPlan(prev => ({ ...prev, [k]: v }));
  const setMealField = (slot, field, val) => setMeals(prev => ({ ...prev, [slot]: { ...prev[slot], [field]: val } }));
  const setRestrField = (k, v) => setRestrictions(prev => ({ ...prev, [k]: v }));

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  /* ── Analyze lab reports via Gemini Vision ── */
  const handleAnalyzeReports = async (reportsToAnalyze) => {
    setAnalyzing(true);
    setAiError('');
    try {
      const urls = reportsToAnalyze.map(r => r.url);
      const markers = await analyzeLabReports(urls);
      setLabMarkers(markers);
    } catch (err) {
      setAiError('Could not analyze reports: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Generate full diet plan via Gemini ── */
  const handleGenerateAIDiet = async () => {
    setGeneratingAI(true);
    setAiError('');
    try {
      const result = await generateAIDietPlan(patient, labMarkers);
      if (result.meals) {
        setMeals(prev => {
          const updated = { ...prev };
          Object.keys(result.meals).forEach(key => {
            if (updated[key] !== undefined) updated[key] = result.meals[key];
          });
          return updated;
        });
      }
      if (result.restrictions) setRestrictions(result.restrictions);
      if (result.doctorNotes)  setDoctorNotes(result.doctorNotes);
      if (result.planTitle)    setPlanField('title', result.planTitle);
      if (result.calorieTarget) setPlanField('calorieTarget', result.calorieTarget);
      if (result.duration)     setPlanField('duration', result.duration);
      showToast();
    } catch (err) {
      setAiError('AI generation failed: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveDraft = () => {
    if (patient) updatePatient(patient.id, { dietStatus: 'Ready' });
    showToast();
  };

  const handleSend = async (email) => {
    try {
      // Generate PDF as base64
      const blob = await pdf(
        <DietPlanPDF
          patient={patient}
          plan={plan}
          meals={meals}
          restrictions={restrictions}
          doctorNotes={doctorNotes}
        />
      ).toBlob();

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Call Supabase Edge Function
      const { data: fnData, error } = await supabase.functions.invoke('send-diet-plan', {
        body: {
          to:          email,
          patientName: patient?.name || 'Patient',
          planTitle:   plan?.title   || 'Diet Plan',
          pdfBase64:   base64,
        },
      });

      if (error) {
        // Try to extract the real error message from the function response
        let msg = error.message;
        try {
          const ctx = await error.context?.json();
          if (ctx?.error) msg = ctx.error;
        } catch (_) {}
        throw new Error(msg);
      }
      if (fnData?.error) throw new Error(fnData.error);

      if (patient) updatePatient(patient.id, { dietStatus: 'Sent' });
      setSendOpen(false);
      showToast();
    } catch (err) {
      console.error('Failed to send email:', err);
      alert('Failed to send email: ' + err.message);
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) setFiles(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="cdp-page">
      <Toast visible={toast} />

      {/* ── Breadcrumb ── */}
      <nav className="cdp-breadcrumb">
        <Link to="/doctor/dashboard" className="cdp-bc-link">Dashboard</Link>
        <span className="cdp-bc-sep">›</span>
        <Link to="/doctor/dashboard" className="cdp-bc-link">Patients</Link>
        <span className="cdp-bc-sep">›</span>
        <Link to={`/staff/patients/${patient?.id}`} className="cdp-bc-link">Patient Details</Link>
        <span className="cdp-bc-sep">›</span>
        <span className="cdp-bc-current">Create Diet Plan</span>
      </nav>

      {/* ── Page Header ── */}
      <div className="cdp-page-header">
        <div>
          <h1 className="cdp-page-title">Create Diet Plan</h1>
          <p className="cdp-page-sub">Build a personalised nutrition plan for the patient below.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {labMarkers.length > 0 && (
            <button
              className={`cdp-btn cdp-btn--primary ${generatingAI ? 'cdp-btn--ai-loading' : ''}`}
              onClick={handleGenerateAIDiet}
              disabled={generatingAI}
              style={{ background: 'linear-gradient(135deg, #7c3f7b, #a855a8)' }}
            >
              {generatingAI ? (
                <><span className="cdp-spinner" /> Generating Plan...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  ✨ Generate AI Diet Plan
                </>
              )}
            </button>
          )}
          <button className="cdp-btn cdp-btn--ghost cdp-back-btn" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </div>

      {aiError && (
        <div style={{ margin: '0 0 1rem', padding: '0.75rem 1rem', background: '#fee2e2', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem' }}>
          ⚠️ {aiError}
        </div>
      )}

      {/* ── Patient Summary Card ── */}
      <div className="cdp-patient-card">
        <div className="cdp-patient-avatar">
          {patient?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="cdp-patient-fields">
          {[
            { icon: 'user',      label: 'Patient',   value: patient?.name },
            { icon: 'age',       label: 'Age',        value: patient?.age ? `${patient.age} yrs` : '—' },
            { icon: 'gender',    label: 'Gender',     value: 'Female' },
            { icon: 'weight',    label: 'Weight',     value: patient?.weight || '—' },
            { icon: 'height',    label: 'Height',     value: patient?.height || '—' },
            { icon: 'condition', label: 'Condition',  value: patient?.condition || '—' },
            { icon: 'goal',      label: 'Goal',       value: patient?.condition || 'General Wellness' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="cdp-patient-field">
              <span className="cdp-patient-field-icon"><Icon name={icon} /></span>
              <div>
                <div className="cdp-patient-field-label">{label}</div>
                <div className="cdp-patient-field-value">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lab Report Analysis Panel ── */}
      <LabAnalysisPanel
        reports={patient?.reports || []}
        markers={labMarkers}
        analyzing={analyzing}
        onMarkersAnalyzed={handleAnalyzeReports}
      />

      {/* ── Form ── */}
      <div className="cdp-body">

        {/* Section 1: Plan Details */}
        <section className="cdp-section">
          <div className="cdp-section-head">
            <div className="cdp-section-num">1</div>
            <div>
              <div className="cdp-section-title">Plan Details</div>
              <div className="cdp-section-desc">Set the name, duration and dietary parameters for this plan.</div>
            </div>
          </div>

          <div className="cdp-card">
            <div className="cdp-grid cdp-grid--3">
              <div className="cdp-field cdp-field--span2">
                <label className="cdp-label">Plan Title</label>
                <input className="cdp-input" placeholder="e.g. 14 Day Weight Loss Diet Plan"
                  value={plan.title} onChange={e => setPlanField('title', e.target.value)} />
              </div>

              <div className="cdp-field">
                <label className="cdp-label">Duration</label>
                <select className="cdp-input cdp-select"
                  value={plan.duration} onChange={e => setPlanField('duration', e.target.value)}>
                  {['7', '14', '30', '60', '90'].map(d => (
                    <option key={d} value={d}>{d} Days</option>
                  ))}
                </select>
              </div>

              <div className="cdp-field">
                <label className="cdp-label">Start Date</label>
                <input type="date" className="cdp-input"
                  value={plan.startDate} onChange={e => setPlanField('startDate', e.target.value)} />
              </div>

              <div className="cdp-field">
                <label className="cdp-label">Diet Type</label>
                <div className="cdp-diet-toggle">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan'].map(type => (
                    <button key={type}
                      className={`cdp-diet-btn ${plan.dietType === type ? 'cdp-diet-btn--active' : ''}`}
                      onClick={() => setPlanField('dietType', type)}>
                      {type === 'Vegetarian' ? '🥦' : type === 'Non-Vegetarian' ? '🍗' : '🌱'} {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cdp-field">
                <label className="cdp-label">Daily Calorie Target (kcal)</label>
                <input type="number" className="cdp-input" placeholder="e.g. 1800"
                  value={plan.calorieTarget} onChange={e => setPlanField('calorieTarget', e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Daily Meal Plan */}
        <section className="cdp-section">
          <div className="cdp-section-head">
            <div className="cdp-section-num">2</div>
            <div>
              <div className="cdp-section-title">Daily Meal Plan</div>
              <div className="cdp-section-desc">Fill in food items, portions and notes for each meal slot.</div>
            </div>
          </div>

          <div className="cdp-meals-grid">
            {MEAL_SLOTS.map(({ key, label, emoji, time }) => (
              <div key={key} className="cdp-meal-card">
                <div className="cdp-meal-head">
                  <span className="cdp-meal-emoji">{emoji}</span>
                  <div>
                    <div className="cdp-meal-label">{label}</div>
                    <div className="cdp-meal-time">{time}</div>
                  </div>
                </div>
                <div className="cdp-meal-fields">
                  <div className="cdp-field">
                    <label className="cdp-label">Food Items</label>
                    <textarea className="cdp-input cdp-textarea cdp-textarea--sm" rows={2}
                      placeholder="e.g. Oats with chia seeds, green tea..."
                      value={meals[key].items} onChange={e => setMealField(key, 'items', e.target.value)} />
                  </div>
                  <div className="cdp-grid cdp-grid--2">
                    <div className="cdp-field">
                      <label className="cdp-label">Quantity</label>
                      <input className="cdp-input cdp-input--sm" placeholder="e.g. 1 bowl"
                        value={meals[key].quantity} onChange={e => setMealField(key, 'quantity', e.target.value)} />
                    </div>
                    <div className="cdp-field">
                      <label className="cdp-label">Calories (kcal)</label>
                      <input type="number" className="cdp-input cdp-input--sm" placeholder="e.g. 320"
                        value={meals[key].calories} onChange={e => setMealField(key, 'calories', e.target.value)} />
                    </div>
                  </div>
                  <div className="cdp-field">
                    <label className="cdp-label">Notes</label>
                    <input className="cdp-input cdp-input--sm" placeholder="Special instructions..."
                      value={meals[key].notes} onChange={e => setMealField(key, 'notes', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Restrictions & Recommendations */}
        <section className="cdp-section">
          <div className="cdp-section-head">
            <div className="cdp-section-num">3</div>
            <div>
              <div className="cdp-section-title">Restrictions & Recommendations</div>
              <div className="cdp-section-desc">Specify dietary restrictions, lifestyle guidance and wellness goals.</div>
            </div>
          </div>

          <div className="cdp-card">
            <div className="cdp-grid cdp-grid--2">
              <div className="cdp-field">
                <label className="cdp-label">Foods to Avoid</label>
                <textarea className="cdp-input cdp-textarea" rows={3}
                  placeholder="e.g. Refined sugar, processed foods, excess dairy..."
                  value={restrictions.avoid} onChange={e => setRestrField('avoid', e.target.value)} />
              </div>
              <div className="cdp-field">
                <label className="cdp-label">Recommended Foods</label>
                <textarea className="cdp-input cdp-textarea" rows={3}
                  placeholder="e.g. Leafy greens, whole grains, anti-inflammatory foods..."
                  value={restrictions.recommended} onChange={e => setRestrField('recommended', e.target.value)} />
              </div>
              <div className="cdp-field">
                <label className="cdp-label">Lifestyle Instructions</label>
                <textarea className="cdp-input cdp-textarea" rows={3}
                  placeholder="e.g. Eat slowly, avoid screen time during meals, chew well..."
                  value={restrictions.lifestyle} onChange={e => setRestrField('lifestyle', e.target.value)} />
              </div>
              <div className="cdp-field">
                <label className="cdp-label">Exercise Recommendation</label>
                <textarea className="cdp-input cdp-textarea" rows={3}
                  placeholder="e.g. 30 min brisk walk 5x/week, yoga 3x/week..."
                  value={restrictions.exercise} onChange={e => setRestrField('exercise', e.target.value)} />
              </div>
              <div className="cdp-field">
                <label className="cdp-label">Daily Water Intake</label>
                <input className="cdp-input" placeholder="e.g. 2.5 litres / day"
                  value={restrictions.water} onChange={e => setRestrField('water', e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Doctor Notes */}
        <section className="cdp-section">
          <div className="cdp-section-head">
            <div className="cdp-section-num">4</div>
            <div>
              <div className="cdp-section-title">Doctor Notes</div>
              <div className="cdp-section-desc">Add any special clinical instructions for this patient.</div>
            </div>
          </div>

          <div className="cdp-card">
            <div className="cdp-field">
              <label className="cdp-label">Special Instructions</label>
              <textarea className="cdp-input cdp-textarea cdp-textarea--lg" rows={5}
                placeholder="Add any clinical notes, medication interactions, lab-based dietary restrictions, or follow-up instructions..."
                value={doctorNotes} onChange={e => setDoctorNotes(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Section 5: Attach Files */}
        <section className="cdp-section">
          <div className="cdp-section-head">
            <div className="cdp-section-num">5</div>
            <div>
              <div className="cdp-section-title">Attach Files</div>
              <div className="cdp-section-desc">Upload a diet chart image or supplementary PDF instructions.</div>
            </div>
          </div>

          <div className="cdp-card">
            <div className="cdp-grid cdp-grid--2">
              {/* Diet Chart Upload */}
              <div
                className={`cdp-dropzone ${dragOver === 'chart' ? 'cdp-dropzone--over' : ''} ${files.chart ? 'cdp-dropzone--filled' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver('chart'); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, 'chart')}
                onClick={() => fileInputRef.current.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" hidden
                  onChange={e => e.target.files[0] && setFiles(prev => ({ ...prev, chart: e.target.files[0] }))} />
                {files.chart ? (
                  <>
                    <span className="cdp-dz-file-icon">🖼️</span>
                    <span className="cdp-dz-filename">{files.chart.name}</span>
                    <span className="cdp-dz-replace">Click to replace</span>
                  </>
                ) : (
                  <>
                    <span className="cdp-dz-icon"><Icon name="upload" /></span>
                    <span className="cdp-dz-title">Diet Chart Image</span>
                    <span className="cdp-dz-hint">Drag & drop or click to upload · PNG, JPG</span>
                  </>
                )}
              </div>

              {/* PDF Upload */}
              <div
                className={`cdp-dropzone ${dragOver === 'pdf' ? 'cdp-dropzone--over' : ''} ${files.pdf ? 'cdp-dropzone--filled' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver('pdf'); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, 'pdf')}
                onClick={() => pdfInputRef.current.click()}
              >
                <input ref={pdfInputRef} type="file" accept=".pdf" hidden
                  onChange={e => e.target.files[0] && setFiles(prev => ({ ...prev, pdf: e.target.files[0] }))} />
                {files.pdf ? (
                  <>
                    <span className="cdp-dz-file-icon">📄</span>
                    <span className="cdp-dz-filename">{files.pdf.name}</span>
                    <span className="cdp-dz-replace">Click to replace</span>
                  </>
                ) : (
                  <>
                    <span className="cdp-dz-icon"><Icon name="pdf" /></span>
                    <span className="cdp-dz-title">Additional Instructions PDF</span>
                    <span className="cdp-dz-hint">Drag & drop or click to upload · PDF only</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom Action Bar ── */}
        <div className="cdp-action-bar">
          <button className="cdp-btn cdp-btn--draft" onClick={handleSaveDraft}>
            <Icon name="save" /> Save Draft
          </button>
          <div className="cdp-action-right">
            <button className="cdp-btn cdp-btn--ghost">
              <Icon name="eye" /> Preview Plan
            </button>
            <PDFDownloadLink
              document={<DietPlanPDF patient={patient} plan={plan} meals={meals} restrictions={restrictions} doctorNotes={doctorNotes} />}
              fileName={`DietPlan-${patient?.name?.replace(/\s+/g, '-') || 'patient'}.pdf`}
              className="cdp-btn cdp-btn--secondary"
            >
              {({ loading: pdfLoading }) => pdfLoading ? 'Preparing PDF…' : <><Icon name="pdf" /> Download PDF</>}
            </PDFDownloadLink>
            <button className="cdp-btn cdp-btn--primary" onClick={() => setSendOpen(true)}>
              <Icon name="send" /> Send to Patient
            </button>
          </div>
        </div>
      </div>

      {/* ── Send Modal ── */}
      <SendModal open={sendOpen} onClose={() => setSendOpen(false)} onSend={handleSend} defaultEmail={patient?.email || ''} />
    </div>
  );
}
