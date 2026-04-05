import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './StaffLogin.css';

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function validate(email, password) {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  return errors;
}

export default function DoctorLogin() {
  const navigate                 = useNavigate();
  const [form, setForm]          = useState({ email: '', password: '' });
  const [errors, setErrors]      = useState({});
  const [showPassword, setShow]  = useState(false);
  const [serverError, setServer] = useState('');
  const [loading, setLoading]    = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServer('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validate(form.email, form.password);
    if (Object.keys(validation).length) { setErrors(validation); return; }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setLoading(false);
      setServer(authError.message || 'Invalid email or password. Please try again.');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setServer('Account not set up correctly. Please contact your administrator.');
      await supabase.auth.signOut();
      return;
    }

    if (profile.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      setServer('This portal is for doctors only. Please use the correct login page.');
      await supabase.auth.signOut();
    }
  }

  return (
    <div className="sl-page">
      {/* Left decorative panel */}
      <div className="sl-panel sl-panel--doctor">
        <div className="sl-panel__content">
          <div className="sl-panel__logo">
            <span className="sl-panel__logo-for">FOR</span>
            <span className="sl-panel__logo-her">HER</span>
            <span className="sl-panel__logo-well">WELLBEING</span>
          </div>
          <h2 className="sl-panel__headline">Doctor Portal</h2>
          <p className="sl-panel__sub">
            Access patient records, manage diet plans, and coordinate care — all in one place.
          </p>
          <ul className="sl-panel__features">
            {[
              'View and manage patient profiles',
              'Generate personalised diet plans',
              'Track consultation history',
              'Monitor patient progress',
            ].map(f => (
              <li key={f}>
                <span className="sl-panel__check">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="sl-panel__circles">
          <span className="sl-pc sl-pc--1" />
          <span className="sl-pc sl-pc--2" />
          <span className="sl-pc sl-pc--3" />
        </div>
      </div>

      {/* Right login card */}
      <div className="sl-right">
        <div className="sl-card">
          <div className="sl-card__icon">
            <LockIcon />
          </div>

          <div className="sl-card__header">
            <h1 className="sl-card__title">Doctor Sign In</h1>
            <p className="sl-card__sub">Enter your credentials to access the doctor portal</p>
          </div>

          {serverError && (
            <div className="sl-alert" role="alert">
              <span className="sl-alert__icon">&#9888;</span>
              {serverError}
            </div>
          )}

          <form className="sl-form" onSubmit={handleSubmit} noValidate>
            <div className={`sl-field ${errors.email ? 'sl-field--error' : ''}`}>
              <label className="sl-label" htmlFor="email">Email Address</label>
              <div className="sl-input-wrap">
                <span className="sl-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email" name="email" type="email" className="sl-input"
                  placeholder="doctor@forherwellbeing.com"
                  value={form.email} onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="sl-error" role="alert">{errors.email}</p>}
            </div>

            <div className={`sl-field ${errors.password ? 'sl-field--error' : ''}`}>
              <div className="sl-label-row">
                <label className="sl-label" htmlFor="password">Password</label>
                <button type="button" className="sl-forgot">Forgot password?</button>
              </div>
              <div className="sl-input-wrap">
                <span className="sl-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="sl-input" placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="sl-eye"
                  onClick={() => setShow(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && <p className="sl-error" role="alert">{errors.password}</p>}
            </div>

            <button type="submit" className="sl-submit" disabled={loading}>
              {loading ? <span className="sl-spinner" /> : 'Sign In to Portal'}
            </button>
          </form>

          <p className="sl-card__footer">
            This portal is restricted to authorised doctors only.<br />
            Unauthorised access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
