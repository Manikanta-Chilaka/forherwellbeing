import { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { usePatients } from '../context/PatientsContext';
import { getTemplate } from '../data/dietTemplates';
import { Clock, CheckCircle, Send, Target, Ban, Pill, ClipboardList, Search } from 'lucide-react';
import './DietView.css';

/* ─── Diet status badge ──────────────────────────────── */
function DietStatusBadge({ value }) {
  const map = {
    pending: { cls: 'dv-badge--pending', label: 'Pending',  icon: <Clock size={13} /> },
    ready:   { cls: 'dv-badge--ready',   label: 'Ready',    icon: <CheckCircle size={13} /> },
    sent:    { cls: 'dv-badge--sent',    label: 'Sent',     icon: <Send size={13} /> },
  };
  const s = map[value?.toLowerCase()] || map.pending;
  return <span className={`dv-badge ${s.cls}`}>{s.icon} {s.label}</span>;
}

/* ─── Main Page ──────────────────────────────────────── */
export default function DietView() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const isDoctor     = location.pathname.startsWith('/doctor');
  const basePath     = isDoctor ? '/doctor' : '/staff';

  const { patients, updatePatient } = usePatients();

  const patient = patients.find(p => p.id === id);

  const [sent, setSent]           = useState(false);
  const [justMarked, setJustMarked] = useState(false);

  if (!patient) {
    return (
      <div className="dv-not-found">
        <Search size={40} className="dv-not-found__emoji" />
        <h2>Patient not found</h2>
        <button className="dv-btn dv-btn--primary" onClick={() => navigate(`${basePath}/dashboard`)}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const template   = getTemplate(patient.condition);
  const dietStatus = patient.dietStatus || 'Pending';
  const alreadySent = dietStatus === 'Sent' || sent;

  function handleMarkSent() {
    updatePatient(patient.id, { dietStatus: 'Sent' });
    setSent(true);
    setJustMarked(true);
    setTimeout(() => setJustMarked(false), 4000);
  }

  return (
    <div className="dv-page">

      {/* ── Breadcrumb ── */}
      <nav className="dv-breadcrumb">
        <Link to={`${basePath}/dashboard`} className="dv-bc-link">Dashboard</Link>
        <span className="dv-bc-sep">›</span>
        <Link to={`${basePath}/patients/${patient.id}`} className="dv-bc-link">
          {patient.name}
        </Link>
        <span className="dv-bc-sep">›</span>
        <span className="dv-bc-current">Diet Plan</span>
      </nav>

      {/* ── Header ── */}
      <div className="dv-header">
        <div className="dv-header__left">
          <button className="dv-back" onClick={() => navigate(`${basePath}/patients/${patient.id}`)}>
            ← Back to Patient
          </button>
          <div className="dv-header__info">
            <div className="dv-header__avatar">{patient.name.charAt(0)}</div>
            <div>
              <h1 className="dv-header__name">{patient.name}</h1>
              <p className="dv-header__meta">
                {patient.condition} · {patient.age} yrs · {patient.assignedDoctor || patient.doctor || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
        <div className="dv-header__right">
          <DietStatusBadge value={alreadySent ? 'Sent' : dietStatus} />
        </div>
      </div>

      {/* ── Mark as Sent bar ── */}
      <div className="dv-action-bar">
        <div className="dv-action-bar__text">
          <p className="dv-action-bar__title">
            {alreadySent
              ? 'Diet plan has been sent to this patient.'
              : 'Ready to send this diet plan to the patient?'}
          </p>
          <p className="dv-action-bar__sub">
            Condition: <strong>{patient.condition}</strong> · Doctor: <strong>{patient.assignedDoctor || patient.doctor || '—'}</strong>
          </p>
        </div>
        <div className="dv-action-bar__right">
          <button
            className={`dv-send-btn ${alreadySent ? 'dv-send-btn--sent' : ''}`}
            onClick={handleMarkSent}
            disabled={alreadySent}
          >
            {alreadySent ? 'Sent' : 'Mark as Sent'}
          </button>
        </div>
      </div>

      {/* ── Success message ── */}
      <div className={`dv-success ${justMarked ? 'dv-success--show' : ''}`}>
        <span className="dv-success__icon"><CheckCircle size={20} /></span>
        Diet marked as sent. The patient will be notified.
      </div>

      {/* ── Diet Content ── */}
      <div className="dv-body">

        {/* Goal */}
        <div className="dv-card">
          <div className="dv-card__head">
            <span className="dv-card__icon"><Target size={18} /></span>
            <h3 className="dv-card__title">Goal</h3>
          </div>
          <p className="dv-goal">{template.goal}</p>
        </div>

        {/* Meal Plan */}
        <div className="dv-card">
          <div className="dv-card__head">
            <span className="dv-card__icon"><Clock size={18} /></span>
            <h3 className="dv-card__title">Daily Meal Schedule</h3>
          </div>
          <div className="dv-meals">
            {template.meals.map((meal, i) => (
              <div key={i} className="dv-meal-row">
                <div className="dv-meal-time">{meal.time}</div>
                <div className="dv-meal-items">{meal.items}</div>
                {meal.notes && <div className="dv-meal-note">{meal.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Two column: avoid + supplements */}
        <div className="dv-two-col">
          <div className="dv-card">
            <div className="dv-card__head">
              <span className="dv-card__icon"><Ban size={18} /></span>
              <h3 className="dv-card__title">Foods to Avoid</h3>
            </div>
            <div className="dv-tags">
              {template.avoid.map((item, i) => (
                <span key={i} className="dv-tag dv-tag--avoid">{item}</span>
              ))}
            </div>
          </div>

          <div className="dv-card">
            <div className="dv-card__head">
              <span className="dv-card__icon"><Pill size={18} /></span>
              <h3 className="dv-card__title">Recommended Supplements</h3>
            </div>
            <div className="dv-tags">
              {template.supplements.map((s, i) => (
                <span key={i} className="dv-tag dv-tag--supp">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Patient food preferences note */}
        {(patient.foodDislikes || patient.dietType) && (
          <div className="dv-card dv-card--note">
            <div className="dv-card__head">
              <span className="dv-card__icon"><ClipboardList size={18} /></span>
              <h3 className="dv-card__title">Patient Preferences</h3>
            </div>
            <div className="dv-pref-grid">
              {patient.dietType && (
                <div className="dv-pref-item">
                  <span className="dv-pref-label">Diet Type</span>
                  <span className="dv-pref-value">{patient.dietType}</span>
                </div>
              )}
              {patient.foodDislikes && (
                <div className="dv-pref-item">
                  <span className="dv-pref-label">Dislikes / Avoids</span>
                  <span className="dv-pref-value">{patient.foodDislikes}</span>
                </div>
              )}
              {patient.mealTiming && (
                <div className="dv-pref-item">
                  <span className="dv-pref-label">Meal Timing</span>
                  <span className="dv-pref-value">{patient.mealTiming}</span>
                </div>
              )}
              {patient.budget && (
                <div className="dv-pref-item">
                  <span className="dv-pref-label">Budget</span>
                  <span className="dv-pref-value">{patient.budget}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
