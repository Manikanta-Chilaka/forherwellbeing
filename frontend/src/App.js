import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientsProvider } from './context/PatientsContext';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import PatientDetail from './pages/PatientDetail';
import DoctorDashboard from './pages/DoctorDashboard';
import CreateDietPlan from './pages/CreateDietPlan';
import DietView from './pages/DietView';

// ── Supabase connection test (remove after confirming) ──
supabase.from('patients').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) console.error('❌ Supabase connection failed:', error.message);
    else console.log(`✅ Supabase connected. Patients table row count: ${count}`);
  });

function App() {
  return (
    <PatientsProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <HomePage />
              </main>
            </>
          }
        />
        <Route path="/staff" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/patients/:id" element={<PatientDetail />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/diet-plan/:id" element={<CreateDietPlan />} />
        <Route path="/staff/patients/:id/diet" element={<DietView />} />
      </Routes>
    </BrowserRouter>
    </PatientsProvider>
  );
}

export default App;
