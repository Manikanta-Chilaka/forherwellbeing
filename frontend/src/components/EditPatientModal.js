import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabaseClient';
/* Reuse AddPatientModal styles — same design language */
import './AddPatientModal.css';
import './EditPatientModal.css';

/* ─── Options (mirror AddPatientModal) ──────────────── */
const CONDITIONS = [
  'Lupus', 'PCOS', 'Menopause Care', 'Thyroid Disorder',
  'Hormonal Imbalance', 'Rheumatoid Arthritis', 'Fibromyalgia',
  'Endometriosis', "Hashimoto's Disease", 'Multiple Sclerosis',
  'Irritable Bowel Syndrome', 'Chronic Fatigue Syndrome', 'Other',
];
const DOCTORS          = ['Dr. Raga Deepthi'];
const SLEEP_OPTIONS    = ['Less than 4 hrs', '4–5 hrs', '6–7 hrs', '8+ hrs'];
const STRESS_OPTIONS   = ['Low', 'Moderate', 'High', 'Severe'];
const ACTIVITY_OPTIONS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const WORK_OPTIONS     = ['Work from Home', 'Office / Field', 'Physical Labour', 'Student', 'Homemaker', 'Other'];
const MEAL_OPTIONS     = ['1–2 meals/day', '3 meals/day', '3 meals + snacks', 'Intermittent fasting'];
const BUDGET_OPTIONS   = ['Under ₦5,000/wk', '₦5,000–10,000/wk', '₦10,000–20,000/wk', '₦20,000+/wk'];
const MENSTRUAL_OPTIONS= ['Regular', 'Irregular', 'Heavy bleeding', 'Painful periods', 'Absent (amenorrhea)', 'Post-menopausal', 'Not applicable'];
const CONSULT_STATUSES = ['Scheduled', 'Completed', 'Pending', 'Cancelled', 'Upcoming'];
const PATIENT_STATUSES = ['Active', 'Pending', 'Inactive'];

/* ─── Seed form from patient object ─────────────────── */
function seedForm(patient) {
  if (!patient) return {};
  return {
    name:          patient.name          || '',
    phone:         patient.phone         || '',
    age:           patient.age           || '',
    height:        patient.height        || '',
    weight:        patient.weight        || '',
    city:          patient.city          || '',
    condition:     patient.condition     || '',
    medications:   patient.medications   || '',
    allergies:     patient.allergies     || '',
    menstrual:     patient.menstrual     || '',
    sleep:         patient.sleep         || '',
    stress:        patient.stress        || '',
    activity:      patient.activity      || '',
    workType:      patient.workType      || '',
    dietType:      patient.dietType      || 'Vegetarian',
    foodDislikes:  patient.foodDislikes  || '',
    mealTiming:    patient.mealTiming    || '',
    budget:        patient.budget        || '',
    paymentStatus: patient.paymentStatus || 'Pending',
    paymentMode:   patient.paymentMode   || 'Cash',
    amountPaid:    patient.amountPaid    || '',
    consultStatus:      patient.consultStatus      || 'Scheduled',
    doctor:             patient.doctor             || '',
    notes:              patient.notes              || '',
    status:             patient.status             || 'Active',
    consultationDate:   patient.consultationDate   || '',
    consultationTime:   patient.consultationTime   || '',
    assignedDoctor:     patient.assignedDoctor     || 'Dr. Raga Deepthi',
    consultationStatus: patient.consultationStatus || 'Scheduled',
  };
}

/* ─── Validation ─────────────────────────────────────── */
function validate(form) {
  const e = {};
  if (!form.name.trim())  e.name  = 'Patient name is required.';
  if (!form.phone.trim()) e.phone = 'Phone number is required.';
  else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone))
                          e.phone = 'Enter a valid phone number.';
  if (!form.age)          e.age   = 'Age is required.';
  else if (form.age < 1 || form.age > 120)
                          e.age   = 'Enter a valid age (1–120).';
  if (!form.condition)    e.condition = 'Please select a condition.';
  if (!form.doctor)       e.doctor    = 'Please assign a doctor.';
  return e;
}

