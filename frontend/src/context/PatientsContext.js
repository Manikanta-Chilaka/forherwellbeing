import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const PatientsContext = createContext(null);

/* ── Map Supabase row → frontend field names ─────────── */
function fromDb(row) {
  if (!row) return null;
  return {
    id:                 row.id,
    name:               row.name,
    email:              row.email,
    phone:              row.phone,
    age:                row.age,
    height:             row.height,
    weight:             row.weight,
    city:               row.city,
    gender:             row.gender,

    condition:          row.condition,
    medications:        row.medications,
    allergies:          row.allergies,
    menstrual:          row.menstrual,

    sleep:              row.sleep,
    stress:             row.stress,
    activity:           row.activity,
    workType:           row.work_type,

    dietType:           row.diet_type,
    foodDislikes:       row.food_dislikes,
    mealTiming:         row.meal_timing,
    budget:             row.budget,

    doctor:             row.assigned_doctor,
    assignedDoctor:     row.assigned_doctor,
    consultationDate:   row.consultation_date,
    consultationTime:   row.consultation_time,
    consultStatus:      row.consultation_status,
    consultationStatus: row.consultation_status,
    notes:              row.consult_notes,

    dietPlan:           row.diet_plan,
    dietStatus:         row.diet_status,

    paymentStatus:      row.payment_status,
    paymentMode:        row.payment_mode,
    amountPaid:         row.amount_paid,

    status:             row.patient_status,
    createdDate:        row.created_at
      ? new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—',

    reports:            row.reports || [],
    consultHistory:     [],   // loaded separately if needed
  };
}

/* ── Map frontend fields → Supabase column names ─────── */
function toDb(fields) {
  const map = {
    name:               'name',
    email:              'email',
    phone:              'phone',
    age:                'age',
    height:             'height',
    weight:             'weight',
    city:               'city',
    gender:             'gender',

    condition:          'condition',
    medications:        'medications',
    allergies:          'allergies',
    menstrual:          'menstrual',

    sleep:              'sleep',
    stress:             'stress',
    activity:           'activity',
    workType:           'work_type',

    dietType:           'diet_type',
    foodDislikes:       'food_dislikes',
    mealTiming:         'meal_timing',
    budget:             'budget',

    assignedDoctor:     'assigned_doctor',
    doctor:             'assigned_doctor',
    consultationDate:   'consultation_date',
    consultationTime:   'consultation_time',
    consultStatus:      'consultation_status',
    consultationStatus: 'consultation_status',
    notes:              'consult_notes',

    dietPlan:           'diet_plan',
    dietStatus:         'diet_status',

    paymentStatus:      'payment_status',
    paymentMode:        'payment_mode',
    amountPaid:         'amount_paid',

    status:             'patient_status',
    reports:            'reports',
  };

  const dbFields = {};
  for (const [key, value] of Object.entries(fields)) {
    if (map[key]) dbFields[map[key]] = value;
  }
  return dbFields;
}

/* ── Provider ────────────────────────────────────────── */
export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  /* ── Fetch all patients on mount ── */
  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      console.error('fetchPatients error:', err.message);
      setError(err.message);
    } else {
      setPatients((data || []).map(fromDb));
    }

    setLoading(false);
  }

  /* ── Update a patient (optimistic + DB sync) ── */
  async function updatePatient(id, updatedFields) {
    // Optimistic update — UI responds instantly
    setPatients(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedFields } : p)
    );

    // Persist to Supabase
    const dbFields = toDb(updatedFields);
    if (Object.keys(dbFields).length === 0) return;

    const { error: err } = await supabase
      .from('patients')
      .update(dbFields)
      .eq('id', id);

    if (err) {
      console.error('updatePatient error:', err.message);
      fetchPatients(); // roll back optimistic update
      return { success: false, error: err.message };
    }
    return { success: true };
  }

  /* ── Add a new patient with report uploads ── */
  async function addPatient(newPatient) {
    const uploadedReports = [];

    // 1. Upload reports to Supabase Storage if any
    if (newPatient.reports && newPatient.reports.length > 0) {
      for (const file of newPatient.reports) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `patient-reports/${fileName}`;

        const { data, error: uploadErr } = await supabase.storage
          .from('reports')
          .upload(filePath, file);

        if (uploadErr) {
          console.error('File upload error:', uploadErr.message);
          // We can decide to continue or fail. Let's fail for now to ensure data integrity.
          return { success: false, error: `Failed to upload ${file.name}: ${uploadErr.message}` };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('reports')
          .getPublicUrl(filePath);

        uploadedReports.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        });
      }
    }

    // 2. Prepare DB fields
    const dbFields = toDb({
      ...newPatient,
      reports:       uploadedReports,
      dietStatus:    'Pending',
      consultStatus: 'Pending',
      status:        'Pending',
      paymentStatus: 'Pending',
    });

    // 3. Insert into DB
    const { data, error: err } = await supabase
      .from('patients')
      .insert(dbFields)
      .select()
      .single();

    if (err) {
      console.error('addPatient error:', err.message);
      return { success: false, error: err.message };
    }

    setPatients(prev => [fromDb(data), ...prev]);
    return { success: true };
  }

  /* ── Archive a patient (safer than delete) ── */
  async function archivePatient(id) {
    return updatePatient(id, { status: 'Inactive' });
  }

  return (
    <PatientsContext.Provider value={{ patients, loading, error, updatePatient, addPatient, archivePatient, fetchPatients }}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error('usePatients must be used inside PatientsProvider');
  return ctx;
}
