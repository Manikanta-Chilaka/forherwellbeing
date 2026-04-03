import { useState, useEffect, useRef } from 'react';
import './AddPatientModal.css';

/* ─── Options ───────────────────────────────────────── */
const CONDITIONS = [
  'Lupus', 'PCOS', 'Menopause Care', 'Thyroid Disorder',
  'Hormonal Imbalance', 'Rheumatoid Arthritis', 'Fibromyalgia',
  "Endometriosis", "Hashimoto's Disease", 'Multiple Sclerosis',
  'Irritable Bowel Syndrome', 'Chronic Fatigue Syndrome', 'Other',
];

const SLEEP_OPTIONS    = ['Less than 4 hrs', '4–5 hrs', '6–7 hrs', '8+ hrs'];
const STRESS_OPTIONS   = ['Low', 'Moderate', 'High', 'Severe'];
const ACTIVITY_OPTIONS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const WORK_OPTIONS     = ['Work from Home', 'Office / Field', 'Physical Labour', 'Student', 'Homemaker', 'Other'];
const MEAL_OPTIONS     = ['1–2 meals/day', '3 meals/day', '3 meals + snacks', 'Intermittent fasting'];
const BUDGET_OPTIONS   = ['Under ₦5,000/wk', '₦5,000–10,000/wk', '₦10,000–20,000/wk', '₦20,000+/wk'];
const MENSTRUAL_OPTIONS = ['Regular', 'Irregular', 'Heavy bleeding', 'Painful periods', 'Absent (amenorrhea)', 'Post-menopausal', 'Not applicable'];

/* ─── Initial state ─────────────────────────────────── */
const INIT = {
  // 1. Basic
  name: '', phone: '', age: '', height: '', weight: '',
  // 2. Medical
  condition: '', medications: '', allergies: '', menstrual: '',
  // 3. Lifestyle
  sleep: '', stress: '', activity: '', workType: '',
  // 4. Food
  dietType: 'Vegetarian', foodDislikes: '', mealTiming: '', budget: '',
  // 5. Reports
  reports: [],
};

/* ─── Validation ────────────────────────────────────── */
function validate(form) {
  const e = {};
  if (!form.name.trim())  e.name  = 'Patient name is required.';
  if (!form.phone.trim()) e.phone = 'Phone number is required.';
  else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone))
                          e.phone = 'Enter a valid phone number.';
  if (!form.age)          e.age   = 'Age is required.';
  else if (form.age < 1 || form.age > 120)
                          e.age   = 'Enter a valid age (1–120).';
  if (!form.condition)    e.condition = 'Please select a primary condition.';
  return e;
}

/* ─── Reusable field primitives ─────────────────────── */
function Field({ label, required, error, full, children }) {
  return (
    <div className={`apm-field ${error ? 'apm-field--error' : ''} ${full ? 'apm-field--full' : ''}`}>
      <label className="apm-label">
        {label}{required && <span className="apm-required">*</span>}
      </label>
      {children}
      {error && <p className="apm-field-error">{error}</p>}
    </div>
  );
}

function Input({ error, ...props }) {
  return <input className={`apm-input ${error ? 'apm-input--error' : ''}`} {...props} />;
}

function Select({ error, children, ...props }) {
  return (
    <select className={`apm-input apm-select ${error ? 'apm-input--error' : ''}`} {...props}>
      {children}
    </select>
  );
}

