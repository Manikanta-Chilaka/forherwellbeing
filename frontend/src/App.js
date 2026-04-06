import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientsProvider } from './context/PatientsContext';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import StaffLogin from './pages/StaffLogin';
import DoctorLogin from './pages/DoctorLogin';
import StaffDashboard from './pages/StaffDashboard';
import PatientDetail from './pages/PatientDetail';
import DoctorDashboard from './pages/DoctorDashboard';
import CreateDietPlan from './pages/CreateDietPlan';
import DietView from './pages/DietView';

supabase.from('patients').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) console.error('Supabase connection failed:', error.message);
    else console.log(`Supabase connected. Patients table row count: ${count}`);
  });

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <PatientsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about"    element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/contact"  element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/staff"                    element={<StaffLogin />} />
          <Route path="/doctor"                   element={<DoctorLogin />} />
          <Route path="/staff/dashboard"          element={<StaffDashboard />} />
          <Route path="/staff/patients/:id"       element={<PatientDetail />} />
          <Route path="/staff/patients/:id/diet"  element={<DietView />} />
          <Route path="/doctor/dashboard"         element={<DoctorDashboard />} />
          <Route path="/doctor/patients/:id"      element={<PatientDetail />} />
          <Route path="/doctor/patients/:id/diet" element={<DietView />} />
          <Route path="/doctor/diet-plan/:id"     element={<CreateDietPlan />} />
        </Routes>
      </BrowserRouter>
    </PatientsProvider>
  );
}

export default App;
