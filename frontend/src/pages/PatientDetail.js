import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientsContext';
import EditPatientModal from '../components/EditPatientModal';
import './PatientDetail.css';

/* ─── Badge ─────────────────────────────────────────────── */
function Badge({ value }) {
  const map = {
    // patient status
    active:   'pd-badge--active',
    inactive: 'pd-badge--inactive',
    pending:  'pd-badge--pending',
    // payment
    paid:     'pd-badge--paid',
    overdue:  'pd-badge--overdue',
    // consultation
    completed:   'pd-badge--completed',
    scheduled:   'pd-badge--scheduled',
    cancelled:   'pd-badge--cancelled',
    upcoming:    'pd-badge--upcoming',
    'in progress': 'pd-badge--inprogress',
  };
  const cls = map[value?.toLowerCase()] || 'pd-badge--default';
  return <span className={`pd-badge ${cls}`}>{value}</span>;
}

/* ─── Info Row (label + value) ───────────────────────────── */
function InfoRow({ label, value, badge, badgeType }) {
  return (
    <div className="pd-info-row">
      <span className="pd-info-label">{label}</span>
      {badge
        ? <Badge value={value} type={badgeType} />
        : <span className="pd-info-value">{value || '—'}</span>
      }
    </div>
  );
}

/* ─── Section Card ───────────────────────────────────────── */
function Card({ title, icon, children }) {
  return (
    <div className="pd-card">
      {title && (
        <div className="pd-card__head">
          {icon && <span className="pd-card__icon">{icon}</span>}
          <h4 className="pd-card__title">{title}</h4>
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── Tabs ───────────────────────────────────────────────── */
const TABS = [
  { key: 'overview',     label: 'Overview',      icon: '📊' },
  { key: 'medical',      label: 'Medical Info',  icon: '🩺' },
  { key: 'lifestyle',    label: 'Lifestyle',     icon: '🌿' },
  { key: 'food',         label: 'Food Habits',   icon: '🥗' },
  { key: 'consultation', label: 'Consultation',  icon: '📅' },
];

/* ─── Tab: Overview ──────────────────────────────────────── */
function OverviewTab({ p }) {
  return (
    <div className="pd-tab-content">
      <div className="pd-overview-grid">
        <Card title="Personal Details" icon="👤">
          <InfoRow label="Full Name"    value={p.name} />
          <InfoRow label="Phone"        value={p.phone} />
          <InfoRow label="Age"          value={`${p.age} years`} />
          <InfoRow label="City"         value={p.city} />
          <InfoRow label="Height"       value={p.height} />
          <InfoRow label="Weight"       value={p.weight} />
        </Card>

        <Card title="Health Summary" icon="🩺">
          <InfoRow label="Primary Condition"   value={p.condition} />
          <InfoRow label="Patient Status"      value={p.status}        badge />
          <InfoRow label="Payment Status"      value={p.paymentStatus} badge />
          <InfoRow label="Consultation Status" value={p.consultStatus} badge />
          <InfoRow label="Assigned Doctor"     value={p.doctor} />
          <InfoRow label="Registered"          value={p.createdDate} />
        </Card>
      </div>

      {p.notes && (
        <Card title="Doctor Notes" icon="📝">
          <p className="pd-notes">{p.notes}</p>
        </Card>
      )}
    </div>
  );
}

/* ─── Tab: Medical ───────────────────────────────────────── */
function MedicalTab({ p }) {
  return (
    <div className="pd-tab-content">
      <Card title="Medical Information" icon="🩺">
        <InfoRow label="Primary Condition"   value={p.condition} />
        <InfoRow label="Current Medications" value={p.medications} />
        <InfoRow label="Known Allergies"     value={p.allergies} />
        <InfoRow label="Menstrual Health"    value={p.menstrual} />
      </Card>
    </div>
  );
}

/* ─── Tab: Lifestyle ─────────────────────────────────────── */
function LifestyleTab({ p }) {
  const items = [
    { label: 'Sleep',          value: p.sleep,    icon: '😴' },
    { label: 'Stress Level',   value: p.stress,   icon: '🧠' },
    { label: 'Activity Level', value: p.activity, icon: '🏃‍♀️' },
    { label: 'Work Type',      value: p.workType, icon: '💼' },
  ];

  const stressColor = { Low: 'green', Moderate: 'amber', High: 'red', Severe: 'red' };

  return (
    <div className="pd-tab-content">
      <div className="pd-lifestyle-grid">
        {items.map(({ label, value, icon }) => (
          <div key={label} className="pd-lifestyle-card">
            <span className="pd-lifestyle-icon">{icon}</span>
            <p className="pd-lifestyle-label">{label}</p>
            <p className={`pd-lifestyle-value ${label === 'Stress Level' ? `pd-lifestyle-value--${stressColor[value] || 'default'}` : ''}`}>
              {value || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab: Food ──────────────────────────────────────────── */
function FoodTab({ p }) {
  return (
    <div className="pd-tab-content">
      <Card title="Food Habits" icon="🥗">
        <InfoRow label="Diet Type"             value={p.dietType} />
        <InfoRow label="Meal Timing"           value={p.mealTiming} />
        <InfoRow label="Food Dislikes"         value={p.foodDislikes} />
        <InfoRow label="Weekly Food Budget"    value={p.budget} />
      </Card>
    </div>
  );
}

/* ─── Tab: Consultation ──────────────────────────────────── */
function ConsultationTab({ p }) {
  return (
    <div className="pd-tab-content">
      <Card title="Current Consultation" icon="📅">
        <InfoRow label="Status"          value={p.consultStatus} badge />
        <InfoRow label="Assigned Doctor" value={p.doctor} />
        <InfoRow label="Date"            value={p.consultDate} />
        <InfoRow label="Payment"         value={p.paymentStatus} badge />
        <InfoRow label="Amount Paid"     value={p.amountPaid} />
        <InfoRow label="Payment Mode"    value={p.paymentMode} />
      </Card>

      {p.consultHistory?.length > 0 && (
        <Card title="Consultation History" icon="📋">
          <div className="pd-timeline">
            {p.consultHistory.map((c, i) => (
              <div key={i} className="pd-timeline-item">
                <div className="pd-timeline-dot" />
                <div className="pd-timeline-body">
                  <div className="pd-timeline-top">
                    <span className="pd-timeline-type">{c.type}</span>
                    <Badge value={c.status} />
                  </div>
                  <p className="pd-timeline-meta">{c.doctor} · {c.date}</p>
                  <p className="pd-timeline-note">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── Left Summary Card ──────────────────────────────────── */
function SummaryCard({ p }) {
  return (
    <aside className="pd-summary">
      <div className="pd-summary__avatar">
        {p.name.charAt(0)}
      </div>
      <p className="pd-summary__name">{p.name}</p>
      <p className="pd-summary__condition">{p.condition}</p>

      <div className="pd-summary__badges">
        <Badge value={p.paymentStatus} />
        <Badge value={p.consultStatus} />
      </div>

      <div className="pd-summary__divider" />

      <div className="pd-summary__meta">
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Patient ID</span>
          <span className="pd-summary__meta-value pd-mono">{p.id}</span>
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Age</span>
          <span className="pd-summary__meta-value">{p.age} years</span>
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">City</span>
          <span className="pd-summary__meta-value">{p.city}</span>
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Doctor</span>
          <span className="pd-summary__meta-value">{p.doctor}</span>
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Status</span>
          <Badge value={p.status} />
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Registered</span>
          <span className="pd-summary__meta-value">{p.createdDate}</span>
        </div>
        <div className="pd-summary__meta-item">
          <span className="pd-summary__meta-label">Amount Paid</span>
          <span className="pd-summary__meta-value">{p.amountPaid}</span>
        </div>
      </div>
    </aside>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function PatientDetail() {
  const { id }              = useParams();
  const navigate            = useNavigate();
  const { patients, updatePatient } = usePatients();
  const [tab, setTab]       = useState('overview');
  const [editOpen, setEditOpen] = useState(false);

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="pd-not-found">
        <p className="pd-not-found__emoji">🔍</p>
        <h2>Patient not found</h2>
        <p>No patient with ID <strong>{id}</strong> exists.</p>
        <button className="pd-btn pd-btn--primary" onClick={() => navigate('/staff/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const activeTabContent = () => {
    switch (tab) {
      case 'overview':     return <OverviewTab      p={patient} />;
      case 'medical':      return <MedicalTab       p={patient} />;
      case 'lifestyle':    return <LifestyleTab      p={patient} />;
      case 'food':         return <FoodTab           p={patient} />;
      case 'consultation': return <ConsultationTab   p={patient} />;
      default:             return null;
    }
  };

  return (
    <div className="pd-page">

      {/* ── Top bar ── */}
      <header className="pd-topbar">
        <button className="pd-back" onClick={() => navigate('/staff/dashboard')}>
          ← Back to Patients
        </button>
        <div className="pd-topbar__right">
          <button
            className="pd-btn pd-btn--diet"
            onClick={() => navigate(`/staff/patients/${patient.id}/diet`)}
          >
            🥗 View Diet Plan
          </button>
          <button className="pd-btn pd-btn--outline" onClick={() => setEditOpen(true)}>✏️ Edit Patient</button>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="pd-header">
        <div className="pd-header__avatar">{patient.name.charAt(0)}</div>
        <div className="pd-header__info">
          <h1 className="pd-header__name">{patient.name}</h1>
          <div className="pd-header__meta">
            <span>📞 {patient.phone}</span>
            <span className="pd-dot">·</span>
            <span>🎂 {patient.age} yrs</span>
            <span className="pd-dot">·</span>
            <span>🩺 {patient.condition}</span>
            <span className="pd-dot">·</span>
            <span>📍 {patient.city}</span>
          </div>
          <div className="pd-header__badges">
            <Badge value={patient.status} />
            <Badge value={patient.paymentStatus} />
            <Badge value={patient.consultStatus} />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="pd-body">

        {/* Left summary */}
        <SummaryCard p={patient} />

        {/* Right detail */}
        <div className="pd-detail">
          <div className="pd-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`pd-tab ${tab === t.key ? 'pd-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="pd-tab-panel">
            {activeTabContent()}
          </div>
        </div>
      </div>

      <EditPatientModal
        open={editOpen}
        patient={patient}
        onClose={() => setEditOpen(false)}
        onUpdate={async (id, data) => {
          const result = await updatePatient(id, data);
          if (result?.success) setEditOpen(false);
          return result;
        }}
      />

    </div>
  );
}