function SectionHeader({ step, icon, title, subtitle }) {
  return (
    <div className="apm-section-header">
      <div className="apm-section-step">{step}</div>
      <span className="apm-section-icon">{icon}</span>
      <div>
        <p className="apm-section-title">{title}</p>
        {subtitle && <p className="apm-section-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ─── Report Upload ──────────────────────────────────── */
function ReportUpload({ files, onChange }) {
  const inputRef = useRef(null);

  function handleFiles(incoming) {
    const arr = Array.from(incoming);
    onChange(prev => {
      const existing = prev.map(f => f.name);
      const fresh = arr.filter(f => !existing.includes(f.name));
      return [...prev, ...fresh];
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function remove(name) {
    onChange(prev => prev.filter(f => f.name !== name));
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="apm-field apm-field--full">
      <label className="apm-label">Upload Reports <span className="apm-optional">(optional)</span></label>

      <div
        className="apm-upload-zone"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <span className="apm-upload-icon">📁</span>
        <p className="apm-upload-text">
          <strong>Click to upload</strong> or drag & drop
        </p>
        <p className="apm-upload-hint">PDF, JPG, PNG, DOC — max 10MB each</p>
      </div>

      {files.length > 0 && (
        <ul className="apm-file-list">
          {files.map(f => (
            <li key={f.name} className="apm-file-item">
              <span className="apm-file-icon">📄</span>
              <div className="apm-file-info">
                <span className="apm-file-name">{f.name}</span>
                <span className="apm-file-size">{formatSize(f.size)}</span>
              </div>
              <button
                type="button"
                className="apm-file-remove"
                onClick={() => remove(f.name)}
                aria-label={`Remove ${f.name}`}
              >✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────── */
export default function AddPatientModal({ open, onClose, onSave }) {
  const [form, setForm]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const bodyRef             = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    setForm(INIT);
    setErrors({});
    onClose();
  }

  function set(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      bodyRef.current?.querySelector('.apm-field--error')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSaving(true);
    const result = await onSave?.(form);
    setSaving(false);
    if (result?.success === false) {
      setErrors({ submit: result.error || 'Failed to save patient. Please try again.' });
      return;
    }
    handleClose();
  }

  if (!open) return null;

  return (
    <div className="apm-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="apm-modal" role="dialog" aria-modal="true" aria-label="Add New Patient">

        {/* ── Header ── */}
        <div className="apm-header">
          <div className="apm-header__left">
            <div className="apm-header__icon">👤</div>
            <div>
              <h2 className="apm-header__title">Add New Patient</h2>
              <p className="apm-header__sub">Complete the clinical intake form</p>
            </div>
          </div>
          <button className="apm-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="apm-body" ref={bodyRef}>

            {/* ── Section 1: Basic ── */}
            <section className="apm-section">
              <SectionHeader step="1" icon="📋" title="Basic Information" subtitle="Patient personal details" />
              <div className="apm-grid">
                <Field label="Patient Name" required error={errors.name}>
                  <Input type="text" placeholder="e.g. Amaka Okonkwo"
                    value={form.name} onChange={set('name')} error={errors.name} />
                </Field>

                <Field label="Phone Number" required error={errors.phone}>
                  <Input type="tel" placeholder="+234 800 000 0000"
                    value={form.phone} onChange={set('phone')} error={errors.phone} />
                </Field>

                <Field label="Age" required error={errors.age}>
                  <Input type="number" placeholder="e.g. 32" min={1} max={120}
                    value={form.age} onChange={set('age')} error={errors.age} />
                </Field>

                <Field label="Height (cm)">
                  <Input type="number" placeholder="e.g. 162"
                    value={form.height} onChange={set('height')} />
                </Field>

                <Field label="Weight (kg)">
                  <Input type="number" placeholder="e.g. 68"
                    value={form.weight} onChange={set('weight')} />
                </Field>
              </div>
            </section>

            {/* ── Section 2: Medical ── */}
            <section className="apm-section">
              <SectionHeader step="2" icon="🩺" title="Medical Information" subtitle="Health conditions and history" />
              <div className="apm-grid">
                <Field label="Primary Condition" required error={errors.condition}>
                  <Select value={form.condition} onChange={set('condition')} error={errors.condition}>
                    <option value="">Select a condition…</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>

                <Field label="Current Medications">
                  <Input type="text" placeholder="e.g. Metformin, Levothyroxine"
                    value={form.medications} onChange={set('medications')} />
                </Field>

                <Field label="Known Allergies">
                  <Input type="text" placeholder="e.g. Penicillin, Peanuts (or 'None')"
                    value={form.allergies} onChange={set('allergies')} />
                </Field>

                <Field label="Menstrual Health">
                  <Select value={form.menstrual} onChange={set('menstrual')}>
                    <option value="">Select…</option>
                    {MENSTRUAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
            </section>

            {/* ── Section 3: Lifestyle ── */}
            <section className="apm-section">
              <SectionHeader step="3" icon="🌿" title="Lifestyle" subtitle="Daily habits and wellness indicators" />
              <div className="apm-grid">
                <Field label="Sleep">
                  <Select value={form.sleep} onChange={set('sleep')}>
                    <option value="">Select…</option>
                    {SLEEP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>

                <Field label="Stress Level">
                  <Select value={form.stress} onChange={set('stress')}>
                    <option value="">Select…</option>
                    {STRESS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>

                <Field label="Activity Level">
                  <Select value={form.activity} onChange={set('activity')}>
                    <option value="">Select…</option>
                    {ACTIVITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>

                <Field label="Work Type">
                  <Select value={form.workType} onChange={set('workType')}>
                    <option value="">Select…</option>
                    {WORK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
            </section>

            {/* ── Section 4: Food Habits ── */}
            <section className="apm-section">
              <SectionHeader step="4" icon="🥗" title="Food Habits" subtitle="Dietary preferences and patterns" />
              <div className="apm-grid">
                <Field label="Diet Type">
                  <div className="apm-toggle-group">
                    {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map(d => (
                      <button
                        key={d}
                        type="button"
                        className={`apm-toggle ${form.dietType === d ? 'apm-toggle--active-diet' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, dietType: d }))}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Meal Timing">
                  <Select value={form.mealTiming} onChange={set('mealTiming')}>
                    <option value="">Select…</option>
                    {MEAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>

                <Field label="Food Dislikes / Avoidances" full>
                  <Input type="text" placeholder="e.g. Broccoli, dairy, spicy food"
                    value={form.foodDislikes} onChange={set('foodDislikes')} />
                </Field>

                <Field label="Weekly Food Budget">
                  <Select value={form.budget} onChange={set('budget')}>
                    <option value="">Select…</option>
                    {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </Select>
                </Field>
              </div>
            </section>

            {/* ── Section 5: Reports ── */}
            <section className="apm-section apm-section--last">
              <SectionHeader step="5" icon="📁" title="Reports" subtitle="Upload any existing lab or medical reports" />
              <div className="apm-grid">
                <ReportUpload
                  files={form.reports}
                  onChange={(updater) => setForm(prev => ({ ...prev, reports: updater(prev.reports) }))}
                />
              </div>
            </section>

          </div>

          {/* ── Footer ── */}
          <div className="apm-footer">
            <div>
              <p className="apm-footer__hint"><span className="apm-required">*</span> Required fields</p>
              {errors.submit && (
                <p className="apm-submit-error">⚠️ {errors.submit}</p>
              )}
            </div>
            <div className="apm-footer__btns">
              <button type="button" className="apm-btn apm-btn--cancel" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="apm-btn apm-btn--save" disabled={saving}>
                {saving ? <><span className="apm-spinner" /> Saving…</> : '✓ Save Patient'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