/* ─── Reusable primitives ────────────────────────────── */
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

function Textarea({ ...props }) {
  return <textarea className="apm-input apm-textarea" rows={3} {...props} />;
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

/* ─── Changed indicator dot ──────────────────────────── */
function ChangedDot({ original, current }) {
  const changed = String(original ?? '') !== String(current ?? '');
  return changed ? <span className="epm-changed-dot" title="Modified" /> : null;
}

/* ─── Main Modal ─────────────────────────────────────── */
export default function EditPatientModal({ open, patient, onClose, onUpdate }) {
  const [form, setForm]         = useState(() => seedForm(patient));
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [newReports, setNewReports] = useState([]);
  const [existingReports, setExistingReports] = useState([]);
  const [uploadDrag, setUploadDrag] = useState(false);
  const reportInputRef          = useRef(null);
  const bodyRef                 = useRef(null);

  /* Re-seed when patient prop changes (different patient opened) */
  useEffect(() => {
    if (patient) {
      setForm(seedForm(patient));
      setErrors({});
      setNewReports([]);
      setExistingReports(patient.reports || []);
    }
  }, [patient]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
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

    // Upload any new report files
    const uploadedNew = [];
    for (const file of newReports) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `patient-reports/${fileName}`;
      const { error: uploadErr } = await supabase.storage.from('reports').upload(filePath, file);
      if (!uploadErr) {
        const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(filePath);
        uploadedNew.push({ name: file.name, url: publicUrl, size: file.size, type: file.type, uploadedAt: new Date().toISOString() });
      }
    }

    // Merge existing (possibly pruned) + newly uploaded
    const mergedReports = [...existingReports, ...uploadedNew];

    const result = await onUpdate(patient.id, { ...form, reports: mergedReports });
    setSaving(false);
    if (result?.success === false) {
      setErrors({ submit: result.error || 'Failed to update patient. Please try again.' });
      return;
    }
    handleClose();
  }

  if (!open || !patient) return null;

  const orig = patient; // shorthand for original values

  return createPortal(
    <div className="apm-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="apm-modal epm-modal" role="dialog" aria-modal="true" aria-label="Edit Patient">

        {/* ── Header ── */}
        <div className="apm-header epm-header">
          <div className="apm-header__left">
            <div className="apm-header__icon epm-icon">✏️</div>
            <div>
              <h2 className="apm-header__title">Edit Patient</h2>
              <p className="apm-header__sub">
                Updating record for <strong>{patient.name}</strong>
                <span className="epm-id"> · {patient.id}</span>
              </p>
            </div>
          </div>
          <button className="apm-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        {/* ── Changed fields notice ── */}
        <div className="epm-notice">
          <span>🔵</span>
          <span>Fields with a blue dot have been modified from the original value.</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="apm-body" ref={bodyRef}>

            {/* ── 1. Basic Information ── */}
            <section className="apm-section">
              <SectionHeader step="1" icon="📋" title="Basic Information" subtitle="Patient personal details" />
              <div className="apm-grid">

                <Field label="Patient Name" required error={errors.name}>
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. Amaka Okonkwo"
                      value={form.name} onChange={set('name')} error={errors.name} />
                    <ChangedDot original={orig.name} current={form.name} />
                  </div>
                </Field>

                <Field label="Phone Number" required error={errors.phone}>
                  <div className="epm-input-wrap">
                    <Input type="tel" placeholder="+234 800 000 0000"
                      value={form.phone} onChange={set('phone')} error={errors.phone} />
                    <ChangedDot original={orig.phone} current={form.phone} />
                  </div>
                </Field>

                <Field label="Age" required error={errors.age}>
                  <div className="epm-input-wrap">
                    <Input type="number" placeholder="e.g. 32" min={1} max={120}
                      value={form.age} onChange={set('age')} error={errors.age} />
                    <ChangedDot original={orig.age} current={form.age} />
                  </div>
                </Field>

                <Field label="City">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. Lagos"
                      value={form.city} onChange={set('city')} />
                    <ChangedDot original={orig.city} current={form.city} />
                  </div>
                </Field>

                <Field label="Height (cm)">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. 163 cm"
                      value={form.height} onChange={set('height')} />
                    <ChangedDot original={orig.height} current={form.height} />
                  </div>
                </Field>

                <Field label="Weight (kg)">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. 72 kg"
                      value={form.weight} onChange={set('weight')} />
                    <ChangedDot original={orig.weight} current={form.weight} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 2. Medical Information ── */}
            <section className="apm-section">
              <SectionHeader step="2" icon="🩺" title="Medical Information" subtitle="Health conditions and history" />
              <div className="apm-grid">

                <Field label="Primary Condition" required error={errors.condition}>
                  <div className="epm-input-wrap">
                    <Select value={form.condition} onChange={set('condition')} error={errors.condition}>
                      <option value="">Select a condition…</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                    <ChangedDot original={orig.condition} current={form.condition} />
                  </div>
                </Field>

                <Field label="Current Medications">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. Metformin"
                      value={form.medications} onChange={set('medications')} />
                    <ChangedDot original={orig.medications} current={form.medications} />
                  </div>
                </Field>

                <Field label="Known Allergies">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. Penicillin"
                      value={form.allergies} onChange={set('allergies')} />
                    <ChangedDot original={orig.allergies} current={form.allergies} />
                  </div>
                </Field>

                <Field label="Menstrual Health">
                  <div className="epm-input-wrap">
                    <Select value={form.menstrual} onChange={set('menstrual')}>
                      <option value="">Select…</option>
                      {MENSTRUAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.menstrual} current={form.menstrual} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 3. Lifestyle ── */}
            <section className="apm-section">
              <SectionHeader step="3" icon="🌿" title="Lifestyle" subtitle="Daily habits and wellness indicators" />
              <div className="apm-grid">

                <Field label="Sleep">
                  <div className="epm-input-wrap">
                    <Select value={form.sleep} onChange={set('sleep')}>
                      <option value="">Select…</option>
                      {SLEEP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.sleep} current={form.sleep} />
                  </div>
                </Field>

                <Field label="Stress Level">
                  <div className="epm-input-wrap">
                    <Select value={form.stress} onChange={set('stress')}>
                      <option value="">Select…</option>
                      {STRESS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.stress} current={form.stress} />
                  </div>
                </Field>

                <Field label="Activity Level">
                  <div className="epm-input-wrap">
                    <Select value={form.activity} onChange={set('activity')}>
                      <option value="">Select…</option>
                      {ACTIVITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.activity} current={form.activity} />
                  </div>
                </Field>

                <Field label="Work Type">
                  <div className="epm-input-wrap">
                    <Select value={form.workType} onChange={set('workType')}>
                      <option value="">Select…</option>
                      {WORK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.workType} current={form.workType} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 4. Food Habits ── */}
            <section className="apm-section">
              <SectionHeader step="4" icon="🥗" title="Food Habits" subtitle="Dietary preferences and patterns" />
              <div className="apm-grid">

                <Field label="Diet Type">
                  <div className="epm-toggle-wrap">
                    <div className="apm-toggle-group">
                      {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map(d => (
                        <button key={d} type="button"
                          className={`apm-toggle ${form.dietType === d ? 'apm-toggle--active-diet' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, dietType: d }))}>
                          {d}
                        </button>
                      ))}
                    </div>
                    <ChangedDot original={orig.dietType} current={form.dietType} />
                  </div>
                </Field>

                <Field label="Meal Timing">
                  <div className="epm-input-wrap">
                    <Select value={form.mealTiming} onChange={set('mealTiming')}>
                      <option value="">Select…</option>
                      {MEAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.mealTiming} current={form.mealTiming} />
                  </div>
                </Field>

                <Field label="Food Dislikes" full>
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. Broccoli, dairy"
                      value={form.foodDislikes} onChange={set('foodDislikes')} />
                    <ChangedDot original={orig.foodDislikes} current={form.foodDislikes} />
                  </div>
                </Field>

                <Field label="Weekly Food Budget">
                  <div className="epm-input-wrap">
                    <Select value={form.budget} onChange={set('budget')}>
                      <option value="">Select…</option>
                      {BUDGET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </Select>
                    <ChangedDot original={orig.budget} current={form.budget} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 5. Status & Consultation ── */}
            <section className="apm-section">
              <SectionHeader step="5" icon="📅" title="Status & Consultation" subtitle="Current patient and consultation state" />
              <div className="apm-grid">

                <Field label="Patient Status">
                  <div className="epm-input-wrap">
                    <Select value={form.status} onChange={set('status')}>
                      {PATIENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <ChangedDot original={orig.status} current={form.status} />
                  </div>
                </Field>

                <Field label="Consultation Status">
                  <div className="epm-input-wrap">
                    <Select value={form.consultStatus} onChange={set('consultStatus')}>
                      {CONSULT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <ChangedDot original={orig.consultStatus} current={form.consultStatus} />
                  </div>
                </Field>

                <Field label="Payment Status">
                  <div className="epm-toggle-wrap">
                    <div className="apm-toggle-group">
                      {['Paid', 'Pending', 'Overdue'].map(s => (
                        <button key={s} type="button"
                          className={`apm-toggle ${form.paymentStatus === s ? `apm-toggle--active-${s.toLowerCase()}` : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, paymentStatus: s }))}>
                          {s === 'Paid' ? '✓ Paid' : s === 'Pending' ? '⏳ Pending' : '⚠️ Overdue'}
                        </button>
                      ))}
                    </div>
                    <ChangedDot original={orig.paymentStatus} current={form.paymentStatus} />
                  </div>
                </Field>

                <Field label="Payment Mode">
                  <div className="epm-input-wrap">
                    <Select value={form.paymentMode} onChange={set('paymentMode')}>
                      {['Cash', 'UPI', 'Online Transfer', 'Card'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                    <ChangedDot original={orig.paymentMode} current={form.paymentMode} />
                  </div>
                </Field>

                <Field label="Amount Paid (₦)">
                  <div className="epm-input-wrap">
                    <Input type="text" placeholder="e.g. ₦15,000"
                      value={form.amountPaid} onChange={set('amountPaid')} />
                    <ChangedDot original={orig.amountPaid} current={form.amountPaid} />
                  </div>
                </Field>

                <Field label="Assigned Doctor" required error={errors.doctor}>
                  <div className="epm-input-wrap">
                    <Select value={form.doctor} onChange={set('doctor')} error={errors.doctor}>
                      <option value="">Select a doctor…</option>
                      {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>
                    <ChangedDot original={orig.doctor} current={form.doctor} />
                  </div>
                </Field>

                <Field label="Doctor Notes" full>
                  <div className="epm-input-wrap">
                    <Textarea placeholder="Clinical notes for this patient…"
                      value={form.notes} onChange={set('notes')} />
                    <ChangedDot original={orig.notes} current={form.notes} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 6. Consultation Details ── */}
            <section className="apm-section apm-section--last">
              <SectionHeader step="6" icon="🗓️" title="Consultation Details" subtitle="Booking date, time and doctor assignment" />
              <div className="apm-grid">

                <Field label="Consultation Date">
                  <div className="epm-input-wrap">
                    <Input
                      type="date"
                      value={form.consultationDate}
                      onChange={set('consultationDate')}
                    />
                    <ChangedDot original={orig.consultationDate} current={form.consultationDate} />
                  </div>
                </Field>

                <Field label="Consultation Time">
                  <div className="epm-input-wrap">
                    <Input
                      type="time"
                      value={form.consultationTime}
                      onChange={set('consultationTime')}
                    />
                    <ChangedDot original={orig.consultationTime} current={form.consultationTime} />
                  </div>
                </Field>

                <Field label="Assigned Doctor">
                  <div className="epm-input-wrap">
                    <Select value={form.assignedDoctor} onChange={set('assignedDoctor')}>
                      <option value="">Select a doctor…</option>
                      {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>
                    <ChangedDot original={orig.assignedDoctor} current={form.assignedDoctor} />
                  </div>
                </Field>

                <Field label="Consultation Status">
                  <div className="epm-input-wrap">
                    <Select value={form.consultationStatus} onChange={set('consultationStatus')}>
                      {['Scheduled', 'Completed', 'Pending'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                    <ChangedDot original={orig.consultationStatus} current={form.consultationStatus} />
                  </div>
                </Field>

              </div>
            </section>

            {/* ── 7. Lab Reports Upload ── */}
            <section className="apm-section apm-section--last">
              <SectionHeader step="7" icon="🧪" title="Lab Reports" subtitle="Upload or manage patient lab reports" />
              
              {/* Existing Reports */}
              {existingReports.length > 0 && (
                <div className="epm-reports-existing">
                  <p className="epm-reports-label">Uploaded Reports ({existingReports.length})</p>
                  <div className="epm-reports-list">
                    {existingReports.map((r, i) => (
                      <div key={i} className="epm-report-row">
                        <span className="epm-report-icon">📄</span>
                        <div className="epm-report-info">
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="epm-report-name">{r.name}</a>
                          <span className="epm-report-meta">
                            {r.size ? `${(r.size / 1024).toFixed(1)} KB` : ''}
                            {r.uploadedAt ? ` · ${new Date(r.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="epm-report-delete"
                          title="Remove this report"
                          onClick={() => setExistingReports(prev => prev.filter((_, idx) => idx !== i))}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New File Upload Zone */}
              <div
                className={`epm-dropzone ${uploadDrag ? 'epm-dropzone--over' : ''}`}
                onDragOver={e => { e.preventDefault(); setUploadDrag(true); }}
                onDragLeave={() => setUploadDrag(false)}
                onDrop={e => {
                  e.preventDefault();
                  setUploadDrag(false);
                  const files = Array.from(e.dataTransfer.files);
                  setNewReports(prev => [...prev, ...files]);
                }}
                onClick={() => reportInputRef.current?.click()}
              >
                <input
                  ref={reportInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  hidden
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    setNewReports(prev => [...prev, ...files]);
                    e.target.value = '';
                  }}
                />
                <span style={{ fontSize: '28px' }}>📁</span>
                <p className="epm-dropzone-title">Drag & drop or click to upload reports</p>
                <p className="epm-dropzone-hint">JPG, PNG, PDF accepted · Multiple files allowed</p>
              </div>

              {/* Preview new files */}
              {newReports.length > 0 && (
                <div className="epm-reports-new">
                  <p className="epm-reports-label">New files to upload ({newReports.length})</p>
                  <div className="epm-reports-list">
                    {newReports.map((f, i) => (
                      <div key={i} className="epm-report-row epm-report-row--new">
                        <span className="epm-report-icon">🆕</span>
                        <div className="epm-report-info">
                          <span className="epm-report-name">{f.name}</span>
                          <span className="epm-report-meta">{(f.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button
                          type="button"
                          className="epm-report-delete"
                          onClick={() => setNewReports(prev => prev.filter((_, idx) => idx !== i))}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

          {/* ── Footer ── */}
          <div className="apm-footer">
            <p className="apm-footer__hint">
              <span className="apm-required">*</span> Required fields
            </p>
            <div className="apm-footer__btns">
              <button type="button" className="apm-btn apm-btn--cancel" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="apm-btn apm-btn--save epm-btn-update" disabled={saving}>
                {saving
                  ? <><span className="apm-spinner" /> Updating…</>
                  : '✓ Update Patient'
                }
              </button>
            </div>
          </div>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
