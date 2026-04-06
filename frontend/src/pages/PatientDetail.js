import { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePatients } from '../context/PatientsContext';
import { supabase } from '../lib/supabaseClient';
import EditPatientModal from '../components/EditPatientModal';
import {
  FileText,
  ExternalLink,
  Download,
  Trash2,
  UploadCloud,
  LayoutDashboard,
  Stethoscope,
  Leaf,
  Utensils,
  Calendar,
  FolderOpen,
  ClipboardList,
  User,
  Moon,
  Brain,
  Activity,
  Briefcase,
  Search
} from 'lucide-react';
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
  { key: 'overview',     label: 'Overview',      icon: <LayoutDashboard size={18} /> },
  { key: 'medical',      label: 'Medical Info',  icon: <Stethoscope size={18} /> },
  { key: 'lifestyle',    label: 'Lifestyle',     icon: <Leaf size={18} /> },
  { key: 'food',         label: 'Food Habits',   icon: <Utensils size={18} /> },
  { key: 'consultation', label: 'Consultation',  icon: <Calendar size={18} /> },
  { key: 'reports',      label: 'Reports',        icon: <FolderOpen size={18} /> },
];

/* ─── Tab: Overview ──────────────────────────────────────── */
function OverviewTab({ p }) {
  return (
    <div className="pd-tab-content">
      <div className="pd-overview-grid">
        <Card title="Personal Details" icon={<User size={16} />}>
          <InfoRow label="Full Name"    value={p.name} />
          <InfoRow label="Phone"        value={p.phone} />
          <InfoRow label="Age"          value={`${p.age} years`} />
          <InfoRow label="City"         value={p.city} />
          <InfoRow label="Height"       value={p.height} />
          <InfoRow label="Weight"       value={p.weight} />
        </Card>

        <Card title="Health Summary" icon={<Stethoscope size={16} />}>
          <InfoRow label="Primary Condition"   value={p.condition} />
          <InfoRow label="Patient Status"      value={p.status}        badge />
          <InfoRow label="Payment Status"      value={p.paymentStatus} badge />
          <InfoRow label="Consultation Status" value={p.consultStatus} badge />
          <InfoRow label="Assigned Doctor"     value={p.doctor} />
          <InfoRow label="Registered"          value={p.createdDate} />
        </Card>
      </div>

      {p.notes && (
        <Card title="Doctor Notes" icon={<FileText size={16} />}>
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
      <Card title="Medical Information" icon={<Stethoscope size={16} />}>
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
    { label: 'Sleep',          value: p.sleep,    icon: <Moon size={20} /> },
    { label: 'Stress Level',   value: p.stress,   icon: <Brain size={20} /> },
    { label: 'Activity Level', value: p.activity, icon: <Activity size={20} /> },
    { label: 'Work Type',      value: p.workType, icon: <Briefcase size={20} /> },
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
      <Card title="Food Habits" icon={<Utensils size={16} />}>
        <InfoRow label="Diet Type"             value={p.dietType} />
        <InfoRow label="Meal Timing"           value={p.mealTiming} />
        <InfoRow label="Food Dislikes"         value={p.foodDislikes} />
        <InfoRow label="Weekly Food Budget"    value={p.budget} />
      </Card>
    </div>
  );
}

/* ─── Tab: Reports ───────────────────────────────────────── */
function ReportsTab({ p, updatePatient }) {
  const [deleting, setDeleting]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef              = useRef(null);
  const reports = p.reports || [];

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async (index) => {
    if (!window.confirm(`Delete "${reports[index].name}"? This cannot be undone.`)) return;
    setDeleting(index);
    const updated = reports.filter((_, i) => i !== index);
    await updatePatient(p.id, { reports: updated });
    setDeleting(null);
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUploaded = [];
    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `patient-reports/${fileName}`;
      const { error: uploadErr } = await supabase.storage.from('reports').upload(filePath, file);
      if (!uploadErr) {
        const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(filePath);
        newUploaded.push({ name: file.name, url: publicUrl, size: file.size, type: file.type, uploadedAt: new Date().toISOString() });
      }
    }
    if (newUploaded.length > 0) {
      await updatePatient(p.id, { reports: [...reports, ...newUploaded] });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="pd-tab-content">
      <div className="pd-card">
        {/* Card Header with Upload Button */}
        <div className="pd-card__head pd-reports-head">
          <span className="pd-card__icon"><FolderOpen size={18} /></span>
          <h4 className="pd-card__title">Medical Reports & Attachments</h4>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            hidden
            onChange={e => handleUpload(e.target.files)}
          />
          <button
            className="pd-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Upload new report"
          >
            {uploading
              ? <><span className="pd-report-spinner" style={{ borderTopColor: '#fff' }} /> Uploading...</>
              : <><UploadCloud size={15} /> Upload Report</>
            }
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="pd-empty-reports">
            <FileText size={48} />
            <p>No reports uploaded yet. Click <strong>Upload Report</strong> to add files.</p>
          </div>
        ) : (
          <div className="pd-reports-grid">
            {reports.map((report, i) => (
              <div key={i} className="pd-report-card">
                <div className="pd-report-icon">
                  <FileText size={24} />
                </div>
                <div className="pd-report-info">
                  <p className="pd-report-name" title={report.name}>{report.name}</p>
                  <p className="pd-report-meta">
                    {formatSize(report.size)} • {new Date(report.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="pd-report-actions">
                  <a 
                    href={report.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="pd-report-btn"
                    title="View Report"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <a 
                    href={report.url} 
                    download={report.name} 
                    className="pd-report-btn pd-report-btn--download"
                    title="Download"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    className="pd-report-btn pd-report-btn--delete"
                    title="Delete Report"
                    onClick={() => handleDelete(i)}
                    disabled={deleting === i}
                  >
                    {deleting === i
                      ? <span className="pd-report-spinner" />
                      : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Consultation ──────────────────────────────────── */
function ConsultationTab({ p }) {
  return (
    <div className="pd-tab-content">
      <Card title="Current Consultation" icon={<Calendar size={18} />}>
        <InfoRow label="Status"          value={p.consultStatus} badge />
        <InfoRow label="Assigned Doctor" value={p.doctor} />
        <InfoRow label="Date"            value={p.consultDate} />
        <InfoRow label="Payment"         value={p.paymentStatus} badge />
        <InfoRow label="Amount Paid"     value={p.amountPaid} />
        <InfoRow label="Payment Mode"    value={p.paymentMode} />
      </Card>

      {p.consultHistory?.length > 0 && (
        <Card title="Consultation History" icon={<ClipboardList size={18} />}>
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
  const location            = useLocation();
  const isDoctor            = location.pathname.startsWith('/doctor');
  const basePath            = isDoctor ? '/doctor' : '/staff';

  const { patients, updatePatient } = usePatients();
  const [tab, setTab]       = useState('overview');
  const [editOpen, setEditOpen] = useState(false);

  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="pd-not-found">
        <Search size={48} className="pd-not-found__emoji" />
        <h2>Patient not found</h2>
        <p>No patient with ID <strong>{id}</strong> exists.</p>
        <button className="pd-btn pd-btn--primary" onClick={() => navigate(`${basePath}/dashboard`)}>
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
      case 'reports':      return <ReportsTab        p={patient} updatePatient={updatePatient} />;
      default:             return null;
    }
  };

  return (
    <div className="pd-page">

      {/* ── Top bar ── */}
      <header className="pd-topbar">
        <button className="pd-back" onClick={() => navigate(`${basePath}/dashboard`)}>
          ← Back to Patients
        </button>
        <div className="pd-topbar__right">
          <button
            className="pd-btn pd-btn--diet"
            onClick={() => navigate(`${basePath}/patients/${patient.id}/diet`)}
          >
            View Diet Plan
          </button>
          <button className="pd-btn pd-btn--outline" onClick={() => setEditOpen(true)}>Edit Patient</button>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="pd-header">
        <div className="pd-header__avatar">{patient.name.charAt(0)}</div>
        <div className="pd-header__info">
          <h1 className="pd-header__name">{patient.name}</h1>
          <div className="pd-header__meta">
            <span>{patient.phone}</span>
            <span className="pd-dot">·</span>
            <span>{patient.age} yrs</span>
            <span className="pd-dot">·</span>
            <span>{patient.condition}</span>
            <span className="pd-dot">·</span>
            <span>{patient.city}</span>
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
