import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientsContext';
import { supabase } from '../lib/supabaseClient';
import './DoctorDashboard.css';

/* ─── Logged-in doctor (swap when auth is added) ─────── */
const CURRENT_DOCTOR = 'Dr. Raga Deepthi';

/* ─── Nav items ──────────────────────────────────────── */
const NAV_ITEMS = [
  { key: 'patients',  label: 'My Patients',   icon: '👥' },
  { key: 'diet',      label: 'Diet Plans',     icon: '🥗' },
  { key: 'reports',   label: 'Reports',        icon: '📊' },
];

/* ─── Status badge ───────────────────────────────────── */
function Badge({ value }) {
  const styles = {
    scheduled:    'dd-badge--scheduled',
    completed:    'dd-badge--completed',
    pending:      'dd-badge--pending',
    cancelled:    'dd-badge--cancelled',
    upcoming:     'dd-badge--upcoming',
  };
  const cls = styles[value?.toLowerCase()] || 'dd-badge--default';
  return <span className={`dd-badge ${cls}`}>{value || '—'}</span>;
}

/* ─── Diet status badge ──────────────────────────────── */
function DietBadge({ value }) {
  const styles = {
    pending: 'dd-diet-badge--pending',
    ready:   'dd-diet-badge--ready',
    sent:    'dd-diet-badge--sent',
  };
  const cls = styles[value?.toLowerCase()] || 'dd-diet-badge--pending';
  const icons = { pending: '⏳', ready: '✅', sent: '📤' };
  const label = value || 'Pending';
  return (
    <span className={`dd-diet-badge ${cls}`}>
      {icons[label.toLowerCase()] || '⏳'} {label}
    </span>
  );
}

/* ─── Sidebar ────────────────────────────────────────── */
function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside className={`dd-sidebar ${collapsed ? 'dd-sidebar--collapsed' : ''}`}>
      <div className="dd-sidebar__top">
        <div className="dd-sidebar__brand">
          {!collapsed && (
            <div className="dd-sidebar__logo">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>FOR</span>
              <span style={{ color: '#fff' }}>HER</span>
              <span style={{ color: '#93c5fd' }}>WELLBEING</span>
            </div>
          )}
          <button
            className="dd-sidebar__collapse"
            onClick={() => setCollapsed(c => !c)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="dd-nav">
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`dd-nav__item ${active === key ? 'dd-nav__item--active' : ''}`}
              onClick={() => setActive(key)}
              title={collapsed ? label : undefined}
            >
              <span className="dd-nav__icon">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="dd-sidebar__bottom">
        <div className={`dd-sidebar__doctor ${collapsed ? 'dd-sidebar__doctor--collapsed' : ''}`}>
          <div className="dd-sidebar__avatar">R</div>
          {!collapsed && (
            <div>
              <p className="dd-sidebar__name">{CURRENT_DOCTOR}</p>
              <p className="dd-sidebar__role">Doctor</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button className="dd-logout">⬛ Sign Out</button>
        )}
      </div>
    </aside>
  );
}

/* ─── Stat card ──────────────────────────────────────── */
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`dd-stat dd-stat--${color}`}>
      <div className="dd-stat__top">
        <span className="dd-stat__icon">{icon}</span>
        <span className="dd-stat__value">{value}</span>
      </div>
      <p className="dd-stat__label">{label}</p>
    </div>
  );
}

/* ─── Patients table ─────────────────────────────────── */
function PatientsTable({ patients, onMarkCompleted, search, setSearch }) {
  const navigate = useNavigate();
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dd-card">
      <div className="dd-card__head">
        <div>
          <h3 className="dd-card__title">My Patients</h3>
          <p className="dd-card__sub">Patients assigned to {CURRENT_DOCTOR}</p>
        </div>
        <div className="dd-search">
          <span className="dd-search__icon">🔍</span>
          <input
            className="dd-search__input"
            placeholder="Search patient or condition…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="dd-table-wrap">
        <table className="dd-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Condition</th>
              <th>Consult Date</th>
              <th>Consult Time</th>
              <th>Status</th>
              <th>Diet Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="dd-patient-cell">
                    <div className="dd-patient-avatar">{p.name.charAt(0)}</div>
                    <div>
                      <p className="dd-patient-name">{p.name}</p>
                      <p className="dd-patient-id">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td><span className="dd-condition">{p.condition}</span></td>
                <td className="dd-meta">{p.consultationDate || p.consultDate || '—'}</td>
                <td className="dd-meta">{p.consultationTime || p.consultTime || '—'}</td>
                <td><Badge value={p.consultStatus} /></td>
                <td><DietBadge value={p.dietStatus} /></td>
                <td>
                  <div className="dd-action-group">
                    {(p.consultStatus === 'Scheduled' || p.consultStatus === 'Pending') && (
                      <button className="dd-btn dd-btn--complete" onClick={() => onMarkCompleted(p.id)}>
                        ✓ Mark Completed
                      </button>
                    )}
                    <button className="dd-btn dd-btn--diet-plan" onClick={() => navigate(`/doctor/diet-plan/${p.id}`)}>
                      📋 Diet Plan
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="dd-empty">
            <p className="dd-empty__icon">🔍</p>
            <p>No patients match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────── */
export default function DoctorDashboard() {
  const navigate                      = useNavigate();
  const { patients, updatePatient }   = usePatients();
  const [active, setActive]           = useState('patients');
  const [collapsed, setCollapsed]     = useState(false);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/doctor');
    });
  }, [navigate]);

  /* Filter only patients assigned to this doctor */
  const myPatients = patients.filter(
    p => p.doctor === CURRENT_DOCTOR || p.assignedDoctor === CURRENT_DOCTOR
  );

  /* Stats derived from myPatients */
  const stats = [
    {
      label: 'Total Assigned',
      value: myPatients.length,
      icon: '👥',
      color: 'blue',
    },
    {
      label: 'Scheduled Today',
      value: myPatients.filter(p => p.consultStatus === 'Scheduled').length,
      icon: '📅',
      color: 'purple',
    },
    {
      label: 'Completed',
      value: myPatients.filter(p => p.consultStatus === 'Completed').length,
      icon: '✅',
      color: 'green',
    },
    {
      label: 'Pending',
      value: myPatients.filter(p => p.consultStatus === 'Pending').length,
      icon: '⏳',
      color: 'amber',
    },
  ];

  function handleMarkCompleted(id) {
    updatePatient(id, { consultStatus: 'Completed' });
  }

  return (
    <div className="dd-layout">
      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="dd-main">
        {/* Top bar */}
        <header className="dd-topbar">
          <div>
            <h1 className="dd-topbar__title">Doctor Dashboard</h1>
            <p className="dd-topbar__sub">Welcome back, {CURRENT_DOCTOR}</p>
          </div>
          <div className="dd-topbar__right">
            <div className="dd-topbar__notif">
              🔔
              <span className="dd-notif-dot" />
            </div>
            <div className="dd-topbar__avatar">R</div>
          </div>
        </header>

        <div className="dd-content">
          {/* Stats */}
          <div className="dd-stats-row">
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Table */}
          <PatientsTable
            patients={myPatients}
            onMarkCompleted={handleMarkCompleted}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>

    </div>
  );
}
