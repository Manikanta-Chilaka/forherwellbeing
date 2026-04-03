import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import AddPatientModal from '../components/AddPatientModal';
import { usePatients } from '../context/PatientsContext';

/* ─── Book Slot Modal ────────────────────────────────── */
const BOOK_INIT = {
  patientName: '', consultDate: '', consultTime: '',
  doctor: 'Dr. Raga Deepthi', type: 'Initial', notes: '',
};

function BookSlotModal({ open, patient, onClose }) {
  const { updatePatient } = usePatients();
  const [form, setForm]   = useState(BOOK_INIT);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  /* Pre-fill when a patient is passed */
  useEffect(() => {
    if (open && patient) {
      setForm({
        patientName: patient.name || '',
        consultDate: patient.consultationDate || '',
        consultTime: patient.consultationTime || '',
        doctor:      patient.assignedDoctor || patient.doctor || 'Dr. Raga Deepthi',
        type:        'Follow-up',
        notes:       '',
      });
    } else if (open && !patient) {
      setForm(BOOK_INIT);
    }
    setErrors({});
    setSaved(false);
  }, [open, patient]);

  function set(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    };
  }

  function validate() {
    const e = {};
    if (!form.consultDate) e.consultDate = 'Date is required';
    if (!form.consultTime) e.consultTime = 'Time is required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    /* Persist to patient record via context */
    if (patient) {
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      updatePatient(patient.id, {
        consultationDate:   form.consultDate,
        consultationTime:   form.consultTime,
        assignedDoctor:     form.doctor,
        doctor:             form.doctor,
        consultStatus:      'Scheduled',
        consultationStatus: 'Scheduled',
        consultDate:        form.consultDate,
        consultHistory: [
          {
            date:   today,
            type:   form.type,
            doctor: form.doctor,
            status: 'Upcoming',
            note:   form.notes || 'Slot booked by staff.',
          },
          ...(patient.consultHistory || []),
        ],
      });
    }

    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1400);
  }

  function handleClose() { setSaved(false); setErrors({}); onClose(); }

  if (!open) return null;

  return createPortal(
    <div className="bsm-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="bsm-modal" role="dialog" aria-modal="true">
        <div className="bsm-header">
          <div className="bsm-header__left">
            <div className="bsm-icon">📅</div>
            <div>
              <h2 className="bsm-title">Book Consultation Slot</h2>
              <p className="bsm-sub">Schedule a new patient consultation</p>
            </div>
          </div>
          <button className="bsm-close" onClick={handleClose}>✕</button>
        </div>

        {saved ? (
          <div className="bsm-success">
            <span className="bsm-success__icon">✅</span>
            <p>Slot booked successfully!</p>
          </div>
        ) : (
          <form className="bsm-form" onSubmit={handleSubmit} noValidate>
            <div className="bsm-grid">
              <div className="bsm-field bsm-field--full">
                <label className="bsm-label">Patient Name <span className="bsm-req">*</span></label>
                <input className="bsm-input" type="text" placeholder="e.g. Amaka Okonkwo"
                  required value={form.patientName} onChange={set('patientName')} />
              </div>

              <div className="bsm-field">
                <label className="bsm-label">Consultation Date <span className="bsm-req">*</span></label>
                <input className={`bsm-input${errors.consultDate ? ' bsm-input--error' : ''}`} type="date"
                  value={form.consultDate} onChange={set('consultDate')} />
                {errors.consultDate && <span className="bsm-error">{errors.consultDate}</span>}
              </div>

              <div className="bsm-field">
                <label className="bsm-label">Consultation Time <span className="bsm-req">*</span></label>
                <input className={`bsm-input${errors.consultTime ? ' bsm-input--error' : ''}`} type="time"
                  value={form.consultTime} onChange={set('consultTime')} />
                {errors.consultTime && <span className="bsm-error">{errors.consultTime}</span>}
              </div>

              <div className="bsm-field">
                <label className="bsm-label">Assigned Doctor</label>
                <select className="bsm-input bsm-select" value={form.doctor} onChange={set('doctor')}>
                  <option value="Dr. Raga Deepthi">Dr. Raga Deepthi</option>
                </select>
              </div>

              <div className="bsm-field">
                <label className="bsm-label">Consultation Type</label>
                <select className="bsm-input bsm-select" value={form.type} onChange={set('type')}>
                  {['Initial', 'Follow-up', 'Diet Review', 'Review'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="bsm-field bsm-field--full">
                <label className="bsm-label">Notes</label>
                <textarea className="bsm-input bsm-textarea" rows={3}
                  placeholder="Any notes for this consultation…"
                  value={form.notes} onChange={set('notes')} />
              </div>
            </div>

            <div className="bsm-footer">
              <button type="button" className="bsm-btn bsm-btn--cancel" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="bsm-btn bsm-btn--save">
                📅 Book Slot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ─── Static mock data ───────────────────────────────── */
const STATS = [
  { label: 'Total Patients',        value: '284',  change: '+12 this month', icon: '👥', color: 'blue'   },
  { label: "Today's Consultations", value: '8',    change: '3 remaining',    icon: '📋', color: 'purple' },
  { label: 'Pending Payments',      value: '17',   change: '₦340,000 due',   icon: '💳', color: 'amber'  },
  { label: 'Completed This Month',  value: '63',   change: '+8 vs last month',icon: '✅', color: 'green'  },
];


const CONSULTATIONS = [
  { time: '09:00 AM', patient: 'Amaka Okonkwo',   doctor: 'Dr. Suleiman',  type: 'Follow-up',      status: 'Completed' },
  { time: '10:30 AM', patient: 'Ngozi Adeyemi',   doctor: 'Dr. Okafor',    type: 'Initial',         status: 'Completed' },
  { time: '12:00 PM', patient: 'Fatima Bello',    doctor: 'Dr. Suleiman',  type: 'Diet Review',     status: 'In Progress' },
  { time: '02:00 PM', patient: 'Chidinma Eze',    doctor: 'Dr. Okafor',    type: 'Follow-up',      status: 'Upcoming' },
  { time: '03:30 PM', patient: 'Halima Musa',     doctor: 'Dr. Suleiman',  type: 'Initial',         status: 'Upcoming' },
  { time: '04:30 PM', patient: 'Kemi Adeleke',    doctor: 'Dr. Okafor',    type: 'Review',          status: 'Upcoming' },
];

const ACTIVITY = [
  { msg: 'New patient Halima Musa registered',           time: '10 mins ago',  icon: '👤' },
  { msg: 'Payment received from Ngozi Adeyemi — ₦15,000', time: '42 mins ago', icon: '💰' },
  { msg: 'Diet plan issued to Amaka Okonkwo',            time: '1 hr ago',     icon: '🥗' },
  { msg: 'Consultation booked for Fatima Bello',         time: '2 hrs ago',    icon: '📅' },
  { msg: 'Payment overdue: Kemi Adeleke',                time: '3 hrs ago',    icon: '⚠️' },
];

const NAV_ITEMS = [
  { label: 'Dashboard',       icon: '⬛', key: 'dashboard' },
  { label: 'Patients',        icon: '👥', key: 'patients'  },
  { label: 'Consultations',   icon: '📋', key: 'consults'  },
  { label: 'Payments',        icon: '💳', key: 'payments'  },
  { label: 'Diet Plans',      icon: '🥗', key: 'diet'      },
  { label: 'Reports',         icon: '📊', key: 'reports'   },
];

/* ─── Sub-components ─────────────────────────────────── */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside className={`sd-sidebar ${collapsed ? 'sd-sidebar--collapsed' : ''}`}>
      <div className="sd-sidebar__top">
        <div className="sd-sidebar__brand">
          {!collapsed && (
            <span className="sd-sidebar__logo">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>FOR</span>
              <span style={{ color: '#fff' }}>HER</span>
              <span style={{ color: '#93c5fd' }}>WELLBEING</span>
            </span>
          )}
          <button
            className="sd-sidebar__collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="sd-nav">
          {NAV_ITEMS.map(({ label, icon, key }) => (
            <button
              key={key}
              className={`sd-nav__item ${active === key ? 'sd-nav__item--active' : ''}`}
              onClick={() => setActive(key)}
              title={collapsed ? label : undefined}
            >
              <span className="sd-nav__icon">{icon}</span>
              {!collapsed && <span className="sd-nav__label">{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="sd-sidebar__bottom">
        <div className={`sd-sidebar__user ${collapsed ? 'sd-sidebar__user--collapsed' : ''}`}>
          <div className="sd-sidebar__avatar">S</div>
          {!collapsed && (
            <div className="sd-sidebar__user-info">
              <span className="sd-sidebar__user-name">Sarah Obi</span>
              <span className="sd-sidebar__user-role">Staff Coordinator</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="sd-logout">
            <span>⬛</span> Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}

function StatCard({ label, value, change, icon, color }) {
  return (
    <div className={`sd-stat sd-stat--${color}`}>
      <div className="sd-stat__top">
        <div className="sd-stat__icon">{icon}</div>
        <span className="sd-stat__value">{value}</span>
      </div>
      <p className="sd-stat__label">{label}</p>
      <p className="sd-stat__change">{change}</p>
    </div>
  );
}

function RecentPatients({ patients, loading, search, setSearch, onAddPatient, onView, onBookSlot }) {
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sd-card">
      <div className="sd-card__head">
        <div>
          <h3 className="sd-card__title">Recent Patients</h3>
          <p className="sd-card__sub">Latest registered patients</p>
        </div>
        <div className="sd-card__actions">
          <div className="sd-search">
            <span className="sd-search__icon">🔍</span>
            <input
              className="sd-search__input"
              placeholder="Search patients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="sd-btn sd-btn--primary" onClick={onAddPatient}>+ Add Patient</button>
        </div>
      </div>

      <div className="sd-table-wrap">
        {loading && (
          <div className="sd-empty">
            <span className="sd-empty__icon">⏳</span>
            <p className="sd-empty__title">Loading patients…</p>
          </div>
        )}
        <table className="sd-table" style={{ display: loading ? 'none' : 'table' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Payment</th>
              <th>Doctor</th>
              <th>Consult Date</th>
              <th>Consult Time</th>
              <th>Consult Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><span className="sd-id">{p.id}</span></td>
                <td>
                  <div className="sd-patient-cell">
                    <div className="sd-patient-avatar">
                      {p.name.charAt(0)}
                    </div>
                    <span className="sd-patient-name">{p.name}</span>
                  </div>
                </td>
                <td>{p.age}</td>
                <td><span className="sd-condition">{p.condition}</span></td>
                <td><span className={`sd-badge sd-badge--${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td className="sd-date">{p.date}</td>
                <td><span className={`sd-badge sd-badge--pay-${p.paymentStatus.toLowerCase()}`}>{p.paymentStatus}</span></td>
                <td className="sd-date">{p.doctor || '—'}</td>
                <td className="sd-date">{p.consultationDate || '—'}</td>
                <td className="sd-date">{p.consultationTime || '—'}</td>
                <td>
                  {p.consultStatus
                    ? <span className={`sd-badge sd-badge--cs-${p.consultStatus.toLowerCase().replace(' ', '-')}`}>{p.consultStatus}</span>
                    : <span className="sd-date">—</span>
                  }
                </td>
                <td>
                  <div className="sd-row-actions">
                    <button className="sd-icon-btn" title="View" onClick={() => onView(p.id)}>👁</button>
                    <button className="sd-icon-btn" title="Book Slot" onClick={() => onBookSlot(p)}>📋</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="sd-empty">
            {patients.length === 0 ? (
              <>
                <span className="sd-empty__icon">👤</span>
                <p className="sd-empty__title">No patients yet</p>
                <p className="sd-empty__sub">Click <strong>+ Add Patient</strong> to register the first patient.</p>
              </>
            ) : (
              <>
                <span className="sd-empty__icon">🔍</span>
                <p className="sd-empty__title">No results found</p>
                <p className="sd-empty__sub">No patients match <em>"{search}"</em>. Try a different search.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TodayConsultations({ onBookSlot }) {
  return (
    <div className="sd-card">
      <div className="sd-card__head">
        <div>
          <h3 className="sd-card__title">Today's Consultations</h3>
          <p className="sd-card__sub">02 April 2026</p>
        </div>
        <button className="sd-btn sd-btn--outline" onClick={onBookSlot}>+ Book Slot</button>
      </div>

      <div className="sd-consult-list">
        {CONSULTATIONS.map((c, i) => (
          <div key={i} className="sd-consult-item">
            <div className="sd-consult-time">
              <span>{c.time}</span>
            </div>
            <div className={`sd-consult-line sd-consult-line--${c.status.toLowerCase().replace(' ', '-')}`} />
            <div className="sd-consult-body">
              <div className="sd-consult-top">
                <span className="sd-consult-name">{c.patient}</span>
                <span className={`sd-badge sd-badge--consult-${c.status.toLowerCase().replace(' ', '-')}`}>
                  {c.status}
                </span>
              </div>
              <div className="sd-consult-meta">
                <span>{c.doctor}</span>
                <span className="sd-dot">·</span>
                <span>{c.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="sd-card">
      <div className="sd-card__head">
        <div>
          <h3 className="sd-card__title">Recent Activity</h3>
          <p className="sd-card__sub">Latest actions on the system</p>
        </div>
      </div>
      <div className="sd-activity-list">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="sd-activity-item">
            <span className="sd-activity-icon">{a.icon}</span>
            <div className="sd-activity-body">
              <p className="sd-activity-msg">{a.msg}</p>
              <p className="sd-activity-time">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ onAddPatient }) {
  const actions = [
    { label: 'Register New Patient', icon: '👤', color: 'blue',   onClick: onAddPatient },
    { label: 'Book Consultation',    icon: '📅', color: 'purple', onClick: undefined },
    { label: 'Record Payment',       icon: '💰', color: 'green',  onClick: undefined },
    { label: 'View Reports',         icon: '📊', color: 'amber',  onClick: undefined },
  ];

  return (
    <div className="sd-card">
      <div className="sd-card__head">
        <h3 className="sd-card__title">Quick Actions</h3>
      </div>
      <div className="sd-quick-grid">
        {actions.map(({ label, icon, color, onClick }) => (
          <button key={label} className={`sd-quick-btn sd-quick-btn--${color}`} onClick={onClick}>
            <span className="sd-quick-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────── */
export default function StaffDashboard() {
  const navigate                  = useNavigate();
  const { patients, addPatient, loading }  = usePatients();
  const [active, setActive]       = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [bookSlotOpen, setBookSlotOpen] = useState(false);
  const [bookPatient, setBookPatient]   = useState(null);

  return (
    <div className="sd-layout">
      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="sd-main">
        {/* Top bar */}
        <header className="sd-topbar">
          <div>
            <h1 className="sd-topbar__title">Staff Dashboard</h1>
            <p className="sd-topbar__date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="sd-topbar__right">
            <div className="sd-topbar__notif">
              <span>🔔</span>
              <span className="sd-notif-dot" />
            </div>
            <div className="sd-topbar__avatar">S</div>
          </div>
        </header>

        {/* Content */}
        <div className="sd-content">
          {/* Stats row */}
          <div className="sd-stats-row">
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Quick actions */}
          <QuickActions onAddPatient={() => setModalOpen(true)} />

          {/* Patients table */}
          <RecentPatients patients={patients} loading={loading} search={search} setSearch={setSearch} onAddPatient={() => setModalOpen(true)} onView={(id) => navigate(`/staff/patients/${id}`)} onBookSlot={(p) => { setBookPatient(p); setBookSlotOpen(true); }} />

          {/* Bottom row */}
          <div className="sd-bottom-row">
            <TodayConsultations onBookSlot={() => setBookSlotOpen(true)} />
            <RecentActivity />
          </div>
        </div>
      </div>

      <AddPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (data) => {
          const result = await addPatient({ ...data, dietStatus: 'Pending', consultStatus: 'Pending', status: 'Pending', paymentStatus: 'Pending' });
          if (result?.success) setModalOpen(false);
          return result;
        }}
      />
      <BookSlotModal open={bookSlotOpen} patient={bookPatient} onClose={() => { setBookSlotOpen(false); setBookPatient(null); }} />
    </div>
  );
}
