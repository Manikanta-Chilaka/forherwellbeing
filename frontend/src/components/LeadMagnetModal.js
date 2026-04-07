import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './LeadMagnetModal.css';

const EDGE_URL = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-lead-guide`;

export default function LeadMagnetModal({ resource, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.target;
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();

    try {
      // 1. Save lead to Supabase
      const { error: dbError } = await supabase.from('leads').insert({
        name,
        email,
        phone,
        guide_id: resource.id,
        guide_title: resource.title,
      });
      if (dbError) throw new Error(dbError.message);

      // 2. Trigger edge function to send the guide email
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name, email, phone, guideId: resource.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lm-overlay" onClick={onClose}>
      <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lm-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="lm-success">
            <div className="lm-success__icon">
              <CheckCircle size={36} strokeWidth={1.5} />
            </div>
            <h3 className="lm-success__title">Check your inbox!</h3>
            <p className="lm-success__body">
              Your <strong>{resource.title}</strong> is on its way to your email.
              It should arrive within a few minutes.
            </p>
            <button className="btn btn--primary lm-success__close" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="lm-header">
              <div className="lm-header__icon" style={{ background: resource.iconBg }}>
                {resource.icon}
              </div>
              <div>
                <p className="lm-header__label">Free Download</p>
                <h3 className="lm-header__title">{resource.title}</h3>
                <p className="lm-header__desc">{resource.desc}</p>
              </div>
            </div>

            <form className="lm-form" onSubmit={handleSubmit}>
              <div className="lm-field">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="lm-field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="lm-field">
                <label>Phone Number</label>
                <input name="phone" type="tel" placeholder="+91 00000 00000" required />
              </div>
              <div className="lm-consent">
                <label className="lm-consent__label">
                  <input type="checkbox" required />
                  <span>
                    I agree to the <Link to="/privacy" onClick={onClose}>Privacy Policy</Link> and
                    consent to receiving health guidance from For Her Wellbeing.
                  </span>
                </label>
              </div>

              {error && <p className="lm-error">{error}</p>}

              <button type="submit" className="btn btn--primary lm-submit" disabled={loading}>
                {loading ? <><Loader size={15} className="lm-spinner" /> Sending…</> : 'Send Me the Free Guide'}
              </button>
              <p className="lm-trust">No spam. Unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
